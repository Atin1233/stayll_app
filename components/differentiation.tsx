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
              We Don't Read Contracts. We Deliver Financial Truth.
            </h2>
          </div>

          {/* Comparison table */}
          <div className="mx-auto max-w-5xl">
            <div className="overflow-hidden rounded-2xl border border-gray-700/50 bg-gray-800/30 backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-700/50 bg-gray-900/50">
                      <th className="px-6 py-4 text-left font-nacelle text-sm font-semibold text-gray-200">
                        Feature
                      </th>
                      <th className="px-6 py-4 text-center font-nacelle text-sm font-semibold text-blue-300">
                        <div className="flex flex-col items-center">
                          <span>Stayll</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-center font-nacelle text-sm font-semibold text-gray-400">
                        Offshore Abstractors
                      </th>
                      <th className="px-6 py-4 text-center font-nacelle text-sm font-semibold text-gray-400">
                        Generic AI Tools
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-700/30">
                      <td className="px-6 py-4 text-sm text-gray-300">Accuracy Guarantee</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
                          ≥95% audited by CPAs
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">Not verified</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">80–85% confidence only</td>
                    </tr>
                    <tr className="border-b border-gray-700/30">
                      <td className="px-6 py-4 text-sm text-gray-300">Clause-Level Evidence</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
                          Every field linked to PDF
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">None</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">Sometimes</td>
                    </tr>
                    <tr className="border-b border-gray-700/30">
                      <td className="px-6 py-4 text-sm text-gray-300">Financial Reconciliation</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
                          Rent schedules must sum ±$1
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">None</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">None</td>
                    </tr>
                    <tr className="border-b border-gray-700/30">
                      <td className="px-6 py-4 text-sm text-gray-300">Yardi/MRI Integration</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
                          Native API (Q2 2026)
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">CSV only</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">CSV only</td>
                    </tr>
                    <tr className="border-b border-gray-700/30">
                      <td className="px-6 py-4 text-sm text-gray-300">CFO-Ready Data</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
                          Auditor-certified
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">Manual cleanup required</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">Not compliant</td>
                    </tr>
                    <tr className="border-b border-gray-700/30">
                      <td className="px-6 py-4 text-sm text-gray-300">Delivery Speed</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
                          30 days (500 leases)
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">60–90 days</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">Instant (but wrong)</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-300">ROI Guarantee</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
                          3× value or refund
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
            <p className="mb-4 text-lg text-blue-200/80">
              <strong className="text-white">Stayll</strong> isn't a document tool. It's the financial backbone for CRE portfolios.
            </p>
            <p className="text-sm text-gray-400 max-w-2xl mx-auto">
              When auditors need lease truth—they use Stayll. When CFOs need clean data—they use Stayll. When you need to stop bleeding money—they use Stayll.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
