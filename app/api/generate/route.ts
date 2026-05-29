import { generate } from "@/app/utils/generate";
import { supabase } from "@/app/utils/supabase";

export async function POST(request: Request) {
  const requestData = await request.json();
  const uploadIds = requestData.uploadIds as string[];
  const styleId = requestData.styleId as string;
  const userPrompt = requestData.userPrompt as string;

  console.log("Request received:", requestData);

  // TODO: add style id and prompt to generation group instead.
  const { data, error } = await supabase
    .from("generation_groups")
    .insert({ style_id: styleId, user_prompt: userPrompt })
    .select()
    .single();
  const generationGroupId = data.id;
  const { data: updatedUploads, error: updateError } = await supabase
    .from("uploads")
    .update({ generation_group_id: generationGroupId })
    .in("id", uploadIds);

  await generate(generationGroupId);

  return Response.json({
    generationGroupId,
  });
}
