"use client";

import Link from "next/link";

type ErrorProps = {
  reset: () => void;
};

export default function GlobalError({ reset }: ErrorProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-rose-50 px-6 text-center">
      <p className="text-5xl font-bold text-rose-200">Ops</p>
      <h1 className="mt-4 text-2xl font-bold text-zinc-900">
        Algo deu errado
      </h1>
      <p className="mt-2 text-zinc-600">
        Ocorreu um erro inesperado. Tente novamente.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          className="inline-flex items-center rounded-md bg-rose-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
          onClick={reset}
          type="button"
        >
          Tentar novamente
        </button>
        <Link
          className="inline-flex items-center rounded-md border border-rose-200 bg-white px-5 py-2.5 text-sm font-semibold text-rose-700 shadow-sm transition hover:bg-rose-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
          href="/"
        >
          Voltar para o início
        </Link>
      </div>
    </div>
  );
}
