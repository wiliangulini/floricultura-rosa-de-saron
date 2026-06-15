"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
} from "@/components/ui";

import type { ResetPasswordActionState } from "./actions";

type ResetPasswordFormProps = {
  action: (
    previousState: ResetPasswordActionState,
    formData: FormData,
  ) => Promise<ResetPasswordActionState>;
};

const initialState: ResetPasswordActionState = {
  fieldErrors: {},
  message: "",
  status: "idle",
};

export function ResetPasswordForm({ action }: ResetPasswordFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const isSuccess = state.status === "success";

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Nova senha</CardTitle>
      </CardHeader>
      <form action={formAction} noValidate>
        <CardContent className="space-y-5">
          <Input
            autoComplete="new-password"
            disabled={isPending || isSuccess}
            error={state.fieldErrors.newPassword}
            helperText="Use pelo menos 8 caracteres."
            label="Nova senha"
            name="newPassword"
            type="password"
          />
          <Input
            autoComplete="new-password"
            disabled={isPending || isSuccess}
            error={state.fieldErrors.confirmPassword}
            label="Confirmar nova senha"
            name="confirmPassword"
            type="password"
          />
          {state.message ? (
            <p
              className={`rounded-md px-3 py-2 text-sm font-medium ${
                isSuccess ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"
              }`}
              role={isSuccess ? "status" : "alert"}
            >
              {state.message}
            </p>
          ) : null}
        </CardContent>
        <CardFooter className="flex-col items-stretch gap-3 sm:flex-row">
          <Button
            className="w-full sm:flex-1"
            disabled={isSuccess}
            isLoading={isPending}
            type="submit"
          >
            Redefinir senha
          </Button>
          <Link
            className="inline-flex min-h-11 w-full items-center justify-center rounded-md border border-rose-300 bg-white/80 px-5 py-2.5 text-base font-semibold text-rose-900 transition hover:border-rose-500 hover:bg-rose-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700 sm:flex-1"
            href="/admin/login"
          >
            Ir para o login
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
}
