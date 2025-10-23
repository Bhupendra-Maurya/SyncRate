import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/database.js";
import logger from "./utils/logger.js";
import mongoose from "mongoose";

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    logger.info(`🚀 Server running on http://localhost/${PORT}`);
  });

  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    logger.info("MongoDB connection closed (SIGINT)");
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    await mongoose.connection.close();
    logger.info("MongoDB connection closed (SIGTERM)");
    process.exit(0);
  });
};

startServer();
