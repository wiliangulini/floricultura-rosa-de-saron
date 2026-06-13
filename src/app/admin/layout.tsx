import type { ReactNode } from "react";
import { cookies } from "next/headers";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ADMIN_SESSION_COOKIE, readAdminSessionCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const cookieStore = await cookies();
  const session = await readAdminSessionCookie(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);

  if (!session) {
    return (
      <div className="min-h-screen bg-rose-50 text-zinc-950">
        <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-10">
          <div className="w-full">{children}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-950">
      <div className="flex min-h-screen flex-col md:flex-row">
        <AdminSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminHeader adminEmail={session.email} />
          <main className="w-full px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-6xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
