// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js@2.116.0/edge-runtime.d.ts";
import { withSupabase } from "jsr:@supabase/server@1.5.3";
import { createClient } from "jsr:@supabase/supabase-js@2.116.0";
import Printify from "npm:printify-sdk-js@1.4.0";
import Replicate from "npm:replicate@1.4.0";
import { Resend } from "npm:resend@6.26.0";
import { S3Client } from "npm:@aws-sdk/client-s3@3.1127.0";
import { Upload } from "npm:@aws-sdk/lib-storage@3.1127.0";

interface ReqPayload {
  orderId: string;
}

const SUPABASE_SECRET_KEYS = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS")!);

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  SUPABASE_SECRET_KEYS["default"]
)

const variants = {
  Small: {id: 80696, scale: 1.038}, // 1.037299339
  Medium: {id: 80698, scale: 1},
  Large: {id: 80709, scale: 1.06}, // 1.059771033
  XL: {id: 80722, scale: 1},
}

export default {
  fetch: withSupabase({ auth: ["secret"] }, async (req, ctx) => {
    const { orderId }: ReqPayload = await req.json();

    const { data, error } = await supabase
        .from("orders")
        .select("id, order_number, name, email, city, country, line1, line2, postal_code, state, size, total_price, product_name, generations(id, path, is_upscaled)")
        .eq("id", orderId)
        .single();

    if (error) {
      console.error("🚨 Error creating order:", error);
      return new Response(
        JSON.stringify({ error: "Failed to create order." }),
        {
          status: 500,
        },
      );
    }

    EdgeRuntime.waitUntil(processOrder(orderId, data.order_number, data.generations.id, data.generations.path, data.generations.is_upscaled, data.name, data.email, data.city, data.country, data.line1, data.line2, data.postal_code, data.state, data.size, data.total_price / 100, data.product_name));
    return new Response(null, { status: 202 });
  }),
};

async function processOrder(orderId: string, orderNumber: number, generationId: string, generationPath: string, isUpscaled: boolean, name: string, email: string, city: string, country: string, line1: string, line2: string | undefined, postalCode: string, state: string, size: string, total: number, productName: string) {
  try {
    // 1. send order confirmation email
    const generationUrl = supabase.storage
        .from("generations")
        .getPublicUrl(generationPath).data.publicUrl;
    const orderConfirmationEmailResponse = await sendOrderConfirmationEmail(email, orderNumber, productName, name, generationUrl, total);
    console.log("Order confirmation email response:", orderConfirmationEmailResponse);

    // 2. upscale
    if (!isUpscaled) {
      await upscaleUrl(generationUrl, generationPath)
      await supabase
          .from("generations")
          .update({is_upscaled: true})
          .eq("id", generationId);
    }

    const upscaledGenerationUrl = supabase.storage
        .from("upscaled-generations")
        .getPublicUrl(generationPath).data.publicUrl;

    // 3. submit printify order
    if (size !== "Digital") {
      const printifyId = await submitPrintifyOrder(orderId, upscaledGenerationUrl, name, email, city, country, line1, line2, postalCode, state, size);
      await supabase
        .from("orders")
        .update({printify_id: printifyId})
        .eq("id", orderId);
    }

    // 4. send digital email
    const digitalDownloadEmailResponse = await sendDigitalDownloadEmail(email, orderNumber, name, upscaledGenerationUrl, generationUrl);
    console.log("Digital download email response:", digitalDownloadEmailResponse);

    // 5. mark order as completed
    await supabase
        .from("orders")
        .update({status: "submitted"})
        .eq("id", orderId);
    console.log("✅ Successful order.");
  } catch (e) {
    console.log("🚨 ERROR:");
    console.log(e);
  }
}

async function sendOrderConfirmationEmail(email: string, orderNumber: number, item: string, name: string, previewUrl: string, price: number) {
  const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);

  const nameParts = name.trim().split(/\s+/);
  const firstName = nameParts.shift() || "";

  return runWithRetry(
    () =>
      resend.emails.send({
      from: 'Turn Royal <hello@turnroyal.com>',
      to: email,
      bcc: 'adam.dorogi@gmail.com',
      template: {
        id: 'order-confirmation',
        variables: {
          ITEM: item,
          PRICE: price,
          NAME: firstName,
          PREVIEW_URL: previewUrl,
          ORDER_NUMBER: orderNumber
        },
      },
    }),
    "Sending order confirmation email..."
  );
}

async function sendDigitalDownloadEmail(email: string, orderNumber: number, name: string, downloadUrl: string, previewUrl: string) {
  const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);

  const nameParts = name.trim().split(/\s+/);
  const firstName = nameParts.shift() || "";

  return runWithRetry(
    () =>
    resend.emails.send({
    from: 'Turn Royal <hello@turnroyal.com>',
    to: email,
    template: {
      id: 'digital-download',
      variables: {
        NAME: firstName,
        DOWNLOAD_URL: downloadUrl,
        ORDER_NUMBER: orderNumber,
        PREVIEW_URL: previewUrl,
      },
    },
  }),
    "Sending digital download email..."
  );
}

async function upscaleUrl(url: string, path: string) {
  const replicate = new Replicate({
    auth: Deno.env.get("REPLICATE_API_TOKEN")!,
    useFileOutput: false,
  });

  // 1. First upscale
  const input1 = {
    image: url,
    enhance_model: "Standard V2",
    output_format: "jpg",
    upscale_factor: "6x",
    face_enhancement: false,
    subject_detection: "None",
    face_enhancement_strength: 0.8,
    face_enhancement_creativity: 0.5
  };

  const output1 = await runWithRetry(
    () =>
      replicate.run("topazlabs/image-upscale", {
        input: input1,
      }),
    "Creating first (6x) upscale"
  );

  // 2. Second upscale
  const input2 = {
      image: output1,
      enhance_model: "Standard V2",
      output_format: "jpg",
      upscale_factor: "2x",
      face_enhancement: false,
      subject_detection: "None",
      face_enhancement_strength: 0.8,
      face_enhancement_creativity: 0.5
    };

  const output2 = await runWithRetry(
    () =>
      replicate.run("topazlabs/image-upscale", {
        input: input2,
      }),
    "Creating second (2x) upscale"
  ) as string;

  // 3. Download file
  const src = await fetch(output2, {
    headers: { Authorization: `Bearer ${Deno.env.get("REPLICATE_API_TOKEN")!}` },
  });
  if (!src.ok || !src.body) {
    throw new Error(`Download failed: ${src.status} ${src.statusText}`);
  }

  // 4. Save to bucket
  const s3 = new S3Client({
    region: Deno.env.get("S3_REGION")!,
    endpoint: Deno.env.get("S3_ENDPOINT")!,
    credentials: {
      accessKeyId: Deno.env.get("S3_ACCESS_KEY_ID")!,
      secretAccessKey: Deno.env.get("S3_SECRET_ACCESS_KEY")!,
    },
    forcePathStyle: true,
  });

  const upload = new Upload({
    client: s3,
    params: {
      Bucket: "upscaled-generations",
      Key: path,
      Body: src.body,
      ContentType: src.headers.get("content-type") ?? "image/jpeg",
      CacheControl: "public, max-age=31536000, immutable",
    },
    partSize: 8 * 1024 * 1024,
    queueSize: 2,
    leavePartsOnError: false,
  });

  await upload.done();
}

async function submitPrintifyOrder(orderId: string, generationUrl: string, name: string, email: string, city: string, country: string, line1: string, line2: string | undefined, postalCode: string, state: string, size: string) {
  const nameParts = name.trim().split(/\s+/);
  const firstName = nameParts.shift() || "";
  const lastName = nameParts.join(" ");

  const printify = new Printify({
    accessToken: Deno.env.get("PRINTIFY_API_TOKEN"),
    shopId: '29761765',
    timeout: 10 * 60 * 1000 // 10 mins
  });

  const data = {
    external_id: orderId,
    line_items: [
      {
        print_provider_id: 66,
        blueprint_id: 1061,
        variant_id: variants[size].id,
        print_areas: {
          front: [
            {
              src: generationUrl,
              scale: variants[size].scale,
              y: 0.5,
              x: 0.5,
              angle: 0
            }
          ],
        },
        print_details: {
          print_on_side: "regular"
        },
        quantity: 1,
      },
    ],
    shipping_method: 1,
    is_printify_express: false,
    is_economy_shipping: false,
    send_shipping_notification: false,
    address_to: {
      first_name: firstName,
      last_name: lastName,
      email: email,
      // phone: '0574 69 21 90',
      country: country,
      region: state,
      address1: line1,
      address2: line2,
      city: city,
      zip: postalCode,
    },
  };
  const result = await runWithRetry(
    () =>
      printify.orders.submit(data),
    "Submitting Printify order..."
  ) as any;

  console.log(result);
  
  return result.id;
}

async function runWithRetry<T>(
  fn: () => Promise<T>,
  description: string,
  maxRetries = 3
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`${description} (attempt ${attempt}/${maxRetries})...`);
      return await fn();
    } catch (error) {
      console.error(
        `${description} failed on attempt ${attempt}:`,
        error
      );

      if (attempt === maxRetries) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}
