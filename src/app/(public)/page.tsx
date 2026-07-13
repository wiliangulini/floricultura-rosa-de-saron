import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { ProductCard } from "@/components/public/ProductCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { formatPhoneForDisplay } from "@/lib/format-phone";
import { createWhatsappUrl } from "@/lib/whatsapp";
import { getActiveCategories, type PublicCategory } from "@/server/categories";
import { getFeaturedProducts, type PublicProduct } from "@/server/products";
import { getSettings, type PublicSettings } from "@/server/settings";

const fallbackBusinessName = "Floricultura";
const fallbackCityName = "sua cidade";

type ActionLinkVariant = "primary" | "outline" | "secondary";

type ActionLinkProps = {
  children: ReactNode;
  className?: string;
  external?: boolean;
  href: string | null;
  variant?: ActionLinkVariant;
};

type HomeSectionProps = {
  settings: PublicSettings;
  whatsappHref: string | null;
};

export const dynamic = "force-dynamic";

const actionLinkBaseClasses =
  "inline-flex min-h-12 items-center justify-center rounded-full px-7 py-3 text-base font-semibold transition duration-200 active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

const actionLinkVariantClasses: Record<ActionLinkVariant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-soft hover:bg-primary-hover focus-visible:outline-primary",
  outline:
    "border border-rose-200 bg-surface text-primary hover:border-rose-300 hover:bg-primary-soft focus-visible:outline-primary",
  secondary:
    "bg-secondary-soft text-emerald-950 hover:bg-emerald-100 focus-visible:outline-secondary",
};

const sectionEyebrowClasses =
  "text-xs font-semibold uppercase tracking-[0.2em] text-primary";

const sectionTitleClasses =
  "mt-3 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl";

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

function getRealCityName(settings: PublicSettings): string | null {
  return getTrimmedValue(settings.city);
}

function getStateName(settings: PublicSettings): string | null {
  return getTrimmedValue(settings.state);
}

function getCityStateLabel(settings: PublicSettings): string {
  const city = getRealCityName(settings);
  const state = getStateName(settings);

  if (city && state) {
    return `${city} - ${state}`;
  }

  return city ?? state ?? "Atendimento local";
}

function getAddressLabel(settings: PublicSettings): string {
  const address = getTrimmedValue(settings.address);
  const neighborhood = getTrimmedValue(settings.neighborhood);
  const cityState = getCityStateLabel(settings);
  const addressParts = [address, neighborhood, cityState].filter(Boolean);

  return addressParts.join(", ") || "Endereço confirmado pelo WhatsApp";
}

function getHomeTitle(settings: PublicSettings): string {
  const configuredTitle = getTrimmedValue(settings.seoDefaultTitle);

  if (configuredTitle) {
    return configuredTitle;
  }

  return `Floricultura em ${getCityName(settings)} | Flores, buquês e arranjos especiais`;
}

function getHomeDescription(settings: PublicSettings): string {
  const configuredDescription = getTrimmedValue(settings.seoDefaultDescription);

  if (configuredDescription) {
    return configuredDescription;
  }

  return `${getBusinessName(settings)} em ${getCityName(
    settings,
  )} com flores, buquês, arranjos e presentes especiais para pedir pelo WhatsApp.`;
}

function createHomeWhatsappMessage(settings: PublicSettings): string {
  return [
    `Olá! Vim pelo site da ${getBusinessName(settings)} e gostaria de fazer um pedido.`,
    `Procuro flores, buquês ou arranjos em ${getCityName(settings)}.`,
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
    message: createHomeWhatsappMessage(settings),
  });
}

function createLocalBusinessJsonLd(settings: PublicSettings): Record<string, unknown> {
  const businessName = getBusinessName(settings);
  const description = getHomeDescription(settings);
  const phone = getTrimmedValue(settings.phone);
  const whatsappNumber = getTrimmedValue(settings.whatsappNumber);
  const email = getTrimmedValue(settings.email);
  const address = getTrimmedValue(settings.address);
  const neighborhood = getTrimmedValue(settings.neighborhood);
  const city = getRealCityName(settings);
  const state = getStateName(settings);
  const openingHours = getTrimmedValue(settings.openingHours);
  const ogImageUrl = getTrimmedValue(settings.ogImageUrl);
  const sameAs = [
    getTrimmedValue(settings.instagramUrl),
    getTrimmedValue(settings.facebookUrl),
  ].filter((url): url is string => Boolean(url));

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    additionalType: "https://schema.org/Florist",
    name: businessName,
    description,
  };

  const telephone = phone ?? whatsappNumber;

  if (telephone) {
    jsonLd.telephone = telephone;
  }

  if (email) {
    jsonLd.email = email;
  }

  if (address || neighborhood || city || state) {
    const streetAddress = [address, neighborhood].filter(Boolean).join(", ");
    const postalAddress: Record<string, unknown> = {
      "@type": "PostalAddress",
      addressCountry: "BR",
    };

    if (streetAddress) {
      postalAddress.streetAddress = streetAddress;
    }

    if (city) {
      postalAddress.addressLocality = city;
    }

    if (state) {
      postalAddress.addressRegion = state;
    }

    jsonLd.address = postalAddress;
  }

  if (city || state) {
    jsonLd.areaServed = {
      "@type": "Place",
      name: city && state ? `${city} - ${state}` : city ?? state,
    };
  }

  if (openingHours) {
    jsonLd.openingHours = openingHours;
  }

  if (ogImageUrl) {
    jsonLd.image = ogImageUrl;
  }

  if (sameAs.length > 0) {
    jsonLd.sameAs = sameAs;
  }

  return jsonLd;
}

function serializeJsonLd(jsonLd: Record<string, unknown>): string {
  return JSON.stringify(jsonLd).replace(/</g, "\\u003c");
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
  const title = getHomeTitle(settings);
  const description = getHomeDescription(settings);
  const ogImageUrl = getTrimmedValue(settings.ogImageUrl);
  const ogImages = ogImageUrl ? [{ url: ogImageUrl }] : undefined;

  return {
    title,
    description,
    alternates: { canonical: "/" },
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

function HeroSection({
  featuredProducts,
  settings,
  whatsappHref,
}: HomeSectionProps & { featuredProducts: PublicProduct[] }) {
  const businessName = getBusinessName(settings);
  const cityName = getCityName(settings);
  const cityState = getCityStateLabel(settings);
  const heroProduct = featuredProducts.find((product) => product.mainImage) ?? featuredProducts[0];
  const heroImage = heroProduct?.mainImage;

  return (
    <section className="relative overflow-hidden bg-background">
      {/* Formas orgânicas decorativas — apenas CSS, sem custo de rede */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -right-24 -top-28 size-80 rounded-full bg-rose-100/70 blur-3xl" />
        <div className="absolute -left-32 top-1/2 size-72 rounded-full bg-emerald-100/60 blur-3xl" />
        <div className="absolute -bottom-20 right-1/4 size-64 rounded-full bg-amber-100/50 blur-3xl" />
      </div>

      <div className="container-page relative grid gap-10 py-12 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:py-20">
        <div className="max-w-3xl">
          <p className={sectionEyebrowClasses}>{businessName}</p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Floricultura em {cityName} com flores, buquês e arranjos especiais
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
            Presentes delicados para aniversários, agradecimentos, homenagens e gestos de carinho.
            Escolha no catálogo e finalize o atendimento diretamente pelo WhatsApp da loja.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ActionLink className="w-full sm:w-auto" href="/produtos">
              Ver catálogo
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

          <dl className="mt-10 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-rose-100 bg-surface/80 p-4">
              <dt className="text-sm font-medium text-zinc-500">Atendimento</dt>
              <dd className="mt-1 font-semibold text-foreground">Pelo WhatsApp</dd>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-surface-sage/80 p-4">
              <dt className="text-sm font-medium text-zinc-500">Região</dt>
              <dd className="mt-1 font-semibold text-foreground">{cityState}</dd>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-accent-soft/80 p-4">
              <dt className="text-sm font-medium text-zinc-500">Pedido</dt>
              <dd className="mt-1 font-semibold text-foreground">Confirmado pela loja</dd>
            </div>
          </dl>
        </div>

        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute -left-5 -top-5 hidden size-24 rounded-full border border-rose-200 bg-primary-soft lg:block"
          />
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-surface shadow-lifted">
            <div className="relative aspect-[4/3] bg-[radial-gradient(circle_at_30%_20%,#f8e9ee_0%,transparent_55%),radial-gradient(circle_at_75%_80%,#eff4ee_0%,transparent_55%)] bg-rose-50">
              {heroImage ? (
                <Image
                  alt={heroImage.altText || heroProduct.name}
                  className="h-full w-full object-cover"
                  height={900}
                  priority
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  src={heroImage.url}
                  width={1200}
                />
              ) : (
                <div className="flex h-full items-center justify-center px-8 text-center">
                  <p className="max-w-xs font-display text-2xl font-medium italic leading-snug text-rose-900">
                    Flores frescas, buquês e arranjos preparados com cuidado para cada ocasião.
                  </p>
                </div>
              )}
            </div>
            <div className="grid gap-4 border-t border-border p-5 sm:grid-cols-3">
              <div>
                <p className="text-sm font-medium text-zinc-500">Flores</p>
                <p className="mt-1 font-semibold text-foreground">Naturais e especiais</p>
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-500">Buquês</p>
                <p className="mt-1 font-semibold text-foreground">Para presentear</p>
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-500">Arranjos</p>
                <p className="mt-1 font-semibold text-foreground">Composição delicada</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedProductsSection({ products }: { products: PublicProduct[] }) {
  const visibleProducts = products.slice(0, 3);

  return (
    <section className="bg-surface">
      <div className="container-page py-14 lg:py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className={sectionEyebrowClasses}>Destaques</p>
            <h2 className={sectionTitleClasses}>Flores e presentes escolhidos para encantar</h2>
            <p className="mt-4 text-base leading-7 text-muted">
              Produtos em destaque no catálogo, com valores e disponibilidade confirmados no
              atendimento.
            </p>
          </div>
          <ActionLink className="w-full sm:w-auto" href="/produtos" variant="outline">
            Ver catálogo
          </ActionLink>
        </div>

        {visibleProducts.length > 0 ? (
          <ul className="mt-10 grid list-none grid-cols-1 justify-items-center gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visibleProducts.map((product) => (
              <li className="flex w-full max-w-sm sm:max-w-none" key={product.slug}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-10 rounded-2xl border border-rose-100 bg-surface-soft p-6 sm:p-8">
            <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground">
              Destaques em preparação
            </h3>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
              A floricultura ainda está organizando os produtos em destaque. Enquanto isso, veja o
              catálogo completo ou fale pelo WhatsApp para receber sugestões.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function CategoriesSection({ categories }: { categories: PublicCategory[] }) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="bg-surface-sage">
      <div className="container-page py-14 lg:py-16">
        <div className="max-w-2xl">
          <p className={cn(sectionEyebrowClasses, "text-emerald-800")}>Categorias</p>
          <h2 className={sectionTitleClasses}>Escolha pelo tipo de presente</h2>
          <p className="mt-4 text-base leading-7 text-muted">
            Navegue por buquês, arranjos, cestas e flores naturais para encontrar a melhor opção
            para cada momento.
          </p>
        </div>

        <ul className="mt-10 grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <li key={category.slug}>
              <Card className="h-full transition duration-200 hover:-translate-y-0.5 hover:shadow-lifted motion-reduce:hover:translate-y-0">
                <CardHeader>
                  <CardTitle>{category.name}</CardTitle>
                  <CardDescription>
                    {category.description ?? "Opções selecionadas com cuidado pela floricultura."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link
                    className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-rose-200 bg-surface px-5 py-2.5 text-base font-semibold text-primary transition hover:border-rose-300 hover:bg-primary-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    href={`/categoria/${category.slug}`}
                  >
                    Ver opções
                    <span aria-hidden="true">→</span>
                  </Link>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function HowToOrderSection() {
  const steps = [
    "Escolha os produtos",
    "Monte seu pedido",
    "Envie pelo WhatsApp",
    "Aguarde confirmação",
  ];

  return (
    <section className="bg-background">
      <div className="container-page py-14 lg:py-16">
        <div className="max-w-2xl">
          <p className={sectionEyebrowClasses}>Como pedir</p>
          <h2 className={sectionTitleClasses}>Do catálogo ao atendimento em poucos passos</h2>
        </div>

        <ol className="mt-10 grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li
              className="rounded-2xl border border-border bg-surface p-5 shadow-soft"
              key={step}
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-primary-soft font-display text-lg font-semibold text-primary">
                {index + 1}
              </span>
              <h3 className="mt-4 text-lg font-bold text-foreground">{step}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">
                {index === 0
                  ? "Veja as opções disponíveis no catálogo."
                  : index === 1
                    ? "Separe os itens desejados antes de falar com a loja."
                    : index === 2
                      ? "Chame a floricultura para enviar os detalhes."
                      : "Valores, disponibilidade, entrega e pagamento são alinhados no atendimento."}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function AboutPreviewSection({ settings }: { settings: PublicSettings }) {
  const businessName = getBusinessName(settings);
  const cityName = getCityName(settings);
  const neighborhood = getTrimmedValue(settings.neighborhood);
  const deliveryDescription = getTrimmedValue(settings.deliveryDescription);
  const ownerName = getTrimmedValue(settings.ownerName);
  const ownerDescription = getTrimmedValue(settings.ownerDescription);
  const ownerPhotoUrl = getTrimmedValue(settings.ownerPhotoUrl);

  return (
    <section className="bg-surface-soft">
      <div className="container-page grid gap-8 py-14 md:grid-cols-[0.9fr_1.1fr] md:items-center lg:py-16">
        <div className="space-y-5">
          <p className={sectionEyebrowClasses}>Sobre a floricultura</p>
          <h2 className={sectionTitleClasses}>
            {ownerName
              ? `${ownerName} aproxima cada atendimento`
              : "Atendimento próximo para presentear com delicadeza"}
          </h2>
          {ownerPhotoUrl ? (
            <div className="max-w-xs overflow-hidden rounded-[2rem] border border-rose-100 bg-surface shadow-soft">
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
              A {businessName} atende clientes em {cityName}
              {neighborhood ? `, especialmente na região de ${neighborhood}` : ""}, com flores,
              buquês e arranjos preparados para ocasiões especiais e gestos do dia a dia.
            </p>
          )}
          <p>
            {settings.deliveryAvailable
              ? deliveryDescription ??
                "A entrega pode ser combinada diretamente com a loja durante o atendimento."
              : "Retirada, entrega e disponibilidade são combinadas diretamente com a loja durante o atendimento."}
          </p>
        </div>
      </div>
    </section>
  );
}

function LocationSection({ settings, whatsappHref }: HomeSectionProps) {
  const openingHours = getTrimmedValue(settings.openingHours);
  const phone = getTrimmedValue(settings.phone);
  const whatsappNumber = getTrimmedValue(settings.whatsappNumber);
  const googleMapsUrl = getTrimmedValue(settings.googleMapsUrl);

  return (
    <section className="bg-surface">
      <div className="container-page py-14 lg:py-16">
        <div className="max-w-2xl">
          <p className={sectionEyebrowClasses}>Localização e horário</p>
          <h2 className={sectionTitleClasses}>Informações para encontrar e falar com a loja</h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Endereço</CardTitle>
              <CardDescription>Atendimento local com confirmação pelo WhatsApp.</CardDescription>
            </CardHeader>
            <CardContent>
              <address className="not-italic text-base leading-7 text-muted">
                {getAddressLabel(settings)}
              </address>
              {googleMapsUrl ? (
                <a
                  className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full border border-rose-200 bg-surface px-5 py-2.5 text-base font-semibold text-primary transition hover:border-rose-300 hover:bg-primary-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  href={googleMapsUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Abrir no Google Maps
                </a>
              ) : null}
            </CardContent>
          </Card>

          <Card className="border-emerald-100 bg-surface-sage/60">
            <CardHeader>
              <CardTitle>Horário</CardTitle>
              <CardDescription>
                {openingHours ?? "Horário confirmado diretamente com a floricultura."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-zinc-500">WhatsApp</dt>
                  <dd className="mt-1 font-semibold text-foreground">
                    {whatsappNumber && whatsappHref ? (
                      <a
                        className="rounded-md text-rose-900 underline-offset-4 hover:text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                        href={whatsappHref}
                      >
                        {formatPhoneForDisplay(whatsappNumber)}
                      </a>
                    ) : (
                      "WhatsApp em breve"
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-zinc-500">Telefone</dt>
                  <dd className="mt-1 font-semibold text-foreground">
                    {phone ? formatPhoneForDisplay(phone) : "Atendimento pelo WhatsApp"}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function WhatsAppCTASection({ settings, whatsappHref }: HomeSectionProps) {
  return (
    <section className="relative overflow-hidden bg-rose-900 text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 -top-24 size-72 rounded-full bg-rose-800/60 blur-3xl" />
        <div className="absolute -bottom-24 -right-16 size-72 rounded-full bg-rose-950/70 blur-3xl" />
      </div>
      <div className="container-page relative grid gap-6 py-14 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-200">
            Pedido pelo WhatsApp
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Fale com a {getBusinessName(settings)} para confirmar seu pedido
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-rose-100">
            A loja confirma valores, disponibilidade, entrega, retirada e pagamento antes de fechar
            o atendimento.
          </p>
        </div>
        <ActionLink
          className="w-full border-white bg-white text-rose-900 hover:border-rose-100 hover:bg-rose-50 sm:w-auto"
          external
          href={whatsappHref}
          variant="outline"
        >
          Falar no WhatsApp
        </ActionLink>
      </div>
    </section>
  );
}

export default async function Home() {
  const [settings, featuredProducts, categories] = await Promise.all([
    getSettings(),
    getFeaturedProducts(),
    getActiveCategories(),
  ]);
  const whatsappHref = getWhatsappHref(settings);
  const localBusinessJsonLd = createLocalBusinessJsonLd(settings);

  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(localBusinessJsonLd) }}
        type="application/ld+json"
      />

      <HeroSection
        featuredProducts={featuredProducts}
        settings={settings}
        whatsappHref={whatsappHref}
      />
      <FeaturedProductsSection products={featuredProducts} />
      <CategoriesSection categories={categories} />
      <HowToOrderSection />
      <AboutPreviewSection settings={settings} />
      <LocationSection settings={settings} whatsappHref={whatsappHref} />
      <WhatsAppCTASection settings={settings} whatsappHref={whatsappHref} />
    </>
  );
}
