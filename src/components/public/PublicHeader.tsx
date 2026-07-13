"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import { useCart } from "@/context/CartContext";

const navigationItems = [
  { href: "/", label: "Início" },
  { href: "/produtos", label: "Produtos" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
] as const;

interface PublicHeaderProps {
  businessName: string;
}

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  if (href === "/produtos") {
    return (
      pathname === href ||
      pathname.startsWith("/produtos/") ||
      pathname.startsWith("/categoria/") ||
      pathname.startsWith("/produto/")
    );
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function FlowerMark() {
  return (
    <svg
      aria-hidden="true"
      className="size-5 text-primary"
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2.6c1.9 0 3 1.7 3 3.5 0 .5-.1 1-.3 1.5a5 5 0 0 1 1.5-.9c1.7-.6 3.3.3 3.9 2.1.6 1.8-.4 3.3-2.1 3.9-.5.2-1 .2-1.6.2.5.3.9.7 1.2 1.1 1.1 1.5.8 3.3-.7 4.4-1.5 1.1-3.3.7-4.4-.8-.3-.4-.5-.9-.5-1.4-.1.5-.3 1-.6 1.4-1.1 1.5-2.9 1.9-4.4.8-1.5-1.1-1.8-2.9-.7-4.4.3-.4.7-.8 1.2-1.1-.6 0-1.1 0-1.6-.2-1.7-.6-2.7-2.1-2.1-3.9.6-1.8 2.2-2.7 3.9-2.1.6.2 1 .5 1.5.9-.2-.5-.3-1-.3-1.5 0-1.8 1.1-3.5 3.1-3.5Zm0 6.9a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6 8h12l-1.2 11a1.8 1.8 0 0 1-1.8 1.6H9a1.8 1.8 0 0 1-1.8-1.6L6 8Z" />
      <path d="M9 10V6.5a3 3 0 0 1 6 0V10" />
    </svg>
  );
}

function CartCountBadge({ count }: { count: number }) {
  if (count <= 0) {
    return null;
  }

  return (
    <span
      aria-hidden="true"
      className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-bold leading-none text-primary-foreground"
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

export function PublicHeader({ businessName }: PublicHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const { getItemsCount } = useCart();
  const itemsCount = getItemsCount();
  const cartLabel =
    itemsCount > 0 ? `Meu pedido, ${itemsCount} ${itemsCount === 1 ? "item" : "itens"}` : "Meu pedido";

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
    <header className="sticky top-0 z-40 border-b border-border bg-surface/90 text-foreground backdrop-blur-md">
      <div className="container-page flex items-center justify-between gap-3 py-3">
        <Link
          className="inline-flex min-h-11 items-center gap-2 rounded-md font-display text-lg font-semibold tracking-tight text-rose-900 transition hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:text-xl"
          href="/"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-primary-soft">
            <FlowerMark />
          </span>
          {businessName}
        </Link>

        {/* Nav desktop — hidden em < lg */}
        <nav
          aria-label="Navegação principal"
          className="hidden lg:flex lg:flex-wrap lg:items-center lg:gap-1"
        >
          {navigationItems.map((item) => {
            const isActive = isActivePath(pathname, item.href);

            return (
              <Link
                aria-current={isActive ? "page" : undefined}
                className={`inline-flex min-h-11 items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:text-base ${
                  isActive
                    ? "bg-primary-soft text-rose-900"
                    : "text-zinc-600 hover:bg-primary-soft/60 hover:text-rose-900"
                }`}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          {/* Carrinho — sempre visível, inclusive no mobile */}
          <Link
            aria-current={isActivePath(pathname, "/carrinho") ? "page" : undefined}
            aria-label={cartLabel}
            className={`relative inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:px-4 ${
              isActivePath(pathname, "/carrinho")
                ? "border-rose-200 bg-primary-soft text-rose-900"
                : "border-border bg-surface text-zinc-700 hover:border-rose-200 hover:bg-primary-soft/60 hover:text-rose-900"
            }`}
            href="/carrinho"
          >
            <CartIcon />
            <span className="hidden lg:inline">Meu pedido</span>
            <CartCountBadge count={itemsCount} />
          </Link>

          {/* Hambúrguer — visível apenas em < lg */}
          <button
            ref={hamburgerRef}
            aria-controls="main-nav"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-zinc-700 transition hover:bg-primary-soft hover:text-rose-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:hidden"
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
        </div>
      </div>

      {/* Nav mobile — controlada por isMenuOpen, hidden em lg+ */}
      <nav
        aria-label="Navegação principal"
        className={`${isMenuOpen ? "block" : "hidden"} border-t border-border bg-surface lg:hidden`}
        id="main-nav"
      >
        <ul className="container-page flex flex-col gap-0.5 py-3">
          {navigationItems.map((item) => {
            const isActive = isActivePath(pathname, item.href);

            return (
              <li key={item.href}>
                <Link
                  aria-current={isActive ? "page" : undefined}
                  className={`inline-flex min-h-11 w-full items-center rounded-xl px-3.5 py-2 text-base font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                    isActive
                      ? "bg-primary-soft text-rose-900"
                      : "text-zinc-700 hover:bg-primary-soft/60 hover:text-rose-900"
                  }`}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
          <li>
            <Link
              aria-label={cartLabel}
              className="inline-flex min-h-11 w-full items-center gap-2 rounded-xl px-3.5 py-2 text-base font-semibold text-zinc-700 transition hover:bg-primary-soft/60 hover:text-rose-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              href="/carrinho"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="relative inline-flex">
                <CartIcon />
                <CartCountBadge count={itemsCount} />
              </span>
              Meu pedido
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
