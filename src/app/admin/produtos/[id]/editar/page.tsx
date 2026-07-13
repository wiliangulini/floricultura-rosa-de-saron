import { notFound } from "next/navigation";

import { getAdminCategories } from "@/server/categories";
import { getAdminProductById } from "@/server/products";

import { ProductForm } from "../../ProductForm";
import { updateProduct } from "../../actions";

type AdminEditarProdutoPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function AdminEditarProdutoPage({ params }: AdminEditarProdutoPageProps) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getAdminProductById(id),
    getAdminCategories(),
  ]);

  if (!product) {
    notFound();
  }

  const updateProductAction = updateProduct.bind(null, product.id);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">Editar produto</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-700">
          Atualize os dados do produto e salve para refletir no catálogo.
        </p>
      </div>

      <ProductForm
        action={updateProductAction}
        categories={categories}
        initialValues={{
          active: product.active,
          available: product.available,
          categoryId: product.categoryId,
          description: product.description,
          featured: product.featured,
          imageAltText: product.mainImage?.altText ?? "",
          imageUrl: product.mainImage?.url ?? "",
          name: product.name,
          price: product.price,
          priceType: product.priceType,
          seasonal: product.seasonal,
          seoDescription: product.seoDescription,
          seoTitle: product.seoTitle,
          shortDescription: product.shortDescription,
        }}
        submitLabel="Salvar alterações"
      />
    </section>
  );
}
