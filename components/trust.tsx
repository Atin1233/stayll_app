"use client";

import React from "react";

export default function Trust() {
  return (
    <section id="trust" className="relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-900/20 pointer-events-none" aria-hidden="true" />
      
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="mx-auto max-w-3xl text-center mb-12 md:mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 mb-4">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="h2 mb-4 text-gray-200">
              Built by Landlords, for Landlords
            </h2>
            <p className="text-xl text-blue-200/65">
              We understand the challenges of property management. Here's why we built Stayll.
            </p>
          </div>

          {/* Story section with simplified design */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 md:p-12">
              <div className="text-center mb-8">
                <h3 className="h3 mb-6 text-gray-200">
                  Why We Built Stayll
                </h3>
              </div>
              
              <div className="space-y-6 text-lg text-blue-200/80 leading-relaxed">
                <p>
                  After talking to hundreds of landlords and property managers, we discovered a common problem: 
                  they were all drowning in rental inquiries and missing opportunities due to slow response times.
                </p>
                
                <p>
                  Whether it was missing leads at 2 AM, spending hours on unqualified applicants, or losing good 
                  tenants to faster responses, the story was the same everywhere we looked.
                </p>
                
                <p>
                  We saw landlords trying everything - hiring assistants, using generic templates, even working 
                  18-hour days. But nothing was working effectively.
                </p>
                
                <p>
                  That's when we realized: what if AI could handle this for them? So we built Stayll - not just 
                  another tool, but a solution that understands the rental business and helps landlords across 
                  the country fill units faster while getting their lives back.
                </p>
              </div>
              
              {/* Call to action */}
              <div className="text-center mt-10 pt-8 border-t border-gray-700/50">
                <p className="text-blue-200/65 mb-6">
                  Ready to transform your rental management?
                </p>
                <a
                  href="#cta"
                  className="inline-flex items-center px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Get Started Today
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 