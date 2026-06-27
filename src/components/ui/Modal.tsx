"use client";

import type { ReactNode } from "react";
import { useEffect, useId, useRef } from "react";

import { cn } from "@/lib/cn";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

type ModalProps = {
  children: ReactNode;
  className?: string;
  closeLabel?: string;
  closable?: boolean;
  description?: string;
  footer?: ReactNode;
  onClose: () => void;
  open: boolean;
  role?: "dialog" | "alertdialog";
  title: string;
};

export function Modal({
  children,
  className,
  closeLabel = "Fechar modal",
  closable = true,
  description,
  footer,
  onClose,
  open,
  role = "dialog",
  title,
}: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !dialogRef.current) return;

    dialogRef.current.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (closable) onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closable, onClose, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-zinc-950/35"
        onClick={closable ? onClose : undefined}
      />
      <div
        aria-describedby={description ? descriptionId : undefined}
        aria-labelledby={titleId}
        aria-modal="true"
        className={cn(
          "relative max-h-[calc(100dvh-3rem)] w-full max-w-[calc(100vw-2rem)] overflow-y-auto rounded-lg border border-rose-100 bg-white p-6 text-zinc-950 shadow-xl shadow-zinc-950/15 outline-none sm:max-w-lg",
          className,
        )}
        ref={dialogRef}
        role={role}
        tabIndex={-1}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-zinc-950" id={titleId}>
              {title}
            </h2>
            {description ? (
              <p className="mt-2 text-sm leading-6 text-zinc-600" id={descriptionId}>
                {description}
              </p>
            ) : null}
          </div>
          <button
            aria-label={closeLabel}
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-md text-zinc-600 transition hover:bg-rose-50 hover:text-rose-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={!closable}
            onClick={onClose}
            type="button"
          >
            <svg
              aria-hidden="true"
              fill="none"
              height="16"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
              viewBox="0 0 16 16"
              width="16"
            >
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>
        <div className="mt-5">{children}</div>
        {footer ? <div className="mt-6 flex flex-wrap justify-end gap-3">{footer}</div> : null}
      </div>
    </div>
  );
}
