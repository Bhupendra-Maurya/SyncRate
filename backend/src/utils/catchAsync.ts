import type { Request, Response, NextFunction } from "express";

export const catchAsync = (fn: Function) => {
  return (req: Request, response: Response, next: NextFunction) => {
    Promise.resolve(fn(req, response, next)).catch(next);
  };
};
