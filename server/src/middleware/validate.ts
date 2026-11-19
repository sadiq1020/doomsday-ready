import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

export interface RequestValidationSchema {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

// Reusable middleware for validating req.body, req.params, and req.query with Zod
export const validate = (schema: RequestValidationSchema | ZodSchema) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if ("body" in schema || "query" in schema || "params" in schema) {
        const composite = schema as RequestValidationSchema;
        if (composite.body) {
          req.body = await composite.body.parseAsync(req.body);
        }
        if (composite.query) {
          const parsedQuery = await composite.query.parseAsync(req.query);
          Object.defineProperty(req, "query", {
            value: parsedQuery,
            writable: true,
            configurable: true,
          });
        }
        if (composite.params) {
          req.params = (await composite.params.parseAsync(req.params)) as any;
        }
      } else {
        req.body = await (schema as ZodSchema).parseAsync(req.body);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

