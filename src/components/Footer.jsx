import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: "#1565c0", color: "white", pt: 8, pb: 3 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand Column */}
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <SportsSoccerIcon sx={{ color: "#FFD700", fontSize: 28 }} />
              <Typography variant="h6" fontWeight={800}>
                Jersey Pasal
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{ color: "rgba(255,255,255,0.65)", mb: 2, lineHeight: 1.7 }}
            >
              Your #1 destination for FIFA World Cup 2026 jerseys in Nepal.
              Order your favourite team's jersey and optionally add name &
              number printing for just Rs. 200. Delivered to your doorstep!
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton
                size="small"
                sx={{
                  color: "rgba(255,255,255,0.6)",
                  "&:hover": { color: "#1877F2" },
                }}
                aria-label="Facebook"
              >
                <FacebookIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: "rgba(255,255,255,0.6)",
                  "&:hover": { color: "#E4405F" },
                }}
                aria-label="Instagram"
              >
                <InstagramIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: "rgba(255,255,255,0.6)",
                  "&:hover": { color: "white" },
                }}
                aria-label="X"
              >
                <XIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: "rgba(255,255,255,0.6)",
                  "&:hover": { color: "#FF0000" },
                }}
                aria-label="YouTube"
              >
                <YouTubeIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography
              variant="subtitle2"
              fontWeight={700}
              sx={{
                mb: 2,
                color: "#FFD700",
                textTransform: "uppercase",
                fontSize: 12,
                letterSpacing: 1,
              }}
            >
              Quick Links
            </Typography>
            <Stack spacing={1}>
              {[
                { label: "Home", path: "/" },
                { label: "Shop All", path: "/shop" },
                { label: "Cart", path: "/cart" },
                { label: "My Orders", path: "/app/orders" },
              ].map((link) => (
                <Typography
                  key={link.path}
                  variant="body2"
                  sx={{
                    color: "rgba(255,255,255,0.6)",
                    cursor: "pointer",
                    "&:hover": { color: "#FFD700" },
                    transition: "color 0.2s",
                  }}
                  onClick={() => navigate(link.path)}
                >
                  {link.label}
                </Typography>
              ))}
            </Stack>
          </Grid>

          {/* League */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography
              variant="subtitle2"
              fontWeight={700}
              sx={{
                mb: 2,
                color: "#FFD700",
                textTransform: "uppercase",
                fontSize: 12,
                letterSpacing: 1,
              }}
            >
              League
            </Typography>
            <Stack spacing={1}>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255,255,255,0.6)",
                  cursor: "pointer",
                  "&:hover": { color: "#FFD700" },
                  transition: "color 0.2s",
                }}
                onClick={() => navigate("/shop")}
              >
                🏆 FIFA World Cup 2026
              </Typography>
            </Stack>
          </Grid>

          {/* Contact & Newsletter */}
          <Grid item xs={12} sm={6} md={5}>
            <Typography
              variant="subtitle2"
              fontWeight={700}
              sx={{
                mb: 2,
                color: "#FFD700",
                textTransform: "uppercase",
                fontSize: 12,
                letterSpacing: 1,
              }}
            >
              Get in Touch
            </Typography>
            <Stack spacing={1.5} mb={3}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocationOnIcon
                  sx={{ fontSize: 18, color: "rgba(255,255,255,0.5)" }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255,255,255,0.6)" }}
                >
                  Kathmandu, Nepal
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <EmailIcon
                  sx={{ fontSize: 18, color: "rgba(255,255,255,0.5)" }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255,255,255,0.6)" }}
                >
                  support@jerseypasal.com
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PhoneIcon
                  sx={{ fontSize: 18, color: "rgba(255,255,255,0.5)" }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255,255,255,0.6)" }}
                >
                  +977 9800000000
                </Typography>
              </Box>
            </Stack>

            <Typography
              variant="subtitle2"
              fontWeight={700}
              sx={{ mb: 1.5, color: "white" }}
            >
              Subscribe to our newsletter
            </Typography>
            <Stack direction="row" spacing={1}>
              <TextField
                placeholder="Your email address"
                size="small"
                sx={{
                  flex: 1,
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "rgba(255,255,255,0.08)",
                    color: "white",
                    fontSize: 14,
                    "& fieldset": { borderColor: "rgba(255,255,255,0.15)" },
                    "&:hover fieldset": {
                      borderColor: "rgba(255,255,255,0.3)",
                    },
                    "&.Mui-focused fieldset": { borderColor: "#FFD700" },
                  },
                  "& .MuiOutlinedInput-input::placeholder": {
                    color: "rgba(255,255,255,0.4)",
                  },
                }}
              />
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#FFD700",
                  color: "#1565c0",
                  fontWeight: 700,
                  textTransform: "none",
                  "&:hover": { bgcolor: "#e6c200" },
                  px: 3,
                }}
              >
                Subscribe
              </Button>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.08)" }} />

        {/* Bottom Bar */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)" }}>
            © {new Date().getFullYear()} Jersey Pasal. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Typography
              variant="caption"
              sx={{
                color: "rgba(255,255,255,0.4)",
                cursor: "pointer",
                "&:hover": { color: "rgba(255,255,255,0.7)" },
              }}
            >
              Privacy Policy
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "rgba(255,255,255,0.4)",
                cursor: "pointer",
                "&:hover": { color: "rgba(255,255,255,0.7)" },
              }}
            >
              Terms of Service
            </Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
