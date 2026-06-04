import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function proxy(request: Request) {
  const response = NextResponse.next();

  const COOKIE_NAME = "user_id";
  const cookieStore = await cookies();

  if (!cookieStore.get(COOKIE_NAME)) {
    response.cookies.set(COOKIE_NAME, crypto.randomUUID(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  return response;
}
