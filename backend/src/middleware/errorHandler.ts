import type { Request, Response, NextFunction } from "express";
import type { HttpError } from "http-errors";
import logger from "../utils/logger.js";

export const errorHandler = (
  error: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Set defaults if undefined
  const statusCode = error.statusCode || 500;
  const status = error.status || "error";
  // Log the error (stack trace in dev, message in prod)
  logger.error(`${status} -${error.message}-${req.method}-${req.ip}`);
  if (process.env.NODE_ENV === "development") {
    logger.error(error.stack);
  }

  res.status(statusCode).json({
    success: false,
    status,
    message: error.message || "Something went wrong!",
  });
};
