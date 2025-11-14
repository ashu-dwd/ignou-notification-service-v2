const express = require("express");
const router = express.Router();
const Recipient = require("../models/recipients");
const sendEmail = require("../utils/mailSender");
const { runCronJob } = require("../../index"); // Make sure this is exported correctly from index.js

const PRIVACY_POLICY = `
# Privacy Policy - IGNOU Notification Service

## How We Use Your Email Address

Your email address is used **exclusively** for sending IGNOU-related notifications including exam schedules, result announcements, assignment deadlines, and other important academic updates. We do not use your email for any marketing, promotional, or commercial purposes.

## Data Protection & Security

We take your privacy seriously. Your email address is stored securely and encrypted. We do not share, sell, or rent your personal information to any third parties. Our service is completely free, and we have no commercial interests in your data.

## What You Can Expect

- **Relevant notifications only**: You'll receive 2-3 emails per week during active academic periods
- **Official sources**: All information comes from official IGNOU websites and announcements
- **Direct links**: Every notification includes links to official IGNOU pages for verification
- **No spam guarantee**: We never send promotional emails, advertisements, or unrelated content

## Your Control Over Notifications

- **Easy unsubscribe**: Every email contains a one-click unsubscribe link
- **Immediate removal**: Unsubscribing removes your email from our system within 24 hours
- **No questions asked**: You can unsubscribe anytime without providing a reason

## Service Transparency

This is an **unofficial service** created by a fellow IGNOU student (Raghav Dwivedi) to help the student community. We are not affiliated with IGNOU university. Our goal is simply to ensure students don't miss important updates.

## Data Retention

We only keep your email address for as long as you remain subscribed. When you unsubscribe, your data is permanently deleted from our systems within 48 hours.

## Contact & Support

If you have any questions about our privacy practices or need help with your subscription:
- Email: raghavdwd@gmail.com
- Telegram: @raghavdwd

**Note**: This service is provided free of cost by a student, for students. We are committed to maintaining your privacy and trust.

---

*By staying subscribed, you acknowledge that this is an unofficial notification service and that all official information should be verified from IGNOU's official channels.*
`;

// Add a single email
router.post("/add-email", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if already exists
    const exists = await Recipient.findOne({ email: normalizedEmail });
    if (exists) return res.status(409).json({ error: "Email already exists" });

    // Send welcome email
    const emailSent = await sendEmail(
      normalizedEmail,
      "IGNOU Notification Subscribed Successfully",
      PRIVACY_POLICY
    );

    if (!emailSent) {
      return res
        .status(500)
        .json({ error: "Failed to send confirmation email" });
    }

    // Notify admin
    const totalSubscribers = await Recipient.countDocuments();
    await sendEmail(
      "raghavdwd@gmail.com",
      "New IGNOU Notification Subscriber",
      `${normalizedEmail} has subscribed to IGNOU Notification Service.\nTotal Subscribers: ${
        totalSubscribers + 1
      }`
    );

    // Save to database
    const recipient = new Recipient({ email: normalizedEmail });
    await recipient.save();

    res.status(201).json({
      message: "Email added successfully",
      email: recipient.email,
    });
  } catch (err) {
    console.error("Error in /add-email:", err);
    res.status(500).json({
      error: "Server error",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// Add multiple emails (bulk upload)
router.post("/add-emails", async (req, res) => {
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

    // Get existing emails
    const existing = await Recipient.find({
      email: { $in: validEmails },
    }).select("email");
    const existingEmails = existing.map((e) => e.email);

    // Filter new emails
    const newEmails = validEmails.filter((e) => !existingEmails.includes(e));

    // Bulk insert
    if (newEmails.length > 0) {
      await Recipient.insertMany(newEmails.map((email) => ({ email })));
    }

    res.status(201).json({
      message: "Bulk email upload complete",
      added: newEmails.length,
      alreadyExist: existingEmails.length,
      duplicatesInUpload: validEmails.length - newEmails.length,
      invalidEmails: emails.length - validEmails.length,
    });
  } catch (err) {
    console.error("Error in /add-emails:", err);
    res.status(500).json({
      error: "Server error",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// Delete email
router.post("/delete-email", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const normalizedEmail = email.toLowerCase().trim();
    const recipient = await Recipient.findOneAndDelete({
      email: normalizedEmail,
    });

    if (!recipient) {
      return res.status(404).json({ error: "Email not found" });
    }

    // Send confirmation email
    await sendEmail(
      normalizedEmail,
      "IGNOU Notification Unsubscribed Successfully",
      "You have been successfully unsubscribed from IGNOU notifications.\n\nWe hope to see you again soon!"
    );

    res.status(200).json({
      message: "Email deleted successfully",
      email: normalizedEmail,
    });
  } catch (err) {
    console.error("Error in /delete-email:", err);
    res.status(500).json({
      error: "Server error",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// Get all emails
router.get("/emails", async (req, res) => {
  try {
    const recipients = await Recipient.find().select("email -_id");
    res.status(200).json(recipients.map((r) => r.email));
  } catch (err) {
    console.error("Error in /emails:", err);
    res.status(500).json({
      error: "Server error",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// Send bulk email
router.post("/send-bulk-email", async (req, res) => {
  try {
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({
        error: "Subject and message are required",
      });
    }

    const recipients = await Recipient.find().select("email -_id");
    if (recipients.length === 0) {
      return res.status(404).json({ error: "No recipients found" });
    }

    const emails = recipients.map((r) => r.email);
    const sendResults = await Promise.all(
      emails.map((email) =>
        sendEmail(email, subject, message)
          .then((success) => ({ email, success }))
          .catch((err) => ({ email, success: false, error: err.message }))
      )
    );

    const failedEmails = sendResults.filter((r) => !r.success);

    if (failedEmails.length > 0) {
      return res.status(207).json({
        message: "Some emails failed to send",
        totalRecipients: emails.length,
        successful: emails.length - failedEmails.length,
        failed: failedEmails.length,
        failedEmails: failedEmails.map((f) => ({
          email: f.email,
          error: f.error,
        })),
      });
    }

    res.status(200).json({
      message: "Bulk email sent successfully",
      totalRecipients: emails.length,
    });
  } catch (err) {
    console.error("Error in /send-bulk-email:", err);
    res.status(500).json({
      error: "Server error",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// Send single email
router.post("/send-email", async (req, res) => {
  try {
    const { email, subject, message } = req.body;

    if (!email || !subject || !message) {
      return res.status(400).json({
        error: "Email, subject and message are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const recipient = await Recipient.findOne({ email: normalizedEmail });

    if (!recipient) {
      return res.status(404).json({ error: "Recipient not found" });
    }

    const sent = await sendEmail(normalizedEmail, subject, message);

    if (!sent) {
      return res.status(500).json({ error: "Failed to send email" });
    }

    res.status(200).json({
      message: "Email sent successfully",
      email: normalizedEmail,
    });
  } catch (err) {
    console.error("Error in /send-email:", err);
    res.status(500).json({
      error: "Server error",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// Run cron job manually
router.get("/run-cron", async (req, res) => {
  try {
    if (!runCronJob || typeof runCronJob !== "function") {
      throw new Error("Cron job function not available");
    }

    await runCronJob();
    res.status(200).json({
      message: "Cron job executed successfully",
    });
  } catch (err) {
    console.error("Error in /run-cron:", err);
    res.status(500).json({
      error: "Failed to run cron job",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

module.exports = router;
