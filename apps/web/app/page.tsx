'use client'

import Link from 'next/link'

const UPCOMING_COURSES = [
  {
    num: '01',
    href: '/kurs/innovasjonskultur',
    title: 'Hvordan utvikle innovasjonskultur?',
    teaser: 'En sterk innovasjonskultur er avgjørende for å tilpasse seg og lykkes i en verden i stadig endring.',
    meta: ['2 dager', 'Lillestrøm', '0,–* / 4 900,–'],
    colorClass: 'v-pink',
    svg: (
      <svg viewBox="0 0 200 160" fill="none" stroke="currentColor" strokeWidth="2.4">
        <circle cx="100" cy="78" r="22"/>
        <path d="M100 56 V32 M100 100 V128 M78 78 H52 M122 78 H148"/>
        <circle cx="52" cy="78" r="6" fill="currentColor"/>
        <circle cx="148" cy="78" r="6" fill="currentColor"/>
        <circle cx="100" cy="32" r="6" fill="currentColor"/>
        <circle cx="100" cy="128" r="6" fill="currentColor"/>
        <path d="M85 65 L115 91 M115 65 L85 91" strokeDasharray="3 3"/>
      </svg>
    ),
  },
  {
    num: '02',
    href: '/kurs',
    title: 'Hvordan strukturere innovasjonsarbeidet?',
    teaser: 'Etabler en tydelig og helhetlig innovasjonsstruktur som leverer resultater.',
    meta: ['2. juni', '8 timer', '0,–* / 4 900,–'],
    colorClass: 'v-violet',
    svg: (
      <svg viewBox="0 0 200 160" fill="none" stroke="currentColor" strokeWidth="2.4">
        <rect x="24" y="100" width="36" height="36"/>
        <rect x="82" y="74" width="36" height="62"/>
        <rect x="140" y="44" width="36" height="92"/>
        <path d="M42 100 V70 H100 V44 H158 V20" strokeDasharray="4 4"/>
        <circle cx="158" cy="20" r="4" fill="currentColor"/>
      </svg>
    ),
  },
  {
    num: '03',
    href: '/kurs',
    title: 'Innovasjonsledelse i praksis',
    teaser: 'Større forståelse for hvordan du kan bidra til mer innovasjon og nytenking i eget team.',
    meta: ['14. mai', '1 dag + digital', '5 000,–'],
    colorClass: 'v-orange',
    svg: (
      <svg viewBox="0 0 200 160" fill="none" stroke="currentColor" strokeWidth="2.4">
        <circle cx="64" cy="60" r="18"/>
        <path d="M40 132 Q40 96 64 96 Q88 96 88 132"/>
        <circle cx="140" cy="48" r="14"/>
        <path d="M120 116 Q120 90 140 90 Q160 90 160 116"/>
        <path d="M82 78 L122 60" strokeDasharray="3 3"/>
        <path d="M100 30 L116 18 L132 30 L116 24 Z" fill="currentColor"/>
      </svg>
    ),
  },
]

export default function Forside() {
  return (
    <main>
      {/* ── Hero ── */}
      <section style={{ position: 'relative', color: '#fff', overflow: 'hidden', isolation: 'isolate', borderRadius: '0 0 var(--radius-xl) var(--radius-xl)', background: 'var(--brand-gradient)' }}>
        <div style={{
          content: '', position: 'absolute', inset: 0, zIndex: -1,
          background: 'radial-gradient(60% 80% at 80% 20%, rgba(255,255,255,.18) 0%, transparent 60%), radial-gradient(80% 60% at 10% 90%, rgba(0,0,0,.18) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />
        <div className="container" style={{ paddingTop: 'clamp(72px, 11vw, 160px)', paddingBottom: 'clamp(80px, 12vw, 180px)' }}>
          <span style={{
            color: 'rgba(255,255,255,.85)', display: 'inline-flex', alignItems: 'center', gap: '12px',
            fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '.14em', textTransform: 'uppercase',
          }}>
            <span style={{ width: '28px', height: '1px', background: 'currentColor', display: 'inline-block' }} />
            Tinkr Academy · våren 2026
          </span>
          <h1 style={{ color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(48px, 8vw, 116px)', letterSpacing: '-0.025em', lineHeight: 1, margin: '24px 0 0', maxWidth: '14ch' }}>
            Sammen om innovasjon<br />i offentlig sektor.
          </h1>
          <p className="lead" style={{ color: 'rgba(255,255,255,.92)', marginTop: '32px', maxWidth: '56ch', fontSize: 'clamp(18px, 1.6vw, 22px)', lineHeight: 1.55 }}>
            Praktiske kurs, dypdykk og et levende nettverk for kommunale ledere som vil få til reell endring. Forskningsbasert, KS-godkjent og forankret i kommunal hverdag.
          </p>
          <div style={{ marginTop: '40px', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <Link href="/kurs" className="btn" style={{ background: '#fff', color: 'var(--ink)', borderColor: '#fff' }}>
              Se vårens kurs <span className="arrow">→</span>
            </Link>
            <Link href="/nettverk" className="btn btn--ghost" style={{ background: 'transparent', color: '#fff', borderColor: 'rgba(255,255,255,.4)' }}>
              Bli med i nettverket
            </Link>
          </div>

          <div style={{
            marginTop: '64px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px',
            paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,.18)',
          }}>
            {[
              { num: '8',     label: 'Kurs i akademiet våren 2026' },
              { num: '120+',  label: 'Kommunale ledere i nettverket' },
              { num: 'KS',    label: 'Godkjent leverandør · OU-midler dekker' },
              { num: '10+ år',label: 'Innovasjonsarbeid i norske kommuner' },
            ].map(s => (
              <div key={s.num} style={{ fontSize: '14px', color: 'rgba(255,255,255,.78)' }}>
                <strong style={{ display: 'block', color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '30px', lineHeight: 1, letterSpacing: '-.01em', marginBottom: '8px' }}>{s.num}</strong>
                {s.label}
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:760px){.hero-meta-grid{grid-template-columns:repeat(2,1fr)!important}}`}</style>
      </section>

      {/* ── Om Tinkr Academy ── */}
      <section className="section section--tight" style={{ marginTop: '-30px' }}>
        <div className="container">
          <div style={{
            background: 'var(--off-white)',
            borderRadius: 'var(--radius-xl)',
            padding: 'clamp(48px, 7vw, 96px)',
            border: '1px solid color-mix(in oklab, var(--ink) 6%, transparent)',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '64px', alignItems: 'end' }}>
              <div>
                <span className="eyebrow">Om akademiet</span>
                <h2 style={{ marginTop: '18px' }}>Praksis først.<br />Teori i andre rekke.</h2>
              </div>
              <div>
                <p className="lead">Vi har jobbet med innovasjon i norske kommuner i mange år. Vi kjenner de praktiske utfordringene, de krevende rammebetingelsene – og engasjementet hos ledere og medarbeidere. Tinkr Academy er stedet vi deler det vi har lært.</p>
                <Link href="/om" className="btn btn--ghost" style={{ marginTop: '8px' }}>Les mer om oss <span className="arrow">→</span></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Kommende kurs ── */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px', marginBottom: '48px' }}>
            <div>
              <span className="eyebrow">Kommende kurs</span>
              <h2 style={{ marginTop: '16px' }}>Vårens kurs i Lillestrøm.</h2>
            </div>
            <Link href="/kurs" className="btn btn--ghost">Alle 8 kurs <span className="arrow">→</span></Link>
          </div>

          <div className="grid grid-3">
            {UPCOMING_COURSES.map(c => (
              <Link key={c.num} href={c.href} style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--paper)', border: '1px solid color-mix(in oklab, var(--ink) 8%, transparent)', transition: 'transform .2s ease, box-shadow .2s ease', display: 'flex', flexDirection: 'column', textDecoration: 'none', color: 'inherit' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 24px 48px rgba(40,43,59,.10)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}
              >
                <div style={{
                  aspectRatio: '4/3', position: 'relative', display: 'grid', placeItems: 'center', color: '#fff', overflow: 'hidden', padding: '32px',
                  background: c.colorClass === 'v-pink' ? 'linear-gradient(135deg, #FF7473 0%, #FD4B5F 50%, #EB4365 100%)'
                    : c.colorClass === 'v-violet' ? 'linear-gradient(135deg, #FF4D6F 0%, #D54393 60%, #CA49AD 100%)'
                    : 'linear-gradient(135deg, #FF8356 0%, #FF4D6F 100%)',
                }}>
                  <span style={{ position: 'absolute', left: '24px', top: '20px', fontSize: '28px', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'rgba(255,255,255,.7)', letterSpacing: '-.02em' }}>{c.num}</span>
                  <div style={{ width: '70%', height: '70%', opacity: .92 }}>{c.svg}</div>
                </div>
                <div style={{ padding: '26px 28px 28px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                  <h3 style={{ fontSize: '22px', lineHeight: 1.2, fontWeight: 600 }}>{c.title}</h3>
                  <p style={{ color: 'var(--ink-500)', fontSize: '15px', margin: 0, lineHeight: 1.55 }}>{c.teaser}</p>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: 'var(--ink-500)', marginTop: 'auto', paddingTop: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {c.meta.map((m, i) => (
                      <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {i > 0 && <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--ink-300)', display: 'inline-block' }} />}
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Nettverket teaser ── */}
      <section className="section section--tight">
        <div className="container">
          <div style={{
            background: 'var(--ink)', color: '#fff', borderRadius: 'var(--radius-xl)',
            padding: 'clamp(48px, 7vw, 96px)', display: 'grid',
            gridTemplateColumns: '1.1fr 1fr', gap: '56px', alignItems: 'center',
            overflow: 'hidden', position: 'relative',
          }}>
            <div>
              <span className="eyebrow" style={{ color: 'rgba(255,255,255,.6)' }}>Innovasjons- og samskapingsnettverket</span>
              <h2 style={{ color: '#fff', margin: '18px 0 18px' }}>Vær en del<br />av noe større.</h2>
              <p style={{ color: 'rgba(255,255,255,.78)', fontSize: '19px', lineHeight: 1.55, maxWidth: '52ch', margin: 0 }}>
                Et fellesskap for kommunale ledere som jobber sammen for å skape en mer innovativ offentlig sektor. Inspirere og bli inspirert, dele beste praksis, og være med å forme retningen.
              </p>
              <ul style={{ listStyleType: 'none', padding: 0, margin: '24px 0 32px', display: 'grid', gap: '12px', fontSize: '16px', color: 'rgba(255,255,255,.85)' }}>
                <li>→ Nettverksbygging på tvers av kommuner</li>
                <li>→ Kompetanseutvikling med Tinkrs eksperter</li>
                <li>→ Deling av beste praksis og prosjekter</li>
                <li>→ Tilgang til verdifulle ressurser og verktøy</li>
              </ul>
              <Link href="/nettverk" className="btn" style={{ background: '#fff', color: 'var(--ink)', borderColor: '#fff' }}>
                Meld interesse <span className="arrow">→</span>
              </Link>
            </div>
            <div style={{ aspectRatio: '1', borderRadius: 'var(--radius-lg)', background: 'var(--brand-gradient)', overflow: 'hidden', position: 'relative', display: 'grid', placeItems: 'center' }}>
              <span style={{ position: 'absolute', top: '24px', left: '24px', background: 'rgba(255,255,255,.92)', color: 'var(--ink)', padding: '8px 14px', borderRadius: '999px', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '.12em', textTransform: 'uppercase' }}>Nettverket</span>
              <img src="/img/network-head.png" alt="" style={{ width: '88%', height: '88%', objectFit: 'contain', mixBlendMode: 'multiply', opacity: .85, filter: 'contrast(1.1)' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonial ── */}
      <section className="section section--tight">
        <div className="container">
          <div style={{
            padding: 'clamp(48px, 7vw, 96px)',
            background: 'var(--soft-gradient)',
            borderRadius: 'var(--radius-xl)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: '-20px', left: '56px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '240px', lineHeight: 1, color: 'rgba(255,77,111,.18)', pointerEvents: 'none', userSelect: 'none' }}>"</div>
            <blockquote style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 'clamp(28px, 3.4vw, 44px)', lineHeight: 1.2, margin: 0, letterSpacing: '-0.02em', color: 'var(--ink)', maxWidth: '30ch', position: 'relative' }}>
              Innovasjon blir ofte litt «fluffy», og alle er enige om at vi må gjøre noe nytt, men det blir ofte uhåndgripelig. Kurset hjalp oss å sortere og se hvor vi må sette inn støtet.
            </blockquote>
            <div style={{ marginTop: '32px', fontSize: '15px', color: 'var(--ink-500)', position: 'relative' }}>
              <strong style={{ color: 'var(--ink)', display: 'block', fontSize: '17px', fontWeight: 700 }}>Geir Morten Førland</strong>
              Rådgiver skole · Lørenskog kommune
            </div>
          </div>
        </div>
      </section>

      {/* ── Nyhetsbrev ── */}
      <section className="section section--tight">
        <div className="container container--narrow">
          <div style={{ textAlign: 'center', display: 'grid', gap: '24px', placeItems: 'center', padding: 'clamp(48px, 6vw, 80px) 0' }}>
            <span className="eyebrow">Nyhetsbrev</span>
            <h2 style={{ maxWidth: '16ch' }}>Få varsel om nye kurs og åpne plasser.</h2>
            <p className="muted" style={{ maxWidth: '48ch', margin: 0 }}>Ett brev i måneden med faglig påfyll, kommende kurs og glimt fra nettverket. Ingen spam, lett å melde seg av.</p>
            <form className="field" style={{ width: 'min(100%, 480px)' }} onSubmit={e => { e.preventDefault(); (e.currentTarget.querySelector('button') as HTMLButtonElement).textContent = 'Takk!'; }}>
              <input type="email" placeholder="navn@kommune.no" aria-label="E-postadresse" required />
              <button type="submit">Meld meg på</button>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}
