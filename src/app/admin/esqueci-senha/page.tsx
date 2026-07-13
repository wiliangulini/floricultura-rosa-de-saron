import { ForgotPasswordForm } from "./ForgotPasswordForm";

export default function AdminForgotPasswordPage() {
  return (
    <section className="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">Recuperar senha</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-700">
          Informe o e-mail da administradora para receber as instruções de redefinição.
        </p>
      </div>
      <ForgotPasswordForm />
    </section>
  );
}
