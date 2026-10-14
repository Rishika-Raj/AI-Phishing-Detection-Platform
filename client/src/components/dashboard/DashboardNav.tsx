"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserIcon, MenuIcon, CloseIcon } from "@/components/ui/Icons";
import { Badge } from "@/components/ui/Badge";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export function DashboardNav() {
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    // Load current session
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      setUser(user);
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        setIsAdmin(profile?.role === "admin");
      }
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();
        setIsAdmin(profile?.role === "admin");
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Analyst";

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
          <Link
            href="/dashboard"
            className="text-xs font-bold uppercase tracking-[0.06em] text-[#101010] hover:text-[#0038FF] transition-colors py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0038FF]"
          >
            Workspace
          </Link>
          <a
            href="/dashboard#scanner"
            className="text-xs font-bold uppercase tracking-[0.06em] text-[#101010] hover:text-[#0038FF] transition-colors py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0038FF]"
          >
            Scanner
          </a>
          <Link
            href="/reports"
            className="text-xs font-bold uppercase tracking-[0.06em] text-[#101010] hover:text-[#0038FF] transition-colors py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0038FF]"
          >
            Reports
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="text-xs font-bold uppercase tracking-[0.06em] text-[#101010] hover:text-[#0038FF] transition-colors py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0038FF]"
            >
              Admin
            </Link>
          )}
        </nav>

        {/* Right: User Session & Actions */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F4F4F4] border border-[#E5E7EB] rounded-[4px] font-mono text-xs text-[#101010]">
            <UserIcon className="w-3.5 h-3.5 text-[#0038FF]" />
            <span className="font-semibold truncate max-w-[120px]">{displayName}</span>
          </div>
          <Link
            href="/"
            className="text-xs font-bold uppercase tracking-[0.06em] text-[#101010]/70 hover:text-[#0038FF] transition-colors"
          >
            Public Site
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="text-xs font-bold uppercase tracking-[0.06em] text-[#D92D20] hover:underline disabled:opacity-50"
          >
            {signingOut ? "Signing Out..." : "Sign Out"}
          </button>
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
            <span className="truncate">{displayName}</span>
          </div>
          <nav className="flex flex-col gap-2 pt-1" aria-label="Mobile Navigation">
            <Link
              href="/dashboard"
              onClick={() => setMobileNavOpen(false)}
              className="text-xs font-bold uppercase tracking-[0.06em] text-[#101010] py-2 border-b border-[#F4F4F4]"
            >
              Workspace
            </Link>
            <a
              href="/dashboard#scanner"
              onClick={() => setMobileNavOpen(false)}
              className="text-xs font-bold uppercase tracking-[0.06em] text-[#101010] py-2 border-b border-[#F4F4F4]"
            >
              Scanner
            </a>
            <Link
              href="/reports"
              onClick={() => setMobileNavOpen(false)}
              className="text-xs font-bold uppercase tracking-[0.06em] text-[#101010] py-2 border-b border-[#F4F4F4]"
            >
              Reports
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileNavOpen(false)}
                className="text-xs font-bold uppercase tracking-[0.06em] text-[#101010] py-2 border-b border-[#F4F4F4]"
              >
                Admin Dashboard
              </Link>
            )}
            <div className="flex items-center justify-between pt-3">
              <Link
                href="/"
                className="text-xs font-bold uppercase tracking-[0.06em] text-[#101010]/70"
              >
                Public Site
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="text-xs font-bold uppercase tracking-[0.06em] text-[#D92D20] disabled:opacity-50"
              >
                {signingOut ? "Signing Out..." : "Sign Out"}
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
