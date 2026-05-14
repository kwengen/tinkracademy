'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface PendingItem {
  id: string
  tittel: string
  type: 'artikkel' | 'verktoy' | 'soknadsguide'
  ingress: string | null
  created_at: string
}

export default function GodkjenningPage() {
  const [items, setItems]     = useState<PendingItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('artikler').select('id,tittel,ingress,created_at').eq('status', 'til_gjennomgang'),
      supabase.from('verktoy').select('id,tittel,beskrivelse,created_at').eq('status', 'til_gjennomgang'),
      supabase.from('soknadsguider').select('id,tittel,ingress,created_at').eq('status', 'til_gjennomgang'),
    ]).then(([art, verk, sok]) => {
      const mapped: PendingItem[] = [
        ...(art.data ?? []).map(r => ({ ...r, type: 'artikkel' as const, ingress: r.ingress })),
        ...(verk.data ?? []).map(r => ({ ...r, type: 'verktoy' as const, ingress: r.beskrivelse })),
        ...(sok.data ?? []).map(r => ({ ...r, type: 'soknadsguide' as const, ingress: r.ingress })),
      ].sort((a, b) => a.created_at.localeCompare(b.created_at))
      setItems(mapped)
      setLoading(false)
    })
  }, [])

  const TYPE_LABEL: Record<string, string> = {
    artikkel:    'Artikkel',
    verktoy:     'Verktøy',
    soknadsguide: 'Søknadshjelp',
  }
  const TYPE_COLOR: Record<string, string> = {
    artikkel:    '#dbeafe',
    verktoy:     '#f3e8ff',
    soknadsguide: '#fef3c7',
  }
  const TYPE_TEXT: Record<string, string> = {
    artikkel:    '#1d4ed8',
    verktoy:     '#7c3aed',
    soknadsguide: '#92400e',
  }

  async function approve(item: PendingItem) {
    const table = item.type === 'artikkel' ? 'artikler' : item.type === 'verktoy' ? 'verktoy' : 'soknadsguider'
    await supabase.from(table).update({ status: 'publisert' }).eq('id', item.id)
    setItems(prev => prev.filter(i => i.id !== item.id))
  }

  async function reject(item: PendingItem) {
    const table = item.type === 'artikkel' ? 'artikler' : item.type === 'verktoy' ? 'verktoy' : 'soknadsguider'
    await supabase.from(table).update({ status: 'utkast' }).eq('id', item.id)
    setItems(prev => prev.filter(i => i.id !== item.id))
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '.25rem' }}>Til godkjenning</h1>
        <p style={{ color: 'var(--clr-text-secondary)', fontSize: '.875rem' }}>
          Innhold som venter på gjennomgang og publisering.
        </p>
      </div>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--clr-text-secondary)' }}>Laster…</div>
      ) : items.length === 0 ? (
        <div style={{ background: 'white', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-xl)', padding: '3rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>✓</div>
          <div style={{ fontWeight: 700, marginBottom: '.5rem' }}>Ingenting å godkjenne</div>
          <div style={{ color: 'var(--clr-text-secondary)', fontSize: '.875rem' }}>Alt innhold er behandlet.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
          {items.map(item => (
            <div key={item.id} style={{ background: 'white', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-xl)', padding: '1.25rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.625rem', marginBottom: '.375rem' }}>
                  <span style={{ fontSize: '.75rem', padding: '.2rem .6rem', borderRadius: '999px', fontWeight: 600, background: TYPE_COLOR[item.type], color: TYPE_TEXT[item.type] }}>
                    {TYPE_LABEL[item.type]}
                  </span>
                  <span style={{ fontSize: '.75rem', color: 'var(--clr-text-secondary)' }}>
                    {new Date(item.created_at).toLocaleDateString('nb-NO')}
                  </span>
                </div>
                <div style={{ fontWeight: 600, marginBottom: '.25rem' }}>{item.tittel}</div>
                {item.ingress && (
                  <div style={{ fontSize: '.875rem', color: 'var(--clr-text-secondary)' }}>{item.ingress}</div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '.5rem', flexShrink: 0 }}>
                <button
                  onClick={() => approve(item)}
                  style={{ padding: '.5rem 1rem', background: '#166534', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 600, fontSize: '.875rem' }}
                >
                  Publiser
                </button>
                <button
                  onClick={() => reject(item)}
                  style={{ padding: '.5rem 1rem', border: '1px solid var(--clr-border)', background: 'white', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: '.875rem' }}
                >
                  Send tilbake
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
