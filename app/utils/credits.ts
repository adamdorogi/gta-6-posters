import { getIpAddress, getUserId } from "@/app/utils/user";
import { supabase } from "./supabase";

export async function getCredits() {
  const userId = await getUserId();
  const ipAddress = await getIpAddress();

  const { data, error } = await supabase.rpc("get_credits", {
    ip_address: ipAddress,
    user_id: userId,
  });

  const currentTimestamp = Date.now();
  const resetTimestamp = Date.parse(data.reset_at);
  // TODO: also change in psql function
  // const resetInterval = 12 * 60 * 60 * 1000; // 12 hours
  const resetInterval = 1 * 60 * 1000; // 12 hours
  const nextReset = (resetTimestamp + resetInterval - currentTimestamp) / 1000;

  return {
    credits: data.credits,
    nextReset,
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
