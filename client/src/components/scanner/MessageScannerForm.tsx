"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { SAMPLE_INPUTS } from "@/lib/mock-data";

interface MessageScannerFormProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClear?: () => void;
  isLoading: boolean;
  errorMessage?: string | null;
}

export function MessageScannerForm({
  value,
  onChange,
  onSubmit,
  onClear,
  isLoading,
  errorMessage,
}: MessageScannerFormProps) {
  const messageSamples = SAMPLE_INPUTS.filter((s) => s.type === "message");

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else {
      onChange("");
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className="p-6">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="message-input"
            className="block font-mono text-xs uppercase tracking-wider text-[#101010] font-semibold"
          >
            SMS / Direct Message Content
          </label>
          {value.trim() && (
            <button
              type="button"
              onClick={handleClear}
              disabled={isLoading}
              className="font-mono text-[11px] text-[#101010]/60 hover:text-[#D92D20] underline transition-colors"
            >
              Clear content
            </button>
          )}
        </div>
        <textarea
          id="message-input"
          required
          rows={5}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={isLoading}
          placeholder="Paste SMS text message, parcel alert, or social messaging communication..."
          className={`w-full p-3.5 bg-[#FFFFFF] border ${
            errorMessage ? "border-[#D92D20]" : "border-[#E5E7EB]"
          } rounded-[4px] font-mono text-xs text-[#101010] placeholder:text-[#101010]/40 focus:outline-none focus:border-[#0038FF] transition-colors resize-y leading-relaxed`}
        />
        {errorMessage && (
          <p className="mt-2 text-xs text-[#D92D20] font-mono flex items-center gap-1.5">
            <span aria-hidden="true">⚠</span>
            <span>{errorMessage}</span>
          </p>
        )}
      </div>

      {/* Preset Sample Chips */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="text-[10px] text-[#101010]/60 mr-1 font-mono uppercase font-bold">
          Sample Presets:
        </span>
        {messageSamples.map((sample) => (
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
          Checks: Smishing URLs, urgent demands &amp; verification prompts
        </div>
        <div className="flex items-center gap-2.5">
          {value.trim() && (
            <Button
              type="button"
              variant="secondary"
              size="md"
              disabled={isLoading}
              onClick={handleClear}
            >
              Reset
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isLoading || !value.trim()}
            icon={<ArrowRightIcon className="w-4 h-4" />}
          >
            {isLoading ? "ANALYZING MESSAGE..." : "ANALYZE MESSAGE"}
          </Button>
        </div>
      </div>
    </form>
  );
}
