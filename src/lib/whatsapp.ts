import type { CartItem } from "@/context/CartContext";
import { formatCurrencyBRL } from "@/lib/money";

export const WHATSAPP_BASE_URL = "https://wa.me";

export type WhatsappMessageOptions = {
  phoneNumber: string;
  message: string;
};

export function createWhatsappUrl({ phoneNumber, message }: WhatsappMessageOptions): string {
  const digitsOnlyPhoneNumber = phoneNumber.replace(/\D/g, "");
  const encodedMessage = encodeURIComponent(message);

  return `${WHATSAPP_BASE_URL}/${digitsOnlyPhoneNumber}?text=${encodedMessage}`;
}

export type CheckoutFormData = {
  customerName: string;
  desiredDate: string;
  paymentMethod: string;
  cardMessage: string;
  notes: string;
};

export function buildCheckoutMessage(
  items: CartItem[],
  formData: CheckoutFormData,
  estimatedTotal: number,
  hasOnRequestItems: boolean,
): string {
  const lines: string[] = [
    "Olá! Gostaria de fazer um pedido pelo site.",
    "",
    `Nome: ${formData.customerName}`,
    "",
    "Produtos:",
  ];

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

  if (formData.paymentMethod.trim()) {
    lines.push("", `Forma de pagamento: ${formData.paymentMethod.trim()}`);
  }

  if (formData.desiredDate.trim()) {
    lines.push(`Data/prazo desejado: ${formData.desiredDate.trim()}`);
  }

  if (formData.cardMessage.trim()) {
    lines.push("", `Mensagem para cartão: ${formData.cardMessage.trim()}`);
  }

  if (formData.notes.trim()) {
    lines.push("", `Observações: ${formData.notes.trim()}`);
  }

  lines.push(
    "",
    "Valores, disponibilidade, entrega e forma de pagamento serão confirmados pela floricultura.",
  );

  return lines.join("\n");
}
