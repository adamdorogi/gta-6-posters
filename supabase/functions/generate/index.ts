import "jsr:@supabase/functions-js@2.116.0/edge-runtime.d.ts";
import { withSupabase } from "jsr:@supabase/server@1.5.3";
import { createClient } from "jsr:@supabase/supabase-js@2.116.0";
import { OpenRouter } from "npm:@openrouter/sdk@1.2.108";
import { Buffer } from "node:buffer";
import { createJimp } from "npm:@jimp/core@1.6.1";
import jpeg from "npm:@jimp/js-jpeg@1.6.1";
import png from "npm:@jimp/js-png@1.6.1";
import { methods as blit } from "npm:@jimp/plugin-blit@1.6.1";

const Jimp = createJimp({ formats: [jpeg, png], plugins: [blit] });

interface ReqPayload {
  generationId: string;
  generationGroupId: string;
  userId: string;
}

const SUPABASE_SECRET_KEYS = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS")!);

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  SUPABASE_SECRET_KEYS["default"]
)

const openRouter = new OpenRouter({
  apiKey: Deno.env.get("OPENROUTER_API_KEY")!,
  httpReferer: 'https://www.turnroyal.com',
  appTitle: 'Turn Royal',
  appCategories: 'image-gen',
});

export default {
  fetch: withSupabase({ auth: ["secret"] }, async (req, ctx) => {
    let payload: ReqPayload;
    try {
      payload = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid payload." }), { status: 400 });
    }
    const { generationId, generationGroupId, userId } = payload;
    EdgeRuntime.waitUntil(generateImage(generationId, userId, generationGroupId));
    return new Response(null, { status: 204 });
  }),
};

async function generateImage(generationId: string, userId: string, generationGroupId: string) {
  try{
    const { data: uploadsData, error: uploadsError } = await supabase
      .from("uploads")
      .select("path")
      .eq("generation_group_id", generationGroupId);
    if (!uploadsData || uploadsError || uploadsData.length === 0) {
      throw new Error(uploadsError?.message || `Failed to get uploads for generation group ${generationGroupId}.`);
    }
    const publicUrls = uploadsData.map((upload) => supabase
      .storage
      .from("uploads")
      .getPublicUrl(upload.path));
    const attachments = publicUrls.map((publicUrl) => ({type: "image_url", imageUrl: {url: publicUrl.data.publicUrl}}));

    const { data: generationGroupsData, error: generationGroupsError } = await supabase
      .from("generation_groups")
      .select("user_prompt, styles ( prompt )")
      .eq("id", generationGroupId)
      .single();

    if (!generationGroupsData || generationGroupsError) {
      throw new Error(generationGroupsError?.message || `Failed to get style for generation group ${generationGroupId}.`);
    }

    const {user_prompt: userPrompt, styles: {prompt: systemPrompt}} = generationGroupsData;

    const masterPrompt = `${systemPrompt}\n\nADDITIONAL USER DIRECTION (apply only where it does not conflict with the constraints above): ${userPrompt}`;

    const request = {
      imageGenerationRequest: {
        // model: "bytedance-seed/seedream-5-0-pro",
        // model: "meta/muse-image",
        // model: "google/gemini-3.1-flash-image",
        // model: "google/gemini-3.1-flash-lite-image",
        model: "x-ai/grok-imagine-image-quality",
        // model: "x-ai/grok-imagine-image-2.0",
        prompt: masterPrompt,
        inputReferences: attachments,
        // size: "864x1152",
        size: "1K",
        // aspectRatio: "2:3",
        aspectRatio: "3:4",
        outputFormat: "jpeg"
      }
    };
    console.log(`Request: ${JSON.stringify(request)}`);

    const response = await openRouter.images.generate(request);
    const b64 = response.data?.[0]?.b64Json;
    if (!b64) {
      throw new Error(`No image data returned: ${JSON.stringify(response).slice(0, 500)}`);
    }
    console.log("Successfully received generated image, processing...");
    const original = Buffer.from(b64, "base64");
    const path = `${userId}/${generationGroupId}/${generationId}.jpeg`;

    // Upload the clean file first so it can be collected before we allocate bitmaps.
    const { error: originalError } = await supabase.storage
      .from("generations")
      .upload(path, original, { contentType: "image/jpeg" });
    if (originalError) {
      throw new Error(`Failed to upload generation ${path}: ${originalError.message}`);
    }

    const { data: watermarkBlob, error: watermarkError } = await supabase.storage
        .from("assets")
        .download("watermark.png");
    if (!watermarkBlob || watermarkError) {
      throw new Error(watermarkError?.message ?? "Failed to download watermark.");
    }

    const image = await Jimp.read(original);
    const watermark = await Jimp.read(
      Buffer.from(await watermarkBlob.arrayBuffer()),
    );
    image.composite(watermark, 0, 0);
    const watermarked = await image.getBuffer("image/jpeg", { quality: 82 });

    // Drop the raw RGBA bitmaps before the upload's I/O wait.
    image.bitmap.data = new Uint8Array(0);
    watermark.bitmap.data = new Uint8Array(0);

    const { error: watermarkedUploadError } = await supabase.storage
      .from("watermarked-generations")
      .upload(path, watermarked, { contentType: "image/jpeg" });
    if (watermarkedUploadError) {
      throw new Error(
        `Failed to upload watermarked generation ${path}: ${watermarkedUploadError.message}`,
      );
    }

    const { error: statusError } = await supabase
      .from("generations")
      .update({ status: "succeeded", path })
      .eq("id", generationId);
    if (statusError) {
      throw new Error(
        `Failed to update status for generation ${generationId}: ${statusError.message}`,
      );
    }
  } catch (e) {
    console.error("Background generation failed:", e);
    await supabase
      .from("generations")
      .update({ status: "failed" })
      .eq("id", generationId);
  }
}