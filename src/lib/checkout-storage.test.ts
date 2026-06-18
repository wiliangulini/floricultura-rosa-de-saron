import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  loadReviewedCheckout,
  saveReviewedCheckout,
  clearStoredCheckout,
  CHECKOUT_STORAGE_KEY,
} from "@/lib/checkout-storage";
import type { CheckoutFormData } from "@/lib/whatsapp";

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

beforeEach(() => {
  vi.stubGlobal("localStorage", localStorageMock);
  localStorageMock.clear();
  vi.clearAllMocks();
});

const validPickup: CheckoutFormData = {
  customerName: "Maria Silva",
  desiredDate: "",
  paymentMethod: "",
  cardMessage: "",
  notes: "",
  fulfillmentMode: "pickup",
  street: "",
  houseNumber: "",
  neighborhood: "",
  city: "",
  referencePoint: "",
  contactPhone: "",
};

const validDelivery: CheckoutFormData = {
  customerName: "João Costa",
  desiredDate: "",
  paymentMethod: "",
  cardMessage: "",
  notes: "",
  fulfillmentMode: "delivery",
  street: "Rua das Flores",
  houseNumber: "42",
  neighborhood: "Jardim",
  city: "São Paulo",
  referencePoint: "Ao lado do banco",
  contactPhone: "11988887777",
};

function storeRaw(value: unknown) {
  localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(value));
}

describe("loadReviewedCheckout", () => {
  it("retorna null para JSON inválido", () => {
    localStorageMock.getItem.mockReturnValueOnce("{invalid json");
    expect(loadReviewedCheckout()).toBeNull();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith(CHECKOUT_STORAGE_KEY);
  });

  it("retorna null quando version !== 1", () => {
    storeRaw({ version: 2, reviewedAt: new Date().toISOString(), data: validPickup });
    expect(loadReviewedCheckout()).toBeNull();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith(CHECKOUT_STORAGE_KEY);
  });

  it("retorna null quando reviewedAt ausente", () => {
    storeRaw({ version: 1, reviewedAt: "", data: validPickup });
    expect(loadReviewedCheckout()).toBeNull();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith(CHECKOUT_STORAGE_KEY);
  });

  it("retorna null quando customerName vazio", () => {
    storeRaw({
      version: 1,
      reviewedAt: new Date().toISOString(),
      data: { ...validPickup, customerName: "   " },
    });
    expect(loadReviewedCheckout()).toBeNull();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith(CHECKOUT_STORAGE_KEY);
  });

  it("retorna null quando fulfillmentMode inválido", () => {
    storeRaw({
      version: 1,
      reviewedAt: new Date().toISOString(),
      data: { ...validPickup, fulfillmentMode: "curbside" },
    });
    expect(loadReviewedCheckout()).toBeNull();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith(CHECKOUT_STORAGE_KEY);
  });

  it("retorna checkout válido para pickup sem campos de endereço", () => {
    storeRaw({ version: 1, reviewedAt: new Date().toISOString(), data: validPickup });
    const result = loadReviewedCheckout();
    expect(result).not.toBeNull();
    expect(result?.customerName).toBe("Maria Silva");
    expect(result?.fulfillmentMode).toBe("pickup");
  });

  it("retorna null para delivery sem street", () => {
    storeRaw({
      version: 1,
      reviewedAt: new Date().toISOString(),
      data: { ...validDelivery, street: "" },
    });
    expect(loadReviewedCheckout()).toBeNull();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith(CHECKOUT_STORAGE_KEY);
  });

  it("retorna null para delivery sem houseNumber", () => {
    storeRaw({
      version: 1,
      reviewedAt: new Date().toISOString(),
      data: { ...validDelivery, houseNumber: "" },
    });
    expect(loadReviewedCheckout()).toBeNull();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith(CHECKOUT_STORAGE_KEY);
  });

  it("retorna null para delivery sem neighborhood", () => {
    storeRaw({
      version: 1,
      reviewedAt: new Date().toISOString(),
      data: { ...validDelivery, neighborhood: "" },
    });
    expect(loadReviewedCheckout()).toBeNull();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith(CHECKOUT_STORAGE_KEY);
  });

  it("retorna null para delivery sem city", () => {
    storeRaw({
      version: 1,
      reviewedAt: new Date().toISOString(),
      data: { ...validDelivery, city: "" },
    });
    expect(loadReviewedCheckout()).toBeNull();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith(CHECKOUT_STORAGE_KEY);
  });

  it("retorna null para delivery sem referencePoint", () => {
    storeRaw({
      version: 1,
      reviewedAt: new Date().toISOString(),
      data: { ...validDelivery, referencePoint: "" },
    });
    expect(loadReviewedCheckout()).toBeNull();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith(CHECKOUT_STORAGE_KEY);
  });

  it("retorna null para delivery sem contactPhone", () => {
    storeRaw({
      version: 1,
      reviewedAt: new Date().toISOString(),
      data: { ...validDelivery, contactPhone: "" },
    });
    expect(loadReviewedCheckout()).toBeNull();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith(CHECKOUT_STORAGE_KEY);
  });

  it("remove a chave do storage quando dados são inválidos", () => {
    localStorageMock.getItem.mockReturnValueOnce("not-json-at-all");
    loadReviewedCheckout();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith(CHECKOUT_STORAGE_KEY);
  });
});

describe("saveReviewedCheckout", () => {
  it("grava payload com version: 1 e reviewedAt presente", () => {
    saveReviewedCheckout(validPickup);
    expect(localStorageMock.setItem).toHaveBeenCalledTimes(1);
    const [key, value] = localStorageMock.setItem.mock.calls[0] as [string, string];
    expect(key).toBe(CHECKOUT_STORAGE_KEY);
    const parsed = JSON.parse(value) as { version: number; reviewedAt: string };
    expect(parsed.version).toBe(1);
    expect(typeof parsed.reviewedAt).toBe("string");
    expect(parsed.reviewedAt.length).toBeGreaterThan(0);
  });
});

describe("clearStoredCheckout", () => {
  it("remove a chave do storage", () => {
    clearStoredCheckout();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith(CHECKOUT_STORAGE_KEY);
  });
});
