"use client";

import Link from "next/link";

type ErrorProps = {
  reset: () => void;
};

export default function GlobalError({ reset }: ErrorProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <p className="font-display text-6xl font-semibold italic text-rose-200">Ops</p>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground">
        Algo deu errado
      </h1>
      <p className="mt-2 text-muted">
        Ocorreu um erro inesperado. Tente novamente.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          className="inline-flex min-h-11 items-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          onClick={reset}
          type="button"
        >
          Tentar novamente
        </button>
        <Link
          className="inline-flex min-h-11 items-center rounded-full border border-rose-200 bg-surface px-6 py-2.5 text-sm font-semibold text-primary shadow-soft transition hover:bg-primary-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          href="/"
        >
          Voltar para o início
        </Link>
      </div>
    </div>
  );
}
