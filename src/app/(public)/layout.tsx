import type { ReactNode } from "react";

import { WhatsAppFloatingButton } from "@/components/public/WhatsAppFloatingButton";
import { CartProvider } from "@/context/CartContext";
import { getSettings } from "@/server/settings";

export const dynamic = "force-dynamic";

type PublicLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default async function PublicLayout({ children }: PublicLayoutProps) {
  const settings = await getSettings();

  return (
    <CartProvider>
      {children}
      <WhatsAppFloatingButton whatsappNumber={settings.whatsappNumber} />
    </CartProvider>
  );
}
