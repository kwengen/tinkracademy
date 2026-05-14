import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { fetchArtikkelBySlug } from '@/lib/artikler-cms'
import type { ArtikkelSeksjon } from '@/lib/artikler-cms'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const artikkel = await fetchArtikkelBySlug(slug)
  if (!artikkel) return { title: 'Ikke funnet' }
  return { title: artikkel.tittel }
}

function SeksjonVis({ sek }: { sek: ArtikkelSeksjon }) {
  switch (sek.type) {
    case 'tekst':
      return (
        <div style={{ marginTop: '1.5rem' }}>
          {sek.tittel && (
            <h2 style={{ margin: '0 0 .6rem', fontSize: '1.15rem', fontWeight: 700, color: 'var(--clr-text)' }}>
              {sek.tittel}
            </h2>
          )}
          {sek.innhold && (
            <div
              style={{ fontSize: '.9375rem', lineHeight: 1.75, color: 'var(--clr-text-secondary)' }}
              dangerouslySetInnerHTML={{ __html: sek.innhold }}
            />
          )}
        </div>
      )

    case 'liste': {
      const punkter: string[] = (sek.meta?.punkter as string[]) ?? []
      return (
        <div style={{ marginTop: '1.5rem' }}>
          {sek.tittel && (
            <h2 style={{ margin: '0 0 .6rem', fontSize: '1.15rem', fontWeight: 700, color: 'var(--clr-text)' }}>
              {sek.tittel}
            </h2>
          )}
          <ul style={{ margin: 0, paddingLeft: '1.5rem', listStyleType: 'disc' }}>
            {punkter.map((p, i) => (
              <li key={i} style={{ fontSize: '.9375rem', lineHeight: 1.7, color: 'var(--clr-text-secondary)', marginBottom: '.35rem' }}>
                {p}
              </li>
            ))}
          </ul>
        </div>
      )
    }

    case 'lenker': {
      const lenker: { tittel: string; href: string }[] = (sek.meta?.lenker as { tittel: string; href: string }[]) ?? []
      return (
        <div style={{ marginTop: '1.5rem' }}>
          {sek.tittel && (
            <h2 style={{ margin: '0 0 .6rem', fontSize: '1.15rem', fontWeight: 700, color: 'var(--clr-text)' }}>
              {sek.tittel}
            </h2>
          )}
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
            {lenker.map((l, i) => (
              <li key={i}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--clr-primary)', fontSize: '.9375rem', fontWeight: 500 }}
                >
                  {l.tittel}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )
    }

    default:
      return null
  }
}

export default async function ArtikkelDetaljPage({ params }: Props) {
  const { slug } = await params
  const artikkel = await fetchArtikkelBySlug(slug)
  if (!artikkel) notFound()

  return (
    <div>
      {/* Hero */}
      <div style={{ background: 'var(--clr-primary-dark)', color: 'white', padding: '2.5rem 0 2rem' }}>
        <div className="container" style={{ maxWidth: '860px' }}>
          <Link
            href="/artikler"
            style={{ fontSize: '.8125rem', color: 'rgba(255,255,255,.65)', textDecoration: 'none', fontWeight: 500 }}
          >
            ← Tilbake til artikler
          </Link>

          {artikkel.tier !== 'gratis' && (
            <span style={{
              display: 'inline-block', margin: '.75rem 0 .5rem',
              background: 'rgba(255,255,255,.15)', color: 'white',
              fontSize: '.68rem', fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '.05em', padding: '.15rem .5rem', borderRadius: '999px',
            }}>
              {artikkel.tier === 'basis' ? 'Abonnement' : 'Premium'}
            </span>
          )}

          <h1 style={{ margin: '.75rem 0 0', fontSize: 'clamp(1.5rem,4vw,2.25rem)', fontWeight: 800, color: 'white' }}>
            {artikkel.tittel}
          </h1>
          {artikkel.ingress && (
            <p style={{ margin: '.75rem 0 0', color: 'rgba(255,255,255,.8)', fontSize: '1rem', lineHeight: 1.65, maxWidth: '660px' }}>
              {artikkel.ingress}
            </p>
          )}
        </div>
      </div>

      {/* Innhold */}
      <div className="section section--white">
        <div className="container" style={{ maxWidth: '860px' }}>
          {artikkel.seksjoner.length === 0 ? (
            <p style={{ color: 'var(--clr-text-secondary)', fontStyle: 'italic' }}>
              Ingen seksjoner publisert ennå.
            </p>
          ) : (
            <div>
              {artikkel.seksjoner.map(sek => (
                <SeksjonVis key={sek.id} sek={sek} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
