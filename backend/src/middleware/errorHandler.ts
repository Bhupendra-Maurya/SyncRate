import type { Request, Response, NextFunction } from "express";
import type { HttpError } from "http-errors";
import logger from "../utils/logger.js";

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = error.statusCode || 500;
  let status = error.status || "error";
  let message = error.message || "Something went wrong!";

  // ----- MongoDB Errors -----
  if (error.code === 11000) {
    statusCode = 409;
    status = "fail";
    const field = Object.keys(error.keyPattern)[0];
    message = `${field} already exists`;
  }

  if (error.name === "ValidationError") {
    statusCode = 400;
    status = "fail";
    message = Object.values(error.errors)
      .map((e: any) => e.message)
      .join(", ");
  }

  if (error.name === "CastError") {
    statusCode = 400;
    status = "fail";
    message = "Invalid ID format";
  }

  // ----- JWT Errors -----
  if (error.name === "JsonWebTokenError") {
    statusCode = 401;
    status = "fail";
    message = "Invalid token";
  }

  if (error.name === "TokenExpiredError") {
    statusCode = 401;
    status = "fail";
    message = "Token has expired";
  }

  // ----- Log the error -----
  logger.error(
    `[${status.toUpperCase()}] ${message} - ${req.method} ${req.originalUrl} - IP: ${req.ip}`
  );

  if (process.env.NODE_ENV === "development" && error.stack) {
    logger.error(error.stack);
  }

  // ----- Send structured response -----
  res.status(statusCode).json({
    success: false,
    status,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
};
