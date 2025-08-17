import Image from "next/image";
import BlurredShape from "@/public/images/blurred-shape.svg";

export default function Pricing() {
  return (
    <section id="pricing" className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -z-10 -mb-24 ml-20 -translate-x-1/2"
        aria-hidden="true"
      >
        <Image
          className="max-w-none"
          src={BlurredShape}
          width={760}
          height={668}
          alt="Blurred shape"
        />
      </div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="mx-auto max-w-3xl pb-12 text-center md:pb-20">
            <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-linear-to-r before:from-transparent before:to-blue-200/50 after:h-px after:w-8 after:bg-linear-to-l after:from-transparent after:to-blue-200/50">
              <span className="inline-flex bg-linear-to-r from-blue-500 to-blue-200 bg-clip-text text-transparent">
                Pricing
              </span>
            </div>
            <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-blue-200),var(--color-gray-50),var(--color-blue-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text pb-4 font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              Stayll Pricing — Built for Institutional Scale
            </h2>
            <p className="text-lg text-blue-200/65">
              Every tier screams ROI, not feature bloat. Scale on risk protection, compliance, and revenue recovery.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="mx-auto grid max-w-sm gap-8 sm:max-w-none sm:grid-cols-3 lg:gap-8">
            {/* Tier 1 - Institutional Starter */}
            <div className="relative rounded-2xl bg-gray-800 p-px before:pointer-events-none before:absolute before:-left-40 before:-top-40 before:z-10 before:h-80 before:w-80 before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)] before:rounded-full before:bg-blue-500/80 before:opacity-0 before:blur-3xl before:transition-opacity before:duration-500 hover:before:opacity-100">
              <div className="relative z-20 h-full overflow-hidden rounded-[inherit] bg-gray-950 p-8">
                <div className="mb-8">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-200">Institutional Starter</h3>
                    <p className="text-sm text-gray-400">🚀 Land & Expand Wedge</p>
                  </div>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-200">$25k</span>
                    <span className="text-sm text-gray-400">/year</span>
                  </div>
                  <p className="text-blue-200/65">For mid-sized operators looking to cut review costs fast.</p>
                </div>
                <ul className="mb-8 space-y-3">
                  <li className="flex items-center">
                    <svg className="mr-3 h-4 w-4 fill-green-500" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Up to 500 leases/year</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-3 h-4 w-4 fill-green-500" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">AI extraction of key terms (rent, escalations, renewals)</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-3 h-4 w-4 fill-green-500" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Risk flags & missing clause detection</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-3 h-4 w-4 fill-green-500" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Automated alerts before escalations/renewals hit</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-3 h-4 w-4 fill-green-500" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Yardi integration (basic sync)</span>
                  </li>
                </ul>
                <div className="mb-6 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <p className="text-sm text-blue-200 font-medium">👉 Perfect for proving ROI in year one.</p>
                </div>
                <a
                  href="#cta"
                  className="btn group w-full bg-linear-to-t from-gray-700 to-gray-600 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%]"
                >
                  <span className="relative inline-flex items-center">
                    Request Demo
                    <span className="ml-1 tracking-normal text-white/50 transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </span>
                </a>
              </div>
            </div>

            {/* Tier 2 - Institutional Pro */}
            <div className="relative rounded-2xl bg-gray-800 p-px before:pointer-events-none before:absolute before:-left-40 before:-top-40 before:z-10 before:h-80 before:w-80 before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)] before:rounded-full before:bg-blue-500/80 before:opacity-0 before:blur-3xl before:transition-opacity before:duration-500 hover:before:opacity-100">
              <div className="relative z-20 h-full overflow-hidden rounded-[inherit] bg-gray-950 p-8">
                <div className="mb-8">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-200">Institutional Pro</h3>
                    <p className="text-sm text-gray-400">🏆 The Mainstay Tier</p>
                  </div>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-200">$50k–75k</span>
                    <span className="text-sm text-gray-400">/year</span>
                  </div>
                  <p className="text-blue-200/65">For large portfolios that need active risk & revenue intelligence.</p>
                </div>
                <ul className="mb-8 space-y-3">
                  <li className="flex items-center">
                    <svg className="mr-3 h-4 w-4 fill-green-500" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Up to 2,000 leases/year</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-3 h-4 w-4 fill-green-500" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Everything in Starter, plus:</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-3 h-4 w-4 fill-green-500" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Predictive ROI models ("You're losing $X on these leases")</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-3 h-4 w-4 fill-green-500" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Market benchmarking against peers & standards</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-3 h-4 w-4 fill-green-500" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Compliance automation (catch violations early)</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-3 h-4 w-4 fill-green-500" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Yardi + RealPage integration (deep workflow)</span>
                  </li>
                </ul>
                <div className="mb-6 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <p className="text-sm text-blue-200 font-medium">👉 Most customers graduate here within 12 months — average recovery = $75k+ per portfolio.</p>
                </div>
                <a
                  href="#cta"
                  className="btn group w-full bg-linear-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%]"
                >
                  <span className="relative inline-flex items-center">
                    Request Demo
                    <span className="ml-1 tracking-normal text-white/50 transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </span>
                </a>
              </div>
            </div>

            {/* Tier 3 - Enterprise Platinum */}
            <div className="relative rounded-2xl bg-gray-800 p-px before:pointer-events-none before:absolute before:-left-40 before:-top-40 before:z-10 before:h-80 before:w-80 before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)] before:rounded-full before:bg-blue-500/80 before:opacity-0 before:blur-3xl before:transition-opacity before:duration-500 hover:before:opacity-100">
              <div className="relative z-20 h-full overflow-hidden rounded-[inherit] bg-gray-950 p-8">
                <div className="mb-8">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-200">Enterprise Platinum</h3>
                    <p className="text-sm text-gray-400">🛡️ The Defensible Moat</p>
                  </div>
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-gray-200">$100k–250k</span>
                    <span className="text-sm text-gray-400">/year</span>
                  </div>
                  <p className="text-blue-200/65">For REITs and institutional owners with massive portfolios.</p>
                </div>
                <ul className="mb-8 space-y-3">
                  <li className="flex items-center">
                    <svg className="mr-3 h-4 w-4 fill-green-500" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Unlimited leases</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-3 h-4 w-4 fill-green-500" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Everything in Pro, plus:</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-3 h-4 w-4 fill-green-500" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Portfolio intelligence dashboard (portfolio-wide risk/revenue view)</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-3 h-4 w-4 fill-green-500" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Custom compliance & ESG modules</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-3 h-4 w-4 fill-green-500" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Dedicated account manager + legal validation</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-3 h-4 w-4 fill-green-500" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Insurance-backed coverage for AI review (optional)</span>
                  </li>
                </ul>
                <div className="mb-6 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <p className="text-sm text-blue-200 font-medium">👉 Designed to protect $1B+ portfolios from 7-figure risks.</p>
                </div>
                <a
                  href="#cta"
                  className="btn group w-full bg-linear-to-t from-gray-700 to-gray-600 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%]"
                >
                  <span className="relative inline-flex items-center">
                    Contact Sales
                    <span className="ml-1 tracking-normal text-white/50 transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Positioning Notes */}
          <div className="mt-12 text-center">
            <h3 className="mb-6 text-xl font-semibold text-gray-200">🔑 Positioning Strategy</h3>
            <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-3">
              <div className="rounded-lg bg-gray-800 p-6">
                <h4 className="mb-3 font-medium text-gray-200">Starter = "prove it works"</h4>
                <p className="text-sm text-blue-200/65">Land customers with clear ROI demonstration</p>
              </div>
              <div className="rounded-lg bg-gray-800 p-6">
                <h4 className="mb-3 font-medium text-gray-200">Pro = "this is the real product"</h4>
                <p className="text-sm text-blue-200/65">Expand revenue with comprehensive risk intelligence</p>
              </div>
              <div className="rounded-lg bg-gray-800 p-6">
                <h4 className="mb-3 font-medium text-gray-200">Enterprise = "you can't live without us"</h4>
                <p className="text-sm text-blue-200/65">Defensible moat with portfolio-wide protection</p>
              </div>
            </div>
          </div>

          {/* Bottom Note */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-400">
              ⚡ Brutal truth: sell "leases processed" and you'll stall at $25k. Sell "dollars saved" and you'll hit $75k+ ACV with ease.
            </p>
            <p className="mt-4 text-sm text-gray-400">
              Free 90-day pilots available for qualified REITs • Average $75k+ recovered per portfolio • 50% reduction in legal review costs
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 