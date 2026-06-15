"use server";

import { UserRole } from "@prisma/client";

import { prisma } from "@/lib/db";
import {
  createPasswordResetToken,
  createPasswordResetTokenExpiresAt,
  hashPasswordResetToken,
  PASSWORD_RESET_TOKEN_EXPIRES_IN_MINUTES,
} from "@/lib/password-reset";
import { createSiteUrl } from "@/lib/site-url";
import {
  EmailConfigurationError,
  EmailDeliveryError,
  sendPasswordResetEmail,
} from "@/server/email";

type ForgotPasswordFieldErrors = {
  email?: string;
};

export type ForgotPasswordActionState = {
  fieldErrors: ForgotPasswordFieldErrors;
  message: string;
  status: "idle" | "error" | "success";
};

const GENERIC_SUCCESS_MESSAGE =
  "Se o e-mail informado pertencer a uma administradora ativa, enviaremos as instruções de redefinição.";

export async function requestPasswordReset(
  _previousState: ForgotPasswordActionState,
  formData: FormData,
): Promise<ForgotPasswordActionState> {
  const email = getFormValue(formData, "email").trim().toLowerCase();
  const fieldErrors = validateEmail(email);

  if (Object.keys(fieldErrors).length > 0) {
    return {
      fieldErrors,
      message: "Corrija o e-mail informado para continuar.",
      status: "error",
    };
  }

  const admin = await prisma.user.findUnique({
    select: {
      active: true,
      email: true,
      id: true,
      role: true,
    },
    where: {
      email,
    },
  });

  if (!admin || !admin.active || admin.role !== UserRole.ADMIN) {
    return createGenericSuccessState();
  }

  const token = createPasswordResetToken();
  const tokenHash = hashPasswordResetToken(token);
  const now = new Date();
  const expiresAt = createPasswordResetTokenExpiresAt(now);

  await prisma.$transaction([
    prisma.passwordResetToken.updateMany({
      data: {
        usedAt: now,
      },
      where: {
        userId: admin.id,
        usedAt: null,
      },
    }),
    prisma.passwordResetToken.create({
      data: {
        expiresAt,
        tokenHash,
        userId: admin.id,
      },
    }),
  ]);

  try {
    await sendPasswordResetEmail({
      expiresInMinutes: PASSWORD_RESET_TOKEN_EXPIRES_IN_MINUTES,
      resetUrl: createSiteUrl(`/admin/redefinir-senha?token=${encodeURIComponent(token)}`),
      to: admin.email,
    });
  } catch (error) {
    if (error instanceof EmailConfigurationError || error instanceof EmailDeliveryError) {
      await invalidatePasswordResetToken(tokenHash);

      return createGenericSuccessState();
    }

    throw error;
  }

  return createGenericSuccessState();
}

function validateEmail(email: string): ForgotPasswordFieldErrors {
  const fieldErrors: ForgotPasswordFieldErrors = {};

  if (!email) {
    fieldErrors.email = "Informe o e-mail da administradora.";
  } else if (email.length > 254 || !isValidEmail(email)) {
    fieldErrors.email = "Informe um e-mail válido.";
  }

  return fieldErrors;
}

async function invalidatePasswordResetToken(tokenHash: string) {
  try {
    await prisma.passwordResetToken.updateMany({
      data: {
        usedAt: new Date(),
      },
      where: {
        tokenHash,
        usedAt: null,
      },
    });
  } catch {
    // A solicitação não deve revelar falhas internas do fluxo de recuperação.
  }
}

function createGenericSuccessState(): ForgotPasswordActionState {
  return {
    fieldErrors: {},
    message: GENERIC_SUCCESS_MESSAGE,
    status: "success",
  };
}

function getFormValue(formData: FormData, fieldName: string) {
  const value = formData.get(fieldName);

  return typeof value === "string" ? value : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
