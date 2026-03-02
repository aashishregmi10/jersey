import { useState } from "react";
import {
  AppBar,
  Badge,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import StoreIcon from "@mui/icons-material/Store";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCartCount } from "store/cartSlice";
import useAuth from "hooks/useAuth";

const NAV_LINKS = [
  { label: "Home", path: "/", icon: <HomeIcon /> },
  { label: "Shop", path: "/shop", icon: <StoreIcon /> },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const cartCount = useSelector(selectCartCount);
  const { isAuthenticated, user } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isActive = (path) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  return (
    <>
      {/* Announcement Bar */}
      <Box
        sx={{
          bgcolor: "#FFD700",
          color: "#0a1929",
          textAlign: "center",
          py: 0.6,
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: 0.3,
        }}
      >
        🖨️ Custom Name & Number Printing on Every Jersey! &nbsp;|&nbsp; +Rs. 200
        Only &nbsp;|&nbsp; Free Delivery Nationwide
      </Box>

      <AppBar
        position="sticky"
        elevation={1}
        sx={{
          bgcolor: "#1565c0",
          backgroundImage: "none",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: { xs: 56, md: 64 } }}>
            {/* Logo */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                mr: 4,
              }}
              onClick={() => navigate("/")}
            >
              <SportsSoccerIcon sx={{ color: "#FFD700", fontSize: 28 }} />
              <Typography
                variant="h6"
                fontWeight={800}
                color="white"
                sx={{
                  letterSpacing: -0.5,
                  fontSize: { xs: "1.1rem", md: "1.25rem" },
                }}
              >
                Jersey Pasal
              </Typography>
            </Box>

            {/* Desktop Nav Links */}
            {!isMobile && (
              <Stack direction="row" spacing={0.5} sx={{ flexGrow: 1 }}>
                {NAV_LINKS.map((link) => (
                  <Button
                    key={link.path}
                    onClick={() => navigate(link.path)}
                    sx={{
                      color: isActive(link.path)
                        ? "#FFD700"
                        : "rgba(255,255,255,0.85)",
                      fontWeight: isActive(link.path) ? 700 : 500,
                      fontSize: "0.9rem",
                      textTransform: "none",
                      borderBottom: isActive(link.path)
                        ? "2px solid #FFD700"
                        : "2px solid transparent",
                      borderRadius: 0,
                      px: 2,
                      "&:hover": {
                        color: "#FFD700",
                        bgcolor: "rgba(255,255,255,0.05)",
                      },
                    }}
                  >
                    {link.label}
                  </Button>
                ))}
              </Stack>
            )}

            {/* Spacer on mobile */}
            {isMobile && <Box sx={{ flexGrow: 1 }} />}

            {/* Right side actions */}
            <Stack direction="row" spacing={0.5} alignItems="center">
              {/* Cart */}
              <IconButton
                sx={{ color: "white" }}
                onClick={() => navigate("/cart")}
                aria-label="Shopping cart"
              >
                <Badge
                  badgeContent={cartCount}
                  color="error"
                  sx={{
                    "& .MuiBadge-badge": {
                      fontSize: 11,
                      fontWeight: 700,
                    },
                  }}
                >
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>

              {/* Desktop Auth Buttons */}
              {!isMobile && (
                <>
                  {isAuthenticated ? (
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        bgcolor: "#FFD700",
                        color: "#0a1929",
                        fontWeight: 700,
                        textTransform: "none",
                        "&:hover": { bgcolor: "#e6c200" },
                      }}
                      onClick={() =>
                        navigate(
                          user?.role === "admin"
                            ? "/app/admin"
                            : "/app/dashboard",
                        )
                      }
                    >
                      {user?.role === "admin" ? "Dashboard" : "My Account"}
                    </Button>
                  ) : (
                    <>
                      <Button
                        size="small"
                        sx={{
                          color: "rgba(255,255,255,0.85)",
                          textTransform: "none",
                          fontWeight: 500,
                          "&:hover": { color: "white" },
                        }}
                        onClick={() => navigate("/sign-in")}
                      >
                        Sign In
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          bgcolor: "#FFD700",
                          color: "#0a1929",
                          fontWeight: 700,
                          textTransform: "none",
                          "&:hover": { bgcolor: "#e6c200" },
                        }}
                        onClick={() => navigate("/sign-up")}
                      >
                        Register
                      </Button>
                    </>
                  )}
                </>
              )}

              {/* Mobile Hamburger */}
              {isMobile && (
                <IconButton
                  sx={{ color: "white" }}
                  onClick={() => setDrawerOpen(true)}
                  aria-label="Open navigation menu"
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { width: 280, bgcolor: "#0a1929", color: "white" },
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <SportsSoccerIcon sx={{ color: "#FFD700" }} />
            <Typography fontWeight={700}>Jersey Pasal</Typography>
          </Box>
          <IconButton
            sx={{ color: "white" }}
            onClick={() => setDrawerOpen(false)}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <List sx={{ px: 1 }}>
          {NAV_LINKS.map((link) => (
            <ListItem key={link.path} disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate(link.path);
                  setDrawerOpen(false);
                }}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  color: isActive(link.path) ? "#FFD700" : "white",
                  bgcolor: isActive(link.path)
                    ? "rgba(255,215,0,0.08)"
                    : "transparent",
                }}
              >
                <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                  {link.icon}
                </ListItemIcon>
                <ListItemText primary={link.label} />
              </ListItemButton>
            </ListItem>
          ))}

          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                navigate("/cart");
                setDrawerOpen(false);
              }}
              sx={{ borderRadius: 2, mb: 0.5, color: "white" }}
            >
              <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                <Badge badgeContent={cartCount} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </ListItemIcon>
              <ListItemText primary="Cart" />
            </ListItemButton>
          </ListItem>

          <Box sx={{ my: 2, borderTop: "1px solid rgba(255,255,255,0.12)" }} />

          {isAuthenticated ? (
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate(
                    user?.role === "admin" ? "/app/admin" : "/app/dashboard",
                  );
                  setDrawerOpen(false);
                }}
                sx={{
                  borderRadius: 2,
                  bgcolor: "#FFD700",
                  color: "#0a1929",
                  fontWeight: 700,
                  "&:hover": { bgcolor: "#e6c200" },
                }}
              >
                <ListItemText
                  primary={user?.role === "admin" ? "Dashboard" : "My Account"}
                  primaryTypographyProps={{ fontWeight: 700 }}
                />
              </ListItemButton>
            </ListItem>
          ) : (
            <>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    navigate("/sign-in");
                    setDrawerOpen(false);
                  }}
                  sx={{ borderRadius: 2, mb: 0.5, color: "white" }}
                >
                  <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                    <LoginIcon />
                  </ListItemIcon>
                  <ListItemText primary="Sign In" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    navigate("/sign-up");
                    setDrawerOpen(false);
                  }}
                  sx={{
                    borderRadius: 2,
                    bgcolor: "#FFD700",
                    color: "#0a1929",
                    "&:hover": { bgcolor: "#e6c200" },
                  }}
                >
                  <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                    <PersonAddIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Register"
                    primaryTypographyProps={{ fontWeight: 700 }}
                  />
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;
