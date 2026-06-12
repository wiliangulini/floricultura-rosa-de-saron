import { createWhatsappUrl } from "@/lib/whatsapp";

const WHATSAPP_FLOATING_MESSAGE = "Olá! Vim pelo site da floricultura e gostaria de mais informações.";

type WhatsAppFloatingButtonProps = {
  whatsappNumber: string | null;
};

export function WhatsAppFloatingButton({ whatsappNumber }: WhatsAppFloatingButtonProps) {
  const trimmedWhatsappNumber = whatsappNumber?.trim();
  const whatsappDigits = trimmedWhatsappNumber?.replace(/\D/g, "");

  if (!trimmedWhatsappNumber || !whatsappDigits) {
    return null;
  }

  const whatsappUrl = createWhatsappUrl({
    phoneNumber: trimmedWhatsappNumber,
    message: WHATSAPP_FLOATING_MESSAGE,
  });

  return (
    <a
      aria-label="Conversar com a floricultura pelo WhatsApp"
      className="fixed bottom-4 right-4 z-10 inline-flex size-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-zinc-900/20 transition hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
      href={whatsappUrl}
      rel="noopener noreferrer"
      target="_blank"
    >
      <svg
        aria-hidden="true"
        className="size-6"
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.2 18.1 4 19l.9-3.1a8 8 0 1 1 2.3 2.2Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
        <path
          d="M8.9 9.1c.2-.4.4-.4.7-.4h.5c.2 0 .4 0 .5.4l.7 1.6c.1.2.1.4 0 .6l-.5.7a5.4 5.4 0 0 0 2.7 2.4l.7-.6c.2-.1.4-.2.6-.1l1.6.7c.3.1.4.3.4.6v.5c0 .3-.1.6-.4.8-.5.3-1.1.5-1.8.5-3.1 0-7.1-3.7-7.1-7 0-.7.2-1.3.4-1.7Z"
          fill="currentColor"
        />
      </svg>
      <span className="sr-only">Abrir conversa no WhatsApp</span>
    </a>
  );
}
