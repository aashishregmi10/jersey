import asyncHandler from "express-async-handler";
import ProductModel from "../models/ProductModel.js";

// @desc    Get all products (with optional filters)
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const { team, league, search, page = 1, limit = 12 } = req.query;

  const filter = { isActive: true };
  if (team) filter.team = { $regex: team, $options: "i" };
  if (league) filter.league = { $regex: league, $options: "i" };
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { team: { $regex: search, $options: "i" } },
    ];
  }

  const total = await ProductModel.countDocuments(filter);
  const products = await ProductModel.find(filter)
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    products,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit)),
    total,
  });
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
  const product = await ProductModel.findById(req.params.id);
  if (!product || !product.isActive) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json({ success: true, product });
});

// @desc    Create a product (admin)
// @route   POST /api/products
// @access  Admin
export const createProduct = asyncHandler(async (req, res) => {
  const { name, team, league, description, price, discountPrice, sizes, stock } = req.body;

  const product = await ProductModel.create({
    name,
    team,
    league,
    description,
    price,
    discountPrice,
    sizes,
    stock,
    createdBy: req.user._id,
  });

  res.status(201).json({ success: true, product });
});

// @desc    Update a product (admin)
// @route   PUT /api/products/:id
// @access  Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await ProductModel.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  Object.assign(product, req.body);
  const updated = await product.save();

  res.json({ success: true, product: updated });
});

// @desc    Delete a product (soft delete — admin)
// @route   DELETE /api/products/:id
// @access  Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await ProductModel.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  product.isActive = false;
  await product.save();

  res.json({ success: true, message: "Product removed" });
});

// @desc    Add a review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await ProductModel.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );
  if (alreadyReviewed) {
    res.status(400);
    throw new Error("You have already reviewed this product");
  }

  product.reviews.push({ user: req.user._id, name: req.user.name, rating: Number(rating), comment });
  product.numReviews = product.reviews.length;
  product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

  await product.save();
  res.status(201).json({ success: true, message: "Review added" });
});
