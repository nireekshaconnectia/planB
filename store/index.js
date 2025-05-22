import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import cartReducer from "./cartSlice";
import popupReducer from "./popupSlice";
import { persistReducer, persistStore } from "redux-persist";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import languageReducer from "./languageSlice";
import apiReducer from "./apiSlice";

// ✅ SSR-safe storage fallback
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

// ✅ Combine your reducers
const rootReducer = combineReducers({
  cart: cartReducer,
  popup: popupReducer,
  language: languageReducer,
  apiData: apiReducer,
});

// ✅ redux-persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart", "language"],
  blacklist: ["popup"], // Don't persist popup state
};

// ✅ Wrap reducer with persistence
const persistedReducer = persistReducer(persistConfig, rootReducer);

// ✅ Create store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// ✅ Create persistor
export const persistor = persistStore(store);
