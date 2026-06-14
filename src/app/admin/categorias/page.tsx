import Link from "next/link";

import { Badge, EmptyState } from "@/components/ui";
import { getAdminCategories } from "@/server/categories";

import { toggleCategoryActive } from "./actions";

export const dynamic = "force-dynamic";

type ResultMessage = {
  text: string;
  type: "error" | "success";
};

type AdminCategoriasPageProps = {
  searchParams?: Promise<{
    resultado?: string | string[];
  }>;
};

const resultMessages = {
  "categoria-criada": {
    text: "Categoria cadastrada com sucesso.",
    type: "success",
  },
  "categoria-atualizada": {
    text: "Categoria atualizada com sucesso.",
    type: "success",
  },
  "categoria-ativada": {
    text: "Categoria ativada com sucesso.",
    type: "success",
  },
  "categoria-desativada": {
    text: "Categoria desativada com sucesso.",
    type: "success",
  },
  "erro-alternar": {
    text: "Não foi possível alterar o status da categoria.",
    type: "error",
  },
} satisfies Record<string, ResultMessage>;

export default async function AdminCategoriasPage({ searchParams }: AdminCategoriasPageProps) {
  const categories = await getAdminCategories();
  const params = searchParams ? await searchParams : {};
  const resultMessage = getResultMessage(params.resultado);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-950">Gerenciar categorias</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-700">
            Cadastre categorias e controle quais ficam ativas no catálogo da floricultura.
          </p>
        </div>

        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-rose-700 px-5 py-2.5 text-base font-semibold text-white shadow-sm shadow-rose-900/10 transition hover:bg-rose-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
          href="/admin/categorias/nova"
        >
          Nova categoria
        </Link>
      </div>

      {resultMessage ? (
        <p
          className={`rounded-md px-3 py-2 text-sm font-medium ${
            resultMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800"
              : "bg-red-50 text-red-700"
          }`}
          role={resultMessage.type === "success" ? "status" : "alert"}
        >
          {resultMessage.text}
        </p>
      ) : null}

      {categories.length > 0 ? (
        <>
          <ul className="grid gap-4 md:hidden" role="list">
            {categories.map((category) => (
              <li
                className="rounded-lg border border-rose-100 bg-white p-4 shadow-sm shadow-rose-950/5"
                key={category.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-zinc-950">{category.name}</p>
                    {category.description ? (
                      <p className="mt-1 text-sm leading-6 text-zinc-600">
                        {category.description}
                      </p>
                    ) : null}
                  </div>
                  <Badge variant={category.active ? "sage" : "neutral"}>
                    {category.active ? "Ativa" : "Inativa"}
                  </Badge>
                </div>

                <dl className="mt-4 text-sm">
                  <div>
                    <dt className="font-medium text-zinc-600">Ordem de exibição</dt>
                    <dd className="font-semibold text-zinc-950">{category.sortOrder}</dd>
                  </div>
                </dl>

                <div className="mt-4 grid gap-2">
                  <Link
                    className="inline-flex min-h-11 items-center justify-center rounded-md border border-rose-300 bg-white px-3 py-2 text-sm font-semibold text-rose-900 transition hover:border-rose-500 hover:bg-rose-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
                    href={`/admin/categorias/${category.id}/editar`}
                  >
                    Editar
                  </Link>
                  <form action={toggleCategoryActive}>
                    <input name="categoryId" type="hidden" value={category.id} />
                    <button
                      className="inline-flex min-h-11 w-full items-center justify-center rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-800 transition hover:border-zinc-500 hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
                      type="submit"
                    >
                      {category.active ? "Desativar" : "Ativar"}
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>

          <div className="hidden overflow-hidden rounded-lg border border-rose-100 bg-white shadow-sm shadow-rose-950/5 md:block">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-rose-100 text-left text-sm">
              <thead className="bg-rose-50/80 text-xs font-semibold uppercase text-zinc-600">
                <tr>
                  <th className="px-4 py-3" scope="col">
                    Categoria
                  </th>
                  <th className="px-4 py-3" scope="col">
                    Status
                  </th>
                  <th className="px-4 py-3" scope="col">
                    Ordem
                  </th>
                  <th className="px-4 py-3 text-right" scope="col">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-100 bg-white">
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td className="px-4 py-4 align-top">
                      <p className="font-semibold text-zinc-950">{category.name}</p>
                      {category.description ? (
                        <p className="mt-1 max-w-xl text-sm leading-6 text-zinc-600">
                          {category.description}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <Badge variant={category.active ? "sage" : "neutral"}>
                        {category.active ? "Ativa" : "Inativa"}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 align-top text-zinc-700">{category.sortOrder}</td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:justify-end">
                        <Link
                          className="inline-flex min-h-11 items-center justify-center rounded-md border border-rose-300 bg-white px-3 py-2 text-sm font-semibold text-rose-900 transition hover:border-rose-500 hover:bg-rose-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
                          href={`/admin/categorias/${category.id}/editar`}
                        >
                          Editar
                        </Link>
                        <form action={toggleCategoryActive}>
                          <input name="categoryId" type="hidden" value={category.id} />
                          <button
                            className="inline-flex min-h-11 w-full items-center justify-center rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-800 transition hover:border-zinc-500 hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
                            type="submit"
                          >
                            {category.active ? "Desativar" : "Ativar"}
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        </>
      ) : (
        <EmptyState
          action={
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-md bg-rose-700 px-6 py-3 text-base font-semibold text-white shadow-sm shadow-rose-900/10 transition hover:bg-rose-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
              href="/admin/categorias/nova"
            >
              Cadastrar categoria
            </Link>
          }
          description="Cadastre a primeira categoria para organizar os produtos do catálogo."
          title="Nenhuma categoria cadastrada ainda"
        />
      )}
    </section>
  );
}

function getResultMessage(value: string | string[] | undefined): ResultMessage | null {
  const key = Array.isArray(value) ? value[0] : value;

  if (!key) {
    return null;
  }

  return resultMessages[key as keyof typeof resultMessages] ?? null;
}
