"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { SAMPLE_INPUTS } from "@/lib/mock-data";

interface EmailScannerFormProps {
  value: string;
  onChange: (val: string) => void;
  subject?: string;
  onSubjectChange?: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClear?: () => void;
  isLoading: boolean;
  errorMessage?: string | null;
}

export function EmailScannerForm({
  value,
  onChange,
  subject = "",
  onSubjectChange,
  onSubmit,
  onClear,
  isLoading,
  errorMessage,
}: EmailScannerFormProps) {
  const emailSamples = SAMPLE_INPUTS.filter((s) => s.type === "email");

  const handleSelectSample = (sample: typeof emailSamples[0]) => {
    onChange(sample.content);
    if (sample.subject && onSubjectChange) {
      onSubjectChange(sample.subject);
    }
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else {
      onChange("");
      if (onSubjectChange) onSubjectChange("");
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className="p-6">
      {/* Optional Subject Field */}
      {onSubjectChange && (
        <div className="mb-4">
          <label
            htmlFor="email-subject-input"
            className="block font-mono text-xs uppercase tracking-wider text-[#101010] font-semibold mb-2"
          >
            Email Subject Line <span className="text-[#101010]/50 font-normal lowercase">(optional)</span>
          </label>
          <input
            id="email-subject-input"
            type="text"
            value={subject}
            onChange={(e) => onSubjectChange(e.target.value)}
            disabled={isLoading}
            placeholder="e.g. URGENT: Action required on your corporate credentials"
            className="w-full px-3.5 py-2.5 bg-[#FFFFFF] border border-[#E5E7EB] rounded-[4px] font-mono text-xs text-[#101010] placeholder:text-[#101010]/40 focus:outline-none focus:border-[#0038FF] transition-colors"
          />
        </div>
      )}

      {/* Raw Body / Headers Textarea */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="email-input"
            className="block font-mono text-xs uppercase tracking-wider text-[#101010] font-semibold"
          >
            Raw Email Content, Headers, or Message Body
          </label>
          {(value.trim() || subject.trim()) && (
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
          id="email-input"
          required
          rows={7}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={isLoading}
          placeholder="Paste full raw email headers, message body, or suspicious notification text..."
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
        {emailSamples.map((sample) => (
          <button
            key={sample.id}
            type="button"
            disabled={isLoading}
            onClick={() => handleSelectSample(sample)}
            className="text-[11px] font-mono px-2.5 py-1 bg-[#F4F4F4] hover:bg-[#FFFFFF] border border-[#E5E7EB] hover:border-[#0038FF] text-[#101010] rounded-[3px] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0038FF]"
          >
            {sample.label}
          </button>
        ))}
      </div>

      {/* Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#F4F4F4]">
        <div className="text-xs text-[#101010]/60 font-mono">
          Evaluates urgency syntax, credential harvest links &amp; deceptive phrasing
        </div>
        <div className="flex items-center gap-2.5">
          {(value.trim() || subject.trim()) && (
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
            {isLoading ? "ANALYZING EMAIL..." : "ANALYZE EMAIL"}
          </Button>
        </div>
      </div>
    </form>
  );
}
