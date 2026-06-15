import { ForgotPasswordForm } from "./ForgotPasswordForm";

export default function AdminForgotPasswordPage() {
  return (
    <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
      <div>
        <h1 className="text-3xl font-bold">Recuperar senha</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-700">
          Informe o e-mail da administradora para receber as instruções de redefinição.
        </p>
      </div>
      <ForgotPasswordForm />
    </section>
  );
}
