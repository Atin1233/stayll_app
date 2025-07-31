"use client";

import React from "react";

export default function Trust() {
  return (
    <section id="trust" className="relative">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          <div className="mx-auto max-w-3xl text-center mb-12 md:mb-16">
            <h2 className="h2 mb-4 text-gray-200">
              Built by Landlords, for Landlords
            </h2>
            <p className="text-xl text-indigo-200/65">
              We understand the challenges of property management. Here's why we built Stayll.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Our Story */}
            <div className="text-center">
              <h3 className="h3 mb-6 text-gray-200">
                Why We Built Stayll
              </h3>
              <div className="space-y-4 text-indigo-200/80 text-lg">
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 