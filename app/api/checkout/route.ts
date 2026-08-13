import { headers } from "next/headers";
import Stripe from "stripe";
import { products } from "@/app/utils/pricing";
import { supabase } from "@/app/utils/supabase";
import {
  getFbp,
  getFbc,
  getIpAddress,
  getUserAgent,
  getTtp,
  getTtclid,
  getUserId,
} from "@/app/utils/user";

export async function POST(request: Request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
    const headersList = await headers();
    const referrer = (headersList.get("referer") as string).split("?")[0];
    const { generationId, size, metaEventId, tikTokEventId } =
      await request.json();

    if (products[size] === undefined) {
      return new Response(JSON.stringify({ error: "Invalid size." }), {
        status: 400,
      });
    }

    // Send events to Meta and TikTok
    const [ipAddress, userAgent, userId, fbc, fbp, ttp, ttclid] =
      await Promise.all([
        getIpAddress(),
        getUserAgent(),
        getUserId(),
        getFbc(),
        getFbp(),
        getTtp(),
        getTtclid(),
      ]);

    // Meta event
    const metaPayload = {
      test_event_code:
        process.env.NODE_ENV === "production" ? null : "TEST14619",
      data: [
        {
          event_name: "InitiateCheckout",
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          event_source_url: referrer,
          event_id: metaEventId,
          user_data: {
            client_ip_address: ipAddress,
            client_user_agent: userAgent,
            fbc,
            fbp,
            external_id: userId,
          },
          custom_data: {
            content_ids: [`personalised-canvas-${size}`],
            content_name: `Personalised Canvas ${size}`,
            content_type: "product",
            currency: "AUD",
            value: products[size].price / 100,
            num_items: 1,
          },
        },
      ],
    };
    fetch(
      `https://graph.facebook.com/v25.0/1725434085130628/events?access_token=${process.env.META_ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metaPayload),
      },
    );

    // TikTok event
    const tikTokPayload = {
      event_source: "web",
      event_source_id: "D99O34JC77U7PB56ORFG",
      test_event_code:
        process.env.NODE_ENV === "production" ? null : "TEST21861",
      data: [
        {
          event: "InitiateCheckout",
          event_time: Math.floor(Date.now() / 1000),
          event_id: tikTokEventId,
          user: {
            ttclid,
            ttp,
            ip: ipAddress,
            user_agent: userAgent,
            external_id: userId,
          },
          properties: {
            contents: [
              {
                price: products[size].price / 100,
                quantity: 1,
                content_id: `personalised-canvas-${size}`,
                content_name: `Personalised Canvas ${size}`,
                brand: "Turn Royal",
              },
            ],
            currency: "AUD",
            value: products[size].price / 100,
            content_type: "product",
          },
          page: {
            url: referrer,
            referrer,
          },
        },
      ],
    };
    fetch(`https://business-api.tiktok.com/open_api/v1.3/event/track/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Token": process.env.TIKTOK_ACCESS_TOKEN as string,
      },
      body: JSON.stringify(tikTokPayload),
    });

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

    const productName =
      size === "Digital"
        ? "Digital Download"
        : `${products[size].width}" × ${products[size].height}" Canvas Print + Digital Download`;
    const productDescription =
      size === "Digital"
        ? "12K Ultra HD"
        : "Free shipping (5–10 business days)";

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      submit_type: "pay",
      payment_method_types: ["card"],
      metadata: {
        generationId,
        size,
        productName,
        userAgent,
        ipAddress,
        userId,
        fbc: fbc || null,
        fbp: fbp || null,
        ttp: ttp || null,
        ttclid: ttclid || null,
      },
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
              name: productName,
              description: productDescription,
              metadata: { generationId, size },
              images: [imageUrl],
            },
            unit_amount: products[size].price,
            currency: "aud",
          },
          quantity: 1,
        },
      ],
      success_url: `${referrer}?success`,
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
