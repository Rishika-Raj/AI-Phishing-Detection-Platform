import React from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ArrowRightIcon, AlertTriangleIcon, ShieldIcon } from "@/components/ui/Icons";

export function HeroSection() {
  return (
    <section id="hero" className="w-full pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Statement */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Top Identity Tag */}
            <div className="mb-6">
              <Badge variant="primary" size="md">
                Phishing Detection Platform
              </Badge>
            </div>

            {/* Display Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-bold text-[#101010] leading-[1.08] tracking-tight mb-6">
              Stay One Step{" "}
              <span className="font-serif italic font-normal text-[#0038FF]">Ahead</span> of Phishing Attacks.
            </h1>

            {/* Narrative Explanation */}
            <p className="text-base sm:text-lg text-[#101010]/80 leading-relaxed max-w-2xl mb-8 font-normal">
              Inspect suspicious URLs, email communications, and messages before taking the bait. NoBait analyzes structural parameters, deceptive keyword patterns, and reputation signals to deliver clear, instant threat intelligence.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
              <Button
                href="#scanner"
                variant="primary"
                size="lg"
                icon={<ArrowRightIcon className="w-4 h-4" />}
              >
                Scan a URL
              </Button>
              <Button
                href="#scanner"
                variant="secondary"
                size="lg"
              >
                Analyze an Email
              </Button>
            </div>

            {/* Context Note */}
            <div className="mt-8 flex items-center gap-2 text-xs text-[#101010]/60">
              <ShieldIcon className="w-4 h-4 text-[#0038FF]" />
              <span>Rule-based detection &amp; reputation inspection. No account required to test.</span>
            </div>
          </div>

          {/* Right Column: Forensic Threat Specimen Card */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[8px] p-6 sm:p-7 transition-colors">
              {/* Card Meta Header */}
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3 mb-4">
                <span className="font-mono text-[11px] font-bold tracking-widest text-[#101010] uppercase">
                  Threat Specimen / 001
                </span>
                <span className="font-mono text-[10px] text-[#101010]/50 uppercase tracking-wider">
                  [Illustrative Sample]
                </span>
              </div>

              {/* Target Specimen */}
              <div className="bg-[#F4F4F4] border border-[#E5E7EB] rounded-[4px] p-3 mb-5 font-mono text-xs text-[#101010] break-all">
                <span className="text-[#D92D20] font-bold">hxxp://</span>
                <span>paypal-verify[.]net/auth/resolve?id=urgent</span>
              </div>

              {/* Indicator Matrix */}
              <div className="space-y-2.5 mb-6 text-xs font-mono">
                <div className="flex items-center justify-between border-b border-[#F4F4F4] pb-2">
                  <span className="text-[#101010]/70">HTTPS USAGE</span>
                  <span className="text-[#D92D20] font-bold">MISSING (HTTP)</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#F4F4F4] pb-2">
                  <span className="text-[#101010]/70">DOMAIN STRUCTURE</span>
                  <span className="text-[#D92D20] font-bold">DECEPTIVE TYPO</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#F4F4F4] pb-2">
                  <span className="text-[#101010]/70">SUSPICIOUS KEYWORDS</span>
                  <span className="text-[#D92D20] font-bold">VERIFY, URGENT</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#F4F4F4] pb-2">
                  <span className="text-[#101010]/70">URL REPUTATION</span>
                  <span className="text-[#B45309] font-bold">UNTRUSTED HOST</span>
                </div>
              </div>

              {/* Risk Score Summary */}
              <div className="flex items-center justify-between bg-[#FEF2F2] border border-[#FECACA] rounded-[4px] p-3.5 mb-4">
                <div>
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-[#D92D20] font-bold">
                    Risk Assessment
                  </span>
                  <span className="text-2xl font-bold text-[#D92D20]">
                    88 <span className="text-xs font-normal text-[#D92D20]/70">/ 100</span>
                  </span>
                </div>
                <Badge variant="critical" size="sm">
                  Critical Phishing
                </Badge>
              </div>

              {/* Action Directive */}
              <div className="flex items-start gap-2 bg-[#101010] text-[#FFFFFF] rounded-[4px] p-3 text-[11px] leading-relaxed">
                <AlertTriangleIcon className="w-4 h-4 text-[#D92D20] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">RECOMMENDATION:</strong> Do not navigate to this destination or enter sensitive credentials.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
