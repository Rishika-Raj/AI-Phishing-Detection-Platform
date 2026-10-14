import { supabase, supabaseAdmin, getUserClient } from '../utils/supabase.js';

/**
 * requireAuth — Express middleware that validates a Supabase Bearer token.
 *
 * 1. Extracts the token from the Authorization header.
 * 2. Verifies it via supabase.auth.getUser() (server-side, never trusts client claims).
 * 3. Attaches the verified user to req.user, req.token, and req.supabase.
 * 4. Rejects requests with missing, expired, or invalid tokens with 401.
 *
 * IMPORTANT: Never trust userId from req.body, req.query, or custom headers.
 * Always use req.user.id set by this middleware.
 */
export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Authentication required. Provide a valid Bearer token.'
    });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Bearer token is empty.' });
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        error: 'Invalid or expired authentication token. Please sign in again.'
      });
    }

    // Attach verified user identity and scoped client for database operations
    req.user = user;
    req.token = token;
    req.supabase = supabaseAdmin || getUserClient(token);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token verification failed: ' + err.message });
  }
}

/**
 * requireAdmin — Express middleware that verifies the authenticated user is an admin.
 * Must be used AFTER requireAuth (depends on req.user being set).
 */
export async function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  try {
    const dbClient = supabaseAdmin || getUserClient(req.token);
    const { data: profile, error } = await dbClient
      .from('profiles')
      .select('role')
      .eq('id', req.user.id)
      .single();

    if (error || !profile) {
      return res.status(403).json({ error: 'Could not verify user permissions.' });
    }

    if (profile.role !== 'admin') {
      return res.status(403).json({ error: 'Admin privileges required.' });
    }

    req.userRole = 'admin';
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Authorization error: ' + err.message });
  }
}
