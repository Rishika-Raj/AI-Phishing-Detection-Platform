import React from "react";
import { Badge } from "@/components/ui/Badge";
import { AlertTriangleIcon, AlertCircleIcon } from "@/components/ui/Icons";

export function RiskPreviewSection() {
  return (
    <section id="preview" className="w-full py-24 bg-[#F4F4F4]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Intro */}
        <div className="max-w-3xl mb-16">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.06em] text-[#0038FF] block mb-2">
            Output Preview
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#101010] tracking-tight mb-4">
            Risk Analysis Preview
          </h2>
          <p className="text-sm sm:text-base text-[#101010]/75 leading-relaxed">
            Every scan produces an unvarnished forensic report detailing each evaluated signal, risk weightings, and explicit procedural guidance.
          </p>
        </div>

        {/* Forensic Report Specimen Box */}
        <div className="max-w-5xl mx-auto bg-[#FFFFFF] border border-[#E5E7EB] rounded-[8px] overflow-hidden">
          {/* Top Dossier Bar */}
          <div className="px-6 py-4 border-b border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#F4F4F4]/50">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#101010]">
                Specimen Report
              </span>
              <span className="font-mono text-[11px] text-[#101010]/50">
                #NB-REF-90218
              </span>
            </div>
            <span className="font-mono text-[11px] text-[#0038FF] uppercase tracking-wider font-semibold">
              [Illustrative Demonstration]
            </span>
          </div>

          {/* Target Specimen Callout */}
          <div className="p-6 border-b border-[#E5E7EB] bg-[#FFFFFF]">
            <span className="block font-mono text-[10px] uppercase font-bold tracking-wider text-[#101010]/50 mb-1.5">
              Inspected Target Address
            </span>
            <div className="p-3 bg-[#F4F4F4] border border-[#E5E7EB] rounded-[4px] font-mono text-xs text-[#101010] break-all">
              hxxp://auth-security-update[.]live/verify-account?token=exp8921
            </div>
          </div>

          {/* Main Two-Column Report Specimen */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#E5E7EB]">
            {/* Left Panel: Score & Calibration Meter */}
            <div className="lg:col-span-4 p-6 sm:p-8 flex flex-col justify-between bg-[#FFFFFF]">
              <div>
                <span className="block font-mono text-xs uppercase font-bold tracking-wider text-[#101010]/60 mb-2">
                  Consolidated Risk
                </span>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-mono font-bold text-[#D92D20]">
                    88
                  </span>
                  <span className="text-sm font-mono text-[#101010]/50">/ 100</span>
                </div>

                <div className="mb-6">
                  <Badge variant="critical" size="md">
                    Critical Phishing
                  </Badge>
                </div>

                {/* Minimalist Calibration Meter */}
                <div className="space-y-1.5 mb-8">
                  <div className="flex justify-between font-mono text-[10px] text-[#101010]/50 uppercase">
                    <span>Safe (0)</span>
                    <span>Suspicious (50)</span>
                    <span>Critical (100)</span>
                  </div>
                  <div className="w-full h-2 bg-[#E5E7EB] rounded-full overflow-hidden flex">
                    <div className="w-[88%] bg-[#D92D20] h-full" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#F4F4F4] font-mono text-[11px] text-[#101010]/70">
                Evaluation: 4 of 4 primary detection rules flagged anomalous signals.
              </div>
            </div>

            {/* Right Panel: Indicator Breakdown & Action Plan */}
            <div className="lg:col-span-8 p-6 sm:p-8 bg-[#FFFFFF]">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#101010] mb-4">
                Detailed Diagnostic Findings
              </h3>

              <div className="divide-y divide-[#F4F4F4] border border-[#E5E7EB] rounded-[4px] mb-6">
                <div className="p-3.5 flex items-start justify-between gap-4">
                  <div>
                    <span className="block text-xs font-bold text-[#101010]">
                      HTTPS Transmission
                    </span>
                    <span className="text-xs text-[#101010]/70">
                      Unencrypted HTTP connection detected. Login credentials transmitted in plaintext.
                    </span>
                  </div>
                  <Badge variant="critical" size="sm" icon={<AlertTriangleIcon className="w-3 h-3 text-[#D92D20]" />}>
                    FLAGGED
                  </Badge>
                </div>

                <div className="p-3.5 flex items-start justify-between gap-4">
                  <div>
                    <span className="block text-xs font-bold text-[#101010]">
                      Deceptive Keywords
                    </span>
                    <span className="text-xs text-[#101010]/70">
                      Sensitive path tokens identified: &quot;auth&quot;, &quot;security&quot;, &quot;update&quot;, &quot;verify&quot;.
                    </span>
                  </div>
                  <Badge variant="critical" size="sm" icon={<AlertTriangleIcon className="w-3 h-3 text-[#D92D20]" />}>
                    FLAGGED
                  </Badge>
                </div>

                <div className="p-3.5 flex items-start justify-between gap-4">
                  <div>
                    <span className="block text-xs font-bold text-[#101010]">
                      Domain Structure
                    </span>
                    <span className="text-xs text-[#101010]/70">
                      High-risk generic TLD (.live) with multiple hyphenated authentication keywords.
                    </span>
                  </div>
                  <Badge variant="critical" size="sm" icon={<AlertTriangleIcon className="w-3 h-3 text-[#D92D20]" />}>
                    FLAGGED
                  </Badge>
                </div>

                <div className="p-3.5 flex items-start justify-between gap-4">
                  <div>
                    <span className="block text-xs font-bold text-[#101010]">
                      URL Reputation
                    </span>
                    <span className="text-xs text-[#101010]/70">
                      Hostname matches recognized pattern signatures in known threat indices.
                    </span>
                  </div>
                  <Badge variant="suspicious" size="sm" icon={<AlertCircleIcon className="w-3 h-3 text-[#B45309]" />}>
                    SUSPICIOUS
                  </Badge>
                </div>
              </div>

              {/* Action Directive Box */}
              <div className="p-4 bg-[#101010] text-[#FFFFFF] rounded-[4px]">
                <div className="flex items-start gap-3">
                  <AlertTriangleIcon className="w-4 h-4 text-[#D92D20] shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-mono text-[10px] uppercase font-bold tracking-wider text-[#DBDCDD] mb-1">
                      Action Recommendation
                    </span>
                    <p className="text-xs text-[#F4F4F4] leading-relaxed">
                      Do not enter credentials or continue to this destination. The structure demonstrates deceptive brand impersonation intended to harvest account credentials.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
