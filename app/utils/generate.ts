import { consumeCredit } from "./credits";
import { supabase } from "./supabase";
import { getUserId } from "./user";

export async function generate(generationGroupId: string) {
  const { error: creditsError } = await consumeCredit();

  if (creditsError) {
    return null;
  }

  const { data, error } = await supabase
    .from("generations")
    .insert({ generation_group_id: generationGroupId })
    .select()
    .single();

  const generationId = data.id;

  supabase.functions.invoke("generate", {
    body: {
      generationId,
      generationGroupId,
      userId: await getUserId(),
    },
  });

  return generationId;
}
