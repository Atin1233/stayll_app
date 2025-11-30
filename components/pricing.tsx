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
              Project-Based Pricing: Fixed Price, Guaranteed Delivery
            </h2>
            <p className="text-lg text-blue-200/65">
              No subscriptions. Pay per project. Get your lease abstracts delivered in 30-90 days with accuracy guaranteed.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="mx-auto grid max-w-sm gap-8 sm:max-w-none sm:grid-cols-3 lg:gap-6">
            {/* Pilot - 500 leases */}
            <div className="relative rounded-2xl bg-gray-800 p-px before:pointer-events-none before:absolute before:-left-40 before:-top-40 before:z-10 before:h-80 before:w-80 before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)] before:rounded-full before:bg-blue-500/80 before:opacity-0 before:blur-3xl before:transition-opacity before:duration-500 hover:before:opacity-100">
              <div className="relative z-20 h-full overflow-hidden rounded-[inherit] bg-gray-950 p-6">
                <div className="mb-6">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-200">Pilot</h3>
                    <p className="text-xs text-gray-400">500 leases</p>
                  </div>
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-gray-200">$25K</span>
                  </div>
                  <p className="text-sm text-blue-200/65">30 days delivery</p>
                </div>
                <ul className="mb-6 space-y-2 text-sm">
                  <li className="flex items-start">
                    <svg className="mr-2 h-4 w-4 fill-green-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">500 lease abstracts</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="mr-2 h-4 w-4 fill-green-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">CSV rent roll</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="mr-2 h-4 w-4 fill-green-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Audit log</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="mr-2 h-4 w-4 fill-green-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Accuracy guaranteed</span>
                  </li>
                </ul>
                <a
                  href="#cta"
                  className="btn group w-full bg-linear-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%] text-sm"
                >
                  <span className="relative inline-flex items-center justify-center">
                    Request Pilot
                  </span>
                </a>
              </div>
            </div>

            {/* Portfolio - 1,500 leases */}
            <div className="relative rounded-2xl bg-gray-800 p-px before:pointer-events-none before:absolute before:-left-40 before:-top-40 before:z-10 before:h-80 before:w-80 before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)] before:rounded-full before:bg-blue-500/80 before:opacity-0 before:blur-3xl before:transition-opacity before:duration-500 hover:before:opacity-100">
              <div className="relative z-20 h-full overflow-hidden rounded-[inherit] bg-gray-950 p-6">
                <div className="mb-6">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-200">Portfolio</h3>
                    <p className="text-xs text-gray-400">1,500 leases</p>
                  </div>
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-gray-200">$50K</span>
                  </div>
                  <p className="text-sm text-blue-200/65">60 days delivery</p>
                </div>
                <ul className="mb-6 space-y-2 text-sm">
                  <li className="flex items-start">
                    <svg className="mr-2 h-4 w-4 fill-green-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">1,500 lease abstracts</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="mr-2 h-4 w-4 fill-green-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">CSV rent roll + quarterly updates</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="mr-2 h-4 w-4 fill-green-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Full audit log</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="mr-2 h-4 w-4 fill-green-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Priority support</span>
                  </li>
                </ul>
                <a
                  href="#cta"
                  className="btn group w-full bg-linear-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%] text-sm"
                >
                  <span className="relative inline-flex items-center justify-center">
                    Request Quote
                  </span>
                </a>
              </div>
            </div>

            {/* Custom - 5,000+ leases */}
            <div className="relative rounded-2xl bg-gray-800 p-px before:pointer-events-none before:absolute before:-left-40 before:-top-40 before:z-10 before:h-80 before:w-80 before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)] before:rounded-full before:bg-blue-500/80 before:opacity-0 before:blur-3xl before:transition-opacity before:duration-500 hover:before:opacity-100">
              <div className="relative z-20 h-full overflow-hidden rounded-[inherit] bg-gray-950 p-6">
                <div className="mb-6">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-200">Custom</h3>
                    <p className="text-xs text-gray-400">5,000+ leases</p>
                  </div>
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-gray-200">$100K+</span>
                  </div>
                  <p className="text-sm text-blue-200/65">90 days delivery</p>
                </div>
                <ul className="mb-6 space-y-2 text-sm">
                  <li className="flex items-start">
                    <svg className="mr-2 h-4 w-4 fill-green-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">5,000+ lease abstracts</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="mr-2 h-4 w-4 fill-green-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">API access</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="mr-2 h-4 w-4 fill-green-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Dedicated support</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="mr-2 h-4 w-4 fill-green-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Custom deliverables</span>
                  </li>
                </ul>
                <a
                  href="#cta"
                  className="btn group w-full bg-linear-to-t from-gray-700 to-gray-600 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%] text-sm"
                >
                  <span className="relative inline-flex items-center justify-center">
                    Contact Sales
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Note */}
          <div className="mt-12 text-center">
            <div className="mb-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20 inline-block">
              <p className="text-sm text-blue-200 font-medium">
                This is a managed service, not SaaS. We abstract your leases and deliver structured data. Accuracy guaranteed.
              </p>
            </div>
            <p className="mt-4 text-sm text-gray-400">
              Stop paying $200/lease to offshore abstractors. Get faster, auditable results with AI-assisted quality control.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
