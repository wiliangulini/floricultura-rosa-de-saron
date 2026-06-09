import { NextResponse } from "next/server";

// Placeholder: verificação real de sessão será adicionada quando NextAuth for configurado
export function proxy() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
