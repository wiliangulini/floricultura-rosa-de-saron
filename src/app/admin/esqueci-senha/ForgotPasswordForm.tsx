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

import { requestPasswordReset, type ForgotPasswordActionState } from "./actions";

const initialState: ForgotPasswordActionState = {
  fieldErrors: {},
  message: "",
  status: "idle",
};

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(requestPasswordReset, initialState);
  const isSuccess = state.status === "success";

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Recuperar senha</CardTitle>
      </CardHeader>
      <form action={formAction} noValidate>
        <CardContent className="space-y-5">
          <Input
            autoComplete="email"
            disabled={isPending}
            error={state.fieldErrors.email}
            label="E-mail"
            name="email"
            placeholder="admin@floricultura.com"
            type="email"
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
          <Button className="w-full sm:flex-1" isLoading={isPending} type="submit">
            Enviar instruções
          </Button>
          <Link
            className="inline-flex min-h-11 w-full items-center justify-center rounded-md border border-rose-300 bg-white/80 px-5 py-2.5 text-base font-semibold text-rose-900 transition hover:border-rose-500 hover:bg-rose-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700 sm:flex-1"
            href="/admin/login"
          >
            Voltar ao login
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
}
