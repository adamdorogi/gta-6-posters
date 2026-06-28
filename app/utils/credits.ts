import { getIpAddress, getUserId } from "@/app/utils/user";
import { supabase } from "./supabase";

export async function getCredits() {
  const userId = await getUserId();
  const ipAddress = await getIpAddress();

  const { data } = await supabase
    .rpc("get_credits", {
      ip_address: ipAddress,
      user_id: userId,
    })
    .single();

  if (!data) {
    return {
      credits: 0,
      remainingSeconds: 0,
    };
  }

  return {
    credits: data.credits,
    remainingSeconds: data.remaining,
  };
}

export async function consumeCredit() {
  const userId = await getUserId();
  const ipAddress = await getIpAddress();

  const { data, error } = await supabase.rpc("consume_credit", {
    ip_address: ipAddress,
    user_id: userId,
  });

  return { data, error };
}
