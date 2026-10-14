"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  ShieldIcon,
  SearchIcon,
  DownloadIcon,
  RefreshCwIcon,
  ArrowRightIcon,
  MailIcon,
  LinkIcon,
  MessageIcon,
  FileTextIcon,
  UserIcon,
  TrashIcon,
  CheckIcon,
  AlertTriangleIcon,
} from "@/components/ui/Icons";
import { ReportDetailModal } from "@/components/reports/ReportDetailModal";
import { useScanHistory, mapDbScanToHistoryItem } from "@/lib/scan-history-store";
import { HistoryItem } from "@/lib/mock-history";
import { ScanResult } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/client";

interface KeywordItem {
  id: string;
  keyword: string;
  category: "url" | "email" | "message" | "universal";
  severity: "low" | "medium" | "high";
  is_active: boolean;
  created_at?: string;
}

interface ProfileItem {
  id: string;
  full_name: string | null;
  role: "user" | "admin";
  created_at: string;
}

export function AdminDashboardView() {
  const { history: localHistory, restoreHistory } = useScanHistory();
  const [activeTab, setActiveTab] = useState<"telemetry" | "keywords" | "users">("telemetry");

  // Live DB Scans state (falls back to localHistory if not connected)
  const [dbScans, setDbScans] = useState<HistoryItem[] | null>(null);
  const [isLoadingScans, setIsLoadingScans] = useState(false);

  // Search & Filter state for scans audit
  const [searchQuery, setSearchQuery] = useState("");
  const [threatFilter, setThreatFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest_risk" | "lowest_risk">("newest");
  const [selectedScan, setSelectedScan] = useState<HistoryItem | ScanResult | null>(null);

  // Keywords State
  const [keywords, setKeywords] = useState<KeywordItem[]>([]);
  const [keywordCategoryFilter, setKeywordCategoryFilter] = useState<string>("ALL");
  const [newKeyword, setNewKeyword] = useState("");
  const [newCategory, setNewCategory] = useState<"url" | "email" | "message" | "universal">("url");
  const [newSeverity, setNewSeverity] = useState<"low" | "medium" | "high">("medium");
  const [keywordNotice, setKeywordNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSubmittingKeyword, setIsSubmittingKeyword] = useState(false);

  // Users State
  const [users, setUsers] = useState<ProfileItem[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

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

  // Fetch live system-wide scans and keywords
  useEffect(() => {
    async function loadAdminData() {
      setIsLoadingScans(true);
      try {
        const supabase = createClient();

        // 1. Fetch system scans
        const { data: scanData } = await supabase
          .from("scans")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(200);

        if (scanData && scanData.length > 0) {
          setDbScans(scanData.map(mapDbScanToHistoryItem));
        }

        // 2. Fetch keywords
        const { data: kwData } = await supabase
          .from("suspicious_keywords")
          .select("*")
          .order("created_at", { ascending: false });

        if (kwData && kwData.length > 0) {
          setKeywords(kwData);
        } else {
          // Default fallbacks if table not seeded
          setKeywords([
            { id: "1", keyword: "paypal", category: "url", severity: "high", is_active: true },
            { id: "2", keyword: "urgent", category: "email", severity: "high", is_active: true },
            { id: "3", keyword: "verify credentials", category: "message", severity: "high", is_active: true },
            { id: "4", keyword: "suspended", category: "email", severity: "high", is_active: true },
            { id: "5", keyword: "wallet", category: "url", severity: "high", is_active: true },
          ]);
        }

        // 3. Fetch profiles
        setIsLoadingUsers(true);
        const { data: profileData } = await supabase
          .from("profiles")
          .select("id, full_name, role, created_at")
          .order("created_at", { ascending: false });

        if (profileData) {
          setUsers(profileData);
        }
      } catch (err) {
        console.warn("Could not load admin DB records:", err);
      } finally {
        setIsLoadingScans(false);
        setIsLoadingUsers(false);
      }
    }

    loadAdminData();
  }, []);

  // Effective history: live DB scans if available, otherwise session history
  const activeHistory = dbScans || localHistory;

  // 1. Core Telemetry Calculations
  const totalScans = activeHistory.length;
  const criticalScans = activeHistory.filter((i) => i.threatLevel === "CRITICAL").length;
  const suspiciousScans = activeHistory.filter((i) => i.threatLevel === "SUSPICIOUS").length;
  const safeScans = activeHistory.filter((i) => i.threatLevel === "SAFE").length;

  const urlScans = activeHistory.filter((i) => i.targetType === "url").length;
  const emailScans = activeHistory.filter((i) => i.targetType === "email").length;
  const messageScans = activeHistory.filter((i) => i.targetType === "message").length;

  const avgRiskScore =
    totalScans > 0
      ? Math.round(activeHistory.reduce((acc, curr) => acc + curr.riskScore, 0) / totalScans)
      : 0;

  const criticalPct = totalScans > 0 ? Math.round((criticalScans / totalScans) * 100) : 0;
  const suspiciousPct = totalScans > 0 ? Math.round((suspiciousScans / totalScans) * 100) : 0;
  const safePct = totalScans > 0 ? Math.round((safeScans / totalScans) * 100) : 0;

  // 2. Keyword Frequency Aggregator
  const keywordFrequencies = useMemo(() => {
    const counts: Record<string, number> = {};
    activeHistory.forEach((scan) => {
      if (scan.detectedKeywords && scan.detectedKeywords.length > 0) {
        scan.detectedKeywords.forEach((kw) => {
          const normalized = kw.trim();
          counts[normalized] = (counts[normalized] || 0) + 1;
        });
      }
    });

    return Object.entries(counts)
      .map(([keyword, count]) => ({
        keyword,
        count,
        percentage: totalScans > 0 ? Math.round((count / totalScans) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [activeHistory, totalScans]);

  // 3. Search & Filtered Audit Table
  const filteredAuditLogs = useMemo(() => {
    return activeHistory
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
  }, [activeHistory, searchQuery, threatFilter, typeFilter, sortBy]);

  const hasActiveFilters =
    searchQuery.trim() !== "" || threatFilter !== "ALL" || typeFilter !== "ALL" || sortBy !== "newest";

  const handleResetFilters = () => {
    setSearchQuery("");
    setThreatFilter("ALL");
    setTypeFilter("ALL");
    setSortBy("newest");
  };

  const handleExportJson = () => {
    const filename = `nobait-admin-telemetry-${Date.now()}.json`;
    const exportPayload = {
      exportedAt: new Date().toISOString(),
      source: "NoBait Admin Telemetry Console",
      telemetry: {
        totalScans,
        criticalScans,
        suspiciousScans,
        safeScans,
        averageRiskScore: avgRiskScore,
        vectors: { urlScans, emailScans, messageScans },
      },
      topKeywords: keywordFrequencies,
      records: filteredAuditLogs,
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Keyword Management Handlers
  const handleAddKeyword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyword.trim()) return;

    setIsSubmittingKeyword(true);
    setKeywordNotice(null);

    try {
      const supabase = createClient();
      const kw = newKeyword.trim().toLowerCase();

      const { data, error } = await supabase
        .from("suspicious_keywords")
        .insert({
          keyword: kw,
          category: newCategory,
          severity: newSeverity,
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        setKeywordNotice({ type: "error", text: error.message });
      } else if (data) {
        setKeywords([data, ...keywords]);
        setNewKeyword("");
        setKeywordNotice({ type: "success", text: `Keyword "${kw}" registered successfully.` });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving keyword.";
      setKeywordNotice({ type: "error", text: msg });
    } finally {
      setIsSubmittingKeyword(false);
    }
  };

  const handleToggleKeyword = async (id: string, currentActive: boolean) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("suspicious_keywords")
        .update({ is_active: !currentActive })
        .eq("id", id);

      if (!error) {
        setKeywords(keywords.map((k) => (k.id === id ? { ...k, is_active: !currentActive } : k)));
      }
    } catch {
      // Local fallback toggle
      setKeywords(keywords.map((k) => (k.id === id ? { ...k, is_active: !currentActive } : k)));
    }
  };

  const handleDeleteKeyword = async (id: string) => {
    if (!confirm("Are you sure you want to remove this keyword?")) return;

    try {
      const supabase = createClient();
      const { error } = await supabase.from("suspicious_keywords").delete().eq("id", id);
      if (!error) {
        setKeywords(keywords.filter((k) => k.id !== id));
      }
    } catch {
      setKeywords(keywords.filter((k) => k.id !== id));
    }
  };

  const filteredKeywords = useMemo(() => {
    if (keywordCategoryFilter === "ALL") return keywords;
    return keywords.filter((k) => k.category === keywordCategoryFilter);
  }, [keywords, keywordCategoryFilter]);

  return (
    <div className="w-full space-y-8">
      {/* 1. Header Bar */}
      <div className="pb-6 border-b border-[#E5E7EB]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.08em] text-[#0038FF]">
                NoBait Threat Intelligence Operations
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#0038FF]/10 text-[#0038FF]">
                {dbScans ? "LIVE SUPABASE TELEMETRY" : "DEMO SESSION"}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#101010] mb-2">
              Admin Threat Operations
            </h1>
            <p className="text-sm text-[#101010]/75 max-w-2xl leading-relaxed">
              Real-time threat analytics, attack vector distribution, suspicious keyword rule management, and specimen audit trails calculated directly from the platform&apos;s active scan archive.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-center">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={filteredAuditLogs.length === 0}
              onClick={handleExportJson}
              icon={<DownloadIcon className="w-3.5 h-3.5" />}
            >
              Export Audit JSON
            </Button>
            <Button
              href="/reports"
              variant="secondary"
              size="sm"
              icon={<FileTextIcon className="w-3.5 h-3.5" />}
            >
              View Reports
            </Button>
            <Button
              href="/dashboard#scanner"
              variant="primary"
              size="sm"
              icon={<ArrowRightIcon className="w-3.5 h-3.5" />}
            >
              Launch Scanner
            </Button>
          </div>
        </div>

        {/* Console Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-[#E5E7EB]">
          <button
            type="button"
            onClick={() => setActiveTab("telemetry")}
            className={`px-4 py-2 text-xs font-mono font-bold uppercase rounded-[4px] border transition-colors ${
              activeTab === "telemetry"
                ? "bg-[#0038FF] text-[#FFFFFF] border-[#0038FF]"
                : "bg-[#FFFFFF] text-[#101010]/70 border-[#E5E7EB] hover:text-[#101010]"
            }`}
          >
            Threat Telemetry &amp; Audit ({totalScans})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("keywords")}
            className={`px-4 py-2 text-xs font-mono font-bold uppercase rounded-[4px] border transition-colors ${
              activeTab === "keywords"
                ? "bg-[#0038FF] text-[#FFFFFF] border-[#0038FF]"
                : "bg-[#FFFFFF] text-[#101010]/70 border-[#E5E7EB] hover:text-[#101010]"
            }`}
          >
            Keyword Engine Rules ({keywords.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 text-xs font-mono font-bold uppercase rounded-[4px] border transition-colors ${
              activeTab === "users"
                ? "bg-[#0038FF] text-[#FFFFFF] border-[#0038FF]"
                : "bg-[#FFFFFF] text-[#101010]/70 border-[#E5E7EB] hover:text-[#101010]"
            }`}
          >
            User Directory ({users.length})
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: THREAT TELEMETRY & AUDIT */}
      {/* ========================================================================= */}
      {activeTab === "telemetry" && (
        <>
          {/* Advisory Callout */}
          <div className="p-4 bg-[#FFFFFF] border-l-4 border-l-[#0038FF] border border-[#E5E7EB] rounded-[4px] flex items-start gap-3.5">
            <div className="p-1.5 bg-[#0038FF]/10 text-[#0038FF] rounded-[4px] shrink-0 mt-0.5">
              <ShieldIcon className="w-4 h-4" />
            </div>
            <div className="text-xs leading-relaxed">
              <span className="font-mono font-bold text-[#101010] uppercase tracking-wider block mb-1">
                {dbScans ? "Live PostgreSQL Telemetry (Supabase)" : "Session Telemetry Active"}
              </span>
              <p className="text-[#101010]/75">
                The analytics shown below reflect verified scans evaluated across destination URLs, raw email headers, and smishing payloads. Admin queries run with role-based auditing safeguards.
              </p>
            </div>
          </div>

          {/* KPI Ribbon (6 Metrics) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {/* Total Scans */}
            <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[6px] p-4 flex flex-col justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#101010]/60 font-semibold mb-1">
                Total Analyzed
              </span>
              <div>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-[#101010]">
                  {totalScans}
                </div>
                <div className="font-mono text-[10px] text-[#101010]/50 uppercase mt-0.5">
                  Specimens
                </div>
              </div>
              <span className="font-mono text-[10px] text-[#101010]/50 mt-3 pt-2 border-t border-[#F4F4F4]">
                Session Baseline
              </span>
            </div>

            {/* Critical Threats */}
            <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[6px] p-4 flex flex-col justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#D92D20] font-semibold mb-1">
                Critical Threats
              </span>
              <div>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-[#D92D20]">
                  {criticalScans}
                </div>
                <div className="font-mono text-[10px] text-[#D92D20]/80 uppercase mt-0.5">
                  {criticalPct}% of Volume
                </div>
              </div>
              <span className="font-mono text-[10px] text-[#D92D20]/70 mt-3 pt-2 border-t border-[#FEF2F2]">
                Score &ge; 60/100
              </span>
            </div>

            {/* Suspicious Inquiries */}
            <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[6px] p-4 flex flex-col justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#B45309] font-semibold mb-1">
                Suspicious
              </span>
              <div>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-[#B45309]">
                  {suspiciousScans}
                </div>
                <div className="font-mono text-[10px] text-[#B45309]/80 uppercase mt-0.5">
                  {suspiciousPct}% of Volume
                </div>
              </div>
              <span className="font-mono text-[10px] text-[#B45309]/70 mt-3 pt-2 border-t border-[#FFFBEB]">
                Score 25-59/100
              </span>
            </div>

            {/* Safe Detections */}
            <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[6px] p-4 flex flex-col justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#0F766E] font-semibold mb-1">
                Safe Targets
              </span>
              <div>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-[#0F766E]">
                  {safeScans}
                </div>
                <div className="font-mono text-[10px] text-[#0F766E]/80 uppercase mt-0.5">
                  {safePct}% of Volume
                </div>
              </div>
              <span className="font-mono text-[10px] text-[#0F766E]/70 mt-3 pt-2 border-t border-[#F0FDF4]">
                Score &lt; 25/100
              </span>
            </div>

            {/* Average Risk Score */}
            <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[6px] p-4 flex flex-col justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#0038FF] font-semibold mb-1">
                Avg Risk Score
              </span>
              <div>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-[#0038FF]">
                  {avgRiskScore}
                </div>
                <div className="font-mono text-[10px] text-[#101010]/50 uppercase mt-0.5">
                  / 100 Global
                </div>
              </div>
              <span className="font-mono text-[10px] text-[#101010]/50 mt-3 pt-2 border-t border-[#F4F4F4]">
                Mean Threat Level
              </span>
            </div>

            {/* Vectors Ratio */}
            <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[6px] p-4 flex flex-col justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#101010]/60 font-semibold mb-1">
                Vector Volumes
              </span>
              <div>
                <div className="font-mono text-xs font-bold text-[#101010] flex items-center justify-between">
                  <span>EMAIL</span>
                  <span className="text-[#0038FF]">{emailScans}</span>
                </div>
                <div className="font-mono text-xs font-bold text-[#101010] flex items-center justify-between mt-1">
                  <span>URL</span>
                  <span className="text-[#0038FF]">{urlScans}</span>
                </div>
                <div className="font-mono text-xs font-bold text-[#101010] flex items-center justify-between mt-1">
                  <span>MSG</span>
                  <span className="text-[#0038FF]">{messageScans}</span>
                </div>
              </div>
              <span className="font-mono text-[10px] text-[#101010]/50 mt-2 pt-2 border-t border-[#F4F4F4]">
                Attack Surfaces
              </span>
            </div>
          </div>

          {/* Threat Distribution & Vector Breakdown (2 Columns) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Threat Distribution Card */}
            <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[8px] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-mono text-sm font-bold text-[#101010] uppercase tracking-wider">
                    Threat Severity Distribution
                  </h2>
                  <p className="text-xs text-[#101010]/60 mt-0.5">
                    Proportion of analyzed specimens across risk severity tiers
                  </p>
                </div>
                <span className="font-mono text-xs text-[#101010]/50">
                  {totalScans} Total
                </span>
              </div>

              {/* Proportional Stacked Bar */}
              <div className="h-4 w-full bg-[#E5E7EB] rounded-full overflow-hidden flex" aria-label="Threat severity breakdown bar">
                {totalScans > 0 ? (
                  <>
                    <div
                      style={{ width: `${safePct}%` }}
                      className="bg-[#0F766E] h-full transition-all duration-500"
                      title={`Safe: ${safePct}% (${safeScans})`}
                    />
                    <div
                      style={{ width: `${suspiciousPct}%` }}
                      className="bg-[#B45309] h-full transition-all duration-500"
                      title={`Suspicious: ${suspiciousPct}% (${suspiciousScans})`}
                    />
                    <div
                      style={{ width: `${criticalPct}%` }}
                      className="bg-[#D92D20] h-full transition-all duration-500"
                      title={`Critical: ${criticalPct}% (${criticalScans})`}
                    />
                  </>
                ) : (
                  <div className="w-full bg-[#E5E7EB] h-full" />
                )}
              </div>

              {/* Legend Items */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-[#F0FDF4] border border-[#DCFCE7] rounded-[4px]">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-[#0F766E]" aria-hidden="true" />
                    <span className="font-mono text-xs font-bold text-[#0F766E] uppercase">Safe</span>
                  </div>
                  <div className="font-mono text-lg font-bold text-[#0F766E]">{safeScans}</div>
                  <div className="font-mono text-[10px] text-[#0F766E]/70">{safePct}% of scans</div>
                </div>

                <div className="p-3 bg-[#FFFBEB] border border-[#FEF3C7] rounded-[4px]">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-[#B45309]" aria-hidden="true" />
                    <span className="font-mono text-xs font-bold text-[#B45309] uppercase">Suspicious</span>
                  </div>
                  <div className="font-mono text-lg font-bold text-[#B45309]">{suspiciousScans}</div>
                  <div className="font-mono text-[10px] text-[#B45309]/70">{suspiciousPct}% of scans</div>
                </div>

                <div className="p-3 bg-[#FEF2F2] border border-[#FEE2E2] rounded-[4px]">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-[#D92D20]" aria-hidden="true" />
                    <span className="font-mono text-xs font-bold text-[#D92D20] uppercase">Critical</span>
                  </div>
                  <div className="font-mono text-lg font-bold text-[#D92D20]">{criticalScans}</div>
                  <div className="font-mono text-[10px] text-[#D92D20]/70">{criticalPct}% of scans</div>
                </div>
              </div>
            </div>

            {/* Scan Vector Breakdown Card */}
            <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[8px] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-mono text-sm font-bold text-[#101010] uppercase tracking-wider">
                    Threat Vector Utilization
                  </h2>
                  <p className="text-xs text-[#101010]/60 mt-0.5">
                    Distribution across analyzed attack vectors and communication formats
                  </p>
                </div>
                <span className="font-mono text-xs text-[#101010]/50">
                  3 Active Vectors
                </span>
              </div>

              <div className="space-y-4 pt-1">
                {/* Email Vector */}
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                    <div className="flex items-center gap-2">
                      <MailIcon className="w-4 h-4 text-[#0038FF]" />
                      <span className="font-bold text-[#101010]">Email Phishing &amp; Inquiries</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#101010]/60 font-semibold">{emailScans} Scans</span>
                      <span className="font-bold text-[#0038FF]">
                        {totalScans > 0 ? Math.round((emailScans / totalScans) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-[#F4F4F4] rounded-full overflow-hidden border border-[#E5E7EB]">
                    <div
                      style={{ width: `${totalScans > 0 ? (emailScans / totalScans) * 100 : 0}%` }}
                      className="bg-[#0038FF] h-full transition-all duration-500"
                    />
                  </div>
                </div>

                {/* URL Vector */}
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                    <div className="flex items-center gap-2">
                      <LinkIcon className="w-4 h-4 text-[#0038FF]" />
                      <span className="font-bold text-[#101010]">URL &amp; Hyperlink Destinations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#101010]/60 font-semibold">{urlScans} Scans</span>
                      <span className="font-bold text-[#0038FF]">
                        {totalScans > 0 ? Math.round((urlScans / totalScans) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-[#F4F4F4] rounded-full overflow-hidden border border-[#E5E7EB]">
                    <div
                      style={{ width: `${totalScans > 0 ? (urlScans / totalScans) * 100 : 0}%` }}
                      className="bg-[#0038FF] h-full transition-all duration-500"
                    />
                  </div>
                </div>

                {/* Message Vector */}
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                    <div className="flex items-center gap-2">
                      <MessageIcon className="w-4 h-4 text-[#0038FF]" />
                      <span className="font-bold text-[#101010]">SMS, WhatsApp &amp; Text Payloads</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#101010]/60 font-semibold">{messageScans} Scans</span>
                      <span className="font-bold text-[#0038FF]">
                        {totalScans > 0 ? Math.round((messageScans / totalScans) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-[#F4F4F4] rounded-full overflow-hidden border border-[#E5E7EB]">
                    <div
                      style={{ width: `${totalScans > 0 ? (messageScans / totalScans) * 100 : 0}%` }}
                      className="bg-[#0038FF] h-full transition-all duration-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Frequently Detected Phishing Keywords */}
          <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[8px] p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E5E7EB]">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-mono text-sm font-bold text-[#101010] uppercase tracking-wider">
                    Frequently Detected Threat Keywords
                  </h2>
                  <span className="px-2 py-0.5 bg-[#F4F4F4] text-[#101010] font-mono text-[10px] rounded-[3px] border border-[#E5E7EB]">
                    Heuristic Signatures
                  </span>
                </div>
                <p className="text-xs text-[#101010]/60 mt-0.5">
                  Most prevalent social engineering terms, urgency triggers, and credential lures identified in specimens
                </p>
              </div>
              <span className="font-mono text-xs text-[#101010]/50">
                {keywordFrequencies.length} Unique Indicators Ranked
              </span>
            </div>

            {keywordFrequencies.length === 0 ? (
              <div className="p-8 text-center bg-[#FAFAFA] rounded-[6px]">
                <p className="font-mono text-xs text-[#101010]/60">
                  No threat keywords detected in the current session. Run an email or message analysis to populate indicator rankings.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {keywordFrequencies.map((item, index) => (
                  <div
                    key={item.keyword}
                    className="p-3 bg-[#F4F4F4]/60 border border-[#E5E7EB] rounded-[6px] flex flex-col justify-between hover:border-[#0038FF]/40 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-mono text-[10px] text-[#101010]/40 font-bold">
                        #{index + 1}
                      </span>
                      <span className="px-2 py-0.5 bg-[#FFFFFF] border border-[#E5E7EB] rounded-[3px] font-mono text-xs font-bold text-[#D92D20]">
                        {item.keyword}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-baseline justify-between font-mono text-[11px] text-[#101010]/70 mb-1">
                        <span>Incidents:</span>
                        <strong className="text-[#101010]">{item.count} detections</strong>
                      </div>
                      <div className="h-1.5 w-full bg-[#E5E7EB] rounded-full overflow-hidden">
                        <div
                          style={{ width: `${Math.min(100, item.percentage * 2)}%` }}
                          className="bg-[#D92D20] h-full"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Live Audit Log */}
          <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[8px] overflow-hidden space-y-4 p-6">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                <h2 className="font-mono text-sm font-bold text-[#101010] uppercase tracking-wider">
                  Recent Specimen Audit Trail
                </h2>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-[#101010]/60">
                    Showing {filteredAuditLogs.length} of {totalScans} entries
                  </span>
                  {!dbScans && (
                    <button
                      type="button"
                      onClick={restoreHistory}
                      className="font-mono text-xs text-[#0038FF] hover:underline flex items-center gap-1"
                      title="Reset session to default benchmark records"
                    >
                      <RefreshCwIcon className="w-3 h-3" />
                      Reload Demo Data
                    </button>
                  )}
                </div>
              </div>
              <p className="text-xs text-[#101010]/60">
                Interactive audit log of analyzed URLs, suspicious email communications, and mobile messaging specimens
              </p>
            </div>

            {/* Search & Filter Bar */}
            <div className="p-3 bg-[#F4F4F4]/60 border border-[#E5E7EB] rounded-[6px] space-y-3">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#101010]/40" aria-hidden="true">
                    <SearchIcon className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search audit trail by domain, sender, keyword, or record ID..."
                    className="w-full pl-10 pr-4 py-2 bg-[#FFFFFF] border border-[#E5E7EB] rounded-[4px] font-mono text-xs text-[#101010] placeholder:text-[#101010]/40 focus:outline-none focus:border-[#0038FF]"
                  />
                </div>

                {/* Sort Selector */}
                <div className="flex items-center gap-2 shrink-0">
                  <label htmlFor="admin-sort" className="font-mono text-[11px] text-[#101010]/60 uppercase">
                    Sort:
                  </label>
                  <select
                    id="admin-sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "highest_risk" | "lowest_risk")}
                    className="px-3 py-1.5 bg-[#FFFFFF] border border-[#E5E7EB] rounded-[4px] font-mono text-xs text-[#101010] focus:outline-none focus:border-[#0038FF]"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="highest_risk">Highest Risk</option>
                    <option value="lowest_risk">Lowest Risk</option>
                  </select>
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E5E7EB]">
                <div className="flex flex-wrap items-center gap-3">
                  {/* Threat Tier */}
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] text-[#101010]/60 uppercase font-semibold">
                      Threat:
                    </span>
                    <div className="flex items-center bg-[#FFFFFF] p-0.5 rounded-[4px] border border-[#E5E7EB]">
                      {["ALL", "CRITICAL", "SUSPICIOUS", "SAFE"].map((tier) => (
                        <button
                          key={tier}
                          type="button"
                          onClick={() => setThreatFilter(tier)}
                          className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded-[3px] transition-colors ${
                            threatFilter === tier
                              ? "bg-[#0038FF] text-[#FFFFFF]"
                              : "text-[#101010]/60 hover:text-[#101010]"
                          }`}
                        >
                          {tier}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Vector */}
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] text-[#101010]/60 uppercase font-semibold">
                      Vector:
                    </span>
                    <div className="flex items-center bg-[#FFFFFF] p-0.5 rounded-[4px] border border-[#E5E7EB]">
                      {["ALL", "email", "url", "message"].map((vec) => (
                        <button
                          key={vec}
                          type="button"
                          onClick={() => setTypeFilter(vec)}
                          className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded-[3px] transition-colors ${
                            typeFilter === vec
                              ? "bg-[#0038FF] text-[#FFFFFF]"
                              : "text-[#101010]/60 hover:text-[#101010]"
                          }`}
                        >
                          {vec}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-xs font-mono text-[#0038FF] hover:underline"
                  >
                    Reset filters
                  </button>
                )}
              </div>
            </div>

            {/* Audit Log Table */}
            {filteredAuditLogs.length === 0 ? (
              <div className="p-8 text-center bg-[#FAFAFA] rounded-[6px]">
                <p className="font-mono text-xs text-[#101010]/60">
                  No audit records match the selected search query and filter criteria.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-2 text-xs font-mono text-[#0038FF] hover:underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto border border-[#E5E7EB] rounded-[6px]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#E5E7EB] bg-[#F4F4F4]/70 font-mono text-[11px] text-[#101010]/60 uppercase tracking-wider">
                      <th scope="col" className="py-2.5 px-4 font-semibold">Record ID</th>
                      <th scope="col" className="py-2.5 px-4 font-semibold">Target / Subject</th>
                      <th scope="col" className="py-2.5 px-4 font-semibold">Vector</th>
                      <th scope="col" className="py-2.5 px-4 font-semibold">Classification</th>
                      <th scope="col" className="py-2.5 px-4 font-semibold">Score</th>
                      <th scope="col" className="py-2.5 px-4 font-semibold">Detected Tokens</th>
                      <th scope="col" className="py-2.5 px-4 font-semibold">Analyzed</th>
                      <th scope="col" className="py-2.5 px-4 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB] text-xs">
                    {filteredAuditLogs.map((item) => (
                      <tr key={item.id} className="hover:bg-[#F9FAFB] transition-colors">
                        <td className="py-3 px-4 font-mono text-[11px] text-[#0038FF] font-semibold">
                          {item.id.length > 12 ? `${item.id.substring(0, 8)}...` : item.id}
                        </td>
                        <td className="py-3 px-4 font-mono text-xs max-w-xs">
                          <div className="truncate">
                            <span className="font-semibold block truncate" title={item.subject || item.target}>
                              {item.subject || item.target}
                            </span>
                            {item.subject && (
                              <span className="text-[10px] text-[#101010]/50 block truncate">
                                Sender: {item.target}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] uppercase text-[#101010]/70">
                          {item.targetType}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={badgeMap[item.threatLevel]} size="sm">
                            {item.threatLevel}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold">
                          <span className={scoreColorMap[item.threatLevel]}>
                            {item.riskScore}
                          </span>
                          <span className="text-[#101010]/40 font-normal text-[10px]"> / 100</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] max-w-[180px]">
                          {item.detectedKeywords && item.detectedKeywords.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {item.detectedKeywords.slice(0, 2).map((kw, idx) => (
                                <span
                                  key={idx}
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
                            <span className="text-[#101010]/40">Clean</span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-[#101010]/60 whitespace-nowrap">
                          {item.formattedDate}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedScan(item)}
                            className="font-mono text-[11px] font-semibold text-[#0038FF] hover:underline"
                          >
                            Inspect →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SUSPICIOUS KEYWORD MANAGEMENT */}
      {/* ========================================================================= */}
      {activeTab === "keywords" && (
        <div className="space-y-6">
          {/* Header Advisory */}
          <div className="p-4 bg-[#FFFFFF] border-l-4 border-l-[#0038FF] border border-[#E5E7EB] rounded-[4px]">
            <span className="font-mono font-bold text-xs uppercase tracking-wider text-[#101010] block mb-1">
              Phishing Detection Signature Registry
            </span>
            <p className="text-xs text-[#101010]/75 leading-relaxed">
              Keywords registered in this database are dynamically checked across URL structures, email bodies, and mobile SMS content. Active rules contribute directly to threat scoring and indicator triggers.
            </p>
          </div>

          {/* Add Keyword Form */}
          <div className="p-6 bg-[#FFFFFF] border border-[#E5E7EB] rounded-[8px]">
            <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-[#101010] mb-4">
              Register New Suspicious Keyword
            </h2>

            {keywordNotice && (
              <div
                className={`p-3 rounded-[4px] font-mono text-xs mb-4 flex items-center gap-2 ${
                  keywordNotice.type === "success"
                    ? "bg-[#F0FDF4] border border-[#DCFCE7] text-[#0F766E]"
                    : "bg-[#FEF2F2] border border-[#FEE2E2] text-[#D92D20]"
                }`}
              >
                {keywordNotice.type === "success" ? (
                  <CheckIcon className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertTriangleIcon className="w-4 h-4 shrink-0" />
                )}
                <span>{keywordNotice.text}</span>
              </div>
            )}

            <form onSubmit={handleAddKeyword} className="flex flex-col md:flex-row gap-3 items-end">
              <div className="flex-1 w-full">
                <label className="font-mono text-xs text-[#101010]/70 font-semibold block mb-1">
                  Keyword / Phrase
                </label>
                <input
                  type="text"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="e.g. account locked, wire transfer, secure-login"
                  className="w-full px-3 py-2 bg-[#F4F4F4] border border-[#E5E7EB] rounded-[4px] font-mono text-xs text-[#101010] focus:outline-none focus:border-[#0038FF]"
                  required
                />
              </div>

              <div className="w-full md:w-44">
                <label className="font-mono text-xs text-[#101010]/70 font-semibold block mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as "url" | "email" | "message" | "universal")}
                  className="w-full px-3 py-2 bg-[#F4F4F4] border border-[#E5E7EB] rounded-[4px] font-mono text-xs text-[#101010] focus:outline-none focus:border-[#0038FF]"
                >
                  <option value="url">URL</option>
                  <option value="email">Email</option>
                  <option value="message">Message / SMS</option>
                  <option value="universal">Universal</option>
                </select>
              </div>

              <div className="w-full md:w-36">
                <label className="font-mono text-xs text-[#101010]/70 font-semibold block mb-1">
                  Severity
                </label>
                <select
                  value={newSeverity}
                  onChange={(e) => setNewSeverity(e.target.value as "low" | "medium" | "high")}
                  className="w-full px-3 py-2 bg-[#F4F4F4] border border-[#E5E7EB] rounded-[4px] font-mono text-xs text-[#101010] focus:outline-none focus:border-[#0038FF]"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isSubmittingKeyword || !newKeyword.trim()}
                className="w-full md:w-auto shrink-0"
              >
                {isSubmittingKeyword ? "Saving..." : "Add Keyword"}
              </Button>
            </form>
          </div>

          {/* Keyword Registry List */}
          <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[8px] p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E7EB]">
              <div>
                <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-[#101010]">
                  Active Keyword Engine Signatures
                </h3>
                <p className="text-xs text-[#101010]/60 mt-0.5">
                  Showing {filteredKeywords.length} of {keywords.length} total keyword rules
                </p>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-1.5 bg-[#F4F4F4] p-0.5 rounded-[4px] border border-[#E5E7EB]">
                {["ALL", "url", "email", "message", "universal"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setKeywordCategoryFilter(cat)}
                    className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded-[3px] transition-colors ${
                      keywordCategoryFilter === cat
                        ? "bg-[#0038FF] text-[#FFFFFF]"
                        : "text-[#101010]/60 hover:text-[#101010]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto border border-[#E5E7EB] rounded-[6px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F4F4F4]/70 font-mono text-[11px] text-[#101010]/60 uppercase tracking-wider">
                    <th scope="col" className="py-2.5 px-4 font-semibold">Keyword Token</th>
                    <th scope="col" className="py-2.5 px-4 font-semibold">Vector Category</th>
                    <th scope="col" className="py-2.5 px-4 font-semibold">Weight / Severity</th>
                    <th scope="col" className="py-2.5 px-4 font-semibold">Engine Status</th>
                    <th scope="col" className="py-2.5 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] text-xs">
                  {filteredKeywords.map((kw) => (
                    <tr key={kw.id} className="hover:bg-[#F9FAFB] transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-xs text-[#101010]">
                        {kw.keyword}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] uppercase text-[#101010]/70">
                        {kw.category}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-[3px] font-mono text-[10px] font-bold uppercase ${
                            kw.severity === "high"
                              ? "bg-[#FEF2F2] text-[#D92D20] border border-[#FEE2E2]"
                              : kw.severity === "medium"
                              ? "bg-[#FFFBEB] text-[#B45309] border border-[#FEF3C7]"
                              : "bg-[#F0FDF4] text-[#0F766E] border border-[#DCFCE7]"
                          }`}
                        >
                          {kw.severity}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px]">
                        {kw.is_active ? (
                          <span className="text-[#0F766E] font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0F766E]" /> ACTIVE
                          </span>
                        ) : (
                          <span className="text-[#101010]/40 font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#101010]/30" /> DISABLED
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleToggleKeyword(kw.id, kw.is_active)}
                          className="font-mono text-[11px] text-[#0038FF] hover:underline"
                        >
                          {kw.is_active ? "Disable" : "Enable"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteKeyword(kw.id)}
                          className="font-mono text-[11px] text-[#D92D20] hover:underline inline-flex items-center gap-0.5 ml-2"
                        >
                          <TrashIcon className="w-3 h-3" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: USER MANAGEMENT & ACCESS */}
      {/* ========================================================================= */}
      {activeTab === "users" && (
        <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[8px] p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E5E7EB]">
            <div>
              <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-[#101010]">
                Registered Platform Profiles
              </h3>
              <p className="text-xs text-[#101010]/60 mt-0.5">
                Profiles synchronized via Supabase Auth database trigger
              </p>
            </div>
            <span className="font-mono text-xs text-[#101010]/50">
              {users.length} Registered Accounts
            </span>
          </div>

          {isLoadingUsers ? (
            <div className="p-8 text-center font-mono text-xs text-[#101010]/50">
              Loading user directory...
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center bg-[#FAFAFA] rounded-[6px]">
              <p className="font-mono text-xs text-[#101010]/60">
                No user profiles recorded yet. Register an account to populate the user directory.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-[#E5E7EB] rounded-[6px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F4F4F4]/70 font-mono text-[11px] text-[#101010]/60 uppercase tracking-wider">
                    <th scope="col" className="py-2.5 px-4 font-semibold">User ID</th>
                    <th scope="col" className="py-2.5 px-4 font-semibold">Display Name</th>
                    <th scope="col" className="py-2.5 px-4 font-semibold">Role</th>
                    <th scope="col" className="py-2.5 px-4 font-semibold">Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] text-xs">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-[#F9FAFB] transition-colors">
                      <td className="py-3 px-4 font-mono text-[11px] text-[#0038FF]">
                        {u.id.substring(0, 8)}...{u.id.substring(u.id.length - 4)}
                      </td>
                      <td className="py-3 px-4 font-semibold text-xs text-[#101010]">
                        {u.full_name || "Unassigned"}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-[3px] font-mono text-[10px] font-bold uppercase ${
                            u.role === "admin"
                              ? "bg-[#0038FF]/10 text-[#0038FF] border border-[#0038FF]/20"
                              : "bg-[#F4F4F4] text-[#101010]/70 border border-[#E5E7EB]"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-[#101010]/60">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Forensic Inspection Modal */}
      {selectedScan && (
        <ReportDetailModal
          item={selectedScan}
          onClose={() => setSelectedScan(null)}
        />
      )}
    </div>
  );
}
