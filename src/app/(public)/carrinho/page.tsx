import type { Metadata } from "next";
import Link from "next/link";

import { CartView } from "@/components/public/CartView";
import { CartProvider } from "@/context/CartContext";
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
    <main className="min-h-screen bg-rose-50 text-zinc-950">
      <div className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-8 sm:py-16">
        <nav aria-label="Navegação" className="mb-8 text-sm text-zinc-500">
          <Link className="hover:text-rose-700 hover:underline" href="/produtos">
            Produtos
          </Link>
          <span aria-hidden="true" className="mx-2">
            /
          </span>
          <span className="text-zinc-950">Meu pedido</span>
        </nav>

        <h1 className="mb-8 text-3xl font-bold text-zinc-950 sm:text-4xl">Meu pedido</h1>

        <CartProvider>
          <CartView whatsappNumber={settings.whatsappNumber} />
        </CartProvider>
      </div>
    </main>
  );
}
