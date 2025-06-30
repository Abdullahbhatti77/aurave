'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  isAdmin: false,
  login: async () => ({ success: false, error: 'Not implemented' }),
  logout: async () => {}
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  // Simulate loading user from localStorage on client side
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock authentication - in a real app, this would be an API call
      if (email === 'admin@example.com' && password === 'admin123') {
        const adminUser = {
          id: '1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin'
        };
        setUser(adminUser);
        localStorage.setItem('user', JSON.stringify(adminUser));
        
        // Set a cookie for server-side auth checks (middleware)
        document.cookie = 'user_auth=true; path=/; max-age=2592000'; // 30 days
        
        return { success: true, user: adminUser };
      } else if (email === 'user@example.com' && password === 'user123') {
        const regularUser = {
          id: '2',
          name: 'Regular User',
          email: 'user@example.com',
          role: 'user'
        };
        setUser(regularUser);
        localStorage.setItem('user', JSON.stringify(regularUser));
        
        // Set a cookie for server-side auth checks (middleware)
        document.cookie = 'user_auth=true; path=/; max-age=2592000'; // 30 days
        
        return { success: true, user: regularUser };
      }
      return { success: false, error: 'Invalid credentials' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('user');
    
    // Remove the auth cookie
    document.cookie = 'user_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};