import type { ReactNode } from "react";

import { PublicHeader } from "@/components/public/PublicHeader";
import { WhatsAppFloatingButton } from "@/components/public/WhatsAppFloatingButton";
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
    <>
      <a
        className="fixed left-4 top-4 z-50 -translate-y-24 rounded-md bg-zinc-950 px-4 py-3 text-sm font-semibold text-white shadow-lg transition focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-rose-300"
        href="#conteudo-principal"
      >
        Pular para o conteúdo
      </a>
      <PublicHeader businessName={businessName} />
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
