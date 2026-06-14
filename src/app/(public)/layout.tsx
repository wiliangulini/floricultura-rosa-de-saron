import type { ReactNode } from "react";
import Link from "next/link";

import { WhatsAppFloatingButton } from "@/components/public/WhatsAppFloatingButton";
import { getSettings } from "@/server/settings";

type PublicLayoutProps = Readonly<{
  children: ReactNode;
}>;

const publicNavigationItems = [
  { href: "/", label: "Início" },
  { href: "/produtos", label: "Produtos" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
  { href: "/carrinho", label: "Meu pedido" },
] as const;

function getBusinessName(value: string | null | undefined): string {
  const businessName = value?.trim();

  return businessName || "Floricultura";
}

export default async function PublicLayout({ children }: PublicLayoutProps) {
  const settings = await getSettings();
  const businessName = getBusinessName(settings.businessName);

  return (
    <>
      <a
        className="fixed left-4 top-4 z-50 -translate-y-24 rounded-md bg-zinc-950 px-4 py-3 text-sm font-semibold text-white shadow-lg transition focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-rose-300"
        href="#conteudo-principal"
      >
        Pular para o conteúdo
      </a>
      <header className="border-b border-rose-100 bg-white text-zinc-950">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <Link
            className="text-lg font-bold text-rose-900 transition hover:text-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose-700"
            href="/"
          >
            {businessName}
          </Link>

          <nav aria-label="Navegação principal" className="flex flex-wrap gap-2">
            {publicNavigationItems.map((item) => (
              <Link
                className="inline-flex min-h-11 items-center justify-center rounded-md px-3.5 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-rose-50 hover:text-rose-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700 sm:text-base"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main
        className="min-h-screen bg-rose-50 text-zinc-950"
        id="conteudo-principal"
        tabIndex={-1}
      >
        {children}
      </main>
      <footer className="border-t border-rose-100 bg-white text-zinc-700">
        <div className="mx-auto w-full max-w-6xl px-6 py-8 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-bold text-zinc-950">{businessName}</p>
              {settings.address && (
                <p className="mt-1 text-sm">{settings.address}</p>
              )}
              {(settings.city || settings.state) && (
                <p className="text-sm">
                  {[settings.city, settings.state].filter(Boolean).join(" — ")}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1 text-sm">
              {settings.phone && (
                <a
                  className="hover:text-rose-700 hover:underline"
                  href={`tel:${settings.phone.replace(/\D/g, "")}`}
                >
                  {settings.phone}
                </a>
              )}
              {settings.whatsappNumber && (
                <a
                  className="hover:text-rose-700 hover:underline"
                  href={`https://wa.me/${settings.whatsappNumber}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  WhatsApp: {settings.whatsappNumber}
                </a>
              )}
              {settings.openingHours && (
                <p>{settings.openingHours}</p>
              )}
            </div>
          </div>
          <p className="mt-6 text-center text-xs text-zinc-400">
            © {new Date().getFullYear()} {businessName}
          </p>
        </div>
      </footer>
      <WhatsAppFloatingButton whatsappNumber={settings.whatsappNumber} />
    </>
  );
}
