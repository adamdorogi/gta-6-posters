import { generate } from "@/app/utils/generate";
import { supabase } from "@/app/utils/supabase";

export async function POST(request: Request) {
  const requestData = await request.json();
  console.log(requestData);
  const { generationGroupId, styleId, userPrompt } = requestData;

  const { data, error } = await supabase
    .from("generation_groups")
    .update({ style_id: styleId, user_prompt: userPrompt })
    .eq("id", generationGroupId);
  const generationId = await generate(generationGroupId);

  return Response.json({
    generationId,
  });
}
