import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import AppProviders from "./components/AppProviders";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "AuraVè Skincare | Unlock Your Radiance",
  description:
    "Experience the transformative power of nature and science with AuraVè's luxurious, effective skincare designed to reveal your skin's natural luminosity.",
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/favicon.png", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
  metadataBase: new URL("https://officialaurave.com"),
  openGraph: {
    title: "AuraVè",
    description:
      "Experience the transformative power of nature and science. AuraVè offers luxurious, effective skincare designed to reveal your skin's natural luminosity.",
    url: "https://officialaurave.com",
    siteName: "AuraVè",
    locale: "en_US",
    type: "website",
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
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
