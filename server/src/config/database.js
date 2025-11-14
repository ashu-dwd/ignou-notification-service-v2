/**
 * MongoDB Mongoose Connection Configuration Module (ESM)
 * Handles connection setup, options, event listeners, and graceful shutdown.
 */
import mongoose from "mongoose";

// It's assumed dotenv is loaded in entrypoint (index.js or config/index.js)

const mongooseOptions = {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  retryWrites: true,
  retryReads: true,
  connectTimeoutMS: 30000,
  heartbeatFrequencyMS: 10000,
};

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected successfully");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected");
});

export const connectWithRetry = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI, mongooseOptions);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message);
    console.log("Retrying connection in 5 seconds...");
    setTimeout(connectWithRetry, 5000);
  }
};

// Initial connection
connectWithRetry();

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed due to app termination");
  process.exit(0);
});

export default mongoose;
