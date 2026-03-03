import { Box, Button, Card, IconButton, Typography } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const hasDiscount = !!product.discountPrice;
  const displayPrice = product.discountPrice ?? product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100,
      )
    : 0;

  return (
    <Card
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        border: "1px solid #f0f0f0",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        transition: "box-shadow 0.2s ease",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        "&:hover": {
          boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
        },
      }}
      onClick={() => navigate(`/product/${product._id}`)}
    >
      {/* Image area */}
      <Box sx={{ position: "relative", bgcolor: "#fafafa" }}>
        {/* Discount badge */}
        {hasDiscount && (
          <Box
            sx={{
              position: "absolute",
              top: 10,
              left: 10,
              bgcolor: "#1565c0",
              color: "white",
              fontWeight: 700,
              fontSize: 12,
              px: 1,
              py: 0.3,
              borderRadius: "10px",
              zIndex: 2,
              lineHeight: 1.4,
            }}
          >
            {discountPercent}% OFF
          </Box>
        )}

        {/* Heart icon */}
        <IconButton
          sx={{
            position: "absolute",
            top: 6,
            right: 6,
            bgcolor: "rgba(255,255,255,0.85)",
            zIndex: 2,
            width: 32,
            height: 32,
            "&:hover": { bgcolor: "white", color: "#1565c0" },
          }}
          onClick={(e) => e.stopPropagation()}
          aria-label="Add to wishlist"
        >
          <FavoriteBorderIcon sx={{ fontSize: 18 }} />
        </IconButton>

        {/* Product Image */}
        <Box
          sx={{
            height: { xs: 160, sm: 200 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
          }}
        >
          {product.images?.[0]?.url ? (
            <Box
              component="img"
              src={product.images[0].url}
              alt={product.name}
              sx={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          ) : (
            <SportsSoccerIcon sx={{ fontSize: 64, color: "#ccc" }} />
          )}
        </Box>

        {/* Out of stock overlay */}
        {product.stock === 0 && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              bgcolor: "rgba(255,255,255,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 3,
            }}
          >
            <Typography
              sx={{
                bgcolor: "#333",
                color: "white",
                px: 2,
                py: 0.5,
                borderRadius: 1,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Out of Stock
            </Typography>
          </Box>
        )}
      </Box>

      {/* Content */}
      <Box
        sx={{ p: 1.5, flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        {/* Name */}
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 500,
            lineHeight: 1.3,
            mb: 0.5,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            color: "#333",
          }}
        >
          {product.name}
        </Typography>

        {/* Price */}
        <Box
          sx={{ display: "flex", alignItems: "baseline", gap: 0.8, mb: 0.5 }}
        >
          <Typography
            sx={{
              color: "#1565c0",
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            Rs. {displayPrice.toLocaleString()}
          </Typography>
          {hasDiscount && (
            <Typography
              sx={{
                color: "#f44336",
                textDecoration: "line-through",
                fontSize: 13,
              }}
            >
              Rs.{product.price.toLocaleString()}
            </Typography>
          )}
        </Box>

        {/* Reviews */}
        <Typography
          sx={{
            fontSize: 12,
            color: "#999",
            mb: 1.5,
          }}
        >
          {product.numReviews > 0
            ? `⭐ ${product.rating} (${product.numReviews} reviews)`
            : "No reviews yet"}
        </Typography>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Action button — go to product detail */}
        {product.stock > 0 ? (
          <Button
            variant="contained"
            size="small"
            fullWidth
            startIcon={
              <AddShoppingCartIcon sx={{ fontSize: "16px !important" }} />
            }
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/product/${product._id}`);
            }}
            sx={{
              bgcolor: "#1565c0",
              color: "white",
              textTransform: "none",
              fontWeight: 600,
              fontSize: 13,
              borderRadius: 1,
              py: 0.6,
              boxShadow: "none",
              "&:hover": {
                bgcolor: "#0d47a1",
                boxShadow: "none",
              },
            }}
          >
            View &amp; Order
          </Button>
        ) : null}
      </Box>
    </Card>
  );
};

export default ProductCard;
