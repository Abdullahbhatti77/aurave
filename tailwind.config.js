// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  // content: ["./app/**/*.{js,jsx,tsx}", "./components/**/*.{js,jsx,tsx}"],
  // content: [
  //   "./app/**/*.{js,jsx,tsx}", // Includes app/components/Footer.tsx
  //   "./components/**/*.{js,jsx,tsx}",
  // ],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx}", // if you're using pages/ too
  ],

  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        "main-brand": "#FDF6F0", // Dusty Rose
        "accent-brand": "#EAD7D1", // Light Mauve
        "text-primary": "#2F2F2F", // Deep Charcoal
        "secondary-accent": "#FDF6F0", // Ivory White
        highlight: "#C5A880", // Gold or Bronze
        border: "#EAD7D1", // Light Mauve
        input: "#EAD7D1", // Light Mauve
        ring: "#C5A880", // Gold or Bronze
        background: "#FDF6F0", // Ivory White
        foreground: "#2F2F2F", // Deep Charcoal
        primary: {
          DEFAULT: "#D8A7B1", // Dusty Rose
          foreground: "#FDF6F0", // Ivory White
        },
        secondary: {
          DEFAULT: "#EAD7D1", // Light Mauve
          foreground: "#2F2F2F", // Deep Charcoal
        },
        destructive: {
          DEFAULT: "#ef4444", // Red-500
          foreground: "#FDF6F0", // Ivory White
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "#EAD7D1", // Light Mauve
          foreground: "#2F2F2F", // Deep Charcoal
        },
        popover: {
          DEFAULT: "#FDF6F0", // Ivory White
          foreground: "#2F2F2F", // Deep Charcoal
        },
        card: {
          DEFAULT: "#FDF6F0", // Ivory White
          foreground: "#2F2F2F", // Deep Charcoal
        },
      },
      backgroundImage: {
        "hero-bg-light": "url('/images/hero-bg-light.jpg')", // Adjust path
        "hero-bg-dark": "url('/images/hero-bg-dark.jpg')", // Adjust path
        "button-primary-gradient":
          "linear-gradient(to right, #D8A7B1, #EAD7D1)", // Dusty Rose to Light Mauve
        "pulse-glow-themed": "linear-gradient(to right, #D8A7B1, #EAD7D1)", // Matches button gradient
      },
      fontFamily: {
        sans: ["Montserrat", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        pulse: {
          "0%": { boxShadow: "0 0 0 0 rgba(200, 168, 128, 0.4)" }, // Matches highlight
          "70%": { boxShadow: "0 0 0 10px rgba(200, 168, 128, 0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(200, 168, 128, 0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        pulse: "pulse 2s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
