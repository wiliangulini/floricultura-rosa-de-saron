import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-rose-50 px-6 text-center">
      <p className="text-5xl font-bold text-rose-200">404</p>
      <h1 className="mt-4 text-2xl font-bold text-zinc-900">
        Página não encontrada
      </h1>
      <p className="mt-2 text-zinc-600">
        A página que você procura não existe ou foi movida.
      </p>
      <Link
        className="mt-6 inline-flex items-center rounded-md bg-rose-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
        href="/"
      >
        Voltar para o início
      </Link>
    </div>
  );
}
