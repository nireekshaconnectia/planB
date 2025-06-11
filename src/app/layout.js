import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import "./style.css";
import "./mobile.style.css";
import logo from "@/assets/logo.png";

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({
  weight: ["400","500","600", "700"],
  subsets: ["latin"],
  display: "swap",
});

// export const metadata = {
//   title: 'Plan B Coffee',
//   description: 'Plan B Coffee - Your perfect coffee destination',
//   keywords: 'coffee, cafe, plan b, coffee shop, study room',
//   authors: [
//     { name: 'Plan B Coffee' },
//     { name: 'Weblexia', url: 'https://weblexia.in' }
//   ],
//   viewport: 'width=device-width, initial-scale=1',
//   robots: 'index, follow',
//   openGraph: {
//     title: 'Plan B Coffee',
//     description: 'Plan B Coffee - Your perfect coffee destination',
//     type: 'website',
//     locale: 'en_US',
//   },
// };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${poppins.className}`}>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
