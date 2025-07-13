import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import AppProviders from "./components/AppProviders";
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Aurave Skincare | Unlock Your Radiance",
  description:
    "Experience the transformative power of nature and science with Aurave's luxurious, effective skincare designed to reveal your skin's natural luminosity.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased`}>
        {/* <Navbar /> */}
        <AppProviders>{children}</AppProviders>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
