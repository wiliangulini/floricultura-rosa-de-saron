"use server";

import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  ADMIN_SESSION_COOKIE,
  AuthConfigurationError,
  createAdminSessionCookie,
  getAdminSessionCookieOptions,
} from "@/lib/auth";
import { prisma } from "@/lib/db";

type LoginFieldErrors = {
  email?: string;
  password?: string;
};

export type LoginActionState = {
  fieldErrors: LoginFieldErrors;
  message: string;
  status: "idle" | "error";
};

const INVALID_CREDENTIALS_MESSAGE =
  "E-mail ou senha inválidos. Confira os dados e tente novamente.";

export async function loginAdmin(
  _previousState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const email = getFormValue(formData, "email").trim().toLowerCase();
  const password = getFormValue(formData, "password");
  const fieldErrors = validateLoginFields(email, password);

  if (Object.keys(fieldErrors).length > 0) {
    return {
      fieldErrors,
      message: "Corrija os campos destacados para entrar.",
      status: "error",
    };
  }

  const admin = await prisma.user.findUnique({
    select: {
      active: true,
      email: true,
      id: true,
      passwordHash: true,
      role: true,
    },
    where: {
      email,
    },
  });

  if (!admin || !admin.active || admin.role !== UserRole.ADMIN) {
    return createInvalidCredentialsState();
  }

  const passwordMatches = await bcrypt.compare(password, admin.passwordHash);

  if (!passwordMatches) {
    return createInvalidCredentialsState();
  }

  let sessionCookie: string;

  try {
    sessionCookie = await createAdminSessionCookie({
      email: admin.email,
      userId: admin.id,
    });
  } catch (error) {
    if (error instanceof AuthConfigurationError) {
      return {
        fieldErrors: {},
        message:
          "Autenticação administrativa não configurada. Defina AUTH_SECRET antes de acessar o painel.",
        status: "error",
      };
    }

    throw error;
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, sessionCookie, getAdminSessionCookieOptions());

  redirect("/admin");
}

function validateLoginFields(email: string, password: string) {
  const fieldErrors: LoginFieldErrors = {};

  if (!email) {
    fieldErrors.email = "Informe o e-mail da administradora.";
  } else if (email.length > 254 || !isValidEmail(email)) {
    fieldErrors.email = "Informe um e-mail válido.";
  }

  if (!password) {
    fieldErrors.password = "Informe a senha.";
  } else if (password.length > 200) {
    fieldErrors.password = INVALID_CREDENTIALS_MESSAGE;
  }

  return fieldErrors;
}

function getFormValue(formData: FormData, fieldName: string) {
  const value = formData.get(fieldName);

  return typeof value === "string" ? value : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function createInvalidCredentialsState(): LoginActionState {
  return {
    fieldErrors: {},
    message: INVALID_CREDENTIALS_MESSAGE,
    status: "error",
  };
}
