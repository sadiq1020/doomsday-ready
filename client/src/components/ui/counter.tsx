"use client";

import * as React from "react";
import { animate, useReducedMotion } from "motion/react";

export interface CounterProps {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function Counter({
  value,
  duration = 1,
  className,
  prefix = "",
  suffix = "",
}: CounterProps) {
  const [displayValue, setDisplayValue] = React.useState(0);
  const shouldReduceMotion = useReducedMotion();
  const prevValueRef = React.useRef(0);

  React.useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayValue(value);
      prevValueRef.current = value;
      return;
    }

    const controls = animate(prevValueRef.current, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest));
      },
    });

    prevValueRef.current = value;
    return () => controls.stop();
  }, [value, duration, shouldReduceMotion]);

  return (
    <span className={className}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}

