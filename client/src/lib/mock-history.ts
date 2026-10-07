import { ScanResult } from "./mock-data";

export interface HistoryItem extends ScanResult {
  formattedDate: string;
}

export const INITIAL_MOCK_HISTORY: HistoryItem[] = [
  {
    id: "NB-HST-001",
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    formattedDate: "Today, 14:22",
    target: "http://paypal-security-verification.account-update.xyz/login?ref=urgent",
    targetType: "url",
    riskScore: 88,
    threatLevel: "CRITICAL",
    summary: "Severe threat signals detected across structure and lexical patterns.",
    recommendation: "Do not navigate to this destination or enter sensitive credentials.",
    indicators: [
      { name: "HTTPS Protocol", status: "FLAGGED", details: "Insecure HTTP protocol in use." },
      { name: "Suspicious Keywords", status: "FLAGGED", details: "Multiple credential-related keywords detected: verify, login, account." },
      { name: "Domain Structure", status: "FLAGGED", details: "Unusual subdomain depth and hyphenated tokens." },
      { name: "URL Reputation", status: "FLAGGED", details: "Matches known deceptive pattern signatures." },
    ],
    isDemonstration: true,
  },
  {
    id: "NB-HST-002",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    formattedDate: "Yesterday, 19:40",
    target: "https://billing-notification-portal71.co/invoice_91823.html",
    targetType: "url",
    riskScore: 52,
    threatLevel: "SUSPICIOUS",
    summary: "Ambiguous or irregular indicators observed requiring cautious verification.",
    recommendation: "Moderate suspicion detected. Verify the sender or domain through official direct channels.",
    indicators: [
      { name: "HTTPS Protocol", status: "PASS", details: "Valid HTTPS scheme detected." },
      { name: "Suspicious Keywords", status: "WARN", details: "Single sensitive keyword detected: billing." },
      { name: "Domain Structure", status: "FLAGGED", details: "Suspicious TLD (.co) with numeric brand variant." },
      { name: "URL Reputation", status: "PASS", details: "No active blacklist flags recorded." },
    ],
    isDemonstration: true,
  },
  {
    id: "NB-HST-003",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 42).toISOString(),
    formattedDate: "Sep 30, 11:15",
    target: "https://www.github.com/security",
    targetType: "url",
    riskScore: 8,
    threatLevel: "SAFE",
    summary: "No significant phishing indicators detected during analysis.",
    recommendation: "Target displays low risk indicators. Follow standard digital hygiene.",
    indicators: [
      { name: "HTTPS Protocol", status: "PASS", details: "Valid HTTPS scheme detected." },
      { name: "Suspicious Keywords", status: "PASS", details: "No deceptive authentication keywords identified." },
      { name: "Domain Structure", status: "PASS", details: "Standard single-tier naming conventions." },
      { name: "URL Reputation", status: "PASS", details: "Domain associated with established, verified organization." },
    ],
    isDemonstration: true,
  },
  {
    id: "NB-HST-004",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 70).toISOString(),
    formattedDate: "Sep 28, 09:02",
    target: "https://google.com/search?q=cybersecurity+best+practices",
    targetType: "url",
    riskScore: 6,
    threatLevel: "SAFE",
    summary: "No significant phishing indicators detected during analysis.",
    recommendation: "Target displays low risk indicators. Follow standard digital hygiene.",
    indicators: [
      { name: "HTTPS Protocol", status: "PASS", details: "Valid HTTPS scheme detected." },
      { name: "Suspicious Keywords", status: "PASS", details: "Clean query parameters and paths." },
      { name: "Domain Structure", status: "PASS", details: "Verified primary top-level domain." },
      { name: "URL Reputation", status: "PASS", details: "Domain associated with established, verified organization." },
    ],
    isDemonstration: true,
  },
];
