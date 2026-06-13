"use client";

import { useEffect, useState, type ComponentPropsWithoutRef } from "react";

import { Button } from "@/components/ui/Button";
import { useCart, type CartProductInput } from "@/context/CartContext";

type AddToCartButtonProps = Omit<
  ComponentPropsWithoutRef<typeof Button>,
  "children" | "onClick"
> & {
  addedLabel?: string;
  idleLabel?: string;
  product: CartProductInput;
  unavailableLabel?: string;
};

export function AddToCartButton({
  addedLabel = "Adicionado ao pedido",
  disabled,
  idleLabel = "Adicionar ao pedido",
  product,
  unavailableLabel = "Indisponível",
  ...props
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [feedbackKey, setFeedbackKey] = useState(0);
  const isUnavailable = !product.available;

  useEffect(() => {
    if (feedbackKey === 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setFeedbackKey(0);
    }, 1800);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [feedbackKey]);

  function handleAddToCart() {
    if (disabled || isUnavailable) {
      return;
    }

    addItem(product);
    setFeedbackKey((currentFeedbackKey) => currentFeedbackKey + 1);
  }

  return (
    <Button {...props} disabled={disabled || isUnavailable} onClick={handleAddToCart}>
      {isUnavailable ? unavailableLabel : feedbackKey > 0 ? addedLabel : idleLabel}
    </Button>
  );
}
