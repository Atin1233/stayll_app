export const metadata = {
  title: "STAYLL - The Bloomberg Terminal for Leases | AI-Powered Lease Intelligence for REITs",
  description: "AI-powered lease intelligence for institutional multifamily REITs. Recover hidden revenue, automate compliance, and optimize your portfolio with predictive insights.",
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
