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

  const orderItems = order?.items ?? order?.orderItems ?? [];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#ffffff" }}>
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
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2" color="text.secondary">
                Order ID
              </Typography>
              <Typography
                variant="body2"
                fontWeight={700}
                sx={{ wordBreak: "break-all" }}
              >
                #{order._id?.slice(-8).toUpperCase()}
              </Typography>
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2" color="text.secondary">
                Status
              </Typography>
              <Chip
                label={order.status ?? "pending"}
                color={STATUS_COLORS[order.status ?? "pending"] ?? "default"}
                size="small"
              />
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="body2" color="text.secondary">
                Payment
              </Typography>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ textTransform: "capitalize" }}
              >
                {order.paymentMethod?.replace(/_/g, " ") ?? "—"}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            {orderItems.map((item, idx) => (
              <Box key={idx} sx={{ mb: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="body2">
                    {item.name} ({item.size}) × {item.qty ?? item.quantity}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    Rs.{" "}
                    {(
                      (item.price + (item.customizationPrice ?? 0)) *
                      (item.qty ?? item.quantity)
                    ).toLocaleString()}
                  </Typography>
                </Box>
                {(item.playerName || item.playerNumber) && (
                  <Typography variant="caption" sx={{ color: "#1565c0" }}>
                    🖨️ {item.playerName}
                    {item.playerNumber && ` #${item.playerNumber}`}
                    {" · +Rs. "}
                    {(item.customizationPrice ?? 0).toLocaleString()}
                  </Typography>
                )}
              </Box>
            ))}

            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6" fontWeight={700}>
                Total
              </Typography>
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
                  {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
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
