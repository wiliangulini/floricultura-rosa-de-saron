import type { Metadata } from "next";

import { CategoryFilter } from "@/components/public/CategoryFilter";
import { ProductCard } from "@/components/public/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { getActiveCategories } from "@/server/categories";
import { getActiveProducts } from "@/server/products";
import { getSettings } from "@/server/settings";

const pageTitle = "Catálogo de produtos | Floricultura";
const pageDescription =
  "Veja flores, buquês, arranjos e presentes disponíveis na floricultura para pedir pelo WhatsApp.";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const ogImages = settings.ogImageUrl ? [{ url: settings.ogImageUrl }] : undefined;

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: { canonical: "/produtos" },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      images: ogImages,
      type: "website",
    },
    twitter: {
      card: ogImages ? "summary_large_image" : "summary",
      title: pageTitle,
      description: pageDescription,
      images: ogImages,
    },
  };
}

export default async function ProdutosPage() {
  const [products, categories] = await Promise.all([getActiveProducts(), getActiveCategories()]);

  return (
    <main className="min-h-screen bg-rose-50 text-zinc-950">
      <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-rose-800">
            Catálogo
          </p>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">Produtos da floricultura</h1>
          <p className="mt-5 text-lg leading-8 text-zinc-700">
            Escolha entre flores, buquês, arranjos e presentes preparados com cuidado. Valores,
            disponibilidade e entrega são confirmados pela loja antes do fechamento do pedido.
          </p>
        </div>

        <div className="mt-8">
          <CategoryFilter activeSlug={null} categories={categories} />
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
            description="A loja ainda não possui produtos ativos no catálogo. Volte em breve ou fale com a floricultura pelo WhatsApp."
            title="Nenhum produto disponível"
          />
        )}
      </section>
    </main>
  );
}
