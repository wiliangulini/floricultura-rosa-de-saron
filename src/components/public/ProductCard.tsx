import Image from "next/image";
import Link from "next/link";

import { AddToCartButton } from "@/components/public/AddToCartButton";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { getCartProduct } from "@/lib/cart";
import { formatCurrencyBRL } from "@/lib/money";
import type { PublicProduct } from "@/server/products";

type ProductCardProps = {
  product: PublicProduct;
};

function formatProductPrice(product: PublicProduct): string {
  const price = product.price ? Number(product.price) : null;

  if (!price || product.priceType === "ON_REQUEST") {
    return "Sob consulta";
  }

  const formattedPrice = formatCurrencyBRL(price);

  if (product.priceType === "STARTING_FROM") {
    return `A partir de ${formattedPrice}`;
  }

  return formattedPrice;
}

export function ProductCard({ product }: ProductCardProps) {
  const imageAlt = product.mainImage?.altText || product.name;

  return (
    <article className="group flex h-full w-full flex-col">
      <Card className="flex h-full w-full flex-col overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:shadow-lifted motion-reduce:hover:translate-y-0">
        <div className="relative aspect-4/3 overflow-hidden bg-rose-50">
          {product.mainImage ? (
            <Image
              alt={imageAlt}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
              height={540}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              src={product.mainImage.url}
              width={720}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,#f8e9ee_0%,transparent_55%),radial-gradient(circle_at_75%_80%,#eff4ee_0%,transparent_55%)] px-6 text-center">
              <p className="font-display text-lg font-medium italic text-rose-900">
                Imagem em breve
              </p>
            </div>
          )}
        </div>

        <CardHeader className="grow">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="sage">{product.category.name}</Badge>
            {product.featured ? <Badge variant="gold">Destaque</Badge> : null}
          </div>
          <CardTitle className="line-clamp-2 pt-2">{product.name}</CardTitle>
          {product.shortDescription ? (
            <p className="text-sm leading-6 text-muted">{product.shortDescription}</p>
          ) : null}
        </CardHeader>

        <CardContent className="pt-0">
          <p className="text-lg font-bold text-rose-900">{formatProductPrice(product)}</p>
        </CardContent>

        <CardFooter className="mt-auto flex-col items-stretch sm:flex-row">
          <AddToCartButton
            className="w-full sm:flex-1"
            product={getCartProduct(product)}
            variant="primary"
          />
          <Link
            aria-label={`Ver detalhes de ${product.name}`}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-rose-200 bg-surface px-5 py-2.5 text-base font-semibold text-primary transition hover:border-rose-300 hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:flex-1"
            href={`/produto/${product.slug}`}
          >
            Ver detalhes
          </Link>
        </CardFooter>
      </Card>
    </article>
  );
}
