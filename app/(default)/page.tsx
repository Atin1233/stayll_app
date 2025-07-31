export const metadata = {
  title: "Stayll - Never Miss a Renter Again. Let AI Reply for You.",
  description: "Stayll auto-replies to Zillow, Apartments.com, and Facebook leads instantly — so you close more tenants without lifting a finger.",
};

import PageIllustration from "@/components/page-illustration";
import Hero from "@/components/hero-home";
import Workflows from "@/components/workflows";
import Features from "@/components/features";
import Pricing from "@/components/pricing";
import Testimonials from "@/components/testimonials";
import Cta from "@/components/cta";

export default function Home() {
  return (
    <>
      <PageIllustration />
      <Hero />
      <Workflows />
      <Features />
      <Pricing />
      <Testimonials />
      <Cta />
    </>
  );
}
