import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import { useLocation, useNavigate } from "react-router-dom";

const STATUS_COLORS = {
  pending: "warning",
  processing: "info",
  shipped: "primary",
  delivered: "success",
  cancelled: "error",
};

const OrderConfirmationScreen = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const order = state?.order;

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
          gap: 1,
        }}
      >
        <SportsSoccerIcon sx={{ color: "#FFD700" }} />
        <Typography
          variant="h6"
          fontWeight={700}
          color="white"
          sx={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Jersey Pasal
        </Typography>
      </Box>

      <Container maxWidth="sm" sx={{ py: 8, textAlign: "center" }}>
        <CheckCircleIcon sx={{ fontSize: 80, color: "#2e7d32" }} />
        <Typography variant="h4" fontWeight={800} mt={2} gutterBottom>
          Order Placed Successfully!
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Thank you for your purchase. We&apos;ll process your order shortly.
        </Typography>

        {order && (
          <Paper sx={{ borderRadius: 3, p: 3, mb: 4, textAlign: "left" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Order ID</Typography>
              <Typography variant="body2" fontWeight={700} sx={{ wordBreak: "break-all" }}>
                #{order._id?.slice(-8).toUpperCase()}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Status</Typography>
              <Chip
                label={order.status ?? "pending"}
                color={STATUS_COLORS[order.status ?? "pending"] ?? "default"}
                size="small"
              />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Payment</Typography>
              <Typography variant="body2" fontWeight={600} sx={{ textTransform: "capitalize" }}>
                {order.paymentMethod?.replace(/_/g, " ") ?? "—"}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            {order.orderItems?.map((item, idx) => (
              <Box
                key={idx}
                sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}
              >
                <Typography variant="body2">
                  {item.name} ({item.size}) × {item.qty}
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  Rs. {(item.price * item.qty).toLocaleString()}
                </Typography>
              </Box>
            ))}

            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6" fontWeight={700}>Total</Typography>
              <Typography variant="h6" fontWeight={700} color="primary">
                Rs. {order.totalPrice?.toLocaleString()}
              </Typography>
            </Box>

            {order.shippingAddress && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                  Shipping To
                </Typography>
                <Typography variant="body2">
                  {order.shippingAddress.fullName},{" "}
                  {order.shippingAddress.address},{" "}
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.district},{" "}
                  {order.shippingAddress.province}
                </Typography>
                <Typography variant="body2">
                  📞 {order.shippingAddress.phone}
                </Typography>
              </>
            )}
          </Paper>
        )}

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="contained" onClick={() => navigate("/shop")}>
            Continue Shopping
          </Button>
          <Button variant="outlined" onClick={() => navigate("/app/orders")}>
            My Orders
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default OrderConfirmationScreen;
