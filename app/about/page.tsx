import Image from 'next/image';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-pink-100 to-pink-200 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">About Aurave</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the story behind our mission to transform skincare with the perfect blend of nature and science.
            </p>
          </div>
        </div>

        {/* Our Story Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <div className="relative h-[400px] w-full rounded-lg overflow-hidden shadow-xl">
                  <div className="absolute inset-0 bg-pink-200 opacity-20 rounded-lg"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-64 bg-pink-100 rounded-full flex items-center justify-center">
                      <span className="text-3xl font-bold text-pink-600">Aurave</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
                <p className="text-gray-600 mb-4">
                  Founded in 2018, Aurave was born from a simple yet powerful idea: skincare should be effective, pure, and accessible to everyone. Our founder, Sarah Chen, struggled with sensitive skin for years and was frustrated by products that promised results but delivered disappointment.
                </p>
                <p className="text-gray-600 mb-4">
                  After years of research and collaboration with leading dermatologists and botanists, Sarah developed formulations that combined the best of nature with cutting-edge science. The result was a line of products that not only delivered visible results but also respected the skin's natural balance.
                </p>
                <p className="text-gray-600">
                  Today, Aurave has grown into a beloved brand trusted by thousands of customers worldwide. We remain committed to our founding principles: clinical effectiveness, pure ingredients, and exceptional customer experience.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <svg className="w-8 h-8 text-pink-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">Transparency</h3>
                <p className="text-gray-600 text-center">
                  We believe in complete honesty about what goes into our products. Every ingredient is carefully selected and clearly disclosed.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <svg className="w-8 h-8 text-pink-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">Sustainability</h3>
                <p className="text-gray-600 text-center">
                  We're committed to minimizing our environmental impact through responsible sourcing, eco-friendly packaging, and carbon-neutral shipping.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <svg className="w-8 h-8 text-pink-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">Inclusivity</h3>
                <p className="text-gray-600 text-center">
                  We create products for all skin types, tones, and concerns. Everyone deserves to feel confident and beautiful in their skin.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Team Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Meet Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Team Member 1 */}
              <div className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="h-64 bg-gray-200 flex items-center justify-center">
                  <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-pink-600">SC</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">Sarah Chen</h3>
                  <p className="text-pink-600 mb-4">Founder & CEO</p>
                  <p className="text-gray-600">
                    With a background in biochemistry and a passion for natural ingredients, Sarah leads our company with vision and purpose.
                  </p>
                </div>
              </div>
              
              {/* Team Member 2 */}
              <div className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="h-64 bg-gray-200 flex items-center justify-center">
                  <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-pink-600">DR</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">Dr. Rachel Kim</h3>
                  <p className="text-pink-600 mb-4">Chief Scientific Officer</p>
                  <p className="text-gray-600">
                    A dermatologist with over 15 years of experience, Dr. Kim oversees our product development and clinical testing.
                  </p>
                </div>
              </div>
              
              {/* Team Member 3 */}
              <div className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="h-64 bg-gray-200 flex items-center justify-center">
                  <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-pink-600">JL</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">James Lee</h3>
                  <p className="text-pink-600 mb-4">Head of Sustainability</p>
                  <p className="text-gray-600">
                    James ensures that our commitment to the environment is reflected in every aspect of our business operations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;