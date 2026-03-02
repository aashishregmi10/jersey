import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import useAuth from "hooks/useAuth";

const API = import.meta.env.VITE_API_URL;
const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const EMPTY_FORM = {
  name: "",
  team: "",
  league: "FIFA World Cup 2026",
  description: "",
  price: "",
  discountPrice: "",
  stock: "",
  sizes: ["M", "L", "XL"],
};

const AdminProductsScreen = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/products?limit=50`);
      setProducts(data.products);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpen = (product = null) => {
    if (product) {
      setEditId(product._id);
      setForm({
        name: product.name,
        team: product.team,
        league: product.league,
        description: product.description ?? "",
        price: product.price,
        discountPrice: product.discountPrice ?? "",
        stock: product.stock,
        sizes: product.sizes,
      });
    } else {
      setEditId(null);
      setForm(EMPTY_FORM);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    const { name, team, price, stock } = form;
    if (!name || !team || !price || !stock) {
      toast.warning("Name, team, price, and stock are required");
      return;
    }
    setSaving(true);
    try {
      const body = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
      };
      if (editId) {
        await axios.put(`${API}/products/${editId}`, body, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Product updated");
      } else {
        await axios.post(`${API}/products`, body, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Product created");
      }
      handleClose();
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`${API}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Product deleted");
      fetchProducts();
    } catch {
      toast.error("Failed to delete product");
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
          / Admin / Products
        </Typography>
      </Box>

      <Container sx={{ py: 4 }}>
        {/* Admin Nav */}
        <Stack direction="row" spacing={2} mb={4} flexWrap="wrap">
          <Button variant="outlined" onClick={() => navigate("/app/admin")}>
            Dashboard
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate("/app/admin/products")}
          >
            Products
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate("/app/admin/orders")}
          >
            Orders
          </Button>
        </Stack>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" fontWeight={700}>
            Products
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
          >
            Add Product
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product._id}>
                <Paper sx={{ borderRadius: 3, p: 2, boxShadow: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography fontWeight={700} noWrap>
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {product.team}
                      </Typography>
                      <Chip
                        label={product.league}
                        size="small"
                        sx={{ mt: 0.5, mb: 1, fontSize: 10 }}
                      />
                    </Box>
                    <Stack direction="row">
                      <IconButton
                        size="small"
                        onClick={() => handleOpen(product)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(product._id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      variant="body2"
                      color="primary"
                      fontWeight={700}
                    >
                      Rs.{" "}
                      {(
                        product.discountPrice ?? product.price
                      ).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Stock: {product.stock}
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 0.5 }}>
                    {product.sizes?.map((s) => (
                      <Chip
                        key={s}
                        label={s}
                        size="small"
                        sx={{ mr: 0.5, mt: 0.5 }}
                      />
                    ))}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* ── Add/Edit Dialog ── */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? "Edit Product" : "Add Product"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Team"
                name="team"
                value={form.team}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="League"
                name="league"
                value={form.league}
                onChange={handleChange}
                disabled
                helperText="Fixed to FIFA World Cup 2026"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Price (Rs.)"
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Discount Price"
                name="discountPrice"
                type="number"
                value={form.discountPrice}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Stock"
                name="stock"
                type="number"
                value={form.stock}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight={700} mb={1}>
                Sizes
              </Typography>
              <ToggleButtonGroup
                value={form.sizes}
                onChange={(_, v) => setForm((p) => ({ ...p, sizes: v }))}
                size="small"
              >
                {ALL_SIZES.map((s) => (
                  <ToggleButton key={s} value={s}>
                    {s}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminProductsScreen;
