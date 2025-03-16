"use client";
import Head from 'next/head';
import { Inter } from "next/font/google";
import "./globals.css";
import "./style.css";
import "./mobile.style.css";
import "@/hooks/smoothscroll";
import { Provider } from "react-redux";
import store, { persistor } from "../../store/store"; // import persistor here
import { PersistGate } from "redux-persist/integration/react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap" rel="stylesheet" />
      </Head>
      <body className={inter.className}>
        <main>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              {children}
            </PersistGate>
          </Provider>
        </main>
      </body>
    </html>
  );
}
