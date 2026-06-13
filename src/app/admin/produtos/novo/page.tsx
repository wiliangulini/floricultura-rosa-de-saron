import { getAdminCategories } from "@/server/categories";

import { ProductForm } from "../ProductForm";
import { createProduct } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminNovoProdutoPage() {
  const categories = await getAdminCategories();

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-zinc-950">Cadastrar produto</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-700">
          Informe os dados do produto e use uma URL provisória para a imagem principal.
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
