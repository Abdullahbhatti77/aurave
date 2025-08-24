"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import axios from "axios";

const CartPage = () => {
  const {
    cartItems = [],
    updateQuantity,
    removeItem,
    applyPromoCode,
    // clearCart,
    isLoading,
  } = useCart() || {};

  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");
  const [promoCodeEnabled, setPromoCodeEnabled] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get("/api/promocode", {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("auraveUserToken") || ""
            }`, // Optional token
          },
        });
        setPromoCodeEnabled(res.data.enabled);
      } catch (err) {
        console.error("Error fetching promo code status:", err);
        setPromoCodeEnabled(false);
      }
    };
    fetchStatus();
  }, []);

  const handleApplyPromoCode = () => {
    if (promoCode.toLowerCase() === "aurave20") {
      const subtotal = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      setDiscount(subtotal * 0.2);
      applyPromoCode(promoCode);
      setPromoSuccess("Promo code applied successfully!");
      setPromoError("");
      console.log("Promo applied:", { subtotal, discount: subtotal * 0.2 });
    } else {
      setPromoError("Invalid promo code");
      setPromoSuccess("");
      setDiscount(0);
      console.log("Invalid promo code"); // Debug
    }
  };

  const handleQuantityChange = (
    id: string,
    newQuantity: number,
    name: string
  ) => {
    console.log("Quantity change:", { id, newQuantity, name }); // Debug
    if (newQuantity === 0) {
      removeItem(id);
      console.log(`Item removed: ${name}`);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleRemoveItem = (id: string, name: string) => {
    console.log("Remove item:", { id, name }); // Debug
    removeItem(id);
  };

  const handleClearCart = () => {
    console.log("Clearing cart"); // Debug
    // clearCart();
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  // const shipping = subtotal > 0 ? 1000 : 0;
  const shipping = 0;
  const total = subtotal + shipping - discount;

  const formatPrice = (price: number) => `PKR ${price.toLocaleString()}.00`;

  // Fallback UI if cartItems is undefined or empty
  if (!cartItems) {
    return (
      <div className="min-h-screen bg-gray-100 pb-16 pt-32">
        {/* <Navbar /> */}
        <main className="flex-grow">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Loading Cart...
            </h1>
            <p className="text-lg text-gray-600 mt-4">
              Cart context is not available. Please check CartContext setup.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-block bg-pink-600 text-white px-8 py-3 rounded-full"
            >
              Start Shopping
            </Link>
          </div>
        </main>
        {/* <Footer /> */}
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 pb-16 pt-32">
        {/* <Navbar /> */}
        <main className="flex-grow">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="space-y-6">
              <svg
                className="h-24 w-24 text-gray-300 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h1 className="text-3xl font-bold text-gray-900">
                Your cart is empty
              </h1>
              <p className="text-lg text-gray-600">
                Looks like you haven't added any products to your cart yet.
              </p>
              <Link
                href="/products"
                className="inline-block bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-8 py-3 rounded-full"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        </main>
        {/* <Footer /> */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 pb-8 pt-28">
      {/* <Navbar /> */}
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Shopping Cart
              </h1>
              <p className="text-gray-600 mt-2">
                {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in
                your cart
              </p>
            </div>
            <button
              onClick={handleClearCart}
              disabled={isLoading}
              className="border border-red-300 text-red-600 hover:bg-red-50 px-4 py-2 rounded-full disabled:opacity-50"
            >
              Clear Cart
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-lg p-6"
                >
                  <div className="flex items-center space-x-4">
                    <Image
                      src={item.image || "/placeholder.jpg"} // Fallback image
                      alt={item.name}
                      width={80}
                      height={80}
                      className="w-20 h-20 object-cover rounded-lg"
                      onError={() =>
                        console.log(`Image failed to load for ${item.name}`)
                      } // Debug
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.name}
                      </h3>
                      <div className="flex items-center mt-2">
                        <span className="text-pink-600 font-bold">
                          {formatPrice(item.price)}
                        </span>
                        <span className="text-gray-500 text-sm line-through ml-2">
                          {formatPrice(item.originalPrice)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.id,
                              item.quantity - 1,
                              item.name
                            )
                          }
                          disabled={isLoading}
                          className="p-2 hover:bg-gray-100 rounded-l-lg disabled:opacity-50"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M20 12H4"
                            />
                          </svg>
                        </button>
                        <span className="px-4 py-2 border-x border-gray-300 min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.id,
                              item.quantity + 1,
                              item.name
                            )
                          }
                          disabled={isLoading}
                          className="p-2 hover:bg-gray-100 rounded-r-lg disabled:opacity-50"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="text-right min-w-[6rem]">
                        <p className="font-semibold text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id, item.name)}
                        disabled={isLoading}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {promoCodeEnabled && (
                <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Have a promo code?
                  </h2>
                  <div className="flex">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter promo code"
                      className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                    />
                    <button
                      onClick={handleApplyPromoCode}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-4 py-2 rounded-r-lg disabled:opacity-50"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-red-500 text-sm mt-2">{promoError}</p>
                  )}
                  {promoSuccess && (
                    <p className="text-green-500 text-sm mt-2">
                      {promoSuccess}
                    </p>
                  )}
                  {/* <p className="text-gray-600 text-sm mt-2">
                  Try "AURAVE20" for 20% off your order
                </p> */}
                </div>
              )}
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Order Summary
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-pink-600">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <Link href="/checkout" className="block">
                  <button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white py-3 rounded-full text-lg font-semibold cursor-pointer">
                    Proceed to Checkout
                  </button>
                </Link>
                <Link href="/products">
                  <button className="w-full border border-pink-300 hover:bg-pink-50 text-pink-600 py-2 rounded-full flex items-center justify-center cursor-pointer">
                    <svg
                      className="h-4 w-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                    Continue Shopping
                  </button>
                </Link>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Secure Checkout
                  </span>
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Free Returns
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default CartPage;
