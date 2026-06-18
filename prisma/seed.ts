import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, PriceType, UserRole } from "@prisma/client";

import { slugify } from "../src/lib/slug";
import { getAdminInitialPassword } from "./seed-utils";

function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL não definida. Configure a variável antes de rodar o seed.");
  }

  return databaseUrl;
}

const adapter = new PrismaPg(getDatabaseUrl());
const prisma = new PrismaClient({ adapter });

const ADMIN_EMAIL = "admin@floricultura.com";
const SETTINGS_ID = "default-settings";
const STORE_WHATSAPP_NUMBER = "5546991168949";

const categories = [
  {
    name: "Buquês",
    description: "Buquês para presentes, celebrações e datas especiais.",
  },
  {
    name: "Arranjos",
    description: "Arranjos florais delicados para decorar e presentear.",
  },
  {
    name: "Cestas",
    description: "Cestas especiais com flores e itens para presente.",
  },
  {
    name: "Flores naturais",
    description: "Flores naturais selecionadas conforme a disponibilidade da loja.",
  },
  {
    name: "Presentes",
    description: "Opções presenteáveis com flores e complementos especiais.",
  },
] as const;

const products = [
  {
    name: "Buquê de Rosas Vermelhas",
    categorySlug: "buques",
    shortDescription: "Buquê clássico com rosas vermelhas selecionadas.",
    description:
      "Um buquê elegante de rosas vermelhas, ideal para declarações, aniversários e momentos especiais.",
    price: "129.90",
    featured: true,
    seasonal: false,
    imageUrl: "https://placehold.co/800x600/fdf2f8/881337/png?text=Buque+de+Rosas",
  },
  {
    name: "Arranjo de Flores do Campo",
    categorySlug: "arranjos",
    shortDescription: "Arranjo colorido com flores do campo.",
    description:
      "Composição leve e alegre com flores do campo, indicada para presentear ou decorar ambientes.",
    price: "89.90",
    featured: true,
    seasonal: false,
    imageUrl: "https://placehold.co/800x600/f0fdf4/166534/png?text=Flores+do+Campo",
  },
  {
    name: "Cesta Especial com Flores",
    categorySlug: "cestas",
    shortDescription: "Cesta presenteável com flores e composição especial.",
    description:
      "Cesta preparada para ocasiões especiais, combinando flores selecionadas e apresentação cuidadosa.",
    price: "159.90",
    featured: true,
    seasonal: false,
    imageUrl: "https://placehold.co/800x600/fff7ed/9a3412/png?text=Cesta+com+Flores",
  },
  {
    name: "Orquídea Presenteável",
    categorySlug: "presentes",
    shortDescription: "Orquídea pronta para presentear.",
    description:
      "Orquídea em embalagem presenteável, uma opção sofisticada para carinho, agradecimento ou celebração.",
    price: "119.90",
    featured: false,
    seasonal: false,
    imageUrl: "https://placehold.co/800x600/f5f3ff/6d28d9/png?text=Orquidea",
  },
] as const;

async function main() {
  console.log("Iniciando seed...\n");

  const existingAdmin = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL },
    select: { id: true },
  });

  if (existingAdmin) {
    await prisma.user.update({
      where: { email: ADMIN_EMAIL },
      data: {
        name: "Administradora",
        // passwordHash, active e role preservados intencionalmente.
        // O seed não deve resetar credenciais nem reativar conta desativada.
      },
    });
    console.log(`✔ Usuário admin atualizado (senha preservada): ${ADMIN_EMAIL}`);
  } else {
    const initialPassword = getAdminInitialPassword();
    const passwordHash = await bcrypt.hash(initialPassword, 12);

    await prisma.user.create({
      data: {
        name: "Administradora",
        email: ADMIN_EMAIL,
        passwordHash,
        role: UserRole.ADMIN,
        active: true,
      },
    });
    console.log(`✔ Usuário admin criado: ${ADMIN_EMAIL}`);
  }

  await prisma.settings.upsert({
    where: { id: SETTINGS_ID },
    update: {
      businessName: "Floricultura",
      whatsappNumber: STORE_WHATSAPP_NUMBER,
      city: "Pato Branco",
      state: "PR",
      seoDefaultTitle: "Floricultura em Pato Branco | Buquês, arranjos e presentes",
      seoDefaultDescription:
        "Floricultura em Pato Branco com buquês, arranjos, cestas e flores naturais para presentear. Envie seu pedido pelo WhatsApp.",
    },
    create: {
      id: SETTINGS_ID,
      businessName: "Floricultura",
      whatsappNumber: STORE_WHATSAPP_NUMBER,
      city: "Pato Branco",
      state: "PR",
      seoDefaultTitle: "Floricultura em Pato Branco | Buquês, arranjos e presentes",
      seoDefaultDescription:
        "Floricultura em Pato Branco com buquês, arranjos, cestas e flores naturais para presentear. Envie seu pedido pelo WhatsApp.",
    },
  });
  console.log("✔ Configurações da loja");

  const categoryIdsBySlug = new Map<string, string>();

  for (const [index, category] of categories.entries()) {
    const slug = slugify(category.name);
    const savedCategory = await prisma.category.upsert({
      where: { slug },
      update: {
        name: category.name,
        description: category.description,
        active: true,
        sortOrder: index + 1,
      },
      create: {
        name: category.name,
        slug,
        description: category.description,
        active: true,
        sortOrder: index + 1,
      },
    });

    categoryIdsBySlug.set(slug, savedCategory.id);
    console.log(`✔ Categoria: ${category.name} (${slug})`);
  }

  for (const product of products) {
    const categoryId = categoryIdsBySlug.get(product.categorySlug);

    if (!categoryId) {
      throw new Error(`Categoria não encontrada para o produto: ${product.name}`);
    }

    const slug = slugify(product.name);
    const productRecord = await prisma.product.upsert({
      where: { slug },
      update: {
        categoryId,
        name: product.name,
        shortDescription: product.shortDescription,
        description: product.description,
        price: product.price,
        priceType: PriceType.FIXED,
        active: true,
        available: true,
        featured: product.featured,
        seasonal: product.seasonal,
        seoTitle: `${product.name} em Pato Branco | Floricultura`,
        seoDescription: product.shortDescription,
      },
      create: {
        categoryId,
        name: product.name,
        slug,
        shortDescription: product.shortDescription,
        description: product.description,
        price: product.price,
        priceType: PriceType.FIXED,
        active: true,
        available: true,
        featured: product.featured,
        seasonal: product.seasonal,
        seoTitle: `${product.name} em Pato Branco | Floricultura`,
        seoDescription: product.shortDescription,
      },
    });

    await prisma.productImage.upsert({
      where: { id: `${slug}-main-image` },
      update: {
        productId: productRecord.id,
        url: product.imageUrl,
        altText: product.name,
        isMain: true,
        sortOrder: 1,
      },
      create: {
        id: `${slug}-main-image`,
        productId: productRecord.id,
        url: product.imageUrl,
        altText: product.name,
        isMain: true,
        sortOrder: 1,
      },
    });
    console.log(`✔ Produto: ${product.name}`);
  }

  console.log("\nSeed concluído com sucesso!");
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
