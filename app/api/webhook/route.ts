import { supabase } from "@/app/utils/supabase";
import { headers } from "next/headers";
import { Stripe } from "stripe";

export async function POST(request: Request) {
  let event;

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  const signature = (await headers()).get("stripe-signature");
  try {
    event = stripe.webhooks.constructEvent(
      await request.text(),
      signature || "",
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );
  } catch (err) {
    console.log("⚠️ Webhook signature verification failed.", err);
    return new Response("Webhook signature verification failed.", {
      status: 400,
    });
  }

  if (event.type === "checkout.session.completed") {
    console.log("Webhook request received:", JSON.stringify(event, null, 2));

    const session = event.data.object;
    const generationId = session.metadata?.generationId;
    const {
      name,
      address: { city, country, line1, line2, postal_code: postalCode, state },
    } = session.collected_information!.shipping_details!;
    const { email } = session.customer_details!;

    console.log("Generation ID:", generationId);

    const { data, error } = await supabase
      .from("orders")
      .insert({
        generation_id: generationId,
        name,
        email,
        city,
        country,
        line1,
        line2,
        postal_code: postalCode,
        state,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating order:", error);
      return new Response(
        JSON.stringify({ error: "Failed to create order." }),
        {
          status: 500,
        },
      );
    }

    const orderId = data.id;
    console.log("Order created successfully:", orderId);

    supabase.functions.invoke("submit_printify_order", { body: { orderId } });
  }

  return new Response(null, { status: 204 });
}
