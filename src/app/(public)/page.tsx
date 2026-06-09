export default function Home() {
  return (
    <main className="min-h-screen bg-rose-50 text-zinc-950">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-16 sm:px-8">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-bold text-zinc-950 sm:text-6xl">Floricultura</h1>
          <p className="mt-6 text-xl leading-8 text-zinc-700">
            Flores, buquês e arranjos especiais
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <button
              className="rounded-md bg-rose-700 px-6 py-3 text-base font-semibold text-white transition hover:bg-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-700 focus:ring-offset-2"
              type="button"
            >
              Ver catálogo
            </button>
            <button
              className="rounded-md border border-rose-700 px-6 py-3 text-base font-semibold text-rose-800 transition hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-700 focus:ring-offset-2"
              type="button"
            >
              Falar no WhatsApp
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
