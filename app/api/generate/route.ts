import { generate } from "@/app/utils/generate";
import { supabase } from "@/app/utils/supabase";

export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    const uploadIds = requestData.uploadIds as string[];
    const styleId = requestData.styleId as string;
    const userPrompt = requestData.userPrompt as string;

    console.log("Request received:", requestData);

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
      { status: 500 },
    );
  }
}
