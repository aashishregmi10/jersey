import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import useAuth from "hooks/useAuth";

const API = import.meta.env.VITE_API_URL;

const STAT_CARDS = [
  { key: "totalUsers",    label: "Total Users",    icon: <PeopleIcon     sx={{ fontSize: 36, color: "#1976d2" }} />, color: "#e3f2fd" },
  { key: "totalProducts", label: "Total Products", icon: <Inventory2Icon sx={{ fontSize: 36, color: "#2e7d32" }} />, color: "#e8f5e9" },
  { key: "totalOrders",   label: "Total Orders",   icon: <ShoppingBagIcon sx={{ fontSize: 36, color: "#e65100" }} />, color: "#fff3e0" },
  { key: "totalRevenue",  label: "Revenue (Rs.)",  icon: <AttachMoneyIcon sx={{ fontSize: 36, color: "#6a1b9a" }} />, color: "#f3e5f5" },
];

const AdminDashboardScreen = () => {
  const navigate = useNavigate();
  const { token, user, handleLogout } = useAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(data.stats);
      } catch {
        toast.error("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  const onLogout = () => {
    handleLogout();
    navigate("/sign-in");
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
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <SportsSoccerIcon sx={{ color: "#FFD700" }} />
          <Typography variant="h6" fontWeight={700} color="white">
            Jersey Pasal
          </Typography>
          <Typography color="grey.400" sx={{ ml: 1 }}>
            / Admin
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2" color="grey.400">
            {user?.name}
          </Typography>
          <Button
            size="small"
            variant="outlined"
            startIcon={<LogoutIcon />}
            sx={{ color: "white", borderColor: "grey.600" }}
            onClick={onLogout}
          >
            Logout
          </Button>
        </Stack>
      </Box>

      <Container sx={{ py: 4 }}>
        {/* ── Admin Nav ── */}
        <Stack direction="row" spacing={2} mb={4} flexWrap="wrap">
          <Button variant="contained" onClick={() => navigate("/app/admin")}>
            Dashboard
          </Button>
          <Button variant="outlined" onClick={() => navigate("/app/admin/products")}>
            Products
          </Button>
          <Button variant="outlined" onClick={() => navigate("/app/admin/orders")}>
            Orders
          </Button>
          <Button variant="text" size="small" onClick={() => navigate("/shop")}>
            View Shop
          </Button>
        </Stack>

        <Typography variant="h4" fontWeight={700} gutterBottom>
          Admin Dashboard
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Stats Cards */}
            <Grid container spacing={3} mb={4}>
              {STAT_CARDS.map(({ key, label, icon, color }) => (
                <Grid item xs={12} sm={6} md={3} key={key}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      boxShadow: 2,
                      bgcolor: color,
                      border: "none",
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                        {icon}
                      </Box>
                      <Typography variant="h4" fontWeight={800}>
                        {key === "totalRevenue"
                          ? (stats?.[key] ?? 0).toLocaleString()
                          : stats?.[key] ?? 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {label}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Quick links */}
            <Paper sx={{ borderRadius: 3, p: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Quick Actions
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Button
                  variant="contained"
                  startIcon={<Inventory2Icon />}
                  onClick={() => navigate("/app/admin/products")}
                >
                  Manage Products
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ShoppingBagIcon />}
                  onClick={() => navigate("/app/admin/orders")}
                >
                  Manage Orders
                </Button>
              </Stack>
            </Paper>
          </>
        )}
      </Container>
    </Box>
  );
};

export default AdminDashboardScreen;
