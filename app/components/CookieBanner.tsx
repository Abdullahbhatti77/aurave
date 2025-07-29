"use client";

import { useEffect, useState } from "react";

const COOKIE_CONSENT_KEY = "meta_cookie_consent";

export default function CookieBanner() {
  const [consentChecked, setConsentChecked] = useState<boolean>(false);

  useEffect(() => {
    const storedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);

    if (storedConsent === "true") {
      setConsentChecked(true);

      if (typeof window !== "undefined") {
        import("react-facebook-pixel").then((pixelModule) => {
          const ReactPixel = pixelModule.default;
          ReactPixel.grantConsent?.();
        });
      }
    } else if (storedConsent === "false") {
      setConsentChecked(true);

      if (typeof window !== "undefined") {
        import("react-facebook-pixel").then((pixelModule) => {
          const ReactPixel = pixelModule.default;
          ReactPixel.revokeConsent?.();
        });
      }
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "true");
    setConsentChecked(true);

    if (typeof window !== "undefined") {
      import("react-facebook-pixel").then((pixelModule) => {
        const ReactPixel = pixelModule.default;
        ReactPixel.grantConsent?.();
      });
    }
  };

  const handleReject = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "false");
    setConsentChecked(true);

    if (typeof window !== "undefined") {
      import("react-facebook-pixel").then((pixelModule) => {
        const ReactPixel = pixelModule.default;
        ReactPixel.revokeConsent?.();
      });
    }
  };

  if (consentChecked) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[95%] max-w-xl -translate-x-1/2 rounded-2xl bg-gray-900 text-white shadow-lg p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 text-sm leading-relaxed">
          <p>
            {/* We use cookies to track user actions via Meta Pixel.{" "} */}
            Do you accept cookies to help us improve your experience?{" "}
            <a
              href="https://www.facebook.com/policies/cookies/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-pink-400 hover:text-pink-300 transition"
            >
              Learn more
            </a>
            .
          </p>
        </div>
        <button
          onClick={handleAccept}
          className="text-gray-400 hover:text-white text-xl cursor-pointer"
          aria-label="Close cookie banner"
        >
          &times;
        </button>
      </div>
      <div className="mt-4 flex justify-end gap-3">
        <button
          onClick={handleAccept}
          className="bg-gray-700 hover:bg-gray-600 transition px-5 py-2 text-sm rounded-full font-semibold cursor-pointer"
        >
          Reject
        </button>
        <button
          onClick={handleAccept}
          className="bg-pink-600 hover:bg-pink-500 transition px-5 py-2 text-sm rounded-full font-semibold cursor-pointer"
        >
          Accept Cookies
        </button>
      </div>
    </div>
  );
}
