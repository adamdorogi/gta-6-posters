import { headers } from "next/headers";
import Stripe from "stripe";
import { products } from "@/app/utils/pricing";
import { supabase } from "@/app/utils/supabase";

export async function POST(request: Request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
    const headersList = await headers();
    const referrer = headersList.get("referer") as string;
    const { generationId, size, eventId } = await request.json();

    if (products[size] === undefined) {
      return new Response(JSON.stringify({ error: "Invalid size." }), {
        status: 400,
      });
    }

    const { data: generationData, error: generationError } = await supabase
      .from("generations")
      .select("path")
      .eq("id", generationId)
      .single();

    if (generationError || !generationData) {
      console.error("Error fetching generation data:", generationError);
      return new Response(JSON.stringify({ error: "Invalid generation ID." }), {
        status: 400,
      });
    }

    const generationPath = generationData.path;
    if (!generationPath) {
      throw new Error("Generation does not have an associated image path.");
    }

    const imageUrl = supabase.storage
      .from("watermarked-generations")
      .getPublicUrl(generationPath).data.publicUrl;

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      submit_type: "pay",
      payment_method_types: ["card"],
      metadata: { generationId, size },
      shipping_address_collection:
        size === "Digital"
          ? undefined
          : {
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
              name:
                size === "Digital"
                  ? "Digital Download"
                  : `${products[size].width}" × ${products[size].height}" Canvas + Digital`,
              description:
                size === "Digital"
                  ? undefined
                  : "Free shipping (5-7 business days)",
              metadata: { generationId, size },
              images: [imageUrl],
            },
            unit_amount: products[size].price,
            currency: "aud",
          },
          quantity: 1,
        },
      ],
      success_url: referrer,
      cancel_url: referrer,
    });

    return Response.json({
      url: checkoutSession.url,
    });
  } catch (err) {
    console.error("Error creating checkout session:", err);
    return new Response(
      JSON.stringify({ error: "Failed to create checkout session." }),
      {
        status: 400,
      },
    );
  }
}
