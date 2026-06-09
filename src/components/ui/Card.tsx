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
        "rounded-lg border border-rose-100 bg-white/90 text-zinc-950 shadow-sm shadow-rose-950/5",
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
    <h3 {...props} className={cn("text-lg font-semibold text-zinc-950", className)}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className, ...props }: CardDescriptionProps) {
  return (
    <p {...props} className={cn("text-sm leading-6 text-zinc-600", className)}>
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
      className={cn("flex items-center gap-3 border-t border-rose-100 p-5", className)}
    >
      {children}
    </div>
  );
}
