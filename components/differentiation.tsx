import Image from "next/image";
import BlurredShape from "@/public/images/blurred-shape.svg";

export default function Differentiation() {
  return (
    <section id="differentiation" className="relative">
      {/* Background decoration */}
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
                Why Stayll
              </span>
            </div>
            <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-blue-200),var(--color-gray-50),var(--color-blue-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text pb-4 font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              Financial-Grade Accuracy You Can Trust
            </h2>
            <p className="text-lg text-blue-200/65">
              Not another document AI—this is auditor-certified contract data infrastructure for financial systems.
            </p>
          </div>

          {/* Differentiation grid */}
          <div className="mx-auto grid max-w-sm gap-8 sm:max-w-none sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12">
            {/* Feature 1 */}
            <article className="group rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 p-8 transition-all hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
                <svg className="h-6 w-6 fill-blue-400" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="mb-3 font-nacelle text-xl font-semibold text-gray-200">
                Auditor-Backed Accuracy
              </h3>
              <p className="text-blue-200/65">
                ≥97% recall verified by third-party auditors. Every field clause-linked with traceable evidence. Use in financial statements.
              </p>
            </article>

            {/* Feature 2 */}
            <article className="group rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 p-8 transition-all hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
                <svg className="h-6 w-6 fill-blue-400" viewBox="0 0 20 20">
                  <path d="M13 7H7v6h6V7z"/>
                  <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="mb-3 font-nacelle text-xl font-semibold text-gray-200">
                4-Layer Verification
              </h3>
              <p className="text-blue-200/65">
                LLM extraction → Rule validation → Financial reconciliation → Human QA pipeline ensures trustable outputs.
              </p>
            </article>

            {/* Feature 3 */}
            <article className="group rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 p-8 transition-all hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
                <svg className="h-6 w-6 fill-blue-400" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="mb-3 font-nacelle text-xl font-semibold text-gray-200">
                Built for CRE Finance
              </h3>
              <p className="text-blue-200/65">
                50K+ proprietary lease corpus. Deep understanding of rent schedules, escalations, renewals. Asset manager language.
              </p>
            </article>

            {/* Feature 4 */}
            <article className="group rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 p-8 transition-all hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
                <svg className="h-6 w-6 fill-blue-400" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                </svg>
              </div>
              <h3 className="mb-3 font-nacelle text-xl font-semibold text-gray-200">
                Data Layer, Not Workflow
              </h3>
              <p className="text-blue-200/65">
                API-first for ERP/BI integration. No drafting, signatures, or collaboration fluff. Just verified financial data.
              </p>
            </article>

            {/* Feature 5 */}
            <article className="group rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 p-8 transition-all hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
                <svg className="h-6 w-6 fill-blue-400" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="mb-3 font-nacelle text-xl font-semibold text-gray-200">
                Deterministic + AI Hybrid
              </h3>
              <p className="text-blue-200/65">
                AI for meaning, rules for math. Rent tables verified by formula. Spreadsheet-grade precision at AI scale.
              </p>
            </article>

            {/* Feature 6 */}
            <article className="group rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 p-8 transition-all hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
                <svg className="h-6 w-6 fill-blue-400" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="mb-3 font-nacelle text-xl font-semibold text-gray-200">
                Measurable Financial ROI
              </h3>
              <p className="text-blue-200/65">
                Eliminates 1-3% leakage from missed escalations. 3× ROI guarantee. Pricing tied to results, not seats.
              </p>
            </article>
          </div>

          {/* Comparison table */}
          <div className="mt-16">
            <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-gray-700/50 bg-gray-800/30 backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-700/50">
                      <th className="px-6 py-4 text-left font-nacelle text-sm font-semibold text-gray-200">
                        Feature
                      </th>
                      <th className="px-6 py-4 text-center font-nacelle text-sm font-semibold text-blue-300">
                        <div className="flex flex-col items-center">
                          <span>Stayll</span>
                          <span className="text-xs font-normal text-gray-400">Financial-Grade Data</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-center font-nacelle text-sm font-semibold text-gray-400">
                        Generic CLM
                      </th>
                      <th className="px-6 py-4 text-center font-nacelle text-sm font-semibold text-gray-400">
                        Document AI
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-700/30">
                      <td className="px-6 py-4 text-sm text-gray-300">Accuracy Verification</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
                          ≥97% audited
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">Not verified</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">Confidence scores</td>
                    </tr>
                    <tr className="border-b border-gray-700/30">
                      <td className="px-6 py-4 text-sm text-gray-300">Clause Linkage</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
                          Every field
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">None</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">Sometimes</td>
                    </tr>
                    <tr className="border-b border-gray-700/30">
                      <td className="px-6 py-4 text-sm text-gray-300">CRE Specialization</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
                          50K+ leases
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">General purpose</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">General purpose</td>
                    </tr>
                    <tr className="border-b border-gray-700/30">
                      <td className="px-6 py-4 text-sm text-gray-300">Financial Statement Use</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
                          Yes, certified
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">No</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">No</td>
                    </tr>
                    <tr className="border-b border-gray-700/30">
                      <td className="px-6 py-4 text-sm text-gray-300">Deterministic Validation</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
                          Multi-layer
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">None</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">Basic</td>
                    </tr>
                    <tr className="border-b border-gray-700/30">
                      <td className="px-6 py-4 text-sm text-gray-300">ERP/BI Integration</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
                          API-first
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">Workflow focused</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">Limited</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-300">ROI Guarantee</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
                          3× or refund
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">None</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">None</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <p className="mb-6 text-lg text-blue-200/80">
              <strong className="text-white">Stayll</strong> isn't a document tool—it's the <strong className="text-white">truth engine</strong> for contract data.
            </p>
            <p className="text-sm text-gray-400">
              Financial accuracy, auditor certification, and measurable ROI—the things every CFO pays for and no competitor guarantees.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

