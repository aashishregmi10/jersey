import { Box, Button, Typography } from "@mui/material";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import { useNavigate } from "react-router-dom";

export const NotFoundScreen = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        bgcolor: "#f5f5f5",
      }}
    >
      <SportsSoccerIcon sx={{ fontSize: 80, color: "#1565c0", opacity: 0.4 }} />
      <Typography variant="h1" fontWeight={800} color="text.disabled">
        404
      </Typography>
      <Typography variant="h5" fontWeight={700}>
        Page Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Oops! The page you&apos;re looking for doesn&apos;t exist.
      </Typography>
      <Button variant="contained" onClick={() => navigate("/")}>
        Go Home
      </Button>
    </Box>
  );
};

export default NotFoundScreen;
