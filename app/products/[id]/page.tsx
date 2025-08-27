"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  ArrowLeft,
  ImageMinus as MinusIcon,
  FolderPlus as PlusIcon,
} from "lucide-react";
import { Stethoscope } from "lucide-react";

import { Button } from "../../components/ui/button";
import { useCart } from "@/app/context/CartContext";
import { toast } from "../../components/ui/use-toast";
import getUserCity from "../../helpers/getUserCity";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  description: string;
  shortDescription: string;
  ingredients: string[];
  benefits: string[];
  howToUse: string;
  images: string[];
  sku: string;
  availability: string;
  image: string;
  savings: number;
  category: string;
  featured: boolean;
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [city, setCity] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    getUserCity().then((city: any) => {
      setCity(city);
    });
  }, []);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        // const response = await fetch(`/api/products/${id}`);
        const response = await fetch(`/api/products?id=${id}`);

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "Product not found"
              : "Failed to fetch product"
          );
        }
        const data: Product = await response.json();
        setProduct(data);
        console.log("Fetched product:", data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = async (product: Product) => {
    addToCart(product.id, quantity, {
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

  const handleWishlist = () => {
    toast({
      title:
        "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
      className:
        "bg-rose-500 dark:bg-amber-600 text-white dark:text-stone-900 border-0",
    });
  };

  const handleShare = () => {
    toast({
      title:
        "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
      className:
        "bg-rose-500 dark:bg-amber-600 text-white dark:text-stone-900 border-0",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-100 via-rose-50 to-amber-100 dark:from-stone-900 dark:via-neutral-800 dark:to-rose-950">
        <p className="text-lg text-stone-600 dark:text-rose-200">Loading...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-100 via-rose-50 to-amber-100 dark:from-stone-900 dark:via-neutral-800 dark:to-rose-950">
        <p className="text-lg text-rose-600 dark:text-amber-400">
          {error || "Product not found"}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-rose-50 to-amber-100 dark:from-stone-900 dark:via-neutral-800 dark:to-rose-950 py-8 md:pt-32 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 text-sm text-stone-600 dark:text-rose-300 mb-8"
        >
          <Link
            href="/"
            className="hover:text-rose-600 dark:hover:text-amber-400"
          >
            Home
          </Link>
          <span>/</span>
          <Link
            href="/products"
            className="hover:text-rose-600 dark:hover:text-amber-400"
          >
            Products
          </Link>
          <span>/</span>
          <span className="text-stone-800 dark:text-rose-100 font-medium">
            {product.name}
          </span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="space-y-5"
          >
            <div className="relative aspect-square rounded-2xl shadow-2xl overflow-hidden border border-rose-100 dark:border-stone-700">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImageIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={product?.image}
                    alt={`${product?.name} - View ${selectedImageIndex + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={selectedImageIndex === 0}
                  />
                </motion.div>
              </AnimatePresence>
              <div className="absolute top-4 right-4 bg-rose-500 dark:bg-amber-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-md">
                Save PKR {product.savings.toFixed(0)}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {product?.images?.map((imageDesc, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index
                      ? "border-rose-500 dark:border-amber-500 ring-2 ring-rose-500/50 dark:ring-amber-500/50"
                      : "border-rose-200 dark:border-stone-600 hover:border-rose-400 dark:hover:border-amber-400"
                  }`}
                >
                  <Image
                    src={imageDesc}
                    alt={`Thumbnail ${product.name} view ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="100px"
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-stone-900 dark:text-white mb-3">
                {product.name}
              </h1>
              <p className="text-lg text-rose-600 dark:text-amber-400 font-medium mb-3">
                {product.shortDescription}
              </p>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <div className="flex text-amber-400 dark:text-amber-500 mr-2">
                    {[...Array(Math.floor(product.rating))].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                    {product.rating % 1 !== 0 && (
                      <Star
                        key="half"
                        className="h-5 w-5 fill-current opacity-60"
                      />
                    )}
                  </div>
                  <span className="text-stone-600 dark:text-rose-300">
                    {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                  </span>
                </div>
                <span className="text-sm text-green-600 dark:text-green-400 font-semibold">
                  {product.availability}
                </span>
              </div>

              <div className="flex items-baseline space-x-3 mb-6">
                <span className="text-4xl font-bold text-rose-600 dark:text-amber-400">
                  PKR {product.price.toFixed(2)}
                </span>
                <span className="text-xl text-stone-500 dark:text-rose-300 line-through">
                  PKR {product.originalPrice.toFixed(2)}
                </span>
                <span className="bg-rose-100 dark:bg-amber-800 text-rose-700 dark:text-amber-200 px-3 py-1 rounded-full text-sm font-semibold">
                  {Math.round(
                    ((product.originalPrice - product.price) /
                      product.originalPrice) *
                      100
                  )}
                  % OFF
                </span>
              </div>

              <p className="text-stone-600 dark:text-rose-200 leading-relaxed mb-6">
                {product.description}
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-stone-700 dark:text-rose-200">
                  Quantity:
                </span>
                <div className="flex items-center border border-rose-300 dark:border-stone-600 rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-rose-100 dark:hover:bg-stone-700 text-stone-700 dark:text-rose-200 rounded-r-none"
                  >
                    <MinusIcon className="h-4 w-4" />
                  </Button>
                  <span className="px-5 py-2 text-lg font-semibold text-stone-800 dark:text-white tabular-nums min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-rose-100 dark:hover:bg-stone-700 text-stone-700 dark:text-rose-200 rounded-l-none"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => handleAddToCart(product)}
                  size="xl"
                  className="flex-1 button-primary-gradient rounded-full py-3.5 text-lg font-semibold shadow-lg cursor-pointer"
                >
                  Add to Cart - PKR {(product.price * quantity).toFixed(2)}
                </Button>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="iconLg"
                    onClick={handleWishlist}
                    className="p-3.5 button-outline-themed rounded-full aspect-square"
                  >
                    <Heart className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="outline"
                    size="iconLg"
                    onClick={handleShare}
                    className="p-3.5 button-outline-themed rounded-full aspect-square"
                  >
                    <Share2 className="h-6 w-6" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-t border-rose-200 dark:border-stone-700">
              {[
                { icon: Truck, text: "Free Shipping nationwide" },
                { icon: Shield, text: "Secure & Encrypted Payment" },
                { icon: Stethoscope, text: "Dermatologist Recommended" },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center space-x-3 p-3 bg-rose-50 dark:bg-stone-800 rounded-lg"
                >
                  <item.icon className="h-6 w-6 text-rose-600 dark:text-amber-400 flex-shrink-0" />
                  <p className="text-sm text-stone-600 dark:text-rose-200">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
            {/* <p className="text-xs text-stone-500 dark:text-rose-400">
              SKU: {product.sku}
            </p> */}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-16 md:mt-24"
        >
          <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-stone-900 dark:text-white mb-8 text-center">
              Product Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              <div>
                <h3 className="text-xl font-semibold text-rose-700 dark:text-amber-400 mb-4">
                  Key Benefits
                </h3>
                <ul className="space-y-2">
                  {product?.benefits?.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <Star className="h-4 w-4 text-amber-500 dark:text-amber-300 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-stone-600 dark:text-rose-200">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-rose-700 dark:text-amber-400 mb-4">
                  Key Ingredients
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product?.ingredients?.map((ingredient, index) => (
                    <span
                      key={index}
                      className="bg-rose-100 dark:bg-stone-700 text-rose-800 dark:text-amber-300 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-rose-700 dark:text-amber-400 mb-4">
                  How to Use
                </h3>
                <p className="text-stone-600 dark:text-rose-200 leading-relaxed">
                  {product?.howToUse}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Link href="/products">
            <Button
              variant="outline"
              size="lg"
              className="button-outline-themed rounded-full px-8 py-3 text-lg"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to All Products
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
