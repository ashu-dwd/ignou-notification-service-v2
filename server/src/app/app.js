/**
 * Express App Configuration Module (ESM)
 * Sets up and exports the configured Express application,
 * with all middleware and resource-based routers attached.
 */
import express from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import notificationRoutes from "../routes/notificationRoutes.js";
import recipientRoutes from "../routes/recipientRoutes.js";

const app = express();
// app.set("trust proxy", true);

// Security and performance middleware
app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again later",
});
app.use(limiter);

// Base URL helper middleware
app.use((req, res, next) => {
  req.baseUrl = req.headers.host.includes("localhost")
    ? `http://${req.headers.host}`
    : `https://${req.headers.host}`;
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static logs route
app.use("/logs", express.static("logs"));

app.use("/api/notifications", notificationRoutes);
app.use("/api/recipients", recipientRoutes);

export default app;
