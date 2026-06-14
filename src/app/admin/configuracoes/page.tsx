import { getAdminSettings } from "@/server/settings";

import { saveSettings } from "./actions";
import { SettingsForm, type SettingsFormValues } from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminConfiguracoesPage() {
  const settings = await getAdminSettings();
  const initialValues: SettingsFormValues = {
    address: settings?.address ?? "",
    businessName: settings?.businessName ?? "",
    city: settings?.city ?? "",
    deliveryAvailable: settings?.deliveryAvailable ?? false,
    deliveryDescription: settings?.deliveryDescription ?? "",
    email: settings?.email ?? "",
    facebookUrl: settings?.facebookUrl ?? "",
    googleMapsUrl: settings?.googleMapsUrl ?? "",
    instagramUrl: settings?.instagramUrl ?? "",
    neighborhood: settings?.neighborhood ?? "",
    ogImageUrl: settings?.ogImageUrl ?? "",
    openingHours: settings?.openingHours ?? "",
    phone: settings?.phone ?? "",
    seoDefaultDescription: settings?.seoDefaultDescription ?? "",
    seoDefaultTitle: settings?.seoDefaultTitle ?? "",
    state: settings?.state ?? "",
    whatsappNumber: settings?.whatsappNumber ?? "",
  };

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-zinc-950">Configurações</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-700">
          Edite os dados principais da floricultura. Essas informações aparecem no site, no
          WhatsApp, no Google e nos compartilhamentos.
        </p>
      </div>

      <SettingsForm
        action={saveSettings}
        initialValues={initialValues}
        submitLabel="Salvar configurações"
      />
    </section>
  );
}
