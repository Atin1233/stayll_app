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
              We know your pain because we've lived it. Here's why we built Stayll.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="h3 mb-6 text-gray-200">
                Why We Built Stayll
              </h3>
              <div className="space-y-4 text-indigo-200/80">
                <p>
                  As landlords ourselves, we were drowning in rental inquiries. Missing leads at 2 AM, 
                  spending hours on unqualified applicants, and losing good tenants to faster responses.
                </p>
                <p>
                  We tried everything - hiring assistants, using generic templates, even working 18-hour days. 
                  Nothing worked. That's when we realized: what if AI could handle this for us?
                </p>
                <p>
                  So we built Stayll. Not just another tool, but a solution that understands the rental business 
                  because we built it from our own frustrations. Now we help landlords across the country 
                  fill units faster while getting their lives back.
                </p>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
              <h3 className="h3 mb-6 text-gray-200">
                Meet the Team
              </h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    AJ
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-200">Atin Jain</h4>
                    <p className="text-sm text-indigo-200/65">Founder & CEO</p>
                    <p className="text-sm text-indigo-200/60 mt-1">
                      Former landlord with 15+ properties. Built Stayll after losing $50K in missed rent due to slow responses.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    MK
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-200">Mike Chen</h4>
                    <p className="text-sm text-indigo-200/65">CTO & Co-founder</p>
                    <p className="text-sm text-indigo-200/60 mt-1">
                      AI/ML engineer with 10+ years experience. Previously at Google and Airbnb. Owns 8 rental properties.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold">
                    SL
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-200">Sarah Lee</h4>
                    <p className="text-sm text-indigo-200/65">Head of Customer Success</p>
                    <p className="text-sm text-indigo-200/60 mt-1">
                      Property manager for 12 years. Helps landlords get the most out of Stayll and provides 24/7 support.
                    </p>
                  </div>
                </div>
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