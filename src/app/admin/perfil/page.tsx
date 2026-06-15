import { getAdminSettings } from "@/server/settings";

import { changePassword, saveOwnerProfile, type OwnerProfileFormValues } from "./actions";
import { OwnerProfileForm } from "./OwnerProfileForm";
import { PasswordChangeForm } from "./PasswordChangeForm";

export const dynamic = "force-dynamic";

export default async function AdminPerfilPage() {
  const settings = await getAdminSettings();
  const ownerProfileInitialValues: OwnerProfileFormValues = {
    ownerDescription: settings?.ownerDescription ?? "",
    ownerName: settings?.ownerName ?? "",
    ownerPhotoUrl: settings?.ownerPhotoUrl ?? "",
  };

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-zinc-950">Perfil</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-700">
          Gerencie a senha de acesso e os dados públicos da proprietária.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <PasswordChangeForm action={changePassword} />

        <OwnerProfileForm
          action={saveOwnerProfile}
          initialValues={ownerProfileInitialValues}
        />
      </div>
    </section>
  );
}
