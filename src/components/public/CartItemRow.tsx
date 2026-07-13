import Image from "next/image";
import Link from "next/link";

import type { CartItem } from "@/context/CartContext";
import { formatCurrencyBRL } from "@/lib/money";

type CartItemRowProps = {
  item: CartItem;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
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

export function CartItemRow({ item, onQuantityChange, onRemoveItem }: CartItemRowProps) {
  return (
    <li className="flex flex-col gap-3 py-5 first:pt-0 last:pb-0 sm:flex-row sm:gap-4">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-border bg-surface-soft">
        {item.imageUrl ? (
          <Image
            alt={item.name}
            className="h-full w-full object-cover"
            height={80}
            sizes="80px"
            src={item.imageUrl}
            width={80}
          />
        ) : (
          <div className="flex h-full items-center justify-center px-2 text-center text-xs font-semibold text-rose-900">
            Sem foto
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <Link
          className="block truncate font-semibold text-foreground underline-offset-4 hover:text-primary hover:underline"
          href={`/produto/${item.slug}`}
        >
          {item.name}
        </Link>

        <p className="mt-1 text-sm font-medium text-rose-900">{formatItemPrice(item)}</p>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1">
            <button
              aria-label={`Diminuir quantidade de ${item.name}`}
              className="flex size-11 items-center justify-center rounded-full border border-border bg-surface text-zinc-800 transition hover:border-rose-300 hover:bg-primary-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
              disabled={item.quantity <= 1}
              onClick={() => onQuantityChange(item.productId, item.quantity - 1)}
              type="button"
            >
              -
            </button>

            <span
              aria-label={`Quantidade: ${item.quantity}`}
              className="w-8 text-center text-sm font-semibold tabular-nums text-zinc-950"
            >
              {item.quantity}
            </span>

            <button
              aria-label={`Aumentar quantidade de ${item.name}`}
              className="flex size-11 items-center justify-center rounded-full border border-border bg-surface text-zinc-800 transition hover:border-rose-300 hover:bg-primary-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              onClick={() => onQuantityChange(item.productId, item.quantity + 1)}
              type="button"
            >
              +
            </button>
          </div>

          <div className="flex items-center gap-3">
            <p className="text-sm font-semibold text-zinc-950">{formatItemSubtotal(item)}</p>
            <button
              aria-label={`Remover ${item.name} do carrinho`}
              className="inline-flex min-h-11 items-center rounded-md px-2 text-sm font-semibold text-red-700 underline-offset-2 hover:bg-red-50 hover:text-red-800 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
              onClick={() => onRemoveItem(item.productId)}
              type="button"
            >
              Remover
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
