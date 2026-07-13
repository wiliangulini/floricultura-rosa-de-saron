import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [totalProducts, activeProducts, featuredProducts] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({
      where: {
        active: true,
      },
    }),
    prisma.product.count({
      where: {
        active: true,
        featured: true,
      },
    }),
  ]);

  const stats = [
    {
      description: "Total de produtos cadastrados na loja.",
      label: "Produtos cadastrados",
      value: totalProducts,
    },
    {
      description: "Produtos visíveis para os clientes.",
      label: "Produtos ativos",
      value: activeProducts,
    },
    {
      description: "Produtos ativos marcados para destaque.",
      label: "Produtos em destaque",
      value: featuredProducts,
    },
  ] as const;

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">Painel administrativo</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-700">
            Acompanhe um resumo simples dos produtos cadastrados na floricultura.
          </p>
        </div>

        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-rose-700 px-5 py-2.5 text-base font-semibold text-white shadow-sm shadow-rose-900/10 transition hover:bg-rose-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
          href="/admin/produtos/novo"
        >
          Cadastrar produto
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardTitle>{stat.label}</CardTitle>
              <CardDescription>{stat.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-rose-800">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
