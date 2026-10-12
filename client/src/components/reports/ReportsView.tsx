"use client";

import React, { useState, useMemo } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  SearchIcon,
  FilterIcon,
  DownloadIcon,
  ArrowRightIcon,
  RefreshCwIcon,
  FileTextIcon,
} from "@/components/ui/Icons";
import { ReportDetailModal } from "@/components/reports/ReportDetailModal";
import { useScanHistory } from "@/lib/scan-history-store";
import { HistoryItem } from "@/lib/mock-history";
import { ScanResult } from "@/lib/mock-data";

export function ReportsView() {
  const { history, restoreHistory } = useScanHistory();
  const [searchQuery, setSearchQuery] = useState("");
  const [threatFilter, setThreatFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest_risk" | "lowest_risk">("newest");
  const [selectedReport, setSelectedReport] = useState<HistoryItem | ScanResult | null>(null);

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

  // Metrics across the full dataset
  const totalReports = history.length;
  const criticalCount = history.filter((i) => i.threatLevel === "CRITICAL").length;
  const suspiciousCount = history.filter((i) => i.threatLevel === "SUSPICIOUS").length;
  const safeCount = history.filter((i) => i.threatLevel === "SAFE").length;
  const avgRiskScore = totalReports > 0
    ? Math.round(history.reduce((acc, curr) => acc + curr.riskScore, 0) / totalReports)
    : 0;

  // Filter and sort records
  const filteredReports = useMemo(() => {
    return history
      .filter((item) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const targetMatch = item.target.toLowerCase().includes(q);
          const subjectMatch = item.subject?.toLowerCase().includes(q) || false;
          const idMatch = item.id.toLowerCase().includes(q);
          const keywordsMatch = item.detectedKeywords?.some((kw) => kw.toLowerCase().includes(q)) || false;
          if (!targetMatch && !subjectMatch && !idMatch && !keywordsMatch) {
            return false;
          }
        }

        if (threatFilter !== "ALL" && item.threatLevel !== threatFilter) {
          return false;
        }

        if (typeFilter !== "ALL" && item.targetType !== typeFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        }
        if (sortBy === "oldest") {
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        }
        if (sortBy === "highest_risk") {
          return b.riskScore - a.riskScore;
        }
        if (sortBy === "lowest_risk") {
          return a.riskScore - b.riskScore;
        }
        return 0;
      });
  }, [history, searchQuery, threatFilter, typeFilter, sortBy]);

  const hasActiveFilters = searchQuery.trim() !== "" || threatFilter !== "ALL" || typeFilter !== "ALL" || sortBy !== "newest";

  const handleResetFilters = () => {
    setSearchQuery("");
    setThreatFilter("ALL");
    setTypeFilter("ALL");
    setSortBy("newest");
  };

  const handleExportFilteredJson = () => {
    const filename = `nobait-reports-export-${Date.now()}.json`;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredReports, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="mb-8 pb-6 border-b border-[#E5E7EB]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-[0.08em] text-[#0038FF] block mb-2">
              Forensic Intelligence Archive
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#101010] mb-2">
              Threat Intelligence Reports
            </h1>
            <p className="text-sm text-[#101010]/75 max-w-2xl leading-relaxed">
              Audit historical phishing detections, search across threat vectors, inspect detected keyword indicators, and export verifiable report archives.
            </p>
          </div>
          <div className="flex items-center gap-2.5 self-start sm:self-center">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={filteredReports.length === 0}
              onClick={handleExportFilteredJson}
              icon={<DownloadIcon className="w-3.5 h-3.5" />}
            >
              Export JSON ({filteredReports.length})
            </Button>
            <Button
              href="/dashboard#scanner"
              variant="primary"
              size="sm"
              icon={<ArrowRightIcon className="w-3.5 h-3.5" />}
            >
              New Scan
            </Button>
          </div>
        </div>
      </div>

      {/* Summary KPI Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 mb-8">
        <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[6px] p-4 flex flex-col justify-between">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#101010]/60 font-semibold mb-1">
            Total Reports
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-mono font-bold text-[#101010]">
              {totalReports}
            </span>
            <span className="font-mono text-[10px] text-[#101010]/50 uppercase">Records</span>
          </div>
          <span className="font-mono text-[10px] text-[#101010]/50 mt-2 pt-2 border-t border-[#F4F4F4]">
            All Analyzed Targets
          </span>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[6px] p-4 flex flex-col justify-between">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#D92D20] font-semibold mb-1">
            Critical Phishing
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-mono font-bold text-[#D92D20]">
              {criticalCount}
            </span>
            <span className="font-mono text-[10px] text-[#D92D20]/70 uppercase">
              ({totalReports > 0 ? Math.round((criticalCount / totalReports) * 100) : 0}%)
            </span>
          </div>
          <span className="font-mono text-[10px] text-[#D92D20]/80 mt-2 pt-2 border-t border-[#FEF2F2]">
            Score &ge; 60/100
          </span>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[6px] p-4 flex flex-col justify-between">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#B45309] font-semibold mb-1">
            Suspicious Inquiries
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-mono font-bold text-[#B45309]">
              {suspiciousCount}
            </span>
            <span className="font-mono text-[10px] text-[#B45309]/70 uppercase">
              ({totalReports > 0 ? Math.round((suspiciousCount / totalReports) * 100) : 0}%)
            </span>
          </div>
          <span className="font-mono text-[10px] text-[#B45309]/80 mt-2 pt-2 border-t border-[#FFFBEB]">
            Score 25 - 59/100
          </span>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[6px] p-4 flex flex-col justify-between">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#0F766E] font-semibold mb-1">
            Safe / Verified
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-mono font-bold text-[#0F766E]">
              {safeCount}
            </span>
            <span className="font-mono text-[10px] text-[#0F766E]/70 uppercase">
              ({totalReports > 0 ? Math.round((safeCount / totalReports) * 100) : 0}%)
            </span>
          </div>
          <span className="font-mono text-[10px] text-[#0F766E]/80 mt-2 pt-2 border-t border-[#F0FDF4]">
            Score &lt; 25/100
          </span>
        </div>

        <div className="col-span-2 lg:col-span-1 bg-[#FFFFFF] border border-[#E5E7EB] rounded-[6px] p-4 flex flex-col justify-between">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#0038FF] font-semibold mb-1">
            Average Threat Score
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-mono font-bold text-[#0038FF]">
              {avgRiskScore}
            </span>
            <span className="font-mono text-[10px] text-[#101010]/50 uppercase">/ 100</span>
          </div>
          <span className="font-mono text-[10px] text-[#101010]/50 mt-2 pt-2 border-t border-[#F4F4F4]">
            Mean Risk Severity
          </span>
        </div>
      </div>

      {/* Filter and Search Workbench */}
      <div className="mb-6 p-4 bg-[#FFFFFF] border border-[#E5E7EB] rounded-[8px] space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#101010]/40" aria-hidden="true">
              <SearchIcon className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports by domain, email subject, keyword, or report ID..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#F4F4F4]/70 border border-[#E5E7EB] rounded-[4px] font-mono text-xs text-[#101010] placeholder:text-[#101010]/40 focus:outline-none focus:border-[#0038FF] transition-colors"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <label htmlFor="report-sort" className="font-mono text-[11px] text-[#101010]/60 uppercase">
              Sort:
            </label>
            <select
              id="report-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "highest_risk" | "lowest_risk")}
              className="px-3 py-2 bg-[#FFFFFF] border border-[#E5E7EB] rounded-[4px] font-mono text-xs text-[#101010] focus:outline-none focus:border-[#0038FF]"
            >
              <option value="newest">Newest Analyzed</option>
              <option value="oldest">Oldest Analyzed</option>
              <option value="highest_risk">Highest Risk Score</option>
              <option value="lowest_risk">Lowest Risk Score</option>
            </select>
          </div>
        </div>

        {/* Filter Pills Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#F4F4F4]">
          <div className="flex flex-wrap items-center gap-3">
            {/* Threat Level Filter */}
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[10px] text-[#101010]/60 uppercase font-semibold">
                Threat Tier:
              </span>
              <div className="flex items-center bg-[#F4F4F4] p-0.5 rounded-[4px] border border-[#E5E7EB]">
                {["ALL", "CRITICAL", "SUSPICIOUS", "SAFE"].map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setThreatFilter(tier)}
                    className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded-[3px] transition-colors ${
                      threatFilter === tier
                        ? "bg-[#FFFFFF] text-[#0038FF] shadow-xs"
                        : "text-[#101010]/60 hover:text-[#101010]"
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Type Filter */}
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[10px] text-[#101010]/60 uppercase font-semibold">
                Vector:
              </span>
              <div className="flex items-center bg-[#F4F4F4] p-0.5 rounded-[4px] border border-[#E5E7EB]">
                {["ALL", "email", "url", "message"].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setTypeFilter(v)}
                    className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded-[3px] transition-colors ${
                      typeFilter === v
                        ? "bg-[#FFFFFF] text-[#0038FF] shadow-xs"
                        : "text-[#101010]/60 hover:text-[#101010]"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-mono text-[#0038FF] hover:underline"
            >
              Reset all filters
            </button>
          )}
        </div>
      </div>

      {/* Reports Table / Card Container */}
      <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[8px] overflow-hidden">
        {history.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center bg-[#FAFAFA]">
            <span className="p-3 bg-[#F4F4F4] border border-[#E5E7EB] rounded-full text-[#101010]/40 mb-3" aria-hidden="true">
              <FileTextIcon className="w-6 h-6" />
            </span>
            <h3 className="font-mono text-sm font-bold text-[#101010] uppercase tracking-wider mb-2">
              No Reports Generated
            </h3>
            <p className="text-xs text-[#101010]/60 max-w-sm mb-6 leading-relaxed">
              No threat scans have been executed yet in the active session. Run an email, URL, or message scan to produce report records.
            </p>
            <div className="flex gap-3">
              <Button
                variant="primary"
                size="sm"
                href="/dashboard#scanner"
                icon={<ArrowRightIcon className="w-3.5 h-3.5" />}
              >
                Scan a Target
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={restoreHistory}
                icon={<RefreshCwIcon className="w-3.5 h-3.5" />}
              >
                Load Sample Reports
              </Button>
            </div>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center bg-[#FAFAFA]">
            <span className="p-3 bg-[#F4F4F4] border border-[#E5E7EB] rounded-full text-[#101010]/40 mb-3" aria-hidden="true">
              <FilterIcon className="w-5 h-5" />
            </span>
            <h3 className="font-mono text-sm font-bold text-[#101010] uppercase tracking-wider mb-1">
              No Reports Found
            </h3>
            <p className="text-xs text-[#101010]/60 max-w-sm mb-4 leading-relaxed">
              No forensic reports match your active query or selected filters.
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleResetFilters}
            >
              Clear Search &amp; Filters
            </Button>
          </div>
        ) : (
          <>
            {/* Desktop / Tablet Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F4F4F4]/70 font-mono text-[11px] text-[#101010]/60 uppercase tracking-wider">
                    <th scope="col" className="py-3 px-5 font-semibold">Report ID</th>
                    <th scope="col" className="py-3 px-5 font-semibold">Target / Subject</th>
                    <th scope="col" className="py-3 px-5 font-semibold">Threat Tier</th>
                    <th scope="col" className="py-3 px-5 font-semibold">Risk Score</th>
                    <th scope="col" className="py-3 px-5 font-semibold">Keywords Detected</th>
                    <th scope="col" className="py-3 px-5 font-semibold">Vector</th>
                    <th scope="col" className="py-3 px-5 font-semibold">Analyzed</th>
                    <th scope="col" className="py-3 px-5 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] text-xs">
                  {filteredReports.map((report) => (
                    <tr
                      key={report.id}
                      className="hover:bg-[#F9FAFB] transition-colors"
                    >
                      <td className="py-3.5 px-5 font-mono text-[11px] text-[#0038FF] font-semibold">
                        {report.id}
                      </td>
                      <td className="py-3.5 px-5 font-mono text-xs text-[#101010] max-w-xs">
                        <div className="truncate">
                          <span className="font-semibold block truncate" title={report.subject || report.target}>
                            {report.subject || report.target}
                          </span>
                          {report.subject && (
                            <span className="text-[10px] text-[#101010]/50 block truncate">
                              Sender: {report.target}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-5">
                        <Badge variant={badgeMap[report.threatLevel]} size="sm">
                          {report.threatLevel}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-5 font-mono font-bold">
                        <span className={scoreColorMap[report.threatLevel]}>
                          {report.riskScore}
                        </span>
                        <span className="text-[#101010]/40 font-normal text-[11px]"> / 100</span>
                      </td>
                      <td className="py-3.5 px-5 font-mono text-[11px] max-w-[190px]">
                        {report.detectedKeywords && report.detectedKeywords.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {report.detectedKeywords.slice(0, 2).map((kw, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 bg-[#F4F4F4] text-[#101010] border border-[#E5E7EB] rounded-[2px] text-[10px]"
                              >
                                {kw}
                              </span>
                            ))}
                            {report.detectedKeywords.length > 2 && (
                              <span className="text-[10px] text-[#101010]/50 self-center">
                                +{report.detectedKeywords.length - 2}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[#101010]/40">Clean</span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 font-mono text-[11px] text-[#101010]/70 uppercase">
                        {report.targetType}
                      </td>
                      <td className="py-3.5 px-5 font-mono text-[11px] text-[#101010]/60 whitespace-nowrap">
                        {report.formattedDate}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedReport(report)}
                          className="font-mono text-[11px] font-semibold text-[#0038FF] hover:underline"
                        >
                          View Report →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card Layout */}
            <div className="md:hidden divide-y divide-[#E5E7EB]">
              {filteredReports.map((report) => (
                <div key={report.id} className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-[#0038FF]">
                      {report.id}
                    </span>
                    <Badge variant={badgeMap[report.threatLevel]} size="sm">
                      {report.threatLevel}
                    </Badge>
                  </div>

                  <div className="font-mono text-xs text-[#101010] break-all">
                    {report.subject ? (
                      <div>
                        <strong className="block text-[#101010]">{report.subject}</strong>
                        <span className="text-[#101010]/60 text-[11px]">{report.target}</span>
                      </div>
                    ) : (
                      report.target
                    )}
                  </div>

                  {report.detectedKeywords && report.detectedKeywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 font-mono text-[10px]">
                      {report.detectedKeywords.slice(0, 3).map((kw, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 bg-[#F4F4F4] text-[#101010] rounded-[2px] border border-[#E5E7EB]">
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-[#F4F4F4]">
                    <div className="font-mono text-xs">
                      <span className="text-[#101010]/60 text-[10px] uppercase font-bold mr-1">
                        Risk:
                      </span>
                      <span className={`font-bold ${scoreColorMap[report.threatLevel]}`}>
                        {report.riskScore}
                      </span>
                      <span className="text-[#101010]/40 text-[10px]"> / 100 · {report.targetType}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedReport(report)}
                      className="font-mono text-xs font-semibold text-[#0038FF] hover:underline"
                    >
                      View Report →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Forensic Report Inspection Modal */}
      {selectedReport && (
        <ReportDetailModal
          item={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
}
