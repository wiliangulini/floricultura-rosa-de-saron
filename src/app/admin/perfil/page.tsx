import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Textarea,
  Input,
} from "@/components/ui";

import { changePassword } from "./actions";
import { PasswordChangeForm } from "./PasswordChangeForm";

export const dynamic = "force-dynamic";

export default function AdminPerfilPage() {
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

        <Card>
          <CardHeader>
            <CardTitle>Dados da proprietária</CardTitle>
            <CardDescription>
              Informações institucionais usadas para apresentar a história da floricultura.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <Input
              autoComplete="name"
              disabled
              label="Nome da proprietária"
              name="ownerName"
              placeholder="Ex.: Maria Aparecida"
              type="text"
            />
            <Input
              accept="image/jpeg,image/png,image/webp"
              disabled
              helperText="Formatos aceitos: JPG, PNG ou WebP."
              label="Foto da proprietária"
              name="ownerPhoto"
              type="file"
            />
            <Textarea
              disabled
              label="Descrição"
              name="ownerDescription"
              placeholder="Conte um pouco sobre a proprietária e a floricultura."
              rows={6}
            />
          </CardContent>
          <CardFooter className="justify-end">
            <Button disabled type="button">
              Salvar dados
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
