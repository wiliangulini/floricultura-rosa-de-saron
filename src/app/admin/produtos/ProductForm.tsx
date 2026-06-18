"use client";

import type { PriceType } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import {
  type ChangeEvent,
  type ReactNode,
  useActionState,
  useEffect,
  useState,
} from "react";

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
  imageAltText: string;
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

const acceptedImageTypes = ["image/jpeg", "image/png", "image/webp"];
const acceptedImageExtensions = ["jpg", "jpeg", "png", "webp"];
const maxImageFileSizeBytes = 5 * 1024 * 1024;

export function ProductForm({
  action,
  categories,
  initialValues,
  submitLabel,
}: ProductFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [currentPriceType, setCurrentPriceType] = useState<PriceType>(initialValues.priceType);
  const [currentName, setCurrentName] = useState(initialValues.name);
  const [manualImageUrl, setManualImageUrl] = useState(initialValues.imageUrl);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [selectedImagePreviewUrl, setSelectedImagePreviewUrl] = useState<string | null>(null);
  const [clientImageFileError, setClientImageFileError] = useState("");
  const [imageAltText, setImageAltText] = useState(
    initialValues.imageAltText || initialValues.name,
  );
  const [hasEditedImageAltText, setHasEditedImageAltText] = useState(
    Boolean(initialValues.imageAltText),
  );
  const previewImageUrl = selectedImagePreviewUrl ?? getPreviewableImageUrl(manualImageUrl);
  const previewImageAlt = imageAltText.trim() || currentName || "Prévia da imagem do produto";
  const imageFileError = clientImageFileError || state.fieldErrors.imageFile;

  useEffect(() => {
    if (!selectedImagePreviewUrl?.startsWith("blob:")) {
      return;
    }

    return () => URL.revokeObjectURL(selectedImagePreviewUrl);
  }, [selectedImagePreviewUrl]);

  function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    const nextName = event.target.value;
    setCurrentName(nextName);

    if (!hasEditedImageAltText) {
      setImageAltText(nextName);
    }
  }

  function handleImageAltTextChange(event: ChangeEvent<HTMLInputElement>) {
    setHasEditedImageAltText(true);
    setImageAltText(event.target.value);
  }

  function handleImageFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setClientImageFileError("");
    setSelectedImageFile(null);
    setSelectedImagePreviewUrl(null);

    if (!file) {
      return;
    }

    const validationError = validateImageFileClient(file);

    if (validationError) {
      setClientImageFileError(validationError);
      event.currentTarget.value = "";
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setSelectedImageFile(file);
    setSelectedImagePreviewUrl(objectUrl);
  }

  return (
    <Card>
      <form action={formAction} encType="multipart/form-data" noValidate>
        <CardContent className="space-y-6 pt-5">
          <div className="grid gap-5 md:grid-cols-2">
            <Input
              autoComplete="off"
              disabled={isPending}
              error={state.fieldErrors.name}
              label="Nome"
              name="name"
              onChange={handleNameChange}
              placeholder="Ex.: Buquê de rosas vermelhas"
              type="text"
              value={currentName}
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

          <div className="grid gap-5 md:grid-cols-2">
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

          <div className="grid gap-5 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-zinc-900">Prévia da imagem principal</p>
              <div className="relative aspect-3/2 overflow-hidden rounded-md border border-rose-200 bg-rose-50 sm:aspect-4/3">
                {previewImageUrl ? (
                  <Image
                    alt={previewImageAlt}
                    className="object-cover"
                    fill
                    sizes="(min-width: 1024px) 320px, 100vw"
                    src={previewImageUrl}
                    unoptimized={previewImageUrl.startsWith("blob:")}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-5 text-center text-sm font-semibold text-rose-900">
                    Sem imagem
                  </div>
                )}
              </div>
              {selectedImageFile ? (
                <p className="text-sm leading-5 text-zinc-600">{selectedImageFile.name}</p>
              ) : null}
            </div>

            <div className="space-y-5">
              <Input
                accept="image/jpeg,image/png,image/webp"
                disabled={isPending}
                error={imageFileError}
                helperText="Envie uma imagem JPG, PNG ou WebP de até 5 MB."
                label="Arquivo da imagem principal"
                name="imageFile"
                onChange={handleImageFileChange}
                type="file"
              />

              <Input
                autoComplete="off"
                disabled={isPending}
                error={state.fieldErrors.imageUrl}
                helperText="Usado quando nenhum arquivo é enviado. Deixe em branco para remover a imagem principal."
                label="Link manual da imagem principal"
                name="imageUrl"
                onChange={(event) => setManualImageUrl(event.target.value)}
                placeholder="https://..."
                type="url"
                value={manualImageUrl}
              />

              <Input
                autoComplete="off"
                disabled={isPending}
                error={state.fieldErrors.imageAltText}
                helperText="Texto usado por leitores de tela e mecanismos de busca."
                label="Texto alternativo da imagem"
                name="imageAltText"
                onChange={handleImageAltTextChange}
                placeholder="Ex.: Buquê de rosas vermelhas"
                type="text"
                value={imageAltText}
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Input
              autoComplete="off"
              defaultValue={initialValues.seoTitle ?? ""}
              disabled={isPending}
              label="Título para Google"
              name="seoTitle"
              placeholder="Título exibido nos resultados de busca e compartilhamentos."
              type="text"
            />

            <Input
              autoComplete="off"
              defaultValue={initialValues.seoDescription ?? ""}
              disabled={isPending}
              label="Descrição para Google e compartilhamentos"
              name="seoDescription"
              placeholder="Resumo exibido nos resultados de busca e em links compartilhados."
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

function validateImageFileClient(file: File): string {
  if (file.size > maxImageFileSizeBytes) {
    return "A imagem deve ter no máximo 5 MB.";
  }

  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension === "svg" || file.type.toLowerCase() === "image/svg+xml") {
    return "SVG não é permitido. Envie uma imagem JPG, PNG ou WebP.";
  }

  if (!extension || !acceptedImageExtensions.includes(extension)) {
    return "Envie uma imagem nos formatos JPG, PNG ou WebP.";
  }

  if (file.type && !acceptedImageTypes.includes(file.type)) {
    return "Envie uma imagem nos formatos JPG, PNG ou WebP.";
  }

  return "";
}

function getPreviewableImageUrl(value: string): string | null {
  if (!value.trim()) {
    return null;
  }

  try {
    const url = new URL(value);

    if (url.protocol !== "https:" || !url.hostname) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
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
        className="mt-0.5 size-5 rounded border-rose-300 text-rose-700 focus:ring-rose-500"
        defaultChecked={defaultChecked}
        disabled={disabled}
        id={name}
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
