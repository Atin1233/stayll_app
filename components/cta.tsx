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
                  className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-blue-200),var(--color-gray-50),var(--color-blue-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text pb-4 font-nacelle text-3xl font-semibold text-transparent md:text-4xl"
                  data-aos="fade-up"
                >
                  Get 500 Leases Abstracted in 30 Days
                </h2>
                <p
                  className="mb-8 text-lg text-blue-200/65"
                  data-aos="fade-up"
                  data-aos-delay={200}
                >
                  $25K fixed price. Accuracy guaranteed. 5 pilot spots left in Q1 2026.
                </p>
              </div>

              {/* Right side - Lead form */}
              <div className="flex items-center justify-center">
                <div className="w-full max-w-md" data-aos="fade-up" data-aos-delay={400}>
                  <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
                    <h3 className="text-xl font-semibold text-gray-200 mb-6 text-center">
                      Request a Pilot
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
