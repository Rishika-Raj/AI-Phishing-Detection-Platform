/**
 * Direct Message & SMS (Smishing) Risk Analyzer (Server-side)
 * Evaluates mobile SMS, WhatsApp, and chat messages for smishing indicators:
 * - Urgency / immediate action directives
 * - Account restriction or package delivery lures
 * - Banking / credential requests
 * - Suspicious short links or high-risk TLDs
 */

const SMISHING_KEYWORDS = [
  'verify credentials',
  'restricted',
  'verify your identity',
  'card',
  'invoice',
  'payment',
  'password',
  'otp',
  'urgent',
  'suspended',
  'wire',
  'delivery failed',
  'package pending',
  'postal fee',
  'irs notice',
  'tax refund',
  'crypto',
  'claim reward',
  'account locked'
];

const SHORTENER_AND_SUSPICIOUS_DOMAINS = [
  'bit.ly',
  'tinyurl.com',
  't.co',
  'is.gd',
  'cutt.ly',
  '.xyz',
  '.top',
  '.club',
  'http://'
];

export async function analyzeMessageRisk(content) {
  const lower = content.toLowerCase();
  let riskScore = 8;
  const flags = [];
  const indicators = [];
  const detectedKeywordsSet = new Set();

  // 1. Keyword analysis
  const matchedKeywords = SMISHING_KEYWORDS.filter((pattern) => lower.includes(pattern));
  matchedKeywords.forEach((kw) => detectedKeywordsSet.add(kw));

  if (matchedKeywords.length >= 2) {
    riskScore += 45;
    flags.push(`Multiple smishing keywords detected: ${matchedKeywords.slice(0, 3).join(', ')}`);
    indicators.push({
      name: 'Smishing Lures & Triggers',
      status: 'FLAGGED',
      details: `High-risk mobile social engineering patterns detected: "${matchedKeywords.join('", "')}".`
    });
  } else if (matchedKeywords.length === 1) {
    riskScore += 22;
    flags.push(`Smishing keyword observed: ${matchedKeywords[0]}`);
    indicators.push({
      name: 'Smishing Lures & Triggers',
      status: 'WARN',
      details: `Potential smishing indicator observed: "${matchedKeywords[0]}".`
    });
  } else {
    indicators.push({
      name: 'Smishing Lures & Triggers',
      status: 'PASS',
      details: 'No common smishing lures or account restriction triggers identified.'
    });
  }

  // 2. Link & Shortener analysis
  const matchedLinks = SHORTENER_AND_SUSPICIOUS_DOMAINS.filter((linkPattern) => lower.includes(linkPattern));
  matchedLinks.forEach((l) => detectedKeywordsSet.add(l));

  if (matchedLinks.length > 0) {
    riskScore += 35;
    flags.push(`Suspicious or shortened destination link: ${matchedLinks.join(', ')}`);
    indicators.push({
      name: 'Destination Link Obfuscation',
      status: 'FLAGGED',
      details: `Message incorporates shortened or suspicious link syntax (${matchedLinks.join(', ')}) designed to mask actual destination.`
    });
  } else if (lower.includes('https://')) {
    indicators.push({
      name: 'Destination Link Obfuscation',
      status: 'PASS',
      details: 'Embedded link utilizes standard HTTPS scheme without common obfuscation patterns.'
    });
  } else {
    indicators.push({
      name: 'Destination Link Obfuscation',
      status: 'PASS',
      details: 'No external hyperlink payloads detected in message body.'
    });
  }

  // 3. Score normalization
  riskScore = Math.max(5, Math.min(98, riskScore));

  let riskLevel = 'SAFE';
  let threatStatus = 'Low Risk Message';
  let recommendation = 'Message appears standard. Exercise standard caution with unfamiliar senders.';

  if (riskScore >= 65) {
    riskLevel = 'HIGH';
    threatStatus = 'High Risk Smishing Attack';
    recommendation = 'Critical smishing threat detected. Do not click links or reply with personal details or verification codes.';
  } else if (riskScore >= 35) {
    riskLevel = 'MEDIUM';
    threatStatus = 'Suspicious Mobile Message';
    recommendation = 'Suspicious elements identified. Independently verify with the organization via official contacts.';
  } else if (riskScore > 18) {
    riskLevel = 'LOW';
    threatStatus = 'Low Threat Probability';
    recommendation = 'Low suspicion detected. Verify if sent from an unknown phone number.';
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
