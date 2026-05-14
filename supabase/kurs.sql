-- Tinkr Academy – kurs (innholdstype)
-- Kjør etter schema.sql (idempotent)

-- ── Tabeller ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS kurs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    num             TEXT NOT NULL DEFAULT '',
    tittel          TEXT NOT NULL,
    slug            TEXT NOT NULL UNIQUE,
    ingress         TEXT,
    kategori        TEXT NOT NULL DEFAULT 'Lederskap'
                        CHECK (kategori IN ('Lederskap','Kultur','Struktur','Metode')),
    sted            TEXT,
    varighet        TEXT,
    pris_ou         TEXT,
    pris_full       TEXT,
    datoer_tekst    TEXT,
    intro           TEXT,
    about_tekst     JSONB NOT NULL DEFAULT '[]',
    for_hvem        TEXT,
    laringsutbytter JSONB NOT NULL DEFAULT '[]',
    innhold_avsnitt JSONB NOT NULL DEFAULT '[]',
    oppfolging      TEXT,
    prinsipper      JSONB NOT NULL DEFAULT '[]',
    max_deltakere   TEXT,
    ou_godkjent     BOOLEAN NOT NULL DEFAULT FALSE,
    published       BOOLEAN NOT NULL DEFAULT FALSE,
    sortering       INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kurs_datoer (
    id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kurs_id   UUID NOT NULL REFERENCES kurs(id) ON DELETE CASCADE,
    maaned    TEXT NOT NULL,
    dag       TEXT NOT NULL,
    label     TEXT NOT NULL,
    tid       TEXT,
    sortering INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_kurs_slug      ON kurs(slug);
CREATE INDEX IF NOT EXISTS idx_kurs_published ON kurs(published);
CREATE INDEX IF NOT EXISTS idx_kursdato_kurs  ON kurs_datoer(kurs_id);

-- ── RLS ───────────────────────────────────────────────────────────────────────
ALTER TABLE kurs        ENABLE ROW LEVEL SECURITY;
ALTER TABLE kurs_datoer ENABLE ROW LEVEL SECURITY;

CREATE POLICY "kurs_les" ON kurs
    FOR SELECT USING (published = true);

CREATE POLICY "kursdato_les" ON kurs_datoer
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM kurs WHERE id = kurs_datoer.kurs_id AND published = true)
    );

CREATE POLICY "kurs_admin" ON kurs
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','superadmin'))
    );

CREATE POLICY "kursdato_admin" ON kurs_datoer
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','superadmin'))
    );

-- ── Grants ────────────────────────────────────────────────────────────────────
GRANT SELECT ON kurs        TO anon;
GRANT ALL    ON kurs        TO authenticated;
GRANT SELECT ON kurs_datoer TO anon;
GRANT ALL    ON kurs_datoer TO authenticated;
