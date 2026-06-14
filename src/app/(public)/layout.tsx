import type { ReactNode } from "react";

import { WhatsAppFloatingButton } from "@/components/public/WhatsAppFloatingButton";
import { getSettings } from "@/server/settings";

type PublicLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default async function PublicLayout({ children }: PublicLayoutProps) {
  const settings = await getSettings();

  return (
    <>
      {children}
      <WhatsAppFloatingButton whatsappNumber={settings.whatsappNumber} />
    </>
  );
}
