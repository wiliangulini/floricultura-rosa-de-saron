import type { Metadata } from "next";
import type { ReactNode } from "react";
import { cookies } from "next/headers";

import { AdminShell } from "@/components/admin/AdminShell";
import { ADMIN_SESSION_COOKIE, readAdminSessionCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const cookieStore = await cookies();
  const session = await readAdminSessionCookie(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);

  if (!session) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <a
          className="fixed left-4 top-4 z-50 -translate-y-24 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-white shadow-lifted transition focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-rose-300"
          href="#conteudo-principal"
        >
          Pular para o conteúdo
        </a>
        <main
          className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-10"
          id="conteudo-principal"
          tabIndex={-1}
        >
          <div className="w-full">{children}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        className="fixed left-4 top-4 z-50 -translate-y-24 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-white shadow-lifted transition focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-rose-300"
        href="#conteudo-principal"
      >
        Pular para o conteúdo
      </a>
      <AdminShell adminEmail={session.email}>{children}</AdminShell>
    </div>
  );
}
