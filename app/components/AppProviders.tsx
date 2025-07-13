"use client";

import { SessionProvider } from "next-auth/react";
import { Providers } from "@/app/providers";
import { AuthProvider } from "@/app/context/AuthContext";
import { CartProvider } from "@/app/context/CartContext";
import Navbar from "./Navbar";
import Footer from "./Footer";

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
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </Providers>
    </SessionProvider>
  );
}
