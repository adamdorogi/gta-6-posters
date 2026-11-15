import "jsr:@supabase/functions-js@2.116.0/edge-runtime.d.ts";
import { withSupabase } from "jsr:@supabase/server@1.5.3";
import { createClient } from "jsr:@supabase/supabase-js@2.116.0";
import { sendOrderEmail } from "../_shared/order-emails.ts";

const secretKeys = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS")!);
const supabase = createClient(Deno.env.get("SUPABASE_URL")!, secretKeys.default);

const topics = {
  "order:sent-to-production": "production",
  "order:shipment:created": "shipped",
  "order:shipment:delivered": "delivered",
} as const;

type PrintifyEvent = {
  type?: keyof typeof topics;
  resource?: { id?: string; data?: { carrier?: { tracking_number?: string } } };
};
type PrintifyOrder = {
  sent_to_production_at?: string;
  shipments?: { carrier?: string; number?: string; url?: string; delivered_at?: string }[];
};

export default {
  fetch: withSupabase({ auth: ["none"] }, async (req) => {
    try {
      const event: PrintifyEvent = await req.json();
      const printifyId = event.resource?.id;
      if (!event.type || !Object.hasOwn(topics, event.type) || typeof printifyId !== "string") {
        return new Response(null, { status: 204 });
      }

      const kind = topics[event.type];
      const { data: order, error } = await supabase
        .from("orders")
        .select("order_number, name, email, product_name, generations(path)")
        .eq("printify_id", printifyId)
        .maybeSingle()
        .overrideTypes<{
          order_number: number;
          name: string;
          email: string;
          product_name: string | null;
          generations: { path: string | null } | null;
        }, { merge: false }>();
      if (error) throw new Error(`Unable to load the print order: ${error.code}`);
      if (!order) return new Response(null, { status: 204 });

      // Use the supplier's actual order details for any status and tracking sent to the customer.
      const response = await fetch(`https://api.printify.com/v1/shops/29761765/orders/${encodeURIComponent(printifyId)}.json`, {
        headers: { Authorization: `Bearer ${Deno.env.get("PRINTIFY_API_TOKEN")}` },
        signal: AbortSignal.timeout(10_000),
      });
      if (!response.ok) throw new Error(`Unable to verify Printify order (${response.status}).`);
      const printOrder: PrintifyOrder = await response.json();
      const trackingNumber = event.resource?.data?.carrier?.tracking_number;
      const shipments = printOrder.shipments?.filter((shipment) =>
        (kind !== "delivered" || shipment.delivered_at) &&
        (!trackingNumber || shipment.number === trackingNumber)
      );
      const tracking = shipments?.[0];
      if (kind === "production" ? !printOrder.sent_to_production_at : !tracking) {
        return new Response(null, { status: 204 });
      }

      const generationPath = order.generations?.path;
      const artworkUrl = generationPath
        ? supabase.storage.from("watermarked-generations").getPublicUrl(generationPath).data.publicUrl
        : undefined;
      const sent = await sendOrderEmail(
        order.email,
        { orderNumber: order.order_number, name: order.name, item: order.product_name, artworkUrl },
        kind === "production" ? { kind } : { kind, tracking },
        `print-${kind}/${printifyId}/${tracking?.number ?? ""}`,
      );
      return new Response(null, { status: sent ? 200 : 502 });
    } catch (error) {
      console.error("Unable to handle Printify order update:", error);
      return new Response(null, { status: 500 });
    }
  }),
};
