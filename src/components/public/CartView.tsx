"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useCart, type CartItem } from "@/context/CartContext";
import { formatCurrencyBRL } from "@/lib/money";
import { createWhatsappUrl } from "@/lib/whatsapp";

type CartViewProps = {
  whatsappNumber: string;
};

function formatItemPrice(item: CartItem): string {
  if (item.priceType === "ON_REQUEST" || item.unitPrice === null) {
    return "Sob consulta";
  }

  if (item.priceType === "STARTING_FROM") {
    return `A partir de ${formatCurrencyBRL(item.unitPrice)}`;
  }

  return formatCurrencyBRL(item.unitPrice);
}

function formatItemSubtotal(item: CartItem): string {
  if (item.priceType === "ON_REQUEST" || item.unitPrice === null) {
    return "Sob consulta";
  }

  return formatCurrencyBRL(item.unitPrice * item.quantity);
}

function buildWhatsAppMessage(items: CartItem[], estimatedTotal: number, hasOnRequestItems: boolean): string {
  const lines: string[] = ["Olá! Gostaria de fazer um pedido pelo site.", "", "Produtos:"];

  for (const item of items) {
    const subtotal =
      item.priceType === "ON_REQUEST" || item.unitPrice === null
        ? "Sob consulta"
        : formatCurrencyBRL(item.unitPrice * item.quantity);

    lines.push(`• ${item.name} — ${item.quantity}× — ${subtotal}`);
  }

  lines.push("");

  if (hasOnRequestItems && estimatedTotal > 0) {
    lines.push(`Total estimado: ${formatCurrencyBRL(estimatedTotal)}`);
    lines.push("(Itens sob consulta não estão incluídos no total estimado.)");
  } else if (hasOnRequestItems) {
    lines.push("Total: a confirmar (todos os itens são sob consulta).");
  } else {
    lines.push(`Total estimado: ${formatCurrencyBRL(estimatedTotal)}`);
  }

  lines.push("");
  lines.push(
    "Valores, disponibilidade, entrega e forma de pagamento serão confirmados pela floricultura.",
  );

  return lines.join("\n");
}

export function CartView({ whatsappNumber }: CartViewProps) {
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCart();
  const { estimatedTotal, hasOnRequestItems } = getTotal();

  if (items.length === 0) {
    return (
      <EmptyState
        action={
          <Link href="/produtos">
            <Button variant="primary">Ver produtos</Button>
          </Link>
        }
        description="Adicione produtos para montar seu pedido e enviar pelo WhatsApp."
        title="Seu pedido está vazio"
      />
    );
  }

  function handleSendOrder() {
    const message = buildWhatsAppMessage(items, estimatedTotal, hasOnRequestItems);
    const url = createWhatsappUrl({ phoneNumber: whatsappNumber, message });
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <section aria-label="Itens do pedido">
        <ul className="divide-y divide-rose-100" role="list">
          {items.map((item) => (
            <li className="flex gap-4 py-6 first:pt-0" key={item.productId}>
              <div className="relative size-20 shrink-0 overflow-hidden rounded-md border border-rose-100 bg-rose-50 sm:size-24">
                {item.imageUrl ? (
                  <Image
                    alt={item.name}
                    className="h-full w-full object-cover"
                    height={96}
                    sizes="96px"
                    src={item.imageUrl}
                    width={96}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-rose-400">
                    Sem foto
                  </div>
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <Link
                  className="truncate font-semibold text-zinc-950 hover:text-rose-700"
                  href={`/produto/${item.slug}`}
                >
                  {item.name}
                </Link>

                {item.shortDescription ? (
                  <p className="line-clamp-2 text-sm text-zinc-500">{item.shortDescription}</p>
                ) : null}

                <p className="text-sm font-medium text-rose-900">{formatItemPrice(item)}</p>

                <div className="mt-auto flex items-center justify-between gap-4">
                  <div className="flex items-center gap-1">
                    <button
                      aria-label="Diminuir quantidade"
                      className="flex size-8 items-center justify-center rounded border border-rose-200 bg-white text-zinc-700 transition hover:border-rose-400 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={item.quantity <= 1}
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      type="button"
                    >
                      −
                    </button>

                    <span
                      aria-label={`Quantidade: ${item.quantity}`}
                      className="w-8 text-center text-sm font-semibold tabular-nums text-zinc-950"
                    >
                      {item.quantity}
                    </span>

                    <button
                      aria-label="Aumentar quantidade"
                      className="flex size-8 items-center justify-center rounded border border-rose-200 bg-white text-zinc-700 transition hover:border-rose-400 hover:bg-rose-50"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      type="button"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <p className="text-sm font-semibold text-zinc-950">
                      {formatItemSubtotal(item)}
                    </p>
                    <button
                      aria-label={`Remover ${item.name} do pedido`}
                      className="text-sm text-zinc-400 underline-offset-2 hover:text-red-600 hover:underline"
                      onClick={() => removeItem(item.productId)}
                      type="button"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-4 border-t border-rose-100 pt-4">
          <button
            className="text-sm text-zinc-400 underline-offset-2 hover:text-red-600 hover:underline"
            onClick={clearCart}
            type="button"
          >
            Limpar pedido
          </button>
        </div>
      </section>

      <aside aria-label="Resumo do pedido">
        <div className="rounded-lg border border-rose-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-950">Resumo do pedido</h2>

          <dl className="mt-4 space-y-2 text-sm">
            {items.map((item) => (
              <div className="flex justify-between gap-2" key={item.productId}>
                <dt className="truncate text-zinc-600">
                  {item.name}
                  {item.quantity > 1 ? ` ×${item.quantity}` : ""}
                </dt>
                <dd className="shrink-0 font-medium text-zinc-950">{formatItemSubtotal(item)}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-4 border-t border-rose-100 pt-4">
            {estimatedTotal > 0 ? (
              <div className="flex justify-between gap-2">
                <span className="font-semibold text-zinc-950">Total estimado</span>
                <span className="font-bold text-rose-900">{formatCurrencyBRL(estimatedTotal)}</span>
              </div>
            ) : null}

            {hasOnRequestItems ? (
              <p className="mt-2 text-xs leading-5 text-zinc-500">
                Itens sob consulta não estão incluídos no total estimado. O valor final será
                confirmado pela floricultura.
              </p>
            ) : null}
          </div>

          <Button className="mt-6 w-full" onClick={handleSendOrder} size="lg" variant="primary">
            Enviar pelo WhatsApp
          </Button>

          <p className="mt-3 text-center text-xs leading-5 text-zinc-500">
            Valores, disponibilidade, entrega e pagamento serão confirmados pela floricultura
            diretamente pelo WhatsApp.
          </p>
        </div>
      </aside>
    </div>
  );
}
