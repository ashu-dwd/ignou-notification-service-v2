/**
 * Cron Service (ESM) — Handles scheduled scraping, notifications, retries, and admin error reports.
 */
import cron from "node-cron";
import os from "os";
import { fetchTableNotifications } from "./notificationService.js";
import { sendEmail } from "./emailService.js";
// import CronHistory from "../models/cronHistory.js"; // ESM model imports when migrated
// import Recipient from "../models/recipients.js"; // ESM model imports when migrated
// import logger from "../utils/logger.js"; // Uncomment after logger conversion

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "raghavdwd@gmail.com";
const CRON_SCHEDULE = process.env.CRON_SCHEDULE || "0 9 * * *";
const MAX_EMAIL_RETRIES = 3;

export const initializeCronJob = () => {
  if (process.env.DISABLE_CRON !== "true") {
    cron.schedule(
      CRON_SCHEDULE,
      async () => {
        try {
          await runCronJob();
        } catch (error) {
          // logger.error("Unhandled error in cron execution:", error);
        }
      },
      {
        scheduled: true,
        timezone: "Asia/Kolkata",
      }
    );
    // logger.info(`Cron job scheduled with pattern: ${CRON_SCHEDULE}`);
  } else {
    // logger.info("Cron jobs are disabled (DISABLE_CRON=true)");
  }
};

/**
 * Send notification emails with retries
 */
export const sendNotificationEmails = async (emails, subject, htmlContent) => {
  let attempts = 0;
  let lastError = null;
  while (attempts < MAX_EMAIL_RETRIES) {
    try {
      attempts++;
      const resp = await sendEmail(emails, subject, htmlContent, true);
      // logger.info(`Email sent to ${emails.length} recipients (attempt ${attempts})`);
      return resp;
    } catch (error) {
      lastError = error;
      // logger.warn(`Failed to send email (attempt ${attempts}): ${error.message}`);
      if (attempts < MAX_EMAIL_RETRIES) {
        const delay = Math.pow(2, attempts) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError || new Error("Failed to send emails after maximum retries");
};

/**
 * Main cron job function
 */
export const runCronJob = async () => {
  const startTime = Date.now();
  // logger.info("Starting cron job: scrapeNotifications");

  // TODO: Check MongoDB connection/readiness if needed

  try {
    const result = await fetchTableNotifications();
    // logger.info("Fetched notifications:", result);

    if (!result) {
      // logger.warn("Cron job returned no result");
      // await CronHistory.create({ status: "completed", message: "No result returned from scraper", timestamp: new Date() });
      return;
    }

    // If result is just a string message
    if (
      typeof result === "string" ||
      (result.message && !result.notifications)
    ) {
      // logger.info("Cron job message:", result.message || result);
      // await CronHistory.create({ ... });
      // Find recipients
      // const recipients = await Recipient.find({}, "email -_id");
      // const emails = recipients.map((r) => r.email);

      // if (emails.length > 0) {
      //   await sendNotificationEmails(emails, "📣 IGNOU: No new notifications yet! 😐", "<p>No new notifications</p>");
      // }

      return;
    }

    // If result has notifications
    if (result.notifications && Array.isArray(result.notifications)) {
      // logger.info(`Found ${result.notifications.length} new notifications`);
      // await CronHistory.create({ ... });

      // const recipients = await Recipient.find({}, "email -_id");
      // const emails = recipients.map((r) => r.email);

      // if (emails.length === 0) return;

      // for (const notification of result.notifications) {
      //   if (!notification?.title) continue;
      //   await sendNotificationEmails(emails, `📢 IGNOU: ${notification.title}`, htmlTemplate(notification));
      // }

      // await sendEmail(ADMIN_EMAIL, "🎉 IGNOU: Notifications Successfully Sent", "<p>Summary...</p>");
      return;
    }

    // Unexpected result format
    // logger.warn("Unexpected result format from scraper", result);
    // await CronHistory.create({ ... });
  } catch (error) {
    // logger.error("Cron job failed:", error);
    await handleCronError(error);
  }
};

/**
 * Handle cron job errors and notify admin
 */
const handleCronError = async (error) => {
  try {
    // await CronHistory.create({ status: "failed", message: error.message, stackTrace: error.stack, timestamp: new Date() });
    await sendEmail(
      ADMIN_EMAIL,
      "⚠️ IGNOU: Cron Job Failed",
      `<pre>${error.message}</pre><pre>${
        error.stack || "No stack trace available"
      }</pre>`
    );
  } catch (dbError) {
    // logger.error("Failed to handle cron error:", dbError);
    // logger.error("Original cron error:", error);
  }
};
