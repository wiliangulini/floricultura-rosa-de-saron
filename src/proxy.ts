import { NextResponse, type NextRequest } from "next/server";

import {
  ADMIN_SESSION_COOKIE,
  getAdminSessionCookieOptions,
  getExpiredAdminSessionCookieOptions,
  readAdminSessionCookie,
  refreshAdminSessionCookie,
  type AdminSession,
} from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const sessionCookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const session = await readAdminSessionCookie(sessionCookie);

  if (isAdminLoginPath(pathname)) {
    if (session) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/admin";
      redirectUrl.search = "";

      return withRefreshedSession(NextResponse.redirect(redirectUrl), session);
    }

    const response = NextResponse.next();

    if (sessionCookie) {
      clearSessionCookie(response);
    }

    return response;
  }

  if (isAdminPasswordRecoveryPath(pathname)) {
    const response = NextResponse.next();

    if (session) {
      return withRefreshedSession(response, session);
    }

    if (sessionCookie) {
      clearSessionCookie(response);
    }

    return response;
  }

  if (!session) {
    if (isAdminApiPath(pathname)) {
      const response = NextResponse.json({ message: "Não autorizado." }, { status: 401 });

      if (sessionCookie) {
        clearSessionCookie(response);
      }

      return response;
    }

    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.search = "";
    const response = NextResponse.redirect(loginUrl);

    if (sessionCookie) {
      clearSessionCookie(response);
    }

    return response;
  }

  return withRefreshedSession(NextResponse.next(), session);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

async function withRefreshedSession(response: NextResponse, session: AdminSession) {
  const refreshedCookie = await refreshAdminSessionCookie(session);
  response.cookies.set(
    ADMIN_SESSION_COOKIE,
    refreshedCookie,
    getAdminSessionCookieOptions(),
  );

  return response;
}

function clearSessionCookie(response: NextResponse) {
  response.cookies.set(ADMIN_SESSION_COOKIE, "", getExpiredAdminSessionCookieOptions());
}

function isAdminLoginPath(pathname: string) {
  return pathname === "/admin/login" || pathname === "/admin/login/";
}

function isAdminPasswordRecoveryPath(pathname: string) {
  return (
    pathname === "/admin/esqueci-senha" ||
    pathname === "/admin/esqueci-senha/" ||
    pathname === "/admin/redefinir-senha" ||
    pathname === "/admin/redefinir-senha/"
  );
}

function isAdminApiPath(pathname: string) {
  return pathname === "/api/admin" || pathname.startsWith("/api/admin/");
}
