import React from "react";
import { PROCESS_STEPS } from "@/lib/constants";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="w-full py-24 bg-[#F4F4F4]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.06em] text-[#0038FF] block mb-2">
            Detection Pipeline
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#101010] tracking-tight mb-4">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-[#101010]/75 leading-relaxed">
            From raw input ingestion to calibrated risk scoring, every target passes through a transparent 4-stage evaluation flow.
          </p>
        </div>

        {/* Desktop Process Timeline */}
        <div className="hidden lg:grid grid-cols-4 gap-8 relative">
          {/* Continuous Connecting Rule */}
          <div
            className="absolute top-6 left-6 right-6 h-[1px] bg-[#DBDCDD] -z-0"
            aria-hidden="true"
          />

          {PROCESS_STEPS.map((step) => (
            <div key={step.step} className="relative z-10 flex flex-col items-start">
              {/* Step Marker Box */}
              <div className="w-12 h-12 rounded-[4px] bg-[#FFFFFF] border border-[#101010] flex items-center justify-center font-mono font-bold text-sm text-[#101010] mb-6">
                {step.step}
              </div>

              {/* Step Content */}
              <h3 className="text-xl font-bold text-[#101010] uppercase tracking-wide mb-3">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#101010]/80 leading-relaxed mb-4">
                {step.description}
              </p>

              <span className="font-mono text-[11px] font-semibold text-[#0038FF] mt-auto">
                [{step.focus}]
              </span>
            </div>
          ))}
        </div>

        {/* Mobile / Tablet Process Timeline */}
        <div className="lg:hidden flex flex-col gap-8 relative pl-6 border-l border-[#DBDCDD]">
          {PROCESS_STEPS.map((step) => (
            <div key={step.step} className="relative flex flex-col items-start">
              {/* Indicator Dot */}
              <div
                className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-[#FFFFFF] border-2 border-[#101010]"
                aria-hidden="true"
              />

              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-xs font-bold text-[#0038FF]">
                  STAGE {step.step}
                </span>
                <span className="font-mono text-[10px] text-[#101010]/50 uppercase">
                  — {step.focus}
                </span>
              </div>

              <h3 className="text-lg font-bold text-[#101010] uppercase tracking-wide mb-2">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#101010]/80 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
