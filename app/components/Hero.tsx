"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Star, Shield, Truck, Heart, Zap } from "lucide-react";
import { Button } from "../components/ui/button";
import { useCart } from "../context/CartContext";
// import ReactPixel from "react-facebook-pixel";
import getUserCity from "../helpers/getUserCity";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  reviews: number;
}

const HomePage = () => {
  const { addToCart, isLoading } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [city, setCity] = useState<string | null>(null);

  // Meta Pixel PageView tracking
  // useEffect(() => {
  //   ReactPixel.track("PageView");
  // }, []);
  // Fetch city on client
  useEffect(() => {
    getUserCity().then((city) => {
      setCity(city);
    });
  }, []);

  // Fetch featured products from API
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products?featured=true", {
          next: { revalidate: 3600 }, // Cache for 1 hour
        });
        if (res.ok) {
          const data = await res.json();
          setFeaturedProducts(data);
        } else {
          // Fallback to static data if API fails
          setFeaturedProducts([
            {
              id: "1",
              name: "Radiance Renewal Serum",
              price: 25000.0,
              originalPrice: 33000.0,
              image:
                "https://images.unsplash.com/photo-1635865165118-917ed9e20936",
              rating: 4.9,
              reviews: 234,
            },
            {
              id: "2",
              name: "Hydrating Night Cream",
              price: 18000.0,
              originalPrice: 24000.0,
              image:
                "https://images.unsplash.com/photo-1635865165118-917ed9e20936",
              rating: 4.8,
              reviews: 189,
            },
            {
              id: "3",
              name: "Vitamin C Brightening Mask",
              price: 12500.0,
              originalPrice: 16500.0,
              image:
                "https://images.unsplash.com/photo-1635865165118-917ed9e20936",
              rating: 4.7,
              reviews: 156,
            },
          ]);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    }
    fetchProducts();
  }, []);

  const benefits = [
    {
      icon: Shield,
      title: "Clinically Proven",
      description: "Dermatologist-tested formulas for visible, safe results.",
    },
    {
      icon: Heart,
      title: "Pure Ingredients",
      description: "Crafted with the finest natural and organic botanicals.",
    },
    {
      icon: Truck,
      title: "Swift Delivery",
      description: "Free, fast shipping on all orders across Pakistan.",
    },
  ];

  const handleAddToCart = async (product: Product) => {
    addToCart(product.id, 1, {
      name: product.name,
      image: product.image,
      price: product.price,
      originalPrice: product.originalPrice,
    });

    if (typeof window !== "undefined") {
      try {
        const pixelModule = await import("react-facebook-pixel");
        const ReactPixel = pixelModule.default;

        ReactPixel.track("AddToCart", {
          content_name: product.name,
          content_ids: [product.id],
          value: product.price,
          currency: "PKR",
          city: city ?? "Unknown",
        });
      } catch (error) {
        console.error("Meta Pixel tracking failed (AddToCart):", error);
      }
    }
  };

  return (
    <div className="min-h-screen text-stone-800">
      <section className="relative overflow-hidden py-40 md:py-32 hero-bg-light">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-amber-500/10 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                  className="text-5xl lg:text-6xl font-extrabold leading-tight text-stone-900"
                >
                  Unlock Your Radiance
                  <span className="block text-gradient-theme mt-2">
                    With Aurave Skincare
                  </span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xl text-stone-600 leading-relaxed"
                >
                  Experience the transformative power of nature and science.
                  Aurave offers luxurious, effective skincare designed to reveal
                  your skin's natural luminosity.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link href="/products">
                  <Button
                    size="xl"
                    className="button-primary-gradient pulse-glow-themed rounded-full px-8 py-4 text-lg font-semibold shadow-lg cursor-pointer"
                  >
                    Shop Collection
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                    variant="outline"
                    size="xl"
                    className="button-outline-themed rounded-full px-8 py-4 text-lg font-semibold shadow-sm cursor-pointer"
                  >
                    Learn More
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="relative"
            >
              <div className="floating-animation">
                <Image
                  className="w-full h-auto rounded-3xl shadow-2xl object-cover aspect-[4/3]"
                  alt="Beautiful model with glowing skin holding an Aurave product"
                  src="https://images.unsplash.com/photo-1608134606883-276926be640c"
                  width={400}
                  height={300}
                />
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute -bottom-8 -left-8 bg-white rounded-2xl p-6 shadow-xl border border-rose-100"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900">
                      4.9/5 Stars
                    </p>
                    <p className="text-sm text-stone-600">
                      From 2,500+ Happy Customers
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-stone-900 mb-4">
              The Aurave Promise
            </h2>
            <p className="text-lg text-stone-600 max-w-3xl mx-auto">
              We are committed to delivering exceptional skincare that you can
              trust. Here's what sets Aurave apart:
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="text-center p-8 rounded-2xl bg-gradient-to-br from-rose-50 to-amber-50 hover:shadow-2xl transition-all duration-300 product-card-hover border border-rose-100"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-rose-500 to-amber-500 rounded-full mb-6 shadow-lg">
                  <benefit.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-stone-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gradient-to-br from-stone-100 via-rose-50 to-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-stone-900 mb-4">
              Our Featured Elixirs
            </h2>
            <p className="text-lg text-stone-600 max-w-3xl mx-auto">
              Handpicked favorites loved by our community for their
              transformative results.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.2, duration: 0.7 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden product-card-hover flex flex-col"
              >
                <Link href={`/product/${product.id}`} className="block">
                  <div className="relative">
                    <Image
                      className="w-full h-72 object-cover"
                      alt={product.name}
                      src={product.image}
                      width={300}
                      height={216}
                    />
                    <div className="absolute top-4 right-4 bg-rose-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-md">
                      Save PKR{" "}
                      {(product.originalPrice - product.price).toFixed(0)}
                    </div>
                  </div>
                </Link>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center mb-2">
                    <div className="flex text-amber-400 mr-2">
                      {[...Array(Math.floor(product.rating))].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                      {product.rating % 1 !== 0 && (
                        <Star
                          key="half"
                          className="h-4 w-4 fill-current opacity-50"
                        />
                      )}
                    </div>
                    <span className="text-sm text-stone-600">
                      {product.rating.toFixed(1)} ({product.reviews} reviews)
                    </span>
                  </div>

                  <Link href={`/product/${product.id}`}>
                    <h3 className="text-xl font-semibold text-stone-900 mb-2 hover:text-rose-600 transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-baseline space-x-2 mb-4">
                    <span className="text-2xl font-bold text-rose-600">
                      PKR {product.price.toFixed(2)}
                    </span>
                    <span className="text-md text-stone-500 line-through">
                      PKR {product.originalPrice.toFixed(2)}
                    </span>
                  </div>

                  <Button
                    onClick={() => handleAddToCart(product)}
                    disabled={isLoading} // Add disabled state for better UX
                    className="w-full mt-auto button-primary-gradient rounded-full py-3 text-md font-semibold cursor-pointer"
                  >
                    {isLoading ? "Adding..." : "Add to Cart"}{" "}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mt-16"
          >
            <Link href="/products">
              <Button
                variant="outline"
                size="xl"
                className="button-outline-themed rounded-full px-10 py-4 text-lg font-semibold shadow-sm cursor-pointer"
              >
                Explore All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gradient-to-r from-rose-600 to-amber-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <Zap className="w-16 h-16 mx-auto text-amber-300" />
            <h2 className="text-4xl font-bold text-white">
              Join the Aurave Glow
            </h2>
            <p className="text-xl text-rose-100">
              Subscribe for exclusive skincare insights, early access to new
              arrivals, and special promotions.
            </p>
            <form
              className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-5 py-3.5 rounded-full border-0 focus:ring-2 focus:ring-white/80 outline-none text-stone-800 placeholder-stone-500 bg-white"
                required
              />
              <Button
                type="submit"
                className="bg-white text-rose-600 hover:bg-rose-50 px-8 py-3.5 rounded-full font-semibold shadow-md transition-transform hover:scale-105"
              >
                Subscribe Now
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
