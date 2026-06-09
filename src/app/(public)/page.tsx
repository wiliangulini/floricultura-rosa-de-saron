import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

export default function Home() {
  return (
    <main className="min-h-screen bg-rose-50 text-zinc-950">
      <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-rose-800">
              Rosa de Saron
            </p>
            <h1 className="mt-4 text-5xl font-bold text-zinc-950 sm:text-6xl">Floricultura</h1>
            <p className="mt-6 text-xl leading-8 text-zinc-700">
              Flores, buquês e arranjos delicados para presentear com cuidado e beleza.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" variant="primary">
              Ver catálogo
              </Button>
              <Button size="lg" variant="outline">
              Falar no WhatsApp
              </Button>
            </div>
          </div>

          <Card className="border-rose-200 bg-white/80">
            <CardHeader>
              <CardTitle>Atendimento próximo e cuidadoso</CardTitle>
              <CardDescription>
                Escolha flores para aniversários, agradecimentos, datas especiais ou pequenos
                gestos do dia a dia.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                <div>
                  <dt className="text-sm font-medium text-zinc-500">Pedidos</dt>
                  <dd className="mt-1 text-base font-semibold text-zinc-950">Pelo WhatsApp</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-zinc-500">Produtos</dt>
                  <dd className="mt-1 text-base font-semibold text-zinc-950">
                    Buquês e arranjos
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-zinc-500">Confirmação</dt>
                  <dd className="mt-1 text-base font-semibold text-zinc-950">
                    Direto com a loja
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-4 px-6 pb-16 sm:grid-cols-3 sm:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Buquês</CardTitle>
            <CardDescription>Opções elegantes para surpreender em momentos especiais.</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Arranjos</CardTitle>
            <CardDescription>Composições florais para casas, eventos e homenagens.</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Presentes</CardTitle>
            <CardDescription>Flores escolhidas com atenção para tornar o gesto memorável.</CardDescription>
          </CardHeader>
        </Card>
      </section>
    </main>
  );
}
