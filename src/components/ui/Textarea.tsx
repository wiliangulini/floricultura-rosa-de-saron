"use client";

import type { TextareaHTMLAttributes } from "react";
import { useId } from "react";

import { cn } from "@/lib/cn";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: string;
  helperText?: string;
  label?: string;
  wrapperClassName?: string;
};

export function Textarea({
  "aria-describedby": ariaDescribedBy,
  className,
  error,
  helperText,
  id,
  label,
  rows = 4,
  wrapperClassName,
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const helperId = helperText ? `${textareaId}-helper` : undefined;
  const errorId = error ? `${textareaId}-error` : undefined;
  const describedBy = [ariaDescribedBy, helperId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("space-y-2", wrapperClassName)}>
      {label ? (
        <label className="block text-sm font-semibold text-zinc-900" htmlFor={textareaId}>
          {label}
        </label>
      ) : null}
      <textarea
        {...props}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        className={cn(
          "block w-full rounded-md border bg-white px-3.5 py-2.5 text-base text-zinc-950 shadow-sm shadow-rose-950/5 outline-none transition placeholder:text-zinc-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500",
          error ? "border-red-500 focus:border-red-500 focus:ring-red-100" : "border-rose-200",
          className,
        )}
        id={textareaId}
        rows={rows}
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
