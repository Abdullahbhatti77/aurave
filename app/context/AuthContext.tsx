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
  ) => Promise<{
    user: any; success: boolean; error?: string 
}>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  isAdmin: false,
  login: async () => ({ user: null, success: false, error: "Not implemented" }),
  logout: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // console.log("Session status:", status, "Session data:", session); // Debug
    if (status === "loading") {
      setIsLoading(true);
    } else {
      setIsLoading(false);
      if (session?.user) {
        const mappedUser: User = {
          id: (session.user as any).id || "",
          name: session.user.name || "Unknown",
          email: session.user.email || "",
          role: (session.user as any).role || "user",
        };
        setUser(mappedUser);
      } else {
        setUser(null);
      }
    }
  }, [session, status]);

  const login = async (email: string, password: string) => {
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (res?.ok) {
        // After signIn, session will be updated by next-auth, so we can use the current user state
        return { user, success: true };
      } else {
        return { user: null, success: false, error: res?.error || "Login failed" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { user: null, success: false, error: "An unexpected error occurred" };
    }
  };

  const logout = async () => {
    try {
      await signOut({ redirect: false });
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isAuthenticated = !!user && status === "authenticated";
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthenticated, isAdmin, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
