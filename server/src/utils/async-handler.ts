import type { Request, Response, NextFunction, RequestHandler } from "express";

// Wraps async route handlers and forwards any errors to next()
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

