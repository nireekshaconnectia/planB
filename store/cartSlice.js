import { createSlice } from "@reduxjs/toolkit";

// Load initial state from localStorage if available
const loadInitialState = () => {
  if (typeof window !== 'undefined') {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? { items: JSON.parse(savedCart) } : { items: {} };
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return { items: {} };
    }
  }
  return { items: {} };
};

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: {} },
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
        description: item.description
      };

      // Save to localStorage after each update
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(state.items));
      }
    },
    removeFromCart: (state, action) => {
      const key = action.payload;
      delete state.items[key];
      
      // Save to localStorage after each update
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(state.items));
      }
    },
    clearCart: (state) => {
      state.items = {};
      
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cart');
      }
    },
    setCart: (state, action) => {
      state.items = action.payload;
      
      // Save to localStorage after setting cart
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(action.payload));
      }
    }
  },
});

export const { addToCart, removeFromCart, clearCart, setCart } = cartSlice.actions;
export default cartSlice.reducer;
