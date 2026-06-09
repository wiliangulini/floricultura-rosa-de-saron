import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Floricultura",
  description: "Flores, buquês e arranjos especiais",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
