import * as React from "react";
import { clsx } from "clsx";

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "brass" | "verdigris" | "ember" | "outline";
  size?: "sm" | "md";
}

export const Chip = ({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}: ChipProps) => {
  const baseStyles =
    "inline-flex items-center font-mono uppercase tracking-[0.14em] font-medium rounded-[2px]";

  const variantStyles = {
    default: "bg-ink-3 text-paper-dim border border-hairline",
    brass: "bg-brass/10 text-brass-bright border border-brass/30",
    verdigris: "bg-verdigris/10 text-verdigris border border-verdigris/30",
    ember: "bg-ember/10 text-ember border border-ember/30",
    outline: "bg-transparent text-paper border border-hairline",
  }[variant];

  const sizeStyles = {
    sm: "text-[0.625rem] px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5",
  }[size];

  return (
    <span className={clsx(baseStyles, variantStyles, sizeStyles, className)} {...props}>
      {children}
    </span>
  );
};

