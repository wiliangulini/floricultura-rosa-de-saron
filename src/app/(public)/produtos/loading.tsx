function ProductCardSkeleton() {
  return (
    <div className="flex w-full animate-pulse flex-col overflow-hidden rounded-xl border border-rose-100 bg-white shadow-sm">
      <div className="aspect-[4/3] bg-rose-100" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="h-4 w-3/4 rounded bg-rose-100" />
        <div className="h-3 w-full rounded bg-zinc-100" />
        <div className="h-3 w-2/3 rounded bg-zinc-100" />
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="h-5 w-20 rounded bg-rose-100" />
          <div className="h-9 w-28 rounded-md bg-rose-100" />
        </div>
      </div>
    </div>
  );
}

export default function ProdutosLoading() {
  return (
    <section
      aria-live="polite"
      className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-8"
      role="status"
    >
      <span className="sr-only">Carregando produtos.</span>
      <div aria-hidden="true">
        <div className="max-w-3xl animate-pulse">
          <div className="h-3 w-24 rounded bg-rose-200" />
          <div className="mt-3 h-8 w-72 rounded bg-zinc-200" />
          <div className="mt-4 h-4 w-full max-w-lg rounded bg-zinc-100" />
        </div>

        <div className="mt-8 flex flex-wrap gap-2 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 w-24 rounded-full bg-rose-100" />
          ))}
        </div>

        <ul className="mt-8 grid list-none gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i} className="flex">
              <ProductCardSkeleton />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
