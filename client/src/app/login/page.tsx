import { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In | NoBait Phishing Detection Platform",
  description: "Sign in to access your NoBait security workspace and phishing inspection dashboard.",
};

export default function LoginPage() {
  return <LoginForm />;
}
