import { generate } from "@/app/utils/generate";
import { supabase } from "@/app/utils/supabase";

export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    console.log(requestData);
    const { generationGroupId, styleId, userPrompt } = requestData;

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
