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
              Stayll Core: One Plan, Clear Size Bands
            </h2>
            <p className="text-lg text-blue-200/65">
              Serious but accessible. If you have 1,000+ leases, missing 1–2% of value is usually hundreds of thousands per year. Stayll costs a fraction of that.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="mx-auto grid max-w-sm gap-8 sm:max-w-none sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {/* Band 1 - 0-500 leases */}
            <div className="relative rounded-2xl bg-gray-800 p-px before:pointer-events-none before:absolute before:-left-40 before:-top-40 before:z-10 before:h-80 before:w-80 before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)] before:rounded-full before:bg-blue-500/80 before:opacity-0 before:blur-3xl before:transition-opacity before:duration-500 hover:before:opacity-100">
              <div className="relative z-20 h-full overflow-hidden rounded-[inherit] bg-gray-950 p-6">
                <div className="mb-6">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-200">Stayll Core</h3>
                    <p className="text-xs text-gray-400">0–500 leases</p>
                  </div>
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-gray-200">$25K</span>
                    <span className="text-sm text-gray-400">/year</span>
                  </div>
                  <p className="text-sm text-blue-200/65">~$50/lease/year</p>
                </div>
                <ul className="mb-6 space-y-2 text-sm">
                  <li className="flex items-start">
                    <svg className="mr-2 h-4 w-4 fill-green-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Automated QA only</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="mr-2 h-4 w-4 fill-green-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Email support</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="mr-2 h-4 w-4 fill-green-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">All Core features</span>
                  </li>
                </ul>
                <a
                  href="#cta"
                  className="btn group w-full bg-linear-to-t from-gray-700 to-gray-600 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%] text-sm"
                >
                  <span className="relative inline-flex items-center justify-center">
                    Get Started
                  </span>
                </a>
              </div>
            </div>

            {/* Band 2 - 500-1,500 leases */}
            <div className="relative rounded-2xl bg-gray-800 p-px before:pointer-events-none before:absolute before:-left-40 before:-top-40 before:z-10 before:h-80 before:w-80 before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)] before:rounded-full before:bg-blue-500/80 before:opacity-0 before:blur-3xl before:transition-opacity before:duration-500 hover:before:opacity-100">
              <div className="relative z-20 h-full overflow-hidden rounded-[inherit] bg-gray-950 p-6">
                <div className="mb-6">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-200">Stayll Core</h3>
                    <p className="text-xs text-gray-400">500–1,500 leases</p>
                  </div>
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-gray-200">$60K</span>
                    <span className="text-sm text-gray-400">/year</span>
                  </div>
                  <p className="text-sm text-blue-200/65">~$40–$120/lease/year</p>
                </div>
                <ul className="mb-6 space-y-2 text-sm">
                  <li className="flex items-start">
                    <svg className="mr-2 h-4 w-4 fill-green-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Human QA for top 20%</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="mr-2 h-4 w-4 fill-green-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">One standard integration</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="mr-2 h-4 w-4 fill-green-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Priority support</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="mr-2 h-4 w-4 fill-green-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">All Core features</span>
                  </li>
                </ul>
                <a
                  href="#cta"
                  className="btn group w-full bg-linear-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%] text-sm"
                >
                  <span className="relative inline-flex items-center justify-center">
                    Request Demo
                  </span>
                </a>
              </div>
            </div>

            {/* Band 3 - 1,500-3,000 leases */}
            <div className="relative rounded-2xl bg-gray-800 p-px before:pointer-events-none before:absolute before:-left-40 before:-top-40 before:z-10 before:h-80 before:w-80 before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)] before:rounded-full before:bg-blue-500/80 before:opacity-0 before:blur-3xl before:transition-opacity before:duration-500 hover:before:opacity-100">
              <div className="relative z-20 h-full overflow-hidden rounded-[inherit] bg-gray-950 p-6">
                <div className="mb-6">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-200">Stayll Core</h3>
                    <p className="text-xs text-gray-400">1,500–3,000 leases</p>
                  </div>
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-gray-200">$120K</span>
                    <span className="text-sm text-gray-400">/year</span>
                  </div>
                  <p className="text-sm text-blue-200/65">~$40–$80/lease/year</p>
                </div>
                <ul className="mb-6 space-y-2 text-sm">
                  <li className="flex items-start">
                    <svg className="mr-2 h-4 w-4 fill-green-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Human QA for top 30%</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="mr-2 h-4 w-4 fill-green-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Multiple integrations</span>
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
                    <span className="text-blue-200/65">All Core features</span>
                  </li>
                </ul>
                <a
                  href="#cta"
                  className="btn group w-full bg-linear-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%] text-sm"
                >
                  <span className="relative inline-flex items-center justify-center">
                    Request Demo
                  </span>
                </a>
              </div>
            </div>

            {/* Band 4 - 3,000+ leases */}
            <div className="relative rounded-2xl bg-gray-800 p-px before:pointer-events-none before:absolute before:-left-40 before:-top-40 before:z-10 before:h-80 before:w-80 before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)] before:rounded-full before:bg-blue-500/80 before:opacity-0 before:blur-3xl before:transition-opacity before:duration-500 hover:before:opacity-100">
              <div className="relative z-20 h-full overflow-hidden rounded-[inherit] bg-gray-950 p-6">
                <div className="mb-6">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-200">Stayll Core</h3>
                    <p className="text-xs text-gray-400">3,000+ leases</p>
                  </div>
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-gray-200">Custom</span>
                  </div>
                  <p className="text-sm text-blue-200/65">Starting ~$180K/year</p>
                </div>
                <ul className="mb-6 space-y-2 text-sm">
                  <li className="flex items-start">
                    <svg className="mr-2 h-4 w-4 fill-green-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Custom QA coverage</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="mr-2 h-4 w-4 fill-green-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Unlimited integrations</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="mr-2 h-4 w-4 fill-green-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Dedicated account manager</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="mr-2 h-4 w-4 fill-green-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">All Core features</span>
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

          {/* What's Included in All Bands */}
          <div className="mt-12 mx-auto max-w-4xl">
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-gray-200 mb-6 text-center">
                What's Included in Every Stayll Core Band
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <svg className="mr-3 h-5 w-5 fill-green-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-blue-200/65">Lease ingestion + structured data extraction</span>
                </div>
                <div className="flex items-start">
                  <svg className="mr-3 h-5 w-5 fill-green-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-blue-200/65">Compliance calendar and key dates</span>
                </div>
                <div className="flex items-start">
                  <svg className="mr-3 h-5 w-5 fill-green-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-blue-200/65">Rent roll, escalation, and exposure views</span>
                </div>
                <div className="flex items-start">
                  <svg className="mr-3 h-5 w-5 fill-green-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-blue-200/65">Basic API or scheduled exports (CSV/ERP-ready)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Note */}
          <div className="mt-12 text-center">
            <div className="mb-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20 inline-block">
              <p className="text-sm text-blue-200 font-medium">
                Founder Guarantee: If we don't show at least 3× value versus subscription cost in the first 12 months, we work with you on price or you can walk.
              </p>
            </div>
            <p className="mt-4 text-sm text-gray-400">
              Not a CLM—this is financial-grade contract data infrastructure. When auditors and CFOs need trusted lease truth, they use Stayll.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
