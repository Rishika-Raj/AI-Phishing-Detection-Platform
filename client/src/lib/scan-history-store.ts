"use client";

import { useSyncExternalStore, useCallback } from "react";
import { ScanResult } from "./mock-data";
import { HistoryItem, INITIAL_MOCK_HISTORY } from "./mock-history";

const STORAGE_KEY = "nobait_scan_history_v1";
const EVENT_KEY = "nobait-history-updated";

let cachedRaw: string | null = null;
let cachedHistory: HistoryItem[] = INITIAL_MOCK_HISTORY;

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
    formattedDate: `Today, ${hours}:${minutes}`,
  };

  const updated = [newItem, ...current];
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      cachedRaw = JSON.stringify(updated);
      cachedHistory = updated;
      window.dispatchEvent(new Event(EVENT_KEY));
    } catch {
      // storage quota or unavailable
    }
  }
  return newItem;
}

export function clearStoredHistory(): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      cachedRaw = JSON.stringify([]);
      cachedHistory = [];
      window.dispatchEvent(new Event(EVENT_KEY));
    } catch {
      // storage unavailable
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
      // storage unavailable
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

  const addScan = useCallback((scan: ScanResult) => {
    saveHistoryItem(scan);
  }, []);

  const clear = useCallback(() => {
    clearStoredHistory();
  }, []);

  const restore = useCallback(() => {
    restoreStoredHistory();
  }, []);

  return {
    history,
    isLoaded: true,
    addScan,
    clearHistory: clear,
    restoreHistory: restore,
  };
}
