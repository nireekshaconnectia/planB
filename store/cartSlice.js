import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: {} }, // Keep this static
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const key = item.slug;

      if (!key) return;

      state.items[key] = {
        slug: item.slug,
        name: item.name,
        price: Number(item.price),
        quantity: item.quantity,
        image: item.image,
        description: item.description,
      };
    },
    removeFromCart: (state, action) => {
      delete state.items[action.payload];
    },
    clearCart: (state) => {
      state.items = {};
    },
    setCart: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { addToCart, removeFromCart, clearCart, setCart } = cartSlice.actions;
export default cartSlice.reducer;
