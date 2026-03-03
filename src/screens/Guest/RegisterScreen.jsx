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
import { setCredentials } from "store/authSlice";
import { useRegisterMutation } from "store/authApi";
import useAuth from "hooks/useAuth";

const RegisterScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const [register, { isLoading }] = useRegisterMutation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate("/app/dashboard", { replace: true });
  }, [isAuthenticated, navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password)
      return toast.error("Please fill in all fields");
    if (form.password !== form.confirm)
      return toast.error("Passwords do not match");
    if (form.password.length < 6)
      return toast.error("Password must be at least 6 characters");

    try {
      const data = await register({
        name: form.name,
        email: form.email,
        password: form.password,
      }).unwrap();
      dispatch(setCredentials({ user: data.user, token: data.token }));
      toast.success("Account created!");
      navigate("/app/dashboard", { replace: true });
    } catch (err) {
      toast.error(
        err?.data?.message || "Registration failed. Please try again.",
      );
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
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Join Jersey Pasal today
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
                autoFocus
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                fullWidth
                slotProps={{
                  input: {
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
                  },
                }}
              />
              <TextField
                label="Confirm Password"
                name="confirm"
                type={showPassword ? "text" : "password"}
                value={form.confirm}
                onChange={handleChange}
                fullWidth
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={isLoading}
                sx={{ py: 1.4, fontWeight: 700 }}
              >
                {isLoading ? (
                  <CircularProgress size={22} color="inherit" />
                ) : (
                  "Create Account"
                )}
              </Button>
            </Stack>
          </form>

          <Box mt={2.5} textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Already have an account?{" "}
              <Link to="/sign-in" style={{ color: "#1565c0", fontWeight: 600 }}>
                Sign In
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterScreen;
