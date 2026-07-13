"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const adminMenuItems = [
  { href: "/admin", label: "Painel" },
  { href: "/admin/produtos", label: "Produtos" },
  { href: "/admin/categorias", label: "Categorias" },
  { href: "/admin/perfil", label: "Perfil" },
  { href: "/admin/configuracoes", label: "Configurações" },
] as const;

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") {
      return pathname === "/admin";
    }

    return pathname.startsWith(href);
  }

  return (
    <aside
      className={[
        "fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-surface",
        "transform transition-transform duration-200 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "md:relative md:inset-y-auto md:left-auto md:z-auto",
        "md:translate-x-0 md:min-h-screen md:border-b-0",
      ].join(" ")}
      id="admin-sidebar"
    >
      <div className="flex h-full flex-col gap-5 px-4 py-4 sm:px-6 md:py-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Administração
          </p>
          <p className="mt-1 font-display text-lg font-semibold tracking-tight text-foreground">
            Rosa de Saron
          </p>
        </div>

        <nav aria-label="Navegação administrativa" className="flex flex-col gap-1">
          {adminMenuItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                aria-current={active ? "page" : undefined}
                className={`inline-flex min-h-11 items-center rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  active
                    ? "bg-primary-soft text-primary"
                    : "text-zinc-700 hover:bg-primary-soft/60 hover:text-primary"
                }`}
                href={item.href}
                key={item.href}
                onClick={onClose}
              >
                {item.label}
              </Link>
            );
          })}

          <form action="/admin/logout" method="post">
            <button
              aria-label="Sair da conta"
              className="inline-flex min-h-11 items-center rounded-full px-4 py-2 text-sm font-semibold text-rose-900 transition hover:bg-primary-soft/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
