import { createSlice } from '@reduxjs/toolkit';

const apiSlice = createSlice({
  name: 'apiData',
  initialState: {
    menu: [],
    categories: [],
    loading: false,
    error: null
  },
  reducers: {
    setMenuData: (state, action) => {
      state.menu = action.payload;
    },
    setCategoriesData: (state, action) => {
      state.categories = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { setMenuData, setCategoriesData, setLoading, setError } = apiSlice.actions;
export default apiSlice.reducer; 