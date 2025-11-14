/**
 * Email Templates Utility (ESM) — All notification/admin HTML templates as pure functions.
 */

export const noNewNotifications = () => `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2 style="color: #333;">Hey there! 👋</h2>
    <p>Just a heads up that there are no new notifications available on the IGNOU website yet. 😐</p>
    <p>Don't worry, I'll keep an eye on it and let you know as soon as something new comes up. Stay chill! 😎</p>
    <p>In the meantime, I'll just be here, sipping on some virtual coffee ☕️ and waiting for updates.</p>
    <p>Thanks for being patient! 🙏</p>
    <p>Your friendly IGNOU bot 🤖</p>
  </div>
`;

export const newNotification = (notification) => {
  const title = notification?.title || "New Notification";
  const description = notification?.description || "No description available";
  const time = notification?.time || new Date().toLocaleString();

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color: #4CAF50;">🎉 ${title} 🎉</h2>
      <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
        <p>${description}</p>
        <p><strong>Date:</strong> ${time}</p>
      </div>
      <p>Stay updated with us! We'll notify you of new updates.</p>
    </div>
  `;
};

export const adminSuccess = (recipientCount, notificationCount) => `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2 style="color: #4CAF50;">🎉 Notification Delivery Report 🎉</h2>
    <p>Great news! We've successfully delivered <strong>${notificationCount}</strong> notifications to <strong>${recipientCount}</strong> recipients. 🌟</p>
    <p>Thank you for entrusting us to keep everyone updated! 📬📢</p>
    <p>Best Regards,<br>Notification Team 🚀</p>
  </div>
`;

export const cronError = (error) => `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2 style="color: #f44336;">⚠️ Cron Job Failed</h2>
    <p>The scheduled notification check failed with the following error:</p>
    <div style="background: #ffeeee; padding: 10px; border-radius: 5px; margin: 10px 0;">
      <p><strong>Error:</strong> ${error.message}</p>
      <pre style="white-space: pre-wrap; overflow-x: auto;">${
        error.stack || "No stack trace available"
      }</pre>
    </div>
    <p>Please check the server logs for more details.</p>
  </div>
`;

export const criticalError = (error) => `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2 style="color: #f44336;">🚨 Server Critical Error</h2>
    <p>An uncaught exception occurred in the server:</p>
    <div style="background: #ffeeee; padding: 10px; border-radius: 5px; margin: 10px 0;">
      <pre style="white-space: pre-wrap; overflow-x: auto;">${
        error.stack || "No stack trace available"
      }</pre>
    </div>
    <p>The server may need to be restarted.</p>
  </div>
`;
