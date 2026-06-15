import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import { createWhatsappUrl } from "@/lib/whatsapp";
import { getSettings, type PublicSettings } from "@/server/settings";

const fallbackBusinessName = "Floricultura";
const fallbackCityName = "sua cidade";

type ActionLinkVariant = "primary" | "outline";

type ActionLinkProps = {
  children: ReactNode;
  className?: string;
  external?: boolean;
  href: string | null;
  variant?: ActionLinkVariant;
};

type PageMetadataContent = {
  description: string;
  title: string;
};

const actionLinkBaseClasses =
  "inline-flex min-h-12 items-center justify-center rounded-md px-6 py-3 text-base font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

const actionLinkVariantClasses: Record<ActionLinkVariant, string> = {
  primary:
    "bg-rose-700 text-white shadow-sm shadow-rose-900/10 hover:bg-rose-800 focus-visible:outline-rose-700",
  outline:
    "border border-rose-300 bg-white/85 text-rose-900 hover:border-rose-500 hover:bg-rose-50 focus-visible:outline-rose-700",
};

function getTrimmedValue(value: string | null | undefined): string | null {
  const trimmedValue = value?.trim();

  return trimmedValue ? trimmedValue : null;
}

function getBusinessName(settings: PublicSettings): string {
  return getTrimmedValue(settings.businessName) ?? fallbackBusinessName;
}

function getCityName(settings: PublicSettings): string {
  return getTrimmedValue(settings.city) ?? fallbackCityName;
}

function getStateName(settings: PublicSettings): string | null {
  return getTrimmedValue(settings.state);
}

function getSeoLocation(settings: PublicSettings): string {
  const cityName = getCityName(settings);
  const stateName = getStateName(settings);

  return stateName ? `${cityName} - ${stateName}` : cityName;
}

function getCityStateLabel(settings: PublicSettings): string {
  const cityName = getTrimmedValue(settings.city);
  const stateName = getStateName(settings);

  if (cityName && stateName) {
    return `${cityName} - ${stateName}`;
  }

  return cityName ?? stateName ?? "Atendimento local";
}

function getOgImages(settings: PublicSettings): Array<{ url: string }> | undefined {
  const ogImageUrl = getTrimmedValue(settings.ogImageUrl);

  return ogImageUrl ? [{ url: ogImageUrl }] : undefined;
}

function getAboutMetadata(settings: PublicSettings): PageMetadataContent {
  const businessName = getBusinessName(settings);
  const seoLocation = getSeoLocation(settings);

  return {
    title: `Sobre a ${businessName} | Floricultura em ${seoLocation}`,
    description: `Conheça a ${businessName}, floricultura em ${seoLocation} com flores, buquês e arranjos para presentes e ocasiões especiais.`,
  };
}

function createAboutWhatsappMessage(settings: PublicSettings): string {
  return [
    `Olá! Vim pelo site da ${getBusinessName(settings)} e gostaria de conhecer as opções da floricultura.`,
    `Procuro flores, buquês ou arranjos em ${getCityName(settings)}.`,
    "Sei que valores, disponibilidade, entrega e pagamento serão confirmados pela loja.",
  ].join("\n\n");
}

function getWhatsappHref(settings: PublicSettings): string | null {
  const whatsappNumber = getTrimmedValue(settings.whatsappNumber);
  const whatsappDigits = whatsappNumber?.replace(/\D/g, "");

  if (!whatsappNumber || !whatsappDigits) {
    return null;
  }

  return createWhatsappUrl({
    phoneNumber: whatsappNumber,
    message: createAboutWhatsappMessage(settings),
  });
}

function ActionLink({
  children,
  className,
  external = false,
  href,
  variant = "primary",
}: ActionLinkProps) {
  const classes = cn(actionLinkBaseClasses, actionLinkVariantClasses[variant], className);

  if (!href) {
    return (
      <span aria-disabled="true" className={cn(classes, "cursor-not-allowed opacity-60")}>
        {children}
      </span>
    );
  }

  if (external) {
    return (
      <a className={classes} href={href} rel="noopener noreferrer" target="_blank">
        {children}
      </a>
    );
  }

  return (
    <Link className={classes} href={href}>
      {children}
    </Link>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const { title, description } = getAboutMetadata(settings);
  const ogImages = getOgImages(settings);

  return {
    title,
    description,
    alternates: { canonical: "/sobre" },
    openGraph: {
      title,
      description,
      images: ogImages,
      locale: "pt_BR",
      siteName: getBusinessName(settings),
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

export default async function SobrePage() {
  const settings = await getSettings();
  const businessName = getBusinessName(settings);
  const cityName = getCityName(settings);
  const cityState = getCityStateLabel(settings);
  const neighborhood = getTrimmedValue(settings.neighborhood);
  const deliveryDescription = getTrimmedValue(settings.deliveryDescription);
  const ownerName = getTrimmedValue(settings.ownerName);
  const ownerDescription = getTrimmedValue(settings.ownerDescription);
  const ownerPhotoUrl = getTrimmedValue(settings.ownerPhotoUrl);
  const whatsappHref = getWhatsappHref(settings);

  return (
    <>
      <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-8 lg:py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-rose-800">
            Sobre a floricultura
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
            Sobre a {businessName}
          </h1>
          <p className="mt-5 text-lg leading-8 text-zinc-700">
            A {businessName} atende clientes em {cityName}
            {neighborhood ? `, especialmente na região de ${neighborhood}` : ""}, com flores,
            buquês e arranjos preparados para presentear com cuidado em momentos especiais.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ActionLink className="w-full sm:w-auto" href="/produtos">
              Ver produtos
            </ActionLink>
            <ActionLink
              className="w-full sm:w-auto"
              external
              href={whatsappHref}
              variant="outline"
            >
              Falar no WhatsApp
            </ActionLink>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-14 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:py-16">
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase text-emerald-900">Atendimento local</p>
            <h2 className="mt-3 text-3xl font-bold text-zinc-950 sm:text-4xl">
              {ownerName
                ? `${ownerName} cuida dos detalhes da floricultura`
                : "Flores e presentes com atendimento próximo"}
            </h2>
            {ownerPhotoUrl ? (
              <div className="max-w-xs overflow-hidden rounded-lg border border-emerald-100 bg-emerald-50 shadow-sm shadow-emerald-950/5">
                <Image
                  alt={ownerName ? `Foto de ${ownerName}` : "Foto da proprietária"}
                  className="aspect-square h-auto w-full object-cover"
                  height={640}
                  sizes="(min-width: 1024px) 320px, 80vw"
                  src={ownerPhotoUrl}
                  width={640}
                />
              </div>
            ) : null}
          </div>

          <div className="space-y-5 text-base leading-7 text-zinc-700">
            {ownerDescription ? (
              <p>{ownerDescription}</p>
            ) : (
              <p>
                A loja reúne opções de flores, buquês e arranjos para aniversários, homenagens,
                agradecimentos e gestos de carinho no dia a dia.
              </p>
            )}
            <p>
              O pedido é conversado diretamente pelo WhatsApp, onde a floricultura confirma
              valores, disponibilidade, entrega, retirada e forma de pagamento antes da finalização.
            </p>
            <p>
              {settings.deliveryAvailable
                ? deliveryDescription ??
                  "A entrega pode ser combinada diretamente com a loja durante o atendimento."
                : "Retirada, entrega e disponibilidade são combinadas diretamente com a loja durante o atendimento."}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-emerald-50">
        <div className="mx-auto w-full max-w-6xl px-6 py-14 sm:px-8 lg:py-16">
          <dl className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-emerald-100 bg-white/85 p-5 shadow-sm shadow-emerald-950/5">
              <dt className="text-sm font-medium text-zinc-500">Região</dt>
              <dd className="mt-1 text-lg font-semibold text-zinc-950">{cityState}</dd>
            </div>
            <div className="rounded-lg border border-rose-100 bg-white/85 p-5 shadow-sm shadow-rose-950/5">
              <dt className="text-sm font-medium text-zinc-500">Atendimento</dt>
              <dd className="mt-1 text-lg font-semibold text-zinc-950">Pelo WhatsApp</dd>
            </div>
            <div className="rounded-lg border border-amber-100 bg-white/85 p-5 shadow-sm shadow-amber-950/5">
              <dt className="text-sm font-medium text-zinc-500">Pedido</dt>
              <dd className="mt-1 text-lg font-semibold text-zinc-950">
                Confirmado pela loja
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </>
  );
}
