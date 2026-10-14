import { supabase, supabaseAdmin, getUserClient } from '../utils/supabase.js';
import { formatScanRow } from './scanController.js';

/**
 * GET /api/admin/scans
 * Admin only.
 * Returns scans across all users.
 */
export const getAllScansAdminHandler = async (req, res) => {
  try {
    const dbClient = req.supabase || supabaseAdmin || getUserClient(req.token);
    const limit = Math.min(parseInt(req.query.limit) || 100, 250);
    const offset = parseInt(req.query.offset) || 0;

    const { data, error, count } = await dbClient
      .from('scans')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Admin scans fetch error:', error.message);
      return res.status(500).json({ error: 'Failed to retrieve admin scans: ' + error.message });
    }

    const formattedScans = (data || []).map(formatScanRow);

    return res.status(200).json({
      success: true,
      count: count || formattedScans.length,
      scans: formattedScans
    });
  } catch (err) {
    console.error('Admin scans handler error:', err.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * GET /api/admin/stats
 * Admin only.
 * Aggregates live system-wide metrics directly from database.
 */
export const getAdminStatsHandler = async (req, res) => {
  try {
    const dbClient = req.supabase || supabaseAdmin || getUserClient(req.token);

    const { data: scans, error } = await dbClient
      .from('scans')
      .select('id, scan_type, risk_score, risk_level, threat_status, analysis_result, created_at');

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch scan metrics: ' + error.message });
    }

    const all = scans || [];
    const totalScans = all.length;
    const criticalScans = all.filter(s => s.risk_score >= 60 || s.risk_level === 'CRITICAL' || s.risk_level === 'HIGH').length;
    const suspiciousScans = all.filter(s => (s.risk_score >= 25 && s.risk_score < 60) || s.risk_level === 'SUSPICIOUS' || s.risk_level === 'MEDIUM').length;
    const safeScans = all.filter(s => s.risk_score < 25 || s.risk_level === 'SAFE' || s.risk_level === 'LOW').length;

    const urlScans = all.filter(s => s.scan_type === 'url').length;
    const emailScans = all.filter(s => s.scan_type === 'email').length;
    const messageScans = all.filter(s => s.scan_type === 'message').length;

    const avgRiskScore = totalScans > 0
      ? Math.round(all.reduce((acc, curr) => acc + (curr.risk_score || 0), 0) / totalScans)
      : 0;

    // Aggregate keyword frequencies
    const keywordMap = {};
    all.forEach(s => {
      const kws = s.analysis_result?.detectedKeywords || [];
      kws.forEach(kw => {
        if (kw && typeof kw === 'string') {
          const norm = kw.trim();
          keywordMap[norm] = (keywordMap[norm] || 0) + 1;
        }
      });
    });

    const topKeywords = Object.entries(keywordMap)
      .map(([keyword, count]) => ({
        keyword,
        count,
        percentage: totalScans > 0 ? Math.round((count / totalScans) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return res.status(200).json({
      success: true,
      stats: {
        totalScans,
        criticalScans,
        suspiciousScans,
        safeScans,
        avgRiskScore,
        vectors: {
          url: urlScans,
          email: emailScans,
          message: messageScans
        },
        topKeywords
      }
    });
  } catch (err) {
    console.error('Admin stats calculation error:', err.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * GET /api/admin/users
 * Admin only.
 * Lists registered user profiles.
 */
export const getUsersAdminHandler = async (req, res) => {
  try {
    const dbClient = req.supabase || supabaseAdmin || getUserClient(req.token);

    const { data: profiles, error } = await dbClient
      .from('profiles')
      .select('id, full_name, role, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch user profiles: ' + error.message });
    }

    return res.status(200).json({
      success: true,
      users: profiles || []
    });
  } catch (err) {
    console.error('Admin users error:', err.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
