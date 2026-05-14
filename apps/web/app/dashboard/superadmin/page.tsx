'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface PlatformStats {
  brukere: number
  organisasjoner: number
  tiltak: number
  temaer: number
  verktoy: number
  tilGodkjenning: number
}

export default function SuperadminOversikt() {
  const [stats, setStats] = useState<PlatformStats | null>(null)

  useEffect(() => {
    Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('organizations').select('id', { count: 'exact', head: true }),
      supabase.from('tiltak').select('id', { count: 'exact', head: true }),
      supabase.from('temaer').select('id', { count: 'exact', head: true }),
      supabase.from('verktoy').select('id', { count: 'exact', head: true }),
      Promise.all([
        supabase.from('artikler').select('id', { count: 'exact', head: true }).eq('status', 'til_gjennomgang'),
        supabase.from('verktoy').select('id', { count: 'exact', head: true }).eq('status', 'til_gjennomgang'),
        supabase.from('soknadsguider').select('id', { count: 'exact', head: true }).eq('status', 'til_gjennomgang'),
      ]),
    ]).then(([br, org, ti, te, ve, pending]) => {
      const pendingTotal = (pending as any[]).reduce((s, r) => s + (r.count ?? 0), 0)
      setStats({
        brukere: br.count ?? 0,
        organisasjoner: org.count ?? 0,
        tiltak: ti.count ?? 0,
        temaer: te.count ?? 0,
        verktoy: ve.count ?? 0,
        tilGodkjenning: pendingTotal,
      })
    })
  }, [])

  const cards = stats ? [
    { label: 'Brukere',         value: stats.brukere,        href: '/dashboard/superadmin/brukere' },
    { label: 'Organisasjoner',  value: stats.organisasjoner, href: '/dashboard/superadmin/organisasjoner' },
    { label: 'Tiltak',          value: stats.tiltak,         href: '/dashboard/admin/tiltak' },
    { label: 'Temaer',          value: stats.temaer,         href: '/dashboard/admin/temaer' },
    { label: 'Verktøy',         value: stats.verktoy,        href: '/dashboard/admin/verktoy' },
    { label: 'Til godkjenning', value: stats.tilGodkjenning, href: '/dashboard/admin/godkjenning', alert: stats.tilGodkjenning > 0 },
  ] : []

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '.25rem' }}>Plattformoversikt</h1>
      <p style={{ color: 'var(--clr-text-secondary)', marginBottom: '2rem' }}>
        Full oversikt over alle brukere, organisasjoner og innhold i portalen.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px,1fr))', gap: '1rem' }}>
        {stats === null
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ background: 'white', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-xl)', padding: '1.25rem', height: '80px' }} />
            ))
          : cards.map(c => (
              <Link key={c.href} href={c.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'white',
                  border: `1px solid ${(c as any).alert ? '#fca5a5' : 'var(--clr-border)'}`,
                  borderRadius: 'var(--radius-xl)',
                  padding: '1.25rem',
                  transition: 'box-shadow .15s',
                }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: (c as any).alert ? '#ef4444' : 'var(--clr-primary)' }}>{c.value}</div>
                  <div style={{ fontSize: '.875rem', color: 'var(--clr-text-secondary)', marginTop: '.25rem' }}>{c.label}</div>
                </div>
              </Link>
            ))
        }
      </div>
    </div>
  )
}
