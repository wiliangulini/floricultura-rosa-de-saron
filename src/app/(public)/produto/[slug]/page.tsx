import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { AddToCartButton } from "@/components/public/AddToCartButton";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getCartProduct } from "@/lib/cart";
import { formatCurrencyBRL } from "@/lib/money";
import { createWhatsappUrl } from "@/lib/whatsapp";
import { getProductBySlug, type PublicProduct } from "@/server/products";
import { getSettings, type PublicSettings } from "@/server/settings";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

const fallbackBusinessName = "Floricultura";

function getTrimmedValue(value: string | null | undefined): string | null {
  const trimmedValue = value?.trim();

  return trimmedValue ? trimmedValue : null;
}

function getBusinessName(settings: PublicSettings): string {
  return getTrimmedValue(settings.businessName) ?? fallbackBusinessName;
}

function formatProductPrice(product: PublicProduct): string {
  const price = product.price !== null ? Number(product.price) : null;

  if (price === null || product.priceType === "ON_REQUEST") {
    return "Sob consulta";
  }

  const formattedPrice = formatCurrencyBRL(price);

  if (product.priceType === "STARTING_FROM") {
    return `A partir de ${formattedPrice}`;
  }

  return formattedPrice;
}

function getProductDescription(product: PublicProduct, settings: PublicSettings): string | undefined {
  return (
    getTrimmedValue(product.seoDescription) ??
    getTrimmedValue(product.shortDescription) ??
    getTrimmedValue(settings.seoDefaultDescription) ??
    undefined
  );
}

function getOgImages(
  product: PublicProduct,
  settings: PublicSettings,
): Array<{ url: string; width?: number; height?: number; alt?: string }> | undefined {
  if (product.mainImage) {
    return [
      {
        url: product.mainImage.url,
        width: 1200,
        height: 900,
        alt: product.mainImage.altText ?? product.name,
      },
    ];
  }

  const ogImageUrl = getTrimmedValue(settings.ogImageUrl);

  return ogImageUrl ? [{ url: ogImageUrl }] : undefined;
}

function createProductJsonLd(product: PublicProduct): Record<string, unknown> {
  const description = product.description ?? product.shortDescription ?? product.name;
  const availability = product.available
    ? "https://schema.org/InStock"
    : "https://schema.org/OutOfStock";
  const offer: Record<string, unknown> = {
    "@type": "Offer",
    availability,
  };

  if (product.price && product.priceType !== "ON_REQUEST") {
    offer.price = product.price;
    offer.priceCurrency = "BRL";
  }

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description,
    category: product.category.name,
    offers: offer,
  };

  if (product.mainImage) {
    jsonLd.image = product.mainImage.url;
  }

  return jsonLd;
}

function createProductWhatsappMessage(product: PublicProduct, settings: PublicSettings): string {
  return [
    `Olá! Vim pelo site da ${getBusinessName(settings)} e gostaria de pedir ou consultar este produto:`,
    product.name,
    "",
    "Sei que valores, disponibilidade, entrega e pagamento serão confirmados pela floricultura.",
  ].join("\n");
}

function getProductWhatsappHref(product: PublicProduct, settings: PublicSettings): string | null {
  const whatsappNumber = getTrimmedValue(settings.whatsappNumber);
  const whatsappDigits = whatsappNumber?.replace(/\D/g, "");

  if (!whatsappNumber || !whatsappDigits) {
    return null;
  }

  return createWhatsappUrl({
    phoneNumber: whatsappNumber,
    message: createProductWhatsappMessage(product, settings),
  });
}

function serializeJsonLd(jsonLd: Record<string, unknown>): string {
  return JSON.stringify(jsonLd).replace(/</g, "\\u003c");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [product, settings] = await Promise.all([getProductBySlug(slug), getSettings()]);

  if (!product) {
    return {
      title: "Produto não encontrado",
    };
  }

  const title = getTrimmedValue(product.seoTitle) ?? product.name;
  const description = getProductDescription(product, settings);
  const ogImages = getOgImages(product, settings);

  return {
    title,
    description,
    alternates: { canonical: `/produto/${product.slug}` },
    openGraph: {
      title,
      description,
      images: ogImages,
      locale: "pt_BR",
      siteName: getBusinessName(settings),
      type: "website",
      url: `/produto/${product.slug}`,
    },
    twitter: {
      card: ogImages ? "summary_large_image" : "summary",
      title,
      description,
      images: ogImages,
    },
  };
}

export default async function ProdutoPage({ params }: Props) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([getProductBySlug(slug), getSettings()]);

  if (!product) {
    notFound();
  }

  const imageAlt = product.mainImage?.altText || product.name;
  const galleryImages = product.images.filter((image) => image.url !== product.mainImage?.url);
  const productJsonLd = createProductJsonLd(product);
  const whatsappHref = getProductWhatsappHref(product, settings);

  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(productJsonLd) }}
        type="application/ld+json"
      />

      <section className="container-page grid gap-6 py-14 sm:gap-10 sm:py-16 lg:grid-cols-[1fr_0.9fr] lg:py-20">
        <div>
          <div className="overflow-hidden rounded-[2rem] border border-border bg-surface shadow-soft">
            {product.mainImage ? (
              <Image
                alt={imageAlt}
                className="aspect-[4/3] h-auto w-full object-cover"
                height={900}
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                src={product.mainImage.url}
                width={1200}
              />
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center bg-[radial-gradient(circle_at_30%_20%,#f8e9ee_0%,transparent_55%),radial-gradient(circle_at_75%_80%,#eff4ee_0%,transparent_55%)] px-6 text-center">
                <p className="font-display text-xl font-medium italic text-rose-900">
                  Imagem em breve
                </p>
              </div>
            )}
          </div>

          {galleryImages.length > 0 ? (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {galleryImages.map((image) => (
                <div
                  className="overflow-hidden rounded-xl border border-border bg-surface"
                  key={image.url}
                >
                  <Image
                    alt={image.altText || product.name}
                    className="aspect-square h-auto w-full object-cover"
                    height={240}
                    sizes="(min-width: 640px) 160px, 30vw"
                    src={image.url}
                    width={240}
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <article>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="sage">{product.category.name}</Badge>
            <Badge variant={product.available ? "rose" : "neutral"}>
              {product.available ? "Disponível para pedido" : "Indisponível no momento"}
            </Badge>
          </div>

          <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {product.name}
          </h1>

          {product.shortDescription ? (
            <p className="mt-5 text-base leading-7 text-muted sm:text-lg sm:leading-8">{product.shortDescription}</p>
          ) : null}

          <p className="mt-8 text-2xl font-bold text-rose-900 sm:text-3xl">{formatProductPrice(product)}</p>

          <section className="mt-10 border-t border-border pt-8">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
              Detalhes
            </h2>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-zinc-500">Categoria</dt>
                <dd className="mt-1 text-base font-semibold text-foreground">
                  {product.category.name}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-zinc-500">Disponibilidade</dt>
                <dd className="mt-1 text-base font-semibold text-foreground">
                  {product.available ? "Disponível para pedido" : "Indisponível no momento"}
                </dd>
              </div>
            </dl>

            <div className="mt-6 text-base leading-7 text-muted">
              {product.description ? (
                <p>{product.description}</p>
              ) : (
                <p>Descrição completa em breve.</p>
              )}
            </div>
          </section>

          <section className="mt-10 border-t border-border pt-8">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
              Como pedir
            </h2>
            <p className="mt-4 text-base leading-7 text-muted">
              Adicione o produto ao pedido ou fale com a floricultura pelo WhatsApp. Valores,
              disponibilidade, entrega e pagamento serão confirmados pela loja.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <AddToCartButton
                className="w-full sm:flex-1"
                product={getCartProduct(product)}
                size="lg"
                variant="primary"
              />
              {whatsappHref ? (
                <a
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-rose-200 bg-surface px-7 py-3 text-base font-semibold text-primary transition hover:border-rose-300 hover:bg-primary-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:flex-1"
                  href={whatsappHref}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Pedir pelo WhatsApp
                </a>
              ) : (
                <Button className="w-full sm:flex-1" disabled size="lg" variant="outline">
                  WhatsApp indisponível
                </Button>
              )}
            </div>
          </section>
        </article>
      </section>
    </>
  );
}
