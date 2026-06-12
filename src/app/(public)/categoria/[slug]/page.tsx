import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategoryFilter } from "@/components/public/CategoryFilter";
import { ProductCard } from "@/components/public/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { getActiveCategories, getCategoryBySlug, type PublicCategory } from "@/server/categories";
import { getProductsByCategorySlug } from "@/server/products";
import { getSettings, type PublicSettings } from "@/server/settings";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

function getCityName(settings: PublicSettings): string {
  return settings.city?.trim() || "sua cidade";
}

function getBusinessName(settings: PublicSettings): string {
  return settings.businessName.trim() || "Floricultura";
}

function getCategoryTitle(category: PublicCategory, settings: PublicSettings): string {
  return `${category.name} em ${getCityName(settings)}`;
}

function getMetadataTitle(category: PublicCategory, settings: PublicSettings): string {
  return `${category.name} em ${getCityName(settings)} | ${getBusinessName(settings)}`;
}

function getMetadataDescription(category: PublicCategory, settings: PublicSettings): string {
  return `Veja opções de ${category.name.toLowerCase()} em ${getCityName(settings)} na ${getBusinessName(settings)}. Produtos disponíveis para pedir pelo WhatsApp, com confirmação de valores, entrega e disponibilidade pela loja.`;
}

function createBreadcrumbJsonLd(category: PublicCategory): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Início",
        item: "/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Produtos",
        item: "/produtos",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: category.name,
        item: `/categoria/${category.slug}`,
      },
    ],
  };
}

function serializeJsonLd(jsonLd: Record<string, unknown>): string {
  return JSON.stringify(jsonLd).replace(/</g, "\\u003c");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [category, settings] = await Promise.all([getCategoryBySlug(slug), getSettings()]);

  if (!category) {
    return {
      title: "Categoria não encontrada",
    };
  }

  const title = getMetadataTitle(category, settings);
  const description = getMetadataDescription(category, settings);
  const ogImages = settings.ogImageUrl ? [{ url: settings.ogImageUrl }] : undefined;

  return {
    title,
    description,
    alternates: { canonical: `/categoria/${category.slug}` },
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

export default async function CategoriaPage({ params }: Props) {
  const { slug } = await params;
  const [category, products, settings, categories] = await Promise.all([
    getCategoryBySlug(slug),
    getProductsByCategorySlug(slug),
    getSettings(),
    getActiveCategories(),
  ]);

  if (!category) {
    notFound();
  }

  const breadcrumbJsonLd = createBreadcrumbJsonLd(category);

  return (
    <main className="min-h-screen bg-rose-50 text-zinc-950">
      <script
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
        type="application/ld+json"
      />

      <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-8 lg:py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-rose-800">
            Categoria
          </p>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
            {getCategoryTitle(category, settings)}
          </h1>
          {category.description ? (
            <p className="mt-5 text-lg leading-8 text-zinc-700">{category.description}</p>
          ) : null}
        </div>

        <div className="mt-8">
          <CategoryFilter activeSlug={slug} categories={categories} />
        </div>

        {products.length > 0 ? (
          <ul className="mt-10 grid list-none gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <li key={product.slug} className="flex">
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            className="mt-10"
            description="Nenhum produto ativo foi encontrado nesta categoria no momento. Volte em breve ou fale com a floricultura pelo WhatsApp."
            title="Nenhum produto disponível nesta categoria no momento."
          />
        )}
      </section>
    </main>
  );
}
