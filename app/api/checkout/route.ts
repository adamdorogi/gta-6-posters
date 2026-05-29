import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  const origin = (await headers()).get("origin") as string;
  const { generationId, generationGroupId, imageUrl } = await request.json();

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    submit_type: "pay",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          product_data: {
            name: "AI Canvas",
            metadata: { generationId, generationGroupId },
            images: [imageUrl],
          },
          unit_amount: 5000,
          currency: "aud",
        },
        quantity: 1,
      },
    ],
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/preview/${generationGroupId}`,
    after_expiration: {
      recovery: {
        enabled: true,
        allow_promotion_codes: true,
      },
    },
  });

  return Response.json({
    url: checkoutSession.url,
  });
}
