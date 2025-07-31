import Image from "next/image";
import BlurredShape from "@/public/images/blurred-shape.svg";

export default function Pricing() {
  return (
    <section id="who-its-for">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Who It's For */}
          <div className="mx-auto max-w-3xl text-center mb-16">
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

          {/* Target Audience Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-400 text-2xl">🏢</span>
              </div>
              <h3 className="text-gray-200 font-semibold mb-2">Property Managers</h3>
              <p className="text-blue-200/65 text-sm">50–5,000 units</p>
            </div>
            
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-400 text-2xl">🏘️</span>
              </div>
              <h3 className="text-gray-200 font-semibold mb-2">Multifamily Owners & Syndicators</h3>
              <p className="text-blue-200/65 text-sm">Portfolio analysis</p>
            </div>
            
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-400 text-2xl">🏭</span>
              </div>
              <h3 className="text-gray-200 font-semibold mb-2">Commercial Landlords</h3>
              <p className="text-blue-200/65 text-sm">Complex lease terms</p>
            </div>
            
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-400 text-2xl">⚖️</span>
              </div>
              <h3 className="text-gray-200 font-semibold mb-2">Real Estate Legal Teams</h3>
              <p className="text-blue-200/65 text-sm">Due diligence & compliance</p>
            </div>
            
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-400 text-2xl">🔍</span>
              </div>
              <h3 className="text-gray-200 font-semibold mb-2">Due Diligence Analysts</h3>
              <p className="text-blue-200/65 text-sm">Risk assessment</p>
            </div>
            
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-400 text-2xl">📈</span>
              </div>
              <h3 className="text-gray-200 font-semibold mb-2">Investment Teams</h3>
              <p className="text-blue-200/65 text-sm">Portfolio optimization</p>
            </div>
          </div>

          {/* Pricing Preview */}
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-linear-to-r before:from-transparent before:to-green-200/50 after:h-px after:w-8 after:bg-linear-to-l after:from-transparent after:to-green-200/50">
              <span className="inline-flex bg-linear-to-r from-green-500 to-green-200 bg-clip-text text-transparent">
                Pricing Preview
              </span>
            </div>
            <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-green-200),var(--color-gray-50),var(--color-green-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text pb-4 font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-green-200/65 mb-8">
              → Free during beta.
            </p>
            
            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6">
                <h3 className="text-gray-200 font-semibold mb-2">Starter</h3>
                <p className="text-green-400 font-bold text-2xl mb-2">$499/mo</p>
                <p className="text-blue-200/65 text-sm mb-4">50 leases/month, basic reports</p>
                <ul className="text-blue-200/65 text-sm space-y-2">
                  <li>• AI lease analysis</li>
                  <li>• Risk flagging</li>
                  <li>• Basic reports</li>
                  <li>• Email support</li>
                </ul>
              </div>
              
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">Most Popular</span>
                </div>
                <h3 className="text-gray-200 font-semibold mb-2">Pro</h3>
                <p className="text-green-400 font-bold text-2xl mb-2">$2,500/mo</p>
                <p className="text-blue-200/65 text-sm mb-4">500 leases + team dashboard</p>
                <ul className="text-blue-200/65 text-sm space-y-2">
                  <li>• Everything in Starter</li>
                  <li>• Team dashboard</li>
                  <li>• Advanced analytics</li>
                  <li>• Priority support</li>
                  <li>• API access</li>
                </ul>
              </div>
              
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6">
                <h3 className="text-gray-200 font-semibold mb-2">Enterprise</h3>
                <p className="text-green-400 font-bold text-2xl mb-2">$10,000+/mo</p>
                <p className="text-blue-200/65 text-sm mb-4">Custom tools + API access</p>
                <ul className="text-blue-200/65 text-sm space-y-2">
                  <li>• Everything in Pro</li>
                  <li>• Custom integrations</li>
                  <li>• Dedicated support</li>
                  <li>• White-label options</li>
                  <li>• Custom training</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 