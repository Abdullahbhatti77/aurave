'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
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
  category: string;
  featured?: boolean;
  stock?: number;
}

const ProductsPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('search')?.toLowerCase() || '';

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const { addToCart, isLoading } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'serums', name: 'Serums' },
    { id: 'moisturizers', name: 'Moisturizers' },
    { id: 'masks', name: 'Masks' },
    { id: 'cleansers', name: 'Cleansers' },
    { id: 'toners', name: 'Toners' }
  ];

  const formatPrice = (price: number) => `PKR ${price.toLocaleString()}.00`;

  const renderStars = (rating: number) => (
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

  const filteredProducts = products
    .filter(product =>
      selectedCategory === 'all' || product.category === selectedCategory
    )
    .filter(product =>
      query === '' || product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query)
    );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <div className="bg-gradient-to-r from-pink-100 to-pink-200 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center">Our Products</h1>
            <p className="text-gray-600 text-center mt-4 max-w-2xl mx-auto">
              Discover our range of premium skincare products designed to reveal your skin's natural radiance.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="w-full md:w-1/4">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Categories</h2>
                <ul className="space-y-2">
                  {categories.map(category => (
                    <li key={category.id}>
                      <button
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left py-2 px-3 rounded-md transition-colors ${
                          selectedCategory === category.id ? 'bg-pink-100 text-pink-600' : 'hover:bg-gray-100'
                        }`}
                      >
                        {category.name}
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-gray-200 my-6 pt-6">
                  <h2 className="text-xl font-semibold mb-4">Sort By</h2>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="w-full md:w-3/4">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-500 text-lg">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-4 rounded-full transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="relative bg-white rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105 group"
                    >
                      {/* Image Glow Background */}
                      <div className="relative w-full h-64 overflow-hidden">
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 blur-2xl z-0 bg-gradient-to-br from-yellow-400 to-orange-500"></div>
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={400}
                          height={300}
                          className="w-full h-full object-cover z-10 relative"
                        />
                        <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded z-20">
                          Save PKR {product.savings.toLocaleString()}
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-6 relative z-10 bg-white">
                        <div className="flex items-center mb-2">
                          {renderStars(product.rating)}
                          <span className="text-gray-500 text-sm ml-2">
                            {product.rating} ({product.reviewCount} reviews)
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
                        <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <span className="text-pink-600 text-xl font-bold">{formatPrice(product.price)}</span>
                            <span className="text-gray-500 text-sm line-through ml-2">{formatPrice(product.originalPrice)}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => addToCart(product.id)}
                          disabled={isLoading}
                          className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-medium py-2 px-4 rounded-full transition-colors"
                        >
                          {isLoading ? 'Adding...' : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {sortedProducts.length === 0 && !loading && !error && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No products found in this category or search.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductsPage;
