/**
 * Main Server Entry (ESM)
 * Loads environment, ensures DB ready, and starts the HTTP server.
 *
 * NOTE: This file and all dependencies use ESM (import/export).
 * For Node.js, ensure you have "type": "module" in package.json
 * or use .mjs extension for this entrypoint!
 */
import "dotenv/config.js";
import "./src/config/database.js";
import { startServer } from "./src/app/server.js";

import { initializeCronJob } from "./src/services/cronService.js";

// Start HTTP server + scheduler
startServer();
initializeCronJob();
