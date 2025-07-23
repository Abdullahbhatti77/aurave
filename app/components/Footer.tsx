"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Instagram,
  Facebook,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Button } from "../components/ui/button";
// import { toast } from "../components/ui/use-toast";
// import ReactPixel from "react-facebook-pixel";

const Footer = () => {
  useEffect(() => {
    // Track footer view
    // ReactPixel.track("ViewContent", { content_name: "Footer" });
  }, []);

  const handleNonImplementedClick = (item: string) => {
    // ReactPixel.track("Custom", { content_name: `${item} Clicked` });
    // toast({
    //   title: "🚧 Feature Not Implemented",
    //   description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    //   className: "bg-highlight text-background border-0",
    // });
  };

  return (
    <footer className="bg-[#fdf6f0] text-text-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-3xl font-bold font-serif"
            >
              <Link
                href="/"
                className="text-[#d7a7b1] hover:opacity-80 transition-opacity"
              >
                Aurave
              </Link>
            </motion.div>
            <p className="text-sm leading-relaxed">
              Crafting radiant beauty with nature's finest. Aurave is dedicated
              to luxurious, effective skincare that celebrates your natural
              glow.
            </p>
            <div className="flex space-x-3">
              {[
                { icon: Instagram, name: "Instagram" },
                { icon: Facebook, name: "Facebook" },
                { icon: Twitter, name: "Twitter" },
              ].map(({ icon: Icon, name }, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="icon"
                  onClick={() => handleNonImplementedClick(name)}
                  className="text-[#d7a7b1] hover:text-highlight hover:bg-accent-brand/20 cursor-pointer"
                >
                  <Icon className="h-5 w-5" />
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <span className="text-lg font-semibold text-[#d7a7b1] font-serif">
              Navigate
            </span>
            <div className="flex flex-col space-y-2 mt-3">
              <Link
                href="/"
                className="hover:text-highlight transition-colors text-sm"
              >
                Home
              </Link>
              <Link
                href="/products"
                className="hover:text-highlight transition-colors text-sm"
              >
                Products
              </Link>
              <Link
                href="/about"
                className="hover:text-highlight transition-colors text-sm"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="hover:text-highlight transition-colors text-sm"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* <div className="space-y-4">
            <span className="text-lg font-semibold text-[#d7a7b1] font-serif">
              Support
            </span>
            <div className="flex flex-col space-y-2 mt-3">
              {[
                "Shipping Policy",
                "Return Policy",
                "FAQs",
                "Terms of Service",
              ].map((item) => (
                <button
                  key={item}
                  onClick={() => handleNonImplementedClick(item)}
                  className="hover:text-highlight transition-colors text-sm text-left"
                >
                  {item}
                </button>
              ))}
            </div>
          </div> */}

          <div className="space-y-4">
            <span className="text-lg font-semibold text-[#d7a7b1] font-serif">
              Get In Touch
            </span>
            <div className="space-y-3 mt-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-[#d7a7b1]" />
                <span className="text-sm">care@aurave.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-[#d7a7b1]" />
                <span className="text-sm">+92 (300) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-[#d7a7b1]" />
                <span className="text-sm">Lahore, Pakistan</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-accent-brand mt-8 pt-8 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Aurave Skincare. All Rights Reserved.
            Crafted with love.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;