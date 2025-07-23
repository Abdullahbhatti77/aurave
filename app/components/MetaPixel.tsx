"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const FacebookPixel = () => {
  const pathname = usePathname();
  const [ReactPixel, setReactPixel] = useState<any>(null);

  useEffect(() => {
    import("react-facebook-pixel").then((module) => {
      module.default.init(process.env.NEXT_PUBLIC_META_PIXEL_ID!, undefined, {
        autoConfig: true,
        debug: false,
      });
      module.default.pageView();
      setReactPixel(module.default);
    });
  }, []);

  useEffect(() => {
    if (ReactPixel) {
      ReactPixel.pageView();
    }
  }, [pathname, ReactPixel]);

  return null;
};

export default FacebookPixel;
