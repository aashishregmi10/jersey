/**
 * Run once to create the admin user:
 *   node backend/utils/seedAdmin.js
 */
import dns from "dns";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import mongoose from "mongoose";
import UserModel from "../models/UserModel.js";

// Use Google public DNS so mongodb+srv:// SRV lookups work
dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config({
  path: join(dirname(fileURLToPath(import.meta.url)), "../.env"),
});

const ADMIN_EMAIL = "admin@jerseypasal.com";
const ADMIN_PASSWORD = "Admin@1234";
const ADMIN_NAME = "Admin";

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ Connected to MongoDB");

  const existing = await UserModel.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    // Ensure admin role
    if (existing.role !== "admin") {
      existing.role = "admin";
      await existing.save();
      console.log("✅ Existing user promoted to admin");
    } else {
      console.log("ℹ️  Admin already exists — no changes made");
    }
  } else {
    await UserModel.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: "admin",
    });
    console.log("✅ Admin user created");
  }

  console.log("─────────────────────────────────────");
  console.log(`  Email    : ${ADMIN_EMAIL}`);
  console.log(`  Password : ${ADMIN_PASSWORD}`);
  console.log("─────────────────────────────────────");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
