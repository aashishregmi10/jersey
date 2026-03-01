import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import cors from "cors";

import { connectDB } from "./config/db.config.js";
import { getCorsOptions } from "./config/cors.config.js";
import {
  ERROR_HANDLER,
  NOT_FOUND_HANDLER,
} from "./middlewares/errorMiddleware.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// ── Connect to MongoDB ────────────────────────────────────────────────────────
await connectDB();

// ── Express app ───────────────────────────────────────────────────────────────
const app = express();
const server = http.createServer(app);

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors(getCorsOptions()));

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/", (_, res) => {
  res.json({
    message: "Jersey Pasal API running 🏃‍♂️",
    env: process.env.NODE_ENV,
  });
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// ── Error handlers ────────────────────────────────────────────────────────────
app.use(NOT_FOUND_HANDLER);
app.use(ERROR_HANDLER);

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`,
  );
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error.message);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error.message);
});
