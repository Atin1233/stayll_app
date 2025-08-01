import Image from "next/image";
import BlurredShape from "@/public/images/blurred-shape.svg";

export default function Pricing() {
  return (
    <section id="who-its-for" className="relative overflow-hidden">
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
                Who It's For
              </span>
            </div>
            <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-blue-200),var(--color-gray-50),var(--color-blue-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text pb-4 font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              Built for professionals who manage leases at scale
            </h2>
            <p className="text-lg text-blue-200/65">
              From property managers to legal teams, Stayll helps you understand your lease portfolio instantly.
            </p>
          </div>

          {/* Target Audience */}
          <div className="mx-auto grid max-w-sm gap-8 sm:max-w-none sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            <div className="relative rounded-2xl bg-gray-800 p-px before:pointer-events-none before:absolute before:-left-40 before:-top-40 before:z-10 before:h-80 before:w-80 before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)] before:rounded-full before:bg-blue-500/80 before:opacity-0 before:blur-3xl before:transition-opacity before:duration-500 hover:before:opacity-100">
              <div className="relative z-20 h-full overflow-hidden rounded-[inherit] bg-gray-950 p-8">
                <div className="mb-8">
                  <div className="mb-4">
                    <span className="btn-sm relative rounded-full bg-gray-800/40 px-2.5 py-0.5 text-xs font-normal before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_bottom,--theme(--color-gray-700/.15),--theme(--color-gray-700/.5))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] hover:bg-gray-800/60">
                      <span className="bg-linear-to-r from-blue-500 to-blue-200 bg-clip-text text-transparent">
                        Property Managers
                      </span>
                    </span>
                  </div>
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-gray-200">50–5,000 units</span>
                  </div>
                  <p className="text-blue-200/65">Manage complex lease portfolios with AI-powered insights and risk assessment.</p>
                </div>
                <ul className="mb-8 space-y-3">
                  <li className="flex items-center">
                    <svg className="mr-3 h-4 w-4 fill-green-500" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">AI lease analysis</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-3 h-4 w-4 fill-green-500" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Risk flagging</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-3 h-4 w-4 fill-green-500" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Tenant risk scoring</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative rounded-2xl bg-gray-800 p-px before:pointer-events-none before:absolute before:-left-40 before:-top-40 before:z-10 before:h-80 before:w-80 before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)] before:rounded-full before:bg-blue-500/80 before:opacity-0 before:blur-3xl before:transition-opacity before:duration-500 hover:before:opacity-100">
              <div className="relative z-20 h-full overflow-hidden rounded-[inherit] bg-gray-950 p-8">
                <div className="mb-8">
                  <div className="mb-4">
                    <span className="btn-sm relative rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs font-normal before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_bottom,--theme(--color-blue-500/.15),--theme(--color-blue-500/.5))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] hover:bg-blue-500/30">
                      <span className="bg-linear-to-r from-blue-500 to-blue-200 bg-clip-text text-transparent">
                        Legal Teams
                      </span>
                    </span>
                  </div>
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-gray-200">Due diligence & compliance</span>
                  </div>
                  <p className="text-blue-200/65">Streamline lease review processes with AI-powered legal analysis and compliance checking.</p>
                </div>
                <ul className="mb-8 space-y-3">
                  <li className="flex items-center">
                    <svg className="mr-3 h-4 w-4 fill-green-500" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Compliance checking</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-3 h-4 w-4 fill-green-500" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Legal risk assessment</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-3 h-4 w-4 fill-green-500" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Document analysis</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative rounded-2xl bg-gray-800 p-px before:pointer-events-none before:absolute before:-left-40 before:-top-40 before:z-10 before:h-80 before:w-80 before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)] before:rounded-full before:bg-blue-500/80 before:opacity-0 before:blur-3xl before:transition-opacity before:duration-500 hover:before:opacity-100">
              <div className="relative z-20 h-full overflow-hidden rounded-[inherit] bg-gray-950 p-8">
                <div className="mb-8">
                  <div className="mb-4">
                    <span className="btn-sm relative rounded-full bg-gray-800/40 px-2.5 py-0.5 text-xs font-normal before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_bottom,--theme(--color-gray-700/.15),--theme(--color-gray-700/.5))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] hover:bg-gray-800/60">
                      <span className="bg-linear-to-r from-blue-500 to-blue-200 bg-clip-text text-transparent">
                        Investment Teams
                      </span>
                    </span>
                  </div>
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-gray-200">Portfolio optimization</span>
                  </div>
                  <p className="text-blue-200/65">Make data-driven investment decisions with comprehensive lease intelligence and risk analysis.</p>
                </div>
                <ul className="mb-8 space-y-3">
                  <li className="flex items-center">
                    <svg className="mr-3 h-4 w-4 fill-green-500" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Portfolio analysis</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-3 h-4 w-4 fill-green-500" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Risk assessment</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-3 h-4 w-4 fill-green-500" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-200/65">Investment insights</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Pricing Table */}
          <div className="mx-auto max-w-6xl text-center mt-16">
            <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-linear-to-r before:from-transparent before:to-green-200/50 after:h-px after:w-8 after:bg-linear-to-l after:from-transparent after:to-green-200/50">
              <span className="inline-flex bg-linear-to-r from-green-500 to-green-200 bg-clip-text text-transparent">
                Pricing
              </span>
            </div>
            <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-green-200),var(--color-gray-50),var(--color-green-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text pb-4 font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-green-200/65 mb-8">
              Start free during beta, scale as you grow
            </p>

            {/* Pricing Table */}
            <div className="overflow-x-auto">
              <table className="w-full max-w-4xl mx-auto bg-gray-900/50 rounded-lg border border-gray-700/50">
                <thead>
                  <tr className="border-b border-gray-700/50">
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Plan</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Who It's For</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-300">Monthly</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-300">Annual (2 months free)</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Features</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  <tr className="hover:bg-gray-800/30">
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Free Beta
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">Landlords testing the product</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-2xl font-bold text-green-400">$0</span>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-400">—</td>
                    <td className="px-6 py-4 text-sm text-gray-300">Up to <strong>5 leases/month</strong>, email support, basic AI extraction</td>
                  </tr>
                  <tr className="hover:bg-gray-800/30">
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Starter
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">Solopreneurs, small PMs</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-2xl font-bold text-blue-400">$99</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-lg font-semibold text-blue-400">$990/year</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">Up to <strong>50 leases/month</strong>, AI insights, manual lease uploads</td>
                  </tr>
                  <tr className="hover:bg-gray-800/30">
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Pro
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">Growing teams, small agencies</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-2xl font-bold text-purple-400">$299</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-lg font-semibold text-purple-400">$2,990/year</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">Up to <strong>500 leases/month</strong>, team access, custom tags, API read access</td>
                  </tr>
                  <tr className="hover:bg-gray-800/30">
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        Enterprise
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">Large PMs or real estate firms</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-lg font-semibold text-orange-400">Starts at $999</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-gray-400">Custom pricing</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300"><strong>Unlimited leases</strong>, advanced integrations, priority support, onboarding</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-400 mb-4">
                All plans include AI-powered lease analysis, risk flagging, and tenant insights
              </p>
              <a
                href="#cta"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Start Free Beta
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 