"use client";

import React from "react";
import { HistoryItem } from "@/lib/mock-history";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TrashIcon, RefreshCwIcon, ArrowRightIcon, ShieldIcon } from "@/components/ui/Icons";

interface ScanHistoryProps {
  history: HistoryItem[];
  onClearHistory: () => void;
  onRestoreHistory: () => void;
  onSelectScan?: (item: HistoryItem) => void;
}

export function ScanHistory({
  history,
  onClearHistory,
  onRestoreHistory,
  onSelectScan,
}: ScanHistoryProps) {
  const badgeMap = {
    SAFE: "safe" as const,
    SUSPICIOUS: "suspicious" as const,
    CRITICAL: "critical" as const,
  };

  const scoreColorMap = {
    SAFE: "text-[#0F766E]",
    SUSPICIOUS: "text-[#B45309]",
    CRITICAL: "text-[#D92D20]",
  };

  return (
    <div id="history" className="mb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-[0.06em] text-[#0038FF] block mb-1">
            Audit Archive
          </span>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-bold text-[#101010] tracking-tight">
              Recent Scan History
            </h2>
            <span className="font-mono text-xs text-[#101010]/50 font-semibold">
              ({history.length})
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {history.length > 0 ? (
            <button
              onClick={onClearHistory}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold text-[#101010]/70 hover:text-[#D92D20] border border-[#E5E7EB] hover:border-[#FECACA] bg-[#FFFFFF] rounded-[4px] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D92D20]"
            >
              <TrashIcon className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          ) : (
            <button
              onClick={onRestoreHistory}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold text-[#0038FF] border border-[#C7D2FE] bg-[#FFFFFF] rounded-[4px] transition-colors hover:bg-[#EEF2FF] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0038FF]"
            >
              <RefreshCwIcon className="w-3.5 h-3.5" />
              <span>Restore Demo Data</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Table / Card Container */}
      <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[8px] overflow-hidden">
        {history.length === 0 ? (
          /* Empty State */
          <div className="p-12 text-center flex flex-col items-center justify-center bg-[#FAFAFA]">
            <span className="p-3 bg-[#F4F4F4] border border-[#E5E7EB] rounded-full text-[#101010]/40 mb-3" aria-hidden="true">
              <ShieldIcon className="w-6 h-6" />
            </span>
            <h3 className="font-mono text-sm font-bold text-[#101010] uppercase tracking-wider mb-2">
              No Scans Yet
            </h3>
            <p className="text-xs text-[#101010]/60 max-w-sm mb-6 leading-relaxed">
              Your analyzed URLs will appear here in the active session history once inspected.
            </p>
            <div className="flex gap-3">
              <Button
                variant="primary"
                size="sm"
                href="#scanner"
                icon={<ArrowRightIcon className="w-3.5 h-3.5" />}
              >
                Scan a URL
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={onRestoreHistory}
                icon={<RefreshCwIcon className="w-3.5 h-3.5" />}
              >
                Load Sample Data
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop / Tablet Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F4F4F4]/60 font-mono text-[11px] text-[#101010]/60 uppercase tracking-wider">
                    <th scope="col" className="py-3 px-5 font-semibold">Target Destination</th>
                    <th scope="col" className="py-3 px-5 font-semibold">Risk Score</th>
                    <th scope="col" className="py-3 px-5 font-semibold">Threat Level</th>
                    <th scope="col" className="py-3 px-5 font-semibold">Type</th>
                    <th scope="col" className="py-3 px-5 font-semibold">Analyzed</th>
                    <th scope="col" className="py-3 px-5 font-semibold text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] text-xs">
                  {history.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-[#F9FAFB] transition-colors"
                    >
                      <td className="py-3.5 px-5 font-mono text-xs text-[#101010] max-w-xs truncate">
                        <span className="text-[#101010] font-medium" title={item.target}>
                          {item.target}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 font-mono font-bold">
                        <span className={scoreColorMap[item.threatLevel]}>
                          {item.riskScore}
                        </span>
                        <span className="text-[#101010]/40 font-normal text-[11px]"> / 100</span>
                      </td>
                      <td className="py-3.5 px-5">
                        <Badge variant={badgeMap[item.threatLevel]} size="sm">
                          {item.threatLevel}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-5 font-mono text-[11px] text-[#101010]/70 uppercase">
                        {item.targetType}
                      </td>
                      <td className="py-3.5 px-5 font-mono text-[11px] text-[#101010]/60 whitespace-nowrap">
                        {item.formattedDate}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        {onSelectScan && (
                          <button
                            onClick={() => onSelectScan(item)}
                            className="font-mono text-[11px] font-semibold text-[#0038FF] hover:underline"
                          >
                            Inspect →
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card Representation (Zero Horizontal Overflow) */}
            <div className="md:hidden divide-y divide-[#E5E7EB]">
              {history.map((item) => (
                <div key={item.id} className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant={badgeMap[item.threatLevel]} size="sm">
                      {item.threatLevel}
                    </Badge>
                    <span className="font-mono text-[10px] text-[#101010]/50 uppercase">
                      {item.formattedDate}
                    </span>
                  </div>

                  <div className="font-mono text-xs text-[#101010] break-all">
                    {item.target}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#F4F4F4]">
                    <div className="font-mono text-xs">
                      <span className="text-[#101010]/60 text-[10px] uppercase font-bold mr-1">
                        Risk:
                      </span>
                      <span className={`font-bold ${scoreColorMap[item.threatLevel]}`}>
                        {item.riskScore}
                      </span>
                      <span className="text-[#101010]/40 text-[10px]"> / 100</span>
                    </div>

                    {onSelectScan && (
                      <button
                        onClick={() => onSelectScan(item)}
                        className="font-mono text-xs font-semibold text-[#0038FF] hover:underline"
                      >
                        Inspect Result →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
