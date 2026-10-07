"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon, SearchIcon } from "@/components/ui/Icons";
import { SAMPLE_INPUTS } from "@/lib/mock-data";

interface UrlScannerFormProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export function UrlScannerForm({
  value,
  onChange,
  onSubmit,
  isLoading,
}: UrlScannerFormProps) {
  const urlSamples = SAMPLE_INPUTS.filter((s) => s.type === "url");

  return (
    <form onSubmit={onSubmit} className="p-6">
      <div className="mb-4">
        <label
          htmlFor="url-input"
          className="block font-mono text-xs uppercase tracking-wider text-[#101010]/70 font-semibold mb-2"
        >
          Target Destination URL
        </label>
        <div className="relative flex items-center">
          <span className="absolute left-3.5 text-[#101010]/40 pointer-events-none" aria-hidden="true">
            <SearchIcon className="w-4 h-4" />
          </span>
          <input
            id="url-input"
            type="text"
            required
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={isLoading}
            placeholder="Paste suspicious URL (e.g., http://paypal-verify.xyz/auth)..."
            className="w-full pl-10 pr-4 py-3 bg-[#FFFFFF] border border-[#E5E7EB] rounded-[4px] font-mono text-sm text-[#101010] placeholder:text-[#101010]/40 focus:outline-none focus:border-[#0038FF] transition-colors"
          />
        </div>
      </div>

      {/* Preset Sample Chips */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="text-xs text-[#101010]/60 mr-1 font-mono uppercase text-[10px]">
          Sample Inputs:
        </span>
        {urlSamples.map((sample) => (
          <button
            key={sample.id}
            type="button"
            disabled={isLoading}
            onClick={() => onChange(sample.content)}
            className="text-[11px] font-mono px-2.5 py-1 bg-[#F4F4F4] hover:bg-[#FFFFFF] border border-[#E5E7EB] hover:border-[#0038FF] text-[#101010] rounded-[3px] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0038FF]"
          >
            {sample.label}
          </button>
        ))}
      </div>

      {/* Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#F4F4F4]">
        <div className="text-xs text-[#101010]/60 font-mono">
          Checks: HTTPS, keywords, domain structure &amp; reputation
        </div>
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={isLoading || !value.trim()}
          icon={<ArrowRightIcon className="w-4 h-4" />}
        >
          {isLoading ? "Evaluating Signals..." : "Analyze URL"}
        </Button>
      </div>
    </form>
  );
}
