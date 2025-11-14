/**
 * Server Startup, Error Handling, & Cron Initialization (ESM)
 * Starts HTTP server, attaches process event handlers, initializes cron after startup.
 */
import http from "http";
import app from "./app.js";
import mongoose from "../config/database.js";
// import { initializeCronJob } from "../services/cronService.js"; // To be implemented

const PORT = process.env.PORT || 3000;

export const startServer = () => {
  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    // After server starts, initialize cron and any background services
    // initializeCronJob();
  });

  server.on("error", (error) => {
    console.error("Server error:", error);
    process.exit(1);
  });

  process.on("uncaughtException", async (error) => {
    console.error("Uncaught Exception:", error);
    // TODO: Send critical error email to admin using emailService
    process.exit(1);
  });

  process.on("unhandledRejection", async (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    // TODO: Send unhandled rejection email to admin using emailService
  });
};
