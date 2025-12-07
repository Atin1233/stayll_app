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
              You're Losing 1–3% of Your Portfolio Value to Contract Errors
            </h2>
            <p className="text-lg text-blue-200/65">
              Missed renewals. Botched CPI math. Unpaid escalations. Offshore abstractors charge $200/lease, take 90 days, and guarantee nothing. Their "accuracy" is a prayer. Your auditors won't sign off.
            </p>
          </div>

          <div className="flex justify-center pb-8 md:pb-12" data-aos="fade-up">
            <Image
              className="max-w-none"
              src={FeaturesImage}
              width={1104}
              height={384}
              alt="Stayll Demo"
            />
          </div>

          {/* The Status Quo Is Broken */}
          <div className="mx-auto max-w-4xl">
            <h3 className="text-2xl font-semibold text-gray-200 mb-6 text-center">
              The Status Quo Is Broken
            </h3>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
              <article className="border-l-4 border-red-500/50 pl-6">
                <h4 className="mb-1 font-semibold text-red-300">60 days</h4>
                <p className="text-sm text-blue-200/65">to get lease data back</p>
              </article>
              <article className="border-l-4 border-red-500/50 pl-6">
                <h4 className="mb-1 font-semibold text-red-300">Zero audit trail</h4>
                <p className="text-sm text-blue-200/65">to prove it's right</p>
              </article>
              <article className="border-l-4 border-red-500/50 pl-6">
                <h4 className="mb-1 font-semibold text-red-300">No financial validation</h4>
                <p className="text-sm text-blue-200/65">rent schedules don't add up</p>
              </article>
              <article className="border-l-4 border-red-500/50 pl-6">
                <h4 className="mb-1 font-semibold text-red-300">Weeks of cleanup</h4>
                <p className="text-sm text-blue-200/65">your CFO still spends weeks cleaning spreadsheets</p>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
