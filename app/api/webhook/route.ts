import { headers } from "next/headers";
import { Stripe } from "stripe";

export async function POST(request: Request) {
  // TODO: duplicate events? https://docs.stripe.com/webhooks#handle-duplicate-events
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
    console.log(`⚠️ Webhook signature verification failed.`, err);
    return new Response("Webhook signature verification failed.", {
      status: 400,
    });
  }

  if (event.type === "checkout.session.completed") {
    console.log("Webhook request received:", event);
    const signature = (await headers()).get("stripe-signature");
    console.log("Stripe signature:", signature);
  }

  return Response.json({ received: true });
}
