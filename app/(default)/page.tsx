export const metadata = {
  title: "Stayll AI - AI-Assisted Lease Abstraction for CRE Portfolios",
  description: "Get 500 leases abstracted in 30 days for $25K. Fixed price, guaranteed delivery. CSV rent roll + audit log included. Accuracy guaranteed.",
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
