export const LEGACY_CITY = "Pato Branco";
export const STORE_CITY = "Coronel Vivida";
export const STORE_STATE = "PR";

export type StoreLocationSnapshot = {
  city: string | null;
  deliveryDescription: string | null;
  seoDefaultDescription: string | null;
  seoDefaultTitle: string | null;
  state: string | null;
};

export type StoreLocationUpdate = {
  city?: string;
  deliveryDescription?: string;
  seoDefaultDescription?: string;
  seoDefaultTitle?: string;
  state?: string;
};

export function shouldApplyStoreLocationUpdate(args: string[]): boolean {
  const unknownArgs = args.filter((arg) => arg !== "--apply");

  if (unknownArgs.length > 0) {
    throw new Error(`Argumento não reconhecido: ${unknownArgs.join(", ")}`);
  }

  return args.includes("--apply");
}

export function replaceLegacyCity(value: string | null): string | null {
  return value?.replaceAll(LEGACY_CITY, STORE_CITY) ?? null;
}

export function getStoreLocationUpdate(
  settings: StoreLocationSnapshot,
): StoreLocationUpdate {
  if (settings.city !== LEGACY_CITY && settings.city !== STORE_CITY) {
    throw new Error(
      `Cidade inesperada em Settings: ${settings.city ?? "(vazia)"}. ` +
        `Esperado: ${LEGACY_CITY} ou ${STORE_CITY}.`,
    );
  }

  const update: StoreLocationUpdate = {};
  const seoDefaultTitle = replaceLegacyCity(settings.seoDefaultTitle);
  const seoDefaultDescription = replaceLegacyCity(settings.seoDefaultDescription);
  const deliveryDescription = replaceLegacyCity(settings.deliveryDescription);

  if (settings.city !== STORE_CITY) update.city = STORE_CITY;
  if (settings.state !== STORE_STATE) update.state = STORE_STATE;
  if (seoDefaultTitle !== settings.seoDefaultTitle && seoDefaultTitle) {
    update.seoDefaultTitle = seoDefaultTitle;
  }
  if (seoDefaultDescription !== settings.seoDefaultDescription && seoDefaultDescription) {
    update.seoDefaultDescription = seoDefaultDescription;
  }
  if (deliveryDescription !== settings.deliveryDescription && deliveryDescription) {
    update.deliveryDescription = deliveryDescription;
  }

  return update;
}

