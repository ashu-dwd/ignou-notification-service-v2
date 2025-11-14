/**
 * Notification Controller (ESM) — Handles Express req/res for notification endpoints.
 * Delegates all business logic to services.
 */
import { notificationContent } from "../models/content.js";
// IMPORT SCRAPING SERVICE from new core location:
import { fetchTableNotifications } from "../services/notificationService.js";
// import logger from "../utils/logger.js"; // Uncomment when logger is ready

/**
 * GET /api/notifications/scrape — Trigger a notification scrape
 */
export const scrapeNotifications = async (req, res) => {
  try {
    const result = await fetchTableNotifications();
    // logger.info("Successfully scraped notifications via HTTP");
    res.status(200).json(result);
  } catch (error) {
    // logger.error("HTTP notification scrape failed:", error);
    res.status(500).json({
      error: "Error scraping notifications",
      details: error.message,
    });
  }
};

export const getAllNotificationsFromDB = async (req, res) => {
  try {
    const result = await notificationContent.find({});
    // console.log(result);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      error: "Error scraping notifications",
      details: error.message,
    });
  }
};
// console.log(getAllNotificationsFromDB("test", 1));
/**
 * Health check endpoint
 */
export const healthCheck = async (req, res) => {
  try {
    // If you want DB/connection status, import from config/database.js
    // const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
    res.json({
      status: "up",
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      timestamp: new Date().toISOString(),
      // database: dbStatus,
    });
  } catch (error) {
    // logger.error("Health check failed:", error);
    res.status(500).json({
      status: "partial",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Status endpoint
 */
export const status = (req, res) => {
  res.json({
    status: "up",
    timestamp: new Date().toISOString(),
  });
};
