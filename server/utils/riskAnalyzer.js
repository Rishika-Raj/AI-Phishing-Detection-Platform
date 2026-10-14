import { runHeuristicChecks } from './urlRuleEngine.js';
import { checkVirusTotal } from './virusTotalService.js';
import { checkGoogleSafeBrowsing } from './googleSafeBrowsingService.js';


export async function analyzeUrlRisk(url) {
  const heuristic = runHeuristicChecks(url);
  const flags = [...heuristic.flags];

  if (heuristic.isMalformed) {
    return {
      riskScore: 100,
      riskLevel: 'HIGH',
      threatStatus: 'Malformed URL',
      recommendation: 'Do not access this invalid or deceptive URL format.',
      flags,
      apiResults: {}
    };
  }

  const [vtResult, gsbResult] = await Promise.all([
    checkVirusTotal(url),
    checkGoogleSafeBrowsing(url)
  ]);

  let totalScore = heuristic.score;

  if (gsbResult.isThreat) {
    totalScore += 50;
    flags.push(`Flagged by Google Safe Browsing (${gsbResult.threatTypes.join(', ')})`);
  }

  if (vtResult.maliciousCount > 0) {
    const vtPenalty = Math.min(vtResult.maliciousCount * 20, 50);
    totalScore += vtPenalty;
    flags.push(`Flagged by ${vtResult.maliciousCount} security vendors on VirusTotal`);
  }

  const riskScore = Math.min(totalScore, 100);

  let riskLevel = 'SAFE';
  let threatStatus = 'Clean / Safe Website';
  let recommendation = 'No critical phishing indicators detected. Safe to browse.';

  if (riskScore >= 70) {
    riskLevel = 'HIGH';
    threatStatus = 'High Risk Suspicious Website';
    recommendation = 'Avoid visiting. High probability of credential theft or phishing[cite: 1].';
  } else if (riskScore >= 40) {
    riskLevel = 'MEDIUM';
    threatStatus = 'Suspicious Website';
    recommendation = 'Exercise caution. Avoid entering sensitive passwords or financial details[cite: 1].';
  } else if (riskScore > 15) {
    riskLevel = 'LOW';
    threatStatus = 'Low Risk';
    recommendation = 'Standard caution recommended.';
  }

  return {
    riskScore,
    riskLevel,
    threatStatus,
    recommendation,
    flags,
    apiResults: {
      virusTotal: vtResult,
      googleSafeBrowsing: gsbResult
    }
  };
}