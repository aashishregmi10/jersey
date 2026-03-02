import { createSlice } from "@reduxjs/toolkit";

// ─── Persisted state ─────────────────────────────────────────────────────────
const storedUser = localStorage.getItem("jp_user")
  ? JSON.parse(localStorage.getItem("jp_user"))
  : null;
const storedToken = localStorage.getItem("jp_token") || null;

// ─── Slice ────────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser,
    token: storedToken,
  },
  reducers: {
    // Called after a successful login / register RTK Query mutation
    setCredentials(state, action) {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      localStorage.setItem("jp_user", JSON.stringify(user));
      localStorage.setItem("jp_token", token);
    },
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("jp_user");
      localStorage.removeItem("jp_token");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
