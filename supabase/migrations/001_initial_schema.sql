-- =============================================================================
-- NoBait Phishing Detection Platform — Initial Schema
-- Migration: 001_initial_schema.sql
-- Apply via Supabase SQL Editor or supabase db push
-- =============================================================================

-- ---------------------------------------------------------------------------
-- SECTION 1: Helper function for safe admin role checking
-- Uses SECURITY DEFINER with a hardened search_path so it cannot be hijacked
-- by search-path attacks. Fully qualifies all objects.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
DECLARE
  v_role TEXT;
BEGIN
  SELECT role INTO v_role
  FROM public.profiles
  WHERE id = auth.uid();

  RETURN v_role = 'admin';
EXCEPTION WHEN OTHERS THEN
  RETURN FALSE;
END;
$$;

-- Revoke broad access; only authenticated users (via RLS) will call it
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- ---------------------------------------------------------------------------
-- SECTION 2: updated_at auto-update trigger function
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------
-- SECTION 3: profiles table
-- One row per auth.users entry. Role is ONLY set by the signup trigger (see
-- Section 6) to 'user' — never from user-supplied metadata.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT,
  role        TEXT        NOT NULL DEFAULT 'user'
                          CHECK (role IN ('user', 'admin')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.profiles IS
  'Application-level user profile. Role is set server-side only; never trust client input for role assignment.';

COMMENT ON COLUMN public.profiles.role IS
  'Possible values: user (default), admin. Only assignable via trusted server/admin channel.';

-- updated_at trigger
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Index for admin lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- ---------------------------------------------------------------------------
-- SECTION 4: scans table
-- Stores all phishing-analysis results (URL, email, message).
-- risk_level vocabulary is normalised to match BOTH the existing
-- server riskAnalyzer.js (SAFE/LOW/MEDIUM/HIGH) AND the client-side
-- scanner-service.ts (SAFE/SUSPICIOUS/CRITICAL). The DB accepts all five.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.scans (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scan_type        TEXT        NOT NULL CHECK (scan_type IN ('url', 'email', 'message')),
  target           TEXT        NOT NULL,
  risk_score       SMALLINT    NOT NULL CHECK (risk_score BETWEEN 0 AND 100),
  risk_level       TEXT        NOT NULL
                               CHECK (risk_level IN ('SAFE', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'SUSPICIOUS')),
  threat_status    TEXT,
  recommendation   TEXT,
  flags            TEXT[]      NOT NULL DEFAULT '{}',
  analysis_result  JSONB,
  is_demonstration BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.scans IS
  'Phishing analysis results for URL, email, and message scans. user_id is always set from the verified server-side auth token.';

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_scans_user_id    ON public.scans(user_id);
CREATE INDEX IF NOT EXISTS idx_scans_created_at ON public.scans(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scans_risk_level ON public.scans(risk_level);
CREATE INDEX IF NOT EXISTS idx_scans_scan_type  ON public.scans(scan_type);
CREATE INDEX IF NOT EXISTS idx_scans_user_created ON public.scans(user_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- SECTION 5: suspicious_keywords table
-- Admin-managed keyword list for the detection engines.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.suspicious_keywords (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword     TEXT        NOT NULL CHECK (trim(keyword) <> ''),
  category    TEXT        NOT NULL CHECK (category IN ('url', 'email', 'message', 'universal')),
  severity    TEXT        NOT NULL DEFAULT 'medium'
                          CHECK (severity IN ('low', 'medium', 'high')),
  is_active   BOOLEAN     NOT NULL DEFAULT TRUE,
  created_by  UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Prevent duplicate keywords within a category, ignoring case and surrounding spaces
CREATE UNIQUE INDEX IF NOT EXISTS idx_kw_keyword_category_unique
  ON public.suspicious_keywords (lower(trim(keyword)), category);


COMMENT ON TABLE public.suspicious_keywords IS
  'Admin-managed keyword list for the phishing detection engine. Only admins can write; authenticated users can read active entries.';

-- updated_at trigger
CREATE TRIGGER keywords_updated_at
  BEFORE UPDATE ON public.suspicious_keywords
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_kw_active   ON public.suspicious_keywords(is_active);
CREATE INDEX IF NOT EXISTS idx_kw_category ON public.suspicious_keywords(category, is_active);
CREATE INDEX IF NOT EXISTS idx_kw_created_by ON public.suspicious_keywords(created_by);

-- ---------------------------------------------------------------------------
-- SECTION 6: Signup trigger — auto-create profiles row on new user
-- IMPORTANT: Role is always forced to 'user'. The full_name is read from
-- auth metadata only for display purposes. The role column is NOT derived
-- from metadata, preventing privilege escalation via signup metadata.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    -- Safely extract display name from metadata; NULL is fine
    NULLIF(trim(NEW.raw_user_meta_data->>'full_name'), ''),
    -- ALWAYS assign 'user' — never trust metadata for role
    'user'
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Drop and recreate to keep idempotent
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ---------------------------------------------------------------------------
-- SECTION 7: Row Level Security — profiles
-- ---------------------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "profiles: owner can select"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile (name only — NOT role)
-- The WITH CHECK prevents writing a different role value.
CREATE POLICY "profiles: owner can update non-role fields"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
  );

-- Admins can read all profiles (uses the SECURITY DEFINER helper to avoid recursion)
CREATE POLICY "profiles: admins can select all"
  ON public.profiles
  FOR SELECT
  USING (public.is_admin());

-- ---------------------------------------------------------------------------
-- SECTION 8: Row Level Security — scans
-- ---------------------------------------------------------------------------

ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;

-- Users can only insert scans for themselves (enforced server-side too)
CREATE POLICY "scans: owner can insert"
  ON public.scans
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only read their own scans
CREATE POLICY "scans: owner can select"
  ON public.scans
  FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can read all scans
CREATE POLICY "scans: admins can select all"
  ON public.scans
  FOR SELECT
  USING (public.is_admin());

-- Users cannot update or delete their own scans (immutable audit trail)
-- Admins can delete through service-role key (bypasses RLS)

-- ---------------------------------------------------------------------------
-- SECTION 9: Row Level Security — suspicious_keywords
-- ---------------------------------------------------------------------------

ALTER TABLE public.suspicious_keywords ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read active keywords (needed by scanner)
CREATE POLICY "keywords: authenticated users can read active"
  ON public.suspicious_keywords
  FOR SELECT
  TO authenticated
  USING (is_active = TRUE);

-- Admins can read all keywords (including inactive)
CREATE POLICY "keywords: admins can read all"
  ON public.suspicious_keywords
  FOR SELECT
  USING (public.is_admin());

-- Only admins can insert
CREATE POLICY "keywords: admins can insert"
  ON public.suspicious_keywords
  FOR INSERT
  WITH CHECK (public.is_admin());

-- Only admins can update
CREATE POLICY "keywords: admins can update"
  ON public.suspicious_keywords
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Only admins can delete
CREATE POLICY "keywords: admins can delete"
  ON public.suspicious_keywords
  FOR DELETE
  USING (public.is_admin());

-- =============================================================================
-- END OF MIGRATION 001
-- =============================================================================
