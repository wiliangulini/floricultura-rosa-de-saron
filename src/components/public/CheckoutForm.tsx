"use client";

import Link from "next/link";
import { useState, type ChangeEvent, type FormEvent } from "react";

import { CartSummary } from "@/components/public/CartSummary";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useCart } from "@/context/CartContext";
import { buildCheckoutMessage, createWhatsappUrl } from "@/lib/whatsapp";

type CheckoutFormProps = {
  whatsappNumber: string;
};

export function CheckoutForm({ whatsappNumber }: CheckoutFormProps) {
  const { items, removeItem, updateQuantity, getTotal } = useCart();
  const { estimatedTotal, hasOnRequestItems } = getTotal();

  const [customerName, setCustomerName] = useState("");
  const [desiredDate, setDesiredDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cardMessage, setCardMessage] = useState("");
  const [notes, setNotes] = useState("");
  const [customerNameError, setCustomerNameError] = useState("");

  if (items.length === 0) {
    return (
      <EmptyState
        action={
          <Link href="/produtos">
            <Button variant="primary">Ver produtos</Button>
          </Link>
        }
        description="Adicione produtos ao carrinho para revisar seu pedido antes do envio."
        title="Seu carrinho está vazio"
      />
    );
  }

  function handleCustomerNameChange(event: ChangeEvent<HTMLInputElement>) {
    setCustomerName(event.target.value);
    if (customerNameError) setCustomerNameError("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!customerName.trim()) {
      setCustomerNameError("Informe seu nome para enviar o pedido.");
      return;
    }

    const message = buildCheckoutMessage(
      items,
      { customerName: customerName.trim(), desiredDate, paymentMethod, cardMessage, notes },
      estimatedTotal,
      hasOnRequestItems,
    );

    const url = createWhatsappUrl({ phoneNumber: whatsappNumber, message });
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <form className="grid gap-8 lg:grid-cols-[1fr_400px]" onSubmit={handleSubmit}>
      <section
        aria-labelledby="checkout-form-title"
        className="order-2 rounded-lg border border-rose-200 bg-white p-6 shadow-sm sm:p-8 lg:order-1"
      >
        <div className="mb-6">
          <h2 id="checkout-form-title" className="text-xl font-bold text-zinc-950">
            Dados para confirmação
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            A floricultura vai confirmar os detalhes pelo WhatsApp antes de fechar o pedido.
          </p>
        </div>

        <div className="grid gap-5">
          <Input
            autoComplete="name"
            error={customerNameError}
            label="Nome *"
            name="customerName"
            onChange={handleCustomerNameChange}
            placeholder="Seu nome"
            required
            type="text"
            value={customerName}
          />

          <Input
            label="Data/prazo desejado"
            name="desiredDate"
            onChange={(e) => setDesiredDate(e.target.value)}
            placeholder="Ex.: hoje à tarde, 15/07 pela manhã"
            type="text"
            value={desiredDate}
          />

          <Input
            label="Forma de pagamento"
            name="paymentMethod"
            onChange={(e) => setPaymentMethod(e.target.value)}
            placeholder="Ex.: Pix, cartão, dinheiro"
            type="text"
            value={paymentMethod}
          />

          <Textarea
            label="Mensagem para cartão"
            name="cardMessage"
            onChange={(e) => setCardMessage(e.target.value)}
            placeholder="Texto para acompanhar o presente, se desejar"
            rows={3}
            value={cardMessage}
          />

          <Textarea
            label="Observações gerais"
            name="notes"
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Informe endereço, retirada, preferências ou outros detalhes importantes"
            rows={4}
            value={notes}
          />
        </div>

        <Button className="mt-8 w-full sm:w-auto" size="lg" type="submit" variant="primary">
          Enviar pedido pelo WhatsApp
        </Button>

        <p className="mt-3 text-sm leading-5 text-zinc-500">
          Valores, disponibilidade, entrega e pagamento serão confirmados pela floricultura
          diretamente pelo WhatsApp.
        </p>
      </section>

      <div className="order-1 lg:order-2">
        <CartSummary
          estimatedTotal={estimatedTotal}
          hasOnRequestItems={hasOnRequestItems}
          items={items}
          onQuantityChange={updateQuantity}
          onRemoveItem={removeItem}
        />
      </div>
    </form>
  );
}
