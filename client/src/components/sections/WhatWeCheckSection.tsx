import React from "react";
import { CHECK_VECTORS } from "@/lib/constants";
import { Card } from "@/components/ui/Card";

export function WhatWeCheckSection() {
  return (
    <section id="checks" className="w-full py-24 bg-[#FFFFFF] border-t border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Intro */}
        <div className="max-w-3xl mb-16">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.06em] text-[#0038FF] block mb-2">
            Inspection Scope
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#101010] tracking-tight mb-4">
            What We Check
          </h2>
          <p className="text-sm sm:text-base text-[#101010]/75 leading-relaxed">
            Our analysis focuses on documented threat vectors across URL syntax, message language, and security reputation indexes.
          </p>
        </div>

        {/* 8-Cell Technical Dossier Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {CHECK_VECTORS.map((vector, idx) => (
            <Card
              key={vector.id}
              variant="white"
              padding="md"
              hoverBorder
              className="flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-[#F4F4F4] pb-2.5">
                  <span className="font-mono text-[10px] uppercase font-bold text-[#101010]/50 tracking-wider">
                    VECTOR 0{idx + 1}
                  </span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#0038FF]" aria-hidden="true" />
                </div>
                <h3 className="text-base font-bold text-[#101010] mb-2 uppercase tracking-wide">
                  {vector.name}
                </h3>
                <p className="text-xs text-[#101010]/75 leading-relaxed mb-6">
                  {vector.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#F4F4F4] flex items-center justify-between text-[11px] font-mono text-[#0038FF]">
                <span>CRITERIA</span>
                <span className="font-semibold text-[#101010]">{vector.marker}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
