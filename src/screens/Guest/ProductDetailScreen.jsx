import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  Rating,
  Stack,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import PrintIcon from "@mui/icons-material/Print";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { addItem } from "store/cartSlice";
import useAuth from "hooks/useAuth";
import JerseyCustomizer from "components/JerseyCustomizer";

const API = import.meta.env.VITE_API_URL;
const CUSTOMIZATION_FEE = 200;

const ProductDetailScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  // Customization state
  const [customizeEnabled, setCustomizeEnabled] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [playerNumber, setPlayerNumber] = useState("");

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

  const hasCustomization = !!(playerName.trim() || playerNumber);
  const customizationPrice =
    customizeEnabled && hasCustomization ? CUSTOMIZATION_FEE : 0;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.warning("Please select a size");
      return;
    }
    dispatch(
      addItem({
        ...product,
        size: selectedSize,
        playerName: customizeEnabled ? playerName.trim().toUpperCase() : "",
        playerNumber:
          customizeEnabled && playerNumber ? Number(playerNumber) : null,
        customizationPrice,
      }),
    );
    toast.success(`${product.name} (${selectedSize}) added to cart!`);
  };

  const handleSubmitReview = async () => {
    if (!rating) {
      toast.warning("Please select a rating");
      return;
    }
    if (!comment.trim()) {
      toast.warning("Please enter a comment");
      return;
    }
    if (!isAuthenticated) {
      toast.info("Please sign in to leave a review");
      navigate("/sign-in");
      return;
    }

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
  const jerseyPrimary = product.primaryColor || "#1565c0";
  const jerseySecondary = product.secondaryColor || "#FFFFFF";

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#ffffff" }}>
      <Container sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/shop")}
          sx={{ mb: 3 }}
        >
          Back to Shop
        </Button>

        <Grid container spacing={3}>
          {/* ── LEFT: Product Info + Customization Fields ── */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ bgcolor: "white", borderRadius: 3, p: 3, boxShadow: 2 }}>
              <Chip label={product.league} size="small" sx={{ mb: 1 }} />
              <Typography variant="h4" fontWeight={800} gutterBottom>
                {product.name}
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {product.team}
              </Typography>

              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <Rating
                  value={product.rating}
                  precision={0.5}
                  readOnly
                  size="small"
                />
                <Typography variant="body2" color="text.secondary">
                  ({product.numReviews} reviews)
                </Typography>
              </Box>

              {/* Price */}
              <Box sx={{ mb: 2 }}>
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
                <Box mb={2}>
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

              {/* ── Customization Section ── */}
              <Paper
                variant="outlined"
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  mb: 2,
                  borderColor: customizeEnabled ? "#1565c0" : "#e0e0e0",
                  bgcolor: customizeEnabled
                    ? "rgba(21,101,192,0.03)"
                    : "transparent",
                  transition: "all 0.2s",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PrintIcon sx={{ color: "#1565c0" }} />
                    <Box>
                      <Typography variant="subtitle2" fontWeight={700}>
                        Custom Printing
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Add your name &amp; number (+Rs. {CUSTOMIZATION_FEE})
                      </Typography>
                    </Box>
                  </Box>
                  <Switch
                    checked={customizeEnabled}
                    onChange={(e) => setCustomizeEnabled(e.target.checked)}
                    color="primary"
                  />
                </Box>

                {customizeEnabled && (
                  <Stack spacing={2} mt={2}>
                    <TextField
                      label="Player Name"
                      placeholder="e.g. MESSI"
                      value={playerName}
                      onChange={(e) =>
                        setPlayerName(e.target.value.toUpperCase().slice(0, 12))
                      }
                      inputProps={{ maxLength: 12 }}
                      size="small"
                      fullWidth
                      helperText={`${playerName.length}/12 characters`}
                    />
                    <TextField
                      label="Player Number"
                      placeholder="e.g. 10"
                      type="number"
                      value={playerNumber}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (v === "" || (Number(v) >= 1 && Number(v) <= 99)) {
                          setPlayerNumber(v);
                        }
                      }}
                      inputProps={{ min: 1, max: 99 }}
                      size="small"
                      fullWidth
                      helperText="Number between 1–99"
                    />
                  </Stack>
                )}
              </Paper>

              {/* ── Price Breakdown ── */}
              <Box sx={{ bgcolor: "#f5f8fc", borderRadius: 2, p: 2, mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Typography variant="body2">Jersey Price</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    Rs. {displayPrice.toLocaleString()}
                  </Typography>
                </Box>
                {customizationPrice > 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="body2" sx={{ color: "#1565c0" }}>
                      🖨️ Custom Printing
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      sx={{ color: "#1565c0" }}
                    >
                      + Rs. {CUSTOMIZATION_FEE}
                    </Typography>
                  </Box>
                )}
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="subtitle1" fontWeight={700}>
                    Total
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    color="primary"
                  >
                    Rs. {(displayPrice + customizationPrice).toLocaleString()}
                  </Typography>
                </Box>
              </Box>

              {/* Stock */}
              <Typography
                variant="body2"
                color={product.stock > 0 ? "success.main" : "error.main"}
                mb={2}
              >
                {product.stock > 0
                  ? `In Stock (${product.stock} available)`
                  : "Out of Stock"}
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

          {/* ── RIGHT: Live Jersey Preview (sticky, side by side) ── */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box
              sx={{
                position: { md: "sticky" },
                top: { md: 80 },
                borderRadius: 4,
                overflow: "hidden",
                background:
                  "linear-gradient(145deg, rgba(21,101,192,0.08) 0%, rgba(10,25,41,0.06) 100%)",
                border: "1px solid rgba(21,101,192,0.12)",
                boxShadow: "0 4px 24px rgba(21,101,192,0.08)",
                p: { xs: 3, md: 4 },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minHeight: 420,
              }}
            >
              <Typography
                variant="overline"
                sx={{
                  color: "#1565c0",
                  fontWeight: 700,
                  letterSpacing: 2,
                  mb: 2,
                }}
              >
                Live Jersey Preview
              </Typography>

              <JerseyCustomizer
                primaryColor={jerseyPrimary}
                secondaryColor={jerseySecondary}
                playerName={customizeEnabled ? playerName : ""}
                playerNumber={
                  customizeEnabled && playerNumber ? playerNumber : null
                }
                width={320}
                height={400}
              />

              {customizeEnabled && hasCustomization && (
                <Chip
                  icon={<PrintIcon />}
                  label={`${playerName || ""} ${playerNumber ? "#" + playerNumber : ""}`}
                  sx={{
                    mt: 2,
                    bgcolor: "rgba(21,101,192,0.1)",
                    color: "#1565c0",
                    fontWeight: 700,
                  }}
                />
              )}
            </Box>
          </Grid>
        </Grid>

        {/* ── Reviews ── */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Customer Reviews
          </Typography>

          <Box
            sx={{
              bgcolor: "white",
              borderRadius: 3,
              p: 3,
              boxShadow: 1,
              mb: 4,
            }}
          >
            <Typography variant="subtitle1" fontWeight={700} mb={2}>
              Write a Review
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                maxWidth: 500,
              }}
            >
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

          {product.reviews.length === 0 ? (
            <Typography color="text.secondary">
              No reviews yet. Be the first!
            </Typography>
          ) : (
            <Stack spacing={2}>
              {product.reviews.map((r) => (
                <Box
                  key={r._id}
                  sx={{
                    bgcolor: "white",
                    borderRadius: 3,
                    p: 2.5,
                    boxShadow: 1,
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Avatar sx={{ bgcolor: "#1565c0" }}>
                      {r.name[0].toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography fontWeight={700}>{r.name}</Typography>
                      <Rating value={r.rating} readOnly size="small" />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        mt={0.5}
                      >
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
