import Image from 'next/image';
import Link from 'next/link';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-r from-amber-700/30 to-pink-300/30 py-16">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="block text-gray-800">Unlock Your</span>
              <span className="block text-gray-800">Radiance</span>
              <span className="block text-amber-500 mt-2">With <span className="text-pink-400">Aurave</span></span>
              <span className="block text-amber-500">Skincare</span>
            </h1>
            <p className="text-gray-600 mb-8 max-w-md">
              Experience the transformative power of nature and science.
              Aurave offers luxurious, effective skincare designed to reveal your
              skin's natural luminosity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/products" 
                className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-6 rounded-full inline-flex items-center transition-colors"
              >
                Shop Collection
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link 
                href="/about" 
                className="border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white font-medium py-3 px-6 rounded-full transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/2 relative">
            <div className="relative rounded-lg overflow-hidden shadow-xl" style={{ animation: 'float 6s ease-in-out infinite' }}>
              <Image 
                src="/product-display.jpg" 
                alt="Aurave Skincare Products" 
                width={600} 
                height={400}
                className="rounded-lg object-cover"
              />
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
                <div className="flex items-center">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2">4.9/5 Stars</span>
                </div>
                <p className="text-xs">from 2,500+ Happy Customers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;