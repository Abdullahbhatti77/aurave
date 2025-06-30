import Hero from './components/Hero';
import Features from './components/Features';
import FeaturedProducts from './components/FeaturedProducts';
import Newsletter from './components/Newsletter';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <FeaturedProducts />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
