import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import popupReducer from "./popupSlice"; // 👈 Make sure this is imported
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

// SSR-Safe storage
const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};

const storage = typeof window !== "undefined"
  ? createWebStorage("local")
  : createNoopStorage();

// ✅ Add popup slice here
const rootReducer = combineReducers({
  cart: cartReducer,
  popup: popupReducer, // 👈 Now redux knows about popup slice
});

// Persist Config
const persistConfig = {
  key: "root",
  storage,
};

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store config
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Persistor for PersistGate
export const persistor = persistStore(store);