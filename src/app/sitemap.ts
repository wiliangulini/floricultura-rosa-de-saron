import type { MetadataRoute } from "next";

import { createSiteUrl } from "@/lib/site-url";
import { getActiveCategories } from "@/server/categories";
import { getActiveProducts } from "@/server/products";

export const dynamic = "force-dynamic";

const staticRoutes = ["/", "/produtos", "/sobre", "/contato"] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([getActiveCategories(), getActiveProducts()]);

  return [
    ...staticRoutes.map((route) => ({
      url: createSiteUrl(route),
    })),
    ...categories.map((category) => ({
      url: createSiteUrl(`/categoria/${category.slug}`),
    })),
    ...products.map((product) => ({
      url: createSiteUrl(`/produto/${product.slug}`),
    })),
  ];
}
