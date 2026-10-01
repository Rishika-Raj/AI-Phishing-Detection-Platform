"use client";

import React from "react";
import { ScanResult, ThreatLevel } from "@/lib/mock-data";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  AlertTriangleIcon,
  CheckIcon,
  RefreshCwIcon,
  AlertCircleIcon,
} from "@/components/ui/Icons";

interface ScanResultCardProps {
  result: ScanResult;
  onReset: () => void;
}

export function ScanResultCard({ result, onReset }: ScanResultCardProps) {
  const badgeVariantMap: Record<ThreatLevel, "safe" | "suspicious" | "critical"> = {
    SAFE: "safe",
    SUSPICIOUS: "suspicious",
    CRITICAL: "critical",
  };

  const scoreColorMap: Record<ThreatLevel, string> = {
    SAFE: "text-[#0F766E]",
    SUSPICIOUS: "text-[#B45309]",
    CRITICAL: "text-[#D92D20]",
  };

  const indicatorBadgeMap = {
    PASS: {
      variant: "safe" as const,
      icon: <CheckIcon className="w-3 h-3 text-[#0F766E]" />,
      label: "PASS",
    },
    WARN: {
      variant: "suspicious" as const,
      icon: <AlertCircleIcon className="w-3 h-3 text-[#B45309]" />,
      label: "WARN",
    },
    FLAGGED: {
      variant: "critical" as const,
      icon: <AlertTriangleIcon className="w-3 h-3 text-[#D92D20]" />,
      label: "FLAGGED",
    },
  };

  return (
    <div
      role="region"
      aria-label="Scan Result Details"
      className="p-6 border-t border-[#E5E7EB] bg-[#FFFFFF] transition-opacity duration-200"
    >
      {/* Result Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E5E7EB] gap-3">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#101010]">
            Scan Report
          </span>
          <span className="font-mono text-[11px] text-[#101010]/50">
            ID: {result.id}
          </span>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onReset}
          icon={<RefreshCwIcon className="w-3.5 h-3.5" />}
        >
          New Scan
        </Button>
      </div>

      {/* Target Specimen Display */}
      <div className="my-4 p-3 bg-[#F4F4F4] border border-[#E5E7EB] rounded-[4px] font-mono text-xs text-[#101010] break-all">
        <span className="text-[#101010]/60 mr-2 uppercase font-semibold text-[10px]">
          Target:
        </span>
        <span>{result.target}</span>
      </div>

      {/* Primary Score & Classification */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 border border-[#E5E7EB] rounded-[4px] bg-[#FFFFFF]">
          <span className="block font-mono text-[10px] uppercase tracking-wider text-[#101010]/60 font-semibold mb-1">
            Calculated Risk
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-4xl font-bold font-mono ${scoreColorMap[result.threatLevel]}`}>
              {result.riskScore}
            </span>
            <span className="text-xs font-mono text-[#101010]/50">/ 100</span>
          </div>
        </div>

        <div className="p-4 border border-[#E5E7EB] rounded-[4px] bg-[#FFFFFF] flex flex-col justify-between">
          <span className="block font-mono text-[10px] uppercase tracking-wider text-[#101010]/60 font-semibold mb-1">
            Threat Classification
          </span>
          <div>
            <Badge variant={badgeVariantMap[result.threatLevel]} size="md">
              {result.threatLevel === "CRITICAL"
                ? "Critical Phishing"
                : result.threatLevel === "SUSPICIOUS"
                ? "Suspicious"
                : "Safe / Low Risk"}
            </Badge>
          </div>
        </div>

        <div className="p-4 border border-[#E5E7EB] rounded-[4px] bg-[#FFFFFF] flex flex-col justify-between">
          <span className="block font-mono text-[10px] uppercase tracking-wider text-[#101010]/60 font-semibold mb-1">
            Analysis Method
          </span>
          <span className="font-mono text-xs text-[#101010]">
            Rule-Based Heuristic Evaluation
          </span>
        </div>
      </div>

      {/* Indicator Breakdown */}
      <div className="mb-6">
        <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#101010] mb-3">
          Evaluated Indicators ({result.indicators.length})
        </h4>
        <div className="divide-y divide-[#E5E7EB] border border-[#E5E7EB] rounded-[4px]">
          {result.indicators.map((ind, i) => {
            const badgeMeta = indicatorBadgeMap[ind.status];
            return (
              <div
                key={i}
                className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#FFFFFF]"
              >
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#101010]">
                    {ind.name}
                  </span>
                  <span className="text-xs text-[#101010]/70 mt-0.5">
                    {ind.details}
                  </span>
                </div>
                <div className="shrink-0 self-start sm:self-center">
                  <Badge variant={badgeMeta.variant} size="sm" icon={badgeMeta.icon}>
                    {badgeMeta.label}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actionable Guidance */}
      <div className="p-4 bg-[#101010] text-[#FFFFFF] rounded-[4px] mb-4">
        <div className="flex items-start gap-2.5">
          <AlertTriangleIcon className="w-4 h-4 text-[#D92D20] shrink-0 mt-0.5" />
          <div>
            <span className="block font-mono text-[10px] uppercase tracking-wider text-[#DBDCDD] font-bold mb-1">
              Action Recommendation
            </span>
            <p className="text-xs leading-relaxed text-[#F4F4F4]">
              {result.recommendation}
            </p>
          </div>
        </div>
      </div>

      {/* Demonstration Notice */}
      <div className="pt-3 border-t border-[#F4F4F4] text-[11px] text-[#101010]/50 font-mono flex items-center justify-between">
        <span>* Frontend demonstration evaluated via deterministic client-side rules.</span>
        <span>NoBait Intelligence V1</span>
      </div>
    </div>
  );
}
