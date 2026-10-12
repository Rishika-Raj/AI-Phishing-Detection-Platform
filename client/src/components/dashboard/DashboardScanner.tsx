"use client";

import React, { useState } from "react";
import { ScanResult } from "@/lib/mock-data";
import { analyzeScan } from "@/lib/scanner-service";
import { ScanResultCard } from "@/components/scanner/ScanResultCard";
import { ScannerTabs, ScannerMode } from "@/components/scanner/ScannerTabs";
import { UrlScannerForm } from "@/components/scanner/UrlScannerForm";
import { EmailScannerForm } from "@/components/scanner/EmailScannerForm";
import { MessageScannerForm } from "@/components/scanner/MessageScannerForm";
import { ShieldIcon } from "@/components/ui/Icons";

interface DashboardScannerProps {
  onScanComplete: (newResult: ScanResult) => void;
  onInspectScan?: (result: ScanResult) => void;
}

export function DashboardScanner({ onScanComplete, onInspectScan }: DashboardScannerProps) {
  const [mode, setMode] = useState<ScannerMode>("url");
  const [urlInput, setUrlInput] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisStage, setAnalysisStage] = useState<string>("");
  const [currentResult, setCurrentResult] = useState<ScanResult | null>(null);

  const validateUrl = (url: string): boolean => {
    const trimmed = url.trim();
    if (!trimmed) {
      setErrorMessage("Enter a destination URL before scanning.");
      return false;
    }
    const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/i;
    if (!urlPattern.test(trimmed)) {
      setErrorMessage("Please enter a valid URL (e.g., https://example.com or http://domain.xyz).");
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const validateEmail = (): boolean => {
    const trimmed = emailInput.trim();
    if (!trimmed) {
      setErrorMessage("Please paste or type raw email content before analyzing.");
      return false;
    }
    if (trimmed.length < 10) {
      setErrorMessage("Email content is too short for meaningful forensic evaluation.");
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const validateMessage = (): boolean => {
    const trimmed = messageInput.trim();
    if (!trimmed) {
      setErrorMessage("Please enter SMS or message content to inspect.");
      return false;
    }
    if (trimmed.length < 5) {
      setErrorMessage("Message is too brief to analyze.");
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const handleScanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "url" && !validateUrl(urlInput)) return;
    if (mode === "email" && !validateEmail()) return;
    if (mode === "message" && !validateMessage()) return;

    setIsLoading(true);
    setErrorMessage(null);
    setCurrentResult(null);

    // Staged progress indicators
    setAnalysisStage("INPUT RECEIVED");
    const stageTimer1 = setTimeout(() => {
      setAnalysisStage("PARSING PHISHING SIGNALS...");
    }, 200);

    const stageTimer2 = setTimeout(() => {
      setAnalysisStage("CALCULATING RISK & THREAT TIER...");
    }, 450);

    try {
      let content = urlInput;
      let options: { subject?: string } | undefined;

      if (mode === "email") {
        content = emailInput;
        options = { subject: emailSubject };
      } else if (mode === "message") {
        content = messageInput;
      }

      const result = await analyzeScan(content, mode, options);
      setCurrentResult(result);
      onScanComplete(result);
    } catch {
      setErrorMessage("We couldn't analyze this content. Please verify your input and try again.");
    } finally {
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      setIsLoading(false);
      setAnalysisStage("");
    }
  };

  const handleReset = () => {
    setCurrentResult(null);
    setErrorMessage(null);
  };

  const handleModeChange = (newMode: ScannerMode) => {
    setMode(newMode);
    setErrorMessage(null);
    setCurrentResult(null);
  };

  const getEngineHeadline = () => {
    switch (mode) {
      case "email":
        return "Email Phishing Analyzer";
      case "message":
        return "Direct Message & Smishing Checker";
      default:
        return "URL Threat Scanner";
    }
  };

  return (
    <div id="scanner" className="mb-12">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-[0.06em] text-[#0038FF] block mb-1">
            Forensic Inspection Engine
          </span>
          <h2 className="text-2xl font-bold text-[#101010] tracking-tight">
            {getEngineHeadline()}
          </h2>
        </div>
        <span className="font-mono text-[11px] text-[#101010]/60">
          Deterministic Rule Engine · Multi-Vector
        </span>
      </div>

      <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[8px] overflow-hidden">
        {/* Multi-Vector Mode Switcher */}
        <ScannerTabs
          activeMode={mode}
          onChange={handleModeChange}
          disabled={isLoading}
        />

        {/* Dynamic Mode Form */}
        <div id={`panel-${mode}`} role="tabpanel" aria-labelledby={`tab-${mode}`}>
          {mode === "url" && (
            <UrlScannerForm
              value={urlInput}
              onChange={(val) => {
                setUrlInput(val);
                if (errorMessage) setErrorMessage(null);
              }}
              onSubmit={handleScanSubmit}
              isLoading={isLoading}
            />
          )}

          {mode === "email" && (
            <EmailScannerForm
              value={emailInput}
              onChange={(val) => {
                setEmailInput(val);
                if (errorMessage) setErrorMessage(null);
              }}
              subject={emailSubject}
              onSubjectChange={(subj) => setEmailSubject(subj)}
              onSubmit={handleScanSubmit}
              onClear={() => {
                setEmailInput("");
                setEmailSubject("");
                setErrorMessage(null);
              }}
              errorMessage={errorMessage}
              isLoading={isLoading}
            />
          )}

          {mode === "message" && (
            <MessageScannerForm
              value={messageInput}
              onChange={(val) => {
                setMessageInput(val);
                if (errorMessage) setErrorMessage(null);
              }}
              onSubmit={handleScanSubmit}
              onClear={() => {
                setMessageInput("");
                setErrorMessage(null);
              }}
              errorMessage={errorMessage}
              isLoading={isLoading}
            />
          )}
        </div>

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
              Parsing protocol syntax, coercive keyword frequency, and threat signatures
            </span>
          </div>
        )}

        {/* Success State: Reusable ScanResultCard */}
        {currentResult && !isLoading && (
          <ScanResultCard
            result={currentResult}
            onReset={handleReset}
            onInspect={onInspectScan ? () => onInspectScan(currentResult) : undefined}
          />
        )}

        {/* Empty State: Displayed when no scan has been performed yet */}
        {!currentResult && !isLoading && (
          <div className="p-8 border-t border-[#E5E7EB] bg-[#FAFAFA] text-center flex flex-col items-center justify-center">
            <span className="p-2 bg-[#F4F4F4] border border-[#E5E7EB] rounded-full text-[#101010]/40 mb-3" aria-hidden="true">
              <ShieldIcon className="w-5 h-5" />
            </span>
            <span className="font-mono text-xs font-bold text-[#101010] uppercase tracking-wider mb-1">
              Ready for Analysis
            </span>
            <p className="text-xs text-[#101010]/60 max-w-md leading-relaxed">
              Submit a target {mode === "url" ? "destination URL" : mode === "email" ? "email body or headers" : "message or SMS text"} above or select a sample preset to compute risk scores and threat indicators.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
