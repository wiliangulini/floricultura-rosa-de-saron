import { CartItemRow } from "@/components/public/CartItemRow";
import type { CartItem } from "@/context/CartContext";
import { formatCurrencyBRL } from "@/lib/money";

type CartSummaryProps = {
  estimatedTotal: number;
  hasOnRequestItems: boolean;
  items: CartItem[];
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
};

function formatItemSubtotal(item: CartItem): string {
  if (item.priceType === "ON_REQUEST" || item.unitPrice === null) {
    return "Sob consulta";
  }

  return formatCurrencyBRL(item.unitPrice * item.quantity);
}

export function CartSummary({
  estimatedTotal,
  hasOnRequestItems,
  items,
  onQuantityChange,
  onRemoveItem,
}: CartSummaryProps) {
  return (
    <aside aria-labelledby="cart-summary-title">
      <div className="rounded-lg border border-rose-200 bg-white p-4 shadow-sm sm:p-6">
        <h2 id="cart-summary-title" className="text-lg font-bold text-zinc-950">
          Resumo do carrinho
        </h2>

        <ul className="mt-4 divide-y divide-rose-100" role="list">
          {items.map((item) => (
            <CartItemRow
              item={item}
              key={item.productId}
              onQuantityChange={onQuantityChange}
              onRemoveItem={onRemoveItem}
            />
          ))}
        </ul>

        <dl className="mt-5 space-y-2 border-t border-rose-100 pt-4 text-sm">
          {items.map((item) => (
            <div className="flex justify-between gap-3" key={item.productId}>
              <dt className="min-w-0 truncate text-zinc-600">
                {item.name}
                {item.quantity > 1 ? ` x${item.quantity}` : ""}
              </dt>
              <dd className="shrink-0 font-medium text-zinc-950">{formatItemSubtotal(item)}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-4 border-t border-rose-100 pt-4">
          {estimatedTotal > 0 ? (
            <div className="flex justify-between gap-3">
              <span className="font-semibold text-zinc-950">Total estimado</span>
              <span className="font-bold text-rose-900">{formatCurrencyBRL(estimatedTotal)}</span>
            </div>
          ) : (
            <div className="flex justify-between gap-3">
              <span className="font-semibold text-zinc-950">Total estimado</span>
              <span className="font-bold text-rose-900">Sob consulta</span>
            </div>
          )}

          {hasOnRequestItems ? (
            <p className="mt-3 text-xs leading-5 text-zinc-500">
              Alguns produtos estão sob consulta. O valor final será confirmado pela floricultura.
            </p>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
