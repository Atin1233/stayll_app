"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const navigation = [
    { name: 'How It Works', href: 'how-it-works' },
    { name: 'Features', href: 'features' },
    { name: 'Pricing', href: 'pricing' },
    { name: 'Testimonials', href: 'testimonials' },
    { name: 'FAQ', href: 'faq' },
    { name: 'About', href: 'trust' },
  ];

  return (
    <header className={`z-50 w-full transition-all duration-300 ${
      isScrolled ? 'fixed top-0 left-0 right-0' : 'relative'
    }`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Unique split layout navbar */}
        <div className={`relative flex items-center justify-between py-4 transition-all duration-300 ${
          isScrolled ? 'bg-gray-950/95 backdrop-blur-md border-b border-gray-800/50' : ''
        }`}>
          
          {/* Left side - Logo */}
          <div className="flex items-center">
            <Link 
              href="#hero" 
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('hero');
              }}
              className="text-2xl font-bold text-gray-200 hover:text-indigo-300 transition-colors"
              aria-label="Stayll"
            >
              Stayll
            </Link>
          </div>

          {/* Center - Navigation links in a unique pill design */}
          <nav className="hidden md:flex items-center">
            <div className="flex items-center bg-gray-900/50 backdrop-blur-sm rounded-full px-2 py-1 border border-gray-700/30">
              {navigation.map((item, index) => (
                <a
                  key={item.name}
                  href={`#${item.href}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.href);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-full transition-all duration-200"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </nav>

          {/* Right side - CTA button with unique styling */}
          <div className="flex items-center">
            <a
              href="#cta"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('cta');
              }}
              className="relative inline-flex items-center px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Get Early Access
              <div className="ml-2 w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-300 hover:text-white transition-colors"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`w-5 h-0.5 bg-current transition-all duration-300 ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-0.5' : '-translate-y-1'
                }`} />
                <span className={`w-5 h-0.5 bg-current transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-0' : ''
                }`} />
                <span className={`w-5 h-0.5 bg-current transition-all duration-300 ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-0.5' : 'translate-y-1'
                }`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Unique slide-down design */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="mt-2 bg-gray-900/95 backdrop-blur-md border border-gray-700/50 rounded-2xl overflow-hidden">
              <div className="px-4 py-6 space-y-2">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={`#${item.href}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item.href);
                    }}
                    className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all duration-200 text-sm font-medium"
                  >
                    {item.name}
                  </a>
                ))}
                <div className="pt-2 border-t border-gray-700/50">
                  <a
                    href="#cta"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection('cta');
                    }}
                    className="flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all duration-200"
                  >
                    Get Early Access
                    <div className="ml-2 w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
