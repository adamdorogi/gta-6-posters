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
import { randomUUID } from "crypto";
import { headers } from "next/headers";

export async function POST(request: Request) {
  try {
    console.log("Request received.");
    const formData = await request.formData();
    const photos = formData.get("photos") as File;

    console.log("Photos:", photos);

    if (photos.size < 1) {
      throw new Error("No file uploaded.");
    }

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
    const metaEventId = randomUUID();
    const metaPayload = {
      test_event_code:
        process.env.NODE_ENV === "production" ? null : "TEST14619",
      data: [
        {
          event_name: "UploadPhoto",
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
    const tikTokEventId = randomUUID();
    const tikTokPayload = {
      event_source: "web",
      event_source_id: "D99O34JC77U7PB56ORFG",
      test_event_code:
        process.env.NODE_ENV === "production" ? null : "TEST21861",
      data: [
        {
          event: "UploadPhoto",
          event_time: Math.floor(Date.now() / 1000),
          event_id: tikTokEventId,
          user: {
            ttclid,
            ttp,
            ip: ipAddress,
            user_agent: userAgent,
            external_id: userId,
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

    const uploadId = randomUUID();

    const splitString = photos.name.split(".");
    const type = splitString.length > 1 ? "." + splitString.pop() : "";

    const fileName = `${uploadId}${type}`;

    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(`${await getUserId()}/${fileName}`, photos);

    if (!data || error) {
      throw new Error(error?.message || "Failed to upload file.");
    }

    console.log("Upload data:", data);

    const { data: uploadData, error: uploadError } = await supabase
      .from("uploads")
      .insert({ id: uploadId, path: data.path })
      .select()
      .single();

    if (!uploadData || uploadError) {
      throw new Error(
        uploadError?.message || "Failed to create upload record.",
      );
    }

    return Response.json({
      uploadId: uploadData.id,
      metaEventId,
      tikTokEventId,
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: "Failed to upload file." }), {
      status: 400,
    });
  }
}
