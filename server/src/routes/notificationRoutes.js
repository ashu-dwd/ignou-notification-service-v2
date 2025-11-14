/**
 * Notification Routes (ESM) — Resource-based endpoints, imports controllers only.
 */
import { Router } from "express";
import {
  scrapeNotifications,
  healthCheck,
  status,
  getAllNotificationsFromDB,
} from "../controllers/notificationController.js";

const router = Router();

router.get("/scrape", scrapeNotifications);
router.get("/health", healthCheck);
router.get("/status", status);
router.get("/all", getAllNotificationsFromDB);

export default router;
