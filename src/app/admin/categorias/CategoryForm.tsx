"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Button, Card, CardContent, CardFooter, Input, Textarea } from "@/components/ui";

import type { CategoryActionState } from "./actions";

type CategoryFormValues = {
  active: boolean;
  description: string | null;
  name: string;
  sortOrder: number;
};

type CategoryFormProps = {
  action: (
    previousState: CategoryActionState,
    formData: FormData,
  ) => Promise<CategoryActionState>;
  initialValues: CategoryFormValues;
  submitLabel: string;
};

const initialState: CategoryActionState = {
  fieldErrors: {},
  message: "",
  status: "idle",
};

export function CategoryForm({ action, initialValues, submitLabel }: CategoryFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <Card>
      <form action={formAction} noValidate>
        <CardContent className="space-y-5 pt-5">
          <Input
            autoComplete="off"
            defaultValue={initialValues.name}
            disabled={isPending}
            error={state.fieldErrors.name}
            label="Nome"
            name="name"
            placeholder="Ex.: Buquês"
            type="text"
          />

          <Textarea
            defaultValue={initialValues.description ?? ""}
            disabled={isPending}
            label="Descrição"
            name="description"
            placeholder="Descrição curta para apresentar a categoria."
            rows={4}
          />

          <Input
            defaultValue={initialValues.sortOrder}
            disabled={isPending}
            error={state.fieldErrors.sortOrder}
            label="Ordem de exibição"
            name="sortOrder"
            step="1"
            type="number"
          />

          <label className="flex items-start gap-3 rounded-md border border-rose-100 bg-rose-50/60 px-3.5 py-3 text-sm text-zinc-700">
            <input
              className="mt-1 size-4 rounded border-rose-300 text-rose-700 focus:ring-rose-500"
              defaultChecked={initialValues.active}
              disabled={isPending}
              name="active"
              type="checkbox"
            />
            <span>
              <span className="block font-semibold text-zinc-950">Ativo</span>
              <span className="mt-1 block leading-5">
                Categorias ativas podem aparecer nas áreas públicas do site.
              </span>
            </span>
          </label>

          {state.message ? (
            <p
              className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
              role="alert"
            >
              {state.message}
            </p>
          ) : null}
        </CardContent>

        <CardFooter className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:justify-end">
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-rose-300 bg-white/80 px-5 py-2.5 text-base font-semibold text-rose-900 transition hover:border-rose-500 hover:bg-rose-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
            href="/admin/categorias"
          >
            Cancelar
          </Link>
          <Button isLoading={isPending} type="submit">
            {submitLabel}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
