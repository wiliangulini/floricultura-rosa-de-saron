import type { Metadata } from "next";
import Link from "next/link";

import { CheckoutForm } from "@/components/public/CheckoutForm";
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
    <div className="container-page py-12 sm:py-16">
      <nav aria-label="Navegação" className="mb-8 text-sm text-zinc-500">
        <Link className="rounded-md underline-offset-4 hover:text-primary hover:underline" href="/produtos">
          Produtos
        </Link>
        <span aria-hidden="true" className="mx-2">
          /
        </span>
        <Link className="rounded-md underline-offset-4 hover:text-primary hover:underline" href="/carrinho">
          Meu pedido
        </Link>
        <span aria-hidden="true" className="mx-2">
          /
        </span>
        <span className="text-foreground">Dados do pedido</span>
      </nav>

      <div className="mb-8 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Pedido</p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Revise e preencha seus dados
        </h1>
        <p className="mt-4 text-base leading-7 text-muted">
          Confira os produtos escolhidos e informe os dados principais para a floricultura
          confirmar valores, disponibilidade, entrega e pagamento.
        </p>
      </div>

      <CheckoutForm whatsappNumber={settings.whatsappNumber} />
    </div>
  );
}
