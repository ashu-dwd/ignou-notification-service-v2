/**
 * Email Service (ESM) — Handles sending emails using transporter and templates.
 * All error handling, logging, and retry logic lives here. Pure business logic.
 */
import transporter, { validateEmailConfig } from "../config/mailer.js";
// import logger from "../utils/logger.js"; // Uncomment when logger logic is moved to ESM
// import { renderTemplate } from "../utils/emailTemplates.js"; // If templating helpers are added

/**
 * Send email with optional HTML content
 * @param {string|string[]} recipients - email address or array of emails
 * @param {string} subject
 * @param {string} content - HTML or plain text
 * @param {boolean} isHTML
 * @returns {Promise<boolean>} - true if sent, false if error
 */
export const sendEmail = async (
  recipients,
  subject,
  content,
  isHTML = true
) => {
  try {
    validateEmailConfig();

    const htmlFooter = `
      <hr>
      <p style="font-size: 12px; color: gray;">
        You are receiving this notification from IGNOU AutoNotifier.
        If you no longer wish to receive these emails, reply with "UNSUBSCRIBE".
      </p>
    `;

    const mailOptions = {
      from: `"IGNOU Notifications" <${process.env.EMAIL_USER}>`,
      to: Array.isArray(recipients) ? recipients.join(", ") : recipients,
      subject,
      text: isHTML ? (content + htmlFooter).replace(/<[^>]*>/g, "") : content,
      ...(isHTML ? { html: content + htmlFooter } : {}),
      replyTo: process.env.EMAIL_USER,
    };

    // logger.info(`Attempting to send email to: ${mailOptions.to}`);
    const info = await transporter.sendMail(mailOptions);

    // logger.info(`Email sent successfully to ${mailOptions.to}`, {
    //   messageId: info.messageId,
    //   subject,
    // });

    return true;
  } catch (error) {
    // logger.error('Failed to send email:', {
    //   error: error.message,
    //   recipients: Array.isArray(recipients) ? recipients : [recipients],
    //   subject,
    // });

    return false;
  }
};
