import { configureStore, combineReducers, createSlice } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";

// Language slice
const languageSlice = createSlice({
  name: "language",
  initialState: { lang: "en" }, // Default language
  reducers: {
    setLanguage: (state, action) => {
      state.lang = action.payload;
    },
  },
});

export const { setLanguage } = languageSlice.actions;

// Combine reducers
const rootReducer = combineReducers({
  cart: cartReducer,
  language: languageSlice.reducer, // Add language reducer
});

// Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["language"], // Persist only language state
};

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create persistor
export const persistor = persistStore(store);
export default store;
