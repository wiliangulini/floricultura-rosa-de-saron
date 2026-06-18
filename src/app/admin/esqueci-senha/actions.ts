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
  getSmtpDiagnostics,
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

class PasswordResetSiteUrlConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PasswordResetSiteUrlConfigurationError";
  }
}

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

  const siteUrlConfigurationError = getProductionSiteUrlConfigurationError();

  if (siteUrlConfigurationError) {
    logPasswordResetEmailFailure({
      error: siteUrlConfigurationError,
      to: admin.email,
      userId: admin.id,
    });

    return createGenericSuccessState();
  }

  const token = createPasswordResetToken();
  const tokenHash = hashPasswordResetToken(token);
  const now = new Date();
  const expiresAt = createPasswordResetTokenExpiresAt(now);
  const resetUrl = createSiteUrl(`/admin/redefinir-senha?token=${encodeURIComponent(token)}`);

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

  logDevelopmentPasswordResetLink({
    resetUrl,
    to: admin.email,
    userId: admin.id,
  });

  try {
    await sendPasswordResetEmail({
      expiresInMinutes: PASSWORD_RESET_TOKEN_EXPIRES_IN_MINUTES,
      resetUrl,
      to: admin.email,
    });
  } catch (error) {
    if (error instanceof EmailConfigurationError || error instanceof EmailDeliveryError) {
      await invalidatePasswordResetToken(tokenHash);
      logPasswordResetEmailFailure({
        error,
        to: admin.email,
        userId: admin.id,
      });

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

function getProductionSiteUrlConfigurationError(): PasswordResetSiteUrlConfigurationError | null {
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!configuredSiteUrl) {
    return new PasswordResetSiteUrlConfigurationError(
      "NEXT_PUBLIC_SITE_URL deve estar definida em produção para enviar recuperação de senha.",
    );
  }

  let siteUrl: URL;

  try {
    siteUrl = new URL(configuredSiteUrl);
  } catch {
    return new PasswordResetSiteUrlConfigurationError(
      "NEXT_PUBLIC_SITE_URL deve ser uma URL absoluta válida em produção.",
    );
  }

  if (isLocalSiteHostname(siteUrl.hostname)) {
    return new PasswordResetSiteUrlConfigurationError(
      "NEXT_PUBLIC_SITE_URL não pode apontar para localhost em produção.",
    );
  }

  return null;
}

function isLocalSiteHostname(hostname: string) {
  return ["localhost", "127.0.0.1", "0.0.0.0", "::1", "[::1]"].includes(hostname);
}

function logDevelopmentPasswordResetLink({
  resetUrl,
  to,
  userId,
}: {
  resetUrl: string;
  to: string;
  userId: string;
}) {
  if (
    process.env.NODE_ENV === "production" ||
    process.env.PASSWORD_RESET_DEV_LOG_LINK !== "true"
  ) {
    return;
  }

  console.info("[password-reset] development reset link", {
    event: "password_reset_development_link_created",
    recipientDomain: getEmailDomain(to),
    resetUrl,
    userId,
  });
}

function logPasswordResetEmailFailure({
  error,
  to,
  userId,
}: {
  error: EmailConfigurationError | EmailDeliveryError | PasswordResetSiteUrlConfigurationError;
  to: string;
  userId: string;
}) {
  console.error("[password-reset] email failure", {
    delivery: error instanceof EmailDeliveryError ? error.details : undefined,
    errorName: error.name,
    errorType: getPasswordResetEmailFailureType(error),
    event: "password_reset_email_failed",
    recipientDomain: getEmailDomain(to),
    smtp: getSmtpDiagnostics(),
    userId,
  });
}

function getPasswordResetEmailFailureType(
  error: EmailConfigurationError | EmailDeliveryError | PasswordResetSiteUrlConfigurationError,
) {
  if (error instanceof EmailDeliveryError) {
    return "smtp_delivery";
  }

  if (error instanceof EmailConfigurationError) {
    return "smtp_configuration";
  }

  return "reset_url_configuration";
}

function getEmailDomain(email: string) {
  const atIndex = email.lastIndexOf("@");

  if (atIndex === -1 || atIndex === email.length - 1) {
    return null;
  }

  return email.slice(atIndex + 1).toLowerCase();
}

function getFormValue(formData: FormData, fieldName: string) {
  const value = formData.get(fieldName);

  return typeof value === "string" ? value : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
