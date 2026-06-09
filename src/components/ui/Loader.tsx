import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export type LoaderSize = "sm" | "md" | "lg";

type LoaderProps = HTMLAttributes<HTMLDivElement> & {
  label?: string;
  showLabel?: boolean;
  size?: LoaderSize;
};

const sizeClasses: Record<LoaderSize, string> = {
  sm: "size-4 border-2",
  md: "size-6 border-2",
  lg: "size-8 border-[3px]",
};

export function Loader({
  className,
  label = "Carregando",
  showLabel = false,
  size = "md",
  ...props
}: LoaderProps) {
  return (
    <div
      {...props}
      aria-live="polite"
      className={cn("inline-flex items-center gap-3 text-rose-700", className)}
      role="status"
    >
      <span
        aria-hidden="true"
        className={cn(
          "animate-spin rounded-full border-current border-r-transparent",
          sizeClasses[size],
        )}
      />
      <span className={showLabel ? "text-sm font-medium text-zinc-700" : "sr-only"}>{label}</span>
    </div>
  );
}
