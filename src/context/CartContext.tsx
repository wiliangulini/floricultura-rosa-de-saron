"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const CART_STORAGE_KEY = "floricultura-rosa-de-saron:cart";

const cartPriceTypes = ["FIXED", "STARTING_FROM", "ON_REQUEST"] as const;

export type CartPriceType = (typeof cartPriceTypes)[number];

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  unitPrice: number | null;
  priceType: CartPriceType;
  imageUrl: string | null;
  quantity: number;
  shortDescription: string | null;
};

export type CartProductInput = Omit<CartItem, "quantity"> & {
  available: boolean;
};

export type CartTotal = {
  estimatedTotal: number;
  hasOnRequestItems: boolean;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (product: CartProductInput) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => CartTotal;
  getItemsCount: () => number;
};

const CartContext = createContext<CartContextValue | null>(null);

type CartProviderProps = Readonly<{
  children: ReactNode;
}>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getRequiredString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();

  return trimmedValue ? trimmedValue : null;
}

function getNullableString(value: unknown): string | null {
  if (value === null || typeof value === "undefined") {
    return null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();

  return trimmedValue ? trimmedValue : null;
}

function isCartPriceType(value: unknown): value is CartPriceType {
  return typeof value === "string" && cartPriceTypes.includes(value as CartPriceType);
}

function normalizeQuantity(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value <= 0) {
    return null;
  }

  return value;
}

function normalizeUnitPrice(value: unknown, priceType: CartPriceType): number | null {
  if (priceType === "ON_REQUEST") {
    return null;
  }

  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return null;
  }

  return value;
}

function parseStoredCartItem(value: unknown): CartItem | null {
  if (!isRecord(value)) {
    return null;
  }

  const productId = getRequiredString(value.productId);
  const slug = getRequiredString(value.slug);
  const name = getRequiredString(value.name);
  const priceType = value.priceType;
  const quantity = normalizeQuantity(value.quantity);

  if (!productId || !slug || !name || !isCartPriceType(priceType) || !quantity) {
    return null;
  }

  return {
    productId,
    slug,
    name,
    unitPrice: normalizeUnitPrice(value.unitPrice, priceType),
    priceType,
    imageUrl: getNullableString(value.imageUrl),
    quantity,
    shortDescription: getNullableString(value.shortDescription),
  };
}

function parseStoredCart(value: unknown): CartItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const itemsByProductId = new Map<string, CartItem>();

  for (const rawItem of value) {
    const item = parseStoredCartItem(rawItem);

    if (!item) {
      continue;
    }

    const existingItem = itemsByProductId.get(item.productId);

    if (existingItem) {
      itemsByProductId.set(item.productId, {
        ...item,
        quantity: existingItem.quantity + item.quantity,
      });
      continue;
    }

    itemsByProductId.set(item.productId, item);
  }

  return Array.from(itemsByProductId.values());
}

function loadStoredCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);

    if (!storedCart) {
      return [];
    }

    return parseStoredCart(JSON.parse(storedCart));
  } catch {
    window.localStorage.removeItem(CART_STORAGE_KEY);
    return [];
  }
}

function saveStoredCart(items: CartItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    window.localStorage.removeItem(CART_STORAGE_KEY);
  }
}

function getSanitizedCartProduct(product: CartProductInput): CartItem | null {
  if (!product.available) {
    return null;
  }

  const productId = getRequiredString(product.productId);
  const slug = getRequiredString(product.slug);
  const name = getRequiredString(product.name);

  if (!productId || !slug || !name || !isCartPriceType(product.priceType)) {
    return null;
  }

  return {
    productId,
    slug,
    name,
    unitPrice: normalizeUnitPrice(product.unitPrice, product.priceType),
    priceType: product.priceType,
    imageUrl: getNullableString(product.imageUrl),
    quantity: 1,
    shortDescription: getNullableString(product.shortDescription),
  };
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>(loadStoredCart);

  useEffect(() => {
    saveStoredCart(items);
  }, [items]);

  const addItem = useCallback((product: CartProductInput) => {
    const item = getSanitizedCartProduct(product);

    if (!item) {
      return;
    }

    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (currentItem) => currentItem.productId === item.productId,
      );

      if (!existingItem) {
        return [...currentItems, item];
      }

      return currentItems.map((currentItem) =>
        currentItem.productId === item.productId
          ? { ...item, quantity: currentItem.quantity + 1 }
          : currentItem,
      );
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((currentItems) =>
      currentItems.filter((currentItem) => currentItem.productId !== productId),
    );
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    const normalizedQuantity = normalizeQuantity(quantity);

    setItems((currentItems) => {
      if (!normalizedQuantity) {
        return currentItems.filter((currentItem) => currentItem.productId !== productId);
      }

      return currentItems.map((currentItem) =>
        currentItem.productId === productId
          ? { ...currentItem, quantity: normalizedQuantity }
          : currentItem,
      );
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getTotal = useCallback((): CartTotal => {
    return items.reduce<CartTotal>(
      (total, item) => ({
        estimatedTotal:
          typeof item.unitPrice === "number"
            ? total.estimatedTotal + item.unitPrice * item.quantity
            : total.estimatedTotal,
        hasOnRequestItems: total.hasOnRequestItems || item.priceType === "ON_REQUEST",
      }),
      {
        estimatedTotal: 0,
        hasOnRequestItems: false,
      },
    );
  }, [items]);

  const getItemsCount = useCallback((): number => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const contextValue = useMemo<CartContextValue>(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getTotal,
      getItemsCount,
    }),
    [items, addItem, removeItem, updateQuantity, clearCart, getTotal, getItemsCount],
  );

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart deve ser usado dentro de CartProvider.");
  }

  return context;
}
