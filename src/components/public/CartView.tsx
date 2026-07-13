"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { useCart, type CartItem } from "@/context/CartContext";
import { loadReviewedCheckout } from "@/lib/checkout-storage";
import { formatCurrencyBRL } from "@/lib/money";
import { buildOrderWhatsAppMessage, createWhatsappUrl } from "@/lib/whatsapp";

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

export function CartView({ whatsappNumber }: CartViewProps) {
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCart();
  const { estimatedTotal, hasOnRequestItems } = getTotal();
  const hasWhatsappNumber = Boolean(whatsappNumber.trim().replace(/\D/g, ""));

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);

  if (items.length === 0) {
    return (
      <EmptyState
        action={
          <Link
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-7 py-3 text-base font-semibold text-primary-foreground shadow-soft transition hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            href="/produtos"
          >
            Ver produtos
          </Link>
        }
        description="Adicione produtos para montar seu pedido e enviar pelo WhatsApp."
        title="Seu pedido está vazio"
      />
    );
  }

  function handleSendOrder() {
    if (!hasWhatsappNumber) {
      return;
    }

    const checkoutData = loadReviewedCheckout();

    if (!checkoutData) {
      setShowReviewModal(true);
      return;
    }

    const message = buildOrderWhatsAppMessage(items, checkoutData);
    const url = createWhatsappUrl({ phoneNumber: whatsappNumber, message });
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function handleConfirmClearCart() {
    clearCart();
    setShowClearModal(false);
  }

  return (
    <>
      {showReviewModal ? (
        <Modal
          description="Antes de enviar pelo WhatsApp, revise nome, modalidade e — se for entrega — endereço completo."
          onClose={() => setShowReviewModal(false)}
          open={showReviewModal}
          title="Preencha os dados do pedido"
          footer={
            <>
              <Button onClick={() => setShowReviewModal(false)} variant="outline">
                Cancelar
              </Button>
              <Link
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 text-base font-semibold text-primary-foreground shadow-soft transition hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                href="/pedido"
              >
                Revise e preencha seus dados
              </Link>
            </>
          }
        >
          <p className="text-sm leading-6 text-muted">
            Preencha nome, modalidade e — se for entrega — endereço completo para que o pedido
            chegue com todas as informações necessárias.
          </p>
        </Modal>
      ) : null}

      {showClearModal ? (
        <Modal
          description="Todos os produtos serão removidos do seu pedido."
          onClose={() => setShowClearModal(false)}
          open={showClearModal}
          role="alertdialog"
          title="Limpar pedido?"
          footer={
            <>
              <Button onClick={() => setShowClearModal(false)} variant="outline">
                Cancelar
              </Button>
              <Button onClick={handleConfirmClearCart} variant="danger">
                Limpar pedido
              </Button>
            </>
          }
        >
          <p className="text-sm leading-6 text-muted">
            Tem certeza que deseja apagar todos os produtos do seu pedido? Essa ação não pode ser
            desfeita.
          </p>
        </Modal>
      ) : null}

      <div className="grid gap-6 md:grid-cols-[1fr_360px]">
        <section aria-label="Itens do pedido">
          <ul className="divide-y divide-border" role="list">
            {items.map((item) => (
              <li className="flex flex-col gap-3 py-6 first:pt-0 sm:flex-row sm:gap-4" key={item.productId}>
                <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-border bg-surface-soft sm:size-24">
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
                    <div className="flex h-full items-center justify-center text-xs font-semibold text-rose-900">
                      Sem foto
                    </div>
                  )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <Link
                    className="truncate font-semibold text-foreground underline-offset-4 hover:text-primary hover:underline"
                    href={`/produto/${item.slug}`}
                  >
                    {item.name}
                  </Link>

                  {item.shortDescription ? (
                    <p className="line-clamp-2 text-sm text-muted">{item.shortDescription}</p>
                  ) : null}

                  <p className="text-sm font-medium text-rose-900">{formatItemPrice(item)}</p>

                  <div className="mt-auto flex items-center justify-between gap-4">
                    <div className="flex items-center gap-1">
                      <button
                        aria-label={`Diminuir quantidade de ${item.name}`}
                        className="flex size-11 items-center justify-center rounded-full border border-border bg-surface text-zinc-800 transition hover:border-rose-300 hover:bg-primary-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={item.quantity <= 1}
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        type="button"
                      >
                        −
                      </button>

                      <span
                        aria-label={`Quantidade: ${item.quantity}`}
                        className="w-8 text-center text-sm font-semibold tabular-nums text-foreground"
                      >
                        {item.quantity}
                      </span>

                      <button
                        aria-label={`Aumentar quantidade de ${item.name}`}
                        className="flex size-11 items-center justify-center rounded-full border border-border bg-surface text-zinc-800 transition hover:border-rose-300 hover:bg-primary-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        type="button"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <p className="text-sm font-semibold text-foreground">
                        {formatItemSubtotal(item)}
                      </p>
                      <button
                        aria-label={`Remover ${item.name} do pedido`}
                        className="inline-flex min-h-11 items-center rounded-md px-2 text-sm font-semibold text-red-700 underline-offset-2 hover:bg-red-50 hover:text-red-800 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
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

          <div className="mt-4 border-t border-border pt-4">
            <button
              className="inline-flex min-h-11 items-center rounded-md px-2 text-sm font-semibold text-red-700 underline-offset-2 hover:bg-red-50 hover:text-red-800 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
              onClick={() => setShowClearModal(true)}
              type="button"
            >
              Limpar pedido
            </button>
          </div>
        </section>

        <aside aria-label="Resumo do pedido">
          <div className="rounded-2xl border border-border bg-surface p-4 shadow-soft sm:p-6 md:sticky md:top-24">
            <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">
              Resumo do pedido
            </h2>

            <dl className="mt-4 space-y-2 text-sm">
              {items.map((item) => (
                <div className="flex justify-between gap-2" key={item.productId}>
                  <dt className="truncate text-muted">
                    {item.name}
                    {item.quantity > 1 ? ` ×${item.quantity}` : ""}
                  </dt>
                  <dd className="shrink-0 font-medium text-foreground">
                    {formatItemSubtotal(item)}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-4 border-t border-border pt-4">
              {estimatedTotal > 0 ? (
                <div className="flex justify-between gap-2">
                  <span className="font-semibold text-foreground">Total estimado</span>
                  <span className="font-bold text-rose-900">
                    {formatCurrencyBRL(estimatedTotal)}
                  </span>
                </div>
              ) : null}

              {hasOnRequestItems ? (
                <p className="mt-2 text-xs leading-5 text-muted">
                  Itens sob consulta não estão incluídos no total estimado. O valor final será
                  confirmado pela floricultura.
                </p>
              ) : null}
            </div>

            <div className="mt-6 grid gap-3">
              <Link
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-primary px-7 py-3 text-base font-semibold text-primary-foreground shadow-soft transition hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                href="/pedido"
              >
                Revisar dados do pedido
              </Link>

              <Button
                className="w-full"
                disabled={!hasWhatsappNumber}
                onClick={handleSendOrder}
                size="lg"
                variant="outline"
              >
                {hasWhatsappNumber ? "Enviar direto pelo WhatsApp" : "WhatsApp indisponível"}
              </Button>
            </div>

            <p className="mt-3 text-center text-xs leading-5 text-muted">
              Valores, disponibilidade, entrega e pagamento serão confirmados pela floricultura
              diretamente pelo WhatsApp.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
