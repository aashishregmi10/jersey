import asyncHandler from "express-async-handler";
import OrderModel from "../models/OrderModel.js";

// @desc    Place a new order
// @route   POST /api/orders
// @access  Private
export const placeOrder = asyncHandler(async (req, res) => {
  const {
    items,
    shippingAddress,
    paymentMethod,
    subTotal,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error("No order items");
  }

  const order = await OrderModel.create({
    user: req.user._id,
    items,
    shippingAddress,
    paymentMethod,
    subTotal,
    shippingPrice,
    totalPrice,
  });

  res.status(201).json({ success: true, order });
});

// @desc    Get my orders
// @route   GET /api/orders/mine
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await OrderModel.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate("items.product", "name team images");

  res.json({ success: true, orders });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await OrderModel.findById(req.params.id).populate(
    "user",
    "name email",
  );

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Only owner or admin
  if (
    order.user._id.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized");
  }

  res.json({ success: true, order });
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await OrderModel.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }

  if (["shipped", "delivered"].includes(order.status)) {
    res.status(400);
    throw new Error("Cannot cancel a shipped or delivered order");
  }

  order.status = "cancelled";
  order.cancelledAt = Date.now();
  order.cancelReason = req.body.reason || "Cancelled by customer";
  await order.save();

  res.json({ success: true, order });
});

// ── ADMIN ──────────────────────────────────────────────────────────────────────

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Admin
export const getAllOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const filter = status ? { status } : {};

  const total = await OrderModel.countDocuments(filter);
  const orders = await OrderModel.find(filter)
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit));

  res.json({
    success: true,
    orders,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
  });
});

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
// @access  Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await OrderModel.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.status = status;
  if (status === "delivered") {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
  }

  await order.save();
  res.json({ success: true, order });
});
