import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import EditIcon from "@mui/icons-material/Edit";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { useNavigate } from "react-router-dom";
import { useGetProductsQuery } from "store/productApi";
import ProductCard from "components/ProductCard";
import ProductCardSkeleton from "components/ProductCardSkeleton";
import JerseyCustomizer from "components/JerseyCustomizer";

const STEPS = [
  {
    icon: <CheckroomIcon sx={{ fontSize: 40, color: "#1565c0" }} />,
    title: "Pick a Jersey",
    desc: "Browse our FIFA World Cup 2026 collection",
  },
  {
    icon: <EditIcon sx={{ fontSize: 40, color: "#1565c0" }} />,
    title: "Add Name & Number",
    desc: "Personalize with your name and favourite number",
  },
  {
    icon: <LocalShippingIcon sx={{ fontSize: 40, color: "#1565c0" }} />,
    title: "We Print & Deliver",
    desc: "Custom printed and shipped to your doorstep",
  },
];

const HomeScreen = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetProductsQuery({ limit: 50, page: 1 });
  const products = data?.products ?? [];

  return (
    <Box sx={{ bgcolor: "#ffffff", minHeight: "80vh" }}>
      {/* ── Hero Section ── */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #1565c0 0%, #1e88e5 50%, #1976d2 100%)",
          color: "white",
          py: { xs: 6, md: 8 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="overline"
                sx={{
                  color: "#FFD700",
                  fontWeight: 700,
                  letterSpacing: 2,
                  mb: 1,
                  display: "block",
                }}
              >
                FIFA World Cup 2026
              </Typography>
              <Typography
                variant="h3"
                fontWeight={900}
                sx={{
                  fontSize: { xs: "2rem", md: "2.8rem" },
                  lineHeight: 1.2,
                  mb: 2,
                }}
              >
                Design Your Own{" "}
                <Box component="span" sx={{ color: "#FFD700" }}>
                  Jersey
                </Box>
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "rgba(255,255,255,0.8)",
                  fontWeight: 400,
                  mb: 1,
                  fontSize: { xs: "1rem", md: "1.15rem" },
                }}
              >
                Add your custom name &amp; number to any jersey.
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255,255,255,0.6)",
                  mb: 3,
                  fontSize: { xs: 14, md: 15 },
                }}
              >
                Custom printing for just{" "}
                <strong style={{ color: "#FFD700" }}>Rs. 200</strong> — make it
                truly yours.
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate("/shop")}
                  sx={{
                    bgcolor: "#FFD700",
                    color: "#0a1929",
                    fontWeight: 700,
                    textTransform: "none",
                    px: 4,
                    "&:hover": { bgcolor: "#e6c200" },
                  }}
                >
                  Shop Now
                </Button>
              </Stack>
            </Grid>

            {/* Hero Jersey Preview */}
            <Grid
              size={{ xs: 12, md: 6 }}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <JerseyCustomizer
                primaryColor="#DC143C"
                secondaryColor="#003893"
                playerName="YOUR NAME"
                playerNumber={10}
                width={300}
                height={360}
                variant="hero"
                autoFlip
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── How It Works ── */}
      <Box sx={{ bgcolor: "#f5f8fc", py: 5 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h5"
            fontWeight={800}
            textAlign="center"
            mb={4}
            sx={{ color: "#0a1929" }}
          >
            How It Works
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {STEPS.map((step, idx) => (
              <Grid size={{ xs: 12, sm: 4 }} key={idx}>
                <Box
                  sx={{
                    textAlign: "center",
                    p: 3,
                    bgcolor: "white",
                    borderRadius: 3,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    height: "100%",
                  }}
                >
                  <Box
                    sx={{
                      width: 72,
                      height: 72,
                      borderRadius: "50%",
                      bgcolor: "rgba(21,101,192,0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    {step.icon}
                  </Box>
                  <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {step.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── Product Grid ── */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: "#333", mb: 2 }}>
          For You
        </Typography>

        <Grid container spacing={1.5}>
          {isLoading
            ? Array.from({ length: 12 }).map((_, i) => (
                <Grid size={{ xs: 6, sm: 4, md: 3 }} key={i}>
                  <ProductCardSkeleton />
                </Grid>
              ))
            : products.map((product) => (
                <Grid size={{ xs: 6, sm: 4, md: 3 }} key={product._id}>
                  <ProductCard product={product} />
                </Grid>
              ))}
        </Grid>

        {!isLoading && products.length === 0 && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <SportsSoccerIcon sx={{ fontSize: 64, color: "#ddd", mb: 1 }} />
            <Typography sx={{ color: "#999", fontSize: 15 }}>
              No jerseys available yet. Check back soon!
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default HomeScreen;
