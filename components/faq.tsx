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
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="border-t py-12 [border-image:linear-gradient(to_right,transparent,--theme(--color-slate-400/.25),transparent)1] md:py-20">
          {/* Section header */}
          <div className="mx-auto max-w-3xl pb-4 text-center md:pb-12">
            <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-linear-to-r before:from-transparent before:to-blue-200/50 after:h-px after:w-8 after:bg-linear-to-l after:from-transparent after:to-blue-200/50">
              <span className="inline-flex bg-linear-to-r from-blue-500 to-blue-200 bg-clip-text text-transparent">
                FAQ
              </span>
            </div>
            <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-blue-200),var(--color-gray-50),var(--color-blue-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text pb-4 font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-blue-200/65">
              Everything you need to know about Stayll's AI-powered lease analysis
            </p>
          </div>

          {/* FAQ items */}
          <div className="mx-auto grid max-w-sm gap-8 sm:max-w-none sm:grid-cols-2 lg:gap-x-14 md:gap-y-16">
            {faqs.map((faq, index) => (
              <article key={index} className="border-l-4 border-blue-500/50 pl-6">
                <h3 className="mb-1 font-nacelle text-[1rem] font-semibold text-gray-200">
                  {faq.question}
                </h3>
                <p className="text-blue-200/65">
                  {faq.answer}
                </p>
              </article>
            ))}
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