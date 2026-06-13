import Link from "next/link";
import { cookies } from "next/headers";

import { ADMIN_SESSION_COOKIE, readAdminSessionCookie } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const session = await readAdminSessionCookie(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-950">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-lg font-semibold">Administração</p>
          {session ? (
            <div className="flex flex-wrap items-center gap-4">
              <nav
                aria-label="Navegação administrativa"
                className="flex gap-4 text-sm font-medium"
              >
                <Link className="text-zinc-700 transition hover:text-rose-700" href="/admin">
                  Painel
                </Link>
                <Link
                  className="text-zinc-700 transition hover:text-rose-700"
                  href="/admin/produtos"
                >
                  Produtos
                </Link>
                <Link
                  className="text-zinc-700 transition hover:text-rose-700"
                  href="/admin/categorias"
                >
                  Categorias
                </Link>
              </nav>
              <form action="/admin/logout" method="post">
                <button
                  className="min-h-9 rounded-md border border-rose-300 bg-white px-3 py-2 text-sm font-semibold text-rose-900 transition hover:border-rose-500 hover:bg-rose-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
                  type="submit"
                >
                  Sair
                </button>
              </form>
            </div>
          ) : null}
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
