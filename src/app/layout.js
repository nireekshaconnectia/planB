"use client";
import { Inter, Poppins } from "next/font/google";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { SessionProvider } from "next-auth/react";
import store, { persistor } from "../../store/store";
import LanguageWrapper from "@/components/LanguageWrapper"; // New wrapper component
import "./globals.css";
import "./style.css";
import "./mobile.style.css";
import "@/hooks/smoothscroll";

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${poppins.className}`}>
        <main>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <SessionProvider>
                <LanguageWrapper>{children}</LanguageWrapper>
              </SessionProvider>
            </PersistGate>
          </Provider>
        </main>
      </body>
    </html>
  );
}
