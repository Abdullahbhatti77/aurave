"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { signIn, signOut, useSession } from "next-auth/react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  isAdmin: false,
  login: async () => ({ success: false, error: "Not implemented" }),
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (session?.user) {
      const mappedUser: User = {
        id: (session.user as any).id,
        name: session.user.name || "",
        email: session.user.email || "",
        role: (session.user as any).role || "user",
      };
      setUser(mappedUser);
    } else {
      setUser(null);
    }
  }, [session]);

  const login = async (email: string, password: string) => {
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.ok) {
      return { success: true };
    } else {
      return { success: false, error: res?.error || "Login failed" };
    }
  };

  const logout = async () => {
    await signOut({ redirect: false });
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";
  const isLoading = status === "loading";

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthenticated, isAdmin, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
