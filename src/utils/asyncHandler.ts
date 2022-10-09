import type { NextFunction, Request, RequestHandler, Response } from 'express';

export const asyncHandler = (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
  // Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};
