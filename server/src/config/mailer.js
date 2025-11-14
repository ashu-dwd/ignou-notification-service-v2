/**
 * Nodemailer Transporter Configuration Module (ESM)
 * Sets up and exports a configured nodemailer transporter.
 */
import nodemailer from "nodemailer";

export const EMAIL_CONFIG = {
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, // Use App Password if 2FA is enabled
  },
};

export const validateEmailConfig = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    throw new Error(
      "Email configuration is incomplete. Please set EMAIL_USER and EMAIL_PASSWORD in your environment variables."
    );
  }
};

const transporter = nodemailer.createTransport(EMAIL_CONFIG);

export const verifyTransporter = async () => {
  try {
    await transporter.verify();
    // Logging is now handled elsewhere in the app, so keep it silent here
    return true;
  } catch (error) {
    throw new Error("Failed to verify email transporter: " + error.message);
  }
};

export default transporter;
