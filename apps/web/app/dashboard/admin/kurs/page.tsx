'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Kurs } from '@/lib/kurs-cms'

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/æ/g, 'ae').replace(/ø/g, 'o').replace(/å/g, 'a')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const KATEGORIER = ['Lederskap', 'Kultur', 'Struktur', 'Metode'] as const

export default function AdminKursPage() {
  const [kurser, setKurser]     = useState<Kurs[]>([])
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [feil, setFeil]         = useState<string | null>(null)
  const [nyTittel, setNyTittel] = useState('')
  const [nyKategori, setNyKategori] = useState<typeof KATEGORIER[number]>('Lederskap')
  const [visNyForm, setVisNyForm] = useState(false)

  const hent = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('kurs')
      .select('*')
      .order('sortering', { ascending: true })
    if (error) { setFeil(error.message); setLoading(false); return }
    setKurser((data ?? []).map(k => ({ ...k, datoer: [] })))
    setLoading(false)
  }, [])

  useEffect(() => { hent() }, [hent])

  async function opprettKurs() {
    if (!nyTittel.trim()) return
    setSaving(true)
    setFeil(null)

    const maxSortering = kurser.reduce((m, k) => Math.max(m, k.sortering ?? 0), 0)
    const num = String(kurser.length + 1).padStart(2, '0')
    const { error } = await supabase.from('kurs').insert({
      num,
      tittel:    nyTittel.trim(),
      slug:      slugify(nyTittel.trim()),
      kategori:  nyKategori,
      published: false,
      sortering: maxSortering + 10,
    })

    if (error) { setFeil(error.message); setSaving(false); return }
    setNyTittel('')
    setNyKategori('Lederskap')
    setVisNyForm(false)
    setSaving(false)
    hent()
  }

  async function oppdater(id: string, felt: Partial<Kurs>) {
    const { error } = await supabase.from('kurs').update(felt).eq('id', id)
    if (error) { setFeil(error.message); return }
    setKurser(prev => prev.map(k => k.id === id ? { ...k, ...felt } : k))
  }

  async function slett(id: string) {
    if (!confirm('Slette dette kurset? Alle datoer slettes også.')) return
    const { error } = await supabase.from('kurs').delete().eq('id', id)
    if (error) { setFeil(error.message); return }
    setKurser(prev => prev.filter(k => k.id !== id))
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.375rem', fontWeight: 800, color: 'var(--clr-text)' }}>
          Kurs
        </h1>
        <button
          onClick={() => setVisNyForm(!visNyForm)}
          style={{
            background: 'var(--clr-primary)', color: 'white',
            border: 'none', borderRadius: '8px', padding: '.5rem 1rem',
            fontSize: '.875rem', fontWeight: 600, cursor: 'pointer',
          }}
        >
          + Nytt kurs
        </button>
      </div>

      {visNyForm && (
        <div style={{
          background: 'var(--clr-primary-light)', border: '1px solid var(--clr-border)',
          borderRadius: '10px', padding: '1rem', marginBottom: '1rem',
          display: 'flex', gap: '.75rem', alignItems: 'flex-end', flexWrap: 'wrap',
        }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', fontSize: '.8125rem', fontWeight: 600, marginBottom: '.35rem', color: 'var(--clr-text)' }}>Tittel</label>
            <input
              type="text"
              value={nyTittel}
              onChange={e => setNyTittel(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && opprettKurs()}
              placeholder="Kursets tittel…"
              style={{
                width: '100%', padding: '.5rem .75rem', fontSize: '.9375rem',
                border: '1px solid var(--clr-border)', borderRadius: '6px',
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '.8125rem', fontWeight: 600, marginBottom: '.35rem', color: 'var(--clr-text)' }}>Kategori</label>
            <select
              value={nyKategori}
              onChange={e => setNyKategori(e.target.value as typeof KATEGORIER[number])}
              style={{ padding: '.5rem .75rem', fontSize: '.9375rem', border: '1px solid var(--clr-border)', borderRadius: '6px', background: 'white', cursor: 'pointer' }}
            >
              {KATEGORIER.map(k => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
          <button
            onClick={opprettKurs}
            disabled={saving || !nyTittel.trim()}
            style={{
              background: 'var(--clr-primary)', color: 'white',
              border: 'none', borderRadius: '8px', padding: '.5rem 1rem',
              fontSize: '.875rem', fontWeight: 600, cursor: 'pointer',
              opacity: saving || !nyTittel.trim() ? .5 : 1,
            }}
          >
            {saving ? 'Lagrer…' : 'Opprett'}
          </button>
          <button
            onClick={() => { setVisNyForm(false); setNyTittel('') }}
            style={{
              background: 'none', border: '1px solid var(--clr-border)',
              borderRadius: '8px', padding: '.5rem .875rem',
              fontSize: '.875rem', cursor: 'pointer', color: 'var(--clr-text-secondary)',
            }}
          >
            Avbryt
          </button>
        </div>
      )}

      {feil && (
        <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '.75rem 1rem', marginBottom: '1rem', fontSize: '.875rem', color: '#991b1b' }}>
          {feil}
        </div>
      )}

      {loading ? (
        <p style={{ color: 'var(--clr-text-secondary)' }}>Laster…</p>
      ) : kurser.length === 0 ? (
        <p style={{ color: 'var(--clr-text-secondary)', fontStyle: 'italic' }}>
          Ingen kurs ennå. Klikk «+ Nytt kurs» for å komme i gang.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
          {kurser.map(k => (
            <div
              key={k.id}
              style={{
                background: 'white', border: '1px solid var(--clr-border)',
                borderRadius: '10px', padding: '1rem 1.25rem',
                boxShadow: 'var(--shadow-sm)',
                display: 'grid', gridTemplateColumns: '1fr auto auto auto auto',
                alignItems: 'center', gap: '1rem',
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: '.9375rem', color: 'var(--clr-text)' }}>{k.tittel}</div>
                <div style={{ fontSize: '.78rem', color: 'var(--clr-text-secondary)', marginTop: '.15rem' }}>/kurs/{k.slug}</div>
              </div>

              <select
                value={k.kategori}
                onChange={e => oppdater(k.id, { kategori: e.target.value })}
                style={{ padding: '.35rem .6rem', fontSize: '.8125rem', border: '1px solid var(--clr-border)', borderRadius: '6px', background: 'white', cursor: 'pointer' }}
              >
                {KATEGORIER.map(kat => <option key={kat} value={kat}>{kat}</option>)}
              </select>

              <button
                onClick={() => oppdater(k.id, { published: !k.published })}
                style={{
                  padding: '.35rem .75rem', fontSize: '.8125rem', fontWeight: 600,
                  borderRadius: '999px', border: 'none', cursor: 'pointer',
                  background: k.published ? '#dcfce7' : '#f3f4f6',
                  color:      k.published ? '#166534' : '#6b7280',
                }}
              >
                {k.published ? 'Publisert' : 'Utkast'}
              </button>

              <a
                href={`/kurs/${k.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '.8125rem', color: 'var(--clr-primary)', fontWeight: 500, textDecoration: 'none' }}
              >
                Vis →
              </a>

              <button
                onClick={() => slett(k.id)}
                style={{
                  background: 'none', border: '1px solid #fca5a5', borderRadius: '6px',
                  padding: '.35rem .6rem', fontSize: '.8125rem', color: '#dc2626', cursor: 'pointer',
                }}
              >
                Slett
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
