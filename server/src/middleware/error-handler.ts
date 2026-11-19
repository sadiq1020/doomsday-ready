import type { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/app-error.js";

interface ValidationErrorDetail {
  field: string;
  message: string;
}

interface ErrorResponseBody {
  error: {
    code: string;
    message: string;
    details?: ValidationErrorDetail[];
  };
}

// Global centralized error handler
export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // 1. AppError (trusted operational errors)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
      },
    } satisfies ErrorResponseBody);
    return;
  }

  // 2. ZodError (validation errors)
  if (err instanceof ZodError) {
    const details: ValidationErrorDetail[] = err.issues.map((issue) => ({
      field: issue.path.length > 0 ? issue.path.join(".") : "field",
      message: issue.message,
    }));

    res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        details,
      },
    } satisfies ErrorResponseBody);
    return;
  }

  // 3. Unknown errors (no stack leak to client)
  console.error("Unhandled Error:", err);

  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "Internal server error",
    },
  } satisfies ErrorResponseBody);
};

