import { NextResponse } from "next/server";
import { buildClearSessionCookie } from "@/src/lib/auth/cookies";

export const POST = async () => {
  const cookie = buildClearSessionCookie();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(cookie.name, cookie.value, cookie.options);
  return response;
};
