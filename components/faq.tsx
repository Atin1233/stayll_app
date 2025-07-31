"use client";

import { useState } from "react";

export default function FAQ() {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I connect my inbox?",
      answer: "It's super simple! Just connect your Gmail, Facebook Messenger, or SMS through our secure integration. We use OAuth for email and API connections for social platforms. No passwords stored, just secure tokens. Takes less than 2 minutes to set up."
    },
    {
      question: "Does Stayll reply on my behalf or just suggest?",
      answer: "Stayll replies automatically on your behalf, but you're always in control. You can review and approve responses before they're sent, or let Stayll handle everything automatically. You can also set up custom rules for when you want to be notified or take over."
    },
    {
      question: "What platforms does it work with?",
      answer: "Currently works with Zillow, Apartments.com, Facebook Marketplace, Craigslist, and direct email inquiries. We're constantly adding new platforms based on landlord feedback. If you use a platform we don't support yet, let us know!"
    },
    {
      question: "Can I stop it from replying to certain leads?",
      answer: "Absolutely! You can set filters for income requirements, pet policies, move-in dates, and more. You can also blacklist certain email addresses or phone numbers. Plus, you can pause responses anytime with one click."
    },
    {
      question: "What if I manage more than 50 properties?",
      answer: "Our Growth and DFY Elite plans are designed for larger portfolios. The Growth plan handles up to 200 properties, and DFY Elite is unlimited. We also offer custom enterprise solutions for property management companies with 500+ units."
    },
    {
      question: "Is my data secure?",
      answer: "Yes! We use bank-level encryption and never store sensitive information like passwords. All data is encrypted in transit and at rest. We're GDPR compliant and you can export or delete your data anytime."
    },
    {
      question: "What if the AI gives wrong information?",
      answer: "Stayll learns from your property details and preferences. You can review and edit any response before it's sent, and the AI gets smarter over time. We also have human support available 24/7 if you need help."
    },
    {
      question: "Can I customize the responses?",
      answer: "Definitely! You can create custom templates, set your tone (professional, friendly, casual), and add your own personality. You can also set different responses for different property types or situations."
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };

  return (
    <section id="faq" className="relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-900/20 pointer-events-none" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="mx-auto max-w-3xl text-center mb-12 md:mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 mb-4">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="h2 mb-4 text-gray-200">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-blue-200/65">
              Everything you need to know about Stayll's AI-powered rental management
            </p>
          </div>

          {/* FAQ items */}
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden transition-all duration-300 hover:bg-gray-800/70"
                >
                  <button
                    className="w-full px-6 py-5 text-left focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded-2xl"
                    onClick={() => toggleItem(index)}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-200 pr-8">
                        {faq.question}
                      </h3>
                      <div className="flex-shrink-0 ml-4">
                        <svg
                          className={`w-5 h-5 text-blue-400 transition-transform duration-300 ${
                            openItem === index ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </button>
                  
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openItem === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-6 pb-5">
                      <p className="text-blue-200/80 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA section */}
          <div className="text-center mt-12 md:mt-16">
            <p className="text-blue-200/65 mb-6">
              Still have questions? We're here to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#cta"
                className="btn bg-blue-600 hover:bg-blue-500 text-white"
              >
                Get Started Today
              </a>
              <a
                href="mailto:support@stayll.com"
                className="btn bg-gray-800 hover:bg-gray-700 text-gray-200"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 