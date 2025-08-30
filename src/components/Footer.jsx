// src/components/Footer.jsx
import React from "react";
import { Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-blue-500 text-gray-300 w-full -mb-6">
      <div className="px-6 py-12 grid md:grid-cols-4 gap-10 max-w-full">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white">MyCVBuilder</h2>
          <p className="text-sm mt-3">
            Build and showcase your professional CVs, portfolios, and resumes with ease.
          </p>
          <div className="flex gap-4 mt-4">
            <a href="#" className="hover:text-white transition"><Facebook size={20} /></a>
            <a href="#" className="hover:text-white transition"><Twitter size={20} /></a>
            <a href="#" className="hover:text-white transition"><Instagram size={20} /></a>
            <a href="#" className="hover:text-white transition"><Linkedin size={20} /></a>
            <a href="mailto:support@mycvbuilder.com" className="hover:text-white transition"><Mail size={20} /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-white transition">Home</a></li>
            <li><a href="/about" className="hover:text-white transition">About Us</a></li>
            <li><a href="/features" className="hover:text-white transition">Features</a></li>
            <li><a href="/pricing" className="hover:text-white transition">Pricing</a></li>
            <li><a href="/contact" className="hover:text-white transition">Contact</a></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/blog" className="hover:text-white transition">Blog</a></li>
            <li><a href="/faq" className="hover:text-white transition">FAQs</a></li>
            <li><a href="/templates" className="hover:text-white transition">CV Templates</a></li>
            <li><a href="/guides" className="hover:text-white transition">Career Guides</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Stay Updated</h3>
          <p className="text-sm mb-3">Subscribe to our newsletter for tips & updates.</p>
          <form className="flex">
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-3 py-2 rounded-l-lg text-gray-900 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700 py-4 text-center text-sm">
        © {new Date().getFullYear()} MyCVBuilder. All rights reserved.
      </div>
    </footer>
  );
}
