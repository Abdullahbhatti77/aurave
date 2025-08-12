"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
// import { useToast } from "../components/ui/use-toast";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  // const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    // toast({
    //   title: "Message Sent!",
    //   description:
    //     "Thank you for contacting Aurave. We'll get back to you soon.",
    //   className: "bg-highlight text-secondary-accent border-0",
    // });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-brand via-background to-secondary-accent py-12 md:pt-36 md:pb-20 px-4 sm:px-6 lg:px-8">
      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 md:mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-[#d7a7b1] font-serif mb-4">
          Get In Touch
        </h1>
        <p className="text-lg text-text-primary/80 max-w-2xl mx-auto">
          We'd love to hear from you! Whether you have a question about our
          products, an order, or just want to share your Aurave story, our team
          is ready to assist.
        </p>
      </motion.div>

      {/* Contact Info + Form */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-start">
        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="space-y-8 bg-[#fdf6f0] p-8 rounded-2xl shadow-xl"
        >
          <div>
            <h2 className="text-2xl font-semibold text-[#d7a7b1] font-serif mb-4">
              Contact Information
            </h2>
            <p className="text-text-primary/80 mb-6">
              Reach out to us directly or visit us at our Lahore location.
            </p>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="mt-1 p-2 bg-accent-brand/20 rounded-full">
                  <Mail className="h-5 w-5 text-highlight" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#d7a7b1]">Email Us</h3>
                  <a
                    href="mailto:care@aurave.com"
                    className="text-text-primary hover:text-highlight transition-colors"
                  >
                    care@aurave.com
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="mt-1 p-2 bg-accent-brand/20 rounded-full">
                  <Phone className="h-5 w-5 text-highlight" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#d7a7b1]">Call Us</h3>
                  <a
                    href="tel:+923001234567"
                    className="text-text-primary hover:text-highlight transition-colors"
                  >
                    +92 (300) 123-4567
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="mt-1 p-2 bg-accent-brand/20 rounded-full">
                  <MapPin className="h-5 w-5 text-highlight" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#d7a7b1]">Our Location</h3>
                  <p className="text-text-primary">
                    123 Skincare Avenue, Gulberg III, Lahore, Pakistan
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-[#d7a7b1] font-serif mb-4">
              Operating Hours
            </h2>
            <p className="text-text-primary/80">
              Monday - Friday: 9:00 AM - 6:00 PM (PST)
            </p>
            <p className="text-text-primary/80">
              Saturday: 10:00 AM - 4:00 PM (PST)
            </p>
            <p className="text-text-primary/80">Sunday: Closed</p>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="bg-[#fdf6f0] p-8 rounded-2xl shadow-xl"
        >
          <h2 className="text-2xl font-semibold text-[#d7a7b1] font-serif mb-6">
            Send Us A Message
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                name="subject"
                type="text"
                placeholder="How can we help?"
                value={formData.subject}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Your message here..."
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={5}
              />
            </div>
            <Button
              type="submit"
              className="w-full text-lg py-3 text-white bg-[#c4a880]"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Send className="mr-2 h-5 w-5" />
              )}
              {isLoading ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </motion.div>
      </div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-16 md:mt-20 text-center"
      >
        <h2 className="text-2xl font-semibold text-[#d7a7b1] font-serif mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-text-primary/80 mb-6">
          Have a quick question? You might find your answer in our FAQs.
        </p>
        <Button variant="outline" size="lg">
          Visit FAQs
        </Button>
      </motion.div>
    </div>
  );
}
