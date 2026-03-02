import { Box, Card, Skeleton } from "@mui/material";

const ProductCardSkeleton = () => {
  return (
    <Card
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        border: "1px solid #f0f0f0",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Skeleton
        variant="rectangular"
        sx={{ height: { xs: 160, sm: 200 } }}
        animation="wave"
      />
      <Box sx={{ p: 1.5 }}>
        <Skeleton variant="text" width="80%" height={20} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width="50%" height={22} sx={{ mb: 0.3 }} />
        <Skeleton variant="text" width="35%" height={16} sx={{ mb: 1.5 }} />
        <Skeleton variant="rounded" height={32} animation="wave" />
      </Box>
    </Card>
  );
};

export default ProductCardSkeleton;
