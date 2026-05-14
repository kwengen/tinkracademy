'use client'

import { useAuth } from '@/lib/auth'
import Link from 'next/link'

export default function BrukerDashboard() {
  const { user, profile } = useAuth()

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '.5rem' }}>
        Hei, {profile?.name ?? user?.email?.split('@')[0]}
      </h1>
      <p style={{ color: 'var(--clr-text-secondary)', marginBottom: '2rem' }}>
        Her finner du din personlige oversikt og tilgang til portalens innhold.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        {[
          { title: 'Tiltaksoversikt', desc: 'Utforsk alle tiltak og støtteordninger', href: '/tiltaksoversikt' },
          { title: 'Søknadshjelp',    desc: 'Få hjelp til å skrive søknader',        href: '/soknadsplattform' },
          { title: 'Verktøy',         desc: 'Praktiske maler og verktøy',            href: '/verktoy' },
          { title: 'Temaer',          desc: 'Dypdykk i faglige temaer',              href: '/temasider' },
        ].map(card => (
          <Link key={card.href} href={card.href} style={{ textDecoration: 'none' }}>
            <div style={{ background: 'white', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', transition: 'box-shadow .15s' }}>
              <div style={{ fontWeight: 700, marginBottom: '.375rem' }}>{card.title}</div>
              <div style={{ fontSize: '.875rem', color: 'var(--clr-text-secondary)' }}>{card.desc}</div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ background: 'white', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-xl)', padding: '1.5rem' }}>
        <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Min profil</h2>
        <dl style={{ display: 'grid', gap: '.75rem' }}>
          {[
            { label: 'E-post',        value: user?.email },
            { label: 'Navn',          value: profile?.name ?? '–' },
            { label: 'Tilgangsnivå',  value: profile?.tier ?? 'gratis' },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', gap: '1rem' }}>
              <dt style={{ fontSize: '.875rem', color: 'var(--clr-text-secondary)', minWidth: '120px' }}>{row.label}</dt>
              <dd style={{ fontSize: '.875rem', fontWeight: 500 }}>{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
