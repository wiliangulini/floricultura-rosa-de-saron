import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

export type BadgeVariant = "rose" | "sage" | "gold" | "neutral";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  variant?: BadgeVariant;
};

const variantClasses: Record<BadgeVariant, string> = {
  rose: "border-rose-200 bg-rose-50 text-rose-800",
  sage: "border-emerald-200 bg-emerald-50 text-emerald-800",
  gold: "border-amber-200 bg-amber-50 text-amber-800",
  neutral: "border-zinc-200 bg-zinc-50 text-zinc-700",
};

export function Badge({ children, className, variant = "rose", ...props }: BadgeProps) {
  return (
    <span
      {...props}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
