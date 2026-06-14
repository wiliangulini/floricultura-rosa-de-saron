"use client";

import { useActionState } from "react";

import { Button, Card, CardContent, CardFooter, Input, Textarea } from "@/components/ui";

import type { SettingsActionState } from "./actions";

export type SettingsFormValues = {
  address: string;
  businessName: string;
  city: string;
  deliveryAvailable: boolean;
  deliveryDescription: string;
  email: string;
  facebookUrl: string;
  googleMapsUrl: string;
  instagramUrl: string;
  neighborhood: string;
  ogImageUrl: string;
  openingHours: string;
  phone: string;
  seoDefaultDescription: string;
  seoDefaultTitle: string;
  state: string;
  whatsappNumber: string;
};

type SettingsFormProps = {
  action: (
    previousState: SettingsActionState,
    formData: FormData,
  ) => Promise<SettingsActionState>;
  initialValues: SettingsFormValues;
  submitLabel: string;
};

type CheckboxFieldProps = {
  defaultChecked: boolean;
  description: string;
  disabled?: boolean;
  label: string;
  name: string;
};

const initialState: SettingsActionState = {
  fieldErrors: {},
  message: "",
  status: "idle",
};

export function SettingsForm({ action, initialValues, submitLabel }: SettingsFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const isSuccess = state.status === "success";

  return (
    <Card>
      <form action={formAction} noValidate>
        <CardContent className="space-y-8 pt-5">
          <section className="space-y-5" aria-labelledby="dados-floricultura-title">
            <div>
              <h2 className="text-lg font-semibold text-zinc-950" id="dados-floricultura-title">
                Dados da floricultura
              </h2>
              <p className="mt-1 text-sm leading-6 text-zinc-600">
                Nome, WhatsApp e contato usados nas páginas públicas e no envio de pedidos.{" "}
                <span aria-hidden="true" className="font-medium text-red-600">
                  *
                </span>{" "}
                Campos com * são obrigatórios.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <Input
                aria-required="true"
                autoComplete="organization"
                defaultValue={initialValues.businessName}
                disabled={isPending}
                error={state.fieldErrors.businessName}
                label="Nome da floricultura *"
                name="businessName"
                placeholder="Ex.: Floricultura Rosa de Saron"
                required
                type="text"
              />

              <Input
                aria-required="true"
                autoComplete="tel"
                defaultValue={initialValues.whatsappNumber}
                disabled={isPending}
                error={state.fieldErrors.whatsappNumber}
                helperText="Use DDI e DDD. Ex.: 5546999999999."
                inputMode="tel"
                label="WhatsApp *"
                name="whatsappNumber"
                placeholder="5546999999999"
                required
                type="text"
              />

              <Input
                autoComplete="tel"
                defaultValue={initialValues.phone}
                disabled={isPending}
                inputMode="tel"
                label="Telefone"
                name="phone"
                placeholder="Ex.: (46) 99999-9999"
                type="text"
              />

              <Input
                autoComplete="email"
                defaultValue={initialValues.email}
                disabled={isPending}
                error={state.fieldErrors.email}
                label="E-mail"
                name="email"
                placeholder="contato@floricultura.com.br"
                type="email"
              />
            </div>
          </section>

          <section className="space-y-5" aria-labelledby="localizacao-title">
            <div>
              <h2 className="text-lg font-semibold text-zinc-950" id="localizacao-title">
                Endereço e atendimento
              </h2>
              <p className="mt-1 text-sm leading-6 text-zinc-600">
                Dados exibidos no site e usados nas informações locais para busca.
              </p>
            </div>

            <Textarea
              autoComplete="street-address"
              defaultValue={initialValues.address}
              disabled={isPending}
              label="Endereço"
              name="address"
              placeholder="Rua, número e complemento"
              rows={3}
            />

            <div className="grid gap-5 lg:grid-cols-3">
              <Input
                defaultValue={initialValues.neighborhood}
                disabled={isPending}
                label="Bairro"
                name="neighborhood"
                placeholder="Ex.: Centro"
                type="text"
              />

              <Input
                autoComplete="address-level2"
                defaultValue={initialValues.city}
                disabled={isPending}
                label="Cidade"
                name="city"
                placeholder="Ex.: Pato Branco"
                type="text"
              />

              <Input
                autoComplete="address-level1"
                defaultValue={initialValues.state}
                disabled={isPending}
                label="Estado"
                name="state"
                placeholder="Ex.: PR"
                type="text"
              />
            </div>

            <Input
              defaultValue={initialValues.googleMapsUrl}
              disabled={isPending}
              error={state.fieldErrors.googleMapsUrl}
              label="Link do Google Maps"
              name="googleMapsUrl"
              placeholder="https://maps.google.com/..."
              type="url"
            />

            <Textarea
              defaultValue={initialValues.openingHours}
              disabled={isPending}
              label="Horário de atendimento"
              name="openingHours"
              placeholder="Ex.: Segunda a sexta, das 9h às 18h."
              rows={3}
            />
          </section>

          <section className="space-y-5" aria-labelledby="entrega-title">
            <div>
              <h2 className="text-lg font-semibold text-zinc-950" id="entrega-title">
                Entrega
              </h2>
              <p className="mt-1 text-sm leading-6 text-zinc-600">
                Informações mostradas ao cliente antes do contato pelo WhatsApp.
              </p>
            </div>

            <CheckboxField
              defaultChecked={initialValues.deliveryAvailable}
              description="Marque quando a floricultura puder combinar entrega com o cliente."
              disabled={isPending}
              label="Entrega disponível"
              name="deliveryAvailable"
            />

            <Textarea
              defaultValue={initialValues.deliveryDescription}
              disabled={isPending}
              label="Descrição da entrega"
              name="deliveryDescription"
              placeholder="Ex.: Entregas em Pato Branco com taxa combinada pelo WhatsApp."
              rows={3}
            />
          </section>

          <section className="space-y-5" aria-labelledby="redes-sociais-title">
            <div>
              <h2 className="text-lg font-semibold text-zinc-950" id="redes-sociais-title">
                Redes sociais
              </h2>
              <p className="mt-1 text-sm leading-6 text-zinc-600">
                Links públicos usados no site e nas informações de compartilhamento.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <Input
                defaultValue={initialValues.instagramUrl}
                disabled={isPending}
                error={state.fieldErrors.instagramUrl}
                label="Instagram"
                name="instagramUrl"
                placeholder="https://instagram.com/sua-floricultura"
                type="url"
              />

              <Input
                defaultValue={initialValues.facebookUrl}
                disabled={isPending}
                error={state.fieldErrors.facebookUrl}
                label="Facebook"
                name="facebookUrl"
                placeholder="https://facebook.com/sua-floricultura"
                type="url"
              />
            </div>
          </section>

          <section className="space-y-5" aria-labelledby="seo-title">
            <div>
              <h2 className="text-lg font-semibold text-zinc-950" id="seo-title">
                Google e compartilhamentos
              </h2>
              <p className="mt-1 text-sm leading-6 text-zinc-600">
                Título, descrição e imagem padrão usados em SEO e prévias de links.
              </p>
            </div>

            <Input
              defaultValue={initialValues.seoDefaultTitle}
              disabled={isPending}
              label="Título padrão para SEO"
              name="seoDefaultTitle"
              placeholder="Ex.: Floricultura em Pato Branco | Buquês e presentes"
              type="text"
            />

            <Textarea
              defaultValue={initialValues.seoDefaultDescription}
              disabled={isPending}
              label="Descrição padrão para SEO"
              name="seoDefaultDescription"
              placeholder="Resumo da floricultura para aparecer no Google e em compartilhamentos."
              rows={3}
            />

            <Input
              defaultValue={initialValues.ogImageUrl}
              disabled={isPending}
              error={state.fieldErrors.ogImageUrl}
              helperText={
                "Informe uma URL https:// de imagem já publicada. Upload fica para etapa futura."
              }
              label="Imagem padrão de compartilhamento"
              name="ogImageUrl"
              placeholder="https://exemplo.com/imagem.jpg"
              type="url"
            />
          </section>
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
            {submitLabel}
          </Button>
        </CardFooter>
      </form>
    </Card>
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
