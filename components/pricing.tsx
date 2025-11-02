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
              Eliminate 1-3% Annual Lease Value Leakage
            </h2>
            <p className="text-lg text-blue-200/65">
              Financial-grade contract data with auditor-certified ≥97% accuracy. Proven ROI: mid-size REIT (1,000 leases) saves $500K-$1.5M annually.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="mx-auto grid max-w-sm gap-8 sm:max-w-none sm:grid-cols-3 lg:gap-8">
            {/* Tier 1 - Institutional Starter */}
            <div className="relative rounded-2xl bg-gray-800 p-px before:pointer-events-none before:absolute before:-left-40 before:-top-40 before:z-10 before:h-80 before:w-80 before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)] before:rounded-full before:bg-blue-500/80 before:opacity-0 before:blur-3xl before:transition-opacity before:duration-500 hover:before:opacity-100">
              <div className="relative z-20 h-full overflow-hidden rounded-[inherit] bg-gray-950 p-8">
                <div className="mb-8">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-200">Pilot</h3>
                    <p className="text-sm text-gray-400">Proof of ROI</p>
                  </div>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-200">$10K</span>
                    <span className="text-sm text-gray-400">-$20K</span>
                  </div>
                  <p className="text-blue-200/65">100 leases, verified outputs, side-by-side audit. Guaranteed 3× ROI or refund.</p>
                </div>
                <ul className="mb-8 space-y-3">
                  <li className="flex items-center">
                    <svg className="mr-3 h-4 w-4 fill-green-500" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">100 commercial leases processed</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-3 h-4 w-4 fill-green-500" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Auditor-verified lease data extraction (≥97% accuracy)</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-3 h-4 w-4 fill-green-500" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Financial impact engine (rent rolls, escalations, cash exposure)</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-3 h-4 w-4 fill-green-500" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Obligation tracker (renewals, payments, deadlines)</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-3 h-4 w-4 fill-green-500" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Audit trail with clause linkage</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-3 h-4 w-4 fill-green-500" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Side-by-side auditor comparison</span>
                  </li>
                </ul>
                <div className="mb-6 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <p className="text-sm text-blue-200 font-medium">3× ROI guarantee or full refund.</p>
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
                    <h3 className="text-lg font-semibold text-gray-200">Annual SaaS</h3>
                    <p className="text-sm text-gray-400">Per-Contract Billing</p>
                  </div>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-200">$50K</span>
                    <span className="text-sm text-gray-400">-$250K</span>
                  </div>
                  <p className="text-blue-200/65">For CRE portfolios with 500-2,000 leases needing verified financial data.</p>
                </div>
                <ul className="mb-8 space-y-3">
                  <li className="flex items-center">
                    <svg className="mr-3 h-4 w-4 fill-green-500" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">500-2,000 leases/year with per-contract pricing</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-3 h-4 w-4 fill-green-500" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Everything in Pilot, plus:</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-3 h-4 w-4 fill-green-500" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">API integration with Yardi, MRI, NetSuite (&lt;2h setup)</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-3 h-4 w-4 fill-green-500" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Human QA for top 20% of contracts</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-3 h-4 w-4 fill-green-500" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Priority support and dedicated onboarding</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-3 h-4 w-4 fill-green-500" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">SOC2 Type II compliant, field-level encryption</span>
                  </li>
                </ul>
                <div className="mb-6 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <p className="text-sm text-blue-200 font-medium">Typical ROI: 10× subscription cost in first year.</p>
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
                    <h3 className="text-lg font-semibold text-gray-200">Enterprise SLA</h3>
                    <p className="text-sm text-gray-400">QA-Backed Accuracy</p>
                  </div>
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-gray-200">$250K-$800K</span>
                  </div>
                  <p className="text-blue-200/65">For institutional portfolios with 2,000+ leases and mission-critical accuracy needs.</p>
                </div>
                <ul className="mb-8 space-y-3">
                  <li className="flex items-center">
                    <svg className="mr-3 h-4 w-4 fill-green-500" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Unlimited commercial leases</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-3 h-4 w-4 fill-green-500" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Everything in Annual SaaS, plus:</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-3 h-4 w-4 fill-green-500" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Dedicated account manager + technical support</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-3 h-4 w-4 fill-green-500" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">On-premise deployment option available</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-3 h-4 w-4 fill-green-500" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Quarterly third-party accuracy audits</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-3 h-4 w-4 fill-green-500" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">SLA-backed uptime (99.9%) and performance</span>
                  </li>
                </ul>
                <div className="mb-6 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <p className="text-sm text-blue-200 font-medium">Protects $1B+ portfolios with auditable financial-grade data.</p>
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

          {/* Bottom Note */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-400">
              Not a CLM—this is financial-grade contract data infrastructure. When auditors and CFOs need trusted lease truth, they use Stayll.
            </p>
            <p className="mt-4 text-sm text-gray-400">
              Pilot available for CRE portfolios with 500+ leases • Auditor-certified accuracy • Typically 10× ROI in first year
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 