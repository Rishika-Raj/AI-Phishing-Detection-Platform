/**
 * Email Phishing Risk Analyzer (Server-side)
 * Evaluates raw email content, subject line, and sender details for phishing indicators:
 * - Urgent / coercive language
 * - Credential / financial harvesting requests
 * - Suspicious hyperlinks or protocol mismatches
 * - Sender spoofing patterns
 */

const URGENCY_PATTERNS = [
  'urgent',
  'suspended',
  'immediately',
  'within 24 hours',
  'termination',
  'restricted',
  'freeze',
  'overdue',
  'action required',
  'unauthorized',
  'permanent termination',
  'account locked',
  'security alert',
  'compromised',
  'final notice'
];

const CREDENTIAL_PATTERNS = [
  'password',
  'two-factor',
  '2fa',
  'otp',
  'verify your identity',
  'verify credentials',
  'wire transfer',
  'payment',
  'card',
  'credentials',
  'invoice',
  'collection fees',
  'social security',
  'bank account',
  'routing number',
  'billing update'
];

const SUSPICIOUS_DOMAINS_TLDS = [
  '.xyz',
  '.top',
  '.club',
  '.online',
  '.work',
  '.buzz',
  '.cn',
  '.ru',
  '.click'
];

export async function analyzeEmailRisk(content, subject = '', sender = '') {
  const combinedText = `${subject} ${sender} ${content}`.toLowerCase();
  let riskScore = 10;
  const flags = [];
  const indicators = [];
  const detectedKeywordsSet = new Set();

  // 1. Urgency / Coercive Language
  const matchedUrgency = URGENCY_PATTERNS.filter((pattern) => combinedText.includes(pattern));
  matchedUrgency.forEach((kw) => detectedKeywordsSet.add(kw));

  if (matchedUrgency.length >= 3) {
    riskScore += 40;
    flags.push(`Multiple coercive urgency triggers identified: ${matchedUrgency.slice(0, 3).join(', ')}`);
    indicators.push({
      name: 'Urgency & Pressure Language',
      status: 'FLAGGED',
      details: `Heavy psychological pressure detected: "${matchedUrgency.join('", "')}".`
    });
  } else if (matchedUrgency.length >= 1) {
    riskScore += 20;
    flags.push(`Urgency language indicator: ${matchedUrgency[0]}`);
    indicators.push({
      name: 'Urgency & Pressure Language',
      status: 'WARN',
      details: `Artificial urgency keyword observed: "${matchedUrgency[0]}".`
    });
  } else {
    indicators.push({
      name: 'Urgency & Pressure Language',
      status: 'PASS',
      details: 'No artificial panic or coercive deadline indicators observed.'
    });
  }

  // 2. Credential & Financial Solicitation
  const matchedCreds = CREDENTIAL_PATTERNS.filter((pattern) => combinedText.includes(pattern));
  matchedCreds.forEach((kw) => detectedKeywordsSet.add(kw));

  if (matchedCreds.length >= 2) {
    riskScore += 40;
    flags.push(`Direct solicitation of credentials/funds: ${matchedCreds.slice(0, 3).join(', ')}`);
    indicators.push({
      name: 'Credential & Asset Demands',
      status: 'FLAGGED',
      details: `High-risk request for authentication secrets or payment: ${matchedCreds.join(', ')}.`
    });
  } else if (matchedCreds.length === 1) {
    riskScore += 18;
    flags.push(`Sensitive keyword detected: ${matchedCreds[0]}`);
    indicators.push({
      name: 'Credential & Asset Demands',
      status: 'WARN',
      details: `Sensitive security/financial prompt noted: ${matchedCreds[0]}.`
    });
  } else {
    indicators.push({
      name: 'Credential & Asset Demands',
      status: 'PASS',
      details: 'No requests for credentials, OTPs, or financial disbursements.'
    });
  }

  // 3. Link & Domain Analysis in Email Content
  const hasInsecureHttp = combinedText.includes('http://');
  const hasSuspiciousTld = SUSPICIOUS_DOMAINS_TLDS.some((tld) => combinedText.includes(tld));

  if (hasInsecureHttp) {
    riskScore += 25;
    flags.push('Contains unencrypted HTTP hyperlink');
    indicators.push({
      name: 'Embedded Hyperlink Security',
      status: 'FLAGGED',
      details: 'Contains insecure unencrypted HTTP links vulnerable to interception.'
    });
  } else if (hasSuspiciousTld) {
    riskScore += 20;
    flags.push('Contains hyperlink pointing to suspicious high-risk TLD');
    indicators.push({
      name: 'Embedded Hyperlink Security',
      status: 'FLAGGED',
      details: 'Hyperlinks target suspicious top-level domains commonly used in disposable phishing campaigns.'
    });
  } else if (combinedText.includes('https://')) {
    indicators.push({
      name: 'Embedded Hyperlink Security',
      status: 'PASS',
      details: 'Embedded links utilize standard TLS/HTTPS protocols.'
    });
  } else {
    indicators.push({
      name: 'Embedded Hyperlink Security',
      status: 'PASS',
      details: 'No suspicious external hyperlinks identified.'
    });
  }

  // 4. Sender Reputation Heuristics
  if (sender) {
    const senderLower = sender.toLowerCase();
    const isPublicFreeMail = ['@gmail.com', '@yahoo.com', '@hotmail.com', '@outlook.com'].some(d => senderLower.includes(d));
    const claimsCorporate = ['support', 'security', 'service', 'billing', 'admin', 'bank', 'paypal', 'apple'].some(w => combinedText.includes(w));

    if (isPublicFreeMail && claimsCorporate) {
      riskScore += 30;
      flags.push('Sender uses free webmail domain while claiming corporate or security authority');
      indicators.push({
        name: 'Sender Identity Verification',
        status: 'FLAGGED',
        details: 'Discrepancy: Official organizational authority claimed from a public webmail address.'
      });
    }
  }

  // Normalization
  riskScore = Math.max(5, Math.min(98, riskScore));

  let riskLevel = 'SAFE';
  let threatStatus = 'Low Risk Communication';
  let recommendation = 'Email content appears benign. Follow standard email verification practices.';

  if (riskScore >= 65) {
    riskLevel = 'HIGH';
    threatStatus = 'High Risk Phishing Email';
    recommendation = 'Critical phishing threat detected. Do not click links, open attachments, or disclose credentials.';
  } else if (riskScore >= 35) {
    riskLevel = 'MEDIUM';
    threatStatus = 'Suspicious Email Inquiry';
    recommendation = 'Moderate risk indicators observed. Verify sender identity through out-of-band channels before acting.';
  } else if (riskScore > 20) {
    riskLevel = 'LOW';
    threatStatus = 'Minimal Risk';
    recommendation = 'Minor indicators noted. Verify sender if unexpected.';
  }

  return {
    riskScore,
    riskLevel,
    threatStatus,
    recommendation,
    flags,
    indicators,
    detectedKeywords: Array.from(detectedKeywordsSet)
  };
}
