import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Typography,
} from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "hooks/useAuth";

const DashboardScreen = () => {
  const navigate = useNavigate();
  const { user, isAdmin, handleLogout } = useAuth();

  const onLogout = () => {
    handleLogout();
    toast.success("Logged out successfully");
    navigate("/", { replace: true });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: isAdmin
          ? "linear-gradient(135deg, #1a0533 0%, #6a1b9a 100%)"
          : "linear-gradient(135deg, #0a1929 0%, #1565c0 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            bgcolor: "white",
            borderRadius: 4,
            p: { xs: 4, md: 6 },
            textAlign: "center",
            boxShadow: 10,
          }}
        >
          {/* Icon */}
          <Box
            sx={{
              width: 90,
              height: 90,
              borderRadius: "50%",
              bgcolor: isAdmin ? "#6a1b9a" : "#1565c0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 3,
            }}
          >
            {isAdmin ? (
              <AdminPanelSettingsIcon sx={{ fontSize: 50, color: "white" }} />
            ) : (
              <PersonIcon sx={{ fontSize: 50, color: "white" }} />
            )}
          </Box>

          {/* Role badge */}
          <Chip
            label={isAdmin ? "ADMIN" : "CUSTOMER"}
            sx={{
              bgcolor: isAdmin ? "#6a1b9a" : "#1565c0",
              color: "white",
              fontWeight: 700,
              fontSize: 13,
              mb: 2,
            }}
          />

          {/* Main message */}
          <Typography variant="h4" fontWeight={800} gutterBottom>
            {isAdmin ? "👑 Admin Logged In" : "👤 User Logged In"}
          </Typography>

          <Typography variant="h6" color="text.secondary" gutterBottom>
            Welcome back, <strong>{user?.name}</strong>!
          </Typography>

          <Typography variant="body1" color="text.secondary" mb={3}>
            {isAdmin
              ? "You have full admin access to manage products, orders, and users."
              : "You can browse jerseys, place orders, and track your deliveries."}
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* User info */}
          <Box
            sx={{
              bgcolor: "#f8f8f8",
              borderRadius: 2,
              p: 2,
              mb: 3,
              textAlign: "left",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              <strong>Name:</strong> {user?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              <strong>Email:</strong> {user?.email}
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              <strong>Role:</strong>{" "}
              <span
                style={{
                  textTransform: "capitalize",
                  color: isAdmin ? "#6a1b9a" : "#1565c0",
                  fontWeight: 700,
                }}
              >
                {user?.role}
              </span>
            </Typography>
          </Box>

          {/* Actions */}
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button
              variant="outlined"
              startIcon={<SportsSoccerIcon />}
              onClick={() => navigate("/")}
            >
              Go to Shop
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={onLogout}
            >
              Logout
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default DashboardScreen;
