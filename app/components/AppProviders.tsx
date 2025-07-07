"use client";

import { SessionProvider } from "next-auth/react";
import { Providers } from "@/app/providers";
import { AuthProvider } from "@/app/context/AuthContext";
import { CartProvider } from "@/app/context/CartContext";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <Providers>
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </Providers>
    </SessionProvider>
  );
}
