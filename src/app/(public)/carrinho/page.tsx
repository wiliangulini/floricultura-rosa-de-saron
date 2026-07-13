import type { Metadata } from "next";
import Link from "next/link";

import { CartView } from "@/components/public/CartView";
import { getSettings } from "@/server/settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Meu Pedido",
  description:
    "Revise os produtos do seu pedido e envie pelo WhatsApp para a floricultura confirmar disponibilidade, valores e entrega.",
  robots: { index: false },
};

export default async function CarrinhoPage() {
  const settings = await getSettings();

  return (
    <div className="container-page py-12 sm:py-16">
      <nav aria-label="Navegação" className="mb-8 text-sm text-zinc-500">
        <Link className="rounded-md underline-offset-4 hover:text-primary hover:underline" href="/produtos">
          Produtos
        </Link>
        <span aria-hidden="true" className="mx-2">
          /
        </span>
        <span className="text-foreground">Meu pedido</span>
      </nav>

      <h1 className="mb-8 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        Meu pedido
      </h1>

      <CartView whatsappNumber={settings.whatsappNumber} />
    </div>
  );
}
