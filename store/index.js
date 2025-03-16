import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import { persistReducer, persistStore } from "redux-persist";
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";

// Combine your reducers (in case you add more later)
const rootReducer = combineReducers({
  cart: cartReducer,
});

// Setup persist config
const persistConfig = {
  key: "root",
  storage,
};

// Enhance rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create persistor for PersistGate
export const persistor = persistStore(store);
