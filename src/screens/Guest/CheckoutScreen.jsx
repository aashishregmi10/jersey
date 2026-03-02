import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { selectCartItems, selectCartTotal, clearCart } from "store/cartSlice";
import useAuth from "hooks/useAuth";

const API = import.meta.env.VITE_API_URL;

const CheckoutScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const { token, isAuthenticated } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    province: "Bagmati",
  });
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
  const [loading, setLoading] = useState(false);

  // Redirect to sign in if not logged in
  if (!isAuthenticated) {
    toast.info("Please sign in to checkout");
    navigate("/sign-in");
    return null;
  }

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, phone, address, city, district } = form;
    if (!fullName || !phone || !address || !city || !district) {
      toast.warning("Please fill in all shipping fields");
      return;
    }

    setLoading(true);
    try {
      const orderItems = items.map((i) => ({
        product: i._id,
        name: i.name,
        price: i.price,
        size: i.size,
        qty: i.qty,
        playerName: i.playerName || "",
        playerNumber: i.playerNumber ?? null,
        customizationPrice: i.customizationPrice ?? 0,
      }));

      const { data } = await axios.post(
        `${API}/orders`,
        {
          items: orderItems,
          shippingAddress: form,
          paymentMethod,
          totalPrice: total,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      dispatch(clearCart());
      navigate("/order-confirmed", { state: { order: data.order } });
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#ffffff" }}>
      <Container sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/cart")}
          sx={{ mb: 3 }}
        >
          Back to Cart
        </Button>

        <Typography variant="h4" fontWeight={700} gutterBottom>
          Checkout
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}
        >
          {/* ── Shipping Form ── */}
          <Box sx={{ flex: "1 1 400px" }}>
            <Paper sx={{ borderRadius: 3, p: 3, mb: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Shipping Address
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    inputProps={{ maxLength: 15 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Street Address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City / Town"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="District"
                    name="district"
                    value={form.district}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Province"
                    name="province"
                    value={form.province}
                    onChange={handleChange}
                    select
                    SelectProps={{ native: true }}
                  >
                    {[
                      "Koshi",
                      "Madhesh",
                      "Bagmati",
                      "Gandaki",
                      "Lumbini",
                      "Karnali",
                      "Sudurpashchim",
                    ].map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </Paper>

            {/* ── Payment Method ── */}
            <Paper sx={{ borderRadius: 3, p: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Payment Method
              </Typography>
              <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel
                  value="cash_on_delivery"
                  control={<Radio />}
                  label="Cash on Delivery"
                />
                <FormControlLabel
                  value="esewa"
                  control={<Radio />}
                  label="eSewa"
                />
                <FormControlLabel
                  value="khalti"
                  control={<Radio />}
                  label="Khalti"
                />
              </RadioGroup>
            </Paper>
          </Box>

          {/* ── Order Summary ── */}
          <Box sx={{ flex: "0 0 320px", alignSelf: "flex-start" }}>
            <Paper sx={{ borderRadius: 3, p: 3, boxShadow: 2 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Order Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Stack spacing={1} mb={2}>
                {items.map((item) => (
                  <Box
                    key={`${item._id}-${item.size}-${item.playerName || ""}-${item.playerNumber ?? ""}`}
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Box sx={{ flex: 1, mr: 1 }}>
                      <Typography variant="body2" noWrap>
                        {item.name} ({item.size}) × {item.qty}
                      </Typography>
                      {(item.playerName || item.playerNumber) && (
                        <Typography variant="caption" sx={{ color: "#1565c0" }}>
                          🖨️ {item.playerName}
                          {item.playerNumber && ` #${item.playerNumber}`}
                          {" · +Rs. "}
                          {(item.customizationPrice ?? 0).toLocaleString()}
                        </Typography>
                      )}
                    </Box>
                    <Typography variant="body2" fontWeight={600}>
                      Rs.{" "}
                      {(
                        (item.price + (item.customizationPrice ?? 0)) *
                        item.qty
                      ).toLocaleString()}
                    </Typography>
                  </Box>
                ))}
              </Stack>

              <Divider sx={{ mb: 1.5 }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 0.5,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Shipping
                </Typography>
                <Typography
                  variant="body2"
                  color="success.main"
                  fontWeight={600}
                >
                  Free
                </Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
              >
                <Typography variant="h6" fontWeight={700}>
                  Total
                </Typography>
                <Typography variant="h6" fontWeight={700} color="primary">
                  Rs. {total.toLocaleString()}
                </Typography>
              </Box>

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                startIcon={
                  loading ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <LockIcon />
                  )
                }
                disabled={loading}
                sx={{ bgcolor: "#2e7d32", "&:hover": { bgcolor: "#1b5e20" } }}
              >
                {loading ? "Placing Order…" : "Place Order"}
              </Button>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                textAlign="center"
                mt={1}
              >
                Your order will be confirmed via email
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default CheckoutScreen;
