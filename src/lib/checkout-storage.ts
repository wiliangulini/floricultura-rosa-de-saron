import type { CheckoutFormData, FulfillmentMode } from "@/lib/whatsapp";

export const CHECKOUT_STORAGE_KEY = "floricultura-rosa-de-saron:checkout";

const CHECKOUT_STORAGE_VERSION = 1;

type StoredCheckoutPayload = {
  version: 1;
  reviewedAt: string;
  data: CheckoutFormData;
};

function getStorage(): Storage | null {
  if (typeof localStorage === "undefined") return null;
  return localStorage;
}

function sanitizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isValidFulfillmentMode(v: unknown): v is FulfillmentMode {
  return v === "pickup" || v === "delivery";
}

function hasRequiredDeliveryFields(d: CheckoutFormData): boolean {
  return [d.street, d.houseNumber, d.neighborhood, d.city, d.referencePoint, d.contactPhone].every(
    (f) => f.trim().length > 0,
  );
}

export function loadReviewedCheckout(): CheckoutFormData | null {
  const storage = getStorage();
  if (!storage) return null;

  const raw = storage.getItem(CHECKOUT_STORAGE_KEY);
  if (!raw) return null;

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    storage.removeItem(CHECKOUT_STORAGE_KEY);
    return null;
  }

  if (
    typeof payload !== "object" ||
    payload === null ||
    (payload as Record<string, unknown>).version !== CHECKOUT_STORAGE_VERSION
  ) {
    storage.removeItem(CHECKOUT_STORAGE_KEY);
    return null;
  }

  const p = payload as Record<string, unknown>;

  if (typeof p.reviewedAt !== "string" || !p.reviewedAt) {
    storage.removeItem(CHECKOUT_STORAGE_KEY);
    return null;
  }

  const data = p.data as Record<string, unknown> | undefined;

  if (!data) {
    storage.removeItem(CHECKOUT_STORAGE_KEY);
    return null;
  }

  const customerName = sanitizeText(data.customerName);
  if (!customerName) {
    storage.removeItem(CHECKOUT_STORAGE_KEY);
    return null;
  }

  if (!isValidFulfillmentMode(data.fulfillmentMode)) {
    storage.removeItem(CHECKOUT_STORAGE_KEY);
    return null;
  }

  const checkout: CheckoutFormData = {
    customerName,
    desiredDate: sanitizeText(data.desiredDate),
    paymentMethod: sanitizeText(data.paymentMethod),
    cardMessage: sanitizeText(data.cardMessage),
    notes: sanitizeText(data.notes),
    fulfillmentMode: data.fulfillmentMode,
    street: sanitizeText(data.street),
    houseNumber: sanitizeText(data.houseNumber),
    neighborhood: sanitizeText(data.neighborhood),
    city: sanitizeText(data.city),
    referencePoint: sanitizeText(data.referencePoint),
    contactPhone: sanitizeText(data.contactPhone),
  };

  if (checkout.fulfillmentMode === "delivery" && !hasRequiredDeliveryFields(checkout)) {
    storage.removeItem(CHECKOUT_STORAGE_KEY);
    return null;
  }

  return checkout;
}

export function saveReviewedCheckout(data: CheckoutFormData): void {
  const storage = getStorage();
  if (!storage) return;

  const payload: StoredCheckoutPayload = {
    version: 1,
    reviewedAt: new Date().toISOString(),
    data: {
      customerName: data.customerName.trim(),
      desiredDate: data.desiredDate.trim(),
      paymentMethod: data.paymentMethod.trim(),
      cardMessage: data.cardMessage.trim(),
      notes: data.notes.trim(),
      fulfillmentMode: data.fulfillmentMode,
      street: data.street.trim(),
      houseNumber: data.houseNumber.trim(),
      neighborhood: data.neighborhood.trim(),
      city: data.city.trim(),
      referencePoint: data.referencePoint.trim(),
      contactPhone: data.contactPhone.trim(),
    },
  };

  try {
    storage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    storage.removeItem(CHECKOUT_STORAGE_KEY);
  }
}

export function clearStoredCheckout(): void {
  const storage = getStorage();
  if (!storage) return;
  storage.removeItem(CHECKOUT_STORAGE_KEY);
}
