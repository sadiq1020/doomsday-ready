import * as React from "react";
import { clsx } from "clsx";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      disabled,
      type = "button",
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-mono uppercase tracking-[0.12em] font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:pointer-events-none disabled:opacity-40 rounded-[3px] active:scale-[0.98]";

    const variantStyles = {
      primary:
        "bg-brass text-ink hover:bg-brass-bright border border-brass shadow-sm",
      ghost:
        "bg-transparent text-paper hover:bg-ink-3 hover:text-brass border border-transparent hover:border-hairline",
      outline:
        "bg-ink-2 text-paper border border-hairline hover:border-brass hover:text-brass",
      danger:
        "bg-transparent text-ember border border-ember/30 hover:bg-ember/10 hover:border-ember",
    }[variant];

    const sizeStyles = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-10 px-4 text-xs gap-2",
      lg: "h-12 px-6 text-sm gap-2.5",
    }[size];

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={clsx(baseStyles, variantStyles, sizeStyles, className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

