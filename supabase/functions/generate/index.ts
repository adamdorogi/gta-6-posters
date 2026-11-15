import "jsr:@supabase/functions-js@2.116.0/edge-runtime.d.ts";
import { withSupabase } from "jsr:@supabase/server@1.5.3";
import { createClient } from "jsr:@supabase/supabase-js@2.116.0";
import { OpenRouter } from "npm:@openrouter/sdk@1.2.108";
import { Buffer } from "node:buffer";
import { createJimp } from "npm:@jimp/core@1.6.1";
import jpeg from "npm:@jimp/js-jpeg@1.6.1";
import png from "npm:@jimp/js-png@1.6.1";
import { methods as crop } from "npm:@jimp/plugin-crop@1.6.1";

const Jimp = createJimp({ formats: [jpeg, png], plugins: [crop] });

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
        // model: "x-ai/grok-imagine-image-quality",
        model: "x-ai/grok-imagine-image-2.0",
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
    const image = await Jimp.read(Buffer.from(b64, "base64"));
    const path = `${userId}/${generationGroupId}/${generationId}.jpeg`;

    // The model renders at 3:4. Center-crop to the 1:√2 A-series paper ratio.
    const { width, height } = image.bitmap;
    const posterWidth = Math.min(width, Math.round(height * Math.SQRT1_2));
    const posterHeight = Math.min(height, Math.round(width / Math.SQRT1_2));
    const cropX = Math.floor((width - posterWidth) / 2);
    const cropY = Math.floor((height - posterHeight) / 2);
    image.crop({ x: cropX, y: cropY, w: posterWidth, h: posterHeight });

    const { error: originalError } = await supabase.storage
      .from("generations")
      .upload(path, await image.getBuffer("image/jpeg", { quality: 95 }), {
        contentType: "image/jpeg",
      });
    if (originalError) {
      throw new Error(`Failed to upload generation ${path}: ${originalError.message}`);
    }

    const { data: watermarkBlob, error: watermarkError } = await supabase.storage
        .from("assets")
        .download("watermark.png");
    if (!watermarkBlob || watermarkError) {
      throw new Error(watermarkError?.message ?? "Failed to download watermark.");
    }

    const watermark = await Jimp.read(
      Buffer.from(await watermarkBlob.arrayBuffer()),
    );
    // Keep the watermark aligned with its position in the uncropped artwork.
    image.composite(watermark, -cropX, -cropY);
    const watermarked = await image.getBuffer("image/jpeg", { quality: 82 });

    // Drop the raw RGBA bitmaps before the upload's I/O wait.
    image.bitmap.data = Buffer.alloc(0);
    watermark.bitmap.data = Buffer.alloc(0);

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
