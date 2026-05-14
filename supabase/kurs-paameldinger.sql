-- Tinkr Academy – påmeldinger
-- Kjør etter kurs-dynamics.sql

CREATE TABLE IF NOT EXISTS kurs_paameldinger (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kurs_id             UUID NOT NULL REFERENCES kurs(id) ON DELETE CASCADE,
    dynamics_event_id   TEXT NOT NULL,
    navn                TEXT NOT NULL,
    epost               TEXT NOT NULL,
    synced_to_dynamics  BOOLEAN NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_paamelding_kurs    ON kurs_paameldinger(kurs_id);
CREATE INDEX IF NOT EXISTS idx_paamelding_synced  ON kurs_paameldinger(synced_to_dynamics);

ALTER TABLE kurs_paameldinger ENABLE ROW LEVEL SECURITY;

-- Kun admin/superadmin kan lese og administrere
CREATE POLICY "paamelding_admin" ON kurs_paameldinger
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','superadmin'))
    );

-- Service role (webhook) kan skrive uten RLS
GRANT ALL ON kurs_paameldinger TO authenticated;
