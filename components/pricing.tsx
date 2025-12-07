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
          </div>

          {/* Pricing Cards */}
          <div className="mx-auto grid max-w-sm gap-8 sm:max-w-none sm:grid-cols-3 lg:gap-6">
            {/* Pilot */}
            <div className="relative rounded-2xl bg-gray-800 p-px before:pointer-events-none before:absolute before:-left-40 before:-top-40 before:z-10 before:h-80 before:w-80 before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)] before:rounded-full before:bg-blue-500/80 before:opacity-0 before:blur-3xl before:transition-opacity before:duration-500 hover:before:opacity-100">
              <div className="relative z-20 h-full overflow-hidden rounded-[inherit] bg-gray-950 p-6">
                <div className="mb-6">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-200">Pilot</h3>
                  </div>
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-gray-200">$25K</span>
                  </div>
                  <p className="text-sm text-blue-200/65">500 Leases | 30 Days</p>
                </div>
                <ul className="mb-6 space-y-2 text-sm">
                  <li className="flex items-start">
                    <svg className="mr-2 h-4 w-4 fill-green-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">100% Human-Verified</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="mr-2 h-4 w-4 fill-green-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">CSV + Audit Log</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="mr-2 h-4 w-4 fill-green-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Accuracy Guaranteed</span>
                  </li>
                </ul>
                <a
                  href="#cta"
                  className="btn group w-full bg-linear-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%] text-sm"
                >
                  <span className="relative inline-flex items-center justify-center">
                    Request Pilot →
                  </span>
                </a>
              </div>
            </div>

            {/* Portfolio */}
            <div className="relative rounded-2xl bg-gray-800 p-px before:pointer-events-none before:absolute before:-left-40 before:-top-40 before:z-10 before:h-80 before:w-80 before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)] before:rounded-full before:bg-blue-500/80 before:opacity-0 before:blur-3xl before:transition-opacity before:duration-500 hover:before:opacity-100 border-2 border-blue-500/50">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Popular
                </span>
              </div>
              <div className="relative z-20 h-full overflow-hidden rounded-[inherit] bg-gray-950 p-6">
                <div className="mb-6">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-200">Portfolio</h3>
                  </div>
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-gray-200">$50K</span>
                  </div>
                  <p className="text-sm text-blue-200/65">1,500 Leases | 60 Days</p>
                </div>
                <ul className="mb-6 space-y-2 text-sm">
                  <li className="flex items-start">
                    <svg className="mr-2 h-4 w-4 fill-green-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Quarterly Updates</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="mr-2 h-4 w-4 fill-green-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">API Access (Q2)</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="mr-2 h-4 w-4 fill-green-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Priority Support</span>
                  </li>
                </ul>
                <a
                  href="#cta"
                  className="btn group w-full bg-linear-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%] text-sm"
                >
                  <span className="relative inline-flex items-center justify-center">
                    Request Quote →
                  </span>
                </a>
              </div>
            </div>

            {/* Enterprise */}
            <div className="relative rounded-2xl bg-gray-800 p-px before:pointer-events-none before:absolute before:-left-40 before:-top-40 before:z-10 before:h-80 before:w-80 before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)] before:rounded-full before:bg-blue-500/80 before:opacity-0 before:blur-3xl before:transition-opacity before:duration-500 hover:before:opacity-100">
              <div className="relative z-20 h-full overflow-hidden rounded-[inherit] bg-gray-950 p-6">
                <div className="mb-6">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-200">Enterprise</h3>
                  </div>
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-gray-200">$100K+</span>
                  </div>
                  <p className="text-sm text-blue-200/65">5,000+ Leases | 90 Days</p>
                </div>
                <ul className="mb-6 space-y-2 text-sm">
                  <li className="flex items-start">
                    <svg className="mr-2 h-4 w-4 fill-green-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Native Yardi/MRI</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="mr-2 h-4 w-4 fill-green-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Dedicated Support</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="mr-2 h-4 w-4 fill-green-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Custom SLA</span>
                  </li>
                </ul>
                <a
                  href="#cta"
                  className="btn group w-full bg-linear-to-t from-gray-700 to-gray-600 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%] text-sm"
                >
                  <span className="relative inline-flex items-center justify-center">
                    Contact Sales →
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Note */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-400">
              This is a managed service, not SaaS. We deliver verified data you can trust. No subscriptions until you've seen the ROI.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
