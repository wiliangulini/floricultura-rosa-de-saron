"use server";

import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ADMIN_SESSION_COOKIE, readAdminSessionCookie } from "@/lib/auth";
import { prisma } from "@/lib/db";

type PasswordChangeFieldErrors = {
  confirmPassword?: string;
  currentPassword?: string;
  newPassword?: string;
};

export type PasswordChangeActionState = {
  fieldErrors: PasswordChangeFieldErrors;
  message: string;
  status: "idle" | "error" | "success";
};

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 200;

export async function changePassword(
  _previousState: PasswordChangeActionState,
  formData: FormData,
): Promise<PasswordChangeActionState> {
  const session = await requireAdminSession();
  const currentPassword = getFormValue(formData, "currentPassword");
  const newPassword = getFormValue(formData, "newPassword");
  const confirmPassword = getFormValue(formData, "confirmPassword");
  const fieldErrors = validatePasswordFields({
    confirmPassword,
    currentPassword,
    newPassword,
  });

  if (Object.keys(fieldErrors).length > 0) {
    return {
      fieldErrors,
      message: "Corrija os campos destacados para alterar a senha.",
      status: "error",
    };
  }

  const admin = await prisma.user.findUnique({
    select: {
      active: true,
      id: true,
      passwordHash: true,
      role: true,
    },
    where: {
      id: session.userId,
    },
  });

  if (!admin || !admin.active || admin.role !== UserRole.ADMIN) {
    return {
      fieldErrors: {},
      message: "Sessão administrativa inválida. Entre novamente para alterar a senha.",
      status: "error",
    };
  }

  const currentPasswordMatches = await bcrypt.compare(currentPassword, admin.passwordHash);

  if (!currentPasswordMatches) {
    return {
      fieldErrors: {
        currentPassword: "Senha atual incorreta.",
      },
      message: "Confira a senha atual para continuar.",
      status: "error",
    };
  }

  const passwordWasNotChanged = await bcrypt.compare(newPassword, admin.passwordHash);

  if (passwordWasNotChanged) {
    return {
      fieldErrors: {
        newPassword: "A nova senha precisa ser diferente da senha atual.",
      },
      message: "Escolha uma senha diferente da atual.",
      status: "error",
    };
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    data: {
      passwordHash,
    },
    where: {
      id: admin.id,
    },
  });

  return {
    fieldErrors: {},
    message: "Senha alterada com sucesso.",
    status: "success",
  };
}

async function requireAdminSession() {
  const cookieStore = await cookies();
  const session = await readAdminSessionCookie(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}

function validatePasswordFields({
  confirmPassword,
  currentPassword,
  newPassword,
}: {
  confirmPassword: string;
  currentPassword: string;
  newPassword: string;
}) {
  const fieldErrors: PasswordChangeFieldErrors = {};

  if (!currentPassword) {
    fieldErrors.currentPassword = "Informe a senha atual.";
  } else if (currentPassword.length > MAX_PASSWORD_LENGTH) {
    fieldErrors.currentPassword = "Senha atual incorreta.";
  }

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

  if (
    currentPassword &&
    newPassword &&
    currentPassword === newPassword &&
    !fieldErrors.newPassword
  ) {
    fieldErrors.newPassword = "A nova senha precisa ser diferente da senha atual.";
  }

  return fieldErrors;
}

function getFormValue(formData: FormData, fieldName: string) {
  const value = formData.get(fieldName);

  return typeof value === "string" ? value : "";
}
