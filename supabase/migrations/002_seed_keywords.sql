-- =============================================================================
-- NoBait Phishing Detection Platform — Seed Suspicious Keywords
-- Migration: 002_seed_keywords.sql
-- Seeds the initial keyword list from the existing hardcoded arrays in
-- urlRuleEngine.js and scanner-service.ts. Admin can manage these via UI.
-- Apply AFTER migration 001_initial_schema.sql.
-- =============================================================================

-- URL-specific suspicious keywords (from server urlRuleEngine.js + client scanner-service.ts)
INSERT INTO public.suspicious_keywords (keyword, category, severity, is_active)
VALUES
  ('paypal',    'url', 'high',   TRUE),
  ('bank',      'url', 'high',   TRUE),
  ('secure',    'url', 'medium', TRUE),
  ('login',     'url', 'high',   TRUE),
  ('verify',    'url', 'high',   TRUE),
  ('update',    'url', 'medium', TRUE),
  ('signin',    'url', 'high',   TRUE),
  ('wallet',    'url', 'high',   TRUE),
  ('free',      'url', 'low',    TRUE),
  ('account',   'url', 'medium', TRUE),
  ('auth',      'url', 'medium', TRUE),
  ('billing',   'url', 'medium', TRUE),
  ('portal',    'url', 'low',    TRUE),
  ('security',  'url', 'medium', TRUE),
  ('resolve',   'url', 'low',    TRUE),
  ('invoice',   'url', 'medium', TRUE),
  ('apple',     'url', 'high',   TRUE),
  ('wells',     'url', 'high',   TRUE),
  ('banking',   'url', 'high',   TRUE)
ON CONFLICT (lower(trim(keyword)), category) DO NOTHING;

-- Email-specific suspicious keywords (urgency language)
INSERT INTO public.suspicious_keywords (keyword, category, severity, is_active)
VALUES
  ('urgent',               'email', 'high',   TRUE),
  ('suspended',            'email', 'high',   TRUE),
  ('immediately',          'email', 'high',   TRUE),
  ('within 24 hours',      'email', 'high',   TRUE),
  ('termination',          'email', 'high',   TRUE),
  ('restricted',           'email', 'medium', TRUE),
  ('freeze',               'email', 'high',   TRUE),
  ('overdue',              'email', 'medium', TRUE),
  ('action required',      'email', 'high',   TRUE),
  ('unauthorized',         'email', 'high',   TRUE),
  ('permanent termination','email', 'high',   TRUE),
  ('account locked',       'email', 'high',   TRUE),
  ('password',             'email', 'high',   TRUE),
  ('two-factor',           'email', 'high',   TRUE),
  ('2fa',                  'email', 'high',   TRUE),
  ('otp',                  'email', 'high',   TRUE),
  ('verify your identity', 'email', 'high',   TRUE),
  ('wire transfer',        'email', 'high',   TRUE),
  ('payment',              'email', 'medium', TRUE),
  ('credentials',          'email', 'high',   TRUE),
  ('collection fees',      'email', 'medium', TRUE)
ON CONFLICT (lower(trim(keyword)), category) DO NOTHING;

-- Message/SMS-specific suspicious keywords
INSERT INTO public.suspicious_keywords (keyword, category, severity, is_active)
VALUES
  ('verify credentials', 'message', 'high',   TRUE),
  ('restricted',         'message', 'high',   TRUE),
  ('verify your identity','message','high',   TRUE),
  ('card',               'message', 'medium', TRUE),
  ('invoice',            'message', 'medium', TRUE),
  ('payment',            'message', 'medium', TRUE),
  ('password',           'message', 'high',   TRUE),
  ('otp',                'message', 'high',   TRUE),
  ('urgent',             'message', 'high',   TRUE),
  ('suspended',          'message', 'high',   TRUE)
ON CONFLICT (lower(trim(keyword)), category) DO NOTHING;

-- Universal keywords (applicable across all scan types)
INSERT INTO public.suspicious_keywords (keyword, category, severity, is_active)
VALUES
  ('phishing',   'universal', 'high',   TRUE),
  ('scam',       'universal', 'high',   TRUE),
  ('malware',    'universal', 'high',   TRUE),
  ('ransomware', 'universal', 'high',   TRUE)
ON CONFLICT (lower(trim(keyword)), category) DO NOTHING;

-- =============================================================================
-- END OF MIGRATION 002
-- =============================================================================
