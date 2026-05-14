-- WengenCMS – eksempel-seed for artikler
-- Idempotent (ON CONFLICT DO NOTHING)

INSERT INTO artikler (tittel, slug, ingress, tier, published, sortering) VALUES
  (
    'Kom i gang med WengenCMS',
    'kom-i-gang',
    'En rask introduksjon til rammeverket – innholdstyper, roller og administrasjon.',
    'gratis', true, 10
  ),
  (
    'Slik fungerer tier-systemet',
    'tier-systemet',
    'Gratis, abonnement og premium – lær hvordan tilgangsnivåer styrer hva brukerne ser.',
    'gratis', true, 20
  ),
  (
    'Inline redigering for admin',
    'inline-redigering',
    'Admin kan redigere innhold direkte på siden uten å gå til et separat admin-panel.',
    'basis', true, 30
  ),
  (
    'Legg til ny innholdstype',
    'ny-innholdstype',
    'Trinn for trinn: slik kopierer du artikkel-mønsteret og lager din egen innholdstype.',
    'gratis', false, 40
  )
ON CONFLICT (slug) DO NOTHING;

-- ── Seksjoner for artikkel 1 ──────────────────────────────────────────────────
INSERT INTO artikkel_seksjoner (artikkel_id, type, tittel, innhold, meta, sortering)
SELECT
    a.id,
    'tekst',
    'Hva er WengenCMS?',
    '<p>WengenCMS er et Next.js-basert rammeverk med Supabase-backend. Det inkluderer ferdig brukerhåndtering, fire roller, tier-system og inline redigering – slik at du kan fokusere på domeneinnholdet.</p>',
    '{}',
    10
FROM artikler a WHERE a.slug = 'kom-i-gang'
ON CONFLICT DO NOTHING;

INSERT INTO artikkel_seksjoner (artikkel_id, type, tittel, innhold, meta, sortering)
SELECT
    a.id,
    'liste',
    'Hva er inkludert?',
    null,
    '{"punkter": [
        "Brukerhåndtering med Supabase Auth",
        "Fire roller: bruker, kommuneadmin, admin og superadmin",
        "Tier-system: gratis, abonnement og premium",
        "Inline redigering med EditModeContext",
        "Admin-dashboard med sidebar-navigasjon",
        "Eksempel-innholdstype: Artikler"
    ]}',
    20
FROM artikler a WHERE a.slug = 'kom-i-gang'
ON CONFLICT DO NOTHING;

-- ── Seksjoner for artikkel 2 ──────────────────────────────────────────────────
INSERT INTO artikkel_seksjoner (artikkel_id, type, tittel, innhold, meta, sortering)
SELECT
    a.id,
    'tekst',
    'Tre tilgangsnivåer',
    '<p>Innhold kan merkes som <strong>gratis</strong>, <strong>abonnement (basis)</strong> eller <strong>premium</strong>. Gratis innhold er tilgjengelig for alle. Betalt innhold vises kun for brukere med riktig tier på sin profil eller organisasjon.</p>',
    '{}',
    10
FROM artikler a WHERE a.slug = 'tier-systemet'
ON CONFLICT DO NOTHING;

INSERT INTO artikkel_seksjoner (artikkel_id, type, tittel, innhold, meta, sortering)
SELECT
    a.id,
    'tekst',
    'Tier arves fra organisasjonen',
    '<p>Når en bruker registrerer seg med en e-postadresse som matcher en organisasjons domene, arver profilen automatisk organisasjonens tier. Du kan overstyre dette manuelt i superadmin-panelet.</p>',
    '{}',
    20
FROM artikler a WHERE a.slug = 'tier-systemet'
ON CONFLICT DO NOTHING;

-- ── Seksjoner for artikkel 3 ──────────────────────────────────────────────────
INSERT INTO artikkel_seksjoner (artikkel_id, type, tittel, innhold, meta, sortering)
SELECT
    a.id,
    'tekst',
    'Aktiver redigeringsmodus',
    '<p>Admin og superadmin ser en «Rediger»-knapp i navigasjonsmenyen. Klikk på den for å aktivere redigeringsmodus. Deretter kan du klikke på tekster og seksjoner direkte på siden for å redigere dem.</p>',
    '{}',
    10
FROM artikler a WHERE a.slug = 'inline-redigering'
ON CONFLICT DO NOTHING;

INSERT INTO artikkel_seksjoner (artikkel_id, type, tittel, innhold, meta, sortering)
SELECT
    a.id,
    'lenker',
    'Relevante komponenter',
    null,
    '{"lenker": [
        {"tittel": "EditModeContext.tsx – global toggle for redigeringsmodus", "href": "#"},
        {"tittel": "InlineEdit.tsx – klikk-for-å-redigere komponent", "href": "#"},
        {"tittel": "AdminEditBar.tsx – flytende admin-stripe", "href": "#"}
    ]}',
    20
FROM artikler a WHERE a.slug = 'inline-redigering'
ON CONFLICT DO NOTHING;
