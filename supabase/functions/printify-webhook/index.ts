// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js@2.116.0/edge-runtime.d.ts";
import { withSupabase } from "jsr:@supabase/server@1.5.3";
import { createClient } from "jsr:@supabase/supabase-js@2.116.0";
import { Resend } from "npm:resend@6.26.0";

console.info("server started");

const SUPABASE_SECRET_KEYS = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS")!);

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  SUPABASE_SECRET_KEYS["default"]
)

export default {
  fetch: withSupabase({ auth: ["none"] }, async (req, ctx) => {
    const requestJson = await req.json();

    console.log(JSON.stringify(requestJson));

    // requestJson.resource.id = "6aa026aee23c87dd2d01a9de";

    if (requestJson.type === "order:sent-to-production") {
      /*
      {
        "id": "653b6be8-2ff7-4ab5-a7a6-6889a8b3bbf5",
        "type": "order:sent-to-production",
        "created_at": "2022-05-17 15:00:00+00:00",
        "resource": {
          "id": "5a96f649b2439217d070f507",
          "type": "order",
          "data": {
            "shop_id": 815256
          }
        }
      }
      */
      const { orderNumber, firstName, email, item, previewUrl } = (await getOrderDetails(requestJson.resource.id)) ?? {};
      if (orderNumber) {
        const res = await sendSentToProductionEmail(orderNumber, firstName, email, item, previewUrl);
        console.log(res);
      }
    }

    if (requestJson.type === "order:shipment:created") {
      /*
      {
        "id": "653b6be8-2ff7-4ab5-a7a6-6889a8b3bbf5",
        "type": "order:shipment:created",
        "created_at": "2022-05-17 15:00:00+00:00",
        "resource": {
          "id": "5a96f649b2439217d070f507",
          "type": "order",
          "data": {
            "shop_id": 815256,
            "shipped_at": "2022-05-17 15:00:00+00:00",
            "carrier": {
              "code": "USPS",
              "tracking_number": "9400110200828911663274",
              "tracking_url": "https://example.com/track/9400110200828911663274"
            },
            "skus": [
              "6202"
            ]
          }
        }
      }
      */
      const { orderNumber, firstName, email, item, previewUrl } = (await getOrderDetails(requestJson.resource.id)) ?? {};
      if (orderNumber) {
        const { code: carrier, tracking_number: trackingNumber, tracking_url: trackingUrl } = requestJson.resource.data.carrier;
        const res = await sendShipmentCreatedEmail(orderNumber, firstName, email, item, previewUrl, carrier, trackingNumber, trackingUrl);
        console.log(res);
      }
    }

    if (requestJson.type === "order:shipment:delivered") {
      /*
      {
        "id": "653b6be8-2ff7-4ab5-a7a6-6889a8b3bbf5",
        "type": "order:shipment:delivered",
        "created_at": "2022-05-17 15:00:00+00:00",
        "resource": {
          "id": "5a96f649b2439217d070f507",
          "type": "order",
          "data": {
            "shop_id": 815256,
            "delivered_at": "2022-05-17 15:00:00+00:00",
            "carrier": {
              "code": "USPS",
              "tracking_number": "9400110200828911663274",
              "tracking_url": "https://example.com/track/9400110200828911663274"
            },
            "skus": [
              "6202"
            ]
          }
        }
      }
      */
      const { orderNumber, firstName, email, item, previewUrl } = (await getOrderDetails(requestJson.resource.id)) ?? {};
      if (orderNumber) {
        const { code: carrier, tracking_number: trackingNumber, tracking_url: trackingUrl } = requestJson.resource.data.carrier;
        const res = await sendShipmentDeliveredEmail(orderNumber, firstName, email, item, previewUrl, carrier, trackingNumber, trackingUrl);
        console.log(res);
      }
    }

    // return 200 OK
    return new Response(null, { status: 200 });
  }),
};

async function getOrderDetails(printifyOrderId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("order_number, name, email, product_name, generations(path)")
    .eq("printify_id", printifyOrderId)
    .maybeSingle();

  if (!data || error) {
    return undefined;
  }

  const firstName = data.name?.trim()?.split(/\s+/)[0];

  const previewUrl = supabase.storage
    .from("generations")
    .getPublicUrl(data.generations?.path ?? "")
    .data.publicUrl;

  return {
    orderNumber: data.order_number,
    firstName,
    email: data.email,
    item: data.product_name,
    previewUrl,
  };
}

async function sendSentToProductionEmail(orderNumber: number, firstName: string, email: string, item: string, previewUrl: string) {
  const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);

  return runWithRetry(
    () =>
      resend.emails.send({
      from: 'Turn Royal <hello@turnroyal.com>',
      to: email,
      template: {
        id: 'sent-to-production',
        variables: {
          ORDER_NUMBER: orderNumber,
          NAME: firstName,
          ITEM: item,
          PREVIEW_URL: previewUrl,
        },
      },
    }),
    "Sending sent to production email..."
  );
}

async function sendShipmentCreatedEmail(orderNumber: number, firstName: string, email: string, item: string, previewUrl: string, carrier: string, trackingNumber: string, trackingUrl: string) {
  const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);

  return runWithRetry(
    () =>
      resend.emails.send({
      from: 'Turn Royal <hello@turnroyal.com>',
      to: email,
      template: {
        id: 'shipment-created',
        variables: {
          ORDER_NUMBER: orderNumber,
          NAME: firstName,
          ITEM: item,
          PREVIEW_URL: previewUrl,
          CARRIER: carrier,
          TRACKING_URL: trackingUrl,
          TRACKING_NUMBER: trackingNumber,
        },
      },
    }),
    "Sending shipment created email..."
  );
}

async function sendShipmentDeliveredEmail(orderNumber: number, firstName: string, email: string, item: string, previewUrl: string, carrier: string, trackingNumber: string, trackingUrl: string) {
  const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);

  return runWithRetry(
    () =>
      resend.emails.send({
      from: 'Turn Royal <hello@turnroyal.com>',
      to: email,
      template: {
        id: 'shipment-delivered',
        variables: {
          ORDER_NUMBER: orderNumber,
          NAME: firstName,
          ITEM: item,
          PREVIEW_URL: previewUrl,
          CARRIER: carrier,
          TRACKING_URL: trackingUrl,
          TRACKING_NUMBER: trackingNumber,
        },
      },
    }),
    "Sending shipment delivered email..."
  );
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