import type { CartItem } from "@/context/CartContext";
import { formatCurrencyBRL } from "@/lib/money";

export const WHATSAPP_BASE_URL = "https://wa.me";

export type WhatsappMessageOptions = {
  phoneNumber: string;
  message: string;
};

export function buildWhatsAppUrl(phone: string, message: string): string {
  const digitsOnlyPhoneNumber = phone.replace(/\D/g, "");
  const encodedMessage = encodeURIComponent(message);

  return `${WHATSAPP_BASE_URL}/${digitsOnlyPhoneNumber}?text=${encodedMessage}`;
}

export function createWhatsappUrl({ phoneNumber, message }: WhatsappMessageOptions): string {
  return buildWhatsAppUrl(phoneNumber, message);
}

export type CheckoutFormData = {
  customerName: string;
  desiredDate: string;
  paymentMethod: string;
  cardMessage: string;
  notes: string;
};

const ORDER_CONFIRMATION_NOTICE =
  "Pedido sujeito à confirmação de disponibilidade, prazo e pagamento pela floricultura.";

function getTrimmedText(value: string | null): string | null {
  const trimmedValue = value?.trim();

  return trimmedValue ? trimmedValue : null;
}

function getEstimatedOrderTotal(items: CartItem[]): number {
  return items.reduce((total, item) => {
    if (item.priceType === "ON_REQUEST" || item.unitPrice === null) {
      return total;
    }

    return total + item.unitPrice * item.quantity;
  }, 0);
}

function formatItemUnitPrice(item: CartItem): string {
  if (item.priceType === "ON_REQUEST" || item.unitPrice === null) {
    return "Valor sob consulta";
  }

  const formattedPrice = formatCurrencyBRL(item.unitPrice);

  return item.priceType === "STARTING_FROM" ? `A partir de ${formattedPrice}` : formattedPrice;
}

function formatItemSubtotal(item: CartItem): string {
  if (item.priceType === "ON_REQUEST" || item.unitPrice === null) {
    return "Valor sob consulta";
  }

  const formattedSubtotal = formatCurrencyBRL(item.unitPrice * item.quantity);

  return item.priceType === "STARTING_FROM"
    ? `A partir de ${formattedSubtotal}`
    : formattedSubtotal;
}

function getOptionalCheckoutLines(checkoutData: CheckoutFormData): string[] {
  const fields = [
    ["Data ou horário desejado", checkoutData.desiredDate],
    ["Como pretende pagar", checkoutData.paymentMethod],
    ["Mensagem para cartão", checkoutData.cardMessage],
    ["Observações para a loja", checkoutData.notes],
  ] as const;

  return fields.flatMap(([label, value]) => {
    const trimmedValue = getTrimmedText(value);

    return trimmedValue ? [`${label}: ${trimmedValue}`] : [];
  });
}

export function buildOrderWhatsAppMessage(
  items: CartItem[],
  checkoutData: CheckoutFormData,
): string {
  const customerName = getTrimmedText(checkoutData.customerName);
  const estimatedTotal = getEstimatedOrderTotal(items);
  const hasOnRequestItems = items.some((item) => item.priceType === "ON_REQUEST");

  const lines: string[] = ["Olá! Gostaria de fazer um pedido pelo site.", "", "Pedido pelo site"];

  if (customerName) {
    lines.push(`Nome: ${customerName}`);
  }

  lines.push("", "Produtos:");

  for (const item of items) {
    const shortDescription = getTrimmedText(item.shortDescription);

    lines.push(`• ${item.name}`);

    if (shortDescription) {
      lines.push(`  Descrição: ${shortDescription}`);
    }

    lines.push(`  Quantidade: ${item.quantity}`);
    lines.push(`  Preço unitário: ${formatItemUnitPrice(item)}`);
    lines.push(`  Subtotal: ${formatItemSubtotal(item)}`);
  }

  lines.push("", `Total estimado: ${formatCurrencyBRL(estimatedTotal)}`);

  if (hasOnRequestItems) {
    lines.push("Itens com Valor sob consulta não estão incluídos no total estimado.");
  }

  const optionalCheckoutLines = getOptionalCheckoutLines(checkoutData);

  if (optionalCheckoutLines.length > 0) {
    lines.push("", ...optionalCheckoutLines);
  }

  lines.push("", ORDER_CONFIRMATION_NOTICE);

  return lines.join("\n");
}
