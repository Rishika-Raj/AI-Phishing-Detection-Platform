"use client";

import React, { useState } from "react";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { OverviewStats } from "@/components/dashboard/OverviewStats";
import { DashboardScanner } from "@/components/dashboard/DashboardScanner";
import { ScanHistory } from "@/components/dashboard/ScanHistory";
import { ReportDetailModal } from "@/components/reports/ReportDetailModal";
import { useScanHistory } from "@/lib/scan-history-store";
import { ScanResult } from "@/lib/mock-data";
import { HistoryItem } from "@/lib/mock-history";

export function DashboardShell() {
  const { history, addScan, clearHistory, restoreHistory } = useScanHistory();
  const [selectedScan, setSelectedScan] = useState<HistoryItem | ScanResult | null>(null);

  // Dynamically computed overview metrics from active session history
  const totalScans = history.length;
  const safeScans = history.filter((item) => item.threatLevel === "SAFE").length;
  const suspiciousScans = history.filter(
    (item) => item.threatLevel === "SUSPICIOUS" || item.threatLevel === "CRITICAL"
  ).length;

  const handleNewScan = (newResult: ScanResult) => {
    addScan(newResult);
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4] flex flex-col justify-between text-[#101010]">
      {/* Product Navigation */}
      <DashboardNav />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10">
        {/* Workspace Title & Intro */}
        <div className="mb-10 pb-6 border-b border-[#E5E7EB]">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.08em] text-[#0038FF] block mb-2">
            NoBait Security Console
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#101010] mb-2">
            Threat Analysis Workspace
          </h1>
          <p className="text-sm text-[#101010]/75 max-w-2xl leading-relaxed">
            Execute real-time destination scans, analyze suspicious email communications &amp; message syntax, review detected threat indicators, and audit previous forensic findings.
          </p>
        </div>

        {/* 1. Overview Telemetry Cards */}
        <OverviewStats
          totalScans={totalScans}
          safeScans={safeScans}
          suspiciousScans={suspiciousScans}
        />

        {/* 2. Interactive Multi-Vector Threat Scanner */}
        <DashboardScanner
          onScanComplete={handleNewScan}
          onInspectScan={(scan) => setSelectedScan(scan)}
        />

        {/* 3. Session Scan History with Search, Filter & Inspect */}
        <ScanHistory
          history={history}
          onClearHistory={clearHistory}
          onRestoreHistory={restoreHistory}
          onSelectScan={(item) => setSelectedScan(item)}
        />
      </main>

      {/* Inspection Modal */}
      {selectedScan && (
        <ReportDetailModal
          item={selectedScan}
          onClose={() => setSelectedScan(null)}
        />
      )}

      {/* Product Footer */}
      <footer className="w-full bg-[#FFFFFF] border-t border-[#E5E7EB] py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[#101010]/60">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0038FF]" aria-hidden="true" />
            <span>NoBait Threat Platform · Version 1.0 (Demo Session)</span>
          </div>
          <div>
            <span>Heuristic Engine: Operational · Session Memory Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
