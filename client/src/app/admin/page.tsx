import { Metadata } from "next";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { AdminDashboardView } from "@/components/admin/AdminDashboardView";

export const metadata: Metadata = {
  title: "Admin Threat Operations & Telemetry | NoBait Phishing Detection Platform",
  description: "Enterprise threat operations, forensic telemetry, attack vector distribution, and keyword intelligence audit.",
};

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#F4F4F4] flex flex-col justify-between text-[#101010]">
      {/* Product Navigation */}
      <DashboardNav />

      {/* Main Admin Console Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10">
        <AdminDashboardView />
      </main>

      {/* Product Footer */}
      <footer className="w-full bg-[#FFFFFF] border-t border-[#E5E7EB] py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[#101010]/60">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0038FF]" aria-hidden="true" />
            <span>NoBait Threat Intelligence · Security Operations Center Console</span>
          </div>
          <div>
            <span>Dynamic Telemetry Ingestion · Client Session Synchronized</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
