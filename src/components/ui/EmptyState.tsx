import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type EmptyStateProps = HTMLAttributes<HTMLDivElement> & {
  action?: ReactNode;
  description?: string;
  icon?: ReactNode;
  title: string;
};

export function EmptyState({
  action,
  className,
  description,
  icon,
  title,
  ...props
}: EmptyStateProps) {
  return (
    <div
      {...props}
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-rose-200 bg-surface/70 px-6 py-12 text-center",
        className,
      )}
    >
      {icon ? (
        <div
          aria-hidden="true"
          className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary-soft text-primary"
        >
          {icon}
        </div>
      ) : null}
      <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">{title}</h2>
      {description ? <p className="mt-2 max-w-md text-sm leading-6 text-muted">{description}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
