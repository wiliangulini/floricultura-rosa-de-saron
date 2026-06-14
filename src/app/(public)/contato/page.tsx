import type { Metadata } from "next";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
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

const actionLinkClasses =
  "inline-flex min-h-12 items-center justify-center rounded-md bg-rose-700 px-6 py-3 text-base font-semibold text-white shadow-sm shadow-rose-900/10 transition hover:bg-rose-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700";

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
      <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-8 lg:py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-rose-800">
            Atendimento
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
            Contato da {businessName}
          </h1>
          <p className="mt-5 text-lg leading-8 text-zinc-700">
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

      <section className="bg-white">
        <div className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-14 sm:px-8 lg:grid-cols-[1fr_0.8fr] lg:py-16">
          <div className="rounded-lg border border-rose-100 bg-white p-6 shadow-sm shadow-rose-950/5">
            <h2 className="text-2xl font-bold text-zinc-950">Informações de contato</h2>

            <dl className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-zinc-500">WhatsApp</dt>
                <dd className="mt-1 font-semibold text-zinc-950">
                  {whatsappNumber && whatsappHref ? (
                    <a
                      className="text-rose-900 hover:text-rose-700"
                      href={whatsappHref}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {whatsappNumber}
                    </a>
                  ) : (
                    "WhatsApp em breve"
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-zinc-500">Telefone</dt>
                <dd className="mt-1 font-semibold text-zinc-950">
                  {phone ? (
                    <a
                      className="text-rose-900 hover:text-rose-700"
                      href={`tel:${phone.replace(/\D/g, "")}`}
                    >
                      {phone}
                    </a>
                  ) : (
                    "Atendimento pelo WhatsApp"
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-zinc-500">Endereço</dt>
                <dd className="mt-1 font-semibold text-zinc-950">
                  <address className="not-italic">{getAddressLabel(settings)}</address>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-zinc-500">Cidade/Estado</dt>
                <dd className="mt-1 font-semibold text-zinc-950">
                  {getCityStateLabel(settings)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-zinc-500">Horário</dt>
                <dd className="mt-1 font-semibold text-zinc-950">
                  {openingHours ?? "Horário confirmado pelo WhatsApp"}
                </dd>
              </div>
              {instagramUrl ? (
                <div>
                  <dt className="text-sm font-medium text-zinc-500">Instagram</dt>
                  <dd className="mt-1 font-semibold text-zinc-950">
                    <a
                      className="text-rose-900 hover:text-rose-700"
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

          <div className="rounded-lg border border-emerald-100 bg-emerald-50/80 p-6 shadow-sm shadow-emerald-950/5">
            <h2 className="text-2xl font-bold text-zinc-950">Localização</h2>
            <p className="mt-4 text-base leading-7 text-zinc-700">
              Use o mapa externo para conferir a rota. Caso a localização ainda não esteja
              disponível, confirme o endereço diretamente com a loja antes de sair.
            </p>
            {googleMapsHref ? (
              <a
                className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md border border-emerald-300 bg-white/85 px-5 py-2.5 text-base font-semibold text-emerald-950 transition hover:border-emerald-500 hover:bg-emerald-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                href={googleMapsHref}
                rel="noopener noreferrer"
                target="_blank"
              >
                Abrir no Google Maps
              </a>
            ) : (
              <p className="mt-6 font-semibold text-zinc-950">
                Localização confirmada pelo WhatsApp
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
