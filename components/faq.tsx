"use client";

import { useState } from "react";

export default function FAQ() {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const faqs = [
    {
      question: "What lease types?",
      answer: "Commercial only: office, retail, industrial, multifamily. No residential. We specialize in complex rent schedules, CPI escalations, and renewal options."
    },
    {
      question: "How accurate?",
      answer: "≥95% recall on 20 financial fields. Every lease is human-verified. Every field is clause-linked. <2% error rate or we re‑abstract for free."
    },
    {
      question: "Yardi integration?",
      answer: "Native API push available for Portfolio and Enterprise plans (launches Q2 2026). CSV works with all systems today."
    },
    {
      question: "Security?",
      answer: "AES‑256 encryption, single‑tenant schemas, SOC 2 Type II in progress (target Q4 2026). You own your data; we delete on request."
    },
    {
      question: "Processing time?",
      answer: "Automated extraction: <3 min/lease. Full pilot delivery: 30 days (includes 100% human QA)."
    },
    {
      question: "Export formats?",
      answer: "CSV rent roll, iCal compliance calendar, PDF audit package. API for direct Yardi/MRI push (Enterprise)."
    },
    {
      question: "Who is this for?",
      answer: "CFOs, asset managers, and portfolio accountants at CRE firms managing 500–5,000 leases. If you rely on offshore abstractors or manual Excel, Stayll is for you."
    },
    {
      question: "CLM vs. Stayll?",
      answer: "CLMs (Ironclad, Evisort) manage legal workflows. Stayll extracts financial data with audit‑grade accuracy. We don't do redlines—we give you numbers your CFO can trust."
    },
    {
      question: "Scanned leases?",
      answer: "Yes. Google Document AI handles OCR. Scanned leases have 5% lower automated accuracy, but our human QA team verifies every field. We flag low‑quality scans before processing."
    },
    {
      question: "ROI guarantee?",
      answer: "3× value in Year 1—if we don't save you 1–3% of lease value, we refund 50% of your pilot fee (written in contract)."
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#cta"
                className="btn bg-blue-600 hover:bg-blue-500 text-white"
              >
                Request a Pilot
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
