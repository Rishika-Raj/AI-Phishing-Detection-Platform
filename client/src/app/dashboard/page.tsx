import { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const metadata: Metadata = {
  title: "Dashboard | NoBait Phishing Detection Platform",
  description: "Analyze suspicious URLs, view risk scores and indicators, and audit detection history.",
};

export default function DashboardPage() {
  return <DashboardShell />;
}
