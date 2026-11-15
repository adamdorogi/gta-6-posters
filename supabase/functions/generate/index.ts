/// <reference path="../_shared/edge-runtime.d.ts" />

import "jsr:@supabase/functions-js@2.116.0/edge-runtime.d.ts";
import { withSupabase } from "jsr:@supabase/server@1.5.3";
import { createClient } from "jsr:@supabase/supabase-js@2.116.0";
import { OpenRouter } from "npm:@openrouter/sdk@1.2.108";
import { Buffer } from "node:buffer";
import { createJimp } from "npm:@jimp/core@1.6.1";
import jpeg from "npm:@jimp/js-jpeg@1.6.1";
import png from "npm:@jimp/js-png@1.6.1";
import { methods as crop } from "npm:@jimp/plugin-crop@1.6.1";
import { storeName, storeOrigin } from "../_shared/store.ts";

const Jimp = createJimp({ formats: [jpeg, png], plugins: [crop] });

const portraitInstructions = `IMAGE ROLES
Image 1 is the style reference. Use its visual language, composition, palette, lighting, and typography. The reference contributes style only.
Image 2 and any later images are the user's subject photos. Draw the cast exclusively from those photos.

CAST AND LIKENESS
Likeness is the highest priority. Include all distinct people in the subject photos, including people shown together in one photo. If the same person appears in several photos, use the clearest views to draw that person once. Keep each face distinct, visible, and recognizable. Preserve facial structure, eye and brow shape and spacing, nose, mouth, jaw, skin tone, age, hairline, hairstyle, build, and visible identifiers such as glasses, freckles, facial hair, or tattoos. If a pet is pictured, retain its muzzle shape, coat, and markings. Draw everyone in the illustrated treatment of Image 1, with their individual features intact.

EXPRESSION
Give people a cool, tough, gangster-like presence. Use closed or lightly pressed lips, a steady stare or guarded off-camera gaze, and subtle tension at the brows. Aim for serious, composed, or slightly irritated. Avoid smiles, grins, laughter, and exaggerated scowls even when the source photos are cheerful.

PRINT LAYOUT
Make one full-bleed A-series portrait poster with a width-to-height ratio of 1 to √2. Adapt the taller reference layout to this sheet, keeping faces and lettering safely inside the trim and extending art to every edge. Return flat printable artwork without a mockup, frame, or watermark. Use only the lettering specified in the style direction.`;

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
  httpReferer: storeOrigin,
  appTitle: storeName,
  appCategories: 'image-gen',
});

export default {
  fetch: withSupabase({ auth: ["secret"] }, async (req) => {
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
  try {
    const [{ data: uploads, error: uploadsError }, { data: group, error: groupError }] =
      await Promise.all([
        supabase
          .from("uploads")
          .select("path")
          .eq("generation_group_id", generationGroupId)
          .order("created_at")
          .order("id"),
        supabase
          .from("generation_groups")
          .select("user_prompt, styles ( prompt, reference_path )")
          .eq("id", generationGroupId)
          .single()
          .overrideTypes<{
            user_prompt: string;
            styles: { prompt: string; reference_path: string } | null;
          }, { merge: false }>(),
      ]);

    if (uploadsError || !uploads?.length) {
      throw new Error(uploadsError?.message ?? `No photos for generation group ${generationGroupId}.`);
    }
    if (groupError || !group?.styles?.reference_path) {
      throw new Error(groupError?.message ?? `No style reference for generation group ${generationGroupId}.`);
    }

    const style = group.styles;
    const { data: styleReference, error: referenceError } = await supabase.storage
      .from("assets")
      .download(style.reference_path);
    if (referenceError || !styleReference?.size) {
      throw new Error(referenceError?.message ?? `Unable to load style reference ${style.reference_path}.`);
    }

    const referenceBytes = Buffer.from(await styleReference.arrayBuffer());
    const referenceUrl = `data:${styleReference.type || "image/jpeg"};base64,${referenceBytes.toString("base64")}`;
    const uploadsBucket = supabase.storage.from("uploads");
    const subjectUrls = uploads.map(({ path }) => uploadsBucket.getPublicUrl(path).data.publicUrl);
    const attachments = [referenceUrl, ...subjectUrls].map((url) => ({
      type: "image_url" as const,
      imageUrl: { url },
    }));

    const prompt = [
      portraitInstructions,
      `STYLE DIRECTION\n${style.prompt}`,
    ];
    if (group.user_prompt.trim()) {
      prompt.push(`ADDITIONAL USER DIRECTION\nApply only where consistent with the image roles, cast, expressions, and style above.\n${group.user_prompt}`);
    }

    const model = "google/gemini-nano-banana-2.1";

    const response = await openRouter.images.generate({
      imageGenerationRequest: {
        stream: false,
        model,
        prompt: prompt.join("\n\n"),
        inputReferences: attachments,
        size: "1K",
        aspectRatio: "3:4",
        outputFormat: "jpeg",
      },
    });
    const b64 = "data" in response ? response.data?.[0]?.b64Json : undefined;
    if (!b64) {
      throw new Error(`No image data returned by ${model}.`);
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
    // Center the watermark before adjusting for the poster crop.
    const watermarkX = Math.floor((width - watermark.bitmap.width) / 2) - cropX;
    const watermarkY = Math.floor((height - watermark.bitmap.height) / 2) - cropY;
    image.composite(watermark, watermarkX, watermarkY);
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
    console.error("Background generation failed:", e instanceof Error ? e.message : e);
    await supabase
      .from("generations")
      .update({ status: "failed" })
      .eq("id", generationId);
  }
}
