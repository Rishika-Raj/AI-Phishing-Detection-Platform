export type ThreatLevel = "SAFE" | "SUSPICIOUS" | "CRITICAL";

export interface IndicatorResult {
  name: string;
  status: "PASS" | "FLAGGED" | "WARN";
  details: string;
}

export interface ScanResult {
  id: string;
  timestamp: string;
  target: string;
  targetType: "url" | "email" | "message";
  riskScore: number;
  threatLevel: ThreatLevel;
  summary: string;
  recommendation: string;
  indicators: IndicatorResult[];
  isDemonstration: boolean;
}

export interface SampleItem {
  id: string;
  label: string;
  type: "url" | "email" | "message";
  content: string;
  expectedRisk: ThreatLevel;
}

export const SAMPLE_INPUTS: SampleItem[] = [
  // URL Samples
  {
    id: "url-critical",
    label: "Credential Harvester (High Risk)",
    type: "url",
    content: "http://paypal-security-verification.account-update.xyz/login?ref=urgent",
    expectedRisk: "CRITICAL",
  },
  {
    id: "url-suspicious",
    label: "Fake Invoice Link (Suspicious)",
    type: "url",
    content: "https://billing-notification-portal71.co/invoice_91823.html",
    expectedRisk: "SUSPICIOUS",
  },
  {
    id: "url-safe",
    label: "Legitimate Service (Safe)",
    type: "url",
    content: "https://www.github.com/security",
    expectedRisk: "SAFE",
  },

  // Email Samples
  {
    id: "email-critical",
    label: "Account Suspension Notice (High Risk)",
    type: "email",
    content: `FROM: security-alert@account-verification-support.net
SUBJECT: URGENT: Your account has been temporarily suspended
BODY:
Dear Customer,
We detected unauthorized login attempts from an unknown location. To prevent permanent suspension of your account and assets, you must verify your identity immediately.
Please click the link below to confirm your password and two-factor code within 24 hours:
http://verification-portal-service.net/auth/resolve?id=892318
Failure to do so will result in permanent account termination.`,
    expectedRisk: "CRITICAL",
  },
  {
    id: "email-suspicious",
    label: "Unsolicited Wire Request (Suspicious)",
    type: "email",
    content: `FROM: admin-billing@quick-invoicing-center.org
SUBJECT: Outstanding invoice #INV-4920 payment overdue
BODY:
Please review the attached invoice summary immediately. Outstanding balance of $1,420.00 must be remitted by wire transfer today to avoid late collection fees. Visit our portal to process payment.`,
    expectedRisk: "SUSPICIOUS",
  },
  {
    id: "email-safe",
    label: "Standard Newsletter (Safe)",
    type: "email",
    content: `FROM: updates@securityweek.com
SUBJECT: Weekly Security Digest: Best Practices in Modern Authentication
BODY:
Here is our weekly roundup of published articles and threat research. You can update your reading preferences or unsubscribe anytime through your account profile.`,
    expectedRisk: "SAFE",
  },

  // Message Samples
  {
    id: "msg-critical",
    label: "Bank Account Freeze SMS (High Risk)",
    type: "message",
    content: "ALERT: Your Wells account has been restricted due to suspicious debit activity. Verify credentials immediately at: http://wellsfargo-secure-auth.club/resolve to restore access.",
    expectedRisk: "CRITICAL",
  },
  {
    id: "msg-suspicious",
    label: "Parcel Delivery Fee SMS (Suspicious)",
    type: "message",
    content: "Postal Notice: Your parcel #US-89201 is on hold due to unpaid customs fee ($1.75). Settle online here: https://postal-tracking-fees.com/update to avoid return.",
    expectedRisk: "SUSPICIOUS",
  },
  {
    id: "msg-safe",
    label: "Two-Factor Verification Code (Safe)",
    type: "message",
    content: "Your verification code is 849201. It will expire in 10 minutes. If you did not initiate this request, no action is required.",
    expectedRisk: "SAFE",
  },
];
