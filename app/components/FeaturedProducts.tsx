'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '../context/CartContext';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  savings: number;
  image: string;
  rating: number;
  reviewCount: number;
}

const FeaturedProducts = () => {
  const { addToCart, isLoading } = useCart();
  const [products] = useState<Product[]>([
    {
      id: '1',
      name: 'Radiance Renewal Serum',
      description: 'Revitalize your skin with our powerful serum',
      price: 25000,
      originalPrice: 33000,
      savings: 8000,
      image: '/product1.jpg',
      rating: 4.9,
      reviewCount: 234
    },
    {
      id: '2',
      name: 'Hydrating Night Cream',
      description: 'Deep moisture for overnight skin repair',
      price: 18000,
      originalPrice: 24000,
      savings: 6000,
      image: '/product2.jpg',
      rating: 4.8,
      reviewCount: 189
    },
    {
      id: '3',
      name: 'Vitamin C Brightening Mask',
      description: 'Illuminate your complexion with vitamin C',
      price: 12500,
      originalPrice: 16500,
      savings: 4000,
      image: '/product3.jpg',
      rating: 4.7,
      reviewCount: 156
    }
  ]);

  const formatPrice = (price: number) => {
    return `PKR ${price.toLocaleString()}.00`;
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-white text-center mb-2">Our Featured Elixirs</h2>
        <p className="text-gray-400 text-center mb-12">Handpicked favorites loved by our community for their transformative results.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <div className="relative">
                <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
                  Save PKR {product.savings.toLocaleString()}
                </div>
                <Image
                  src={product.image}
                  alt={product.name}
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-2">
                  {renderStars(product.rating)}
                  <span className="text-gray-400 text-sm ml-2">{product.rating} ({product.reviewCount} reviews)</span>
                </div>
                <h3 className="text-xl font-semibold text-amber-400 mb-2">{product.name}</h3>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-white text-xl font-bold">{formatPrice(product.price)}</span>
                    <span className="text-gray-400 text-sm line-through ml-2">{formatPrice(product.originalPrice)}</span>
                  </div>
                </div>
                <button 
                  onClick={() => addToCart(product.id)}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-medium py-2 px-4 rounded-full transition-colors relative"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding...
                    </span>
                  ) : (
                    'Add to Cart'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link 
            href="/products" 
            className="inline-flex items-center text-amber-400 hover:text-amber-300 border border-amber-400 hover:border-amber-300 px-6 py-3 rounded-full transition-colors"
          >
            Explore All Products
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;