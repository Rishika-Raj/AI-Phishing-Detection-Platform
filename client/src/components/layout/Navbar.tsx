"use client";

import React, { useState } from "react";
import Link from "next/link";
import { NAV_LINKS } from "@/lib/constants";
import { MenuIcon, CloseIcon, ArrowRightIcon } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-[#F4F4F4]/95 backdrop-blur-sm border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          {/* Logo / Brand */}
          <a
            href="#hero"
            className="flex items-center gap-1.5 text-xl font-bold tracking-tight text-[#101010] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0038FF] focus-visible:ring-offset-2"
          >
            <span className="text-[#0038FF] font-black">NoBait</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#0038FF] mb-0.5" aria-hidden="true" />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs font-bold uppercase tracking-[0.06em] text-[#101010] hover:text-[#0038FF] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0038FF] rounded-[2px]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Utility CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-xs font-bold uppercase tracking-[0.06em] text-[#101010] hover:text-[#0038FF] transition-colors duration-150 px-2 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0038FF] rounded-[2px]"
            >
              Login
            </Link>
            <Button
              href="/register"
              variant="primary"
              size="sm"
              icon={<ArrowRightIcon className="w-3.5 h-3.5" />}
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#101010] hover:text-[#0038FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0038FF] rounded-[4px]"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {mobileMenuOpen ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[#E5E7EB] bg-[#FFFFFF] px-6 py-6 transition-all duration-200">
            <nav className="flex flex-col gap-4" aria-label="Mobile Navigation">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-bold uppercase tracking-[0.06em] text-[#101010] hover:text-[#0038FF] py-2 border-b border-[#F4F4F4]"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-3 pt-4">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-xs font-bold uppercase tracking-[0.06em] text-[#101010] hover:text-[#0038FF] py-2.5 border border-[#E5E7EB] rounded-[4px]"
                >
                  Login
                </Link>
                <Button
                  href="/register"
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
