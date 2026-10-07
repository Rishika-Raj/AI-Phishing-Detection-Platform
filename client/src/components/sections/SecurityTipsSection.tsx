import React from "react";
import { SECURITY_TIPS } from "@/lib/constants";
import { Card } from "@/components/ui/Card";

export function SecurityTipsSection() {
  return (
    <section id="tips" className="w-full py-24 bg-[#F4F4F4]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.06em] text-[#0038FF] block mb-2">
            Defensive Field Guide
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#101010] tracking-tight mb-4">
            Cybersecurity Safety Tips
          </h2>
          <p className="text-sm sm:text-base text-[#101010]/75 leading-relaxed">
            Essential operational habits to protect accounts, systems, and communications against social engineering techniques.
          </p>
        </div>

        {/* 3-Column Editorial Field Guide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SECURITY_TIPS.map((tip) => (
            <Card
              key={tip.number}
              variant="white"
              padding="lg"
              hoverBorder
              className="flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-xs font-bold text-[#0038FF] block mb-4">
                  FIELD NOTE 0{tip.number}
                </span>

                <h3 className="text-xl font-bold text-[#101010] mb-1">
                  {tip.title}
                </h3>

                <span className="block font-mono text-xs text-[#101010]/50 uppercase tracking-wider mb-4">
                  {tip.subtitle}
                </span>

                <p className="text-xs sm:text-sm text-[#101010]/80 leading-relaxed mb-6">
                  {tip.body}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E5E7EB] font-mono text-xs text-[#101010] font-semibold bg-[#F4F4F4]/70 p-3 rounded-[4px]">
                {tip.rule}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
