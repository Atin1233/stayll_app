"use client";

import { useState } from "react";

export default function FAQ() {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const faqs = [
    {
      question: "What types of leases does Stayll support?",
      answer: "We currently support residential and commercial leases in PDF or scanned format. Our AI can handle complex lease terms, amendments, and addendums across various property types."
    },
    {
      question: "How accurate is the AI analysis?",
      answer: "Our models are trained on thousands of legal documents and reviewed by our team of property managers and legal experts. You can always request a human-polished summary for critical documents."
    },
    {
      question: "Can I use Stayll with my PM software?",
      answer: "Yes — integrations with AppFolio, Buildium, and Yardi are in the works. We're also building API access for custom integrations with your existing systems."
    },
    {
      question: "Is tenant data required?",
      answer: "No, but uploading it unlocks predictive risk scoring. You can analyze leases independently or include tenant information for comprehensive risk assessment."
    },
    {
      question: "What happens to my uploaded documents?",
      answer: "Your documents are processed securely and deleted after analysis. We never store or share your lease documents. All analysis is done in real-time with bank-level encryption."
    },
    {
      question: "How long does analysis take?",
      answer: "Most leases are analyzed in under 2 minutes. Complex commercial leases with multiple amendments may take up to 5 minutes. You'll receive real-time progress updates."
    },
    {
      question: "Can I export my analysis reports?",
      answer: "Yes, you can export reports in PDF, Word, or Excel formats. Reports include risk flags, key terms summary, and actionable recommendations for your team."
    },
    {
      question: "Who built this?",
      answer: "A team of property managers, lawyers, and AI engineers fed up with broken lease workflows. We've experienced the pain of missing critical lease terms and built Stayll to solve it."
    },
    {
      question: "What if I manage more than 500 leases?",
      answer: "Our Enterprise plan is designed for large portfolios. We offer custom pricing, dedicated support, and white-label options for property management companies and investment firms."
    },
    {
      question: "Is my data secure?",
      answer: "Yes! We use bank-level encryption and never store sensitive information. All data is encrypted in transit and at rest. We're SOC 2 compliant and you can export or delete your data anytime."
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
              Everything you need to know about Stayll's AI-powered lease analysis
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
                Join Early Access
              </a>
              <a
                href="mailto:hello@stayll.com"
                className="btn bg-gray-800 hover:bg-gray-700 text-gray-200"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 