const nodemailer = require('nodemailer');
const logger = require('./logger');
require('dotenv').config();

// Constants
const EMAIL_CONFIG = {
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD // Use App Password if 2FA is enabled
    }
};

// Validate required environment variables
const validateEmailConfig = () => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        throw new Error('Email configuration is incomplete. Please set EMAIL_USER and EMAIL_PASSWORD in your environment variables.');
    }
};

// Create reusable transporter object
const transporter = nodemailer.createTransport(EMAIL_CONFIG);

// Verify transporter connection
const verifyTransporter = async () => {
    try {
        await transporter.verify();
        logger.info('Email transporter is ready to send messages');
        return true;
    } catch (error) {
        logger.error('Error verifying email transporter:', error);
        throw new Error('Failed to verify email transporter');
    }
};

/**
 * Send email with optional HTML content
 */
const sendEmail = async (recipients, subject, content, isHTML = true) => {
    console.log(recipients);
    console.log(subject);

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
            to: Array.isArray(recipients) ? recipients.join(', ') : recipients,
            subject,
            text: isHTML ? (content + htmlFooter).replace(/<[^>]*>/g, '') : content, // quick fallback strip
            ...(isHTML ? { html: content + htmlFooter } : {}),
            replyTo: process.env.EMAIL_USER
        };

        logger.info(`mail sender: Attempting to send email to: ${mailOptions.to}`);
        const info = await transporter.sendMail(mailOptions);

        logger.info(`mail sender:Email sent successfully to ${mailOptions.to}`, {
            messageId: info.messageId,
            subject
        });

        return true;
    } catch (error) {
        logger.error('Failed to send email:', {
            error: error.message,
            recipients: Array.isArray(recipients) ? recipients : [recipients],
            subject
        });

        return false;
    }
};

// Verify transporter on startup
if (process.env.NODE_ENV !== 'test') {
    verifyTransporter().catch(error => {
        logger.error('Email service initialization failed:', error);
    });
}

module.exports = sendEmail;
