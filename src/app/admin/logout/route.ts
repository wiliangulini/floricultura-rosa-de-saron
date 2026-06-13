import { NextResponse } from "next/server";

import {
  ADMIN_SESSION_COOKIE,
  getExpiredAdminSessionCookieOptions,
} from "@/lib/auth";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/admin/login", request.url), {
    status: 303,
  });

  response.cookies.set(ADMIN_SESSION_COOKIE, "", getExpiredAdminSessionCookieOptions());

  return response;
}
