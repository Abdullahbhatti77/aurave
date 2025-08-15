"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
// import ReactPixel from "react-facebook-pixel";
import getUserCity from "../helpers/getUserCity";

interface Suggestion {
  id: string;
  name: string;
  image: string;
}

const Navbar = () => {
  const { itemCount } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const [city, setCity] = useState<string | null>(null);

  // Scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    getUserCity().then((city) => {
      setCity(city);
    });
  }, []);
  useEffect(() => {
    if (!search.trim()) return;

    const timeout = setTimeout(async () => {
      if (typeof window !== "undefined") {
        try {
          const pixelModule = await import("react-facebook-pixel");
          const ReactPixel = pixelModule.default;

          ReactPixel.track("Search", {
            search_string: search,
            content_category: "Products",
            city: city ?? "Unknown",
          });
        } catch (error) {
          console.error("Meta Pixel tracking failed (Search):", error);
        }
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [search]);

  // Fetch suggestions
  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }
    const delay = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/products?search=${encodeURIComponent(search)}`,
          {
            next: { revalidate: 3600 }, // Cache for 1 hour
          }
        );
        if (res.ok) {
          const data = await res.json();
          const mapped = data.map((p: any) => ({
            id: p.id,
            name: p.name,
            image: p.image,
          }));
          setSuggestions(mapped.slice(0, 5));
        }
      } catch (err) {
        console.error("Search error:", err);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [search]);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (term?: string) => {
    const q = term ?? search;
    if (q.trim()) {
      router.push(`/products?search=${encodeURIComponent(q.trim())}`);
      setSearch("");
      setSuggestions([]);
      setOpenSidebar(false);
    }
  };

  const handleSuggestionClick = (name: string) => {
    handleSearch(name);
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown((prev) => !prev);
  };

  const toggleSidebar = () => {
    setOpenSidebar((prev) => !prev);
  };

  return (
    <div className="bg-[#fdf7f2] fixed top-0 left-0 right-0 z-50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between">
        {/* Logo */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link href="/" className="flex items-center space-x-2">
            {/* <img
              src="https://storage.googleapis.com/hostinger-horizons-assets-prod/5021481e-4792-4eba-b9a6-64fa10075184/cecfd89cb24a2d052ad987f7c1320390.png"
              alt="Aurave Logo"
              className="h-12 w-auto"
            /> */}
            <span className="text-3xl font-bold text-[#d7a7b1] font-serif">
              AuraVé
            </span>
          </Link>
          {/* Mobile menu toggle */}
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2"
            aria-label={openSidebar ? "Close menu" : "Open menu"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {openSidebar ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-10">
          {["Home", "Products", "About", "Contact"].map((label) => {
            const href = label === "Home" ? "/" : `/${label.toLowerCase()}`;
            const isActive = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                className={`text-sm font-semibold transition ${
                  isActive
                    ? "text-[#c5a982] border-b-2 border-[#b89b71]"
                    : "text-gray-700 hover:text-[#c5a982]"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Search + Icons */}
        <div className="flex items-center space-x-4 mt-4 md:mt-0 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
            />
            <button
              onClick={() => handleSearch()}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-pink-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <ul className="absolute w-full mt-1 z-30 bg-white border border-gray-200 shadow-md rounded-md overflow-hidden">
                {suggestions.map((s, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(s.name)}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer transition"
                  >
                    <Image
                      src={s.image}
                      alt={s.name}
                      width={32}
                      height={32}
                      className="rounded-sm object-cover"
                    />
                    <span className="text-sm text-gray-700">{s.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Cart Icon */}
          <Link
            href="/cart"
            className="relative p-2 rounded-full hover:bg-gray-100"
            onClick={() => setOpenSidebar(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 2.3a1 1 0 00.7 1.7H17a2 2 0 100 4 2 2 0 000-4H9a2 2 0 11-4 0"
              />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {/* User Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={toggleProfileDropdown}
              className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>

            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-20">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-2 text-gray-700 border-b">
                      Hello, {user?.name}
                    </div>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => {
                          setShowProfileDropdown(false);
                          setOpenSidebar(false);
                        }}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      href="/profile"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => {
                        setShowProfileDropdown(false);
                        setOpenSidebar(false);
                      }}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => {
                        setShowProfileDropdown(false);
                        setOpenSidebar(false);
                      }}
                    >
                      Orders
                    </Link>
                    <button
                      onClick={async () => {
                        await logout();
                        setShowProfileDropdown(false);
                        setOpenSidebar(false);
                        router.push("/login");
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => {
                        setShowProfileDropdown(false);
                        setOpenSidebar(false);
                      }}
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/register"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => {
                        setShowProfileDropdown(false);
                        setOpenSidebar(false);
                      }}
                    >
                      Create account
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-3/4 max-w-xs bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          openSidebar ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <span className="text-lg font-light text-pink-600">AuraVé</span>
            <button
              onClick={toggleSidebar}
              className="p-2"
              aria-label="Close sidebar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Sidebar Links */}
          <div className="flex flex-col p-4 space-y-2">
            {["Home", "Products", "About"].map((label) => {
              const href = label === "Home" ? "/" : `/${label.toLowerCase()}`;
              const isActive = pathname === href;
              return (
                <Link
                  key={label}
                  href={href}
                  className={`block px-4 py-2 rounded-md ${
                    isActive
                      ? "text-red-600 font-semibold"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setOpenSidebar(false)}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Overlay for Sidebar */}
      {openSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default Navbar;
