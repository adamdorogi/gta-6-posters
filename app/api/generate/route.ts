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
    const uploadIds = requestData.uploadIds as string[];
    const styleId = requestData.styleId as string;
    const userPrompt = requestData.userPrompt as string;
    const tikTokEventId = requestData.tikTokEventId as string;
    const metaEventId = requestData.metaEventId as string;

    const headersList = await headers();
    const referrer = (headersList.get("referer") as string).split("?")[0];

    console.log("Request received:", requestData);

    if (uploadIds.length === 0) {
      throw new Error("No uploads specified.");
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
          event_name: "GeneratePreview",
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
          event: "GeneratePreview",
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

    const { data, error } = await supabase
      .from("generation_groups")
      .insert({ style_id: styleId, user_prompt: userPrompt })
      .select()
      .single();

    if (!data || error) {
      throw new Error(error?.message || "Failed to create generation group.");
    }

    const generationGroupId = data.id;
    const { data: uploadsData, error: uploadsError } = await supabase
      .from("uploads")
      .update({ generation_group_id: generationGroupId })
      .in("id", uploadIds)
      .select();

    if (!uploadsData || uploadsData.length === 0 || uploadsError) {
      throw new Error(
        uploadsError?.message ||
          "Failed to associate uploads with generation group.",
      );
    }

    await generate(generationGroupId);

    return Response.json({
      generationGroupId,
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to generate images." }),
      { status: 400 },
    );
  }
}
