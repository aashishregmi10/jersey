import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true },
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    team: {
      type: String,
      required: [true, "Team name is required"],
      trim: true,
    },
    league: { type: String, default: "FIFA World Cup 2026" },
    description: { type: String, default: "" },
    price: { type: Number, required: [true, "Price is required"], min: 0 },
    discountPrice: { type: Number, default: null },
    images: [
      {
        publicId: { type: String },
        url: { type: String },
      },
    ],
    sizes: [{ type: String, enum: ["XS", "S", "M", "L", "XL", "XXL"] }],
    stock: { type: Number, required: true, default: 0, min: 0 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [reviewSchema],
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;
