"use client";

import { useSyncExternalStore, useCallback, useEffect, useState } from "react";
import { ScanResult, ThreatLevel } from "./mock-data";
import { HistoryItem, INITIAL_MOCK_HISTORY } from "./mock-history";
import { createClient } from "./supabase/client";

const STORAGE_KEY = "nobait_scan_history_v1";
const EVENT_KEY = "nobait-history-updated";

let cachedRaw: string | null = null;
let cachedHistory: HistoryItem[] = INITIAL_MOCK_HISTORY;
let isSyncedWithDb = false;

function formatTimestamp(isoString: string): string {
  try {
    const d = new Date(isoString);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");
    if (isToday) return `Today, ${hours}:${minutes}`;
    return `${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}, ${hours}:${minutes}`;
  } catch {
    return "Recent";
  }
}

function toClientThreatLevel(level: string, score: number): ThreatLevel {
  const norm = (level || "").toUpperCase();
  if (norm === "CRITICAL" || norm === "HIGH" || score >= 60) return "CRITICAL";
  if (norm === "SUSPICIOUS" || norm === "MEDIUM" || score >= 25) return "SUSPICIOUS";
  return "SAFE";
}

export function mapDbScanToHistoryItem(row: Record<string, unknown>): HistoryItem {
  const analysis = (row.analysis_result as Record<string, unknown>) || {};
  const riskScore = Number(row.risk_score) || 0;
  const threatLevel = toClientThreatLevel(String(row.risk_level), riskScore);

  return {
    id: String(row.id),
    timestamp: String(row.created_at || new Date().toISOString()),
    formattedDate: formatTimestamp(String(row.created_at || new Date().toISOString())),
    target: String(row.target || ""),
    targetType: (row.scan_type as "url" | "email" | "message") || "url",
    subject: analysis.subject ? String(analysis.subject) : undefined,
    sender: analysis.sender ? String(analysis.sender) : undefined,
    fullContent: analysis.fullContent ? String(analysis.fullContent) : undefined,
    riskScore,
    threatLevel,
    summary:
      String(analysis.summary || row.threat_status || "") ||
      (threatLevel === "CRITICAL"
        ? "Severe threat signals detected across structure and lexical patterns."
        : threatLevel === "SUSPICIOUS"
        ? "Ambiguous or irregular indicators observed requiring cautious verification."
        : "No significant phishing indicators detected during analysis."),
    recommendation: String(row.recommendation || "Follow standard digital hygiene."),
    indicators: Array.isArray(analysis.indicators)
      ? (analysis.indicators as HistoryItem["indicators"])
      : Array.isArray(row.flags)
      ? (row.flags as string[]).map((f) => ({
          name: "Detection Flag",
          status: threatLevel === "SAFE" ? "PASS" : "FLAGGED",
          details: f,
        }))
      : [],
    detectedKeywords: Array.isArray(analysis.detectedKeywords)
      ? (analysis.detectedKeywords as string[])
      : [],
    isDemonstration: Boolean(row.is_demonstration),
  };
}

export function getStoredHistory(): HistoryItem[] {
  if (typeof window === "undefined") {
    return INITIAL_MOCK_HISTORY;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_HISTORY));
      cachedRaw = JSON.stringify(INITIAL_MOCK_HISTORY);
      cachedHistory = INITIAL_MOCK_HISTORY;
      return cachedHistory;
    }
    if (raw === cachedRaw) {
      return cachedHistory;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      cachedRaw = raw;
      cachedHistory = parsed;
      return cachedHistory;
    }
    return INITIAL_MOCK_HISTORY;
  } catch {
    return INITIAL_MOCK_HISTORY;
  }
}

export function saveHistoryItem(scan: ScanResult): HistoryItem {
  const current = getStoredHistory();
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");

  const newItem: HistoryItem = {
    ...scan,
    formattedDate: formatTimestamp(scan.timestamp || now.toISOString()),
  };

  // Avoid duplicates if already present
  const exists = current.some((item) => item.id === scan.id);
  const updated = exists ? current : [newItem, ...current];

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      cachedRaw = JSON.stringify(updated);
      cachedHistory = updated;
      window.dispatchEvent(new Event(EVENT_KEY));
    } catch {
      // Storage unavailable or quota exceeded
    }
  }
  return newItem;
}

export function setBatchHistory(items: HistoryItem[]): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      cachedRaw = JSON.stringify(items);
      cachedHistory = items;
      window.dispatchEvent(new Event(EVENT_KEY));
    } catch {
      // Storage unavailable
    }
  }
}

export function clearStoredHistory(): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      cachedRaw = JSON.stringify([]);
      cachedHistory = [];
      window.dispatchEvent(new Event(EVENT_KEY));
    } catch {
      // Storage unavailable
    }
  }
}

export function restoreStoredHistory(): HistoryItem[] {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_HISTORY));
      cachedRaw = JSON.stringify(INITIAL_MOCK_HISTORY);
      cachedHistory = INITIAL_MOCK_HISTORY;
      window.dispatchEvent(new Event(EVENT_KEY));
    } catch {
      // Storage unavailable
    }
  }
  return INITIAL_MOCK_HISTORY;
}

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }
  const handler = () => {
    callback();
  };
  window.addEventListener(EVENT_KEY, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT_KEY, handler);
    window.removeEventListener("storage", handler);
  };
}

function getServerSnapshot(): HistoryItem[] {
  return INITIAL_MOCK_HISTORY;
}

export function useScanHistory() {
  const history = useSyncExternalStore(subscribe, getStoredHistory, getServerSnapshot);
  const [isLoaded, setIsLoaded] = useState(false);

  // Sync with Supabase on client mount
  useEffect(() => {
    let isCancelled = false;

    async function syncWithSupabase() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const { data, error } = await supabase
            .from("scans")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(100);

          if (!error && data && !isCancelled) {
            if (data.length > 0) {
              const mapped = data.map(mapDbScanToHistoryItem);
              setBatchHistory(mapped);
              isSyncedWithDb = true;
            } else if (!isSyncedWithDb) {
              // If user has zero scans yet, clear default mock scans for clean dashboard
              setBatchHistory([]);
              isSyncedWithDb = true;
            }
          }
        }
      } catch (err) {
        console.warn("Could not sync scan history with Supabase:", err);
      } finally {
        if (!isCancelled) setIsLoaded(true);
      }
    }

    syncWithSupabase();

    return () => {
      isCancelled = true;
    };
  }, []);

  const addScan = useCallback((scan: ScanResult) => {
    saveHistoryItem(scan);
  }, []);

  const clear = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Attempt DB delete if user is owner
        await supabase.from("scans").delete().eq("user_id", user.id);
      }
    } catch {
      // Ignore if RLS blocks delete
    }
    clearStoredHistory();
  }, []);

  const restore = useCallback(() => {
    restoreStoredHistory();
  }, []);

  return {
    history,
    isLoaded,
    addScan,
    clearHistory: clear,
    restoreHistory: restore,
  };
}
