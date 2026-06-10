import { cookies, headers } from "next/headers";

export async function getUserId() {
  const COOKIE_NAME = "user_id";
  const cookieStore = await cookies();

  return cookieStore.get(COOKIE_NAME)?.value || "";
}

export async function getIpAddress() {
  const headersList = await headers();
  return headersList.get("x-forwarded-for") || "";
}
