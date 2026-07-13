import { getAdminCategories } from "@/server/categories";

import { ProductForm } from "../ProductForm";
import { createProduct } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminNovoProdutoPage() {
  const categories = await getAdminCategories();

  return (
    <section className="space-y-4">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">Cadastrar produto</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-700">
          Informe os dados do produto e adicione a imagem principal quando houver.
        </p>
      </div>

      <ProductForm
        action={createProduct}
        categories={categories}
        initialValues={{
          active: true,
          available: true,
          categoryId: "",
          description: "",
          featured: false,
          imageAltText: "",
          imageUrl: "",
          name: "",
          price: "",
          priceType: "FIXED",
          seasonal: false,
          seoDescription: "",
          seoTitle: "",
          shortDescription: "",
        }}
        submitLabel="Cadastrar produto"
      />
    </section>
  );
}
