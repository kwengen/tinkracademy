-- WengenCMS – kjerneskjema
-- Kjør dette i Supabase SQL Editor (idempotent)

-- ── Organisasjoner ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS organizations (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name       TEXT NOT NULL,
    domain     TEXT NOT NULL UNIQUE,
    tier       TEXT NOT NULL DEFAULT 'gratis' CHECK (tier IN ('gratis','basis','premium')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_org_domain ON organizations(domain);

-- ── Brukerprofiler ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
    id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name            TEXT,
    organization_id UUID REFERENCES organizations(id),
    tier            TEXT NOT NULL DEFAULT 'gratis' CHECK (tier IN ('gratis','basis','premium')),
    role            TEXT NOT NULL DEFAULT 'bruker'
                    CHECK (role IN ('bruker','kommuneadmin','admin','superadmin')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── RLS ───────────────────────────────────────────────────────────────────────
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles      ENABLE ROW LEVEL SECURITY;

-- Hjelpefunksjon: henter rolle uten RLS-rekursjon
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT role FROM profiles WHERE id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION get_user_org()
RETURNS UUID LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT organization_id FROM profiles WHERE id = auth.uid()
$$;

-- Profiles-policyer
DROP POLICY IF EXISTS "profiles_les_egen"       ON profiles;
DROP POLICY IF EXISTS "profiles_superadmin_les" ON profiles;
DROP POLICY IF EXISTS "profiles_admin_oppdater" ON profiles;
DROP POLICY IF EXISTS "profiles_bruker_oppdater" ON profiles;

CREATE POLICY "profiles_les_egen"       ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_superadmin_les" ON profiles FOR SELECT USING (get_user_role() = 'superadmin');
CREATE POLICY "profiles_admin_oppdater" ON profiles FOR UPDATE  USING (get_user_role() IN ('admin','superadmin'));
CREATE POLICY "profiles_bruker_oppdater" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Organizations: kun admin kan se/redigere
CREATE POLICY "organizations_admin" ON organizations
  FOR ALL TO authenticated USING (get_user_role() IN ('admin','superadmin'));

-- Grants
GRANT SELECT, UPDATE ON profiles      TO authenticated;
GRANT SELECT, UPDATE ON organizations TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_role() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_user_org()  TO authenticated, anon;

-- ── Trigger: opprett profil ved registrering ──────────────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    org_id   UUID;
    org_tier TEXT;
    dom      TEXT;
BEGIN
    dom := split_part(NEW.email, '@', 2);
    SELECT id, tier INTO org_id, org_tier FROM organizations WHERE domain = dom LIMIT 1;
    INSERT INTO profiles (id, name, organization_id, tier, role)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'name', org_id, COALESCE(org_tier,'gratis'), 'bruker')
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ── Eksempel-organisasjon ─────────────────────────────────────────────────────
INSERT INTO organizations (name, domain, tier) VALUES
    ('Eksempelorg', 'eksempel.no', 'premium')
ON CONFLICT (domain) DO NOTHING;
