import React from "react";

export function Footer() {
  return (
    <footer className="w-full bg-[#FFFFFF] border-t border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand & Overview */}
          <div className="md:col-span-1">
            <a href="#hero" className="flex items-center gap-1.5 text-xl font-bold tracking-tight text-[#101010] mb-4">
              <span className="text-[#0038FF] font-black">NoBait</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#0038FF] mb-0.5" aria-hidden="true" />
            </a>
            <p className="text-xs text-[#101010]/70 leading-relaxed mb-6">
              An authoritative phishing detection platform inspecting URLs, email communications, and suspicious messages through rule-based heuristics and threat reputation analysis.
            </p>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#0038FF]" aria-hidden="true" />
              <span className="font-mono text-[11px] font-semibold text-[#101010] tracking-wider uppercase">
                Frontend Demonstration
              </span>
            </div>
          </div>

          {/* Column 2: Product */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.06em] text-[#101010] mb-4">
              Platform
            </h3>
            <ul className="space-y-2.5">
              <li>
                <a href="#hero" className="text-xs text-[#101010]/80 hover:text-[#0038FF] transition-colors">
                  Overview
                </a>
              </li>
              <li>
                <a href="#scanner" className="text-xs text-[#101010]/80 hover:text-[#0038FF] transition-colors">
                  Quick Scan Console
                </a>
              </li>
              <li>
                <a href="#features" className="text-xs text-[#101010]/80 hover:text-[#0038FF] transition-colors">
                  Core Capabilities
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-xs text-[#101010]/80 hover:text-[#0038FF] transition-colors">
                  Detection Pipeline
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Security Vectors */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.06em] text-[#101010] mb-4">
              Inspection
            </h3>
            <ul className="space-y-2.5">
              <li>
                <a href="#checks" className="text-xs text-[#101010]/80 hover:text-[#0038FF] transition-colors">
                  What We Check
                </a>
              </li>
              <li>
                <a href="#architecture" className="text-xs text-[#101010]/80 hover:text-[#0038FF] transition-colors">
                  Detection Layers
                </a>
              </li>
              <li>
                <a href="#tips" className="text-xs text-[#101010]/80 hover:text-[#0038FF] transition-colors">
                  Security Tips
                </a>
              </li>
              <li>
                <a href="#preview" className="text-xs text-[#101010]/80 hover:text-[#0038FF] transition-colors">
                  Report Specimen
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: System Telemetry */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.06em] text-[#101010] mb-4">
              Specifications
            </h3>
            <div className="space-y-3 font-mono text-[11px] text-[#101010]/80">
              <div className="flex justify-between border-b border-[#F4F4F4] pb-1.5">
                <span>Architecture</span>
                <span className="font-semibold text-[#101010]">Monorepo</span>
              </div>
              <div className="flex justify-between border-b border-[#F4F4F4] pb-1.5">
                <span>Detection</span>
                <span className="font-semibold text-[#101010]">Rule-Based</span>
              </div>
              <div className="flex justify-between border-b border-[#F4F4F4] pb-1.5">
                <span>Status</span>
                <span className="text-[#0F766E] font-bold">Client Active</span>
              </div>
              <div className="flex justify-between">
                <span>Security APIs</span>
                <span className="text-[#B45309]">Planned</span>
              </div>
            </div>
          </div>
        </div>

        {/* Colophon & Copyright */}
        <div className="pt-8 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#101010]/60">
          <p>© {new Date().getFullYear()} NoBait Phishing Detection Platform. Editorial security architecture.</p>
          <p className="font-mono text-[11px]">
            Designed for truth, clarity, and defensive threat awareness.
          </p>
        </div>
      </div>
    </footer>
  );
}
