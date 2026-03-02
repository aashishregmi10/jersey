import { lazy, Suspense } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

/**
 * JerseyCustomizer — lazy-loading wrapper around the WebGL 3D viewer.
 *
 * Props: primaryColor, secondaryColor, playerName, playerNumber,
 *        width, height, variant, autoFlip
 */

const JerseyViewer3D = lazy(() => import("./JerseyViewer3D"));

const JerseyCustomizer = (props) => {
  const { width = 280, height = 340, variant = "default" } = props;
  const isHero = variant === "hero";

  return (
    <Suspense
      fallback={
        <Box
          sx={{
            width,
            height,
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 4,
            bgcolor: isHero ? "rgba(255,255,255,0.06)" : "#f5f8fc",
            border: isHero
              ? "1px solid rgba(255,255,255,0.12)"
              : "1px solid #e8ecf0",
          }}
        >
          <CircularProgress
            size={32}
            sx={{ color: isHero ? "#FFD700" : "#1565c0", mb: 1.5 }}
          />
          <Typography
            variant="caption"
            sx={{
              color: isHero ? "rgba(255,255,255,0.5)" : "#1565c0",
              fontWeight: 600,
              fontSize: 11,
              letterSpacing: 1,
            }}
          >
            Loading 3D Viewer…
          </Typography>
        </Box>
      }
    >
      <JerseyViewer3D {...props} />
    </Suspense>
  );
};

export default JerseyCustomizer;
