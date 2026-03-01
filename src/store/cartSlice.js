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

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: loadCart(),
  },
  reducers: {
    addItem: (state, action) => {
      const { _id, size, name, price, discountPrice, images, team } =
        action.payload;
      const existing = state.items.find(
        (i) => i._id === _id && i.size === size,
      );
      if (existing) {
        existing.qty += 1;
      } else {
        state.items.push({
          _id,
          name,
          team,
          price: discountPrice ?? price,
          image: images?.[0]?.url ?? null,
          size,
          qty: 1,
        });
      }
      saveCart(state.items);
    },

    removeItem: (state, action) => {
      const { _id, size } = action.payload;
      state.items = state.items.filter(
        (i) => !(i._id === _id && i.size === size),
      );
      saveCart(state.items);
    },

    updateQty: (state, action) => {
      const { _id, size, qty } = action.payload;
      const item = state.items.find(
        (i) => i._id === _id && i.size === size,
      );
      if (item) {
        item.qty = Math.max(1, qty);
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
  state.cart.items.reduce((acc, i) => acc + i.price * i.qty, 0);

export default cartSlice.reducer;
