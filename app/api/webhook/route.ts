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

    console.log("Generation ID:", generationId);

    const { data, error } = await supabase
      .from("orders")
      .insert({ generation_id: generationId })
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

    // TODO: call fulfillment edge function to create order (don't await).
  }

  return new Response(null, { status: 204 });
}
