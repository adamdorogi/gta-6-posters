import { cookies, headers } from "next/headers";
import { randomUUID } from "crypto";

export async function getOrSetUserId() {
  const COOKIE_NAME = "user_id";
  const cookieStore = await cookies();

  let userId = cookieStore.get(COOKIE_NAME)?.value;

  if (!userId) {
    userId = randomUUID();

    cookieStore.set(COOKIE_NAME, userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  return userId;
}

export async function getIpAddress() {
  const headersList = await headers();
  return headersList.get("x-forwarded-for");
}
