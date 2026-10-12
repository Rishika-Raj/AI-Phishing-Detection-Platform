"use client";

import React from "react";
import { ScanResult, ThreatLevel } from "@/lib/mock-data";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  CloseIcon,
  AlertTriangleIcon,
  AlertCircleIcon,
  CheckIcon,
  DownloadIcon,
  ShieldIcon,
} from "@/components/ui/Icons";

interface ReportDetailModalProps {
  item: ScanResult | null;
  onClose: () => void;
}

export function ReportDetailModal({ item, onClose }: ReportDetailModalProps) {
  if (!item) return null;

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

  const handleDownloadJson = () => {
    const filename = `nobait-report-${item.id.toLowerCase()}.json`;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(item, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  const keywords = item.detectedKeywords || [];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#101010]/60 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] bg-[#FFFFFF] border border-[#E5E7EB] rounded-[8px] shadow-2xl overflow-y-auto flex flex-col text-[#101010]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-[#FFFFFF] px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 bg-[#0038FF]/10 text-[#0038FF] rounded-[4px]" aria-hidden="true">
              <ShieldIcon className="w-4 h-4" />
            </span>
            <div>
              <h3 id="report-modal-title" className="text-base font-bold text-[#101010] tracking-tight">
                Forensic Phishing Assessment
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-[11px] text-[#101010]/60">
                  ID: {item.id}
                </span>
                <span className="text-[#E5E7EB]">•</span>
                <span className="font-mono text-[11px] text-[#101010]/60 uppercase">
                  {item.targetType}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close report inspection modal"
            className="p-1.5 text-[#101010]/50 hover:text-[#101010] hover:bg-[#F4F4F4] rounded-[4px] transition-colors"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Target Specimen Box */}
          <div className="p-4 bg-[#F4F4F4] border border-[#E5E7EB] rounded-[6px]">
            <span className="block font-mono text-[10px] uppercase tracking-wider text-[#101010]/60 font-bold mb-1">
              Target Specimen {item.targetType === "email" && item.subject ? "· Subject & Content" : ""}
            </span>
            {item.subject && (
              <div className="text-xs font-bold text-[#101010] font-mono mb-2">
                Subject: {item.subject}
              </div>
            )}
            <div className="font-mono text-xs text-[#101010] whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto bg-[#FFFFFF] p-3 rounded-[4px] border border-[#E5E7EB]">
              {item.fullContent || item.target}
            </div>
          </div>

          {/* Metric Quad */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-[#FFFFFF] border border-[#E5E7EB] rounded-[4px]">
              <span className="block font-mono text-[10px] uppercase tracking-wider text-[#101010]/60 font-semibold mb-1">
                Calculated Risk Score
              </span>
              <div className="flex items-baseline gap-1">
                <span className={`text-3xl font-bold font-mono ${scoreColorMap[item.threatLevel]}`}>
                  {item.riskScore}
                </span>
                <span className="text-xs font-mono text-[#101010]/40">/ 100</span>
              </div>
            </div>

            <div className="p-3.5 bg-[#FFFFFF] border border-[#E5E7EB] rounded-[4px] flex flex-col justify-between">
              <span className="block font-mono text-[10px] uppercase tracking-wider text-[#101010]/60 font-semibold mb-1">
                Threat Classification
              </span>
              <div>
                <Badge variant={badgeVariantMap[item.threatLevel]} size="md">
                  {item.threatLevel === "CRITICAL"
                    ? "Critical Phishing"
                    : item.threatLevel === "SUSPICIOUS"
                    ? "Suspicious"
                    : "Safe / Verified"}
                </Badge>
              </div>
            </div>

            <div className="p-3.5 bg-[#FFFFFF] border border-[#E5E7EB] rounded-[4px] flex flex-col justify-between">
              <span className="block font-mono text-[10px] uppercase tracking-wider text-[#101010]/60 font-semibold mb-1">
                Evaluation Engine
              </span>
              <span className="font-mono text-xs text-[#101010]">
                Demo Heuristic Analysis
              </span>
            </div>
          </div>

          {/* Detected Keywords Section */}
          <div className="p-4 border border-[#E5E7EB] rounded-[4px] bg-[#FAFAFA]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs uppercase tracking-wider text-[#101010] font-bold">
                Detected Suspicious Keywords &amp; Threat Tokens ({keywords.length})
              </span>
              <span className="font-mono text-[10px] text-[#101010]/50">
                Pattern Match
              </span>
            </div>

            {keywords.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {keywords.map((kw, idx) => (
                  <Badge
                    key={idx}
                    variant={item.threatLevel === "CRITICAL" ? "critical" : "suspicious"}
                    size="sm"
                    rounded="sm"
                    className="font-mono lowercase"
                  >
                    &ldquo;{kw}&rdquo;
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-[#0F766E] font-mono py-1">
                <CheckIcon className="w-3.5 h-3.5" />
                <span>No deceptive keywords or coercive language tokens identified.</span>
              </div>
            )}
          </div>

          {/* Indicator Rules Table */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#101010] mb-2.5">
              Evaluated Rule Indicators ({item.indicators.length})
            </h4>
            <div className="divide-y divide-[#E5E7EB] border border-[#E5E7EB] rounded-[4px]">
              {item.indicators.map((ind, i) => {
                const badgeMeta = indicatorBadgeMap[ind.status];
                return (
                  <div
                    key={i}
                    className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#FFFFFF]"
                  >
                    <div>
                      <span className="text-xs font-bold text-[#101010] block">
                        {ind.name}
                      </span>
                      <span className="text-xs text-[#101010]/70 mt-0.5 block">
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

          {/* Action Recommendation */}
          <div className="p-4 bg-[#101010] text-[#FFFFFF] rounded-[4px]">
            <div className="flex items-start gap-2.5">
              <AlertTriangleIcon className="w-4 h-4 text-[#D92D20] shrink-0 mt-0.5" />
              <div>
                <span className="block font-mono text-[10px] uppercase tracking-wider text-[#DBDCDD] font-bold mb-1">
                  Action Recommendation
                </span>
                <p className="text-xs leading-relaxed text-[#F4F4F4]">
                  {item.recommendation}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="sticky bottom-0 bg-[#FFFFFF] px-6 py-4 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="font-mono text-[11px] text-[#101010]/50">
            Recorded: {new Date(item.timestamp).toLocaleString()}
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handlePrint}
              className="flex-1 sm:flex-initial"
            >
              Print Report
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleDownloadJson}
              icon={<DownloadIcon className="w-3.5 h-3.5" />}
              className="flex-1 sm:flex-initial"
            >
              Export JSON
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={onClose}
              className="flex-1 sm:flex-initial"
            >
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
