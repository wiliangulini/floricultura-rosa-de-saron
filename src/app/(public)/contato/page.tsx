import type { Metadata } from "next";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import { formatPhoneForDisplay } from "@/lib/format-phone";
import { createWhatsappUrl } from "@/lib/whatsapp";
import { getSettings, type PublicSettings } from "@/server/settings";

const fallbackBusinessName = "Floricultura";
const fallbackCityName = "sua cidade";

type ActionLinkProps = {
  children: ReactNode;
  className?: string;
  href: string | null;
};

type PageMetadataContent = {
  description: string;
  title: string;
};

export const dynamic = "force-dynamic";

const actionLinkClasses =
  "inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-7 py-3 text-base font-semibold text-primary-foreground shadow-soft transition duration-200 hover:bg-primary-hover active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

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

  return cityName ?? stateName ?? "Cidade e estado confirmados pelo WhatsApp";
}

function getAddressLabel(settings: PublicSettings): string {
  const address = getTrimmedValue(settings.address);
  const neighborhood = getTrimmedValue(settings.neighborhood);
  const addressParts = [address, neighborhood].filter(Boolean);

  return addressParts.join(", ") || "Endereço confirmado pelo WhatsApp";
}

function getOgImages(settings: PublicSettings): Array<{ url: string }> | undefined {
  const ogImageUrl = getTrimmedValue(settings.ogImageUrl);

  return ogImageUrl ? [{ url: ogImageUrl }] : undefined;
}

function getContactMetadata(settings: PublicSettings): PageMetadataContent {
  const businessName = getBusinessName(settings);
  const seoLocation = getSeoLocation(settings);

  return {
    title: `Contato da ${businessName} | Floricultura em ${seoLocation}`,
    description: `Fale com a ${businessName}, floricultura em ${seoLocation}. Veja WhatsApp, telefone, endereço e horário de atendimento da loja.`,
  };
}

function createContactWhatsappMessage(settings: PublicSettings): string {
  return [
    `Olá! Vim pela página de contato da ${getBusinessName(settings)} e gostaria de atendimento.`,
    `Estou em ${getCityName(settings)} e quero falar sobre flores, buquês ou arranjos.`,
    "Sei que valores, disponibilidade, entrega e pagamento serão confirmados pela floricultura.",
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
    message: createContactWhatsappMessage(settings),
  });
}

function getGoogleMapsHref(settings: PublicSettings): string | null {
  const googleMapsUrl = getTrimmedValue(settings.googleMapsUrl);

  if (googleMapsUrl) {
    return googleMapsUrl;
  }

  const address = getTrimmedValue(settings.address);
  const neighborhood = getTrimmedValue(settings.neighborhood);
  const city = getTrimmedValue(settings.city);
  const state = getStateName(settings);

  if (!address || (!city && !state)) {
    return null;
  }

  const query = [address, neighborhood, city, state].filter(Boolean).join(", ");

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function ActionLink({ children, className, href }: ActionLinkProps) {
  const classes = cn(actionLinkClasses, className);

  if (!href) {
    return (
      <span aria-disabled="true" className={cn(classes, "cursor-not-allowed opacity-60")}>
        {children}
      </span>
    );
  }

  return (
    <a className={classes} href={href} rel="noopener noreferrer" target="_blank">
      {children}
    </a>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const { title, description } = getContactMetadata(settings);
  const ogImages = getOgImages(settings);

  return {
    title,
    description,
    alternates: { canonical: "/contato" },
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

export default async function ContatoPage() {
  const settings = await getSettings();
  const businessName = getBusinessName(settings);
  const whatsappNumber = getTrimmedValue(settings.whatsappNumber);
  const phone = getTrimmedValue(settings.phone);
  const openingHours = getTrimmedValue(settings.openingHours);
  const instagramUrl = getTrimmedValue(settings.instagramUrl);
  const whatsappHref = getWhatsappHref(settings);
  const googleMapsHref = getGoogleMapsHref(settings);

  return (
    <>
      <section className="container-page py-14 sm:py-16 lg:py-20">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Atendimento
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
            Contato da {businessName}
          </h1>
          <p className="mt-5 text-base leading-7 text-muted sm:text-lg sm:leading-8">
            Fale com a floricultura para tirar dúvidas, confirmar disponibilidade e combinar
            detalhes de retirada ou entrega antes de finalizar o pedido.
          </p>

          <div className="mt-8">
            <ActionLink className="w-full sm:w-auto" href={whatsappHref}>
              Chamar no WhatsApp
            </ActionLink>
          </div>
        </div>
      </section>

      <section className="bg-surface">
        <div className="container-page grid gap-6 py-14 md:grid-cols-[1fr_0.8fr] lg:py-16">
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
              Informações de contato
            </h2>

            <dl className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-zinc-500">WhatsApp</dt>
                <dd className="mt-1 font-semibold text-foreground">
                  {whatsappNumber && whatsappHref ? (
                    <a
                      className="text-primary underline-offset-4 hover:text-primary-hover hover:underline"
                      href={whatsappHref}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {formatPhoneForDisplay(whatsappNumber) ?? whatsappNumber}
                    </a>
                  ) : (
                    "WhatsApp em breve"
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-zinc-500">Telefone</dt>
                <dd className="mt-1 font-semibold text-foreground">
                  {phone ? (
                    <a
                      className="text-primary underline-offset-4 hover:text-primary-hover hover:underline"
                      href={`tel:${phone.replace(/\D/g, "")}`}
                    >
                      {formatPhoneForDisplay(phone) ?? phone}
                    </a>
                  ) : (
                    "Atendimento pelo WhatsApp"
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-zinc-500">Endereço</dt>
                <dd className="mt-1 font-semibold text-foreground">
                  <address className="not-italic">{getAddressLabel(settings)}</address>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-zinc-500">Cidade/Estado</dt>
                <dd className="mt-1 font-semibold text-foreground">
                  {getCityStateLabel(settings)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-zinc-500">Horário</dt>
                <dd className="mt-1 font-semibold text-foreground">
                  {openingHours ?? "Horário confirmado pelo WhatsApp"}
                </dd>
              </div>
              {instagramUrl ? (
                <div>
                  <dt className="text-sm font-medium text-zinc-500">Instagram</dt>
                  <dd className="mt-1 font-semibold text-foreground">
                    <a
                      className="text-primary underline-offset-4 hover:text-primary-hover hover:underline"
                      href={instagramUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Abrir Instagram
                    </a>
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-surface-sage p-6 shadow-soft">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
              Localização
            </h2>
            <p className="mt-4 text-base leading-7 text-muted">
              Use o mapa externo para conferir a rota. Caso a localização ainda não esteja
              disponível, confirme o endereço diretamente com a loja antes de sair.
            </p>
            {googleMapsHref ? (
              <a
                className="mt-6 inline-flex w-full min-h-11 items-center justify-center rounded-full border border-emerald-300 bg-surface/85 px-6 py-2.5 text-base font-semibold text-emerald-950 transition duration-200 hover:border-emerald-500 hover:bg-emerald-100 active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 sm:w-auto"
                href={googleMapsHref}
                rel="noopener noreferrer"
                target="_blank"
              >
                Abrir no Google Maps
              </a>
            ) : (
              <p className="mt-6 font-semibold text-foreground">
                Localização confirmada pelo WhatsApp
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
