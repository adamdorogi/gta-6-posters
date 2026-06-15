import { consumeCredit } from "./credits";
import { supabase } from "./supabase";
import { getUserId } from "./user";

export async function generate(generationGroupId: string) {
  const { error: creditsError } = await consumeCredit();

  if (creditsError) {
    // TODO
    return null;
  }

  const { data, error } = await supabase
    .from("generations")
    .insert({ generation_group_id: generationGroupId })
    .select()
    .single();

  if (!data || error) {
    throw new Error(error?.message || "Failed to create generation record.");
  }

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
