import Link from 'next/link'
import { fetchAlleArtikler } from '@/lib/artikler-cms'

export const dynamic = 'force-dynamic'

export default async function AdminOversiktPage() {
  const artikler = await fetchAlleArtikler()
  const publiserte  = artikler.filter(a => a.published).length
  const upubliserte = artikler.filter(a => !a.published).length

  return (
    <div>
      <h1 style={{ margin: '0 0 1.5rem', fontSize: '1.375rem', fontWeight: 800, color: 'var(--clr-text)' }}>
        Admin-oversikt
      </h1>

      {/* Statistikk-kort */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Publiserte artikler', verdi: publiserte,  farge: '#059669' },
          { label: 'Upubliserte utkast',  verdi: upubliserte, farge: '#9CA3AF' },
        ].map(k => (
          <div key={k.label} style={{
            background: 'white', border: '1px solid var(--clr-border)',
            borderRadius: '12px', padding: '1.25rem',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: k.farge, lineHeight: 1 }}>
              {k.verdi}
            </div>
            <div style={{ marginTop: '.4rem', fontSize: '.875rem', color: 'var(--clr-text-secondary)' }}>
              {k.label}
            </div>
          </div>
        ))}
      </div>

      {/* Hurtiglenker */}
      <h2 style={{ margin: '0 0 .75rem', fontSize: '1rem', fontWeight: 700, color: 'var(--clr-text)' }}>
        Innholdstyper
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem', maxWidth: '400px' }}>
        <Link
          href="/dashboard/admin/artikler"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '.875rem 1.25rem',
            background: 'white', border: '1px solid var(--clr-border)',
            borderRadius: '10px', textDecoration: 'none',
            color: 'var(--clr-text)', fontWeight: 600, fontSize: '.9375rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <span>Artikler</span>
          <span style={{ color: 'var(--clr-text-secondary)', fontSize: '.875rem' }}>
            {artikler.length} totalt →
          </span>
        </Link>
      </div>

      <p style={{ marginTop: '2rem', fontSize: '.875rem', color: 'var(--clr-text-secondary)', lineHeight: 1.65 }}>
        Dette er eksempel-dashbordet i WengenCMS. Legg til nye innholdstyper ved å kopiere mønsteret fra
        {' '}<code style={{ background: 'var(--clr-primary-light)', padding: '.1rem .35rem', borderRadius: '4px' }}>
          dashboard/admin/artikler/
        </code>.
      </p>
    </div>
  )
}
