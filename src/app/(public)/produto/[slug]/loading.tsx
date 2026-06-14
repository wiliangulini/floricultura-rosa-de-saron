export default function ProdutoLoading() {
  return (
    <main className="min-h-screen bg-rose-50 text-zinc-950">
      <article className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="animate-pulse space-y-4">
            <div className="aspect-[4/3] overflow-hidden rounded-xl bg-rose-100" />
            <div className="flex gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="aspect-square w-20 rounded-lg bg-rose-100" />
              ))}
            </div>
          </div>

          <div className="animate-pulse space-y-5">
            <div className="h-3 w-24 rounded bg-rose-200" />
            <div className="h-8 w-3/4 rounded bg-zinc-200" />
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-zinc-100" />
              <div className="h-4 w-5/6 rounded bg-zinc-100" />
              <div className="h-4 w-4/6 rounded bg-zinc-100" />
            </div>
            <div className="h-7 w-32 rounded bg-rose-100" />
            <div className="h-11 w-full rounded-md bg-rose-200" />
            <div className="rounded-lg border border-rose-100 bg-white p-4 space-y-2">
              <div className="h-4 w-40 rounded bg-zinc-100" />
              <div className="h-3 w-full rounded bg-zinc-100" />
              <div className="h-3 w-3/4 rounded bg-zinc-100" />
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
