import type { ReactNode } from "react";

import { PublicFooter } from "@/components/public/PublicFooter";
import { PublicHeader } from "@/components/public/PublicHeader";
import { WhatsAppFloatingButton } from "@/components/public/WhatsAppFloatingButton";
import { CartProvider } from "@/context/CartContext";
import { getSettings } from "@/server/settings";

type PublicLayoutProps = Readonly<{
  children: ReactNode;
}>;

export const dynamic = "force-dynamic";

function getBusinessName(value: string | null | undefined): string {
  const businessName = value?.trim();

  return businessName || "Floricultura";
}

export default async function PublicLayout({ children }: PublicLayoutProps) {
  const settings = await getSettings();
  const businessName = getBusinessName(settings.businessName);

  return (
    <CartProvider>
      <a
        className="fixed left-4 top-4 z-50 -translate-y-24 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-white shadow-lifted transition focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-rose-300"
        href="#conteudo-principal"
      >
        Pular para o conteúdo
      </a>
      <PublicHeader businessName={businessName} />
      <main className="min-h-screen" id="conteudo-principal" tabIndex={-1}>
        {children}
      </main>
      <PublicFooter businessName={businessName} settings={settings} />
      <WhatsAppFloatingButton whatsappNumber={settings.whatsappNumber} />
    </CartProvider>
  );
}
