'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

const CheckoutPage = () => {
  const router = useRouter();
  const { cartItems, removeItem } = useCart();
  const [activeStep, setActiveStep] = useState<number>(1);
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false);
  const [orderNumber, setOrderNumber] = useState<string>('');
  
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Pakistan',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 1000 : 0;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  const formatPrice = (price: number) => `PKR ${price.toLocaleString()}.00`;

  const validateShippingInfo = () => {
    const newErrors: Record<string, string> = {};
    if (!shippingInfo.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!shippingInfo.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!shippingInfo.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(shippingInfo.email)) newErrors.email = 'Invalid email format';
    if (!shippingInfo.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!shippingInfo.address.trim()) newErrors.address = 'Address is required';
    if (!shippingInfo.city.trim()) newErrors.city = 'City is required';
    if (!shippingInfo.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateShippingInfo()) {
      const randomOrderNumber = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
      setOrderNumber(randomOrderNumber);
      setOrderPlaced(true);
      setActiveStep(2);
      // TODO: Save order in backend using API later
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleContinueShopping = () => {
    router.push('/products');
  };

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-semibold mb-4">Your cart is empty</h1>
          <Link href="/products" className="bg-pink-600 hover:bg-pink-700 text-white py-2 px-6 rounded-full">
            Browse Products
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              {activeStep === 1 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-semibold mb-6">Shipping Info (Cash on Delivery)</h2>
                  <form onSubmit={handleShippingSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'postalCode'].map(field => (
                        <div key={field}>
                          <label htmlFor={field} className="block text-gray-700 mb-2 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                          <input
                            type="text"
                            id={field}
                            name={field}
                            value={(shippingInfo as any)[field]}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 ${errors[field] ? 'border-red-500' : 'border-gray-300'}`}
                          />
                          {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
                        </div>
                      ))}
                    </div>
                    <button
                      type="submit"
                      className="mt-8 bg-pink-600 hover:bg-pink-700 text-white py-2 px-6 rounded-full"
                    >
                      Place Order
                    </button>
                  </form>
                </div>
              )}
              {activeStep === 2 && orderPlaced && (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <h2 className="text-2xl font-semibold text-green-600 mb-2">Order Confirmed!</h2>
                  <p className="mb-4">Your order <strong>{orderNumber}</strong> has been placed with Cash on Delivery.</p>
                  <p><strong>Shipping Address:</strong> {shippingInfo.address}, {shippingInfo.city}</p>
                  <button
                    onClick={handleContinueShopping}
                    className="mt-6 bg-pink-600 hover:bg-pink-700 text-white py-2 px-6 rounded-full"
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">{formatPrice(item.price)} x {item.quantity}</p>
                      </div>
                      <p className="text-sm">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 border-t pt-4 space-y-2">
                  <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                  <div className="flex justify-between"><span>Shipping</span><span>{formatPrice(shipping)}</span></div>
                  <div className="flex justify-between"><span>Tax</span><span>{formatPrice(tax)}</span></div>
                  <div className="flex justify-between font-bold text-pink-600"><span>Total</span><span>{formatPrice(total)}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
