import type { CartProductInput } from "@/context/CartContext";
import type { PublicProduct } from "@/server/products";

export function getCartUnitPrice(product: PublicProduct): number | null {
  if (product.price === null || product.priceType === "ON_REQUEST") {
    return null;
  }

  const unitPrice = Number(product.price);

  return Number.isFinite(unitPrice) ? unitPrice : null;
}

export function getCartProduct(product: PublicProduct): CartProductInput {
  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    unitPrice: getCartUnitPrice(product),
    priceType: product.priceType,
    imageUrl: product.mainImage?.url ?? null,
    shortDescription: product.shortDescription,
    available: product.available,
  };
}
