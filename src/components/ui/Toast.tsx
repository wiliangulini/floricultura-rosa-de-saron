"use client";

import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

export type ToastVariant = "success" | "error" | "info";

type ToastProps = HTMLAttributes<HTMLDivElement> & {
  action?: ReactNode;
  description?: string;
  onClose?: () => void;
  title: string;
  variant?: ToastVariant;
};

const variantClasses: Record<ToastVariant, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-950",
  error: "border-red-200 bg-red-50 text-red-950",
  info: "border-rose-200 bg-rose-50 text-rose-950",
};

export function Toast({
  action,
  className,
  description,
  onClose,
  title,
  variant = "info",
  ...props
}: ToastProps) {
  return (
    <div
      {...props}
      className={cn(
        "flex w-full max-w-sm items-start gap-3 rounded-lg border p-4 shadow-lg shadow-zinc-950/10",
        variantClasses[variant],
        className,
      )}
      role={variant === "error" ? "alert" : "status"}
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{title}</p>
        {description ? <p className="mt-1 text-sm leading-5 opacity-80">{description}</p> : null}
        {action ? <div className="mt-3">{action}</div> : null}
      </div>
      {onClose ? (
        <button
          aria-label="Fechar aviso"
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-md opacity-80 transition hover:bg-white/60 hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
          onClick={onClose}
          type="button"
        >
          <svg
            aria-hidden="true"
            fill="none"
            height="14"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
            viewBox="0 0 16 16"
            width="14"
          >
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}

export function ToastContainer({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      aria-live="polite"
      className={cn("fixed right-4 top-4 z-50 flex flex-col gap-3", className)}
    >
      {children}
    </div>
  );
}
