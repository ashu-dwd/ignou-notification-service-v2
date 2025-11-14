/**
 * Notification Service (ESM) — Handles scraping, parsing, and saving notifications.
 * Contains business logic for fetching and formatting announcements.
 */
import axios from "axios";
import * as cheerio from "cheerio";
import { notificationContent as Notification } from "../models/content.js";
import logger from "../utils/logger.js";

const BASE_URL = "https://www.ignou.ac.in/announcements/0?nav=6";
const REQUEST_TIMEOUT = 10000;
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";

/**
 * Clean and format text content from modal
 */
const cleanModalText = (rawText) => {
  return rawText
    .replace(/\s{2,}/g, " ")
    .replace(/\n\s*\n+/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      if (/notification/i.test(line)) return `- Notification: ${line}`;
      if (/annexure\s*1/i.test(line))
        return `- Annexure 1: ${line.replace(/annexure\s*1/i, "").trim()}`;
      if (/annexure\s*2/i.test(line))
        return `- Annexure 2: ${line.replace(/annexure\s*2/i, "").trim()}`;
      return line;
    })
    .join("\n");
};

/**
 * Extract links from modal content
 */
const extractModalLinks = ($, modal, baseUrl) => {
  const links = [];
  modal.find(".modal-body a").each((_, a) => {
    const text = $(a).text().trim();
    const href = $(a).attr("href");
    if (href) {
      const absoluteUrl = new URL(href, baseUrl).href;
      links.push(`- ${text}: [${absoluteUrl}]`);
    }
  });
  return links.length > 0 ? "\n\nAttachments:\n" + links.join("\n") : "";
};

/**
 * Process a single table row
 */
const processTableRow = ($, row, baseUrl) => {
  const tds = $(row).find("td");
  if (tds.length < 4) return null;

  const serial = $(tds[0]).text().trim();
  const issued_by = $(tds[1]).text().trim();
  const date = $(tds[3]).text().trim();
  const modalTarget = $(tds[2]).find("a").attr("data-bs-target");
  let description = "";

  if (modalTarget) {
    const modal = $(modalTarget.trim());
    if (modal.length) {
      const rawText = modal.find(".modal-body").text();
      description = cleanModalText(rawText);
      description += extractModalLinks($, modal, baseUrl);
    }
  }

  if (serial && issued_by && date && description) {
    return {
      title: issued_by,
      time: date,
      description,
      source: "IGNOU",
      scrapedAt: new Date(),
    };
  }
  return null;
};

/**
 * Checks if a notification already exists in the database
 * @param {Object} item - Notification item to check
 */
const checkNotificationExists = async (item) => {
  try {
    const exists = await Notification.findOne({
      title: item.title,
      description: item.description,
      time: item.time,
    });
    return !!exists;
  } catch (error) {
    logger.error(
      `Error checking notification existence (${item.title}): ${error.message}`
    );
    throw error;
  }
};

/**
 * Saves a new notification to the database and logs it
 * @param {Object} item - Notification item to save
 * @returns {Promise<Object>} - Saved notification
 */
const saveNewNotification = async (item) => {
  try {
    const notification = new Notification({
      ...item,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await notification.save();
    logger.info(
      `Notification saved: "${item.title}" (ID: ${notification._id})`
    );
    return notification;
  } catch (error) {
    logger.error(`Error saving notification (${item.title}): ${error.message}`);
    throw error;
  }
};

/**
 * Saves multiple notifications to the database, skipping duplicates
 * @param {Array} results - Array of notification items
 * @returns {Promise<Object>} - Result object with count and status
 */
export const saveNotification = async (results) => {
  if (!Array.isArray(results) || results.length === 0) {
    logger.info("No notifications provided to save");
    return { success: true, newCount: 0, message: "No notifications provided" };
  }

  try {
    logger.info(`Processing ${results.length} notifications for saving`);
    let newCount = 0;
    const savedNotifications = [];

    await Promise.all(
      results.map(async (item) => {
        try {
          const exists = await checkNotificationExists(item);
          if (!exists) {
            const saved = await saveNewNotification(item);
            newCount++;
            savedNotifications.push(saved);
          } else {
            logger.debug(`Duplicate notification skipped: ${item.title}`);
          }
        } catch (error) {
          logger.error(
            `Error processing notification item (${item.title}): ${error.message}`
          );
        }
      })
    );

    if (newCount === 0) {
      const message = "No new notifications found";
      logger.info(message);
      return { success: true, newCount: 0, message };
    }

    const message = `Saved ${newCount} new notification(s)`;
    logger.info(message);
    return {
      success: true,
      newCount,
      message,
      notifications: savedNotifications,
    };
  } catch (error) {
    logger.error("Error in saveNotification:", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to save notifications",
    };
  }
};

/**
 * Fetch, parse, and save IGNOU announcements
 */
export const fetchTableNotifications = async () => {
  try {
    logger.info("Starting IGNOU announcements scrape");
    const response = await axios.get(BASE_URL, {
      timeout: REQUEST_TIMEOUT,
      headers: { "User-Agent": USER_AGENT },
    });
    const $ = cheerio.load(response.data);
    const results = [];

    $("#announcement tbody tr").each((_, row) => {
      try {
        const notification = processTableRow($, row, BASE_URL);
        if (notification) {
          results.push(notification);
        }
      } catch (rowError) {
        logger.error("Error processing table row:", rowError);
      }
    });

    logger.info(`Found ${results.length} valid announcements`);

    // Save and log notifications after scrape
    const saveResult = await saveNotification(results);

    return { scraped: results, saveResult };
  } catch (error) {
    logger.error("Failed to scrape IGNOU announcements:", error);
    throw new Error(`Scraping failed: ${error.message}`);
  }
};
