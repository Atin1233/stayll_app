import Image from "next/image";
import BlurredShapeGray from "@/public/images/blurred-shape-gray.svg";
import BlurredShape from "@/public/images/blurred-shape.svg";
import FeaturesImage from "@/public/images/features.png";

export default function Features() {
  return (
    <section id="problem-solution" className="relative">
      <div
        className="pointer-events-none absolute left-1/2 top-0 -z-10 -mt-20 -translate-x-1/2"
        aria-hidden="true"
      >
        <Image
          className="max-w-none"
          src={BlurredShapeGray}
          width={760}
          height={668}
          alt="Blurred shape"
        />
      </div>
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -z-10 -mb-80 -translate-x-[120%] opacity-50"
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
        <div className="border-t py-12 [border-image:linear-gradient(to_right,transparent,--theme(--color-slate-400/.25),transparent)1] md:py-20">
          {/* Section header */}
          <div className="mx-auto max-w-3xl pb-4 text-center md:pb-12">
            <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-linear-to-r before:from-transparent before:to-blue-200/50 after:h-px after:w-8 after:bg-linear-to-l after:from-transparent after:to-blue-200/50">
              <span className="inline-flex bg-linear-to-r from-blue-500 to-blue-200 bg-clip-text text-transparent">
                The Problem
              </span>
            </div>
            <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-blue-200),var(--color-gray-50),var(--color-blue-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text pb-4 font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              Managing leases is broken.
            </h2>
            <p className="text-lg text-blue-200/65">
              Property managers, landlords, and investors are buried in contracts full of risks they don't have time to find.
            </p>
          </div>

          <div className="flex justify-center pb-4 md:pb-12" data-aos="fade-up">
            <Image
              className="max-w-none"
              src={FeaturesImage}
              width={1104}
              height={384}
              alt="Stayll Demo"
            />
          </div>

          {/* Pain Points vs Solutions */}
          <div className="mx-auto grid max-w-sm gap-12 sm:max-w-none sm:grid-cols-2 md:gap-x-14 md:gap-y-16 lg:grid-cols-3">
            {/* Pain Point 1 */}
            <article className="border-l-4 border-red-500/50 pl-6">
              <svg
                className="mb-3 fill-red-500"
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <h3 className="mb-1 font-nacelle text-[1rem] font-semibold text-red-300">
                Missed escalation clauses
              </h3>
              <p className="text-blue-200/65">
                Hidden rent increases and missed revenue opportunities buried in complex lease terms.
              </p>
            </article>

            {/* Solution 1 */}
            <article className="border-l-4 border-green-500/50 pl-6">
              <svg
                className="mb-3 fill-green-500"
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <h3 className="mb-1 font-nacelle text-[1rem] font-semibold text-green-300">
                AI extracts critical terms
              </h3>
              <p className="text-blue-200/65">
                Stayll instantly identifies rent escalations, renewal options, and key financial terms.
              </p>
            </article>

            {/* Pain Point 2 */}
            <article className="border-l-4 border-red-500/50 pl-6">
              <svg
                className="mb-3 fill-red-500"
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <h3 className="mb-1 font-nacelle text-[1rem] font-semibold text-red-300">
                Unexpected tenant terminations
              </h3>
              <p className="text-blue-200/65">
                Hidden termination clauses that can leave you with unexpected vacancies and lost income.
              </p>
            </article>

            {/* Solution 2 */}
            <article className="border-l-4 border-green-500/50 pl-6">
              <svg
                className="mb-3 fill-green-500"
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <h3 className="mb-1 font-nacelle text-[1rem] font-semibold text-green-300">
                Risk flagging system
              </h3>
              <p className="text-blue-200/65">
                AI flags termination clauses, exclusivity agreements, and other hidden risks instantly.
              </p>
            </article>

            {/* Pain Point 3 */}
            <article className="border-l-4 border-red-500/50 pl-6">
              <svg
                className="mb-3 fill-red-500"
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <h3 className="mb-1 font-nacelle text-[1rem] font-semibold text-red-300">
                No system to track it all
              </h3>
              <p className="text-blue-200/65">
                Critical lease information scattered across documents with no centralized tracking system.
              </p>
            </article>

            {/* Solution 3 */}
            <article className="border-l-4 border-green-500/50 pl-6">
              <svg
                className="mb-3 fill-green-500"
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <h3 className="mb-1 font-nacelle text-[1rem] font-semibold text-green-300">
                Centralized intelligence
              </h3>
              <p className="text-blue-200/65">
                All lease insights in one place with tenant risk scoring and actionable summaries.
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
