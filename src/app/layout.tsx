import type { Metadata } from "next";
import type { ReactNode } from "react";

import { getSiteUrl } from "@/lib/site-url";
import { getSettings, type PublicSettings } from "@/server/settings";

import "./globals.css";

const fallbackBusinessName = "Floricultura";

function getTrimmedValue(value: string | null | undefined): string | null {
  const trimmedValue = value?.trim();

  return trimmedValue ? trimmedValue : null;
}

function getBusinessName(settings: PublicSettings): string {
  return getTrimmedValue(settings.businessName) ?? fallbackBusinessName;
}

function getDefaultTitle(settings: PublicSettings): string {
  return (
    getTrimmedValue(settings.seoDefaultTitle) ??
    `${getBusinessName(settings)} | Flores, buquês e arranjos especiais`
  );
}

function getDefaultDescription(settings: PublicSettings): string {
  return (
    getTrimmedValue(settings.seoDefaultDescription) ??
    `${getBusinessName(settings)} com flores, buquês e arranjos especiais para pedir pelo WhatsApp.`
  );
}

function getOgImages(settings: PublicSettings): Array<{ url: string }> | undefined {
  const ogImageUrl = getTrimmedValue(settings.ogImageUrl);

  return ogImageUrl ? [{ url: ogImageUrl }] : undefined;
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = getDefaultTitle(settings);
  const description = getDefaultDescription(settings);
  const businessName = getBusinessName(settings);
  const ogImages = getOgImages(settings);

  return {
    metadataBase: getSiteUrl(),
    title,
    description,
    openGraph: {
      title,
      description,
      images: ogImages,
      locale: "pt_BR",
      siteName: businessName,
      type: "website",
    },
    twitter: {
      card: ogImages ? "summary_large_image" : "summary",
      title,
      description,
      images: ogImages,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
