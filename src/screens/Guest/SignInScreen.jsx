import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Stack,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { loginUser } from "store/authSlice";
import useAuth from "hooks/useAuth";

const SignInScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, loading, error } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) navigate("/app/dashboard", { replace: true });
  }, [isAuthenticated, navigate]);

  // Show error toast
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password)
      return toast.error("Please fill in all fields");
    const result = await dispatch(
      loginUser({ email: form.email, password: form.password }),
    );
    if (loginUser.fulfilled.match(result)) {
      toast.success("Login successful!");
      navigate("/app/dashboard", { replace: true });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a1929 0%, #1565c0 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Container maxWidth="xs">
        <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
          {/* Logo */}
          <Box textAlign="center" mb={3}>
            <SportsSoccerIcon sx={{ fontSize: 48, color: "#1565c0" }} />
            <Typography variant="h5" fontWeight={700} mt={1}>
              Jersey Pasal
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to your account
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
                autoComplete="email"
                autoFocus
              />
              <TextField
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                fullWidth
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((p) => !p)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{ py: 1.4, fontWeight: 700 }}
              >
                {loading ? (
                  <CircularProgress size={22} color="inherit" />
                ) : (
                  "Sign In"
                )}
              </Button>
            </Stack>
          </form>

          <Box mt={2.5} textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Don&apos;t have an account?{" "}
              <Link to="/sign-up" style={{ color: "#1565c0", fontWeight: 600 }}>
                Register
              </Link>
            </Typography>
          </Box>

          {/* Demo hint */}
          <Box mt={2} p={1.5} bgcolor="#f5f5f5" borderRadius={2}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              <strong>Demo — Admin:</strong> admin@jersey.com / admin123
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              <strong>Demo — Customer:</strong> any other email &amp; password
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default SignInScreen;
