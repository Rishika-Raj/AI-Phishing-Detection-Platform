import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { QuickScanSection } from "@/components/sections/QuickScanSection";
import { WhyUsSection } from "@/components/sections/WhyUsSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { WhatWeCheckSection } from "@/components/sections/WhatWeCheckSection";
import { RiskPreviewSection } from "@/components/sections/RiskPreviewSection";
import { SecurityAnalysisSection } from "@/components/sections/SecurityAnalysisSection";
import { SecurityTipsSection } from "@/components/sections/SecurityTipsSection";
import { FinalCtaSection } from "@/components/sections/FinalCtaSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F4F4F4] text-[#101010]">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <QuickScanSection />
        <WhyUsSection />
        <HowItWorksSection />
        <WhatWeCheckSection />
        <RiskPreviewSection />
        <SecurityAnalysisSection />
        <SecurityTipsSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </div>
  );
}
