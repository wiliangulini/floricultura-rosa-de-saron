"use client";

import type { InputHTMLAttributes } from "react";
import { useId } from "react";

import { cn } from "@/lib/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  helperText?: string;
  label?: string;
  wrapperClassName?: string;
};

export function Input({
  "aria-describedby": ariaDescribedBy,
  className,
  error,
  helperText,
  id,
  label,
  wrapperClassName,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const helperId = helperText ? `${inputId}-helper` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [ariaDescribedBy, helperId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("space-y-2", wrapperClassName)}>
      {label ? (
        <label className="block text-sm font-semibold text-zinc-900" htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      <input
        {...props}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        className={cn(
          "block min-h-11 w-full rounded-xl border bg-surface px-3.5 py-2.5 text-base text-foreground shadow-soft outline-none transition placeholder:text-zinc-500 focus:border-primary focus:ring-2 focus:ring-rose-200 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500",
          error ? "border-red-500 focus:border-red-500 focus:ring-red-100" : "border-zinc-300",
          className,
        )}
        id={inputId}
      />
      {helperText ? (
        <p className="text-sm leading-5 text-zinc-600" id={helperId}>
          {helperText}
        </p>
      ) : null}
      {error ? (
        <p className="text-sm font-medium leading-5 text-red-700" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
