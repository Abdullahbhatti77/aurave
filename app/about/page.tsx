"use client";

import React from "react";
import { motion } from "framer-motion";
import { Droplet, Sparkles, Leaf, Microscope, Zap } from "lucide-react";

const AboutPage = () => {
  const teamMembers = [
    {
      name: "Aisha Khan",
      role: "Founder & CEO",
      image: "Professional woman with confident smile in business attire",
      description:
        "Aisha founded Aurave with a passion for creating skincare that is both effective and kind to the skin and planet.",
    },
    {
      name: "Dr. Bilal Ahmed",
      role: "Head of R&D",
      image: "Scientist in lab coat holding a test tube",
      description:
        "Dr. Ahmed leads our research team, blending cutting-edge science with natural ingredients.",
    },
    {
      name: "Sara Chen",
      role: "Marketing Director",
      image: "Creative professional woman in a modern office setting",
      description:
        "Sara crafts Aurave's story, connecting our brand with skincare enthusiasts worldwide.",
    },
  ];

  const values = [
    {
      icon: Leaf,
      title: "Natural Purity",
      description:
        "We meticulously source the finest natural and organic ingredients, ensuring every product is gentle yet potent.",
    },
    {
      icon: Microscope,
      title: "Scientific Efficacy",
      description:
        "Our formulations are backed by research, blending nature's wisdom with dermatological science for visible results.",
    },
    {
      icon: Sparkles,
      title: "Radiant Well-being",
      description:
        "We believe skincare is self-care. Our products aim to enhance not just your skin, but your overall sense of well-being.",
    },
    {
      icon: Droplet,
      title: "Ethical Sourcing",
      description:
        "Sustainability and ethical practices are at the heart of Aurave, from ingredient sourcing to eco-friendly packaging.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-rose-50 to-amber-100 dark:from-stone-900 dark:via-neutral-800 dark:to-rose-950 text-stone-800 dark:text-rose-100 overflow-x-hidden">
      <motion.section
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative pb-20 pt-48 md:py-32 text-center hero-bg-light dark:hero-bg-dark"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-stone-100 dark:to-stone-900 opacity-50"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 text-gradient-theme"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            About Aurave
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-stone-700 dark:text-rose-200 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Crafting radiant beauty from the heart of nature, empowered by
            science. We are Aurave, your partners in achieving luminous, healthy
            skin.
          </motion.p>
        </div>
      </motion.section>

      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-rose-700 dark:text-amber-400 mb-6">
                Our Story: The Genesis of Glow
              </h2>
              <p className="text-lg text-stone-600 dark:text-rose-300 mb-4 leading-relaxed">
                Aurave was born from a simple belief: skincare should be a
                harmonious blend of nature's purity and scientific innovation.
                We embarked on a journey to create products that not only
                deliver exceptional results but also nurture your skin with the
                gentle touch it deserves.
              </p>
              <p className="text-lg text-stone-600 dark:text-rose-300 mb-6 leading-relaxed">
                Our philosophy centers around "Radiant Rituals" – the idea that
                your daily skincare routine can be a moment of mindful
                self-care, transforming your skin and uplifting your spirit.
                Each Aurave product is a testament to this, crafted with love
                and precision.
              </p>
              {/* <Link to="/products">
                <Button
                  size="lg"
                  className="button-primary-gradient pulse-glow-themed rounded-full px-8 py-3 text-lg"
                >
                  Explore Our Collection
                </Button>
              </Link> */}
            </div>
            <motion.div
              className="relative"
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <img
                className="rounded-2xl shadow-2xl w-full h-auto object-cover aspect-square"
                alt="Artistic composition of natural skincare ingredients and Aurave product"
                src="https://images.unsplash.com/photo-1602631637744-95548611264d"
              />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-amber-400 dark:bg-rose-600 rounded-full flex items-center justify-center shadow-lg floating-animation">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-rose-50 dark:bg-neutral-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-rose-700 dark:text-amber-400 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-stone-600 dark:text-rose-300 max-w-2xl mx-auto">
              The principles that guide every Aurave creation and decision.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className="bg-white dark:bg-stone-700 p-8 rounded-2xl shadow-xl text-center hover:shadow-2xl transition-shadow duration-300 product-card-hover"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-500 to-amber-500 dark:from-rose-600 dark:to-amber-600 rounded-full mb-6 shadow-md">
                  <value.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-stone-800 dark:text-amber-300 mb-3">
                  {value.title}
                </h3>
                <p className="text-stone-600 dark:text-rose-200 text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-rose-700 dark:text-amber-400 mb-4">
              Meet the Visionaries
            </h2>
            <p className="text-lg text-stone-600 dark:text-rose-300 max-w-2xl mx-auto">
              The passionate minds behind Aurave's commitment to excellence.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="bg-white dark:bg-stone-800 p-6 rounded-2xl shadow-lg text-center product-card-hover"
              >
                <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-amber-400 dark:border-rose-500 shadow-md">
                  <img
                    className="w-full h-full object-cover"
                    alt={member.name}
                    src="https://images.unsplash.com/photo-1595872018818-97555653a011"
                  />
                </div>
                <h3 className="text-xl font-semibold text-stone-800 dark:text-amber-300 mb-1">
                  {member.name}
                </h3>
                <p className="text-rose-600 dark:text-amber-500 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-sm text-stone-600 dark:text-rose-200 leading-relaxed">
                  {member.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gradient-to-r from-rose-600 to-amber-600 dark:from-rose-700 dark:to-amber-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Zap className="w-16 h-16 mx-auto mb-6 text-amber-300" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join the Aurave Glow Journey
            </h2>
            <p className="text-xl text-rose-100 dark:text-amber-100 mb-10">
              Ready to transform your skincare routine and embrace your natural
              radiance? Explore our collection and find your perfect Aurave
              ritual.
            </p>
            {/* <Link to="/products">
              <Button
                size="xl"
                className="bg-white text-rose-600 hover:bg-rose-50 dark:text-amber-700 dark:hover:bg-amber-50 rounded-full px-10 py-4 text-xl font-semibold shadow-lg transition-transform hover:scale-105"
              >
                Shop All Products
              </Button>
            </Link> */}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;