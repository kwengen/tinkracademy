-- Legg til rolle-kolonne i profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'bruker'
  CHECK (role IN ('superadmin', 'admin', 'kommuneadmin', 'bruker'));

-- Hjelpefunksjon som henter rolle uten RLS-rekursjon
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT role FROM profiles WHERE id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION get_user_org()
RETURNS UUID LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT organization_id FROM profiles WHERE id = auth.uid()
$$;

-- Oppdater trigger: ta med rolle ved registrering
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    org_id UUID;
    org_tier TEXT;
    email_domain TEXT;
BEGIN
    email_domain := split_part(NEW.email, '@', 2);
    SELECT id, tier INTO org_id, org_tier
    FROM organizations
    WHERE domain = email_domain
    LIMIT 1;

    INSERT INTO profiles (id, name, organization_id, tier, role)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'name',
        org_id,
        COALESCE(org_tier, 'gratis'),
        'bruker'
    );
    RETURN NEW;
END;
$$;

-- ============================================================
-- RLS-policyer for profiles
-- ============================================================
DROP POLICY IF EXISTS "Les egen profil" ON profiles;
DROP POLICY IF EXISTS "Oppdater egen profil" ON profiles;

-- Alle kan lese sin egen profil
CREATE POLICY "Les egen profil" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- Superadmin ser alle profiler
CREATE POLICY "Superadmin ser alle profiler" ON profiles
    FOR SELECT USING (get_user_role() = 'superadmin');

-- Superadmin og admin kan oppdatere alle profiler
CREATE POLICY "Superadmin oppdaterer alle profiler" ON profiles
    FOR UPDATE USING (get_user_role() IN ('superadmin', 'admin'));

-- Kommuneadmin ser sin kommunes brukere
CREATE POLICY "Kommuneadmin ser sin kommunes brukere" ON profiles
    FOR SELECT USING (
        get_user_role() IN ('kommuneadmin', 'admin', 'superadmin')
        AND organization_id = get_user_org()
    );

-- Bruker oppdaterer sin egen profil
CREATE POLICY "Bruker oppdaterer egen profil" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- ============================================================
-- RLS-policyer for tiltak (innholdsadministrasjon)
-- ============================================================
-- Admin og superadmin kan legge til tiltak
CREATE POLICY "Admin oppretter tiltak" ON tiltak
    FOR INSERT WITH CHECK (get_user_role() IN ('admin', 'superadmin'));

-- Admin og superadmin kan oppdatere tiltak
CREATE POLICY "Admin oppdaterer tiltak" ON tiltak
    FOR UPDATE USING (get_user_role() IN ('admin', 'superadmin'));

-- Superadmin kan slette tiltak
CREATE POLICY "Superadmin sletter tiltak" ON tiltak
    FOR DELETE USING (get_user_role() = 'superadmin');

-- ============================================================
-- Gi anon-bruker tilgang til profiles (for auth-sjekker)
-- ============================================================
GRANT SELECT ON profiles TO authenticated;
GRANT UPDATE ON profiles TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_role() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_user_org() TO authenticated, anon;
