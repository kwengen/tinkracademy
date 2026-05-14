-- Tinkr Academy – oppdater påmeldinger: navn → fornavn + etternavn
ALTER TABLE kurs_paameldinger ADD COLUMN IF NOT EXISTS fornavn TEXT;
ALTER TABLE kurs_paameldinger ADD COLUMN IF NOT EXISTS etternavn TEXT;

-- Migrer eksisterende data (sett fornavn = navn)
UPDATE kurs_paameldinger SET fornavn = navn WHERE fornavn IS NULL;

-- Gjør kolonnene NOT NULL etter migrering
ALTER TABLE kurs_paameldinger ALTER COLUMN fornavn SET NOT NULL;
ALTER TABLE kurs_paameldinger ALTER COLUMN etternavn SET DEFAULT '';
