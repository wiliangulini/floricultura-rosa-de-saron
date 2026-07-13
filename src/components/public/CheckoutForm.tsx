"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";

import { CartSummary } from "@/components/public/CartSummary";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useCart } from "@/context/CartContext";
import { loadReviewedCheckout, saveReviewedCheckout } from "@/lib/checkout-storage";
import { cn } from "@/lib/cn";
import {
  buildOrderWhatsAppMessage,
  createWhatsappUrl,
  type CheckoutFormData,
  type FulfillmentMode,
} from "@/lib/whatsapp";

type CheckoutFormProps = {
  whatsappNumber: string;
};

export function CheckoutForm({ whatsappNumber }: CheckoutFormProps) {
  const { items, removeItem, updateQuantity, getTotal } = useCart();
  const { estimatedTotal, hasOnRequestItems } = getTotal();
  const hasWhatsappNumber = Boolean(whatsappNumber.trim().replace(/\D/g, ""));

  const [customerName, setCustomerName] = useState("");
  const [desiredDate, setDesiredDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cardMessage, setCardMessage] = useState("");
  const [notes, setNotes] = useState("");
  const [customerNameError, setCustomerNameError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [fulfillmentMode, setFulfillmentMode] = useState<FulfillmentMode | "">("");
  const [fulfillmentModeError, setFulfillmentModeError] = useState("");
  const [street, setStreet] = useState("");
  const [streetError, setStreetError] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [houseNumberError, setHouseNumberError] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [neighborhoodError, setNeighborhoodError] = useState("");
  const [city, setCity] = useState("");
  const [cityError, setCityError] = useState("");
  const [referencePoint, setReferencePoint] = useState("");
  const [referencePointError, setReferencePointError] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactPhoneError, setContactPhoneError] = useState("");

  const hasLoadedRef = useRef(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      hasLoadedRef.current = true;
      const saved = loadReviewedCheckout();
      if (!saved) return;
      setCustomerName(saved.customerName);
      setDesiredDate(saved.desiredDate);
      setPaymentMethod(saved.paymentMethod);
      setCardMessage(saved.cardMessage);
      setNotes(saved.notes);
      setFulfillmentMode(saved.fulfillmentMode);
      setStreet(saved.street);
      setHouseNumber(saved.houseNumber);
      setNeighborhood(saved.neighborhood);
      setCity(saved.city);
      setReferencePoint(saved.referencePoint);
      setContactPhone(saved.contactPhone);
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

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
        description="Adicione produtos ao carrinho para revisar seu pedido antes do envio."
        title="Seu carrinho está vazio"
      />
    );
  }

  function handleCustomerNameChange(event: ChangeEvent<HTMLInputElement>) {
    setCustomerName(event.target.value);
    if (customerNameError) setCustomerNameError("");
    if (successMessage) setSuccessMessage("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!hasWhatsappNumber) {
      return;
    }

    if (!customerName.trim()) {
      setCustomerNameError("Informe seu nome para enviar o pedido.");
      setSuccessMessage("");
      return;
    }

    if (!fulfillmentMode) {
      setFulfillmentModeError("Selecione a modalidade do pedido.");
      return;
    }

    if (fulfillmentMode === "delivery") {
      let hasDeliveryError = false;

      if (!street.trim()) {
        setStreetError("Informe a rua.");
        hasDeliveryError = true;
      }
      if (!houseNumber.trim()) {
        setHouseNumberError("Informe o número.");
        hasDeliveryError = true;
      }
      if (!neighborhood.trim()) {
        setNeighborhoodError("Informe o bairro.");
        hasDeliveryError = true;
      }
      if (!city.trim()) {
        setCityError("Informe a cidade.");
        hasDeliveryError = true;
      }
      if (!referencePoint.trim()) {
        setReferencePointError("Informe o ponto de referência.");
        hasDeliveryError = true;
      }
      if (!contactPhone.trim()) {
        setContactPhoneError("Informe o telefone para contato.");
        hasDeliveryError = true;
      }

      if (hasDeliveryError) return;
    }

    const checkoutData: CheckoutFormData = {
      customerName: customerName.trim(),
      desiredDate,
      paymentMethod,
      cardMessage,
      notes,
      fulfillmentMode,
      street,
      houseNumber,
      neighborhood,
      city,
      referencePoint,
      contactPhone,
    };

    saveReviewedCheckout(checkoutData);

    const message = buildOrderWhatsAppMessage(items, checkoutData);
    const url = createWhatsappUrl({ phoneNumber: whatsappNumber, message });
    window.open(url, "_blank", "noopener,noreferrer");
    setSuccessMessage("Pedido aberto no WhatsApp. Seu carrinho continua salvo.");
  }

  return (
    <form className="grid gap-6 md:grid-cols-[1fr_400px]" onSubmit={handleSubmit}>
      <section
        aria-labelledby="checkout-form-title"
        className="order-2 rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-8 lg:order-1"
      >
        <div className="mb-6">
          <h2
            id="checkout-form-title"
            className="font-display text-2xl font-semibold tracking-tight text-foreground"
          >
            Dados para confirmação
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            A floricultura vai confirmar os detalhes pelo WhatsApp antes de fechar o pedido.
          </p>
        </div>

        <div className="grid gap-5">
          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-zinc-900">
              Modalidade <span aria-hidden="true">*</span>
            </legend>
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
              {(["pickup", "delivery"] as const).map((mode) => {
                const label = mode === "pickup" ? "Retirar na Loja" : "Receber em casa";
                const inputId = `fulfillment-${mode}`;
                return (
                  <label
                    key={mode}
                    htmlFor={inputId}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-medium transition sm:px-4 sm:py-3",
                      fulfillmentMode === mode
                        ? "border-primary bg-primary-soft text-rose-900 ring-1 ring-primary"
                        : "border-border bg-surface text-zinc-700 hover:border-rose-300 hover:bg-primary-soft/60",
                    )}
                  >
                    <input
                      aria-describedby={fulfillmentModeError ? "fulfillment-error" : undefined}
                      checked={fulfillmentMode === mode}
                      className="sr-only"
                      id={inputId}
                      name="fulfillmentMode"
                      onChange={() => {
                        setFulfillmentMode(mode);
                        if (fulfillmentModeError) setFulfillmentModeError("");
                      }}
                      type="radio"
                      value={mode}
                    />
                    {label}
                  </label>
                );
              })}
            </div>
            {fulfillmentModeError ? (
              <p className="mt-2 text-sm text-red-700" id="fulfillment-error" role="alert">
                {fulfillmentModeError}
              </p>
            ) : null}
          </fieldset>

          <div
            className={cn(
              "grid gap-5 overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out",
              fulfillmentMode === "delivery" ? "max-h-200 opacity-100" : "max-h-0 opacity-0",
            )}
          >
            <Input
              error={streetError}
              label="Rua *"
              name="street"
              onChange={(e) => {
                setStreet(e.target.value);
                if (streetError) setStreetError("");
              }}
              placeholder="Nome da rua ou avenida"
              required={fulfillmentMode === "delivery"}
              value={street}
            />

            <Input
              error={houseNumberError}
              label="Número da casa *"
              name="houseNumber"
              onChange={(e) => {
                setHouseNumber(e.target.value);
                if (houseNumberError) setHouseNumberError("");
              }}
              placeholder="Ex.: 123, s/n"
              required={fulfillmentMode === "delivery"}
              value={houseNumber}
            />

            <Input
              error={neighborhoodError}
              label="Bairro *"
              name="neighborhood"
              onChange={(e) => {
                setNeighborhood(e.target.value);
                if (neighborhoodError) setNeighborhoodError("");
              }}
              placeholder="Nome do bairro"
              required={fulfillmentMode === "delivery"}
              value={neighborhood}
            />

            <Input
              error={cityError}
              label="Cidade *"
              name="city"
              onChange={(e) => {
                setCity(e.target.value);
                if (cityError) setCityError("");
              }}
              placeholder="Nome da cidade"
              required={fulfillmentMode === "delivery"}
              value={city}
            />

            <Input
              error={referencePointError}
              label="Ponto de referência *"
              name="referencePoint"
              onChange={(e) => {
                setReferencePoint(e.target.value);
                if (referencePointError) setReferencePointError("");
              }}
              placeholder="Ex.: próximo ao mercado central"
              required={fulfillmentMode === "delivery"}
              value={referencePoint}
            />

            <Input
              error={contactPhoneError}
              label="Telefone para contato *"
              name="contactPhone"
              onChange={(e) => {
                setContactPhone(e.target.value);
                if (contactPhoneError) setContactPhoneError("");
              }}
              placeholder="Ex.: (11) 9 9999-9999"
              required={fulfillmentMode === "delivery"}
              type="tel"
              value={contactPhone}
            />
          </div>

          <Input
            autoComplete="name"
            error={customerNameError}
            label="Seu nome *"
            name="customerName"
            onChange={handleCustomerNameChange}
            placeholder="Seu nome"
            required
            type="text"
            value={customerName}
          />

          <Input
            label="Data ou horário desejado"
            name="desiredDate"
            onChange={(e) => setDesiredDate(e.target.value)}
            placeholder="Ex.: hoje à tarde, 15/07 pela manhã"
            type="text"
            value={desiredDate}
          />

          <Input
            label="Como pretende pagar"
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
            label="Observações para a loja"
            name="notes"
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Preferências, cuidados especiais ou outras informações"
            rows={4}
            value={notes}
          />
        </div>

        <Button
          className="mt-8 w-full sm:w-auto"
          disabled={!hasWhatsappNumber}
          size="lg"
          type="submit"
          variant="primary"
        >
          {hasWhatsappNumber ? "Enviar pedido pelo WhatsApp" : "WhatsApp indisponível"}
        </Button>

        {successMessage ? (
          <p className="mt-3 text-sm font-medium leading-5 text-success" role="status">
            {successMessage}
          </p>
        ) : null}

        <p className="mt-3 text-sm leading-5 text-muted">
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
