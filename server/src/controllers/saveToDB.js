const notificationContent = require("../models/content");
const logger = require("../utils/logger");

/**
 * Checks if a notification already exists in the database
 * @param {Object} item - Notification item to check
 * @returns {Promise<boolean>} - Whether the notification exists
 */
const checkNotificationExists = async (item) => {
  try {
    const exists = await notificationContent.findOne({
      title: item.title,
      description: item.description,
      time: item.time,
    });
    return !!exists;
  } catch (error) {
    logger.error("Error checking notification existence:", {
      error: error.message,
      notification: item.title,
    });
    throw error;
  }
};

/**
 * Saves a new notification to the database
 * @param {Object} item - Notification item to save
 * @returns {Promise<Object>} - Saved notification
 */
const saveNewNotification = async (item) => {
  try {
    const notification = new notificationContent({
      ...item,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await notification.save();
    logger.info("Notification saved successfully", {
      title: item.title,
      id: notification._id,
    });
    return notification;
  } catch (error) {
    logger.error("Error saving notification:", {
      error: error.message,
      notification: item.title,
    });
    throw error;
  }
};

/**
 * Saves multiple notifications to the database, skipping duplicates
 * @param {Array} results - Array of notification items
 * @returns {Promise<Object>} - Result object with count and status
 */
const saveNotification = async (results) => {
  if (!Array.isArray(results) || results.length === 0) {
    logger.info("No notifications provided to save");
    return { success: true, newCount: 0, message: "No notifications provided" };
  }

  try {
    logger.info(`Processing ${results.length} notifications for saving`);
    let newCount = 0;
    const savedNotifications = [];

    // Process notifications in parallel for better performance
    await Promise.all(
      results.map(async (item) => {
        try {
          const exists = await checkNotificationExists(item);
          if (!exists) {
            const saved = await saveNewNotification(item);
            newCount++;
            savedNotifications.push(saved);
          } else {
            logger.debug("Duplicate notification skipped", {
              title: item.title,
            });
          }
        } catch (error) {
          logger.error("Error processing notification item:", {
            error: error.message,
            notification: item.title,
          });
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
    logger.error("Error in saveNotification:", {
      error: error.message,
      stack: error.stack,
    });
    return {
      success: false,
      error: error.message,
      message: "Failed to save notifications",
    };
  }
};

module.exports = { saveNotification };
