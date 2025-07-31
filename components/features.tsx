import Image from "next/image";
import BlurredShapeGray from "@/public/images/blurred-shape-gray.svg";
import BlurredShape from "@/public/images/blurred-shape.svg";
import FeaturesImage from "@/public/images/features.png";

export default function Features() {
  return (
    <section id="problem-solution">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Problem Statement */}
          <div className="mx-auto max-w-3xl text-center mb-16">
            <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-linear-to-r before:from-transparent before:to-red-200/50 after:h-px after:w-8 after:bg-linear-to-l after:from-transparent after:to-red-200/50">
              <span className="inline-flex bg-linear-to-r from-red-500 to-red-200 bg-clip-text text-transparent">
                The Problem
              </span>
            </div>
            <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-red-200),var(--color-gray-50),var(--color-red-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text pb-4 font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              Managing leases is broken.
            </h2>
            <p className="text-lg text-red-200/65 mb-8">
              Property managers, landlords, and investors are buried in contracts full of risks they don't have time to find.
            </p>
            
            {/* Problem Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-left">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center mr-3">
                    <span className="text-red-400 text-lg">⚠️</span>
                  </div>
                  <h3 className="text-red-300 font-semibold">Missed escalation clauses</h3>
                </div>
                <p className="text-red-200/65">= lost revenue</p>
              </div>
              
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-left">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center mr-3">
                    <span className="text-red-400 text-lg">🏚️</span>
                  </div>
                  <h3 className="text-red-300 font-semibold">Tenant terminations</h3>
                </div>
                <p className="text-red-200/65">= unexpected vacancy</p>
              </div>
              
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-left">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center mr-3">
                    <span className="text-red-400 text-lg">⚖️</span>
                  </div>
                  <h3 className="text-red-300 font-semibold">Compliance gaps</h3>
                </div>
                <p className="text-red-200/65">= legal exposure</p>
              </div>
              
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-left">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center mr-3">
                    <span className="text-red-400 text-lg">📊</span>
                  </div>
                  <h3 className="text-red-300 font-semibold">No system to track it all</h3>
                </div>
                <p className="text-red-200/65">= chaos</p>
              </div>
            </div>
          </div>

          {/* Solution Overview */}
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-linear-to-r before:from-transparent before:to-blue-200/50 after:h-px after:w-8 after:bg-linear-to-l after:from-transparent after:to-blue-200/50">
              <span className="inline-flex bg-linear-to-r from-blue-500 to-blue-200 bg-clip-text text-transparent">
                The Solution
              </span>
            </div>
            <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-blue-200),var(--color-gray-50),var(--color-blue-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text pb-4 font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              Stayll is an AI-powered lease and tenant intelligence platform.
            </h2>
            <p className="text-lg text-blue-200/65 mb-8">
              We instantly read and understand your lease docs to extract critical terms, flag hidden risks, and score tenant risk.
            </p>
            
            {/* Solution Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-400 text-xl">📋</span>
                </div>
                <h3 className="text-blue-300 font-semibold mb-2">Extract Critical Terms</h3>
                <p className="text-blue-200/65 text-sm">Rent, term, escalations, renewal</p>
              </div>
              
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-400 text-xl">🚨</span>
                </div>
                <h3 className="text-blue-300 font-semibold mb-2">Flag Hidden Risks</h3>
                <p className="text-blue-200/65 text-sm">Termination clauses, exclusivity, rights to purchase</p>
              </div>
              
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-400 text-xl">📊</span>
                </div>
                <h3 className="text-blue-300 font-semibold mb-2">Score Tenant Risk</h3>
                <p className="text-blue-200/65 text-sm">Based on credit, rent history, and market trends</p>
              </div>
              
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-400 text-xl">📝</span>
                </div>
                <h3 className="text-blue-300 font-semibold mb-2">Plain English Summary</h3>
                <p className="text-blue-200/65 text-sm">Everything in under 2 minutes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
