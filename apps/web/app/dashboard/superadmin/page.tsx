'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface PlatformStats {
  brukere: number
  organisasjoner: number
  kurs: number
  kurspublisert: number
}

export default function SuperadminOversikt() {
  const [stats, setStats] = useState<PlatformStats | null>(null)

  useEffect(() => {
    Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('organizations').select('id', { count: 'exact', head: true }),
      supabase.from('kurs').select('id', { count: 'exact', head: true }),
      supabase.from('kurs').select('id', { count: 'exact', head: true }).eq('published', true),
    ]).then(([br, org, kurs, kurspub]) => {
      setStats({
        brukere:       br.count ?? 0,
        organisasjoner: org.count ?? 0,
        kurs:          kurs.count ?? 0,
        kurspublisert: kurspub.count ?? 0,
      })
    })
  }, [])

  const cards = stats ? [
    { label: 'Brukere',          value: stats.brukere,        href: '/dashboard/superadmin/brukere' },
    { label: 'Organisasjoner',   value: stats.organisasjoner, href: '/dashboard/superadmin/organisasjoner' },
    { label: 'Kurs totalt',      value: stats.kurs,           href: '/dashboard/admin/kurs' },
    { label: 'Kurs publisert',   value: stats.kurspublisert,  href: '/dashboard/admin/kurs' },
  ] : []

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '.25rem' }}>Plattformoversikt</h1>
      <p style={{ color: 'var(--clr-text-secondary)', marginBottom: '2rem' }}>
        Full oversikt over alle brukere, organisasjoner og kurs.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px,1fr))', gap: '1rem' }}>
        {stats === null
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ background: 'white', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-xl)', padding: '1.25rem', height: '80px' }} />
            ))
          : cards.map(c => (
              <Link key={c.href + c.label} href={c.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'white',
                  border: '1px solid var(--clr-border)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '1.25rem',
                  transition: 'box-shadow .15s',
                }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--clr-primary)' }}>{c.value}</div>
                  <div style={{ fontSize: '.875rem', color: 'var(--clr-text-secondary)', marginTop: '.25rem' }}>{c.label}</div>
                </div>
              </Link>
            ))
        }
      </div>
    </div>
  )
}
