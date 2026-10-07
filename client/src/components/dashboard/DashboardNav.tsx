"use client";

import React, { useState } from "react";
import Link from "next/link";
import { UserIcon, MenuIcon, CloseIcon } from "@/components/ui/Icons";
import { Badge } from "@/components/ui/Badge";

export function DashboardNav() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FFFFFF] border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
        {/* Left: Brand & Workspace Identifier */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xl font-bold tracking-tight text-[#101010] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0038FF]"
          >
            <span className="text-[#0038FF] font-black">NoBait</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#0038FF] mb-0.5" aria-hidden="true" />
          </Link>
          <span className="text-[#E5E7EB]" aria-hidden="true">|</span>
          <Badge variant="neutral" size="sm" className="hidden sm:inline-flex">
            Analyst Workspace
          </Badge>
        </div>

        {/* Center: Internal Dashboard Links */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Dashboard Navigation">
          <a
            href="#overview"
            className="text-xs font-bold uppercase tracking-[0.06em] text-[#101010] hover:text-[#0038FF] transition-colors py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0038FF]"
          >
            Overview
          </a>
          <a
            href="#scanner"
            className="text-xs font-bold uppercase tracking-[0.06em] text-[#101010] hover:text-[#0038FF] transition-colors py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0038FF]"
          >
            URL Scanner
          </a>
          <a
            href="#history"
            className="text-xs font-bold uppercase tracking-[0.06em] text-[#101010] hover:text-[#0038FF] transition-colors py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0038FF]"
          >
            Scan History
          </a>
        </nav>

        {/* Right: User Demarcation & Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F4F4F4] border border-[#E5E7EB] rounded-[4px] font-mono text-xs text-[#101010]">
            <UserIcon className="w-3.5 h-3.5 text-[#0038FF]" />
            <span className="font-semibold">Analyst Demo</span>
          </div>
          <Link
            href="/"
            className="text-xs font-bold uppercase tracking-[0.06em] text-[#101010]/70 hover:text-[#0038FF] transition-colors"
          >
            Public Site
          </Link>
          <Link
            href="/login"
            className="text-xs font-bold uppercase tracking-[0.06em] text-[#D92D20] hover:underline"
          >
            Sign Out
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="md:hidden p-2 text-[#101010] hover:text-[#0038FF]"
          aria-expanded={mobileNavOpen}
          aria-label="Toggle dashboard navigation"
        >
          {mobileNavOpen ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileNavOpen && (
        <div className="md:hidden border-b border-[#E5E7EB] bg-[#FFFFFF] px-6 py-4 space-y-3">
          <div className="flex items-center gap-2 py-2 border-b border-[#F4F4F4] font-mono text-xs text-[#101010]">
            <UserIcon className="w-4 h-4 text-[#0038FF]" />
            <span>Active Session: Analyst Demo</span>
          </div>
          <nav className="flex flex-col gap-2 pt-1" aria-label="Mobile Navigation">
            <a
              href="#overview"
              onClick={() => setMobileNavOpen(false)}
              className="text-xs font-bold uppercase tracking-[0.06em] text-[#101010] py-2 border-b border-[#F4F4F4]"
            >
              Overview
            </a>
            <a
              href="#scanner"
              onClick={() => setMobileNavOpen(false)}
              className="text-xs font-bold uppercase tracking-[0.06em] text-[#101010] py-2 border-b border-[#F4F4F4]"
            >
              URL Scanner
            </a>
            <a
              href="#history"
              onClick={() => setMobileNavOpen(false)}
              className="text-xs font-bold uppercase tracking-[0.06em] text-[#101010] py-2 border-b border-[#F4F4F4]"
            >
              Scan History
            </a>
            <div className="flex items-center justify-between pt-3">
              <Link
                href="/"
                className="text-xs font-bold uppercase tracking-[0.06em] text-[#101010]/70"
              >
                Public Site
              </Link>
              <Link
                href="/login"
                className="text-xs font-bold uppercase tracking-[0.06em] text-[#D92D20]"
              >
                Sign Out
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
