/// <reference path="../_shared/edge-runtime.d.ts" />

import "jsr:@supabase/functions-js@2.116.0/edge-runtime.d.ts";
import { withSupabase } from "jsr:@supabase/server@1.5.3";
import { createClient } from "jsr:@supabase/supabase-js@2.116.0";
import Replicate from "npm:replicate@1.4.0";
import { S3Client } from "npm:@aws-sdk/client-s3@3.1127.0";
import { Upload } from "npm:@aws-sdk/lib-storage@3.1127.0";
import { sendOrderEmail } from "../_shared/order-emails.ts";

interface ReqPayload {
  orderId: string;
}

const SUPABASE_SECRET_KEYS = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS")!);

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  SUPABASE_SECRET_KEYS["default"]
)

// Printify 443, OPT OnDemand, vertical glossy paper.
const posterVariants = { Small: 62354, Medium: 62338, Large: 62342, XL: 62344 } as const;
// Checkouts created before the poster release can still be open in Stripe.
const legacyVariants = {
  Small: { id: 80696, scale: 1.038 },
  Medium: { id: 80698, scale: 1 },
  Large: { id: 80709, scale: 1.06 },
  XL: { id: 80722, scale: 1 },
} as const;

type PrintSize = keyof typeof posterVariants;
type Order = {
  id: string;
  order_number: number;
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
  country: string | null;
  line1: string | null;
  line2: string | null;
  postal_code: string | null;
  state: string | null;
  size: PrintSize | "Digital";
  print_format: "paper-poster" | null;
  total_price: number;
  currency: string | null;
  product_name: string | null;
  printify_id: string | null;
  status: "pending" | "submitted";
  generations: { id: string; path: string; is_upscaled: boolean };
};

export default {
  fetch: withSupabase({ auth: ["secret"] }, async (req) => {
    const { orderId }: ReqPayload = await req.json();

    const { data: order, error } = await supabase
      .from("orders")
      .select("id, order_number, name, email, phone, city, country, line1, line2, postal_code, state, size, print_format, total_price, currency, product_name, printify_id, status, generations(id, path, is_upscaled)")
      .eq("id", orderId)
      .single()
      .overrideTypes<Order, { merge: false }>();

    if (error || !order?.generations?.path) {
      console.error("Unable to load order for fulfillment:", error?.code ?? "missing artwork");
      return Response.json({ error: "Failed to load order." }, { status: 500 });
    }

    if (order.status === "submitted") return new Response(null, { status: 204 });
    EdgeRuntime.waitUntil(processOrder(order));
    return new Response(null, { status: 202 });
  }),
};

async function processOrder(order: Order) {
  const generation = order.generations;
  const generationUrl = supabase.storage.from("generations").getPublicUrl(generation.path).data.publicUrl;
  const artworkUrl = supabase.storage.from("watermarked-generations").getPublicUrl(generation.path).data.publicUrl;
  const emailOrder = { orderNumber: order.order_number, name: order.name, item: order.product_name, artworkUrl };

  try {
    await sendOrderEmail(
      order.email,
      emailOrder,
      { kind: "confirmed", amount: order.total_price, currency: order.currency },
      `order-confirmed/${order.id}`,
      "adam.dorogi@gmail.com",
    );

    if (!generation.is_upscaled) {
      await upscaleUrl(generationUrl, generation.path);
      const { error } = await supabase.from("generations").update({ is_upscaled: true }).eq("id", generation.id);
      if (error) throw new Error(`Unable to save artwork status: ${error.code}`);
    }

    const prints = supabase.storage.from("upscaled-generations");
    const artworkFile = prints.getPublicUrl(generation.path).data.publicUrl;
    const downloadUrl = prints.getPublicUrl(generation.path, { download: "gta-6-poster.jpg" }).data.publicUrl;
    if (order.size !== "Digital" && !order.printify_id) {
      const printifyId = await submitPrintifyOrder(order, order.size, artworkFile);
      const { error } = await supabase.from("orders").update({ printify_id: printifyId }).eq("id", order.id);
      if (error) throw new Error(`Unable to save the print order ID: ${error.code}`);
    }

    const downloadSent = await sendOrderEmail(
      order.email,
      emailOrder,
      { kind: "download", downloadUrl },
      `order-download/${order.id}`,
    );
    if (!downloadSent) throw new Error("The digital download email is pending.");

    const { error } = await supabase.from("orders").update({ status: "submitted" }).eq("id", order.id);
    if (error) throw new Error(`Unable to save the order status: ${error.code}`);
    console.log(`Order #${order.order_number} fulfilled.`);
  } catch (error) {
    console.error(`Unable to fulfill order #${order.order_number}:`, error);
  }
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

  const output1: unknown = await runWithRetry(
    () =>
      replicate.run("topazlabs/image-upscale", {
        input: input1,
      }),
    "Creating first (6x) upscale"
  );
  if (typeof output1 !== "string") throw new Error("The first upscale returned no image URL.");

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

  const output2: unknown = await runWithRetry(
    () =>
      replicate.run("topazlabs/image-upscale", {
        input: input2,
      }),
    "Creating second (2x) upscale"
  );
  if (typeof output2 !== "string") throw new Error("The second upscale returned no image URL.");

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

async function submitPrintifyOrder(order: Order, size: PrintSize, artworkUrl: string) {
  const [firstName, ...lastName] = order.name.trim().split(/\s+/);
  const item = order.print_format === "paper-poster"
    ? {
      print_provider_id: 30,
      blueprint_id: 443,
      variant_id: posterVariants[size],
      print_areas: { front: artworkUrl },
    }
    : {
      print_provider_id: 66,
      blueprint_id: 1061,
      variant_id: legacyVariants[size].id,
      print_areas: {
        front: [{ src: artworkUrl, scale: legacyVariants[size].scale, y: 0.5, x: 0.5, angle: 0 }],
      },
      print_details: { print_on_side: "regular" },
    };

  const shipping = {
    first_name: firstName,
    last_name: lastName.join(" "),
    email: order.email,
    phone: order.phone ?? undefined,
    country: order.country,
    region: order.state ?? "",
    address1: order.line1,
    address2: order.line2 ?? "",
    city: order.city,
    zip: order.postal_code ?? "",
  };
  const body = JSON.stringify({
    external_id: order.id,
    line_items: [{ ...item, quantity: 1 }],
    shipping_method: 1,
    send_shipping_notification: false,
    address_to: shipping,
  });

  return await runWithRetry(async () => {
    const response = await fetch("https://api.printify.com/v1/shops/29761765/orders.json", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get("PRINTIFY_API_TOKEN")}`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(60_000),
      body,
    });

    const result = await response.json();
    if (response.ok && typeof result.id === "string") return result.id;
    if (response.status === 409 && result.order?.external_id === order.id && typeof result.order.id === "string") {
      return result.order.id;
    }
    throw new Error(`Printify order submission failed (${response.status}, code ${result.code ?? "unknown"}).`);
  }, "Submitting print order");
}

async function runWithRetry<T>(
  fn: () => Promise<T>,
  description: string
): Promise<T> {
  const maxAttempts = 3;
  for (let attempt = 1; ; attempt++) {
    try {
      console.log(`${description} (attempt ${attempt}/${maxAttempts})...`);
      return await fn();
    } catch (error) {
      console.error(
        `${description} failed on attempt ${attempt}:`,
        error
      );

      if (attempt === maxAttempts) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}
