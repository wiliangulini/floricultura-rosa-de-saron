"use client";

import { useActionState, useEffect, useRef } from "react";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
} from "@/components/ui";

import type { PasswordChangeActionState } from "./actions";

type PasswordChangeFormProps = {
  action: (
    previousState: PasswordChangeActionState,
    formData: FormData,
  ) => Promise<PasswordChangeActionState>;
};

const initialState: PasswordChangeActionState = {
  fieldErrors: {},
  message: "",
  status: "idle",
};

export function PasswordChangeForm({ action }: PasswordChangeFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(action, initialState);
  const isSuccess = state.status === "success";

  useEffect(() => {
    if (isSuccess) {
      formRef.current?.reset();
    }
  }, [isSuccess, state]);

  return (
    <Card>
      <form action={formAction} noValidate ref={formRef}>
        <CardHeader>
          <CardTitle>Alterar senha</CardTitle>
          <CardDescription>
            Atualize a senha usada para entrar no painel administrativo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <Input
            autoComplete="current-password"
            disabled={isPending}
            error={state.fieldErrors.currentPassword}
            label="Senha atual"
            name="currentPassword"
            type="password"
          />
          <Input
            autoComplete="new-password"
            disabled={isPending}
            error={state.fieldErrors.newPassword}
            helperText="Use pelo menos 8 caracteres."
            label="Nova senha"
            name="newPassword"
            type="password"
          />
          <Input
            autoComplete="new-password"
            disabled={isPending}
            error={state.fieldErrors.confirmPassword}
            label="Confirmar nova senha"
            name="confirmPassword"
            type="password"
          />
        </CardContent>
        <CardFooter className="gap-4">
          {state.message ? (
            <p
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium ${
                isSuccess ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"
              }`}
              role={isSuccess ? "status" : "alert"}
            >
              {state.message}
            </p>
          ) : null}
          <Button className="ml-auto" isLoading={isPending} type="submit">
            Salvar nova senha
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
