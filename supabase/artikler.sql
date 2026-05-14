-- WengenCMS – artikler (eksempel-innholdstype)
-- Kjør etter schema.sql (idempotent)

-- ── Tabeller ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS artikler (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tittel     TEXT NOT NULL,
    slug       TEXT NOT NULL UNIQUE,
    ingress    TEXT,
    tier       TEXT NOT NULL DEFAULT 'gratis' CHECK (tier IN ('gratis','basis','premium')),
    published  BOOLEAN NOT NULL DEFAULT FALSE,
    sortering  INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS artikkel_seksjoner (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artikkel_id UUID NOT NULL REFERENCES artikler(id) ON DELETE CASCADE,
    type        TEXT NOT NULL CHECK (type IN ('tekst','liste','lenker')),
    tittel      TEXT,
    innhold     TEXT,
    meta        JSONB NOT NULL DEFAULT '{}',
    sortering   INTEGER NOT NULL DEFAULT 0,
    published   BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_artikler_slug      ON artikler(slug);
CREATE INDEX IF NOT EXISTS idx_artikler_published ON artikler(published);
CREATE INDEX IF NOT EXISTS idx_artsek_artikkel    ON artikkel_seksjoner(artikkel_id);

-- ── RLS ───────────────────────────────────────────────────────────────────────
ALTER TABLE artikler          ENABLE ROW LEVEL SECURITY;
ALTER TABLE artikkel_seksjoner ENABLE ROW LEVEL SECURITY;

-- Alle kan lese publiserte artikler
CREATE POLICY "artikler_les" ON artikler
    FOR SELECT USING (published = true);

-- Alle kan lese publiserte seksjoner
CREATE POLICY "artsek_les" ON artikkel_seksjoner
    FOR SELECT USING (published = true);

-- Admin og superadmin kan gjøre alt
CREATE POLICY "artikler_admin" ON artikler
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','superadmin'))
    );

CREATE POLICY "artsek_admin" ON artikkel_seksjoner
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','superadmin'))
    );

-- ── Grants ────────────────────────────────────────────────────────────────────
GRANT SELECT ON artikler           TO anon;
GRANT ALL    ON artikler           TO authenticated;
GRANT SELECT ON artikkel_seksjoner TO anon;
GRANT ALL    ON artikkel_seksjoner TO authenticated;
