import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatCurrencyBRL } from "@/lib/money";
import { getProductBySlug, type PublicProduct } from "@/server/products";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

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

function getProductDescription(product: PublicProduct): string | undefined {
  return product.seoDescription ?? product.shortDescription ?? undefined;
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

function serializeJsonLd(jsonLd: Record<string, unknown>): string {
  return JSON.stringify(jsonLd).replace(/</g, "\\u003c");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Produto não encontrado",
    };
  }

  const title = product.seoTitle ?? product.name;
  const description = getProductDescription(product);
  const ogImages = product.mainImage
    ? [{ url: product.mainImage.url, width: 1200, height: 900 }]
    : undefined;

  return {
    title,
    description,
    alternates: { canonical: `/produto/${product.slug}` },
    openGraph: {
      title,
      description,
      images: ogImages,
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

export default async function ProdutoPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const imageAlt = product.mainImage?.altText || product.name;
  const galleryImages = product.images.filter((image) => image.url !== product.mainImage?.url);
  const productJsonLd = createProductJsonLd(product);

  return (
    <main className="min-h-screen bg-rose-50 text-zinc-950">
      <script
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(productJsonLd) }}
        type="application/ld+json"
      />

      <section className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 sm:px-8 lg:grid-cols-[1fr_0.9fr] lg:py-20">
        <div>
          <div className="overflow-hidden rounded-lg border border-rose-200 bg-rose-100">
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
              <div className="flex aspect-[4/3] items-center justify-center px-6 text-center text-base font-semibold text-rose-900">
                Imagem em breve
              </div>
            )}
          </div>

          {galleryImages.length > 0 ? (
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {galleryImages.map((image) => (
                <div
                  className="overflow-hidden rounded-md border border-rose-200 bg-rose-100"
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

          <h1 className="mt-5 text-4xl font-bold text-zinc-950 sm:text-5xl">{product.name}</h1>

          {product.shortDescription ? (
            <p className="mt-5 text-lg leading-8 text-zinc-700">{product.shortDescription}</p>
          ) : null}

          <p className="mt-8 text-3xl font-bold text-rose-900">{formatProductPrice(product)}</p>

          <section className="mt-10 border-t border-rose-200 pt-8">
            <h2 className="text-2xl font-bold text-zinc-950">Detalhes</h2>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-zinc-500">Categoria</dt>
                <dd className="mt-1 text-base font-semibold text-zinc-950">
                  {product.category.name}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-zinc-500">Disponibilidade</dt>
                <dd className="mt-1 text-base font-semibold text-zinc-950">
                  {product.available ? "Disponível para pedido" : "Indisponível no momento"}
                </dd>
              </div>
            </dl>

            <div className="mt-6 text-base leading-7 text-zinc-700">
              {product.description ? (
                <p>{product.description}</p>
              ) : (
                <p>Descrição completa em breve.</p>
              )}
            </div>
          </section>

          <section className="mt-10 border-t border-rose-200 pt-8">
            <h2 className="text-2xl font-bold text-zinc-950">Como pedir</h2>
            <p className="mt-4 text-base leading-7 text-zinc-700">
              Adicione o produto ao pedido ou fale com a floricultura pelo WhatsApp. Valores,
              disponibilidade, entrega e pagamento serão confirmados pela loja.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button className="w-full sm:flex-1" disabled size="lg" variant="primary">
                Adicionar ao pedido
              </Button>
              <Button className="w-full sm:flex-1" disabled size="lg" variant="outline">
                Pedir pelo WhatsApp
              </Button>
            </div>
          </section>
        </article>
      </section>
    </main>
  );
}
