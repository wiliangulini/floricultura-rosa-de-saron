"use client";

import Image from "next/image";
import type { ChangeEvent } from "react";
import { useActionState, useEffect, useState } from "react";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Textarea,
} from "@/components/ui";

import type { OwnerProfileActionState, OwnerProfileFormValues } from "./actions";

type OwnerProfileFormProps = {
  action: (
    previousState: OwnerProfileActionState,
    formData: FormData,
  ) => Promise<OwnerProfileActionState>;
  initialValues: OwnerProfileFormValues;
};

export function OwnerProfileForm({ action, initialValues }: OwnerProfileFormProps) {
  const [fileInputKey, setFileInputKey] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [state, formAction, isPending] = useActionState(action, {
    fieldErrors: {},
    message: "",
    status: "idle",
    values: initialValues,
  } satisfies OwnerProfileActionState);
  const isSuccess = state.status === "success";
  const values = state.values ?? initialValues;
  const displayedPhotoUrl = previewUrl ?? values.ownerPhotoUrl;

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleFormAction(formData: FormData) {
    setPreviewUrl(null);
    setFileInputKey((currentKey) => currentKey + 1);
    formAction(formData);
  }

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];

    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  }

  return (
    <Card>
      <form action={handleFormAction} encType="multipart/form-data" noValidate>
        <CardHeader>
          <CardTitle>Dados da proprietária</CardTitle>
          <CardDescription>
            Informações institucionais usadas para apresentar a história da floricultura.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <Input
            autoComplete="name"
            defaultValue={values.ownerName}
            disabled={isPending}
            error={state.fieldErrors.ownerName}
            label="Nome da proprietária"
            maxLength={120}
            name="ownerName"
            placeholder="Ex.: Maria Aparecida"
            type="text"
          />

          <div className="grid gap-4 sm:grid-cols-[120px_minmax(0,1fr)] sm:items-start">
            <div className="overflow-hidden rounded-md border border-rose-100 bg-rose-50">
              {displayedPhotoUrl ? (
                <Image
                  alt={
                    values.ownerName
                      ? `Foto de ${values.ownerName}`
                      : "Foto da proprietária"
                  }
                  className="aspect-square h-auto w-full object-cover"
                  height={320}
                  sizes="160px"
                  src={displayedPhotoUrl}
                  unoptimized={displayedPhotoUrl.startsWith("blob:")}
                  width={320}
                />
              ) : (
                <div className="flex aspect-square items-center justify-center px-4 text-center text-sm font-semibold text-rose-900">
                  Foto em breve
                </div>
              )}
            </div>

            <Input
              accept="image/jpeg,image/png,image/webp"
              disabled={isPending}
              error={state.fieldErrors.ownerPhoto}
              helperText="Formatos aceitos: JPG, PNG ou WebP. Tamanho máximo: 5 MB."
              key={fileInputKey}
              label={previewUrl ? "Nova foto selecionada" : "Foto da proprietária"}
              name="ownerPhoto"
              onChange={handlePhotoChange}
              type="file"
            />
          </div>

          <Textarea
            defaultValue={values.ownerDescription}
            disabled={isPending}
            error={state.fieldErrors.ownerDescription}
            label="Descrição"
            maxLength={900}
            name="ownerDescription"
            placeholder="Conte um pouco sobre a proprietária e a floricultura."
            rows={6}
          />
        </CardContent>
        <CardFooter className="gap-4">
          {state.message ? (
            <p
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium ${
                isSuccess ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"
              }`}
              role={isSuccess ? "status" : "alert"}
            >
              {state.message}
            </p>
          ) : null}
          <Button className="ml-auto" isLoading={isPending} type="submit">
            Salvar dados
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
