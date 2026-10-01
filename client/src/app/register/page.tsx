import { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account | NoBait Phishing Detection Platform",
  description: "Register your analyst profile to access the NoBait security workspace and URL scanner.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
