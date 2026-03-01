import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import UserModel from "../models/UserModel.js";

// Protect — verify JWT token and attach req.user
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await UserModel.findById(decoded.id).select("-password");
    if (!req.user) {
      res.status(401);
      throw new Error("User not found");
    }
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, invalid token");
  }
});

// Admin only
export const adminOnly = asyncHandler(async (req, res, next) => {
  if (req.user?.role !== "admin") {
    res.status(403);
    throw new Error("Access denied — admins only");
  }
  next();
});
