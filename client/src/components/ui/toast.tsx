"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { clsx } from "clsx";

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextType {
  toast: (item: Omit<ToastItem, "id">) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | null>(null);

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = React.useCallback(
    (item: Omit<ToastItem, "id">) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const duration = item.duration ?? 4500;

      setToasts((prev) => [...prev, { ...item, id }]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = React.useCallback(
    (title: string, description?: string) => {
      addToast({ type: "success", title, description });
    },
    [addToast]
  );

  const error = React.useCallback(
    (title: string, description?: string) => {
      addToast({ type: "error", title, description });
    },
    [addToast]
  );

  const info = React.useCallback(
    (title: string, description?: string) => {
      addToast({ type: "info", title, description });
    },
    [addToast]
  );

  return (
    <ToastContext.Provider
      value={{ toast: addToast, success, error, info, removeToast }}
    >
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-5 right-5 z-50 flex max-w-sm w-full flex-col gap-2.5 p-4 sm:bottom-6 sm:right-6"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => {
            const icons = {
              success: <CheckCircle2 className="h-4 w-4 text-verdigris shrink-0 mt-0.5" />,
              error: <AlertTriangle className="h-4 w-4 text-ember shrink-0 mt-0.5" />,
              info: <Info className="h-4 w-4 text-brass shrink-0 mt-0.5" />,
            };

            const borderColors = {
              success: "border-verdigris/40",
              error: "border-ember/40",
              info: "border-brass/40",
            };

            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
                transition={{ duration: 0.2 }}
                className={clsx(
                  "pointer-events-auto relative flex w-full items-start gap-3 rounded-[3px] border bg-ink-3 p-4 shadow-xl",
                  borderColors[t.type]
                )}
              >
                {icons[t.type]}
                <div className="flex-1 min-w-0 pr-1">
                  <p className="font-mono text-xs font-semibold uppercase tracking-wider text-paper">
                    {t.title}
                  </p>
                  {t.description && (
                    <p className="mt-1 font-body text-xs text-paper-dim leading-relaxed">
                      {t.description}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeToast(t.id)}
                  className="text-paper-dim/60 hover:text-paper rounded-[2px] transition-colors p-0.5"
                  aria-label="Dismiss notification"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

