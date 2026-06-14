import Link from "next/link";

import type { PublicCategory } from "@/server/categories";

type CategoryFilterProps = {
  activeSlug?: string | null;
  categories: PublicCategory[];
};

const activeClass =
  "inline-flex min-h-11 items-center rounded-full border border-rose-300 bg-white px-4 py-2 text-sm font-semibold text-rose-900 transition hover:border-rose-500 hover:bg-rose-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700";

const inactiveClass =
  "inline-flex min-h-11 items-center rounded-full border border-rose-100 bg-white/80 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-rose-300 hover:bg-white hover:text-rose-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700";

export function CategoryFilter({ activeSlug, categories }: CategoryFilterProps) {
  if (categories.length === 0) {
    return null;
  }

  const allActive = !activeSlug;

  return (
    <nav aria-label="Categorias de produtos" className="flex flex-wrap gap-2">
      <Link
        aria-current={allActive ? "page" : undefined}
        className={allActive ? activeClass : inactiveClass}
        href="/produtos"
      >
        Todos
      </Link>
      {categories.map((category) => {
        const isActive = activeSlug === category.slug;
        return (
          <Link
            aria-current={isActive ? "page" : undefined}
            className={isActive ? activeClass : inactiveClass}
            href={`/categoria/${category.slug}`}
            key={category.slug}
          >
            {category.name}
          </Link>
        );
      })}
    </nav>
  );
}
