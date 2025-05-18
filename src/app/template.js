"use client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { SessionProvider } from "next-auth/react";
import { store, persistor } from "../../store/index";
import LanguageWrapper from "@/components/LanguageWrapper";
import CartInitializer from "@/components/cart/CartInitializer";
import "@/hooks/smoothscroll";

export default function Template({ children }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SessionProvider>
          <LanguageWrapper>
            <CartInitializer />
            {children}
          </LanguageWrapper>
        </SessionProvider>
      </PersistGate>
    </Provider>
  );
} 