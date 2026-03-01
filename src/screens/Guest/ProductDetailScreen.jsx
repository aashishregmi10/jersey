import { useEffect, useState } from "react";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Rating,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { addItem, selectCartCount } from "store/cartSlice";
import useAuth from "hooks/useAuth";

const API = import.meta.env.VITE_API_URL;

const ProductDetailScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartCount);
  const { token, isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API}/products/${id}`);
        setProduct(data.product);
        setSelectedSize(data.product.sizes?.[0] ?? "");
      } catch {
        toast.error("Failed to load product");
        navigate("/shop");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.warning("Please select a size");
      return;
    }
    dispatch(addItem({ ...product, size: selectedSize }));
    toast.success(`${product.name} (${selectedSize}) added to cart!`);
  };

  const handleSubmitReview = async () => {
    if (!rating) { toast.warning("Please select a rating"); return; }
    if (!comment.trim()) { toast.warning("Please enter a comment"); return; }
    if (!isAuthenticated) { toast.info("Please sign in to leave a review"); navigate("/sign-in"); return; }

    setReviewLoading(true);
    try {
      await axios.post(
        `${API}/products/${id}/reviews`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Review submitted!");
      setRating(0);
      setComment("");
      // Refresh product
      const { data } = await axios.get(`${API}/products/${id}`);
      setProduct(data.product);
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Failed to submit review");
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 15 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!product) return null;

  const displayPrice = product.discountPrice ?? product.price;
  const hasDiscount = !!product.discountPrice;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f6fa" }}>
      {/* ── Navbar ── */}
      <Box
        sx={{
          bgcolor: "#0a1929",
          px: { xs: 2, md: 4 },
          py: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          <SportsSoccerIcon sx={{ color: "#FFD700" }} />
          <Typography variant="h6" fontWeight={700} color="white">
            Jersey Pasal
          </Typography>
        </Box>
        <IconButton sx={{ color: "white" }} onClick={() => navigate("/cart")}>
          <Badge badgeContent={cartCount} color="error">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      </Box>

      <Container sx={{ py: 4 }}>
        {/* ── Back ── */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/shop")}
          sx={{ mb: 3 }}
        >
          Back to Shop
        </Button>

        <Grid container spacing={5}>
          {/* ── Images ── */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                bgcolor: "white",
                boxShadow: 2,
              }}
            >
              {product.images?.length > 0 ? (
                <>
                  <Box
                    component="img"
                    src={product.images[selectedImage]?.url}
                    alt={product.name}
                    sx={{
                      width: "100%",
                      height: 400,
                      objectFit: "cover",
                    }}
                  />
                  {product.images.length > 1 && (
                    <Stack direction="row" spacing={1} p={1}>
                      {product.images.map((img, idx) => (
                        <Box
                          key={idx}
                          component="img"
                          src={img.url}
                          sx={{
                            width: 64,
                            height: 64,
                            objectFit: "cover",
                            borderRadius: 1,
                            cursor: "pointer",
                            border:
                              selectedImage === idx
                                ? "2px solid #1976d2"
                                : "2px solid transparent",
                          }}
                          onClick={() => setSelectedImage(idx)}
                        />
                      ))}
                    </Stack>
                  )}
                </>
              ) : (
                <Box
                  sx={{
                    height: 400,
                    background: "linear-gradient(135deg,#0a1929 50%,#1565c0 50%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <SportsSoccerIcon sx={{ fontSize: 120, color: "rgba(255,255,255,0.3)" }} />
                </Box>
              )}
            </Box>
          </Grid>

          {/* ── Info ── */}
          <Grid item xs={12} md={6}>
            <Box sx={{ bgcolor: "white", borderRadius: 3, p: 3, boxShadow: 2 }}>
              <Chip label={product.league} size="small" sx={{ mb: 1 }} />
              <Typography variant="h4" fontWeight={800} gutterBottom>
                {product.name}
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {product.team}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <Rating value={product.rating} precision={0.5} readOnly size="small" />
                <Typography variant="body2" color="text.secondary">
                  ({product.numReviews} reviews)
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                {hasDiscount ? (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ textDecoration: "line-through" }}
                    >
                      Rs. {product.price.toLocaleString()}
                    </Typography>
                    <Typography variant="h4" color="error" fontWeight={800}>
                      Rs. {displayPrice.toLocaleString()}
                    </Typography>
                    <Chip
                      label={`${Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF`}
                      color="error"
                      size="small"
                    />
                  </Stack>
                ) : (
                  <Typography variant="h4" color="primary" fontWeight={800}>
                    Rs. {displayPrice.toLocaleString()}
                  </Typography>
                )}
              </Box>

              {product.description && (
                <Typography variant="body2" color="text.secondary" mb={2}>
                  {product.description}
                </Typography>
              )}

              <Divider sx={{ my: 2 }} />

              {/* Size selector */}
              {product.sizes?.length > 0 && (
                <Box mb={3}>
                  <Typography variant="subtitle2" fontWeight={700} mb={1}>
                    Size: <strong>{selectedSize}</strong>
                  </Typography>
                  <ToggleButtonGroup
                    value={selectedSize}
                    exclusive
                    onChange={(_, v) => v && setSelectedSize(v)}
                    size="small"
                  >
                    {product.sizes.map((s) => (
                      <ToggleButton key={s} value={s}>
                        {s}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                </Box>
              )}

              {/* Stock */}
              <Typography
                variant="body2"
                color={product.stock > 0 ? "success.main" : "error.main"}
                mb={2}
              >
                {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
              </Typography>

              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<AddShoppingCartIcon />}
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  fullWidth
                >
                  Add to Cart
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => {
                    handleAddToCart();
                    navigate("/cart");
                  }}
                  disabled={product.stock === 0}
                  fullWidth
                >
                  Buy Now
                </Button>
              </Stack>
            </Box>
          </Grid>
        </Grid>

        {/* ── Reviews ── */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Customer Reviews
          </Typography>

          {/* Write a review */}
          <Box sx={{ bgcolor: "white", borderRadius: 3, p: 3, boxShadow: 1, mb: 4 }}>
            <Typography variant="subtitle1" fontWeight={700} mb={2}>
              Write a Review
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 500 }}>
              <Rating
                value={rating}
                onChange={(_, v) => setRating(v)}
                size="large"
              />
              <TextField
                label="Your comment"
                multiline
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                fullWidth
              />
              <Button
                variant="contained"
                onClick={handleSubmitReview}
                disabled={reviewLoading}
                sx={{ alignSelf: "flex-start" }}
              >
                {reviewLoading ? "Submitting…" : "Submit Review"}
              </Button>
            </Box>
          </Box>

          {/* Review list */}
          {product.reviews.length === 0 ? (
            <Typography color="text.secondary">
              No reviews yet. Be the first!
            </Typography>
          ) : (
            <Stack spacing={2}>
              {product.reviews.map((r) => (
                <Box
                  key={r._id}
                  sx={{ bgcolor: "white", borderRadius: 3, p: 2.5, boxShadow: 1 }}
                >
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Avatar sx={{ bgcolor: "#1565c0" }}>
                      {r.name[0].toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography fontWeight={700}>{r.name}</Typography>
                      <Rating value={r.rating} readOnly size="small" />
                      <Typography variant="body2" color="text.secondary" mt={0.5}>
                        {r.comment}
                      </Typography>
                      <Typography variant="caption" color="text.disabled">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default ProductDetailScreen;
