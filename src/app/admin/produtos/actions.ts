"use server";

import { PriceType, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ADMIN_SESSION_COOKIE, readAdminSessionCookie } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slug";
import { getProductImageFile, ProductImageUploadError, uploadProductImage } from "@/server/images";

type ProductFieldErrors = {
  categoryId?: string;
  imageAltText?: string;
  imageFile?: string;
  imageUrl?: string;
  name?: string;
  price?: string;
  priceType?: string;
};

export type ProductActionState = {
  fieldErrors: ProductFieldErrors;
  message: string;
  status: "idle" | "error";
};

type ProductPriceType = (typeof validPriceTypes)[number];

type ValidatedProductData = {
  active: boolean;
  available: boolean;
  categoryId: string;
  description: string | null;
  featured: boolean;
  imageAltText: string | null;
  imageUrl: string | null;
  name: string;
  price: string | null;
  priceType: ProductPriceType;
  seasonal: boolean;
  seoDescription: string | null;
  seoTitle: string | null;
  shortDescription: string | null;
  slug: string;
};

type CategoryReference = {
  id: string;
  slug: string;
};

type ProductReference = {
  active: boolean;
  category: {
    slug: string;
  };
  featured: boolean;
  id: string;
  slug: string;
};

type ProductMainImageData = {
  altText: string | null;
  url: string | null;
};

const validPriceTypes = [PriceType.FIXED, PriceType.STARTING_FROM, PriceType.ON_REQUEST] as const;
const duplicateProductMessage = "Já existe um produto com esse nome.";
const maxPrice = 99999999.99;

async function requireAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  const session = await readAdminSessionCookie(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
  if (!session) {
    redirect("/admin/login");
  }
}

export async function createProduct(
  _previousState: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  await requireAdminSession();

  const validation = validateProductForm(formData);

  if (!validation.data) {
    return validation.state;
  }

  const category = await findCategoryReference(validation.data.categoryId);

  if (!category) {
    return createInvalidCategoryState();
  }

  const productWithSameSlug = await prisma.product.findUnique({
    select: {
      id: true,
    },
    where: {
      slug: validation.data.slug,
    },
  });

  if (productWithSameSlug) {
    return createDuplicateSlugState();
  }

  const mainImage = await resolveProductMainImage(formData, validation.data);

  if (!mainImage.data) {
    return mainImage.state;
  }

  try {
    await prisma.$transaction(async (transaction) => {
      const product = await transaction.product.create({
        data: createProductWriteData(validation.data),
        select: {
          id: true,
        },
      });

      await createMainProductImage(transaction, product.id, mainImage.data);
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return createDuplicateSlugState();
    }

    throw error;
  }

  revalidateProductPaths({
    categorySlugs: [category.slug],
    productSlugs: [validation.data.slug],
  });
  redirect("/admin/produtos?resultado=produto-criado");
}

export async function updateProduct(
  productId: string,
  _previousState: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  await requireAdminSession();

  const validation = validateProductForm(formData);

  if (!validation.data) {
    return validation.state;
  }

  const [currentProduct, category] = await Promise.all([
    findProductReference(productId),
    findCategoryReference(validation.data.categoryId),
  ]);

  if (!currentProduct) {
    return {
      fieldErrors: {},
      message: "Produto não encontrado. Volte para a lista e tente novamente.",
      status: "error",
    };
  }

  if (!category) {
    return createInvalidCategoryState();
  }

  const productWithSameSlug = await prisma.product.findUnique({
    select: {
      id: true,
    },
    where: {
      slug: validation.data.slug,
    },
  });

  if (productWithSameSlug && productWithSameSlug.id !== currentProduct.id) {
    return createDuplicateSlugState();
  }

  const mainImage = await resolveProductMainImage(formData, validation.data);

  if (!mainImage.data) {
    return mainImage.state;
  }

  try {
    await prisma.$transaction(async (transaction) => {
      await transaction.product.update({
        data: createProductUpdateData(validation.data),
        where: {
          id: currentProduct.id,
        },
      });

      await upsertMainProductImage(transaction, currentProduct.id, mainImage.data);
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return createDuplicateSlugState();
    }

    throw error;
  }

  revalidateProductPaths({
    categorySlugs: [currentProduct.category.slug, category.slug],
    productSlugs: [currentProduct.slug, validation.data.slug],
  });
  redirect("/admin/produtos?resultado=produto-atualizado");
}

export async function toggleProductActive(formData: FormData): Promise<void> {
  await requireAdminSession();

  const productId = getFormValue(formData, "productId").trim();

  if (!productId) {
    redirect("/admin/produtos?resultado=erro-status");
  }

  const product = await findProductReference(productId);

  if (!product) {
    redirect("/admin/produtos?resultado=erro-status");
  }

  const nextActive = !product.active;

  await prisma.product.update({
    data: {
      active: nextActive,
    },
    where: {
      id: product.id,
    },
  });

  revalidateProductPaths({
    categorySlugs: [product.category.slug],
    productSlugs: [product.slug],
  });
  redirect(`/admin/produtos?resultado=${nextActive ? "produto-ativado" : "produto-desativado"}`);
}

export async function toggleProductFeatured(formData: FormData): Promise<void> {
  await requireAdminSession();

  const productId = getFormValue(formData, "productId").trim();

  if (!productId) {
    redirect("/admin/produtos?resultado=erro-destaque");
  }

  const product = await findProductReference(productId);

  if (!product) {
    redirect("/admin/produtos?resultado=erro-destaque");
  }

  const nextFeatured = !product.featured;

  await prisma.product.update({
    data: {
      featured: nextFeatured,
    },
    where: {
      id: product.id,
    },
  });

  revalidateProductPaths({
    categorySlugs: [product.category.slug],
    productSlugs: [product.slug],
  });
  redirect(
    `/admin/produtos?resultado=${nextFeatured ? "produto-destacado" : "produto-sem-destaque"}`,
  );
}

function validateProductForm(formData: FormData):
  | {
      data: ValidatedProductData;
      state?: never;
    }
  | {
      data?: never;
      state: ProductActionState;
    } {
  const name = getFormValue(formData, "name").trim();
  const categoryId = getFormValue(formData, "categoryId").trim();
  const shortDescription = getFormValue(formData, "shortDescription").trim();
  const description = getFormValue(formData, "description").trim();
  const priceTypeValue = getFormValue(formData, "priceType").trim();
  const priceValue = getFormValue(formData, "price").trim();
  const imageUrlValue = getFormValue(formData, "imageUrl").trim();
  const imageAltTextValue = getFormValue(formData, "imageAltText").trim();
  const seoTitle = getFormValue(formData, "seoTitle").trim();
  const seoDescription = getFormValue(formData, "seoDescription").trim();
  const fieldErrors: ProductFieldErrors = {};
  const slug = slugify(name);

  if (!name) {
    fieldErrors.name = "Informe o nome do produto.";
  } else if (!slug) {
    fieldErrors.name = "Informe um nome com letras ou números.";
  }

  if (!categoryId) {
    fieldErrors.categoryId = "Escolha a categoria do produto.";
  }

  const priceType = parsePriceType(priceTypeValue);

  if (!priceType) {
    fieldErrors.priceType = "Escolha o tipo de preço.";
  }

  const price = priceType && priceType !== PriceType.ON_REQUEST ? parsePrice(priceValue) : null;

  if (priceType && priceType !== PriceType.ON_REQUEST && !price) {
    fieldErrors.price = "Informe um preço maior que zero com até duas casas decimais.";
  }

  const imageUrl = parseImageUrl(imageUrlValue);

  if (imageUrlValue && !imageUrl) {
    fieldErrors.imageUrl = "Informe uma URL de imagem começando com https://.";
  }

  if (Object.keys(fieldErrors).length > 0 || !priceType) {
    return {
      state: {
        fieldErrors,
        message: "Corrija os campos destacados para salvar o produto.",
        status: "error",
      },
    };
  }

  return {
    data: {
      active: formData.get("active") === "on",
      available: formData.get("available") === "on",
      categoryId,
      description: description || null,
      featured: formData.get("featured") === "on",
      imageAltText: imageAltTextValue || name,
      imageUrl,
      name,
      price,
      priceType,
      seasonal: formData.get("seasonal") === "on",
      seoDescription: seoDescription || null,
      seoTitle: seoTitle || null,
      shortDescription: shortDescription || null,
      slug,
    },
  };
}

function parsePriceType(value: string): ProductPriceType | null {
  return validPriceTypes.find((priceType) => priceType === value) ?? null;
}

function parsePrice(value: string): string | null {
  if (!/^(\d+)([,.](\d{1,2}))?$/.test(value)) {
    return null;
  }

  const parsedValue = Number.parseFloat(value.replace(",", "."));

  if (!Number.isFinite(parsedValue) || parsedValue <= 0 || parsedValue > maxPrice) {
    return null;
  }

  return parsedValue.toFixed(2);
}

function parseImageUrl(value: string): string | null {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);

    if (url.protocol !== "https:" || !url.hostname) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

async function resolveProductMainImage(
  formData: FormData,
  data: ValidatedProductData,
): Promise<
  | {
      data: ProductMainImageData;
      state?: never;
    }
  | {
      data?: never;
      state: ProductActionState;
    }
> {
  const imageFile = getProductImageFile(formData);
  const fallbackImage: ProductMainImageData = {
    altText: data.imageUrl ? data.imageAltText || data.name : null,
    url: data.imageUrl,
  };

  if (!imageFile) {
    return {
      data: fallbackImage,
    };
  }

  try {
    const uploadedImage = await uploadProductImage({
      file: imageFile,
      productName: data.name,
      productSlug: data.slug,
    });

    return {
      data: {
        altText: data.imageAltText || data.name,
        url: uploadedImage.url,
      },
    };
  } catch (error) {
    if (error instanceof ProductImageUploadError) {
      return {
        state: {
          fieldErrors: {
            imageFile: error.message,
          },
          message: "Não foi possível enviar a imagem do produto.",
          status: "error",
        },
      };
    }

    throw error;
  }
}

async function createMainProductImage(
  transaction: Prisma.TransactionClient,
  productId: string,
  image: ProductMainImageData,
): Promise<void> {
  if (!image.url) {
    return;
  }

  await transaction.productImage.create({
    data: {
      altText: image.altText,
      isMain: true,
      productId,
      sortOrder: 0,
      url: image.url,
    },
  });
}

async function upsertMainProductImage(
  transaction: Prisma.TransactionClient,
  productId: string,
  image: ProductMainImageData,
): Promise<void> {
  if (!image.url) {
    await transaction.productImage.deleteMany({
      where: {
        isMain: true,
        productId,
      },
    });
    return;
  }

  const currentMainImage = await transaction.productImage.findFirst({
    select: {
      id: true,
    },
    where: {
      isMain: true,
      productId,
    },
  });

  if (currentMainImage) {
    await transaction.productImage.update({
      data: {
        altText: image.altText,
        isMain: true,
        sortOrder: 0,
        url: image.url,
      },
      where: {
        id: currentMainImage.id,
      },
    });
    return;
  }

  await createMainProductImage(transaction, productId, image);
}

function createProductWriteData(data: ValidatedProductData): Prisma.ProductUncheckedCreateInput {
  return {
    active: data.active,
    available: data.available,
    categoryId: data.categoryId,
    description: data.description,
    featured: data.featured,
    name: data.name,
    price: data.price,
    priceType: data.priceType,
    seasonal: data.seasonal,
    seoDescription: data.seoDescription,
    seoTitle: data.seoTitle,
    shortDescription: data.shortDescription,
    slug: data.slug,
  };
}

function createProductUpdateData(data: ValidatedProductData): Prisma.ProductUncheckedUpdateInput {
  return createProductWriteData(data);
}

function createDuplicateSlugState(): ProductActionState {
  return {
    fieldErrors: {
      name: duplicateProductMessage,
    },
    message: "Não foi possível salvar o produto.",
    status: "error",
  };
}

function createInvalidCategoryState(): ProductActionState {
  return {
    fieldErrors: {
      categoryId: "Escolha uma categoria cadastrada.",
    },
    message: "Não foi possível salvar o produto.",
    status: "error",
  };
}

function getFormValue(formData: FormData, fieldName: string) {
  const value = formData.get(fieldName);

  return typeof value === "string" ? value : "";
}

async function findCategoryReference(categoryId: string): Promise<CategoryReference | null> {
  if (!categoryId) {
    return null;
  }

  return prisma.category.findUnique({
    select: {
      id: true,
      slug: true,
    },
    where: {
      id: categoryId,
    },
  });
}

async function findProductReference(productId: string): Promise<ProductReference | null> {
  if (!productId) {
    return null;
  }

  return prisma.product.findUnique({
    select: {
      active: true,
      category: {
        select: {
          slug: true,
        },
      },
      featured: true,
      id: true,
      slug: true,
    },
    where: {
      id: productId,
    },
  });
}

function revalidateProductPaths({
  categorySlugs,
  productSlugs,
}: {
  categorySlugs: string[];
  productSlugs: string[];
}) {
  revalidatePath("/admin/produtos");
  revalidatePath("/");
  revalidatePath("/produtos");
  revalidatePath("/api/produtos");

  for (const slug of new Set(categorySlugs)) {
    revalidatePath(`/categoria/${slug}`);
  }

  for (const slug of new Set(productSlugs)) {
    revalidatePath(`/produto/${slug}`);
    revalidatePath(`/api/produto/${slug}`);
  }
}

function isUniqueConstraintError(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}
