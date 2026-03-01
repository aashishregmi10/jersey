import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ─── Mock credentials ───────────────────────────────────────────────────────
// Replace these API calls with real backend calls later
const MOCK_USERS = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@jersey.com",
    password: "admin123",
    role: "admin",
  },
];

// Simulates an API call
const fakeDelay = (ms = 600) => new Promise((res) => setTimeout(res, ms));

// ─── Thunks ──────────────────────────────────────────────────────────────────
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    await fakeDelay();
    const found = MOCK_USERS.find(
      (u) => u.email === email && u.password === password,
    );
    if (found) {
      const { password: _, ...user } = found;
      return { user, token: `mock-token-${user.id}` };
    }
    // Any other email/password combo → customer
    if (email && password) {
      const user = {
        id: Date.now().toString(),
        name: email.split("@")[0],
        email,
        role: "customer",
      };
      return { user, token: `mock-token-${user.id}` };
    }
    return rejectWithValue("Invalid credentials");
  },
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ name, email, password }, { rejectWithValue }) => {
    await fakeDelay();
    if (!name || !email || !password)
      return rejectWithValue("All fields required");
    const user = {
      id: Date.now().toString(),
      name,
      email,
      role: "customer",
    };
    return { user, token: `mock-token-${user.id}` };
  },
);

// ─── Slice ────────────────────────────────────────────────────────────────────
const storedUser = localStorage.getItem("jp_user")
  ? JSON.parse(localStorage.getItem("jp_user"))
  : null;
const storedToken = localStorage.getItem("jp_token") || null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser,
    token: storedToken,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("jp_user");
      localStorage.removeItem("jp_token");
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => {
      state.loading = true;
      state.error = null;
    };
    const rejected = (state, action) => {
      state.loading = false;
      state.error = action.payload || "Something went wrong";
    };
    const fulfilled = (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("jp_user", JSON.stringify(action.payload.user));
      localStorage.setItem("jp_token", action.payload.token);
    };
    builder
      .addCase(loginUser.pending, pending)
      .addCase(loginUser.fulfilled, fulfilled)
      .addCase(loginUser.rejected, rejected)
      .addCase(registerUser.pending, pending)
      .addCase(registerUser.fulfilled, fulfilled)
      .addCase(registerUser.rejected, rejected);
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
