/**
 * Recipient Routes (ESM) — Handles all recipient/subscription/email endpoints.
 */
import { Router } from "express";
import {
  addEmail,
  addEmails,
  deleteEmail,
  getEmails,
  sendBulkEmail,
  sendEmailToRecipient,
} from "../controllers/recipientController.js";

const router = Router();

router.post("/add-email", addEmail);
router.post("/add-emails", addEmails);
router.post("/delete-email", deleteEmail);
router.get("/emails", getEmails);
router.post("/send-bulk-email", sendBulkEmail);
router.post("/send-email", sendEmailToRecipient);

export default router;
