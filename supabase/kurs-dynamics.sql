-- Tinkr Academy – Dynamics 365 integrasjon
-- Kjør etter kurs.sql (idempotent)

-- Legg til dynamics_id for å spore hvilken Dynamics-event kurset kommer fra
ALTER TABLE kurs ADD COLUMN IF NOT EXISTS dynamics_id TEXT UNIQUE;
CREATE INDEX IF NOT EXISTS idx_kurs_dynamics_id ON kurs(dynamics_id);

-- Utvid kategori-feltet til å akseptere Dynamics-verdier
-- (fjerner den gamle CHECK-begrensningen og erstatter med en bredere liste)
ALTER TABLE kurs DROP CONSTRAINT IF EXISTS kurs_kategori_check;
ALTER TABLE kurs ADD CONSTRAINT kurs_kategori_check
    CHECK (kategori IN (
        'Lederskap',
        'Kultur',
        'Struktur',
        'Metode',
        'Introduksjon til innovasjonsledelse',
        'Prosess',
        'Ressurser',
        'Strategi'
    ));
