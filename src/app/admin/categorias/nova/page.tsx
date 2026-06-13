import { CategoryForm } from "../CategoryForm";
import { createCategory } from "../actions";

export const dynamic = "force-dynamic";

export default function AdminNovaCategoriaPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-zinc-950">Cadastrar categoria</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-700">
          Informe os dados básicos para organizar os produtos no catálogo.
        </p>
      </div>

      <CategoryForm
        action={createCategory}
        initialValues={{
          active: true,
          description: "",
          name: "",
          sortOrder: 0,
        }}
        submitLabel="Cadastrar categoria"
      />
    </section>
  );
}
