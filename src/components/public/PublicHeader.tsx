"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const navigationItems = [
  { href: "/", label: "Início" },
  { href: "/produtos", label: "Produtos" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
  { href: "/carrinho", label: "Meu pedido" },
] as const;

interface PublicHeaderProps {
  businessName: string;
}

export function PublicHeader({ businessName }: PublicHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const id = setTimeout(() => {
      setIsMenuOpen(false);
    }, 0);
    return () => clearTimeout(id);
  }, [pathname]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        hamburgerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen]);

  return (
    <header className="border-b border-rose-100 bg-white text-zinc-950">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 sm:px-8">
        <Link
          className="text-base font-bold text-rose-900 transition hover:text-rose-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose-700 sm:text-lg"
          href="/"
        >
          {businessName}
        </Link>

        {/* Hambúrguer — visível apenas em < lg */}
        <button
          ref={hamburgerRef}
          aria-controls="main-nav"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-zinc-700 transition hover:bg-rose-50 hover:text-rose-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700 lg:hidden"
          onClick={() => setIsMenuOpen((v) => !v)}
          type="button"
        >
          {isMenuOpen ? (
            <svg
              aria-hidden="true"
              fill="none"
              height="20"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line x1="18" x2="6" y1="6" y2="18" />
              <line x1="6" x2="18" y1="6" y2="18" />
            </svg>
          ) : (
            <svg
              aria-hidden="true"
              fill="none"
              height="20"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line x1="3" x2="21" y1="6" y2="6" />
              <line x1="3" x2="21" y1="12" y2="12" />
              <line x1="3" x2="21" y1="18" y2="18" />
            </svg>
          )}
        </button>

        {/* Nav desktop — hidden em < lg */}
        <nav
          aria-label="Navegação principal"
          className="hidden lg:flex lg:flex-wrap lg:gap-2"
        >
          {navigationItems.map((item) => (
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-md px-3.5 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-rose-50 hover:text-rose-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700 sm:text-base"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Nav mobile — controlada por isMenuOpen, hidden em lg+ */}
      <nav
        aria-label="Navegação principal"
        className={`${isMenuOpen ? "block" : "hidden"} border-t border-rose-100 bg-white lg:hidden`}
        id="main-nav"
      >
        <ul className="flex flex-col px-6 py-3 sm:px-8">
          {navigationItems.map((item) => (
            <li key={item.href}>
              <Link
                className="inline-flex min-h-11 w-full items-center rounded-md px-3.5 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-rose-50 hover:text-rose-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
