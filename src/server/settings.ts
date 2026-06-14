import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";

const publicSettingsSelect = {
  businessName: true,
  whatsappNumber: true,
  phone: true,
  email: true,
  address: true,
  city: true,
  state: true,
  neighborhood: true,
  googleMapsUrl: true,
  instagramUrl: true,
  facebookUrl: true,
  openingHours: true,
  deliveryAvailable: true,
  deliveryDescription: true,
  seoDefaultTitle: true,
  seoDefaultDescription: true,
  ogImageUrl: true,
} satisfies Prisma.SettingsSelect;

const adminSettingsSelect = {
  id: true,
  ...publicSettingsSelect,
} satisfies Prisma.SettingsSelect;

export type PublicSettings = Prisma.SettingsGetPayload<{
  select: typeof publicSettingsSelect;
}>;

export type AdminSettings = Prisma.SettingsGetPayload<{
  select: typeof adminSettingsSelect;
}>;

const fallbackSettings: PublicSettings = {
  businessName: "",
  whatsappNumber: "",
  phone: null,
  email: null,
  address: null,
  city: null,
  state: null,
  neighborhood: null,
  googleMapsUrl: null,
  instagramUrl: null,
  facebookUrl: null,
  openingHours: null,
  deliveryAvailable: false,
  deliveryDescription: null,
  seoDefaultTitle: null,
  seoDefaultDescription: null,
  ogImageUrl: null,
};

export async function getSettings(): Promise<PublicSettings> {
  const settings = await prisma.settings.findFirst({
    select: publicSettingsSelect,
    orderBy: {
      createdAt: "asc",
    },
  });

  return settings ?? fallbackSettings;
}

export async function getAdminSettings(): Promise<AdminSettings | null> {
  return prisma.settings.findFirst({
    select: adminSettingsSelect,
    orderBy: {
      createdAt: "asc",
    },
  });
}
