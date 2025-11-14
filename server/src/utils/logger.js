/**
 * Logger Utility (ESM)
 * Uses winston for consistent, timestamped, file & console logging.
 * Exports as default for use with ESM imports.
 */
import { createLogger, transports, format } from "winston";

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(
      (info) => `${info.timestamp} ${info.level.toUpperCase()}: ${info.message}`
    )
  ),
  transports: [
    new transports.File({ filename: "logs/cron.log" }),
    new transports.Console(),
  ],
});

export default logger;
