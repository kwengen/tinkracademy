import type { Metadata } from 'next'
import Link from 'next/link'
import { fetchArtikler } from '@/lib/artikler-cms'

export const metadata: Metadata = {
  title: 'Artikler',
}

export default async function ArtiklerPage() {
  const artikler = await fetchArtikler()

  return (
    <div>
      {/* Hero */}
      <div style={{ background: 'var(--clr-primary-dark)', color: 'white', padding: '2.5rem 0 2rem' }}>
        <div className="container" style={{ maxWidth: '860px' }}>
          <h1 style={{ margin: 0, fontSize: 'clamp(1.5rem,4vw,2.25rem)', fontWeight: 800, color: 'white' }}>
            Artikler
          </h1>
          <p style={{ margin: '.5rem 0 0', color: 'rgba(255,255,255,.75)', fontSize: '1rem', lineHeight: 1.6 }}>
            Lorem ipsum – erstatt denne beskrivelsen med din kategori-tekst.
          </p>
        </div>
      </div>

      {/* Liste */}
      <div className="section section--white">
        <div className="container" style={{ maxWidth: '860px' }}>
          {artikler.length === 0 ? (
            <p style={{ color: 'var(--clr-text-secondary)', fontStyle: 'italic' }}>
              Ingen artikler publisert ennå. Legg til innhold i admin-panelet.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {artikler.map(a => (
                <Link
                  key={a.id}
                  href={`/artikler/${a.slug}`}
                  style={{
                    display: 'block', textDecoration: 'none',
                    background: 'white', border: '1px solid var(--clr-border)',
                    borderRadius: '12px', padding: '1.25rem 1.5rem',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  {a.tier !== 'gratis' && (
                    <span style={{
                      display: 'inline-block', marginBottom: '.5rem',
                      background: '#dbeafe', color: '#1d4ed8',
                      fontSize: '.68rem', fontWeight: 700, textTransform: 'uppercase',
                      letterSpacing: '.05em', padding: '.15rem .5rem', borderRadius: '999px',
                    }}>
                      {a.tier === 'basis' ? 'Abonnement' : 'Premium'}
                    </span>
                  )}
                  <h2 style={{ margin: '0 0 .4rem', fontSize: '1.0625rem', fontWeight: 700, color: 'var(--clr-text)' }}>
                    {a.tittel}
                  </h2>
                  {a.ingress && (
                    <p style={{ margin: 0, fontSize: '.9rem', lineHeight: 1.6, color: 'var(--clr-text-secondary)' }}>
                      {a.ingress}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
