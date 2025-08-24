"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
// import ReactPixel from "react-facebook-pixel";
import getUserCity from "../helpers/getUserCity";

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  quantity: number;
  category?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  promoCode: string;
  addToCart: (
    productId: string,
    quantity?: number,
    meta?: Partial<CartItem>
  ) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  applyPromoCode: (code: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [city, setCity] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [discount, setDiscount] = useState<number>(0); // New state for discount
  const [promoCode, setPromoCode] = useState<string>(""); // New state for promo code

  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  useEffect(() => {
    async function fetchCity() {
      try {
        const userCity = await getUserCity();
        setCity(userCity);
      } catch (err) {
        console.error("Error fetching city:", err);
      }
    }
    fetchCity();
  }, []);

  // Fetch cart and discount on initial load
  useEffect(() => {
    const fetchCart = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/cart");

        if (!response.ok) {
          throw new Error("Failed to fetch cart");
        }

        const data = await response.json();
        setCartItems(data.items || []);
        // Assuming the API returns discount and promoCode if previously set
        setDiscount(data.discount || 0);
        setPromoCode(data.promoCode || "");
      } catch (err) {
        setError("Error loading cart. Please try again.");
        console.error("Error fetching cart:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, []);

  // Add item to cart
  const addToCart = async (
    productId: string,
    quantity = 1,
    meta?: Partial<CartItem>
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          quantity,
          ...meta,
        }),
      });

      const data = await response.json();
      setCartItems(data.cart || []);

      if (typeof window !== "undefined") {
        try {
          const pixelModule = await import("react-facebook-pixel");
          const ReactPixel = pixelModule.default;

          const totalValue = data.cart.reduce(
            (total: number, item: CartItem) =>
              total + item.price * item.quantity,
            0
          );

          ReactPixel.track("AddToCart", {
            content_ids: [productId],
            content_type: "product",
            value: totalValue,
            content_name: meta?.name || "Product",
            currency: "PKR",
            city: city ?? "Unknown",
            quantity: quantity,
          });
        } catch (pixelError) {
          console.error("Meta Pixel tracking failed (AddToCart):", pixelError);
        }
      }
    } catch (err) {
      // Handle error if needed
    } finally {
      setIsLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (id: string, quantity: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, quantity }),
      });

      if (!response.ok) {
        throw new Error("Failed to update cart");
      }

      const data = await response.json();
      setCartItems(data.cart || []);
    } catch (err) {
      setError("Error updating cart. Please try again.");
      console.error("Error updating cart:", err);
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
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove item from cart");
      }

      const data = await response.json();
      setCartItems(data.cart || []);
    } catch (err) {
      setError("Error removing item from cart. Please try again.");
      console.error("Error removing from cart:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear all items from cart and reset discount
  const clearCart = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/cart/clear", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to clear cart");
      }

      const data = await response.json();
      setCartItems(data.cart || []);
      setDiscount(0); // Reset discount on clear
      setPromoCode("");
    } catch (err) {
      setError("Error clearing cart. Please try again.");
      console.error("Error clearing cart:", err);
      // Fallback: clear cart locally if API fails
      setCartItems([]);
      setDiscount(0);
      setPromoCode("");
    } finally {
      setIsLoading(false);
    }
  };

  // Apply promo code and calculate discount
  const applyPromoCode = async (code: string) => {
    setIsLoading(true);
    try {
      const subtotal = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      let newDiscount = 0;

      if (code.toLowerCase() === "aurave20") {
        newDiscount = subtotal * 0.2; // 20% discount
      } else {
        newDiscount = 0; // Reset discount for invalid code
        setError("Invalid promo code");
        setPromoCode("");
      }

      // Update discount and promo code locally
      setDiscount(newDiscount);
      setPromoCode(code);

      // Optionally sync with API (uncomment and implement API endpoint if needed)
      // await fetch("/api/cart/apply-promo", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ promoCode: code, discount: newDiscount }),
      // });
    } catch (err) {
      setError("Error applying promo code. Please try again.");
      console.error("Error applying promo code:", err);
      setDiscount(0);
      setPromoCode("");
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    cartItems,
    itemCount,
    subtotal,
    discount,
    promoCode,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    applyPromoCode,
    isLoading,
    error,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
