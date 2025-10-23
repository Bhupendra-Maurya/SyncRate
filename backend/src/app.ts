import express, { type Application,type NextFunction,type Request,type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import logger from "./utils/logger.js";

const app: Application = express();

// GLOBAL MIDDLEWARES
app.use(
  cors({ origin: process.env.FRONTEND_URL as string, credentials: true })
);

app.use(morgan("combined")); // Logs HTTP requests
app.use(compression()); // Compresses responses
app.use(cookieParser()); // Parses cookies
app.use(helmet()); // Adds security headers

// Parse incoming JSON and URL-encoded payloads
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// Rate Limiting — prevent DDoS or brute force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api", limiter);

// ROUTES

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "OK", message: "Server is healthy 🚀" });
});


// ERROR HANDLING
// app.all("", (req: Request, res: Response) => {
//   res.status(404).json({
//     success: false,
//     message: `Route ${req.originalUrl} not found`,
//   });
// });

app.use((err: any, res: Response) => {
  logger.error(err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;
