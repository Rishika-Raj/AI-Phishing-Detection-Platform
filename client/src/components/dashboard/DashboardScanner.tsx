"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon, SearchIcon, AlertCircleIcon, ShieldIcon } from "@/components/ui/Icons";
import { SAMPLE_INPUTS, ScanResult } from "@/lib/mock-data";
import { analyzeScan } from "@/lib/scanner-service";
import { ScanResultCard } from "@/components/scanner/ScanResultCard";

interface DashboardScannerProps {
  onScanComplete: (newResult: ScanResult) => void;
}

export function DashboardScanner({ onScanComplete }: DashboardScannerProps) {
  const [urlInput, setUrlInput] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisStage, setAnalysisStage] = useState<string>("");
  const [currentResult, setCurrentResult] = useState<ScanResult | null>(null);

  const urlSamples = SAMPLE_INPUTS.filter((s) => s.type === "url");

  const validateUrl = (url: string): boolean => {
    const trimmed = url.trim();
    if (!trimmed) {
      setErrorMessage("Enter a URL before scanning.");
      return false;
    }

    // Basic URL pattern verification (allows http, https, or domain.tld format)
    const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/i;
    if (!urlPattern.test(trimmed)) {
      setErrorMessage("Please enter a valid URL (e.g., https://example.com or http://domain.xyz).");
      return false;
    }

    setErrorMessage(null);
    return true;
  };

  const handleScanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateUrl(urlInput)) return;

    setIsLoading(true);
    setErrorMessage(null);
    setCurrentResult(null);

    // Staged progress ticker
    setAnalysisStage("INPUT RECEIVED");
    const stageTimer1 = setTimeout(() => {
      setAnalysisStage("SIGNALS ANALYZED");
    }, 250);

    const stageTimer2 = setTimeout(() => {
      setAnalysisStage("RISK ASSESSED");
    }, 500);

    try {
      const result = await analyzeScan(urlInput, "url");
      setCurrentResult(result);
      onScanComplete(result);
    } catch {
      setErrorMessage("We couldn't analyze this URL. Please check the address and try again.");
    } finally {
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      setIsLoading(false);
      setAnalysisStage("");
    }
  };

  const handleReset = () => {
    setCurrentResult(null);
    setUrlInput("");
    setErrorMessage(null);
  };

  return (
    <div id="scanner" className="mb-12">
      <div className="mb-4">
        <span className="font-mono text-xs font-bold uppercase tracking-[0.06em] text-[#0038FF] block mb-1">
          Inspection Engine
        </span>
        <h2 className="text-2xl font-bold text-[#101010] tracking-tight">
          URL Threat Scanner
        </h2>
      </div>

      <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[8px] overflow-hidden">
        {/* Scanner Form */}
        <form onSubmit={handleScanSubmit} noValidate className="p-6">
          <div className="mb-4">
            <label
              htmlFor="dashboard-url-input"
              className="block font-mono text-xs uppercase tracking-wider text-[#101010] font-semibold mb-2"
            >
              Destination URL to Inspect
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-[#101010]/40 pointer-events-none" aria-hidden="true">
                <SearchIcon className="w-4 h-4" />
              </span>
              <input
                id="dashboard-url-input"
                type="text"
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                disabled={isLoading}
                placeholder="https://secure-portal.example.com/login"
                className={`w-full pl-10 pr-4 py-3 bg-[#FFFFFF] border ${
                  errorMessage ? "border-[#D92D20]" : "border-[#E5E7EB]"
                } rounded-[4px] font-mono text-sm text-[#101010] placeholder:text-[#101010]/40 focus:outline-none focus:border-[#0038FF] transition-colors`}
              />
            </div>
            {errorMessage && (
              <p className="mt-2 text-xs text-[#D92D20] flex items-center gap-1.5 font-mono">
                <AlertCircleIcon className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </p>
            )}
          </div>

          {/* Sample Preset Chips */}
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-[10px] text-[#101010]/60 mr-1 font-mono uppercase font-bold">
              Test Presets:
            </span>
            {urlSamples.map((sample) => (
              <button
                key={sample.id}
                type="button"
                disabled={isLoading}
                onClick={() => {
                  setUrlInput(sample.content);
                  if (errorMessage) setErrorMessage(null);
                }}
                className="text-[11px] font-mono px-2.5 py-1 bg-[#F4F4F4] hover:bg-[#FFFFFF] border border-[#E5E7EB] hover:border-[#0038FF] text-[#101010] rounded-[3px] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0038FF]"
              >
                {sample.label}
              </button>
            ))}
          </div>

          {/* Submit Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#F4F4F4]">
            <div className="text-xs text-[#101010]/60 font-mono">
              Evaluates HTTPS, deceptive keywords, domain tokens &amp; reputation signatures
            </div>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isLoading || !urlInput.trim()}
              icon={<ArrowRightIcon className="w-4 h-4" />}
            >
              {isLoading ? "ANALYZING TARGET..." : "SCAN URL"}
            </Button>
          </div>
        </form>

        {/* Loading Telemetry State */}
        {isLoading && (
          <div
            role="status"
            aria-live="polite"
            className="p-8 border-t border-[#E5E7EB] bg-[#F4F4F4]/50 flex flex-col items-center justify-center text-center"
          >
            <div className="w-full max-w-md bg-[#E5E7EB] h-1.5 rounded-full overflow-hidden mb-3">
              <div className="bg-[#0038FF] h-full w-2/3 animate-pulse transition-all duration-300" />
            </div>
            <span className="font-mono text-xs font-bold text-[#0038FF] uppercase tracking-wider">
              {analysisStage || "EVALUATING SUPPORTED SIGNALS..."}
            </span>
            <span className="text-[11px] text-[#101010]/60 mt-1 font-mono">
              Examining structural protocol, keyword frequency, and threat reputation rules
            </span>
          </div>
        )}

        {/* Success State: Reusable ScanResultCard */}
        {currentResult && !isLoading && (
          <ScanResultCard result={currentResult} onReset={handleReset} />
        )}

        {/* Empty State: Displayed when no scan has been performed yet */}
        {!currentResult && !isLoading && (
          <div className="p-8 border-t border-[#E5E7EB] bg-[#FAFAFA] text-center flex flex-col items-center justify-center">
            <span className="p-2 bg-[#F4F4F4] border border-[#E5E7EB] rounded-full text-[#101010]/40 mb-3" aria-hidden="true">
              <ShieldIcon className="w-5 h-5" />
            </span>
            <span className="font-mono text-xs font-bold text-[#101010] uppercase tracking-wider mb-1">
              No Active Scan
            </span>
            <p className="text-xs text-[#101010]/60 max-w-sm leading-relaxed">
              Submit a target destination URL above or choose a test preset to generate a full forensic indicator report.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
