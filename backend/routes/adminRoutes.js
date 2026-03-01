import express from "express";
import {
  getDashboardStats,
  getAllUsers,
  toggleUserStatus,
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/stats", getDashboardStats);
router.get("/users", getAllUsers);
router.put("/users/:id/toggle", toggleUserStatus);

export default router;
