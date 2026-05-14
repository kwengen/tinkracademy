'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { fetchKurs, type Kurs } from '@/lib/kurs-cms'

// SVGs keyed by kurs.num — stays in frontend (JSX is not serializable)
const SVG_MAP: Record<string, React.ReactNode> = {
  '01': <svg viewBox="0 0 200 160" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="100" cy="78" r="22"/><path d="M100 56 V32 M100 100 V128 M78 78 H52 M122 78 H148"/><circle cx="52" cy="78" r="6" fill="currentColor"/><circle cx="148" cy="78" r="6" fill="currentColor"/><circle cx="100" cy="32" r="6" fill="currentColor"/><circle cx="100" cy="128" r="6" fill="currentColor"/><path d="M85 65 L115 91 M115 65 L85 91" strokeDasharray="3 3"/></svg>,
  '02': <svg viewBox="0 0 200 160" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="24" y="100" width="36" height="36"/><rect x="82" y="74" width="36" height="62"/><rect x="140" y="44" width="36" height="92"/><path d="M42 100 V70 H100 V44 H158 V20" strokeDasharray="4 4"/><circle cx="158" cy="20" r="4" fill="currentColor"/></svg>,
  '03': <svg viewBox="0 0 200 160" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="64" cy="60" r="18"/><path d="M40 132 Q40 96 64 96 Q88 96 88 132"/><circle cx="140" cy="48" r="14"/><path d="M120 116 Q120 90 140 90 Q160 90 160 116"/><path d="M82 78 L122 60" strokeDasharray="3 3"/><path d="M100 30 L116 18 L132 30 L116 24 Z" fill="currentColor"/></svg>,
  '04': <svg viewBox="0 0 200 160" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M30 130 L100 30 L170 130 Z"/><circle cx="100" cy="92" r="14" fill="currentColor"/><path d="M60 130 L100 76 L140 130"/></svg>,
  '05': <svg viewBox="0 0 200 160" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="56" cy="80" r="22"/><rect x="100" y="60" width="40" height="40"/><path d="M148 80 L172 80 M148 80 L160 68 M148 80 L160 92"/><path d="M78 80 L100 80" strokeDasharray="3 3"/></svg>,
  '06': <svg viewBox="0 0 200 160" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="60" cy="60" r="14" fill="currentColor"/><circle cx="140" cy="60" r="14"/><circle cx="100" cy="120" r="14"/><path d="M70 70 L130 110 M130 70 L70 110 M74 60 L126 60 M60 74 L100 106 M140 74 L100 106"/></svg>,
  '07': <svg viewBox="0 0 200 160" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M30 130 L60 100 L90 110 L120 70 L150 80 L180 30"/><circle cx="60" cy="100" r="5" fill="currentColor"/><circle cx="90" cy="110" r="5" fill="currentColor"/><circle cx="120" cy="70" r="5" fill="currentColor"/><circle cx="150" cy="80" r="5" fill="currentColor"/><circle cx="180" cy="30" r="5" fill="currentColor"/><path d="M30 140 H180 M30 30 V140" strokeWidth="1.5"/></svg>,
  '08': <svg viewBox="0 0 200 160" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M40 130 Q40 70 100 70 Q160 70 160 130"/><circle cx="100" cy="44" r="14"/><path d="M70 110 L100 80 L130 110"/><path d="M100 70 V130" strokeDasharray="3 3"/></svg>,
}

const cardStyle: React.CSSProperties = {
  background: 'var(--paper)',
  borderRadius: 'var(--radius-lg)',
  overflow: 'hidden',
  border: '1px solid color-mix(in oklab, var(--ink) 8%, transparent)',
  transition: 'transform .2s, box-shadow .2s',
  display: 'flex', flexDirection: 'column',
  textDecoration: 'none', color: 'inherit',
}

export default function KursPage() {
  const [kurs, setKurs] = useState<Kurs[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchKurs().then(data => { setKurs(data); setLoading(false) })
  }, [])

  return (
    <main>
      {/* ── Page hero ── */}
      <section style={{ padding: 'clamp(64px, 9vw, 120px) 0 clamp(48px, 6vw, 80px)', borderBottom: '1px solid color-mix(in oklab, var(--ink) 8%, transparent)' }}>
        <div className="container">
          <span className="eyebrow">Kurskatalogen · Våren 2026</span>
          <h1 style={{ marginTop: '18px', fontSize: 'clamp(48px, 7vw, 96px)' }}>
            Åtte kurs.<br />Ett mål: bedre innovasjon i kommunal sektor.
          </h1>
          <p className="lead" style={{ marginTop: '24px', maxWidth: '60ch' }}>
            Hvert kurs er praktisk forankret, KS-godkjent og utviklet for ledere som setter rammer for innovasjon. Du kan ta dem enkeltvis eller bygge et helhetlig løp.
          </p>

          <div style={{ marginTop: '56px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {['Alle kurs 8', 'Lederskap 3', 'Kultur & team 2', 'Struktur & system 2', 'Metode & verktøy 3'].map((f, i) => (
                <button key={f} style={{
                  border: `1.5px solid ${i === 0 ? 'var(--ink)' : 'color-mix(in oklab, var(--ink) 14%, transparent)'}`,
                  background: i === 0 ? 'var(--ink)' : 'transparent',
                  borderRadius: '999px', padding: '10px 18px',
                  fontSize: '14px', fontWeight: 500,
                  color: i === 0 ? 'var(--paper)' : 'var(--ink-700)',
                  cursor: 'pointer', transition: 'all .2s', fontFamily: 'var(--font-body)',
                }}>
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── OU-strip ── */}
      <section style={{ paddingTop: '32px' }}>
        <div className="container">
          <div style={{
            background: 'var(--ink)', color: 'var(--paper)',
            borderRadius: 'var(--radius-lg)', padding: '28px 36px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            gap: '24px', flexWrap: 'wrap', marginBottom: '24px',
          }}>
            <div>
              <strong style={{ fontSize: '16px' }}>Ledere i norske kommuner kan be om refusjon</strong>
              <p style={{ margin: '4px 0 0', fontSize: '14px', color: 'color-mix(in oklab, var(--paper) 70%, transparent)', maxWidth: '60ch' }}>
                Tinkr Academy står på KS' liste over forhåndsgodkjente leverandører. Kursavgiften kan dekkes av OU-midler.
              </p>
            </div>
            <Link href="#" className="btn btn--light">Se KS-listen <span className="arrow">→</span></Link>
          </div>
        </div>
      </section>

      {/* ── Course grid ── */}
      <section style={{ paddingBottom: 'clamp(64px, 10vw, 128px)' }}>
        <div className="container">
          {loading ? (
            <p style={{ padding: 'clamp(40px, 6vw, 80px) 0', color: 'var(--ink-500)' }}>Laster kurs…</p>
          ) : kurs.length === 0 ? (
            <p style={{ padding: 'clamp(40px, 6vw, 80px) 0', color: 'var(--ink-500)', fontStyle: 'italic' }}>Ingen kurs publisert ennå.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', padding: 'clamp(40px, 6vw, 80px) 0' }}>
              {kurs.map(k => {
                const href = k.slug ? `/kurs/${k.slug}` : '#'
                const svg = SVG_MAP[k.num] ?? null
                const meta = [k.varighet, k.sted, k.pris_ou && k.pris_full ? `${k.pris_ou}* / ${k.pris_full}` : (k.pris_full ?? '')].filter(Boolean)
                return (
                  <Link
                    key={k.id}
                    href={href}
                    style={cardStyle}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 24px 48px rgba(21,20,46,.10)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}
                  >
                    <div style={{ aspectRatio: '4/3', background: 'var(--brand-gradient)', display: 'grid', placeItems: 'center', color: 'var(--tile-ink)', padding: '36px' }}>
                      {svg && <div style={{ width: '100%', height: '100%' }}>{svg}</div>}
                    </div>
                    <div style={{ padding: '24px 24px 28px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-300)', letterSpacing: '.1em' }}>{k.num}</span>
                        <span className="tag">{k.kategori}</span>
                      </div>
                      <h3 style={{ fontSize: '22px', lineHeight: 1.15 }}>{k.tittel}</h3>
                      <p style={{ color: 'var(--ink-500)', fontSize: '15px', margin: 0 }}>{k.ingress}</p>
                      <div style={{ display: 'flex', gap: '14px', fontSize: '13px', color: 'var(--ink-500)', marginTop: 'auto', paddingTop: '12px' }}>
                        {meta.map((m, i) => (
                          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            {i > 0 && <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--ink-300)', display: 'inline-block' }} />}
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Hjelp CTA ── */}
      <section className="section">
        <div className="container container--narrow center">
          <span className="eyebrow" style={{ margin: '0 auto' }}>Skreddersydd?</span>
          <h2 style={{ margin: '18px 0 16px' }}>Vi kan også komme til deg.</h2>
          <p className="lead muted" style={{ margin: '0 auto' }}>Mange kommuner ønsker et tilpasset løp for ledergruppen sin. Ta kontakt så ser vi på det sammen.</p>
          <a href="mailto:hei@tinkr.no" className="btn btn--accent" style={{ marginTop: '24px' }}>Ta kontakt <span className="arrow">→</span></a>
        </div>
      </section>

      <style>{`
        @media (max-width: 1000px) {
          .course-grid-inner { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .course-grid-inner { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  )
}
