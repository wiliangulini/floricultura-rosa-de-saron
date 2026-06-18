import { LoginForm } from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <section className="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
      <div>
        <h1 className="text-3xl font-bold">Login administrativo</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-700">
          Acesse com o e-mail e a senha da administradora para gerenciar a floricultura.
        </p>
      </div>
      <LoginForm />
    </section>
  );
}
