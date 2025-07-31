export const metadata = {
  title: "Stayll - The AI Lease Analyst That Never Sleeps",
  description: "Upload any lease. Stayll reads it, flags the risks, and gives you a report your team can actually use.",
};

import PageIllustration from "@/components/page-illustration";
import Hero from "@/components/hero-home";
import Workflows from "@/components/workflows";
import Features from "@/components/features";
import Pricing from "@/components/pricing";
import FAQ from "@/components/faq";
import Cta from "@/components/cta";

export default function Home() {
  return (
    <>
      <PageIllustration />
      <Hero />
      <Workflows />
      <Features />
      <Pricing />
      <FAQ />
      <Cta />
    </>
  );
}
