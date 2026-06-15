import { UserRole } from "@prisma/client";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { prisma } from "@/lib/db";
import {
  hashPasswordResetToken,
  isPasswordResetTokenFormatValid,
} from "@/lib/password-reset";

import { resetPassword } from "./actions";
import { ResetPasswordForm } from "./ResetPasswordForm";

type AdminResetPasswordPageProps = {
  searchParams: Promise<{
    token?: string | string[];
  }>;
};

export default async function AdminResetPasswordPage({
  searchParams,
}: AdminResetPasswordPageProps) {
  const { token: tokenParam } = await searchParams;
  const token = Array.isArray(tokenParam) ? tokenParam[0] : tokenParam;
  const isTokenValid = token ? await validatePasswordResetToken(token) : false;

  return (
    <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
      <div>
        <h1 className="text-3xl font-bold">Criar nova senha</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-700">
          Defina uma nova senha para voltar a acessar o painel administrativo.
        </p>
      </div>
      {token && isTokenValid ? (
        <ResetPasswordForm action={resetPassword.bind(null, token)} />
      ) : (
        <InvalidTokenCard />
      )}
    </section>
  );
}

async function validatePasswordResetToken(token: string): Promise<boolean> {
  if (!isPasswordResetTokenFormatValid(token)) {
    return false;
  }

  const passwordResetToken = await prisma.passwordResetToken.findUnique({
    select: {
      expiresAt: true,
      usedAt: true,
      user: {
        select: {
          active: true,
          role: true,
        },
      },
    },
    where: {
      tokenHash: hashPasswordResetToken(token),
    },
  });

  return Boolean(
    passwordResetToken &&
      !passwordResetToken.usedAt &&
      passwordResetToken.expiresAt > new Date() &&
      passwordResetToken.user.active &&
      passwordResetToken.user.role === UserRole.ADMIN,
  );
}

function InvalidTokenCard() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Link inválido ou expirado</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-base leading-7 text-zinc-700">
          Solicite um novo link de redefinição para criar outra senha de acesso.
        </p>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-3 sm:flex-row">
        <Link
          className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-rose-700 px-5 py-2.5 text-base font-semibold text-white shadow-sm shadow-rose-900/10 transition hover:bg-rose-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700 sm:flex-1"
          href="/admin/esqueci-senha"
        >
          Solicitar novo link
        </Link>
        <Link
          className="inline-flex min-h-11 w-full items-center justify-center rounded-md border border-rose-300 bg-white/80 px-5 py-2.5 text-base font-semibold text-rose-900 transition hover:border-rose-500 hover:bg-rose-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700 sm:flex-1"
          href="/admin/login"
        >
          Voltar ao login
        </Link>
      </CardFooter>
    </Card>
  );
}
