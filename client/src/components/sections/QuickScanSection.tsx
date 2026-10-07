"use client";

import React, { useState } from "react";
import { ScannerTabs, ScannerMode } from "@/components/scanner/ScannerTabs";
import { UrlScannerForm } from "@/components/scanner/UrlScannerForm";
import { EmailScannerForm } from "@/components/scanner/EmailScannerForm";
import { MessageScannerForm } from "@/components/scanner/MessageScannerForm";
import { ScanResultCard } from "@/components/scanner/ScanResultCard";
import { analyzeScan } from "@/lib/scanner-service";
import { ScanResult } from "@/lib/mock-data";

export function QuickScanSection() {
  const [mode, setMode] = useState<ScannerMode>("url");
  const [urlValue, setUrlValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [messageValue, setMessageValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [analysisStage, setAnalysisStage] = useState<string>("");
  const [result, setResult] = useState<ScanResult | null>(null);

  const handleScanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    // Lightweight 3-step stage progression
    setAnalysisStage("INPUT RECEIVED");
    const stageTimer1 = setTimeout(() => {
      setAnalysisStage("SIGNALS ANALYZED");
    }, 250);

    const stageTimer2 = setTimeout(() => {
      setAnalysisStage("RISK ASSESSED");
    }, 500);

    try {
      const inputToScan =
        mode === "url" ? urlValue : mode === "email" ? emailValue : messageValue;
      const res = await analyzeScan(inputToScan, mode);
      setResult(res);
    } catch {
      // Graceful fallback
    } finally {
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      setIsLoading(false);
      setAnalysisStage("");
    }
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <section id="scanner" className="w-full py-20 bg-[#F4F4F4]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.06em] text-[#0038FF] block mb-2">
            Interactive Forensic Bench
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#101010] tracking-tight mb-3">
            Quick Scan Console
          </h2>
          <p className="text-sm sm:text-base text-[#101010]/75 leading-relaxed">
            Test a destination URL, raw email communication, or message text against documented phishing indicators. Sample presets are available below each input.
          </p>
        </div>

        {/* Central Workbench Card */}
        <div className="max-w-4xl mx-auto bg-[#FFFFFF] border border-[#E5E7EB] rounded-[8px] overflow-hidden">
          {/* Top Mode Selection */}
          <ScannerTabs
            activeMode={mode}
            onChange={(m) => {
              setMode(m);
              setResult(null);
            }}
            disabled={isLoading}
          />

          {/* Active Mode Form */}
          <div id={`panel-${mode}`} role="tabpanel" aria-labelledby={`tab-${mode}`}>
            {mode === "url" && (
              <UrlScannerForm
                value={urlValue}
                onChange={setUrlValue}
                onSubmit={handleScanSubmit}
                isLoading={isLoading}
              />
            )}
            {mode === "email" && (
              <EmailScannerForm
                value={emailValue}
                onChange={setEmailValue}
                onSubmit={handleScanSubmit}
                isLoading={isLoading}
              />
            )}
            {mode === "message" && (
              <MessageScannerForm
                value={messageValue}
                onChange={setMessageValue}
                onSubmit={handleScanSubmit}
                isLoading={isLoading}
              />
            )}
          </div>

          {/* Simulated Analysis Progress Bar */}
          {isLoading && (
            <div
              role="status"
              aria-live="polite"
              className="p-6 border-t border-[#E5E7EB] bg-[#F4F4F4]/50 flex flex-col items-center justify-center text-center"
            >
              <div className="w-full max-w-md bg-[#E5E7EB] h-1.5 rounded-full overflow-hidden mb-3">
                <div className="bg-[#0038FF] h-full w-2/3 animate-pulse transition-all duration-300" />
              </div>
              <span className="font-mono text-xs font-bold text-[#0038FF] uppercase tracking-wider">
                {analysisStage || "EVALUATING SUPPORTED SIGNALS..."}
              </span>
              <span className="text-[11px] text-[#101010]/60 mt-1">
                Parsing protocol, keyword frequency, and threat reputation rules
              </span>
            </div>
          )}

          {/* Scan Results Card */}
          {result && !isLoading && (
            <ScanResultCard result={result} onReset={handleReset} />
          )}
        </div>
      </div>
    </section>
  );
}
