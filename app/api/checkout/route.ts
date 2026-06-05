import { headers } from "next/headers";
import Stripe from "stripe";
import { prices } from "@/app/utils/prices";

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  const headersList = await headers();
  const origin = headersList.get("origin") as string;
  const referrer = headersList.get("referer") as string;
  const { generationId, imageUrl, size } = await request.json();

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    submit_type: "pay",
    payment_method_types: ["card"],
    metadata: { generationId, size },
    shipping_address_collection: {
      allowed_countries: ["AU"],
    },
    // Shrinks image preview
    // shipping_options: [
    //   {
    //     shipping_rate_data: {
    //       type: "fixed_amount",
    //       fixed_amount: {
    //         amount: 0,
    //         currency: "aud",
    //       },
    //       display_name: "Free shipping",
    //       delivery_estimate: {
    //         minimum: {
    //           unit: "business_day",
    //           value: 5,
    //         },
    //         maximum: {
    //           unit: "business_day",
    //           value: 7,
    //         },
    //       },
    //     },
    //   },
    // ],
    line_items: [
      {
        price_data: {
          product_data: {
            name: `${size} Canvas + Digital`,
            description: "Free shipping (5-7 business days)",
            metadata: { generationId, size },
            images: [imageUrl],
          },
          unit_amount: prices[size],
          currency: "aud",
        },
        quantity: 1,
      },
    ],
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: referrer,
  });

  return Response.json({
    url: checkoutSession.url,
  });
}
