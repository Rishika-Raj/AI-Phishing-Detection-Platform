import { ScanResult, ThreatLevel, IndicatorResult } from "./mock-data";

/**
 * Deterministic rule-based evaluation for frontend demonstration.
 * This service implements the supported detection logic documented for NoBait:
 * - HTTPS usage
 * - Suspicious keywords
 * - Domain structure
 * - Blacklist status
 * - URL reputation indicators
 * - Email urgent language
 * - Credential harvesting requests
 *
 * It is intentionally abstracted so that it can be swapped for a real backend API call
 * in a subsequent phase without requiring any changes to the UI layer.
 */
export async function analyzeScan(
  input: string,
  targetType: "url" | "email" | "message"
): Promise<ScanResult> {
  // Realistic simulated processing latency
  await new Promise((resolve) => setTimeout(resolve, 700));

  const trimmed = input.trim();
  const lower = trimmed.toLowerCase();

  // Baseline evaluation parameters
  let riskScore = 12;
  const indicators: IndicatorResult[] = [];

  if (targetType === "url") {
    // 1. HTTPS Check
    if (lower.startsWith("http://")) {
      riskScore += 25;
      indicators.push({
        name: "HTTPS Protocol",
        status: "FLAGGED",
        details: "Insecure HTTP protocol in use. Transmission is not encrypted.",
      });
    } else if (lower.startsWith("https://")) {
      indicators.push({
        name: "HTTPS Protocol",
        status: "PASS",
        details: "Valid HTTPS scheme detected.",
      });
    } else {
      riskScore += 10;
      indicators.push({
        name: "HTTPS Protocol",
        status: "WARN",
        details: "Protocol scheme omitted or non-standard format.",
      });
    }

    // 2. Suspicious Keywords in URL
    const urlKeywords = [
      "verify",
      "login",
      "account",
      "secure",
      "update",
      "billing",
      "auth",
      "banking",
      "paypal",
      "apple",
      "wells",
    ];
    const matchedKeywords = urlKeywords.filter((k) => lower.includes(k));
    if (matchedKeywords.length >= 2) {
      riskScore += 30;
      indicators.push({
        name: "Suspicious Keywords",
        status: "FLAGGED",
        details: `Multiple credential-related keywords detected in path: ${matchedKeywords.join(", ")}.`,
      });
    } else if (matchedKeywords.length === 1) {
      riskScore += 15;
      indicators.push({
        name: "Suspicious Keywords",
        status: "WARN",
        details: `Single sensitive keyword detected: ${matchedKeywords[0]}.`,
      });
    } else {
      indicators.push({
        name: "Suspicious Keywords",
        status: "PASS",
        details: "No deceptive authentication keywords identified in URL string.",
      });
    }

    // 3. Domain Structure & TLD
    const suspiciousTlds = [".xyz", ".top", ".club", ".net", ".info", ".co"];
    const hasSuspiciousTld = suspiciousTlds.some((tld) => lower.includes(tld));
    const hyphenCount = (lower.match(/-/g) || []).length;
    const dotCount = (lower.match(/\./g) || []).length;

    if (hyphenCount >= 2 || dotCount >= 3 || hasSuspiciousTld) {
      riskScore += 25;
      indicators.push({
        name: "Domain Structure",
        status: "FLAGGED",
        details: "Unusual subdomain depth or multiple hyphenated brand name tokens.",
      });
    } else {
      indicators.push({
        name: "Domain Structure",
        status: "PASS",
        details: "Domain structure conforms to standard single-tier naming conventions.",
      });
    }

    // 4. Reputation & Blacklist status
    if (lower.includes("paypal-security") || lower.includes("account-update") || lower.includes("billing-notification")) {
      riskScore += 20;
      indicators.push({
        name: "URL Reputation",
        status: "FLAGGED",
        details: "Matches known deceptive pattern signatures in threat registry.",
      });
    } else if (lower.includes("github.com") || lower.includes("google.com") || lower.includes("microsoft.com")) {
      riskScore = Math.min(riskScore, 8);
      indicators.push({
        name: "URL Reputation",
        status: "PASS",
        details: "Domain associated with established, verified organization.",
      });
    } else {
      indicators.push({
        name: "URL Reputation",
        status: "PASS",
        details: "No active blacklist flags recorded for this specific hostname.",
      });
    }
  } else {
    // Email & Message Content Analysis
    // 1. Coercive / Urgent Language
    const urgencyWords = ["urgent", "suspended", "immediately", "within 24 hours", "termination", "restricted", "freeze"];
    const matchedUrgency = urgencyWords.filter((w) => lower.includes(w));

    if (matchedUrgency.length >= 2) {
      riskScore += 35;
      indicators.push({
        name: "Suspicious Language",
        status: "FLAGGED",
        details: `Strong urgency and pressure tactics detected: "${matchedUrgency.join('", "')}".`,
      });
    } else if (matchedUrgency.length === 1) {
      riskScore += 15;
      indicators.push({
        name: "Suspicious Language",
        status: "WARN",
        details: `Potential urgency indicator observed: "${matchedUrgency[0]}".`,
      });
    } else {
      indicators.push({
        name: "Suspicious Language",
        status: "PASS",
        details: "Language tone appears informational with no artificial deadlines.",
      });
    }

    // 2. Credential & Financial Demands
    const credentialWords = ["password", "two-factor", "otp", "verify your identity", "wire transfer", "payment", "card"];
    const matchedCreds = credentialWords.filter((w) => lower.includes(w));

    if (matchedCreds.length >= 2) {
      riskScore += 35;
      indicators.push({
        name: "Credential Requests",
        status: "FLAGGED",
        details: `Explicit solicitation of sensitive credentials or payment: ${matchedCreds.join(", ")}.`,
      });
    } else if (matchedCreds.length === 1) {
      riskScore += 15;
      indicators.push({
        name: "Credential Requests",
        status: "WARN",
        details: `Sensitive detail prompt noted: ${matchedCreds[0]}.`,
      });
    } else {
      indicators.push({
        name: "Credential Requests",
        status: "PASS",
        details: "No explicit credential or payment solicitation identified.",
      });
    }

    // 3. Embedded Links
    if (lower.includes("http://") || lower.includes("hxxp") || lower.includes(".xyz") || lower.includes(".club")) {
      riskScore += 25;
      indicators.push({
        name: "Suspicious Links",
        status: "FLAGGED",
        details: "Embedded link uses unencrypted protocol or deceptive domain format.",
      });
    } else if (lower.includes("https://")) {
      indicators.push({
        name: "Suspicious Links",
        status: "PASS",
        details: "Embedded link utilizes HTTPS protocol.",
      });
    } else {
      indicators.push({
        name: "Suspicious Links",
        status: "PASS",
        details: "No suspicious external hyperlink references found.",
      });
    }
  }

  // Bound score between 0 and 100
  riskScore = Math.max(4, Math.min(96, riskScore));

  // Determine threat classification
  let threatLevel: ThreatLevel = "SAFE";
  let recommendation = "Target displays low risk indicators. Follow standard digital hygiene.";

  if (riskScore >= 60) {
    threatLevel = "CRITICAL";
    recommendation =
      "High probability of phishing or credential harvesting. Do not click links, submit passwords, or reply to this communication.";
  } else if (riskScore >= 25) {
    threatLevel = "SUSPICIOUS";
    recommendation =
      "Moderate suspicion detected. Verify the sender or domain through official direct channels before interacting.";
  }

  return {
    id: `NB-${Date.now().toString(36).toUpperCase()}`,
    timestamp: new Date().toISOString(),
    target: trimmed.length > 80 ? `${trimmed.substring(0, 77)}...` : trimmed,
    targetType,
    riskScore,
    threatLevel,
    summary:
      threatLevel === "CRITICAL"
        ? "Severe threat signals detected across structure and lexical patterns."
        : threatLevel === "SUSPICIOUS"
        ? "Ambiguous or irregular indicators observed requiring cautious verification."
        : "No significant phishing indicators detected during analysis.",
    recommendation,
    indicators,
    isDemonstration: true,
  };
}
