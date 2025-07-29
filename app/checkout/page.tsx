"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, ShoppingBag } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { Button } from "../components/ui/button";
import getUserCity from "../helpers/getUserCity";

interface ShippingInfo {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

// -------------------- Subcomponents (moved outside main component) --------------------

const CheckoutProgress = ({ currentStep }: { currentStep: number }) => (
  <div className="flex justify-between items-center mb-6">
    {["Contact & Shipping", "Payment", "Confirmation"].map((label, index) => (
      <div key={index} className="flex items-center">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentStep > index + 1
              ? "bg-pink-600 text-white"
              : currentStep === index + 1
              ? "bg-pink-400 text-white"
              : "bg-gray-300 text-gray-600"
          }`}
        >
          {index + 1}
        </div>
        <span
          className={`ml-2 text-sm ${
            currentStep >= index + 1
              ? "text-pink-600 font-semibold"
              : "text-gray-500"
          }`}
        >
          {label}
        </span>
      </div>
    ))}
  </div>
);

const ContactInformationForm = ({
  formData,
  handleInputChange,
  errors,
}: {
  formData: ShippingInfo;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: Record<string, string>;
}) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">
      Contact Information
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {["email", "phone"].map((field) => (
        <div key={field}>
          <label
            htmlFor={field}
            className="block text-gray-700 mb-2 capitalize"
          >
            {field}
          </label>
          <input
            type="text"
            id={field}
            name={field}
            value={(formData as any)[field]}
            onChange={handleInputChange}
            className={`bg-white w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 ${
              errors[field] ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors[field] && (
            <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
          )}
        </div>
      ))}
    </div>
  </div>
);

const ShippingAddressForm = ({
  formData,
  handleInputChange,
  errors,
}: {
  formData: ShippingInfo;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: Record<string, string>;
}) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">
      Shipping Address
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[
        "firstName",
        "lastName",
        "address",
        "city",
        "state",
        "zipCode",
        "country",
      ].map((field) => (
        <div key={field}>
          <label
            htmlFor={field}
            className="block text-gray-700 mb-2 capitalize"
          >
            {field.replace(/([A-Z])/g, " $1")}
          </label>
          <input
            type="text"
            id={field}
            name={field}
            value={(formData as any)[field]}
            onChange={handleInputChange}
            className={`bg-white w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 ${
              errors[field] ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors[field] && (
            <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
          )}
        </div>
      ))}
    </div>
  </div>
);

const PaymentMethodSelection = ({
  paymentMethod,
  setPaymentMethod,
}: {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
}) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Method</h3>
    <div className="flex items-center">
      <input
        type="radio"
        id="cod"
        name="paymentMethod"
        value="cod"
        checked={paymentMethod === "cod"}
        onChange={(e) => setPaymentMethod(e.target.value)}
        className="mr-2"
      />
      <label htmlFor="cod" className="text-gray-700">
        Cash on Delivery
      </label>
    </div>
  </div>
);

const OrderSummary = ({
  items,
  totalPrice,
  tax,
  finalTotal,
  currency,
  formatPrice,
}: {
  items: any[];
  totalPrice: number;
  tax: number;
  finalTotal: number;
  currency: string;
  formatPrice: (price: number) => string;
}) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 elevation-4">
    <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
    <div className="space-y-2 max-h-80 overflow-y-auto">
      {items.map((item) => (
        <div key={item.id} className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">{item.name}</p>
            <p className="text-xs text-gray-500">
              {formatPrice(item.price)} x {item.quantity}
            </p>
          </div>
          <p className="text-sm">{formatPrice(item.price * item.quantity)}</p>
        </div>
      ))}
    </div>
    <div className="mt-6 border-t pt-4 space-y-2">
      <div className="flex justify-between">
        <span>Subtotal</span>
        <span>{formatPrice(totalPrice)}</span>
      </div>
      <div className="flex justify-between">
        <span>Shipping</span>
        <span>{formatPrice(1000)}</span>
      </div>
      <div className="flex justify-between">
        <span>Tax</span>
        <span>{formatPrice(tax)}</span>
      </div>
      <div className="flex justify-between font-bold text-pink-600">
        <span>Total</span>
        <span>{formatPrice(finalTotal)}</span>
      </div>
    </div>
  </div>
);

const OrderConfirmation = ({ orderNumber }: { orderNumber: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center max-w-lg w-full mt-24 mx-auto"
  >
    <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
      Order Confirmed!
    </h1>
    <p className="text-lg text-gray-600 mb-8">
      Thank you for your purchase. Your order{" "}
      <span className="font-semibold text-pink-600">{orderNumber}</span> has
      been successfully placed.
    </p>
    <div className="bg-pink-50 rounded-lg p-6 mb-8">
      <p className="text-sm text-gray-700">
        You will receive an email confirmation shortly with your order details.
        For Cash on Delivery orders, please have the exact amount ready.
      </p>
    </div>
    <Link href="/products">
      <Button
        size="lg"
        className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-8 py-3 rounded-full text-lg font-semibold flex items-center justify-center cursor-pointer"
      >
        <ShoppingBag className="h-5 w-5 mr-2" />
        Continue Shopping
      </Button>
    </Link>
  </motion.div>
);

const EmptyCartMessage = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-grow container mx-auto px-4 py-12 text-center">
      <h1 className="text-2xl font-semibold mb-4">Your cart is empty</h1>
      <Link
        href="/products"
        className="bg-pink-600 hover:bg-pink-700 text-white py-2 px-6 rounded-full"
      >
        Browse Products
      </Link>
    </main>
    <Footer />
  </div>
);

// -------------------- Main Checkout Component --------------------

const CheckoutPage = () => {
  const router = useRouter();
  const { cartItems } = useCart();
  const [step, setStep] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<string>("cod");
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false);
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [city, setCity] = useState<string | null>(null);
  const [hasTrackedPurchase, setHasTrackedPurchase] = useState(false);

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Pakistan",
    phone: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? 1000 : 0;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  const formatPrice = (price: number) => `PKR ${price.toLocaleString()}.00`;

  useEffect(() => {
    getUserCity().then((city) => {
      setCity(city);
    });
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!shippingInfo.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!shippingInfo.lastName.trim())
      newErrors.lastName = "Last name is required";
    if (!shippingInfo.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(shippingInfo.email))
      newErrors.email = "Invalid email format";
    if (!shippingInfo.phone.trim())
      newErrors.phone = "Phone number is required";
    if (!shippingInfo.address.trim()) newErrors.address = "Address is required";
    if (!shippingInfo.city.trim()) newErrors.city = "City is required";
    if (!shippingInfo.zipCode.trim())
      newErrors.zipCode = "Postal code is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (validateForm()) {
        setStep(2);
      }
    } else if (step === 2) {
      const randomOrderNumber = `ORD-${Math.floor(
        100000 + Math.random() * 900000
      )}`;
      setOrderNumber(randomOrderNumber);

      if (!hasTrackedPurchase && typeof window !== "undefined") {
        const pixelModule = await import("react-facebook-pixel");
        pixelModule.default.track("Purchase", {
          value: total,
          currency: "PKR",
          city: city || "Unknown",
          order_number: randomOrderNumber,
          payment_method: paymentMethod,
        });
        setHasTrackedPurchase(true);
      }

      setOrderPlaced(true);
      setStep(3);
    }
  };

  if (cartItems.length === 0 && step !== 3) return <EmptyCartMessage />;
  if (step === 3 && orderPlaced)
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-12">
          <OrderConfirmation orderNumber={orderNumber} />
        </main>
        <Footer />
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-accent via-accent-brand to-secondary-accent py-4 sm:pb-8 sm:pt-28">
      <main className="flex-grow container mx-auto px-3 sm:px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4"
          >
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#d7a7b1] font-serif">
                Checkout
              </h1>
              <p className="text-text-primary/70 mt-1 sm:mt-2 text-sm sm:text-base cursor-pointer">
                Complete your purchase
              </p>
            </div>
            <Link href="/cart">
              <button className="border-pink-400 text-pink-400 hover:bg-pink-400 hover:text-white text-sm sm:text-base px-3 sm:px-4 py-2 rounded-lg border cursor-pointer">
                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 inline" />
                Back to Cart
              </button>
            </Link>
          </motion.div>

          <div className="mb-6 sm:mb-8">
            <CheckoutProgress currentStep={step} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="lg:col-span-2 order-2 lg:order-1">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-[#fcf7f2] rounded-xl sm:rounded-2xl shadow-lg border border-accent-brand p-4 sm:p-6"
                  >
                    <ContactInformationForm
                      formData={shippingInfo}
                      handleInputChange={handleInputChange}
                      errors={errors}
                    />
                    <ShippingAddressForm
                      formData={shippingInfo}
                      handleInputChange={handleInputChange}
                      errors={errors}
                    />
                    <button
                      type="submit"
                      className="w-full mt-6 sm:mt-8 bg-gradient-to-r from-pink-600 to-pink-400 hover:from-pink-700 hover:to-pink-500 text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium text-sm sm:text-base cursor-pointer"
                    >
                      Continue to Payment
                    </button>
                  </motion.div>
                )}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-[#f9f1eb] rounded-xl sm:rounded-2xl shadow-lg border border-pink-300 p-4 sm:p-6"
                  >
                    <PaymentMethodSelection
                      paymentMethod={paymentMethod}
                      setPaymentMethod={setPaymentMethod}
                    />
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-6 sm:mt-8">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="w-full sm:flex-1 border-pink-400 text-pink-400 hover:bg-pink-400 hover:text-white py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border cursor-pointer"
                      >
                        Back to Shipping
                      </button>
                      <button
                        type="submit"
                        className="w-full sm:flex-1 bg-gradient-to-r from-pink-600 to-pink-400 hover:from-pink-700 hover:to-pink-500 text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium text-sm sm:text-base cursor-pointer"
                      >
                        Place Order (Cash on Delivery)
                      </button>
                    </div>
                  </motion.div>
                )}
              </form>
            </div>
            <div className="order-1 lg:order-2">
              <OrderSummary
                items={cartItems}
                totalPrice={subtotal}
                tax={tax}
                finalTotal={total}
                currency="PKR"
                formatPrice={formatPrice}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
