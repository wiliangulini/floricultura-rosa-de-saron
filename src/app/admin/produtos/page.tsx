import Image from "next/image";
import Link from "next/link";

import { Badge, EmptyState } from "@/components/ui";
import { formatCurrencyBRL } from "@/lib/money";
import { getAdminProducts, type AdminProduct } from "@/server/products";

import { toggleProductActive, toggleProductFeatured } from "./actions";
import { DeleteProductButton } from "./DeleteProductButton";

export const dynamic = "force-dynamic";

type ResultMessage = {
  text: string;
  type: "error" | "success";
};

type AdminProdutosPageProps = {
  searchParams?: Promise<{
    resultado?: string | string[];
  }>;
};

const resultMessages = {
  "produto-criado": {
    text: "Produto cadastrado com sucesso.",
    type: "success",
  },
  "produto-atualizado": {
    text: "Produto atualizado com sucesso.",
    type: "success",
  },
  "produto-ativado": {
    text: "Produto ativado com sucesso.",
    type: "success",
  },
  "produto-desativado": {
    text: "Produto desativado com sucesso.",
    type: "success",
  },
  "produto-destacado": {
    text: "Produto marcado como destaque.",
    type: "success",
  },
  "produto-sem-destaque": {
    text: "Produto removido dos destaques.",
    type: "success",
  },
  "erro-status": {
    text: "Não foi possível alterar o status do produto.",
    type: "error",
  },
  "erro-destaque": {
    text: "Não foi possível alterar o destaque do produto.",
    type: "error",
  },
  "produto-excluido": {
    text: "Produto excluído com sucesso.",
    type: "success",
  },
  "erro-excluir": {
    text: "Não foi possível excluir o produto.",
    type: "error",
  },
} satisfies Record<string, ResultMessage>;

export default async function AdminProdutosPage({ searchParams }: AdminProdutosPageProps) {
  const products = await getAdminProducts();
  const params = searchParams ? await searchParams : {};
  const resultMessage = getResultMessage(params.resultado);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">Gerenciar produtos</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-700">
            Cadastre produtos, controle a visibilidade no catálogo e mantenha imagens provisórias
            por link de imagem.
          </p>
        </div>

        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-rose-700 px-5 py-2.5 text-base font-semibold text-white shadow-sm shadow-rose-900/10 transition hover:bg-rose-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
          href="/admin/produtos/novo"
        >
          Novo produto
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

      {products.length > 0 ? (
        <>
          <ul className="grid gap-4 md:hidden" role="list">
            {products.map((product) => (
              <li
                className="rounded-lg border border-rose-100 bg-white p-4 shadow-sm shadow-rose-950/5"
                key={product.id}
              >
                <div className="flex items-start gap-3">
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-md border border-rose-100 bg-rose-50">
                    {product.mainImage ? (
                      <Image
                        alt={product.mainImage.altText || product.name}
                        className="object-cover"
                        fill
                        sizes="80px"
                        src={product.mainImage.url}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-2 text-center text-xs font-semibold text-rose-900">
                        Sem imagem
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-zinc-950">{product.name}</p>
                    {product.shortDescription ? (
                      <p className="mt-1 line-clamp-2 text-sm leading-6 text-zinc-600">
                        {product.shortDescription}
                      </p>
                    ) : null}
                    <p className="mt-2 text-sm font-semibold text-rose-900">
                      {formatAdminProductPrice(product)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant={product.active ? "sage" : "neutral"}>
                    {product.active ? "Ativo" : "Inativo"}
                  </Badge>
                  <Badge variant={product.available ? "rose" : "neutral"}>
                    {product.available ? "Disponível" : "Indisponível"}
                  </Badge>
                  {product.featured ? <Badge variant="gold">Destaque</Badge> : null}
                  {product.seasonal ? <Badge variant="neutral">Sazonal</Badge> : null}
                </div>

                <dl className="mt-4 grid gap-2 text-sm">
                  <div>
                    <dt className="font-medium text-zinc-600">Categoria</dt>
                    <dd className="font-semibold text-zinc-950">{product.category.name}</dd>
                  </div>
                  {product.category.active ? null : (
                    <div>
                      <dt className="font-medium text-zinc-600">Aviso</dt>
                      <dd className="font-semibold text-zinc-950">Categoria inativa</dd>
                    </div>
                  )}
                </dl>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <form action={toggleProductActive}>
                    <input name="productId" type="hidden" value={product.id} />
                    <button
                      className="inline-flex min-h-11 w-full items-center justify-center rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-800 transition hover:border-zinc-500 hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
                      type="submit"
                    >
                      {product.active ? "Desativar" : "Ativar"}
                    </button>
                  </form>
                  <form action={toggleProductFeatured}>
                    <input name="productId" type="hidden" value={product.id} />
                    <button
                      className="inline-flex min-h-11 w-full items-center justify-center rounded-md border border-amber-300 bg-white px-3 py-2 text-sm font-semibold text-amber-900 transition hover:border-amber-500 hover:bg-amber-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
                      type="submit"
                    >
                      {product.featured ? "Remover destaque" : "Destacar"}
                    </button>
                  </form>
                  <Link
                    className="inline-flex min-h-11 w-full items-center justify-center rounded-md border border-rose-300 bg-white px-3 py-2 text-sm font-semibold text-rose-900 transition hover:border-rose-500 hover:bg-rose-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
                    href={`/admin/produtos/${product.id}/editar`}
                  >
                    Editar
                  </Link>
                  <DeleteProductButton productId={product.id} productName={product.name} />
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
                    Produto
                  </th>
                  <th className="px-4 py-3" scope="col">
                    Status
                  </th>
                  <th className="px-4 py-3" scope="col">
                    Categoria
                  </th>
                  <th className="px-4 py-3" scope="col">
                    Preço
                  </th>
                  <th className="px-4 py-3 text-right" scope="col">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-100 bg-white">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-4 py-4 align-top">
                      <div className="flex min-w-0 flex-1 items-start gap-3">
                        <div className="relative size-16 shrink-0 overflow-hidden rounded-md border border-rose-100 bg-rose-50">
                          {product.mainImage ? (
                            <Image
                              alt={product.mainImage.altText || product.name}
                              className="object-cover"
                              fill
                              sizes="64px"
                              src={product.mainImage.url}
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center px-2 text-center text-[0.65rem] font-semibold text-rose-900">
                              Sem imagem
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-zinc-950">{product.name}</p>
                          {product.shortDescription ? (
                            <p className="mt-1 line-clamp-2 max-w-md text-sm leading-6 text-zinc-600">
                              {product.shortDescription}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant={product.active ? "sage" : "neutral"}>
                          {product.active ? "Ativo" : "Inativo"}
                        </Badge>
                        <Badge variant={product.available ? "rose" : "neutral"}>
                          {product.available ? "Disponível" : "Indisponível"}
                        </Badge>
                        {product.featured ? <Badge variant="gold">Destaque</Badge> : null}
                        {product.seasonal ? <Badge variant="neutral">Sazonal</Badge> : null}
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="text-zinc-700">
                        <p className="font-medium text-zinc-950">{product.category.name}</p>
                        {product.category.active ? null : (
                          <p className="mt-1 text-xs font-medium text-zinc-500">
                            Categoria inativa
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top font-semibold text-rose-900">
                      <span className="whitespace-nowrap">{formatAdminProductPrice(product)}</span>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="grid grid-cols-2 gap-2">
                        <form action={toggleProductActive}>
                          <input name="productId" type="hidden" value={product.id} />
                          <button
                            className="inline-flex min-h-11 w-full items-center justify-center rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-800 transition hover:border-zinc-500 hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
                            type="submit"
                          >
                            {product.active ? "Desativar" : "Ativar"}
                          </button>
                        </form>
                        <form action={toggleProductFeatured}>
                          <input name="productId" type="hidden" value={product.id} />
                          <button
                            className="inline-flex min-h-11 w-full items-center justify-center rounded-md border border-amber-300 bg-white px-3 py-2 text-sm font-semibold text-amber-900 transition hover:border-amber-500 hover:bg-amber-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
                            type="submit"
                          >
                            {product.featured ? "Remover destaque" : "Destacar"}
                          </button>
                        </form>
                        <Link
                          className="inline-flex min-h-11 w-full items-center justify-center rounded-md border border-rose-300 bg-white px-3 py-2 text-sm font-semibold text-rose-900 transition hover:border-rose-500 hover:bg-rose-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
                          href={`/admin/produtos/${product.id}/editar`}
                        >
                          Editar
                        </Link>
                        <DeleteProductButton productId={product.id} productName={product.name} />
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
              href="/admin/produtos/novo"
            >
              Cadastrar produto
            </Link>
          }
          description="Cadastre o primeiro produto para começar a montar o catálogo público."
          title="Nenhum produto cadastrado ainda"
        />
      )}
    </section>
  );
}

function formatAdminProductPrice(product: AdminProduct): string {
  if (!product.price || product.priceType === "ON_REQUEST") {
    return "Sob consulta";
  }

  const price = Number(product.price);
  const formattedPrice = Number.isFinite(price) ? formatCurrencyBRL(price) : product.price;

  if (product.priceType === "STARTING_FROM") {
    return `A partir de ${formattedPrice}`;
  }

  return formattedPrice;
}

function getResultMessage(value: string | string[] | undefined): ResultMessage | null {
  const key = Array.isArray(value) ? value[0] : value;

  if (!key) {
    return null;
  }

  return resultMessages[key as keyof typeof resultMessages] ?? null;
}
