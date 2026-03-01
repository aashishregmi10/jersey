import {
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCartItems,
  selectCartCount,
  selectCartTotal,
  updateQty,
  removeItem,
  clearCart,
} from "store/cartSlice";

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const totalCount = useSelector(selectCartCount);
  const total = useSelector(selectCartTotal);

  const handleQty = (_id, size, qty) => dispatch(updateQty({ _id, size, qty }));
  const handleRemove = (_id, size) => dispatch(removeItem({ _id, size }));

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
        <IconButton sx={{ color: "white" }}>
          <Badge badgeContent={totalCount} color="error">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      </Box>

      <Container sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/shop")}
          sx={{ mb: 3 }}
        >
          Continue Shopping
        </Button>

        <Typography variant="h4" fontWeight={700} gutterBottom>
          Shopping Cart
          {totalCount > 0 && (
            <Typography
              component="span"
              variant="body1"
              color="text.secondary"
              ml={1}
            >
              ({totalCount} item{totalCount > 1 ? "s" : ""})
            </Typography>
          )}
        </Typography>

        {items.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 12 }}>
            <ShoppingCartIcon sx={{ fontSize: 80, color: "#ccc" }} />
            <Typography variant="h5" color="text.secondary" mt={2} gutterBottom>
              Your cart is empty
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Browse our collection and add your favourite jerseys
            </Typography>
            <Button variant="contained" onClick={() => navigate("/shop")}>
              Shop Now
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            {/* ── Cart Items ── */}
            <Box sx={{ flex: "1 1 400px" }}>
              <Stack spacing={2}>
                {items.map((item) => (
                  <Paper
                    key={`${item._id}-${item.size}`}
                    sx={{ borderRadius: 3, p: 2, display: "flex", gap: 2, alignItems: "center" }}
                  >
                    {/* Image */}
                    {item.image ? (
                      <Box
                        component="img"
                        src={item.image}
                        alt={item.name}
                        sx={{ width: 80, height: 80, objectFit: "cover", borderRadius: 2 }}
                      />
                    ) : (
                      <Avatar
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: 2,
                          bgcolor: "#0a1929",
                        }}
                        variant="rounded"
                      >
                        <SportsSoccerIcon sx={{ fontSize: 36 }} />
                      </Avatar>
                    )}

                    {/* Info */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography fontWeight={700} noWrap>
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.team} · Size: {item.size}
                      </Typography>
                      <Typography variant="h6" color="primary" fontWeight={700}>
                        Rs. {item.price.toLocaleString()}
                      </Typography>
                    </Box>

                    {/* Qty controls */}
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <IconButton
                        size="small"
                        onClick={() => handleQty(item._id, item.size, item.qty - 1)}
                        disabled={item.qty <= 1}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <Typography
                        sx={{
                          minWidth: 32,
                          textAlign: "center",
                          fontWeight: 700,
                        }}
                      >
                        {item.qty}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleQty(item._id, item.size, item.qty + 1)}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Stack>

                    {/* Row total */}
                    <Typography fontWeight={700} sx={{ minWidth: 90, textAlign: "right" }}>
                      Rs. {(item.price * item.qty).toLocaleString()}
                    </Typography>

                    {/* Remove */}
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleRemove(item._id, item.size)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Paper>
                ))}
              </Stack>

              <Button
                variant="text"
                color="error"
                size="small"
                sx={{ mt: 2 }}
                onClick={() => dispatch(clearCart())}
              >
                Clear Cart
              </Button>
            </Box>

            {/* ── Order Summary ── */}
            <Box sx={{ flex: "0 0 320px", alignSelf: "flex-start" }}>
              <Paper sx={{ borderRadius: 3, p: 3, boxShadow: 2 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Order Summary
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {items.map((item) => (
                  <Box
                    key={`${item._id}-${item.size}`}
                    sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
                  >
                    <Typography variant="body2" noWrap sx={{ flex: 1, mr: 1 }}>
                      {item.name} × {item.qty}
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      Rs. {(item.price * item.qty).toLocaleString()}
                    </Typography>
                  </Box>
                ))}

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                  <Typography variant="body1">Subtotal</Typography>
                  <Typography variant="body1" fontWeight={700}>
                    Rs. {total.toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Shipping
                  </Typography>
                  <Typography variant="body2" color="success.main" fontWeight={600}>
                    Free
                  </Typography>
                </Box>

                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                  <Typography variant="h6" fontWeight={700}>Total</Typography>
                  <Typography variant="h6" fontWeight={700} color="primary">
                    Rs. {total.toLocaleString()}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate("/checkout")}
                >
                  Proceed to Checkout
                </Button>
              </Paper>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default CartScreen;
