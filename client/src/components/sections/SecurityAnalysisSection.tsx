import React from "react";
import { SECURITY_LAYERS } from "@/lib/constants";

export function SecurityAnalysisSection() {
  return (
    <section id="architecture" className="w-full py-24 bg-[#FFFFFF] border-t border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Editorial Statement */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.06em] text-[#0038FF] block mb-2">
              Engineering Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#101010] tracking-tight leading-[1.15] mb-6">
              Practical, <span className="font-serif italic font-normal text-[#0038FF]">verifiable</span> security analysis.
            </h2>
            <p className="text-sm sm:text-base text-[#101010]/80 leading-relaxed mb-8">
              Rather than relying on opaque black-box systems, NoBait combines deterministic structural rules, lexical heuristics, reputation indexing, and planned security API telemetry into clear threat scores.
            </p>

            <div className="p-5 bg-[#F4F4F4] border border-[#E5E7EB] rounded-[4px]">
              <span className="font-mono text-[10px] uppercase font-bold text-[#101010]/60 block mb-1">
                Design Principle
              </span>
              <p className="text-xs text-[#101010] leading-relaxed">
                Every risk score is auditable back to specific structural or lexical indicators that tripped the heuristic threshold.
              </p>
            </div>
          </div>

          {/* Right Column: 4 Technical Layers */}
          <div className="lg:col-span-7 divide-y divide-[#E5E7EB] border-t lg:border-t-0 border-b border-[#E5E7EB]">
            {SECURITY_LAYERS.map((layer) => (
              <div key={layer.number} className="py-6 sm:py-8 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-xs font-bold text-[#0038FF]">
                    LAYER {layer.number}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-[#101010]">
                    {layer.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-[#101010]/75 leading-relaxed mb-4">
                  {layer.summary}
                </p>

                <ul className="space-y-1.5 font-mono text-xs text-[#101010]/80">
                  {layer.points.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#0038FF] font-bold">—</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
