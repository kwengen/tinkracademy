'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

interface Bruker {
  id: string
  name: string | null
  tier: string
  role: string
}

export default function KommuneadminDashboard() {
  const { profile } = useAuth()
  const [brukere, setBrukere]   = useState<Bruker[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    if (!profile?.organization_id) { setLoading(false); return }
    supabase
      .from('profiles')
      .select('id,name,tier,role')
      .eq('organization_id', profile.organization_id)
      .then(({ data }) => { setBrukere(data ?? []); setLoading(false) })
  }, [profile])

  const roleLabel: Record<string, string> = {
    superadmin: 'Superadmin', admin: 'Admin',
    kommuneadmin: 'Kommuneadmin', bruker: 'Bruker',
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '.5rem' }}>Min kommune</h1>
      <p style={{ color: 'var(--clr-text-secondary)', marginBottom: '2rem' }}>
        Administrer brukere tilknyttet din kommunes abonnement.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'white', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-xl)', padding: '1.25rem' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--clr-primary)' }}>{brukere.length}</div>
          <div style={{ fontSize: '.875rem', color: 'var(--clr-text-secondary)', marginTop: '.25rem' }}>Brukere totalt</div>
        </div>
        <div style={{ background: 'white', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-xl)', padding: '1.25rem' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--clr-primary)' }}>
            {brukere.filter(b => b.tier !== 'gratis').length}
          </div>
          <div style={{ fontSize: '.875rem', color: 'var(--clr-text-secondary)', marginTop: '.25rem' }}>Med abonnement</div>
        </div>
      </div>

      <div style={{ background: 'white', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--clr-border)', fontWeight: 700 }}>
          Brukere i kommunen
        </div>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--clr-text-secondary)' }}>Laster brukere…</div>
        ) : brukere.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--clr-text-secondary)' }}>Ingen brukere funnet.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Navn', 'Rolle', 'Tilgang'].map(h => (
                  <th key={h} style={{ padding: '.75rem 1.5rem', textAlign: 'left', fontSize: '.8125rem', fontWeight: 600, color: 'var(--clr-text-secondary)', borderBottom: '1px solid var(--clr-border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {brukere.map((b, i) => (
                <tr key={b.id} style={{ borderBottom: i < brukere.length - 1 ? '1px solid var(--clr-border)' : 'none' }}>
                  <td style={{ padding: '.875rem 1.5rem', fontWeight: 500 }}>{b.name ?? '–'}</td>
                  <td style={{ padding: '.875rem 1.5rem', fontSize: '.875rem' }}>{roleLabel[b.role] ?? b.role}</td>
                  <td style={{ padding: '.875rem 1.5rem' }}>
                    <span style={{ fontSize: '.75rem', padding: '.25rem .625rem', borderRadius: '999px', background: b.tier === 'gratis' ? '#f3f4f6' : '#dbeafe', color: b.tier === 'gratis' ? '#6b7280' : '#1d4ed8', fontWeight: 600 }}>
                      {b.tier}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
