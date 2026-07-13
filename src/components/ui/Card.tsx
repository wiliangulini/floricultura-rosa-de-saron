import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

type CardTitleProps = HTMLAttributes<HTMLHeadingElement> & {
  children: ReactNode;
};

type CardDescriptionProps = HTMLAttributes<HTMLParagraphElement> & {
  children: ReactNode;
};

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      {...props}
      className={cn(
        "rounded-2xl border border-border bg-surface text-foreground shadow-soft",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }: CardProps) {
  return (
    <div {...props} className={cn("space-y-1.5 p-5 pb-3", className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }: CardTitleProps) {
  return (
    <h3
      {...props}
      className={cn("font-display text-xl font-semibold tracking-tight text-foreground", className)}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ children, className, ...props }: CardDescriptionProps) {
  return (
    <p {...props} className={cn("text-sm leading-6 text-muted", className)}>
      {children}
    </p>
  );
}

export function CardContent({ children, className, ...props }: CardProps) {
  return (
    <div {...props} className={cn("p-5 pt-3", className)}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }: CardProps) {
  return (
    <div
      {...props}
      className={cn("flex items-center gap-3 border-t border-border p-5", className)}
    >
      {children}
    </div>
  );
}
