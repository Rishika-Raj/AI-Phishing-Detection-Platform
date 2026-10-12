import { Metadata } from "next";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { ReportsView } from "@/components/reports/ReportsView";

export const metadata: Metadata = {
  title: "Reports & Forensic Logs | NoBait Phishing Detection Platform",
  description: "Audit historical phishing detection reports, search across threat vectors, inspect detected indicators, and export forensic archives.",
};

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-[#F4F4F4] flex flex-col justify-between text-[#101010]">
      {/* Product Navigation */}
      <DashboardNav />

      {/* Main Forensic Reports Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10">
        <ReportsView />
      </main>

      {/* Product Footer */}
      <footer className="w-full bg-[#FFFFFF] border-t border-[#E5E7EB] py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[#101010]/60">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0038FF]" aria-hidden="true" />
            <span>NoBait Threat Platform · Forensic Report Archive</span>
          </div>
          <div>
            <span>Verified Specimen Audit Logs · Session Storage Synchronized</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
