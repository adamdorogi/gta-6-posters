import { after } from "next/server";
import Stripe from "stripe";
import { getProductDetails, isProductSize, storeCurrency } from "@/app/utils/pricing";
import { site } from "@/app/utils/site";
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
import { shippingCountries } from "./shipping-countries";

export async function POST(request: Request) {
  try {
    const { generationId, size, metaEventId, tikTokEventId } = await request.json();
    if (typeof generationId !== "string" || !isProductSize(size)) {
      return Response.json({ error: "Invalid poster or size." }, { status: 400 });
    }

    const { data: generation, error: generationError } = await supabase
      .from("generations")
      .select("path, generation_group_id")
      .eq("id", generationId)
      .eq("status", "succeeded")
      .single();

    if (generationError || !generation?.path) {
      return Response.json({ error: "The poster preview is unavailable." }, { status: 400 });
    }

    const product = getProductDetails(size);
    const isPrint = size !== "Digital";
    const origin = process.env.VERCEL_ENV === "production" ? site.origin : new URL(request.url).origin;
    const returnUrl = new URL(`/preview/${generation.generation_group_id}`, origin);
    const imageUrl = supabase.storage
      .from("watermarked-generations")
      .getPublicUrl(generation.path).data.publicUrl;
    const [ipAddress, userAgent, userId, fbc, fbp, ttp, ttclid] = await Promise.all([
      getIpAddress(),
      getUserAgent(),
      getUserId(),
      getFbc(),
      getFbp(),
      getTtp(),
      getTtclid(),
    ]);

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      submit_type: "pay",
      payment_method_types: ["card"],
      adaptive_pricing: { enabled: false },
      allow_promotion_codes: true,
      payment_intent_data: {
        metadata: { store: site.domain, generationId },
      },
      metadata: {
        generationId,
        size,
        productId: product.id,
        productName: product.name,
        printFormat: isPrint ? "paper-poster" : null,
        userAgent,
        ipAddress,
        userId,
        fbc: fbc || null,
        fbp: fbp || null,
        ttp: ttp || null,
        ttclid: ttclid || null,
      },
      shipping_address_collection: isPrint ? { allowed_countries: shippingCountries } : undefined,
      phone_number_collection: isPrint ? { enabled: true } : undefined,
      custom_text: isPrint ? {
        shipping_address: {
          message: "Use Latin characters for the shipping address. Enter any required customs ID in Address line 2 (CPF for Brazil, RFC or CURP for Mexico, RUN or RUT for Chile, PCCC for South Korea, RIF for Venezuela).",
        },
      } : undefined,
      line_items: [
        {
          price_data: {
            product_data: {
              name: product.name,
              description: isPrint
                ? "Unframed glossy paper poster. Standard shipping is included."
                : "High-resolution digital file with no watermark. The download link is sent by email.",
              metadata: { generationId, size },
              images: [imageUrl],
            },
            unit_amount: product.price,
            currency: storeCurrency.toLowerCase(),
          },
          quantity: 1,
        },
      ],
      success_url: `${returnUrl.href}?success`,
      cancel_url: returnUrl.href,
    });

    const isLive = checkoutSession.livemode;
    const value = product.price / 100;
    const eventTime = Math.floor(Date.now() / 1000);
    after(async () => {
      const requests = [];
      if (process.env.META_ACCESS_TOKEN) {
        const metaUrl = new URL("https://graph.facebook.com/v25.0/1725434085130628/events");
        metaUrl.searchParams.set("access_token", process.env.META_ACCESS_TOKEN);
        requests.push(fetch(metaUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: AbortSignal.timeout(5000),
          body: JSON.stringify({
            test_event_code: isLive ? undefined : "TEST14619",
            data: [{
              event_name: "InitiateCheckout",
              event_time: eventTime,
              action_source: "website",
              event_source_url: returnUrl.href,
              event_id: metaEventId,
              user_data: {
                client_ip_address: ipAddress,
                client_user_agent: userAgent,
                fbc,
                fbp,
                external_id: userId,
              },
              custom_data: {
                content_ids: [product.id],
                content_name: product.name,
                content_type: "product",
                currency: storeCurrency,
                value,
                num_items: 1,
              },
            }],
          }),
        }));
      }

      if (process.env.TIKTOK_ACCESS_TOKEN) {
        requests.push(fetch("https://business-api.tiktok.com/open_api/v1.3/event/track/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Token": process.env.TIKTOK_ACCESS_TOKEN,
          },
          signal: AbortSignal.timeout(5000),
          body: JSON.stringify({
            event_source: "web",
            event_source_id: "D99O34JC77U7PB56ORFG",
            test_event_code: isLive ? undefined : "TEST21861",
            data: [{
              event: "InitiateCheckout",
              event_time: eventTime,
              event_id: tikTokEventId,
              user: {
                ttclid,
                ttp,
                ip: ipAddress,
                user_agent: userAgent,
                external_id: userId,
              },
              properties: {
                contents: [{
                  price: value,
                  quantity: 1,
                  content_id: product.id,
                  content_name: product.name,
                  brand: site.name,
                }],
                currency: storeCurrency,
                value,
                content_type: "product",
              },
              page: { url: returnUrl.href, referrer: returnUrl.href },
            }],
          }),
        }));
      }
      await Promise.allSettled(requests);
    });

    return Response.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return Response.json({ error: "Failed to create checkout session." }, { status: 400 });
  }
}
