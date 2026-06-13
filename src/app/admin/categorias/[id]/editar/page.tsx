import { notFound } from "next/navigation";

import { getAdminCategoryById } from "@/server/categories";

import { CategoryForm } from "../../CategoryForm";
import { updateCategory } from "../../actions";

type AdminEditarCategoriaPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function AdminEditarCategoriaPage({
  params,
}: AdminEditarCategoriaPageProps) {
  const { id } = await params;
  const category = await getAdminCategoryById(id);

  if (!category) {
    notFound();
  }

  const updateCategoryAction = updateCategory.bind(null, category.id);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-zinc-950">Editar categoria</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-700">
          Atualize os dados da categoria e salve para refletir no catálogo.
        </p>
      </div>

      <CategoryForm
        action={updateCategoryAction}
        initialValues={{
          active: category.active,
          description: category.description,
          name: category.name,
          sortOrder: category.sortOrder,
        }}
        submitLabel="Salvar alterações"
      />
    </section>
  );
}
