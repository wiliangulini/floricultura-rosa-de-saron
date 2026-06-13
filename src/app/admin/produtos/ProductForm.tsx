"use client";

import type { PriceType } from "@prisma/client";
import Link from "next/link";
import { type ReactNode, useActionState, useState } from "react";

import { Button, Card, CardContent, CardFooter, Input, Textarea } from "@/components/ui";
import { cn } from "@/lib/cn";

import type { ProductActionState } from "./actions";

type ProductFormCategory = {
  active: boolean;
  id: string;
  name: string;
};

export type ProductFormValues = {
  active: boolean;
  available: boolean;
  categoryId: string;
  description: string | null;
  featured: boolean;
  imageUrl: string;
  name: string;
  price: string | null;
  priceType: PriceType;
  seasonal: boolean;
  seoDescription: string | null;
  seoTitle: string | null;
  shortDescription: string | null;
};

type ProductFormProps = {
  action: (
    previousState: ProductActionState,
    formData: FormData,
  ) => Promise<ProductActionState>;
  categories: ProductFormCategory[];
  initialValues: ProductFormValues;
  submitLabel: string;
};

type SelectFieldProps = {
  children: ReactNode;
  defaultValue: string;
  disabled?: boolean;
  error?: string;
  label: string;
  name: string;
  onChange?: (value: string) => void;
};

type CheckboxFieldProps = {
  defaultChecked: boolean;
  description: string;
  disabled?: boolean;
  label: string;
  name: string;
};

const initialState: ProductActionState = {
  fieldErrors: {},
  message: "",
  status: "idle",
};

const priceTypeOptions: Array<{ label: string; value: PriceType }> = [
  {
    label: "Preço fixo",
    value: "FIXED",
  },
  {
    label: "A partir de",
    value: "STARTING_FROM",
  },
  {
    label: "Sob consulta",
    value: "ON_REQUEST",
  },
];

export function ProductForm({
  action,
  categories,
  initialValues,
  submitLabel,
}: ProductFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [currentPriceType, setCurrentPriceType] = useState<PriceType>(initialValues.priceType);

  return (
    <Card>
      <form action={formAction} noValidate>
        <CardContent className="space-y-6 pt-5">
          <div className="grid gap-5 lg:grid-cols-2">
            <Input
              autoComplete="off"
              defaultValue={initialValues.name}
              disabled={isPending}
              error={state.fieldErrors.name}
              label="Nome"
              name="name"
              placeholder="Ex.: Buquê de rosas vermelhas"
              type="text"
            />

            <SelectField
              defaultValue={initialValues.categoryId}
              disabled={isPending}
              error={state.fieldErrors.categoryId}
              label="Categoria"
              name="categoryId"
            >
              <option value="">
                {categories.length > 0 ? "Escolha uma categoria" : "Nenhuma categoria cadastrada"}
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                  {category.active ? "" : " (inativa)"}
                </option>
              ))}
            </SelectField>
          </div>

          <Textarea
            defaultValue={initialValues.shortDescription ?? ""}
            disabled={isPending}
            label="Descrição curta"
            name="shortDescription"
            placeholder="Resumo exibido nos cards do catálogo."
            rows={3}
          />

          <Textarea
            defaultValue={initialValues.description ?? ""}
            disabled={isPending}
            label="Descrição completa"
            name="description"
            placeholder="Detalhes do produto, composição e informações úteis para o cliente."
            rows={5}
          />

          <div className="grid gap-5 lg:grid-cols-2">
            <SelectField
              defaultValue={initialValues.priceType}
              disabled={isPending}
              error={state.fieldErrors.priceType}
              label="Tipo de preço"
              name="priceType"
              onChange={(value) => setCurrentPriceType(value as PriceType)}
            >
              {priceTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectField>

            <Input
              defaultValue={initialValues.price ?? ""}
              disabled={isPending || currentPriceType === "ON_REQUEST"}
              error={state.fieldErrors.price}
              helperText={
                currentPriceType === "ON_REQUEST"
                  ? "Não aplicável para preço sob consulta."
                  : "Obrigatório para preço fixo ou a partir de. Use até duas casas decimais."
              }
              inputMode="decimal"
              label="Preço"
              name="price"
              placeholder="Ex.: 129,90"
              type="text"
            />
          </div>

          <Input
            autoComplete="off"
            defaultValue={initialValues.imageUrl}
            disabled={isPending}
            error={state.fieldErrors.imageUrl}
            helperText="Use uma URL provisória começando com https://. Deixe em branco para remover a imagem principal."
            label="URL da imagem principal"
            name="imageUrl"
            placeholder="https://..."
            type="url"
          />

          <div className="grid gap-5 lg:grid-cols-2">
            <Input
              autoComplete="off"
              defaultValue={initialValues.seoTitle ?? ""}
              disabled={isPending}
              label="Título para SEO"
              name="seoTitle"
              placeholder="Título exibido nos resultados de busca."
              type="text"
            />

            <Input
              autoComplete="off"
              defaultValue={initialValues.seoDescription ?? ""}
              disabled={isPending}
              label="Descrição para SEO"
              name="seoDescription"
              placeholder="Resumo para mecanismos de busca e compartilhamento."
              type="text"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <CheckboxField
              defaultChecked={initialValues.active}
              description="Produtos ativos podem aparecer no catálogo público."
              disabled={isPending}
              label="Ativo"
              name="active"
            />
            <CheckboxField
              defaultChecked={initialValues.available}
              description="Indica se o produto pode ser pedido no momento."
              disabled={isPending}
              label="Disponível"
              name="available"
            />
            <CheckboxField
              defaultChecked={initialValues.featured}
              description="Produtos em destaque podem aparecer com prioridade."
              disabled={isPending}
              label="Destaque"
              name="featured"
            />
            <CheckboxField
              defaultChecked={initialValues.seasonal}
              description="Marque quando o produto for ligado a datas especiais."
              disabled={isPending}
              label="Sazonal"
              name="seasonal"
            />
          </div>

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
            href="/admin/produtos"
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

function SelectField({
  children,
  defaultValue,
  disabled,
  error,
  label,
  name,
  onChange,
}: SelectFieldProps) {
  const errorId = error ? `${name}-error` : undefined;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-zinc-900" htmlFor={name}>
        {label}
      </label>
      <select
        aria-describedby={errorId}
        aria-invalid={error ? true : undefined}
        className={cn(
          "block min-h-11 w-full rounded-md border bg-white px-3.5 py-2.5 text-base text-zinc-950 shadow-sm shadow-rose-950/5 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-200 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500",
          error ? "border-red-500 focus:border-red-500 focus:ring-red-100" : "border-rose-200",
        )}
        defaultValue={defaultValue}
        disabled={disabled}
        id={name}
        name={name}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      >
        {children}
      </select>
      {error ? (
        <p className="text-sm font-medium leading-5 text-red-700" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

function CheckboxField({
  defaultChecked,
  description,
  disabled,
  label,
  name,
}: CheckboxFieldProps) {
  return (
    <label className="flex items-start gap-3 rounded-md border border-rose-100 bg-rose-50/60 px-3.5 py-3 text-sm text-zinc-700">
      <input
        className="mt-1 size-4 rounded border-rose-300 text-rose-700 focus:ring-rose-500"
        defaultChecked={defaultChecked}
        disabled={disabled}
        name={name}
        type="checkbox"
      />
      <span>
        <span className="block font-semibold text-zinc-950">{label}</span>
        <span className="mt-1 block leading-5">{description}</span>
      </span>
    </label>
  );
}
