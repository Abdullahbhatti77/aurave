import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-white pt-16 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          {/* Logo & About */}
          <div className="w-full md:w-1/4 mb-8 md:mb-0">
            <h3 className="text-pink-400 text-2xl font-semibold mb-4">Aurave</h3>
            <p className="text-gray-600 mb-4">
              Crafting radiant beauty with nature's finest.
              Aurave is dedicated to luxurious, effective
              skincare that celebrates your natural glow.
            </p>
            <div className="flex space-x-4">
              {/* Social Icons */}
              <a href="#" className="text-gray-400 hover:text-pink-400">
                {/* Instagram */}
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="..." clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-400">
                {/* Twitter */}
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="..." />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-400">
                {/* GitHub */}
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="..." clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="w-full md:w-1/4 mb-8 md:mb-0">
            <h4 className="text-gray-900 font-medium mb-4">Navigate</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-600 hover:text-orange-400">Home</Link></li>
              <li><Link href="/products" className="text-gray-600 hover:text-orange-400">Products</Link></li>
              <li><Link href="/about" className="text-gray-600 hover:text-orange-400">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-orange-400">Contact</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="w-full md:w-1/4 mb-8 md:mb-0">
            <h4 className="text-gray-900 font-medium mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link href="/shipping" className="text-gray-600 hover:text-pink-400">Shipping Policy</Link></li>
              <li><Link href="/about" className="text-gray-600 hover:text-pink-400">FAQs</Link></li> {/* Updated to point to /about */}
              <li><Link href="/terms" className="text-gray-600 hover:text-pink-400">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="w-full md:w-1/4">
            <h4 className="text-gray-900 font-medium mb-4">Get In Touch</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8..." />
                </svg>
                <span className="text-gray-600">care@aurave.com</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 ..." />
                </svg>
                <span className="text-gray-600">+92 (300) 123 4567</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414..." />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0..." />
                </svg>
                <span className="text-gray-600">Lahore, Pakistan</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-12 pt-8">
          <p className="text-gray-500 text-center text-sm">
            © 2025 Aurave Skincare. All Rights Reserved. Crafted with love.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
