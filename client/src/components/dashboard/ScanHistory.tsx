import React, { useState, useMemo } from "react";
import { HistoryItem } from "@/lib/mock-history";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  TrashIcon,
  RefreshCwIcon,
  ArrowRightIcon,
  ShieldIcon,
  SearchIcon,
  FilterIcon,
} from "@/components/ui/Icons";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [threatFilter, setThreatFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest_risk" | "lowest_risk">("newest");

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

  // Filtered and sorted records
  const filteredHistory = useMemo(() => {
    return history
      .filter((item) => {
        // 1. Search Query
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

        // 2. Threat Level Filter
        if (threatFilter !== "ALL" && item.threatLevel !== threatFilter) {
          return false;
        }

        // 3. Target Type Filter
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
              ({filteredHistory.length} of {history.length})
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

      {/* Search & Filter Toolbar */}
      {history.length > 0 && (
        <div className="mb-4 p-3 bg-[#FFFFFF] border border-[#E5E7EB] rounded-[8px] flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#101010]/40" aria-hidden="true">
              <SearchIcon className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by destination, subject, keyword, or report ID..."
              className="w-full pl-9 pr-3 py-2 bg-[#F4F4F4]/70 border border-[#E5E7EB] rounded-[4px] font-mono text-xs text-[#101010] placeholder:text-[#101010]/40 focus:outline-none focus:border-[#0038FF] transition-colors"
            />
          </div>

          {/* Filter Pills & Sorter */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Threat Level Filter */}
            <div className="flex items-center bg-[#F4F4F4] p-0.5 rounded-[4px] border border-[#E5E7EB]">
              {["ALL", "CRITICAL", "SUSPICIOUS", "SAFE"].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setThreatFilter(lvl)}
                  className={`px-2 py-1 text-[10px] font-mono font-bold uppercase rounded-[3px] transition-colors ${
                    threatFilter === lvl
                      ? "bg-[#FFFFFF] text-[#0038FF] shadow-xs"
                      : "text-[#101010]/60 hover:text-[#101010]"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {/* Target Type Filter */}
            <div className="flex items-center bg-[#F4F4F4] p-0.5 rounded-[4px] border border-[#E5E7EB]">
              {["ALL", "url", "email", "message"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-2 py-1 text-[10px] font-mono font-bold uppercase rounded-[3px] transition-colors ${
                    typeFilter === t
                      ? "bg-[#FFFFFF] text-[#0038FF] shadow-xs"
                      : "text-[#101010]/60 hover:text-[#101010]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "highest_risk" | "lowest_risk")}
              className="px-2.5 py-1.5 bg-[#FFFFFF] border border-[#E5E7EB] rounded-[4px] font-mono text-[11px] text-[#101010] focus:outline-none focus:border-[#0038FF]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest_risk">Highest Risk</option>
              <option value="lowest_risk">Lowest Risk</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-[11px] font-mono text-[#0038FF] hover:underline px-1"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Table / Card Container */}
      <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[8px] overflow-hidden">
        {history.length === 0 ? (
          /* Empty State - No history at all */
          <div className="p-12 text-center flex flex-col items-center justify-center bg-[#FAFAFA]">
            <span className="p-3 bg-[#F4F4F4] border border-[#E5E7EB] rounded-full text-[#101010]/40 mb-3" aria-hidden="true">
              <ShieldIcon className="w-6 h-6" />
            </span>
            <h3 className="font-mono text-sm font-bold text-[#101010] uppercase tracking-wider mb-2">
              No Scans Yet
            </h3>
            <p className="text-xs text-[#101010]/60 max-w-sm mb-6 leading-relaxed">
              Your analyzed URLs, emails, and messages will appear here in the active session history once inspected.
            </p>
            <div className="flex gap-3">
              <Button
                variant="primary"
                size="sm"
                href="#scanner"
                icon={<ArrowRightIcon className="w-3.5 h-3.5" />}
              >
                Start a Scan
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
        ) : filteredHistory.length === 0 ? (
          /* Filtered Empty State */
          <div className="p-12 text-center flex flex-col items-center justify-center bg-[#FAFAFA]">
            <span className="p-3 bg-[#F4F4F4] border border-[#E5E7EB] rounded-full text-[#101010]/40 mb-3" aria-hidden="true">
              <FilterIcon className="w-5 h-5" />
            </span>
            <h3 className="font-mono text-sm font-bold text-[#101010] uppercase tracking-wider mb-1">
              No Matching Records
            </h3>
            <p className="text-xs text-[#101010]/60 max-w-sm mb-4 leading-relaxed">
              No previous scans match your current search and filter parameters.
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleResetFilters}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <>
            {/* Desktop / Tablet Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F4F4F4]/60 font-mono text-[11px] text-[#101010]/60 uppercase tracking-wider">
                    <th scope="col" className="py-3 px-5 font-semibold">Target Specimen</th>
                    <th scope="col" className="py-3 px-5 font-semibold">Risk Score</th>
                    <th scope="col" className="py-3 px-5 font-semibold">Threat Level</th>
                    <th scope="col" className="py-3 px-5 font-semibold">Detected Keywords</th>
                    <th scope="col" className="py-3 px-5 font-semibold">Type</th>
                    <th scope="col" className="py-3 px-5 font-semibold">Analyzed</th>
                    <th scope="col" className="py-3 px-5 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] text-xs">
                  {filteredHistory.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-[#F9FAFB] transition-colors"
                    >
                      <td className="py-3.5 px-5 font-mono text-xs text-[#101010] max-w-xs truncate">
                        <div>
                          <span className="text-[#101010] font-semibold block truncate" title={item.subject || item.target}>
                            {item.subject || item.target}
                          </span>
                          {item.subject && (
                            <span className="text-[10px] text-[#101010]/50 block truncate">
                              From: {item.target}
                            </span>
                          )}
                        </div>
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
                      <td className="py-3.5 px-5 font-mono text-[11px] max-w-[180px]">
                        {item.detectedKeywords && item.detectedKeywords.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {item.detectedKeywords.slice(0, 2).map((kw, i) => (
                              <span
                                key={i}
                                className="px-1.5 py-0.5 bg-[#F4F4F4] text-[#101010] border border-[#E5E7EB] rounded-[2px] text-[10px]"
                              >
                                {kw}
                              </span>
                            ))}
                            {item.detectedKeywords.length > 2 && (
                              <span className="text-[10px] text-[#101010]/50 self-center">
                                +{item.detectedKeywords.length - 2}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[#101010]/40">None</span>
                        )}
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

            {/* Mobile Card Representation */}
            <div className="md:hidden divide-y divide-[#E5E7EB]">
              {filteredHistory.map((item) => (
                <div key={item.id} className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant={badgeMap[item.threatLevel]} size="sm">
                      {item.threatLevel}
                    </Badge>
                    <span className="font-mono text-[10px] text-[#101010]/50 uppercase">
                      {item.formattedDate} · {item.targetType}
                    </span>
                  </div>

                  <div className="font-mono text-xs text-[#101010] break-all">
                    {item.subject ? (
                      <div>
                        <strong className="block text-[#101010]">{item.subject}</strong>
                        <span className="text-[#101010]/60 text-[11px]">{item.target}</span>
                      </div>
                    ) : (
                      item.target
                    )}
                  </div>

                  {item.detectedKeywords && item.detectedKeywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1 font-mono text-[10px]">
                      {item.detectedKeywords.slice(0, 3).map((kw, i) => (
                        <span key={i} className="px-1.5 py-0.5 bg-[#F4F4F4] text-[#101010] rounded-[2px] border border-[#E5E7EB]">
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
