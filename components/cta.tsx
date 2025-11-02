import LeadForm from "./lead-form";

export default function Cta() {
  return (
    <section id="cta" className="relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-900/20 pointer-events-none" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
              {/* Left side - Content */}
              <div className="text-center lg:text-left">
                <h2
                  className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-blue-200),var(--color-gray-50),var(--color-blue-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text pb-8 font-nacelle text-3xl font-semibold text-transparent md:text-4xl"
                  data-aos="fade-up"
                >
                  Financial-Grade Contract Data for Your Portfolio
                </h2>
                <p
                  className="mb-8 text-lg text-blue-200/65"
                  data-aos="fade-up"
                  data-aos-delay={200}
                >
                  Join pilot program for CRE portfolios. Get auditor-verified lease data extraction, eliminate 1-3% value leakage, and secure your financial source of truth.
                </p>
                
                <div className="space-y-4 mb-8" data-aos="fade-up" data-aos-delay={400}>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                      <span className="text-green-400 text-sm">✓</span>
                    </div>
                    <span className="text-gray-200">Auditor-certified ≥97% accuracy guarantee</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                      <span className="text-green-400 text-sm">✓</span>
                    </div>
                    <span className="text-gray-200">3× ROI guarantee or full refund</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                      <span className="text-green-400 text-sm">✓</span>
                    </div>
                    <span className="text-gray-200">API-ready for Yardi, MRI, NetSuite integration</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <div data-aos="fade-up" data-aos-delay={600}>
                    <a
                      className="btn group bg-linear-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%]"
                      href="#0"
                    >
                      <span className="relative inline-flex items-center">
                        Start Pilot Program
                        <span className="ml-1 tracking-normal text-white/50 transition-transform group-hover:translate-x-0.5">
                          -&gt;
                        </span>
                      </span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Right side - Lead form */}
              <div className="flex items-center justify-center">
                <div className="w-full max-w-md" data-aos="fade-up" data-aos-delay={400}>
                  <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
                    <h3 className="text-xl font-semibold text-gray-200 mb-6 text-center">
                      Request Pilot Program
                    </h3>
                    <LeadForm />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
