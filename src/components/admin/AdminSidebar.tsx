"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const adminMenuItems = [
  { href: "/admin", label: "Painel" },
  { href: "/admin/produtos", label: "Produtos" },
  { href: "/admin/categorias", label: "Categorias" },
  { href: "/admin/configuracoes", label: "Configurações" },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") {
      return pathname === "/admin";
    }

    return pathname.startsWith(href);
  }

  return (
    <aside className="border-b border-zinc-200 bg-white md:min-h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="flex h-full flex-col gap-5 px-4 py-4 sm:px-6 md:py-6">
        <div>
          <p className="text-sm font-semibold uppercase text-rose-700">Administração</p>
          <p className="mt-1 text-lg font-bold text-zinc-950">Rosa de Saron</p>
        </div>

        <nav aria-label="Navegação administrativa" className="flex flex-wrap gap-2 md:flex-col">
          {adminMenuItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                aria-current={active ? "page" : undefined}
                className={`rounded-md px-3 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700 ${
                  active
                    ? "bg-rose-100 text-rose-800"
                    : "text-zinc-700 hover:bg-rose-50 hover:text-rose-800"
                }`}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            );
          })}

          <form action="/admin/logout" method="post">
            <button
              aria-label="Sair da conta"
              className="rounded-md px-3 py-2 text-sm font-semibold text-rose-900 transition hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
              type="submit"
            >
              Sair
            </button>
          </form>
        </nav>
      </div>
    </aside>
  );
}
