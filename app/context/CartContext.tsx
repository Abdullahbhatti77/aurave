'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  itemCount: number;
  subtotal: number;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Fetch cart on initial load
  useEffect(() => {
    const fetchCart = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/cart');
        
        if (!response.ok) {
          throw new Error('Failed to fetch cart');
        }
        
        const data = await response.json();
        setCartItems(data.items || []);
      } catch (err) {
        setError('Error loading cart. Please try again.');
        console.error('Error fetching cart:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCart();
  }, []);

  // Add item to cart
  const addToCart = async (productId: string, quantity = 1) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }
      
      const data = await response.json();
      setCartItems(data.cart || []);
    } catch (err) {
      setError('Error adding item to cart. Please try again.');
      console.error('Error adding to cart:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (id: string, quantity: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, quantity }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update cart');
      }
      
      const data = await response.json();
      setCartItems(data.cart || []);
    } catch (err) {
      setError('Error updating cart. Please try again.');
      console.error('Error updating cart:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Remove item from cart
  const removeItem = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/cart?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove item from cart');
      }
      
      const data = await response.json();
      setCartItems(data.cart || []);
    } catch (err) {
      setError('Error removing item from cart. Please try again.');
      console.error('Error removing from cart:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    cartItems,
    itemCount,
    subtotal,
    addToCart,
    updateQuantity,
    removeItem,
    isLoading,
    error,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}