import React from "react";
import { WHY_US_FEATURES } from "@/lib/constants";
import { Card } from "@/components/ui/Card";

export function WhyUsSection() {
  return (
    <section id="features" className="w-full py-24 bg-[#FFFFFF] border-t border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Intro */}
        <div className="max-w-3xl mb-16">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.06em] text-[#0038FF] block mb-2">
            Core Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#101010] tracking-tight mb-4">
            Why Use Our Platform
          </h2>
          <p className="text-sm sm:text-base text-[#101010]/75 leading-relaxed">
            Phishing attacks succeed by exploiting haste and deception. NoBait provides a systematic inspection framework to decompose risks into clear, verifiable signals.
          </p>
        </div>

        {/* 4-Column Feature Monograph Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_US_FEATURES.map((feature) => (
            <Card
              key={feature.number}
              variant="surface"
              padding="lg"
              hoverBorder
              className="flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-xs font-bold text-[#0038FF] block mb-4">
                  {feature.number} / ARCHIVE
                </span>
                <h3 className="text-xl font-bold text-[#101010] mb-3">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#101010]/80 leading-relaxed mb-6">
                  {feature.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#101010]/50">
                  Focus
                </span>
                <span className="font-mono text-[11px] font-semibold text-[#101010]">
                  {feature.tag}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
