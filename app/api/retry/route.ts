import { generate } from "@/app/utils/generate";
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
import { headers } from "next/headers";

export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    console.log(requestData);
    const {
      generationGroupId,
      styleId,
      userPrompt,
      tikTokEventId,
      metaEventId,
    } = requestData;

    const headersList = await headers();
    const referrer = (headersList.get("referer") as string).split("?")[0];

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
          event_name: "RetryPreview",
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
            prompt: userPrompt,
            style_id: styleId,
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
          event: "RetryPreview",
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
            prompt: userPrompt,
            style_id: styleId,
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

    const { data: generationGroupData, error: generationGroupError } =
      await supabase
        .from("generation_groups")
        .update({ style_id: styleId, user_prompt: userPrompt })
        .eq("id", generationGroupId)
        .select();

    if (
      !generationGroupData ||
      generationGroupData.length === 0 ||
      generationGroupError
    ) {
      throw new Error(
        generationGroupError?.message || "Failed to update generation group.",
      );
    }
    const generationId = await generate(generationGroupId);

    return Response.json({
      generationId,
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to retry generation." }),
      { status: 400 },
    );
  }
}
