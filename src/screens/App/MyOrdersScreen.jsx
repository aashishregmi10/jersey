import { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { selectCartCount } from "store/cartSlice";
import useAuth from "hooks/useAuth";

const API = import.meta.env.VITE_API_URL;

const STATUS_COLORS = {
  pending: "warning",
  processing: "info",
  shipped: "primary",
  delivered: "success",
  cancelled: "error",
};

const MyOrdersScreen = () => {
  const navigate = useNavigate();
  const cartCount = useSelector(selectCartCount);
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API}/orders/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(data.orders);
      } catch {
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [token]);

  const handleCancel = async (orderId) => {
    try {
      await axios.put(
        `${API}/orders/${orderId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Order cancelled");
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: "cancelled" } : o,
        ),
      );
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Failed to cancel order");
    }
  };

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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            variant="text"
            sx={{ color: "white" }}
            onClick={() => navigate("/shop")}
            size="small"
          >
            Shop
          </Button>
          <Badge badgeContent={cartCount} color="error">
            <ShoppingCartIcon
              sx={{ color: "white", cursor: "pointer" }}
              onClick={() => navigate("/cart")}
            />
          </Badge>
        </Box>
      </Box>

      <Container sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/dashboard")}
          sx={{ mb: 3 }}
        >
          Dashboard
        </Button>

        <Typography variant="h4" fontWeight={700} gutterBottom>
          My Orders
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress />
          </Box>
        ) : orders.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <ShoppingCartIcon sx={{ fontSize: 64, color: "#ccc" }} />
            <Typography variant="h6" color="text.secondary" mt={2} gutterBottom>
              No orders yet
            </Typography>
            <Button variant="contained" onClick={() => navigate("/shop")}>
              Start Shopping
            </Button>
          </Box>
        ) : (
          <Stack spacing={3}>
            {orders.map((order) => (
              <Paper key={order._id} sx={{ borderRadius: 3, p: 3, boxShadow: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: 1,
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1" fontWeight={700}>
                      Order #{order._id.slice(-8).toUpperCase()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(order.createdAt).toLocaleDateString("en-NP", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                      label={order.status}
                      color={STATUS_COLORS[order.status] ?? "default"}
                      size="small"
                      sx={{ textTransform: "capitalize" }}
                    />
                    {order.status === "pending" && (
                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        onClick={() => handleCancel(order._id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </Stack>
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Stack spacing={1}>
                  {order.orderItems?.map((item, idx) => (
                    <Box
                      key={idx}
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2">
                        {item.name} ({item.size}) × {item.qty}
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        Rs. {(item.price * item.qty).toLocaleString()}
                      </Typography>
                    </Box>
                  ))}
                </Stack>

                <Divider sx={{ my: 1.5 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body1" fontWeight={700}>Total</Typography>
                  <Typography variant="body1" fontWeight={700} color="primary">
                    Rs. {order.totalPrice?.toLocaleString()}
                  </Typography>
                </Box>

                {order.shippingAddress && (
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    Ship to: {order.shippingAddress.address},{" "}
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.district}
                  </Typography>
                )}
              </Paper>
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
};

export default MyOrdersScreen;
