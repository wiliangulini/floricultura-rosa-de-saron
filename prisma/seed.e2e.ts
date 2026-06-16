import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, PriceType, UserRole } from "@prisma/client";

import { slugify } from "../src/lib/slug";

function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL não definida. Configure a variável antes de rodar o seed.");
  }

  return databaseUrl;
}

const adapter = new PrismaPg(getDatabaseUrl());
const prisma = new PrismaClient({ adapter });

const E2E_ADMIN_EMAIL = "e2e-test@floricultura.com";
const E2E_ADMIN_PASSWORD = "SenhaTestE2E@123!";
const E2E_INACTIVE_EMAIL = "inativo-e2e@floricultura.com";
const E2E_CATEGORY_NAME = "Categoria de Teste E2E";
const E2E_CATEGORY_SLUG = slugify(E2E_CATEGORY_NAME);
const E2E_PRODUCT_NAME = "Produto de Teste E2E";
const E2E_PRODUCT_SLUG = slugify(E2E_PRODUCT_NAME);

async function main() {
  console.log("Iniciando seed E2E...\n");

  const adminPasswordHash = await bcrypt.hash(E2E_ADMIN_PASSWORD, 12);
  const inactivePasswordHash = await bcrypt.hash("SenhaInativoE2E@999!", 12);

  await prisma.user.upsert({
    where: { email: E2E_ADMIN_EMAIL },
    update: {
      name: "Teste E2E",
      passwordHash: adminPasswordHash,
      role: UserRole.ADMIN,
      active: true,
    },
    create: {
      name: "Teste E2E",
      email: E2E_ADMIN_EMAIL,
      passwordHash: adminPasswordHash,
      role: UserRole.ADMIN,
      active: true,
    },
  });
  console.log(`✔ Usuário admin E2E: ${E2E_ADMIN_EMAIL}`);

  await prisma.user.upsert({
    where: { email: E2E_INACTIVE_EMAIL },
    update: {
      name: "Usuário Inativo E2E",
      passwordHash: inactivePasswordHash,
      role: UserRole.ADMIN,
      active: false,
    },
    create: {
      name: "Usuário Inativo E2E",
      email: E2E_INACTIVE_EMAIL,
      passwordHash: inactivePasswordHash,
      role: UserRole.ADMIN,
      active: false,
    },
  });
  console.log(`✔ Usuário inativo E2E: ${E2E_INACTIVE_EMAIL}`);

  const e2eCategory = await prisma.category.upsert({
    where: { slug: E2E_CATEGORY_SLUG },
    update: {
      name: E2E_CATEGORY_NAME,
      description: "Categoria criada para testes E2E automatizados.",
      active: true,
      sortOrder: 99,
    },
    create: {
      name: E2E_CATEGORY_NAME,
      slug: E2E_CATEGORY_SLUG,
      description: "Categoria criada para testes E2E automatizados.",
      active: true,
      sortOrder: 99,
    },
  });
  console.log(`✔ Categoria E2E: ${E2E_CATEGORY_NAME} (${E2E_CATEGORY_SLUG})`);

  const e2eProduct = await prisma.product.upsert({
    where: { slug: E2E_PRODUCT_SLUG },
    update: {
      categoryId: e2eCategory.id,
      name: E2E_PRODUCT_NAME,
      shortDescription: "Produto criado para testes E2E automatizados.",
      description: "Este produto é usado exclusivamente em testes E2E.",
      price: "10.00",
      priceType: PriceType.FIXED,
      active: true,
      available: true,
      featured: false,
      seasonal: false,
      seoTitle: `${E2E_PRODUCT_NAME} | Floricultura`,
      seoDescription: "Produto criado para testes E2E automatizados.",
    },
    create: {
      categoryId: e2eCategory.id,
      name: E2E_PRODUCT_NAME,
      slug: E2E_PRODUCT_SLUG,
      shortDescription: "Produto criado para testes E2E automatizados.",
      description: "Este produto é usado exclusivamente em testes E2E.",
      price: "10.00",
      priceType: PriceType.FIXED,
      active: true,
      available: true,
      featured: false,
      seasonal: false,
      seoTitle: `${E2E_PRODUCT_NAME} | Floricultura`,
      seoDescription: "Produto criado para testes E2E automatizados.",
    },
  });
  console.log(`✔ Produto E2E: ${E2E_PRODUCT_NAME} (${E2E_PRODUCT_SLUG})`);

  const imageId = `${E2E_PRODUCT_SLUG}-main-image`;

  await prisma.productImage.upsert({
    where: { id: imageId },
    update: {
      productId: e2eProduct.id,
      url: "https://placehold.co/800x600/fdf2f8/881337/png?text=Teste+E2E",
      altText: E2E_PRODUCT_NAME,
      isMain: true,
      sortOrder: 1,
    },
    create: {
      id: imageId,
      productId: e2eProduct.id,
      url: "https://placehold.co/800x600/fdf2f8/881337/png?text=Teste+E2E",
      altText: E2E_PRODUCT_NAME,
      isMain: true,
      sortOrder: 1,
    },
  });
  console.log(`✔ Imagem do produto E2E`);

  console.log("\nSeed E2E concluído com sucesso!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
