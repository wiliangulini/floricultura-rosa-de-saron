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
