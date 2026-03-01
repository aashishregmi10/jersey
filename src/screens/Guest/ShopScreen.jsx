import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  TextField,
  Typography,
  Badge,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { addItem, selectCartCount } from "store/cartSlice";

const API = import.meta.env.VITE_API_URL;

const LEAGUES = [
  "All",
  "FIFA World Cup 2026",
  "Premier League",
  "La Liga",
  "Serie A",
  "Bundesliga",
  "Ligue 1",
];

const ShopScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartCount);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [league, setLeague] = useState("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12 });
      if (search) params.set("search", search);
      if (league !== "All") params.set("league", league);

      const { data } = await axios.get(`${API}/products?${params}`);
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [search, league, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleAddToCart = (product) => {
    const defaultSize = product.sizes?.[0] ?? "M";
    dispatch(addItem({ ...product, size: defaultSize }));
    toast.success(`${product.name} added to cart!`, { autoClose: 1500 });
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f6fa" }}>
      {/* ── Navbar ── */}
      <Box
        sx={{
          bgcolor: "#0a1929",
          px: { xs: 2, md: 4 },
          py: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          <SportsSoccerIcon sx={{ color: "#FFD700" }} />
          <Typography variant="h6" fontWeight={700} color="white">
            Jersey Pasal
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton
            sx={{ color: "white" }}
            onClick={() => navigate("/cart")}
          >
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          <Button
            variant="outlined"
            size="small"
            sx={{ color: "white", borderColor: "white" }}
            onClick={() => navigate("/sign-in")}
          >
            Sign In
          </Button>
        </Stack>
      </Box>

      <Container sx={{ py: 4 }}>
        {/* ── Page Title ── */}
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Jersey Shop
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={3}>
          Browse our collection of official jerseys
        </Typography>

        {/* ── Filters ── */}
        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            mb: 4,
            alignItems: "center",
          }}
        >
          <TextField
            size="small"
            placeholder="Search team or jersey…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ flex: "1 1 220px", bgcolor: "white", borderRadius: 1 }}
          />
          <FormControl size="small" sx={{ minWidth: 180, bgcolor: "white" }}>
            <InputLabel>League</InputLabel>
            <Select
              value={league}
              label="League"
              onChange={(e) => { setLeague(e.target.value); setPage(1); }}
            >
              {LEAGUES.map((l) => (
                <MenuItem key={l} value={l}>
                  {l}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" sx={{ height: 40 }}>
            Search
          </Button>
          {(search || league !== "All") && (
            <Button
              variant="text"
              color="secondary"
              onClick={() => {
                setSearch("");
                setSearchInput("");
                setLeague("All");
                setPage(1);
              }}
            >
              Clear
            </Button>
          )}
        </Box>

        {/* ── Products Grid ── */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress />
          </Box>
        ) : products.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <SportsSoccerIcon sx={{ fontSize: 64, color: "#ccc" }} />
            <Typography variant="h6" color="text.secondary" mt={2}>
              No jerseys found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try a different search or filter
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: 2,
                    transition: "all 0.2s",
                    "&:hover": { boxShadow: 6, transform: "translateY(-4px)" },
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardMedia
                    sx={{
                      height: 200,
                      cursor: "pointer",
                      background:
                        product.images?.[0]?.url
                          ? undefined
                          : "linear-gradient(135deg, #0a1929 50%, #1565c0 50%)",
                      bgcolor: product.images?.[0]?.url ? undefined : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    image={product.images?.[0]?.url}
                    onClick={() => navigate(`/product/${product._id}`)}
                  >
                    {!product.images?.[0]?.url && (
                      <SportsSoccerIcon
                        sx={{ fontSize: 80, color: "rgba(255,255,255,0.4)" }}
                      />
                    )}
                  </CardMedia>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight={700}
                      sx={{ cursor: "pointer" }}
                      onClick={() => navigate(`/product/${product._id}`)}
                    >
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.team}
                    </Typography>
                    <Chip
                      label={product.league}
                      size="small"
                      sx={{ mt: 0.5, mb: 1, fontSize: 10 }}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 1,
                      }}
                    >
                      <Box>
                        {product.discountPrice ? (
                          <>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ textDecoration: "line-through" }}
                            >
                              Rs. {product.price.toLocaleString()}
                            </Typography>
                            <Typography
                              variant="h6"
                              color="error"
                              fontWeight={700}
                            >
                              Rs. {product.discountPrice.toLocaleString()}
                            </Typography>
                          </>
                        ) : (
                          <Typography
                            variant="h6"
                            color="primary"
                            fontWeight={700}
                          >
                            Rs. {product.price.toLocaleString()}
                          </Typography>
                        )}
                      </Box>
                      <IconButton
                        color="primary"
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                        title="Add to cart"
                      >
                        <AddShoppingCartIcon />
                      </IconButton>
                    </Box>
                    {product.stock === 0 && (
                      <Chip
                        label="Out of Stock"
                        color="error"
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, val) => setPage(val)}
              color="primary"
            />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ShopScreen;
