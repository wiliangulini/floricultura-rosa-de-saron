import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import {
  getLegacyProductSlugsToRemove,
  LEGACY_DEMO_PRODUCT_SLUGS,
  shouldApplyLegacyProductRemoval,
} from "./remove-legacy-products-utils";

function getDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL não definida. Configure a variável antes de remover produtos legados.",
    );
  }

  return databaseUrl;
}

async function removeLegacyProducts(): Promise<void> {
  const applyChanges = shouldApplyLegacyProductRemoval(process.argv.slice(2));
  const adapter = new PrismaPg(getDatabaseUrl());
  const prisma = new PrismaClient({ adapter });

  try {
    const existingProducts = await prisma.product.findMany({
      select: {
        slug: true,
      },
      where: {
        slug: {
          in: [...LEGACY_DEMO_PRODUCT_SLUGS],
        },
      },
    });
    const slugsToRemove = getLegacyProductSlugsToRemove(
      existingProducts.map((product) => product.slug),
    );

    console.log(
      applyChanges
        ? "Aplicando remoção de produtos demonstrativos:"
        : "Diagnóstico de produtos demonstrativos:",
    );

    for (const slug of LEGACY_DEMO_PRODUCT_SLUGS) {
      console.log(
        slugsToRemove.includes(slug) ? `- [REMOVER] ${slug}` : `- [AUSENTE] ${slug}`,
      );
    }

    if (!applyChanges) {
      console.log(
        `\nDry-run concluído. ${slugsToRemove.length} produto(s) seriam removidos. ` +
          "Produtos com outros slugs serão preservados.",
      );
      return;
    }

    const result = await prisma.product.deleteMany({
      where: {
        slug: {
          in: slugsToRemove,
        },
      },
    });

    console.log(
      `\n${result.count} produto(s) demonstrativo(s) removido(s). ` +
        "Produtos externos ao catálogo foram preservados.",
    );
  } finally {
    await prisma.$disconnect();
  }
}

removeLegacyProducts().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});

