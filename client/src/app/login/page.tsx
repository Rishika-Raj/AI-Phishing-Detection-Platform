import { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In | NoBait Phishing Detection Platform",
  description: "Sign in to access your NoBait security workspace and phishing inspection dashboard.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F4F4F4]" />}>
      <LoginForm />
    </Suspense>
  );
}
