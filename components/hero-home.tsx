export default function HeroHome() {
  return (
    <section id="hero">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Hero content */}
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="pb-12 text-center md:pb-20">
            <h1
              className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-blue-200),var(--color-gray-50),var(--color-blue-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text pb-5 font-nacelle text-4xl font-semibold text-transparent md:text-5xl"
              data-aos="fade-up"
            >
              The Only Financial-Grade Contract Data Layer for CRE
            </h1>
            <div className="mx-auto max-w-3xl">
              <p
                className="mb-4 text-xl text-blue-200/65"
                data-aos="fade-up"
                data-aos-delay={200}
              >
                Eliminate leakage. Automate renewals. Get auditor-certified lease data in minutes.
              </p>
              <p className="mb-8 text-sm text-blue-200/50 italic" data-aos="fade-up" data-aos-delay={300}>
                If you have 1,000+ leases, missing 1–2% of value is usually hundreds of thousands per year. Stayll costs a fraction of that.
              </p>
              <div className="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center gap-4">
                <div data-aos="fade-up" data-aos-delay={400}>
                  <a
                    className="btn group w-full bg-linear-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%] sm:w-auto"
                    href="#cta"
                  >
                    <span className="relative inline-flex items-center">
                      Request a Pilot – See Verified Data in 30 Days
                      <span className="ml-1 tracking-normal text-white/50 transition-transform group-hover:translate-x-0.5">
                        -&gt;
                      </span>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
