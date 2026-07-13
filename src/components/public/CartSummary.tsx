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

export function CartSummary({
  estimatedTotal,
  hasOnRequestItems,
  items,
  onQuantityChange,
  onRemoveItem,
}: CartSummaryProps) {
  return (
    <aside aria-labelledby="cart-summary-title">
      <div className="rounded-2xl border border-border bg-surface p-4 shadow-soft sm:p-6 md:sticky md:top-24">
        <h2
          id="cart-summary-title"
          className="font-display text-xl font-semibold tracking-tight text-foreground"
        >
          Resumo do pedido
        </h2>

        <ul className="mt-4 divide-y divide-border" role="list">
          {items.map((item) => (
            <CartItemRow
              item={item}
              key={item.productId}
              onQuantityChange={onQuantityChange}
              onRemoveItem={onRemoveItem}
            />
          ))}
        </ul>

        <div className="mt-4 border-t border-border pt-4">
          {estimatedTotal > 0 ? (
            <div className="flex justify-between gap-3">
              <span className="font-semibold text-foreground">Total estimado</span>
              <span className="font-bold text-rose-900">{formatCurrencyBRL(estimatedTotal)}</span>
            </div>
          ) : (
            <div className="flex justify-between gap-3">
              <span className="font-semibold text-foreground">Total estimado</span>
              <span className="font-bold text-rose-900">Sob consulta</span>
            </div>
          )}

          {hasOnRequestItems ? (
            <p className="mt-3 text-xs leading-5 text-muted">
              Alguns produtos estão sob consulta. O valor final será confirmado pela floricultura.
            </p>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
