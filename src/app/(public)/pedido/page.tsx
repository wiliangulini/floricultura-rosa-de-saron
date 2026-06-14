import type { Metadata } from "next";
import Link from "next/link";

import { CheckoutForm } from "@/components/public/CheckoutForm";
import { CartProvider } from "@/context/CartContext";
import { getSettings } from "@/server/settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Finalizar Pedido",
  description:
    "Revise os produtos do carrinho e preencha os dados para enviar o pedido pelo WhatsApp da floricultura.",
  robots: { index: false },
};

export default async function PedidoPage() {
  const settings = await getSettings();

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-8 sm:py-16">
      <nav aria-label="Navegação" className="mb-8 text-sm text-zinc-500">
        <Link className="hover:text-rose-700 hover:underline" href="/produtos">
          Produtos
        </Link>
        <span aria-hidden="true" className="mx-2">
          /
        </span>
        <Link className="hover:text-rose-700 hover:underline" href="/carrinho">
          Meu pedido
        </Link>
        <span aria-hidden="true" className="mx-2">
          /
        </span>
        <span className="text-zinc-950">Dados do pedido</span>
      </nav>

      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-rose-800">
          Pedido
        </p>
        <h1 className="mt-4 text-3xl font-bold text-zinc-950 sm:text-4xl">
          Revise e preencha seus dados
        </h1>
        <p className="mt-4 text-base leading-7 text-zinc-700">
          Confira os produtos escolhidos e informe os dados principais para a floricultura
          confirmar valores, disponibilidade, entrega e pagamento.
        </p>
      </div>

      <CartProvider>
        <CheckoutForm whatsappNumber={settings.whatsappNumber} />
      </CartProvider>
    </div>
  );
}
