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

export const dynamic = "force-dynamic";

const actionLinkBaseClasses =
  "inline-flex min-h-12 items-center justify-center rounded-full px-7 py-3 text-base font-semibold transition duration-200 active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

const actionLinkVariantClasses: Record<ActionLinkVariant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-soft hover:bg-primary-hover focus-visible:outline-primary",
  outline:
    "border border-rose-200 bg-surface text-primary hover:border-rose-300 hover:bg-primary-soft focus-visible:outline-primary",
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
      <section className="container-page py-14 sm:py-16 lg:py-20">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Sobre a floricultura
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
            Sobre a {businessName}
          </h1>
          <p className="mt-5 text-base leading-7 text-muted sm:text-lg sm:leading-8">
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

      <section className="bg-surface">
        <div className="container-page grid gap-8 py-14 md:grid-cols-[0.9fr_1.1fr] md:items-start lg:py-16">
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800">
              Atendimento local
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {ownerName
                ? `${ownerName} cuida dos detalhes da floricultura`
                : "Flores e presentes com atendimento próximo"}
            </h2>
            {ownerPhotoUrl ? (
              <div className="max-w-xs overflow-hidden rounded-[2rem] border border-emerald-100 bg-surface-sage shadow-soft">
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

          <div className="space-y-5 text-base leading-7 text-muted">
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

      <section className="bg-surface-sage">
        <div className="container-page py-14 lg:py-16">
          <dl className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-emerald-100 bg-surface/85 p-5 shadow-soft">
              <dt className="text-sm font-medium text-zinc-500">Região</dt>
              <dd className="mt-1 text-lg font-semibold text-foreground">{cityState}</dd>
            </div>
            <div className="rounded-2xl border border-rose-100 bg-surface/85 p-5 shadow-soft">
              <dt className="text-sm font-medium text-zinc-500">Atendimento</dt>
              <dd className="mt-1 text-lg font-semibold text-foreground">Pelo WhatsApp</dd>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-surface/85 p-5 shadow-soft">
              <dt className="text-sm font-medium text-zinc-500">Pedido</dt>
              <dd className="mt-1 text-lg font-semibold text-foreground">
                Confirmado pela loja
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </>
  );
}
