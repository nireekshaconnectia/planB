"use client";
import Head from "next/head";
import { Inter } from "next/font/google";
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

export default function RootLayout({ children }) {
  return (
    <html>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className={inter.className}>
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
