// components/FacebookPixel.tsx
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import ReactPixel from "react-facebook-pixel";

const FacebookPixel = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Initialize Facebook Pixel
    ReactPixel.init(process.env.NEXT_PUBLIC_META_PIXEL_ID!, undefined, {
      autoConfig: true,
      debug: false,
    });

    ReactPixel.pageView(); // initial page load
  }, []);

  useEffect(() => {
    // Fire page view on route change
    ReactPixel.pageView();
  }, [pathname]);

  return null;
};

export default FacebookPixel;
