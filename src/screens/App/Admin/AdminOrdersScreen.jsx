import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import useAuth from "hooks/useAuth";

const API = import.meta.env.VITE_API_URL;

const STATUS_COLORS = {
  pending: "warning",
  processing: "info",
  shipped: "primary",
  delivered: "success",
  cancelled: "error",
};

const ALL_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const AdminOrdersScreen = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(data.orders);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      await axios.put(
        `${API}/orders/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status } : o)),
      );
      toast.success("Status updated");
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Failed to update status");
    } finally {
      setUpdatingId(null);
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
        <Typography color="grey.400" sx={{ ml: 1 }}>
          / Admin / Orders
        </Typography>
      </Box>

      <Container sx={{ py: 4 }}>
        {/* Admin Nav */}
        <Stack direction="row" spacing={2} mb={4} flexWrap="wrap">
          <Button variant="outlined" onClick={() => navigate("/app/admin")}>
            Dashboard
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate("/app/admin/products")}
          >
            Products
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate("/app/admin/orders")}
          >
            Orders
          </Button>
        </Stack>

        <Typography variant="h4" fontWeight={700} mb={3}>
          All Orders
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress />
          </Box>
        ) : orders.length === 0 ? (
          <Typography color="text.secondary" textAlign="center" py={10}>
            No orders found
          </Typography>
        ) : (
          <TableContainer
            component={Paper}
            sx={{ borderRadius: 3, boxShadow: 1 }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#0a1929" }}>
                  {[
                    "Order ID",
                    "Customer",
                    "Items",
                    "Printing",
                    "Total",
                    "Payment",
                    "Status",
                    "Date",
                    "Action",
                  ].map((h) => (
                    <TableCell key={h} sx={{ color: "white", fontWeight: 700 }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => {
                  const orderItems = order.items ?? order.orderItems ?? [];
                  const hasAnyPrint = orderItems.some(
                    (i) => i.playerName || i.playerNumber,
                  );
                  return (
                    <TableRow key={order._id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={700}>
                          #{order._id.slice(-8).toUpperCase()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {order.user?.name ?? "—"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {order.user?.email ?? ""}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {orderItems.length} item(s)
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {hasAnyPrint ? (
                          <Stack spacing={0.5}>
                            {orderItems
                              .filter((i) => i.playerName || i.playerNumber)
                              .map((i, idx) => (
                                <Typography
                                  key={idx}
                                  variant="caption"
                                  sx={{
                                    color: "#1565c0",
                                    fontWeight: 600,
                                    display: "block",
                                  }}
                                >
                                  🖨️ {i.name} —{" "}
                                  {i.playerName && `${i.playerName} `}
                                  {i.playerNumber && `#${i.playerNumber}`}
                                </Typography>
                              ))}
                          </Stack>
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            None
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          fontWeight={700}
                          color="primary"
                        >
                          Rs. {order.totalPrice?.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ textTransform: "capitalize" }}
                        >
                          {order.paymentMethod?.replace(/_/g, " ")}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={order.status}
                          color={STATUS_COLORS[order.status] ?? "default"}
                          size="small"
                          sx={{ textTransform: "capitalize" }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <FormControl size="small" sx={{ minWidth: 130 }}>
                          <InputLabel>Status</InputLabel>
                          <Select
                            value={order.status}
                            label="Status"
                            disabled={updatingId === order._id}
                            onChange={(e) =>
                              handleStatusChange(order._id, e.target.value)
                            }
                          >
                            {ALL_STATUSES.map((s) => (
                              <MenuItem
                                key={s}
                                value={s}
                                sx={{ textTransform: "capitalize" }}
                              >
                                {s}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </Box>
  );
};

export default AdminOrdersScreen;
