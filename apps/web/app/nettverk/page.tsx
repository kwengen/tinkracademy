import Link from 'next/link'

const WHY_JOIN = [
  {
    num: '01',
    title: 'Lær av de beste kommunene i landet',
    body: 'Del erfaringer med kolleger som jobber med de samme utfordringene. Nettverk er den raskeste veien til ny innsikt.',
  },
  {
    num: '02',
    title: 'Kompetanse fra Tinkrs eksperter',
    body: 'Tilgang til fagdager, webinarer og dypdykk med Tinkrs konsulenter – spesielt tilpasset kommunal innovasjon.',
  },
  {
    num: '03',
    title: 'Form retningen for innovasjonsfeltet',
    body: 'Som nettverksmedlem er du med på å sette dagsorden for hva norske kommuner trenger av innovasjonskompetanse.',
  },
  {
    num: '04',
    title: 'Ressurser, verktøy og maler',
    body: 'Tilgang til et voksende bibliotek av praktiske verktøy, rammeverk og maler som du kan bruke direkte i din kommune.',
  },
]

const ACTIVITIES = [
  { month: 'Mai', day: '15', title: 'Åpent nettverksmøte – Lillestrøm', desc: 'Vårsamling med erfaringsdeling og presentasjoner fra kommuner', type: 'Fysisk', price: 'Gratis', priceNote: 'for medlemmer' },
  { month: 'Jun', day: '03', title: 'Webinar: KI i kommunal forvaltning', desc: 'Praktiske erfaringer fra tre kommuner', type: 'Digitalt', price: 'Gratis', priceNote: 'for alle' },
  { month: 'Sep', day: '12', title: 'Høstsamling 2026', desc: 'To-dagers faglig og sosialt program i Vadsø', type: 'Fysisk', price: '0,–*', priceNote: '* OU-midler' },
  { month: 'Okt', day: '21', title: 'Masterclass: Samskaping i praksis', desc: 'Dypdykk med Ida Skjerve og gjester fra Bergen kommune', type: 'Hybrid', price: 'Gratis', priceNote: 'for medlemmer' },
]

export default function NettverkPage() {
  return (
    <main>
      {/* ── Hero ── */}
      <section style={{ position: 'relative', background: 'var(--brand-gradient)', color: '#fff', overflow: 'hidden', isolation: 'isolate', borderRadius: '0 0 var(--radius-xl) var(--radius-xl)' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: -1, background: 'radial-gradient(50% 60% at 90% 100%, rgba(0,0,0,.22) 0%, transparent 60%), radial-gradient(60% 80% at 0% 0%, rgba(255,255,255,.16) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div className="container" style={{ paddingTop: 'clamp(60px, 9vw, 110px)', paddingBottom: 'clamp(72px, 10vw, 140px)', position: 'relative' }}>
          <span style={{ color: 'rgba(255,255,255,.85)', display: 'inline-flex', alignItems: 'center', gap: '12px', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '.14em', textTransform: 'uppercase' }}>
            <span style={{ width: '28px', height: '1px', background: 'currentColor', display: 'inline-block' }} />
            Tinkr Academy · Innovasjonsnettverket
          </span>
          <h1 style={{ color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(48px, 7.5vw, 108px)', lineHeight: 0.98, letterSpacing: '-.025em', marginTop: '24px', maxWidth: '18ch' }}>
            Innovasjon er et lagspill.
          </h1>
          <p className="lead" style={{ color: 'rgba(255,255,255,.92)', marginTop: '28px', maxWidth: '58ch', fontSize: 'clamp(18px, 1.6vw, 22px)' }}>
            Et levende nettverk for kommunale ledere som jobber med innovasjon. Del erfaringer, bygg kompetanse og vær med å forme retningen for innovasjonsarbeid i norske kommuner.
          </p>
          <div style={{ marginTop: '36px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a href="mailto:hei@tinkr.no" className="btn" style={{ background: '#fff', color: 'var(--ink)', borderColor: '#fff' }}>
              Meld interesse <span className="arrow">→</span>
            </a>
            <Link href="/kurs" className="btn btn--ghost" style={{ background: 'transparent', color: '#fff', borderColor: 'rgba(255,255,255,.5)' }}>
              Se kursene våre
            </Link>
          </div>

          {/* Floating event card */}
          <div style={{
            position: 'absolute', bottom: '-64px', right: '8%',
            background: '#fff', color: 'var(--ink)',
            borderRadius: 'var(--radius-lg)', padding: '24px 28px',
            width: 'min(340px, 80vw)',
            boxShadow: '0 24px 48px rgba(40,20,55,.16)',
            transform: 'rotate(-1.5deg)',
          }}>
            <span style={{ display: 'inline-block', background: 'var(--accent-soft)', color: 'var(--accent-strong)', padding: '4px 10px', borderRadius: '999px', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '14px', fontWeight: 600 }}>
              Neste arrangement
            </span>
            <h4 style={{ fontSize: '20px', lineHeight: 1.2, marginBottom: '12px' }}>Åpent nettverksmøte · Lillestrøm</h4>
            <div style={{ color: 'var(--ink-500)', fontSize: '14px', display: 'grid', gap: '4px' }}>
              <span>15. mai 2026 · 10:00 – 15:00</span>
              <span>Stillverksveien 28 · Gratis inngang</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Hvorfor bli med ── */}
      <section style={{ padding: 'clamp(80px, 12vw, 160px) 0 clamp(56px, 7vw, 96px)' }}>
        <div className="container">
          <div style={{ maxWidth: '640px' }}>
            <span className="eyebrow">Hvorfor bli med?</span>
            <h2 style={{ marginTop: '18px' }}>Alt du trenger for å lykkes med innovasjon i kommunen.</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginTop: '56px' }}>
            {WHY_JOIN.map(w => (
              <div key={w.num} style={{ background: 'var(--paper)', border: '1px solid color-mix(in oklab, var(--ink) 8%, transparent)', borderRadius: 'var(--radius-lg)', padding: '36px', position: 'relative', overflow: 'hidden' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '56px', lineHeight: 1, letterSpacing: '-.02em', background: 'var(--brand-gradient)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', marginBottom: '22px', display: 'block' }}>
                  {w.num}
                </span>
                <h3 style={{ fontSize: '26px', marginBottom: '14px' }}>{w.title}</h3>
                <p style={{ color: 'var(--ink-700)', maxWidth: '50ch', lineHeight: 1.6, margin: 0 }}>{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Aktiviteter ── */}
      <section className="section section--tight">
        <div className="container">
          <div style={{ background: 'var(--ink)', color: '#fff', borderRadius: 'var(--radius-xl)', padding: 'clamp(48px, 7vw, 96px)', overflow: 'hidden', position: 'relative' }}>
            <div style={{ maxWidth: '640px' }}>
              <span className="eyebrow" style={{ color: 'rgba(255,255,255,.6)' }}>Kommende aktiviteter</span>
              <h2 style={{ color: '#fff', marginTop: '18px' }}>Hva skjer i nettverket?</h2>
              <p className="lead" style={{ color: 'rgba(255,255,255,.7)', maxWidth: '56ch', marginTop: '16px' }}>
                Møter, webinarer, fagdager og samlinger – noe for alle gjennom hele året.
              </p>
            </div>

            <div style={{ marginTop: '48px' }}>
              {ACTIVITIES.map((a, i) => (
                <div key={a.title} style={{
                  display: 'grid', gridTemplateColumns: '100px 1.4fr 1fr auto',
                  gap: '32px', alignItems: 'center',
                  padding: '26px 0',
                  borderTop: '1px solid rgba(255,255,255,.14)',
                  borderBottom: i === ACTIVITIES.length - 1 ? '1px solid rgba(255,255,255,.14)' : 'none',
                }}>
                  <div>
                    <small style={{ display: 'block', fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: '12px', color: 'rgba(255,255,255,.6)', textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: '6px' }}>{a.month}</small>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '36px', letterSpacing: '-.01em', color: '#fff', lineHeight: 1 }}>{a.day}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: '19px', color: '#fff', lineHeight: 1.3, fontWeight: 700 }}>{a.title}</div>
                    <small style={{ display: 'block', fontWeight: 400, fontSize: '14px', color: 'rgba(255,255,255,.65)', marginTop: '4px' }}>{a.desc}</small>
                  </div>
                  <div>
                    <span style={{ background: 'rgba(255,255,255,.12)', padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,.85)' }}>{a.type}</span>
                  </div>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: '17px', whiteSpace: 'nowrap', textAlign: 'right' }}>
                    {a.price}
                    <small style={{ display: 'block', fontWeight: 400, fontSize: '12px', color: 'rgba(255,255,255,.65)' }}>{a.priceNote}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Join CTA ── */}
      <section className="section">
        <div className="container container--narrow center">
          <span className="eyebrow" style={{ margin: '0 auto' }}>Bli med</span>
          <h2 style={{ margin: '18px auto 16px', maxWidth: '18ch' }}>Klar til å bli en del av nettverket?</h2>
          <p className="lead muted" style={{ margin: '0 auto' }}>
            Nettverket er åpent for ledere og innovasjonsansvarlige i norske kommuner. Meld interesse og vi tar kontakt.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '32px' }}>
            <a href="mailto:hei@tinkr.no" className="btn btn--accent">Meld interesse <span className="arrow">→</span></a>
            <Link href="/kurs" className="btn btn--ghost">Se kursene <span className="arrow">→</span></Link>
          </div>
        </div>
      </section>
    </main>
  )
}
