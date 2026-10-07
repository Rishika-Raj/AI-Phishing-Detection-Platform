"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon, AlertCircleIcon, ShieldIcon } from "@/components/ui/Icons";

export function RegisterForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const validate = () => {
    const newErrors: {
      fullName?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    }

    if (!email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required.";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setNotice("Frontend Demonstration: Account creation prepared for backend integration. Initializing workspace session...");

    setTimeout(() => {
      router.push("/dashboard");
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4] flex flex-col justify-between">
      {/* Top Bar */}
      <header className="px-6 py-6 border-b border-[#E5E7EB] bg-[#F4F4F4]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xl font-bold tracking-tight text-[#101010] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0038FF]"
          >
            <span className="text-[#0038FF] font-black">NoBait</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#0038FF] mb-0.5" aria-hidden="true" />
          </Link>
          <Link
            href="/"
            className="text-xs font-bold uppercase tracking-[0.06em] text-[#101010] hover:text-[#0038FF] transition-colors"
          >
            ← Return to Overview
          </Link>
        </div>
      </header>

      {/* Main Content: Asymmetrical Split */}
      <main className="flex-1 flex items-center justify-center p-6 my-8">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Editorial Statement */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.08em] text-[#0038FF] block mb-3">
              Workspace Creation
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#101010] tracking-tight leading-[1.15] mb-6">
              Analyze suspicious links and messages from{" "}
              <span className="font-serif italic font-normal text-[#0038FF]">one</span> workspace.
            </h1>
            <p className="text-sm sm:text-base text-[#101010]/80 leading-relaxed mb-8">
              Establish your analyst profile to access the URL scanner, review previous scan history, and examine detailed indicator breakdowns.
            </p>

            <div className="p-4 bg-[#FFFFFF] border border-[#E5E7EB] rounded-[4px] flex items-start gap-3 w-full">
              <ShieldIcon className="w-5 h-5 text-[#0038FF] shrink-0 mt-0.5" />
              <div className="text-xs text-[#101010]/75 leading-relaxed">
                <strong className="text-[#101010] block font-semibold mb-0.5">
                  Direct Demonstration Access
                </strong>
                Credentials are validated purely on the client side for this demonstration milestone. No passwords are transmitted or stored.
              </div>
            </div>
          </div>

          {/* Right Column: Clean White Form Card */}
          <div className="lg:col-span-6 w-full">
            <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[8px] p-8 sm:p-10 shadow-none">
              <div className="mb-6 pb-4 border-b border-[#E5E7EB]">
                <h2 className="text-2xl font-bold text-[#101010] tracking-tight mb-1">
                  Create your account
                </h2>
                <p className="text-xs text-[#101010]/60">
                  Register your analyst credentials to begin inspection
                </p>
              </div>

              {notice && (
                <div className="mb-6 p-3 bg-[#EEF2FF] border border-[#C7D2FE] rounded-[4px] text-xs text-[#0038FF] font-mono leading-relaxed">
                  {notice}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block font-mono text-xs uppercase tracking-wider text-[#101010] font-semibold mb-1.5"
                  >
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
                    }}
                    placeholder="Alex Morgan"
                    className={`w-full px-4 py-2.5 bg-[#FFFFFF] border ${
                      errors.fullName ? "border-[#D92D20]" : "border-[#E5E7EB]"
                    } rounded-[4px] text-sm text-[#101010] placeholder:text-[#101010]/40 focus:outline-none focus:border-[#0038FF] transition-colors`}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-[#D92D20] flex items-center gap-1 font-mono">
                      <AlertCircleIcon className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.fullName}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block font-mono text-xs uppercase tracking-wider text-[#101010] font-semibold mb-1.5"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    placeholder="analyst@example.com"
                    className={`w-full px-4 py-2.5 bg-[#FFFFFF] border ${
                      errors.email ? "border-[#D92D20]" : "border-[#E5E7EB]"
                    } rounded-[4px] text-sm text-[#101010] placeholder:text-[#101010]/40 focus:outline-none focus:border-[#0038FF] transition-colors`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-[#D92D20] flex items-center gap-1 font-mono">
                      <AlertCircleIcon className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="password"
                      className="block font-mono text-xs uppercase tracking-wider text-[#101010] font-semibold"
                    >
                      Password
                    </label>
                    <span className="text-[11px] text-[#101010]/50 font-mono">
                      Min 6 characters
                    </span>
                  </div>
                  <input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    placeholder="••••••••"
                    className={`w-full px-4 py-2.5 bg-[#FFFFFF] border ${
                      errors.password ? "border-[#D92D20]" : "border-[#E5E7EB]"
                    } rounded-[4px] text-sm text-[#101010] placeholder:text-[#101010]/40 focus:outline-none focus:border-[#0038FF] transition-colors`}
                  />
                  {errors.password && (
                    <p className="mt-1 text-xs text-[#D92D20] flex items-center gap-1 font-mono">
                      <AlertCircleIcon className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.password}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block font-mono text-xs uppercase tracking-wider text-[#101010] font-semibold mb-1.5"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword)
                        setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                    }}
                    placeholder="••••••••"
                    className={`w-full px-4 py-2.5 bg-[#FFFFFF] border ${
                      errors.confirmPassword ? "border-[#D92D20]" : "border-[#E5E7EB]"
                    } rounded-[4px] text-sm text-[#101010] placeholder:text-[#101010]/40 focus:outline-none focus:border-[#0038FF] transition-colors`}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-[#D92D20] flex items-center gap-1 font-mono">
                      <AlertCircleIcon className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.confirmPassword}</span>
                    </p>
                  )}
                </div>

                <div className="pt-3">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="w-full"
                    disabled={isSubmitting}
                    icon={<ArrowRightIcon className="w-4 h-4" />}
                  >
                    {isSubmitting ? "Creating Workspace..." : "Create Account"}
                  </Button>
                </div>
              </form>

              <div className="mt-6 pt-5 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                <span className="text-[#101010]/70">Already have an account?</span>
                <Link
                  href="/login"
                  className="font-bold text-[#0038FF] hover:underline uppercase tracking-wider text-[11px]"
                >
                  Sign In →
                </Link>
              </div>

              {/* Demo Shortcut */}
              <div className="mt-3 pt-3 border-t border-[#F4F4F4] text-center">
                <Link
                  href="/dashboard"
                  className="font-mono text-xs text-[#101010]/60 hover:text-[#0038FF] underline"
                >
                  Skip to Demo Workspace without registering →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Colophon */}
      <footer className="px-6 py-6 border-t border-[#E5E7EB] bg-[#F4F4F4] text-center text-xs text-[#101010]/50 font-mono">
        NoBait Phishing Detection Platform · Frontend Demonstration Registration
      </footer>
    </div>
  );
}
