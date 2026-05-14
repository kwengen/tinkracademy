import Link from 'next/link'

export default function Forside() {
  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <div style={{ background: 'var(--clr-primary-dark)', color: 'white', padding: '5rem 0 4rem' }}>
        <div className="container" style={{ maxWidth: '780px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 .75rem', fontSize: '.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: 'rgba(255,255,255,.6)' }}>
            WengenCMS rammeverk
          </p>
          <h1 style={{ margin: '0 0 1.25rem', fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 800, lineHeight: 1.15, color: 'white' }}>
            Lorem ipsum dolor sit amet
          </h1>
          <p style={{ margin: '0 0 2rem', fontSize: '1.125rem', lineHeight: 1.7, color: 'rgba(255,255,255,.8)', maxWidth: '560px', marginLeft: 'auto', marginRight: 'auto' }}>
            Consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Erstatt denne teksten med din egen.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/artikler" className="btn--primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
              Se artikler
            </Link>
            <Link href="/logg-inn" className="btn--outline" style={{ textDecoration: 'none', display: 'inline-block', color: 'white', borderColor: 'rgba(255,255,255,.4)' }}>
              Logg inn
            </Link>
          </div>
        </div>
      </div>

      {/* ── Innebygd infrastruktur ─────────────────────────────────────────────── */}
      <div className="section section--white">
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p style={{ margin: '0 0 .4rem', fontSize: '.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--clr-accent)' }}>
              Rammeverk
            </p>
            <h2 style={{ margin: '0 0 .75rem', fontSize: 'clamp(1.4rem,3vw,1.875rem)', fontWeight: 800, color: 'var(--clr-text)' }}>
              Alt du trenger er allerede på plass
            </h2>
            <p style={{ margin: 0, fontSize: '.9375rem', color: 'var(--clr-text-secondary)', lineHeight: 1.6 }}>
              Brukerhåndtering, tilgangsnivåer, admin-panel og inline redigering — klar til bruk.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {[
              { tittel: 'Brukerhåndtering', tekst: 'Registrering, innlogging og fire roller: bruker, kommuneadmin, admin og superadmin.', farge: '#1461A8' },
              { tittel: 'Gratis / betalt innhold', tekst: 'Tier-system med gratis, basis og premium. Innhold kan låses per tilgangsnivå.', farge: '#059669' },
              { tittel: 'Inline redigering', tekst: 'Admin kan redigere innhold direkte på siden — uten å gå til et separat adminpanel.', farge: '#7C3AED' },
              { tittel: 'Admin-dashboard', tekst: 'Ferdig dashboard for admin og superadmin med brukerstyring og innholdsadministrasjon.', farge: '#C94B1A' },
              { tittel: 'Supabase + RLS', tekst: 'All data lagres i Supabase. Row Level Security sikrer at brukere bare ser det de har tilgang til.', farge: '#0891b2' },
              { tittel: 'Eksempel-innholdstype', tekst: 'Artikler med seksjoner viser mønsteret for nye innholdstyper — kopier og tilpass.', farge: '#9CA3AF' },
            ].map(k => (
              <div key={k.tittel} style={{
                background: 'white', border: '1px solid var(--clr-border)',
                borderLeft: `4px solid ${k.farge}`, borderRadius: '0 12px 12px 0',
                padding: '1.25rem 1.25rem 1.25rem 1.1rem',
              }}>
                <h3 style={{ margin: '0 0 .4rem', fontSize: '1rem', fontWeight: 700, color: 'var(--clr-text)' }}>{k.tittel}</h3>
                <p style={{ margin: 0, fontSize: '.875rem', lineHeight: 1.6, color: 'var(--clr-text-secondary)' }}>{k.tekst}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Eksempel-innhold ───────────────────────────────────────────────────── */}
      <div className="section" style={{ background: 'var(--clr-primary-light)' }}>
        <div className="container" style={{ maxWidth: '780px', textAlign: 'center' }}>
          <h2 style={{ margin: '0 0 .75rem', fontSize: 'clamp(1.4rem,3vw,1.75rem)', fontWeight: 800, color: 'var(--clr-text)' }}>
            Klar til å bygge?
          </h2>
          <p style={{ margin: '0 0 1.5rem', fontSize: '.9375rem', lineHeight: 1.65, color: 'var(--clr-text-secondary)' }}>
            Se på artiklene for å forstå innholdstype-mønsteret, eller logg inn som admin for å utforske redigeringsgrensesnittet.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/artikler" className="btn--primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
              Se artikler
            </Link>
            <Link href="/dashboard/admin" className="btn--outline" style={{ textDecoration: 'none', display: 'inline-block' }}>
              Admin-panel
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
