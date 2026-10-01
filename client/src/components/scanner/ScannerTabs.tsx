"use client";

import React from "react";
import { LinkIcon, MailIcon, MessageIcon } from "@/components/ui/Icons";

export type ScannerMode = "url" | "email" | "message";

interface ScannerTabsProps {
  activeMode: ScannerMode;
  onChange: (mode: ScannerMode) => void;
  disabled?: boolean;
}

export function ScannerTabs({ activeMode, onChange, disabled }: ScannerTabsProps) {
  const tabs: { id: ScannerMode; label: string; icon: React.ReactNode }[] = [
    { id: "url", label: "URL Scanner", icon: <LinkIcon className="w-3.5 h-3.5" /> },
    { id: "email", label: "Email Analyzer", icon: <MailIcon className="w-3.5 h-3.5" /> },
    { id: "message", label: "Message Checker", icon: <MessageIcon className="w-3.5 h-3.5" /> },
  ];

  return (
    <div
      role="tablist"
      aria-label="Threat Scanner Selection"
      className="flex flex-wrap sm:flex-nowrap border-b border-[#E5E7EB] bg-[#F4F4F4]/60 p-1.5 gap-1.5 rounded-t-[8px]"
    >
      {tabs.map((tab) => {
        const isActive = activeMode === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            disabled={disabled}
            onClick={() => onChange(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold uppercase tracking-[0.06em] rounded-[4px] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0038FF] ${
              isActive
                ? "bg-[#FFFFFF] text-[#101010] border border-[#E5E7EB] shadow-none"
                : "bg-transparent text-[#101010]/60 hover:text-[#101010] hover:bg-[#FFFFFF]/50"
            }`}
          >
            <span className={isActive ? "text-[#0038FF]" : "text-[#101010]/50"}>
              {tab.icon}
            </span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
