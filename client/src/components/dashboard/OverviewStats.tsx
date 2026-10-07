import React from "react";
import { SearchIcon, ShieldIcon, AlertTriangleIcon } from "@/components/ui/Icons";

interface OverviewStatsProps {
  totalScans: number;
  safeScans: number;
  suspiciousScans: number;
}

export function OverviewStats({
  totalScans,
  safeScans,
  suspiciousScans,
}: OverviewStatsProps) {
  return (
    <div id="overview" className="mb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-[0.06em] text-[#0038FF] block mb-1">
            Security Overview
          </span>
          <h2 className="text-2xl font-bold text-[#101010] tracking-tight">
            Threat Analysis Metrics
          </h2>
        </div>
        <span className="font-mono text-[10px] text-[#101010]/50 uppercase tracking-wider bg-[#FFFFFF] border border-[#E5E7EB] px-2.5 py-1 rounded-[3px] self-start sm:self-auto">
          Demo Session Telemetry
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Scans Card */}
        <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[8px] p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#101010]/70">
              Total Analyzed
            </span>
            <span className="p-1.5 bg-[#F4F4F4] rounded-[4px] text-[#101010]" aria-hidden="true">
              <SearchIcon className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-mono font-bold text-[#101010]">
              {totalScans}
            </span>
            <span className="font-mono text-xs text-[#101010]/50 uppercase">
              Targets
            </span>
          </div>
          <span className="font-mono text-[11px] text-[#101010]/60 mt-3 pt-3 border-t border-[#F4F4F4]">
            Session audit records
          </span>
        </div>

        {/* Safe Results Card */}
        <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[8px] p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#0F766E]">
              Safe / Verified
            </span>
            <span className="p-1.5 bg-[#F0FDF4] rounded-[4px] text-[#0F766E]" aria-hidden="true">
              <ShieldIcon className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-mono font-bold text-[#0F766E]">
              {safeScans}
            </span>
            <span className="font-mono text-xs text-[#0F766E]/70 uppercase">
              Targets
            </span>
          </div>
          <span className="font-mono text-[11px] text-[#0F766E]/80 mt-3 pt-3 border-t border-[#F0FDF4]">
            Risk score &lt; 25/100
          </span>
        </div>

        {/* Suspicious / Critical Card */}
        <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[8px] p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#D92D20]">
              Suspicious / Phishing
            </span>
            <span className="p-1.5 bg-[#FEF2F2] rounded-[4px] text-[#D92D20]" aria-hidden="true">
              <AlertTriangleIcon className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-mono font-bold text-[#D92D20]">
              {suspiciousScans}
            </span>
            <span className="font-mono text-xs text-[#D92D20]/70 uppercase">
              Targets
            </span>
          </div>
          <span className="font-mono text-[11px] text-[#D92D20]/80 mt-3 pt-3 border-t border-[#FEF2F2]">
            Risk score &ge; 25/100
          </span>
        </div>
      </div>
    </div>
  );
}
