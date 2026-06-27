import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import {
  getStoreLocationUpdate,
  LEGACY_CITY,
  replaceLegacyCity,
  shouldApplyStoreLocationUpdate,
  STORE_CITY,
} from "./store-location-utils";

function getDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL não definida. Configure a variável antes de atualizar a localização.",
    );
  }

  return databaseUrl;
}

async function updateStoreLocation(): Promise<void> {
  const applyChanges = shouldApplyStoreLocationUpdate(process.argv.slice(2));
  const adapter = new PrismaPg(getDatabaseUrl());
  const prisma = new PrismaClient({ adapter });

  try {
    const settingsRecords = await prisma.settings.findMany({
      orderBy: {
        createdAt: "asc",
      },
      select: {
        city: true,
        deliveryDescription: true,
        id: true,
        seoDefaultDescription: true,
        seoDefaultTitle: true,
        state: true,
      },
    });

    if (settingsRecords.length !== 1) {
      throw new Error(
        `Esperado exatamente um registro Settings; encontrados: ${settingsRecords.length}.`,
      );
    }

    const [settings] = settingsRecords;
    const settingsUpdate = getStoreLocationUpdate(settings);
    const products = await prisma.product.findMany({
      select: {
        id: true,
        seoDescription: true,
        seoTitle: true,
        slug: true,
      },
      where: {
        OR: [
          {
            seoTitle: {
              contains: LEGACY_CITY,
            },
          },
          {
            seoDescription: {
              contains: LEGACY_CITY,
            },
          },
        ],
      },
    });

    console.log(applyChanges ? "Aplicando atualização de localização:" : "Diagnóstico de localização:");
    console.log(
      Object.keys(settingsUpdate).length > 0
        ? `- [ATUALIZAR] Settings: ${Object.keys(settingsUpdate).join(", ")}`
        : "- [SEM ALTERAÇÃO] Settings",
    );

    for (const product of products) {
      console.log(`- [ATUALIZAR] SEO do produto: ${product.slug}`);
    }

    if (!applyChanges) {
      console.log(
        `\nDry-run concluído. Destino: ${STORE_CITY}. ` +
          `${products.length} produto(s) com SEO legado. Nenhum dado foi alterado.`,
      );
      return;
    }

    await prisma.$transaction(async (transaction) => {
      if (Object.keys(settingsUpdate).length > 0) {
        await transaction.settings.update({
          data: settingsUpdate,
          where: {
            id: settings.id,
          },
        });
      }

      for (const product of products) {
        await transaction.product.update({
          data: {
            seoDescription: replaceLegacyCity(product.seoDescription),
            seoTitle: replaceLegacyCity(product.seoTitle),
          },
          where: {
            id: product.id,
          },
        });
      }
    });

    console.log(
      `\nLocalização atualizada para ${STORE_CITY}. ` +
        `${products.length} produto(s) tiveram o SEO corrigido.`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

updateStoreLocation().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});

