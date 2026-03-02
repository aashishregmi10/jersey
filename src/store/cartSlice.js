import { createSlice } from "@reduxjs/toolkit";

const loadCart = () => {
  try {
    const data = localStorage.getItem("jp_cart");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveCart = (items) => {
  try {
    localStorage.setItem("jp_cart", JSON.stringify(items));
  } catch {
    // ignore
  }
};

// Helper: match cart items by composite key
const isSameItem = (a, b) =>
  a._id === b._id &&
  a.size === b.size &&
  (a.playerName || "") === (b.playerName || "") &&
  (a.playerNumber ?? null) === (b.playerNumber ?? null);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: loadCart(),
  },
  reducers: {
    addItem: (state, action) => {
      const {
        _id,
        size,
        name,
        price,
        discountPrice,
        team,
        primaryColor,
        secondaryColor,
        playerName = "",
        playerNumber = null,
        customizationPrice = 0,
      } = action.payload;

      const incoming = { _id, size, playerName, playerNumber };
      const existing = state.items.find((i) => isSameItem(i, incoming));

      if (existing) {
        existing.qty += 1;
      } else {
        state.items.push({
          _id,
          name,
          team,
          price: discountPrice ?? price,
          primaryColor: primaryColor || "#1565c0",
          secondaryColor: secondaryColor || "#FFFFFF",
          size,
          qty: 1,
          playerName,
          playerNumber,
          customizationPrice,
        });
      }
      saveCart(state.items);
    },

    removeItem: (state, action) => {
      state.items = state.items.filter((i) => !isSameItem(i, action.payload));
      saveCart(state.items);
    },

    updateQty: (state, action) => {
      const item = state.items.find((i) => isSameItem(i, action.payload));
      if (item) {
        item.qty = Math.max(1, action.payload.qty);
        saveCart(state.items);
      }
    },

    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("jp_cart");
    },
  },
});

export const { addItem, removeItem, updateQty, clearCart } = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) =>
  state.cart.items.reduce((acc, i) => acc + i.qty, 0);
export const selectCartTotal = (state) =>
  state.cart.items.reduce(
    (acc, i) => acc + (i.price + (i.customizationPrice ?? 0)) * i.qty,
    0,
  );

export default cartSlice.reducer;
