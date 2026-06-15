"use server";

import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ADMIN_SESSION_COOKIE, readAdminSessionCookie } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getOwnerPhotoFile, OwnerPhotoUploadError, uploadOwnerPhoto } from "@/server/images";

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

type OwnerProfileFieldErrors = {
  ownerDescription?: string;
  ownerName?: string;
  ownerPhoto?: string;
};

export type OwnerProfileFormValues = {
  ownerDescription: string;
  ownerName: string;
  ownerPhotoUrl: string;
};

export type OwnerProfileActionState = {
  fieldErrors: OwnerProfileFieldErrors;
  message: string;
  status: "idle" | "error" | "success";
  values?: OwnerProfileFormValues;
};

type ValidatedOwnerProfileData = {
  ownerDescription: string | null;
  ownerName: string | null;
};

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 200;
const MAX_OWNER_NAME_LENGTH = 120;
const MAX_OWNER_DESCRIPTION_LENGTH = 900;

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

export async function saveOwnerProfile(
  _previousState: OwnerProfileActionState,
  formData: FormData,
): Promise<OwnerProfileActionState> {
  await requireAdminSession();

  const validation = validateOwnerProfileForm(formData);
  const ownerPhotoFile = getOwnerPhotoFile(formData);
  const currentSettings = await prisma.settings.findFirst({
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
      ownerPhotoUrl: true,
    },
  });

  if (!validation.data) {
    const values = validation.state.values ?? {
      ownerDescription: "",
      ownerName: "",
      ownerPhotoUrl: "",
    };

    return {
      ...validation.state,
      values: {
        ...values,
        ownerPhotoUrl: currentSettings?.ownerPhotoUrl ?? "",
      },
    };
  }

  let ownerPhotoUrl = currentSettings?.ownerPhotoUrl ?? null;

  if (ownerPhotoFile) {
    try {
      const upload = await uploadOwnerPhoto({
        file: ownerPhotoFile,
        ownerName: validation.data.ownerName,
      });
      ownerPhotoUrl = upload.url;
    } catch (error) {
      if (error instanceof OwnerPhotoUploadError) {
        return {
          fieldErrors: {
            ownerPhoto: error.message,
          },
          message: "Corrija a foto selecionada para salvar os dados da proprietária.",
          status: "error",
          values: createOwnerProfileValues(validation.data, currentSettings?.ownerPhotoUrl ?? null),
        };
      }

      throw error;
    }
  }

  const data = {
    ownerDescription: validation.data.ownerDescription,
    ownerName: validation.data.ownerName,
    ownerPhotoUrl,
  };

  if (currentSettings) {
    await prisma.settings.update({
      data,
      where: {
        id: currentSettings.id,
      },
    });
  } else {
    await prisma.settings.create({
      data: {
        businessName: "",
        whatsappNumber: "",
        ...data,
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/sobre");

  return {
    fieldErrors: {},
    message: "Dados da proprietária salvos com sucesso.",
    status: "success",
    values: createOwnerProfileValues(validation.data, ownerPhotoUrl),
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

function validateOwnerProfileForm(formData: FormData):
  | {
      data: ValidatedOwnerProfileData;
      state?: never;
    }
  | {
      data?: never;
      state: OwnerProfileActionState;
    } {
  const ownerName = getOptionalText(formData, "ownerName");
  const ownerDescription = getOptionalText(formData, "ownerDescription");
  const fieldErrors: OwnerProfileFieldErrors = {};

  if (ownerName && ownerName.length > MAX_OWNER_NAME_LENGTH) {
    fieldErrors.ownerName = "O nome da proprietária deve ter no máximo 120 caracteres.";
  }

  if (ownerDescription && ownerDescription.length > MAX_OWNER_DESCRIPTION_LENGTH) {
    fieldErrors.ownerDescription = "A descrição deve ter no máximo 900 caracteres.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      state: {
        fieldErrors,
        message: "Corrija os campos destacados para salvar os dados da proprietária.",
        status: "error",
        values: {
          ownerDescription: ownerDescription ?? "",
          ownerName: ownerName ?? "",
          ownerPhotoUrl: "",
        },
      },
    };
  }

  return {
    data: {
      ownerDescription,
      ownerName,
    },
  };
}

function createOwnerProfileValues(
  data: ValidatedOwnerProfileData,
  ownerPhotoUrl: string | null,
): OwnerProfileFormValues {
  return {
    ownerDescription: data.ownerDescription ?? "",
    ownerName: data.ownerName ?? "",
    ownerPhotoUrl: ownerPhotoUrl ?? "",
  };
}

function getFormValue(formData: FormData, fieldName: string) {
  const value = formData.get(fieldName);

  return typeof value === "string" ? value : "";
}

function getOptionalText(formData: FormData, fieldName: string) {
  const value = getFormValue(formData, fieldName).trim();

  return value || null;
}
