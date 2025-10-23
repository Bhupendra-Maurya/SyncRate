import mongoose from "mongoose";
import logger from "../utils/logger.js";

const connectDB = async (): Promise<void> => {
  const mongoURI = process.env.MONGODB_URI as string;
  const options = {
    maxPoolSize: 20,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    autoIndex: false,
    family: 4,
  };
  try {
    const conn = await mongoose.connect(mongoURI, options);
    logger.info(` MongoDB connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on("disconnected", () => {
      logger.warn("⚠️ MongoDB disconnected, retrying...");
      setTimeout(connectDB, 5000);
    });

  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    setTimeout(connectDB, 5000); // Retry connection
  }
};

export default connectDB;