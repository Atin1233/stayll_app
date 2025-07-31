import Image from "next/image";
import BlurredShape from "@/public/images/blurred-shape.svg";
import LeadForm from "@/components/lead-form";

export default function Cta() {
  return (
    <section id="cta" className="relative overflow-hidden">
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
      <div className="max-w6xl mx-auto px-4 sm:px-6">
        <div className="bg-linear-to-r from-transparent via-gray-800/50 py-12 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
              {/* Left side - CTA content */}
              <div className="flex items-center">
                <div className="text-center lg:text-left">
                  <h2
                    className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-blue-200),var(--color-gray-50),var(--color-blue-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text pb-8 font-nacelle text-3xl font-semibold text-transparent md:text-4xl"
                    data-aos="fade-up"
                  >
                    Stop Losing Leads. Start Filling Units Faster.
                  </h2>
                  <p
                    className="mb-8 text-lg text-blue-200/65"
                    data-aos="fade-up"
                    data-aos-delay={200}
                  >
                    Join landlords using AI to close more leases — with zero effort.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <div data-aos="fade-up" data-aos-delay={400}>
                      <a
                        className="btn group bg-linear-to-b from-gray-800 to-gray-800/60 bg-[length:100%_100%] bg-[bottom] text-gray-300 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,var(--color-gray-800),var(--color-gray-700),var(--color-gray-800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] hover:bg-[length:100%_150%]"
                        href="#0"
                      >
                        Schedule Demo
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right side - Lead form */}
              <div className="flex items-center justify-center">
                <div className="w-full max-w-md" data-aos="fade-up" data-aos-delay={400}>
                  <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
                    <h3 className="text-xl font-semibold text-gray-200 mb-6 text-center">
                      Get Early Access
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
