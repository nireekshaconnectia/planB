import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import "./style.css";
import "./mobile.style.css";
import logo from "@/assets/logo.png";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: 'Plan B Coffee',
  description: 'Plan B Coffee - Your perfect coffee destination',
  keywords: 'coffee, cafe, plan b, coffee shop, study room',
  authors: [
    { name: 'Plan B Coffee' }
  ],
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
    other: {
      rel: "icon",
      url: "/favicon.ico",
    },
    sizes: [16,32],
  },
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'Plan B Coffee',
    description: 'Plan B Coffee - Your perfect coffee destination',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${poppins.className}`}>
        <main>{children}</main>
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyBay68RGitmM3lQf3APu-XD_GJIMj9i1Tw&libraries=places`}
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
