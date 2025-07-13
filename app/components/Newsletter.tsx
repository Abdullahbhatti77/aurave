"use client";

import { useState } from "react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setMessage("Thank you for subscribing to our newsletter!");
      setEmail("");
    }, 1500);

    // In a real application, you would make an API call here
    // try {
    //   const response = await fetch('/api/subscribe', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email }),
    //   });
    //   const data = await response.json();
    //   setIsSubmitting(false);
    //   setMessage(data.message);
    //   if (response.ok) setEmail('');
    // } catch (error) {
    //   setIsSubmitting(false);
    //   setMessage('An error occurred. Please try again.');
    // }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-red-600 to-pink-500 text-white">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-yellow-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-bold mb-4">Join the Aurave Glow</h2>
        <p className="max-w-md mx-auto mb-8">
          Subscribe for exclusive skincare insights, early access to new
          arrivals, and special promotions.
        </p>
        <form
          onSubmit={handleSubmit}
          className="max-w-md mx-auto flex flex-col sm:flex-row gap-4"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            className="flex-grow px-4 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-white text-pink-600 hover:bg-gray-100 font-medium px-6 py-3 rounded-full transition-colors disabled:opacity-70"
          >
            {isSubmitting ? "Subscribing..." : "Subscribe Now"}
          </button>
        </form>
        {message && (
          <p className="mt-4 text-sm font-medium text-white">{message}</p>
        )}
      </div>
    </section>
  );
};

export default Newsletter;
