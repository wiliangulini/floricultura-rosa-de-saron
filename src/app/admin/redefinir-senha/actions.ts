"use server";

import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/db";
import {
  hashPasswordResetToken,
  isPasswordResetTokenFormatValid,
} from "@/lib/password-reset";

type ResetPasswordFieldErrors = {
  confirmPassword?: string;
  newPassword?: string;
};

export type ResetPasswordActionState = {
  fieldErrors: ResetPasswordFieldErrors;
  message: string;
  status: "idle" | "error" | "success";
};

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 200;
const INVALID_TOKEN_MESSAGE =
  "Link inválido ou expirado. Solicite um novo link de redefinição.";

class InvalidPasswordResetTokenError extends Error {
  constructor() {
    super(INVALID_TOKEN_MESSAGE);
    this.name = "InvalidPasswordResetTokenError";
  }
}

export async function resetPassword(
  token: string,
  _previousState: ResetPasswordActionState,
  formData: FormData,
): Promise<ResetPasswordActionState> {
  if (!isPasswordResetTokenFormatValid(token)) {
    return createInvalidTokenState();
  }

  const newPassword = getFormValue(formData, "newPassword");
  const confirmPassword = getFormValue(formData, "confirmPassword");
  const fieldErrors = validatePasswordFields({
    confirmPassword,
    newPassword,
  });

  if (Object.keys(fieldErrors).length > 0) {
    return {
      fieldErrors,
      message: "Corrija os campos destacados para redefinir a senha.",
      status: "error",
    };
  }

  const tokenHash = hashPasswordResetToken(token);
  const now = new Date();
  const passwordResetToken = await prisma.passwordResetToken.findUnique({
    select: {
      expiresAt: true,
      id: true,
      usedAt: true,
      user: {
        select: {
          active: true,
          id: true,
          role: true,
        },
      },
    },
    where: {
      tokenHash,
    },
  });

  if (
    !passwordResetToken ||
    passwordResetToken.usedAt ||
    passwordResetToken.expiresAt <= now ||
    !passwordResetToken.user.active ||
    passwordResetToken.user.role !== UserRole.ADMIN
  ) {
    return createInvalidTokenState();
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  try {
    await prisma.$transaction(async (transaction) => {
      const transactionNow = new Date();
      const tokenUpdate = await transaction.passwordResetToken.updateMany({
        data: {
          usedAt: transactionNow,
        },
        where: {
          expiresAt: {
            gt: transactionNow,
          },
          id: passwordResetToken.id,
          usedAt: null,
        },
      });

      if (tokenUpdate.count !== 1) {
        throw new InvalidPasswordResetTokenError();
      }

      await transaction.user.update({
        data: {
          passwordHash,
        },
        where: {
          id: passwordResetToken.user.id,
        },
      });
    });
  } catch (error) {
    if (error instanceof InvalidPasswordResetTokenError) {
      return createInvalidTokenState();
    }

    throw error;
  }

  return {
    fieldErrors: {},
    message: "Senha redefinida com sucesso. Acesse o login para entrar novamente.",
    status: "success",
  };
}

function validatePasswordFields({
  confirmPassword,
  newPassword,
}: {
  confirmPassword: string;
  newPassword: string;
}) {
  const fieldErrors: ResetPasswordFieldErrors = {};

  if (!newPassword) {
    fieldErrors.newPassword = "Informe a nova senha.";
  } else if (newPassword.length < MIN_PASSWORD_LENGTH) {
    fieldErrors.newPassword = "A nova senha deve ter pelo menos 8 caracteres.";
  } else if (newPassword.length > MAX_PASSWORD_LENGTH) {
    fieldErrors.newPassword = "A nova senha deve ter no máximo 200 caracteres.";
  }

  if (!confirmPassword) {
    fieldErrors.confirmPassword = "Confirme a nova senha.";
  } else if (newPassword && confirmPassword !== newPassword) {
    fieldErrors.confirmPassword = "A confirmação precisa ser igual à nova senha.";
  }

  return fieldErrors;
}

function createInvalidTokenState(): ResetPasswordActionState {
  return {
    fieldErrors: {},
    message: INVALID_TOKEN_MESSAGE,
    status: "error",
  };
}

function getFormValue(formData: FormData, fieldName: string) {
  const value = formData.get(fieldName);

  return typeof value === "string" ? value : "";
}
