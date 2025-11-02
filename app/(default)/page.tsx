export const metadata = {
  title: "Stayll AI - Financial-Grade Contract Data for Commercial Real Estate",
  description: "Auditor-certified lease data extraction with ≥97% accuracy. Eliminate 1-3% lease value leakage. Trusted contract intelligence for REITs, asset managers, and portfolio accountants.",
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
