export const metadata = {
  title: "Stayll AI - The End of Lease Guesswork",
  description: "Audit-Grade Financial Data from CRE Contracts in 30 Days. Extract rent, escalations, and obligations from 500 leases with ≥95% accuracy—clause-linked, reconciled, and ready for your CFO.",
};

import PageIllustration from "@/components/page-illustration";
import Hero from "@/components/hero-home";
import Workflows from "@/components/workflows";
import Features from "@/components/features";
import Differentiation from "@/components/differentiation";
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
      <Differentiation />
      <Pricing />
      <FAQ />
      <Cta />
    </>
  );
}
