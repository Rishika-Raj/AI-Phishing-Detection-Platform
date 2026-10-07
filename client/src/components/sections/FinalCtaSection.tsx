import React from "react";
import { ArrowRightIcon } from "@/components/ui/Icons";

export function FinalCtaSection() {
  return (
    <section className="w-full py-24 sm:py-32 bg-[#F4F4F4]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="bg-[#101010] text-[#FFFFFF] rounded-[8px] p-8 sm:p-16 text-center border border-[#101010]">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.08em] text-[#0038FF] block mb-4">
            Defensive Readiness
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6 text-[#FFFFFF]">
            Check Before You <span className="font-serif italic font-normal text-[#0038FF]">Click.</span>
          </h2>

          <p className="text-sm sm:text-base text-[#DBDCDD] max-w-xl mx-auto leading-relaxed mb-10">
            Every phishing campaign relies on a moment of haste. Take three seconds to inspect suspicious destination links, messages, or emails before entering sensitive credentials.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#scanner"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-6 rounded-[4px] bg-[#FFFFFF] text-[#101010] hover:bg-[#0038FF] hover:text-[#FFFFFF] text-xs font-bold uppercase tracking-wider transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0038FF]"
            >
              <span>Scan a URL</span>
              <ArrowRightIcon className="w-4 h-4" />
            </a>
            <a
              href="#scanner"
              className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-6 rounded-[4px] bg-transparent text-[#FFFFFF] border border-[#DBDCDD]/40 hover:bg-[#FFFFFF] hover:text-[#101010] text-xs font-bold uppercase tracking-wider transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0038FF]"
            >
              Analyze an Email
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
