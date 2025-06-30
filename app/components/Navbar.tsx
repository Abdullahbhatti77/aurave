"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useRef } from "react";

interface Suggestion {
  id: string;
  name: string;
  image: string;
}

const Navbar = () => {
  const { itemCount } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);

  // Scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fetch suggestions
  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }
    const delay = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/products?search=${encodeURIComponent(search)}`
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

  const handleSearch = (term?: string) => {
    const q = term ?? search;
    if (q.trim()) {
      router.push(`/products?search=${encodeURIComponent(q.trim())}`);
      setSearch("");
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (name: string) => {
    handleSearch(name);
  };
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-12 flex items-center justify-between transition-all duration-300 ${
        scrolled ? "bg-white/60 backdrop-blur-md shadow-md" : "bg-white"
      }`}
    >
      {/* Logo */}
      <Link href="/" className="text-lg md:text-xl font-light text-pink-600">
        AuraVé
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center space-x-6">
        {["Home", "Products", "About"].map((label) => (
          <Link
            key={label}
            href={label === "Home" ? "/" : `/${label.toLowerCase()}`}
            className="text-gray-700 hover:text-pink-600 transition"
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Search + Icons */}
      <div className="flex items-center space-x-4 relative">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-32 md:w-48 px-4 py-1 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
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
            <ul className="absolute w-full mt-1 z-30 bg-white border border-gray-200 shadow-md rounded-md animate-fade-in-up overflow-hidden">
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
            onClick={() => setShowProfileDropdown((prev) => !prev)}
            className="p-2 rounded-full hover:bg-gray-100"
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
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/orders"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Orders
                  </Link>
                  <button
                    onClick={logout}
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
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Create account
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setOpenMobile(!openMobile)}
          className="md:hidden p-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile menu links */}
      {openMobile && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t z-40 shadow-md">
          {["Home", "Products", "About"].map((label) => (
            <Link
              key={label}
              href={label === "Home" ? "/" : `/${label.toLowerCase()}`}
              onClick={() => setOpenMobile(false)}
              className="block px-6 py-3 hover:bg-gray-100"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
