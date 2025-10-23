import type { Request, Response, NextFunction } from "express";

export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  res.status(404).json({
    success: false,
    status: "fail",
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
};
