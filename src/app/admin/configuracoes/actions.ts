"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ADMIN_SESSION_COOKIE, readAdminSessionCookie } from "@/lib/auth";
import { prisma } from "@/lib/db";

type SettingsFieldErrors = {
  businessName?: string;
  email?: string;
  facebookUrl?: string;
  googleMapsUrl?: string;
  instagramUrl?: string;
  ogImageUrl?: string;
  whatsappNumber?: string;
};

export type SettingsActionState = {
  fieldErrors: SettingsFieldErrors;
  message: string;
  status: "idle" | "error" | "success";
};

type ValidatedSettingsData = {
  address: string | null;
  businessName: string;
  city: string | null;
  deliveryAvailable: boolean;
  deliveryDescription: string | null;
  email: string | null;
  facebookUrl: string | null;
  googleMapsUrl: string | null;
  instagramUrl: string | null;
  neighborhood: string | null;
  ogImageUrl: string | null;
  openingHours: string | null;
  phone: string | null;
  seoDefaultDescription: string | null;
  seoDefaultTitle: string | null;
  state: string | null;
  whatsappNumber: string;
};

const publicSettingsPaths = [
  "/",
  "/produtos",
  "/sobre",
  "/contato",
  "/carrinho",
  "/pedido",
] as const;

async function requireAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  const session = await readAdminSessionCookie(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
  if (!session) {
    redirect("/admin/login");
  }
}

export async function saveSettings(
  _previousState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  await requireAdminSession();

  const validation = validateSettingsForm(formData);

  if (!validation.data) {
    return validation.state;
  }

  const currentSettings = await prisma.settings.findFirst({
    select: {
      id: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  if (currentSettings) {
    await prisma.settings.update({
      data: validation.data,
      where: {
        id: currentSettings.id,
      },
    });
  } else {
    await prisma.settings.create({
      data: validation.data,
    });
  }

  await revalidateSettingsPaths();

  return {
    fieldErrors: {},
    message: "Configurações salvas com sucesso.",
    status: "success",
  };
}

function validateSettingsForm(formData: FormData):
  | {
      data: ValidatedSettingsData;
      state?: never;
    }
  | {
      data?: never;
      state: SettingsActionState;
    } {
  const businessName = getFormValue(formData, "businessName").trim();
  const whatsappValue = getFormValue(formData, "whatsappNumber").trim();
  const whatsappNumber = whatsappValue.replace(/\D/g, "");
  const email = getOptionalText(formData, "email");
  const googleMapsUrlValue = getFormValue(formData, "googleMapsUrl").trim();
  const instagramUrlValue = getFormValue(formData, "instagramUrl").trim();
  const facebookUrlValue = getFormValue(formData, "facebookUrl").trim();
  const ogImageUrlValue = getFormValue(formData, "ogImageUrl").trim();
  const googleMapsUrl = parseOptionalHttpsUrl(googleMapsUrlValue);
  const instagramUrl = parseOptionalHttpsUrl(instagramUrlValue);
  const facebookUrl = parseOptionalHttpsUrl(facebookUrlValue);
  const ogImageUrl = parseOptionalHttpsUrl(ogImageUrlValue);
  const fieldErrors: SettingsFieldErrors = {};

  if (!businessName) {
    fieldErrors.businessName = "Informe o nome da floricultura.";
  }

  if (!whatsappValue) {
    fieldErrors.whatsappNumber = "Informe o WhatsApp da floricultura.";
  } else if (!isValidWhatsappNumber(whatsappNumber)) {
    fieldErrors.whatsappNumber =
      "Informe o WhatsApp com DDI e DDD, usando de 10 a 15 dígitos.";
  }

  if (email && !isValidEmail(email)) {
    fieldErrors.email = "Informe um e-mail válido.";
  }

  if (googleMapsUrlValue && !googleMapsUrl) {
    fieldErrors.googleMapsUrl = "Informe um link do Google Maps começando com https://.";
  }

  if (instagramUrlValue && !instagramUrl) {
    fieldErrors.instagramUrl = "Informe um link do Instagram começando com https://.";
  }

  if (facebookUrlValue && !facebookUrl) {
    fieldErrors.facebookUrl = "Informe um link do Facebook começando com https://.";
  }

  if (ogImageUrlValue && !ogImageUrl) {
    fieldErrors.ogImageUrl = "Informe um link de imagem começando com https://.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      state: {
        fieldErrors,
        message: "Corrija os campos destacados para salvar as configurações.",
        status: "error",
      },
    };
  }

  return {
    data: {
      address: getOptionalText(formData, "address"),
      businessName,
      city: getOptionalText(formData, "city"),
      deliveryAvailable: formData.get("deliveryAvailable") === "on",
      deliveryDescription: getOptionalText(formData, "deliveryDescription"),
      email,
      facebookUrl,
      googleMapsUrl,
      instagramUrl,
      neighborhood: getOptionalText(formData, "neighborhood"),
      ogImageUrl,
      openingHours: getOptionalText(formData, "openingHours"),
      phone: getOptionalText(formData, "phone"),
      seoDefaultDescription: getOptionalText(formData, "seoDefaultDescription"),
      seoDefaultTitle: getOptionalText(formData, "seoDefaultTitle"),
      state: getOptionalText(formData, "state"),
      whatsappNumber,
    },
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

function isValidWhatsappNumber(value: string) {
  return /^\d{10,15}$/.test(value);
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function parseOptionalHttpsUrl(value: string) {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);

    if (url.protocol !== "https:" || !url.hostname) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

async function revalidateSettingsPaths() {
  for (const path of publicSettingsPaths) {
    revalidatePath(path);
  }

  const activeCategories = await prisma.category.findMany({
    select: {
      slug: true,
    },
    where: {
      active: true,
    },
  });

  for (const category of activeCategories) {
    revalidatePath(`/categoria/${category.slug}`);
  }
}
