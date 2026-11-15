// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js@2.112.3/edge-runtime.d.ts";
import { withSupabase } from "jsr:@supabase/server@1.4.1";
import { createClient } from "jsr:@supabase/supabase-js@2.112.3";
import { Stripe } from "npm:stripe@22.5.0";
import { encodeHex } from "jsr:@std/encoding@1.0.11/hex";


async function hashString(message: string) {
  if (!message) return undefined;
  const messageBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", messageBuffer);
  const hash = encodeHex(hashBuffer);
  return hash;
}

const SUPABASE_SECRET_KEYS = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS")!);

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  SUPABASE_SECRET_KEYS["default"]
)

export default {
  fetch: withSupabase({ auth: ["none"] }, async (req, ctx) => {
    let event;

    let stripeSecretKey;
    let stripeWebhookSecret;

    const requestText = await req.text();
    const requestJson = JSON.parse(requestText);
    
    if (requestJson.livemode) {
      stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY") as string;
      stripeWebhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") as string;
    } else {
      stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY_TEST") as string;
      stripeWebhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET_TEST") as string;
    }

    const stripe = new Stripe(stripeSecretKey);
    const signature = req.headers.get("stripe-signature");
    try {
      event = await stripe.webhooks.constructEventAsync(
        requestText,
        signature || "",
        stripeWebhookSecret,
      );
    } catch (err) {
      console.log("🚨 Error verifying webhook signature:", err);
      return new Response("Webhook signature verification failed.", {
        status: 400,
      });
    }

    if (event.type === "checkout.session.completed") {
      console.log(`Webhook request received: ${event.id}`);

      const session = event.data.object;
      const { generationId, size, productName, userAgent, ipAddress, userId, fbc, fbp, ttp, ttclid } = session.metadata!;
      const {
        name,
        address: { city, country, line1, line2, postal_code: postalCode, state },
      } = session.collected_information?.shipping_details || {address:{}};
      const { email, name: name2, address: {country: country2} } = session.customer_details! || {address:{}};
      const customerName = name || name2;
      const customerCountry = country || country2;

      console.log("Generation ID:", generationId);
      console.log("Size:", size);

      const { data, error } = await supabase
        .from("orders")
        .upsert({
          generation_id: generationId,
          size,
          name: customerName,
          email,
          city,
          country: customerCountry,
          line1,
          line2,
          postal_code: postalCode,
          state,
          product_name: productName,
          stripe_event_id: event.id,
          total_price: session.amount_total,
        }, { onConflict: "stripe_event_id", ignoreDuplicates: true })
        .select("id, order_number")
        .maybeSingle();

      if (error) {
        console.error("🚨 Error creating order:", error);
        return new Response(
          JSON.stringify({ error: "Failed to create order." }),
          {
            status: 500,
          },
        );
      }

      if (!data) {
        console.log("Order already exists, returning...");
        return new Response(null, { status: 204 });
      }

      const orderId = data.id;
      const orderNumber = data.order_number;
      console.log(`Order #${orderNumber} (${orderId}) created successfully. Invoking process-order.`);

      // Send Meta tracking event
      const nameParts = customerName.trim().split(/\s+/);
      const firstName = nameParts.shift() || "";
      const lastName = nameParts.join(" ");
      const metaPayload = {
        test_event_code: requestJson.livemode ? null : "TEST14619",
        data: [
          {
            event_name: "Purchase",
            event_time: Math.floor(Date.now() / 1000),
            action_source: "website",
            event_source_url: session.cancel_url,
            event_id: crypto.randomUUID(),
            user_data: {
              client_ip_address: ipAddress,
              client_user_agent: userAgent,
              fbc: fbc || undefined,
              fbp: fbp || undefined,
              external_id: userId,
              em: await hashString(email?.trim().toLowerCase()),
              fn: await hashString(firstName?.toLowerCase()),
              ln: await hashString(lastName?.toLowerCase()),
              country: await hashString(customerCountry?.trim().toLowerCase()),
              st: await hashString(state?.trim().toLowerCase()),
              zp: await hashString(postalCode?.trim().toLowerCase()),
              ct: await hashString(city?.trim().toLowerCase()),
            },
            custom_data: {
              content_ids: [`personalised-canvas-${size}`],
              content_name: `Personalised Canvas ${size}`,
              content_type: "product",
              currency: "AUD",
              value: session.amount_total / 100,
              num_items: 1,
            },
          },
        ],
      };
      console.log(`Meta tracking payload: ${JSON.stringify(metaPayload)}`);
      EdgeRuntime.waitUntil(fetch(
        `https://graph.facebook.com/v25.0/1725434085130628/events?access_token=${Deno.env.get("META_ACCESS_TOKEN")!}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(metaPayload),
        },
      ).catch(() => {}));

      // Send TikTok tracking event
      const tikTokPayload = {
        event_source: "web",
        event_source_id: "D99O34JC77U7PB56ORFG",
        test_event_code: requestJson.livemode ? null : "TEST21861",
        data: [
          {
            event: "Purchase",
            event_time: Math.floor(Date.now() / 1000),
            event_id: crypto.randomUUID(),
            user: {
              email: await hashString(email?.trim().toLowerCase()),
              ttclid: ttclid || undefined,
              ttp: ttp || undefined,
              ip: ipAddress,
              user_agent: userAgent,
              external_id: userId,
            },
            properties: {
              contents: [
                {
                  price: session.amount_total / 100,
                  quantity: 1,
                  content_id: `personalised-canvas-${size}`,
                  content_name: `Personalised Canvas ${size}`,
                  brand: "Turn Royal",
                },
              ],
              currency: "AUD",
              value: session.amount_total / 100,
              content_type: "product",
            },
            page: {
              url: session.cancel_url,
              referrer: session.cancel_url,
            },
          },
        ],
      };
      console.log(`TikTok tracking payload: ${JSON.stringify(tikTokPayload)}`);
      EdgeRuntime.waitUntil(fetch("https://business-api.tiktok.com/open_api/v1.3/event/track/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Token": Deno.env.get("TIKTOK_ACCESS_TOKEN")! as string,
        },
        body: JSON.stringify(tikTokPayload),
      }).catch(() => {}));

      // Process order.
      await supabase.functions.invoke("process-order", {
        body: { orderId },
      });
    }

    return new Response(null, { status: 204 });
  }),
};
