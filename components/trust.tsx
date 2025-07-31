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

          <div className="max-w-4xl mx-auto mb-16">
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

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <h3 className="h4 mb-2 text-gray-200">Bank-Level Security</h3>
              <p className="text-indigo-200/65">
                SOC 2 compliant, end-to-end encryption, and GDPR compliant. Your data is as secure as your bank account.
              </p>
            </div>
            <div className="text-center">
              <h3 className="h4 mb-2 text-gray-200">24/7 Support</h3>
              <p className="text-indigo-200/65">
                Real humans available anytime. Average response time: 2 minutes. We're here when you need us.
              </p>
            </div>
            <div className="text-center">
              <h3 className="h4 mb-2 text-gray-200">Money-Back Guarantee</h3>
              <p className="text-indigo-200/65">
                30-day money-back guarantee. If Stayll doesn't help you fill units faster, we'll refund every penny.
              </p>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 md:p-12">
            <div className="text-center mb-8">
              <h3 className="h3 mb-4 text-gray-200">
                Get in Touch
              </h3>
              <p className="text-xl text-indigo-200/65">
                Questions? Want to see Stayll in action? We'd love to hear from you.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <h4 className="font-semibold text-gray-200 mb-2">Email</h4>
                <a href="mailto:hello@stayll.com" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                  hello@stayll.com
                </a>
              </div>
              
              <div className="text-center">
                <h4 className="font-semibold text-gray-200 mb-2">Phone</h4>
                <a href="tel:+1-555-123-4567" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                  (555) 123-4567
                </a>
              </div>
              
              <div className="text-center">
                <h4 className="font-semibold text-gray-200 mb-2">Office</h4>
                <p className="text-indigo-200/65">
                  San Francisco, CA<br />
                  United States
                </p>
              </div>
              
              <div className="text-center">
                <h4 className="font-semibold text-gray-200 mb-2">Response Time</h4>
                <p className="text-indigo-200/65">
                  &lt; 2 minutes<br />
                  24/7 support
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 