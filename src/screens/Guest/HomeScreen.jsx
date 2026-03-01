import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

const JERSEYS = [
  {
    id: 1,
    team: "Brazil",
    league: "FIFA World Cup",
    color: "#FFD700",
    bg: "#009C3B",
    price: "Rs. 1,200",
  },
  {
    id: 2,
    team: "Argentina",
    league: "FIFA World Cup",
    color: "#74ACDF",
    bg: "#003087",
    price: "Rs. 1,200",
  },
  {
    id: 3,
    team: "France",
    league: "FIFA World Cup",
    color: "#FFFFFF",
    bg: "#002395",
    price: "Rs. 1,200",
  },
  {
    id: 4,
    team: "Germany",
    league: "FIFA World Cup",
    color: "#000000",
    bg: "#FFFFFF",
    price: "Rs. 1,200",
  },
  {
    id: 5,
    team: "England",
    league: "FIFA World Cup",
    color: "#CF081F",
    bg: "#FFFFFF",
    price: "Rs. 1,200",
  },
  {
    id: 6,
    team: "Spain",
    league: "FIFA World Cup",
    color: "#AA151B",
    bg: "#F1BF00",
    price: "Rs. 1,200",
  },
];

const FEATURES = [
  {
    icon: <SportsSoccerIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
    title: "Official Quality",
    desc: "Premium fabric used by real clubs",
  },
  {
    icon: <EmojiEventsIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
    title: "World Cup 2026",
    desc: "All 48 nations available",
  },
  {
    icon: <LocalShippingIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
    title: "Fast Delivery",
    desc: "Delivered across Nepal in 3–5 days",
  },
];

const HomeScreen = () => {
  const navigate = useNavigate();

  return (
    <Box>
      {/* ── Navbar ── */}
      <Box
        sx={{
          bgcolor: "#0a1929",
          px: 4,
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
        </Box>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            size="small"
            sx={{ color: "white", borderColor: "white" }}
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
              "&:hover": { bgcolor: "#e6c200" },
            }}
            onClick={() => navigate("/sign-up")}
          >
            Register
          </Button>
        </Stack>
      </Box>

      {/* ── Hero ── */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #0a1929 0%, #1565c0 100%)",
          py: { xs: 8, md: 14 },
          textAlign: "center",
          color: "white",
          px: 2,
        }}
      >
        <Chip
          label="FIFA World Cup 2026 🏆"
          sx={{
            bgcolor: "#FFD700",
            color: "#0a1929",
            fontWeight: 700,
            mb: 3,
            fontSize: 14,
          }}
        />
        <Typography
          variant="h2"
          fontWeight={800}
          gutterBottom
          sx={{ fontSize: { xs: "2rem", md: "3.5rem" } }}
        >
          Official World Cup Jerseys
        </Typography>
        <Typography
          variant="h6"
          sx={{ opacity: 0.8, mb: 4, maxWidth: 520, mx: "auto" }}
        >
          Get your favourite team&apos;s jersey for the biggest football event
          of 2026. Delivered to your doorstep across Nepal.
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: "#FFD700",
              color: "#0a1929",
              fontWeight: 700,
              px: 4,
              "&:hover": { bgcolor: "#e6c200" },
            }}
          >
            Shop Now
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{ color: "white", borderColor: "white", px: 4 }}
            onClick={() => navigate("/sign-up")}
          >
            Join Us
          </Button>
        </Stack>
      </Box>

      {/* ── Features ── */}
      <Container sx={{ py: 6 }}>
        <Grid container spacing={4} justifyContent="center">
          {FEATURES.map((f) => (
            <Grid item xs={12} sm={4} key={f.title}>
              <Box textAlign="center">
                {f.icon}
                <Typography variant="h6" fontWeight={700} mt={1}>
                  {f.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {f.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ── Jersey Cards ── */}
      <Box sx={{ bgcolor: "#f5f5f5", py: 6 }}>
        <Container>
          <Typography
            variant="h4"
            fontWeight={700}
            textAlign="center"
            gutterBottom
          >
            Featured Jerseys
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            color="text.secondary"
            mb={4}
          >
            Representing all 48 nations of FIFA World Cup 2026
          </Typography>
          <Grid container spacing={3}>
            {JERSEYS.map((j) => (
              <Grid item xs={12} sm={6} md={4} key={j.id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: 3,
                    "&:hover": {
                      boxShadow: 6,
                      transform: "translateY(-4px)",
                      transition: "all 0.2s",
                    },
                  }}
                >
                  <CardMedia
                    sx={{
                      height: 200,
                      background: `linear-gradient(135deg, ${j.bg} 50%, ${j.color} 50%)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <SportsSoccerIcon
                      sx={{ fontSize: 80, color: "rgba(255,255,255,0.4)" }}
                    />
                  </CardMedia>
                  <CardContent>
                    <Typography variant="h6" fontWeight={700}>
                      {j.team}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {j.league}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 2,
                      }}
                    >
                      <Typography variant="h6" color="primary" fontWeight={700}>
                        {j.price}
                      </Typography>
                      <Button variant="contained" size="small">
                        Add to Cart
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── Footer ── */}
      <Box sx={{ bgcolor: "#0a1929", py: 4, textAlign: "center" }}>
        <Typography color="grey.500" variant="body2">
          © 2026 Jersey Pasal — Your #1 source for FIFA World Cup 2026 Jerseys
          in Nepal
        </Typography>
      </Box>
    </Box>
  );
};

export default HomeScreen;
