import { useState } from "react";
import {
  Box,
  Container,
  Grid,
  InputAdornment,
  MenuItem,
  Pagination,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import { useGetProductsQuery } from "store/productApi";
import ProductCard from "components/ProductCard";
import ProductCardSkeleton from "components/ProductCardSkeleton";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "top-rated", label: "Top Rated" },
];

const ShopScreen = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  const { data, isLoading } = useGetProductsQuery({
    page,
    limit: 12,
    search: search || undefined,
  });

  const products = data?.products ?? [];
  const totalPages = data?.totalPages ?? 1;

  // Client-side sort (backend returns by createdAt desc)
  const sorted = [...products].sort((a, b) => {
    const priceA = a.discountPrice ?? a.price;
    const priceB = b.discountPrice ?? b.price;
    if (sort === "price-low") return priceA - priceB;
    if (sort === "price-high") return priceB - priceA;
    if (sort === "top-rated") return b.rating - a.rating;
    return 0; // newest — already sorted
  });

  return (
    <Box sx={{ bgcolor: "#ffffff", minHeight: "80vh" }}>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Header */}
        <Typography variant="h5" sx={{ fontWeight: 700, color: "#333", mb: 2 }}>
          FIFA World Cup 2026 Jerseys
        </Typography>

        {/* Search + Sort bar */}
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            mb: 2.5,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <TextField
            size="small"
            placeholder="Search jerseys..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 20, color: "#999" }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              flex: 1,
              bgcolor: "white",
              borderRadius: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
              },
            }}
          />
          <Select
            size="small"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            sx={{ minWidth: 180, bgcolor: "white", borderRadius: 1 }}
          >
            {SORT_OPTIONS.map((o) => (
              <MenuItem key={o.value} value={o.value}>
                {o.label}
              </MenuItem>
            ))}
          </Select>
        </Box>

        {/* Product grid */}
        <Grid container spacing={1.5}>
          {isLoading
            ? Array.from({ length: 12 }).map((_, i) => (
                <Grid size={{ xs: 6, sm: 4, md: 3 }} key={i}>
                  <ProductCardSkeleton />
                </Grid>
              ))
            : sorted.map((product) => (
                <Grid size={{ xs: 6, sm: 4, md: 3 }} key={product._id}>
                  <ProductCard product={product} />
                </Grid>
              ))}
        </Grid>

        {/* Empty state */}
        {!isLoading && products.length === 0 && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <SportsSoccerIcon sx={{ fontSize: 64, color: "#ddd", mb: 1 }} />
            <Typography sx={{ color: "#999", fontSize: 15 }}>
              No jerseys found. Try a different search.
            </Typography>
          </Box>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, v) => setPage(v)}
              color="primary"
              shape="rounded"
            />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ShopScreen;
