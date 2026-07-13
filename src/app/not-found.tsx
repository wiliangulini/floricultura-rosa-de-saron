import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <p className="font-display text-6xl font-semibold italic text-rose-200">404</p>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground">
        Página não encontrada
      </h1>
      <p className="mt-2 text-muted">
        A página que você procura não existe ou foi movida.
      </p>
      <Link
        className="mt-6 inline-flex min-h-11 items-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        href="/"
      >
        Voltar para o início
      </Link>
    </div>
  );
}
