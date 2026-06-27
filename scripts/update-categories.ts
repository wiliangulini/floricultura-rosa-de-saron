import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import { categoryCatalog } from "../prisma/category-catalog";

type CategorySnapshot = {
  description: string | null;
  name: string;
  slug: string;
  sortOrder: number;
};

function getDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL não definida. Configure a variável antes de atualizar as categorias.",
    );
  }

  return databaseUrl;
}

function shouldApplyChanges(args: string[]): boolean {
  const unknownArgs = args.filter((arg) => arg !== "--apply");

  if (unknownArgs.length > 0) {
    throw new Error(`Argumento não reconhecido: ${unknownArgs.join(", ")}`);
  }

  return args.includes("--apply");
}

function describeChanges(existingCategories: CategorySnapshot[]): string[] {
  const existingBySlug = new Map(
    existingCategories.map((category) => [category.slug, category]),
  );

  return categoryCatalog.map((category) => {
    const existing = existingBySlug.get(category.slug);

    if (!existing) {
      return `[CRIAR] ${category.name} (${category.slug}) — ordem ${category.sortOrder}`;
    }

    const changedFields = [
      existing.name !== category.name ? "nome" : null,
      existing.description !== category.description ? "descrição" : null,
      existing.sortOrder !== category.sortOrder ? "ordem" : null,
    ].filter((field): field is string => field !== null);

    if (changedFields.length === 0) {
      return `[SEM ALTERAÇÃO] ${category.name} (${category.slug})`;
    }

    return `[ATUALIZAR] ${category.name} (${category.slug}) — ${changedFields.join(", ")}`;
  });
}

async function updateCategories(): Promise<void> {
  const applyChanges = shouldApplyChanges(process.argv.slice(2));
  const adapter = new PrismaPg(getDatabaseUrl());
  const prisma = new PrismaClient({ adapter });

  try {
    const existingCategories = await prisma.category.findMany({
      where: {
        slug: {
          in: categoryCatalog.map((category) => category.slug),
        },
      },
      select: {
        description: true,
        name: true,
        slug: true,
        sortOrder: true,
      },
    });

    const changes = describeChanges(existingCategories);
    console.log(applyChanges ? "Aplicando atualização de categorias:" : "Diagnóstico de categorias:");
    changes.forEach((change) => console.log(`- ${change}`));

    if (!applyChanges) {
      console.log(
        "\nDry-run concluído. Nenhum dado foi alterado. Use --apply para confirmar a atualização.",
      );
      return;
    }

    await prisma.$transaction(
      categoryCatalog.map((category) =>
        prisma.category.upsert({
          where: {
            slug: category.slug,
          },
          update: {
            description: category.description,
            name: category.name,
            sortOrder: category.sortOrder,
          },
          create: {
            active: true,
            description: category.description,
            name: category.name,
            slug: category.slug,
            sortOrder: category.sortOrder,
          },
        }),
      ),
    );

    console.log("\nCategorias atualizadas com sucesso.");
  } finally {
    await prisma.$disconnect();
  }
}

updateCategories().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
