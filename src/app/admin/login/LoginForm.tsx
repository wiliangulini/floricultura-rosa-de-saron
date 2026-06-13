"use client";

import { useActionState } from "react";

import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";

import { loginAdmin, type LoginActionState } from "./actions";

const initialState: LoginActionState = {
  fieldErrors: {},
  message: "",
  status: "idle",
};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAdmin, initialState);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Acessar painel</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-5" noValidate>
          <Input
            autoComplete="email"
            disabled={isPending}
            error={state.fieldErrors.email}
            label="E-mail"
            name="email"
            placeholder="admin@floricultura.com"
            type="email"
          />
          <Input
            autoComplete="current-password"
            disabled={isPending}
            error={state.fieldErrors.password}
            label="Senha"
            name="password"
            type="password"
          />
          {state.message ? (
            <p
              className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
              role="alert"
            >
              {state.message}
            </p>
          ) : null}
          <Button className="w-full" isLoading={isPending} type="submit">
            Entrar
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
