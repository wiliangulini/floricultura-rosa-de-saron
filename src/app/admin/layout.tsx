import Link from "next/link";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-950">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-lg font-semibold">Administração</p>
          <nav aria-label="Navegação administrativa" className="flex gap-4 text-sm font-medium">
            <Link className="text-zinc-700 transition hover:text-rose-700" href="/admin">
              Painel
            </Link>
            <Link className="text-zinc-700 transition hover:text-rose-700" href="/admin/produtos">
              Produtos
            </Link>
            <Link className="text-zinc-700 transition hover:text-rose-700" href="/admin/categorias">
              Categorias
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
