import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: {} },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const key = item.slug; // Always use slug as the key
      
      if (!key) return; // Don't add if no slug
      
      // If item exists, update quantity
      if (state.items[key]) {
        state.items[key].quantity = item.quantity;
      } else {
        // If new item, add it
        state.items[key] = {
          slug: item.slug,
          name: item.name,
          price: Number(item.price),
          quantity: item.quantity,
          image: item.image,
          description: item.description
        };
      }
    },
    removeFromCart: (state, action) => {
      const key = action.payload;
      if (state.items[key]) {
        delete state.items[key];
      }
    },
    clearCart: (state) => {
      state.items = {};
    },
    resetCart: () => {
      return { items: {} }; // Reset to initial state
    }
  },
});

export const { addToCart, removeFromCart, clearCart, resetCart } = cartSlice.actions;
export default cartSlice.reducer;
