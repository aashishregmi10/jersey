import asyncHandler from "express-async-handler";
import UserModel from "../models/UserModel.js";
import OrderModel from "../models/OrderModel.js";
import ProductModel from "../models/ProductModel.js";

// @desc    Dashboard stats
// @route   GET /api/admin/stats
// @access  Admin
export const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalOrders, totalProducts, revenueResult] = await Promise.all([
    UserModel.countDocuments({ role: "customer" }),
    OrderModel.countDocuments(),
    ProductModel.countDocuments({ isActive: true }),
    OrderModel.aggregate([
      { $match: { status: { $in: ["delivered", "processing", "shipped"] } } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]),
  ]);

  const totalRevenue = revenueResult[0]?.total || 0;

  res.json({
    success: true,
    stats: { totalUsers, totalOrders, totalProducts, totalRevenue },
  });
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await UserModel.find().select("-password").sort({ createdAt: -1 });
  res.json({ success: true, users });
});

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/toggle
// @access  Admin
export const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  user.isActive = !user.isActive;
  await user.save();
  res.json({ success: true, user });
});
