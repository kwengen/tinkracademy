-- Legg til nye felt for påmeldingsskjema
ALTER TABLE kurs_paameldinger ADD COLUMN IF NOT EXISTS organisasjon    TEXT NOT NULL DEFAULT '';
ALTER TABLE kurs_paameldinger ADD COLUMN IF NOT EXISTS stilling        TEXT NOT NULL DEFAULT '';
ALTER TABLE kurs_paameldinger ADD COLUMN IF NOT EXISTS kommentar       TEXT NOT NULL DEFAULT '';
ALTER TABLE kurs_paameldinger ADD COLUMN IF NOT EXISTS betalingsmetode TEXT NOT NULL DEFAULT 'kort';
