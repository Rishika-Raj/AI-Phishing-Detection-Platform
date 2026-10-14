import { supabase, supabaseAdmin, getUserClient } from '../utils/supabase.js';

/**
 * GET /api/keywords
 * Returns keywords list.
 * Authenticated users get active keywords.
 * Admins can pass ?all=true to get active and inactive keywords.
 */
export const getKeywordsHandler = async (req, res) => {
  try {
    const dbClient = req.supabase || supabaseAdmin || getUserClient(req.token);
    const category = req.query.category;
    const includeAll = req.query.all === 'true' && req.userRole === 'admin';

    let query = dbClient
      .from('suspicious_keywords')
      .select('*')
      .order('created_at', { ascending: false });

    if (!includeAll) {
      query = query.eq('is_active', true);
    }

    if (category && ['url', 'email', 'message', 'universal'].includes(category)) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching keywords:', error.message);
      return res.status(500).json({ error: 'Failed to retrieve keywords.' });
    }

    return res.status(200).json({
      success: true,
      keywords: data || []
    });
  } catch (err) {
    console.error('Keywords fetch error:', err.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * POST /api/keywords
 * Admin only.
 * Body: { keyword: string, category: string, severity?: string, is_active?: boolean }
 */
export const createKeywordHandler = async (req, res) => {
  try {
    const { keyword, category, severity = 'medium', is_active = true } = req.body;

    if (!keyword || typeof keyword !== 'string' || !keyword.trim()) {
      return res.status(400).json({ error: 'Keyword is required and cannot be empty.' });
    }

    if (!category || !['url', 'email', 'message', 'universal'].includes(category)) {
      return res.status(400).json({ error: 'Valid category is required (url, email, message, universal).' });
    }

    if (!['low', 'medium', 'high'].includes(severity)) {
      return res.status(400).json({ error: 'Valid severity is required (low, medium, high).' });
    }

    const dbClient = req.supabase || supabaseAdmin || getUserClient(req.token);

    const { data, error } = await dbClient
      .from('suspicious_keywords')
      .insert({
        keyword: keyword.trim().toLowerCase(),
        category,
        severity,
        is_active: Boolean(is_active),
        created_by: req.user.id
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({ error: 'This keyword already exists in this category.' });
      }
      return res.status(500).json({ error: 'Failed to create keyword: ' + error.message });
    }

    return res.status(201).json({
      success: true,
      keyword: data
    });
  } catch (err) {
    console.error('Keyword creation error:', err.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * PATCH /api/keywords/:id
 * Admin only.
 * Body: { keyword?: string, category?: string, severity?: string, is_active?: boolean }
 */
export const updateKeywordHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { keyword, category, severity, is_active } = req.body;

    const updates = {};
    if (keyword && typeof keyword === 'string') updates.keyword = keyword.trim().toLowerCase();
    if (category && ['url', 'email', 'message', 'universal'].includes(category)) updates.category = category;
    if (severity && ['low', 'medium', 'high'].includes(severity)) updates.severity = severity;
    if (typeof is_active === 'boolean') updates.is_active = is_active;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid update fields provided.' });
    }

    const dbClient = req.supabase || supabaseAdmin || getUserClient(req.token);

    const { data, error } = await dbClient
      .from('suspicious_keywords')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to update keyword: ' + error.message });
    }

    return res.status(200).json({
      success: true,
      keyword: data
    });
  } catch (err) {
    console.error('Keyword update error:', err.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * DELETE /api/keywords/:id
 * Admin only.
 */
export const deleteKeywordHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const dbClient = req.supabase || supabaseAdmin || getUserClient(req.token);

    const { error } = await dbClient
      .from('suspicious_keywords')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({ error: 'Failed to delete keyword: ' + error.message });
    }

    return res.status(200).json({
      success: true,
      message: 'Keyword removed successfully.'
    });
  } catch (err) {
    console.error('Keyword deletion error:', err.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
