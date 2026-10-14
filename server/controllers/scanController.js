import { supabase, supabaseAdmin, getUserClient } from '../utils/supabase.js';
import { analyzeUrlRisk } from '../utils/riskAnalyzer.js';
import { analyzeEmailRisk } from '../utils/emailRiskAnalyzer.js';
import { analyzeMessageRisk } from '../utils/messageRiskAnalyzer.js';

/**
 * Maps risk levels into canonical ThreatLevel: SAFE | SUSPICIOUS | CRITICAL
 */
function toClientThreatLevel(level, score) {
  const norm = (level || '').toUpperCase();
  if (norm === 'CRITICAL' || norm === 'HIGH' || score >= 60) return 'CRITICAL';
  if (norm === 'SUSPICIOUS' || norm === 'MEDIUM' || score >= 25) return 'SUSPICIOUS';
  return 'SAFE';
}

function normalizeDbRiskLevel(level) {
  if (!level) return 'SAFE';
  return level.toUpperCase();
}

/**
 * Format DB row to ScanResult shape expected by client
 */
export function formatScanRow(row) {
  const analysis = row.analysis_result || {};
  const threatLevel = toClientThreatLevel(row.risk_level, row.risk_score);

  return {
    id: row.id,
    timestamp: row.created_at,
    target: row.target,
    targetType: row.scan_type,
    subject: analysis.subject || undefined,
    sender: analysis.sender || undefined,
    fullContent: analysis.fullContent || undefined,
    riskScore: row.risk_score,
    threatLevel,
    summary:
      analysis.summary ||
      row.threat_status ||
      (threatLevel === 'CRITICAL'
        ? 'Severe threat signals detected across structure and lexical patterns.'
        : threatLevel === 'SUSPICIOUS'
        ? 'Ambiguous or irregular indicators observed requiring cautious verification.'
        : 'No significant phishing indicators detected during analysis.'),
    recommendation: row.recommendation,
    indicators: analysis.indicators || (row.flags || []).map(f => ({
      name: 'Detection Flag',
      status: threatLevel === 'SAFE' ? 'PASS' : 'FLAGGED',
      details: f
    })),
    detectedKeywords: analysis.detectedKeywords || [],
    isDemonstration: row.is_demonstration || false,
    createdAt: row.created_at
  };
}

/**
 * POST /api/scan/url
 * Requires: Authorization: Bearer <token>
 * Body: { url: string }
 */
export const scanUrlHandler = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || typeof url !== 'string' || !url.trim()) {
      return res.status(400).json({ error: 'URL is required and must be a non-empty string.' });
    }

    if (url.trim().length > 2000) {
      return res.status(400).json({ error: 'URL exceeds maximum allowed length.' });
    }

    const result = await analyzeUrlRisk(url.trim());
    const dbClient = req.supabase || supabaseAdmin || getUserClient(req.token);

    // Build structured indicators for the client
    const indicators = (result.flags || []).map(flag => ({
      name: 'Security Indicator',
      status: result.riskScore >= 60 ? 'FLAGGED' : result.riskScore >= 25 ? 'WARN' : 'PASS',
      details: flag
    }));

    if (indicators.length === 0) {
      indicators.push({
        name: 'Protocol & Domain Health',
        status: 'PASS',
        details: 'No suspicious keywords or malicious indicators detected in URL structure.'
      });
    }

    const detectedKeywords = (result.flags || [])
      .filter(f => f.includes('keyword') || f.includes('Pattern'))
      .map(f => f.replace(/.*:\s*/, ''));

    const { data, error } = await dbClient
      .from('scans')
      .insert({
        user_id: req.user.id,
        scan_type: 'url',
        target: url.trim(),
        risk_score: result.riskScore,
        risk_level: normalizeDbRiskLevel(result.riskLevel),
        threat_status: result.threatStatus,
        recommendation: result.recommendation,
        flags: result.flags || [],
        analysis_result: {
          indicators,
          detectedKeywords,
          apiResults: result.apiResults,
          summary: result.threatStatus,
          fullContent: url.trim()
        },
        is_demonstration: false
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase write error (url scan):', error.message);
      return res.status(500).json({ error: 'Failed to persist scan result: ' + error.message });
    }

    return res.status(200).json({
      success: true,
      scan: formatScanRow(data)
    });
  } catch (err) {
    console.error('URL scan error:', err.message);
    return res.status(500).json({ error: 'Internal scanning error. Please try again.' });
  }
};

/**
 * POST /api/scan/email
 * Requires: Authorization: Bearer <token>
 * Body: { content: string, subject?: string, sender?: string }
 */
export const scanEmailHandler = async (req, res) => {
  try {
    const { content, subject, sender } = req.body;

    if (!content || typeof content !== 'string' || content.trim().length < 10) {
      return res.status(400).json({
        error: 'Email content is required and must be at least 10 characters.'
      });
    }

    if (content.trim().length > 50000) {
      return res.status(400).json({ error: 'Email content exceeds maximum allowed length.' });
    }

    const result = await analyzeEmailRisk(content.trim(), subject, sender);
    const dbClient = req.supabase || supabaseAdmin || getUserClient(req.token);

    const targetLabel = subject?.trim() || (content.trim().length > 80 ? `${content.trim().substring(0, 77)}...` : content.trim());
    const fullContentString = subject?.trim() ? `SUBJECT: ${subject.trim()}\n\n${content.trim()}` : content.trim();

    const { data, error } = await dbClient
      .from('scans')
      .insert({
        user_id: req.user.id,
        scan_type: 'email',
        target: targetLabel,
        risk_score: result.riskScore,
        risk_level: normalizeDbRiskLevel(result.riskLevel),
        threat_status: result.threatStatus,
        recommendation: result.recommendation,
        flags: result.flags || [],
        analysis_result: {
          indicators: result.indicators,
          detectedKeywords: result.detectedKeywords,
          subject: subject?.trim() || null,
          sender: sender?.trim() || null,
          fullContent: fullContentString,
          summary: result.threatStatus
        },
        is_demonstration: false
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase write error (email scan):', error.message);
      return res.status(500).json({ error: 'Failed to persist scan result: ' + error.message });
    }

    return res.status(200).json({
      success: true,
      scan: formatScanRow(data)
    });
  } catch (err) {
    console.error('Email scan error:', err.message);
    return res.status(500).json({ error: 'Internal scanning error. Please try again.' });
  }
};

/**
 * POST /api/scan/message
 * Requires: Authorization: Bearer <token>
 * Body: { content: string }
 */
export const scanMessageHandler = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || typeof content !== 'string' || content.trim().length < 5) {
      return res.status(400).json({
        error: 'Message content is required and must be at least 5 characters.'
      });
    }

    if (content.trim().length > 10000) {
      return res.status(400).json({ error: 'Message content exceeds maximum allowed length.' });
    }

    const result = await analyzeMessageRisk(content.trim());
    const dbClient = req.supabase || supabaseAdmin || getUserClient(req.token);

    const targetLabel = content.trim().length > 80 ? `${content.trim().substring(0, 77)}...` : content.trim();

    const { data, error } = await dbClient
      .from('scans')
      .insert({
        user_id: req.user.id,
        scan_type: 'message',
        target: targetLabel,
        risk_score: result.riskScore,
        risk_level: normalizeDbRiskLevel(result.riskLevel),
        threat_status: result.threatStatus,
        recommendation: result.recommendation,
        flags: result.flags || [],
        analysis_result: {
          indicators: result.indicators,
          detectedKeywords: result.detectedKeywords,
          fullContent: content.trim(),
          summary: result.threatStatus
        },
        is_demonstration: false
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase write error (message scan):', error.message);
      return res.status(500).json({ error: 'Failed to persist scan result: ' + error.message });
    }

    return res.status(200).json({
      success: true,
      scan: formatScanRow(data)
    });
  } catch (err) {
    console.error('Message scan error:', err.message);
    return res.status(500).json({ error: 'Internal scanning error. Please try again.' });
  }
};

/**
 * GET /api/scan/history
 * Requires: Authorization: Bearer <token>
 * Query: ?limit=50&offset=0
 */
export const getHistoryHandler = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 100, 200);
    const offset = parseInt(req.query.offset) || 0;
    const dbClient = req.supabase || supabaseAdmin || getUserClient(req.token);

    const { data, error, count } = await dbClient
      .from('scans')
      .select('*', { count: 'exact' })
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('History fetch error:', error.message);
      return res.status(500).json({ error: 'Failed to retrieve scan history.' });
    }

    const formattedHistory = (data || []).map(formatScanRow);

    return res.status(200).json({
      success: true,
      count: count || formattedHistory.length,
      history: formattedHistory
    });
  } catch (err) {
    console.error('History fetch error:', err.message);
    return res.status(500).json({ error: 'Failed to retrieve scan history.' });
  }
};