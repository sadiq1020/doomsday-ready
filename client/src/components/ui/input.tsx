import * as React from "react";
import { clsx } from "clsx";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, disabled, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        disabled={disabled}
        className={clsx(
          "w-full h-10 px-3 py-2 bg-ink-2 text-paper rounded-[3px] border text-sm transition-colors duration-150",
          "placeholder:text-paper-dim/40",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brass focus-visible:border-brass",
          "disabled:cursor-not-allowed disabled:opacity-40",
          error
            ? "border-ember focus-visible:ring-ember focus-visible:border-ember text-ember"
            : "border-hairline hover:border-hairline/80",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

