"use client";

import { SessionProvider } from "next-auth/react";
import { Providers } from "@/app/providers";
import { AuthProvider } from "@/app/context/AuthContext";
import { CartProvider } from "@/app/context/CartContext";
import CookieBanner from "./CookieBanner";
import Footer from "./Footer";
import dynamic from "next/dynamic";

// Dynamic import for Navbar
const Navbar = dynamic(() => import("./Navbar"), {
  ssr: false, // Disable server-side rendering if needed
  loading: () => <div className="h-16 bg-gray-100 animate-pulse" />, // Optional loading component
});

const FacebookPixel = dynamic(() => import("./MetaPixel"), {
  ssr: false,
});

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <Providers>
        <AuthProvider>
          <CartProvider>
            <FacebookPixel />
            <CookieBanner />
            <Navbar />

            <main className="flex-grow">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </Providers>
    </SessionProvider>
  );
}
