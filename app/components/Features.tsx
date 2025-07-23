"use client";

const Features = () => {
  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">The Aurave Promise</h2>
          <p className="max-w-2xl mx-auto text-gray-300">
            We are committed to delivering exceptional skincare that you can trust. Here's what sets Aurave apart:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <div className="bg-gradient-to-br from-red-500 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-amber-400">Clinically Proven</h3>
            <p className="text-gray-400">
              Dermatologist-tested formulas for visible, safe results.
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <div className="bg-gradient-to-br from-red-500 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-amber-400">Pure Ingredients</h3>
            <p className="text-gray-400">
              Crafted with the finest natural and organic botanicals.
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <div className="bg-gradient-to-br from-red-500 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-amber-400">Swift Delivery</h3>
            <p className="text-gray-400">
              Free, fast shipping on all orders across Pakistan.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;