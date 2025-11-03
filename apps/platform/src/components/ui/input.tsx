import * as React from "react";
import { cn } from "@/src/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "block w-full rounded-2xl border border-emerald-100/70 bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";
