"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Filter, Grid, List, X, Search, ChevronDown } from "lucide-react";
import { useCart } from "../context/CartContext";
import { Button } from "../components/ui/button";
// import { Slider } from "../components/ui/slider";
import getUserCity from "../helpers/getUserCity";

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

const ProductsContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchTermFromQuery = searchParams.get("search")?.toLowerCase() || "";
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 50000]);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [searchTerm, setSearchTerm] = useState<string>(searchTermFromQuery);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart, isLoading } = useCart();
  const [city, setCity] = useState<string | null>(null);

  const allCategories = [
    { id: "serum", name: "Serums" },
    { id: "moisturizers", name: "Moisturizers" },
    { id: "cleansers", name: "Cleansers" },
    { id: "masks", name: "Masks" },
    { id: "suncare", name: "Sun Care" },
  ];

  useEffect(() => {
    getUserCity().then((city) => {
      setCity(city);
    });
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/products");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (!searchTerm) return;

    const timeout = setTimeout(async () => {
      if (typeof window !== "undefined") {
        try {
          const pixelModule = await import("react-facebook-pixel");
          const ReactPixel = pixelModule.default;

          ReactPixel.track("Search", {
            search_string: searchTerm,
            content_category: "Products",
            city: city ?? "Unknown",
          });
        } catch (error) {
          console.error("Meta Pixel tracking failed (Search):", error);
        }
      }
    }, 1000); // Debounce for 1 second

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const maxPrice = useMemo(
    () => Math.max(...products.map((p) => p.price), 50000),
    [products]
  );

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((c) => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter((product) => {
      const categoryMatch =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category);
      const priceMatch =
        product.price >= priceRange[0] && product.price <= priceRange[1];
      const searchMatch =
        searchTerm === "" ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      return categoryMatch && priceMatch && searchMatch;
    });

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }
    return result;
  }, [products, selectedCategories, priceRange, sortBy, searchTerm]);

  const handleAddToCart = (product: Product) => {
    console.log("Adding to cart:", product);
    addToCart(product.id, 1, {
      name: product.name,
      image: product.image,
      price: product.price,
      originalPrice: product.originalPrice,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    const newSearchParams = new URLSearchParams(searchParams);
    if (value) {
      newSearchParams.set("search", value);
    } else {
      newSearchParams.delete("search");
    }
    router.push(`?${newSearchParams.toString()}`);
  };

  const formatPrice = (price: number) => `PKR ${price.toLocaleString()}.00`;

  const renderStars = (rating: number) => (
    <div className="flex text-amber-400">
      {[...Array(Math.floor(rating))].map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-current" />
      ))}
      {rating % 1 !== 0 && (
        <Star key="half" className="h-4 w-4 fill-current opacity-60" />
      )}
    </div>
  );

  const FilterPanel = () => (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed inset-y-0 left-0 w-full max-w-sm bg-white shadow-2xl z-[60] p-6 overflow-y-auto"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-stone-800">Filters</h2>
        <button
          onClick={() => setIsFiltersOpen(false)}
          className="text-stone-600 hover:text-stone-800 cursor-pointer"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-stone-700 mb-3">
            Categories
          </h3>
          <div className="space-y-2">
            {allCategories.map((category) => (
              <label
                key={category.id}
                className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-rose-50 rounded-md"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => handleCategoryChange(category.id)}
                  className="form-checkbox h-5 w-5 text-rose-600 border-stone-300 rounded focus:ring-rose-500 bg-transparent"
                />
                <span className="text-stone-600">{category.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* <button
        onClick={() => setIsFiltersOpen(false)}
        className="w-full mt-8 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold py-3 rounded-full transition-colors cursor-pointer"
      >
        Apply Filters
      </button> */}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-rose-50 to-amber-100 py-40 md:pt-32 md:pb-12">
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-stone-900 mb-4">
              Discover Aurave Elixirs
            </h1>
            <p className="text-lg text-stone-600 max-w-3xl mx-auto">
              Explore our curated collection of premium skincare, meticulously
              crafted to bring out your natural radiance.
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-4">
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <button
                onClick={() => setIsFiltersOpen(true)}
                className="border border-[#f43f5e] rounded-full px-5 py-2.5 text-sm font-medium text-[#f43f5e] hover:bg-rose-100 cursor-pointer"
              >
                <Filter className="h-4 w-4 mr-2 inline" />
                Filters
              </button>
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-rose-300 rounded-full focus:ring-2 focus:ring-rose-500 outline-none bg-white text-sm placeholder-stone-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 w-full lg:w-auto justify-between lg:justify-end">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none px-4 py-2.5 pr-8 border border-rose-300 rounded-full focus:ring-2 focus:ring-rose-500 outline-none bg-white text-sm font-medium text-stone-700"
                >
                  <option value="featured">Sort: Featured</option>
                  <option value="price-low">Sort: Price Low to High</option>
                  <option value="price-high">Sort: Price High to Low</option>
                  <option value="rating">Sort: Highest Rated</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-500 pointer-events-none" />
              </div>

              <div className="flex border border-rose-300 rounded-full overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 ${
                    viewMode === "grid"
                      ? "bg-rose-600 text-white"
                      : "text-stone-600 hover:bg-rose-100"
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 ${
                    viewMode === "list"
                      ? "bg-rose-600 text-white"
                      : "text-stone-600 hover:bg-rose-100"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {isFiltersOpen && (
              <div
                onClick={() => setIsFiltersOpen(false)}
                className="fixed inset-0 bg-black/50 z-50"
              />
            )}
            {isFiltersOpen && <FilterPanel />}
          </AnimatePresence>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 text-lg">{error}</p>
              <button className="mt-4 bg-rose-500 hover:bg-rose-600 text-white font-medium py-2 px-4 rounded-full transition-colors">
                Try Again
              </button>
            </div>
          ) : filteredAndSortedProducts.length > 0 ? (
            <div
              className={`grid gap-6 md:gap-8 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {filteredAndSortedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{
                    delay: index * 0.05,
                    duration: 0.5,
                    type: "spring",
                    stiffness: 120,
                  }}
                  className={`bg-white rounded-2xl shadow-xl overflow-hidden product-card-hover flex flex-col ${
                    viewMode === "list" ? "sm:flex-row" : ""
                  }`}
                >
                  <Link
                    href={`/products/${product.id}`}
                    className={`block relative ${
                      viewMode === "list" ? "sm:w-56 flex-shrink-0" : ""
                    }`}
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={viewMode === "list" ? 224 : 400}
                      height={viewMode === "list" ? 224 : 300}
                      className={`w-full object-cover ${
                        viewMode === "list" ? "sm:h-full h-64" : "h-72"
                      }`}
                    />
                    <div className="absolute top-3 right-3 bg-rose-500 text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow-md">
                      Save {formatPrice(product.savings)}
                    </div>
                  </Link>

                  <div
                    className={`p-5 flex flex-col flex-grow ${
                      viewMode === "list" ? "sm:p-6" : ""
                    }`}
                  >
                    <div>
                      <div className="flex items-center mb-1.5">
                        {renderStars(product.rating)}
                        <span className="text-xs text-stone-500 ml-2">
                          {product.rating.toFixed(1)} ({product.reviewCount}{" "}
                          reviews)
                        </span>
                      </div>
                      <Link href={`/product/${product.id}`}>
                        <h3
                          className={`font-semibold text-stone-900 mb-1.5 hover:text-rose-600 transition-colors ${
                            viewMode === "list" ? "text-xl" : "text-lg"
                          }`}
                        >
                          {product.name}
                        </h3>
                      </Link>
                      {viewMode === "list" && (
                        <p className="text-stone-600 text-sm mb-3 leading-relaxed">
                          {product.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-auto">
                      <div className="flex items-baseline space-x-2 mb-3">
                        <span
                          className={`font-bold text-rose-600 ${
                            viewMode === "list" ? "text-2xl" : "text-xl"
                          }`}
                        >
                          {formatPrice(product.price)}
                        </span>
                        <span
                          className={`text-stone-500 line-through ${
                            viewMode === "list" ? "text-md" : "text-sm"
                          }`}
                        >
                          {formatPrice(product.originalPrice)}
                        </span>
                      </div>
                      <Button
                        onClick={() => handleAddToCart(product)}
                        disabled={isLoading}
                        className="cursor-pointer w-full button-primary-gradient rounded-full py-2.5 text-sm font-semibold"
                      >
                        {isLoading ? "Adding..." : "Add to Cart"}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <Search className="h-16 w-16 text-stone-400 mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-stone-800 mb-3">
                No Products Found
              </h2>
              <p className="text-stone-600 mb-6">
                Try adjusting your filters or search term to find what you’re
                looking for.
              </p>
              <button
                onClick={() => {
                  setSelectedCategories([]);
                  setPriceRange([0, maxPrice]);
                  setSearchTerm("");
                  setSortBy("featured");
                  router.push("?");
                }}
                className="border border-rose-300 rounded-full px-6 py-2.5 text-sm font-medium text-stone-600 hover:bg-rose-100 cursor-pointer"
              >
                Clear Filters
              </button>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12 md:mt-16"
          >
            <Button
              variant="outline"
              size="lg"
              className="button-outline-themed rounded-full px-8 py-3 text-lg font-semibold shadow-sm cursor-pointer"
            >
              Load More Products
            </Button>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

const ProductsPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
};

export default ProductsPage;
