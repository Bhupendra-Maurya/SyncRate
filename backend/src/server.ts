import dotenv from "dotenv";

// Load environment variables
dotenv.config();

import app from "./app.js";
import connectDB from "./config/database.js";
import logger from "./utils/logger.js";
import mongoose from "mongoose";
import { errorHandler } from "./middleware/errorHandler.js";

// Configuration
const PORT = process.env.PORT;
// const NODE_ENV = process.env.NODE_ENV || "development";

// Global error handler
app.use(errorHandler)



// Start server
const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  // Start Express server
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

// start the server
startServer();
