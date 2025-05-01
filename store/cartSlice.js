import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: {} },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      state.items[item.foodSlug] = item;
    },
    removeFromCart: (state, action) => {
      delete state.items[action.payload];
    },
    clearCart: (state) => {
      state.items = {}; // 🔁 Clears the cart completely
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
