/**
 * Recipient Controller (ESM) — Handles Express req/res for recipient/email endpoints.
 * Delegates all business and DB logic to services/models.
 */
// import recipientService from "../services/recipientService.js"; // Uncomment when service logic exists
// import logger from "../utils/logger.js"; // Uncomment when logger is ready

/**
 * Add a single email
 */
export const addEmail = async (req, res) => {
  try {
    const { email } = req.body;
    // Business logic must be delegated to a service, so this is placeholder only
    if (!email) return res.status(400).json({ error: "Email is required" });

    // Validate email format (quick client-side format check)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    // TODO: Call to service for add/notify/store (return result or error)
    // const result = await recipientService.addEmail(normalizedEmail);

    res.status(201).json({
      message: "Email added (service logic to be implemented)",
      email: normalizedEmail,
    });
  } catch (err) {
    res.status(500).json({
      error: "Server error",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

/**
 * Add multiple emails (bulk)
 */
export const addEmails = async (req, res) => {
  try {
    const { emails } = req.body;
    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ error: "Emails array is required" });
    }
    // Validate and normalize emails
    const validEmails = emails
      .map((e) => (typeof e === "string" ? e.toLowerCase().trim() : ""))
      .filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
    if (validEmails.length === 0) {
      return res.status(400).json({ error: "No valid emails provided" });
    }
    // TODO: Service logic goes here

    res.status(201).json({
      message: "Bulk email upload (service logic to be implemented)",
      added: validEmails.length,
      alreadyExist: 0,
      duplicatesInUpload: 0,
      invalidEmails: emails.length - validEmails.length,
    });
  } catch (err) {
    res.status(500).json({
      error: "Server error",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

/**
 * Delete email
 */
export const deleteEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });
    const normalizedEmail = email.toLowerCase().trim();
    // TODO: Service logic goes here

    res.status(200).json({
      message: "Email deleted (service logic to be implemented)",
      email: normalizedEmail,
    });
  } catch (err) {
    res.status(500).json({
      error: "Server error",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

/**
 * Get all emails
 */
export const getEmails = async (req, res) => {
  try {
    // TODO: Service logic goes here
    res.status(200).json([]);
  } catch (err) {
    res.status(500).json({
      error: "Server error",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

/**
 * Send bulk email
 */
export const sendBulkEmail = async (req, res) => {
  try {
    const { subject, message } = req.body;
    if (!subject || !message) {
      return res.status(400).json({
        error: "Subject and message are required",
      });
    }
    // TODO: Service logic goes here

    res.status(200).json({
      message: "Bulk email sent (service logic to be implemented)",
      totalRecipients: 0,
    });
  } catch (err) {
    res.status(500).json({
      error: "Server error",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

/**
 * Send single email
 */
export const sendEmailToRecipient = async (req, res) => {
  try {
    const { email, subject, message } = req.body;
    if (!email || !subject || !message) {
      return res.status(400).json({
        error: "Email, subject and message are required",
      });
    }
    // TODO: Service logic goes here

    res.status(200).json({
      message: "Email sent (service logic to be implemented)",
      email,
    });
  } catch (err) {
    res.status(500).json({
      error: "Server error",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};
