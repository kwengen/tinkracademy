import Link from 'next/link'
import { notFound } from 'next/navigation'
import { fetchKursBySlug } from '@/lib/kurs-cms'
import PaameldingKnapp from './PaameldingKnapp'

export default async function KursDetalj({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const course = await fetchKursBySlug(slug)
  if (!course) notFound()

  const priceDisplay = course.pris_ou ?? course.pris_full ?? '–'
  const priceNote = course.pris_full
    ? `${course.pris_full} uten OU-refusjon · Inkl. lunsj og materiale`
    : ''

  const quickMeta = [
    course.varighet && { label: course.varighet, value: 'Fysisk + digital oppfølging' },
    course.sted    && { label: course.sted,      value: '' },
    course.datoer_tekst && { label: course.datoer_tekst, value: '' },
    (course.pris_ou || course.pris_full) && {
      label: course.pris_ou ? `${course.pris_ou}* / ${course.pris_full}` : (course.pris_full ?? ''),
      value: course.pris_ou ? '* OU-midler dekker' : '',
    },
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <main>
      {/* ── Course hero ── */}
      <section style={{
        position: 'relative', color: '#fff',
        background: 'var(--brand-gradient)', overflow: 'hidden', isolation: 'isolate',
        borderRadius: '0 0 var(--radius-xl) var(--radius-xl)',
      }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: -1, background: 'radial-gradient(50% 70% at 90% 10%, rgba(255,255,255,.2) 0%, transparent 60%), radial-gradient(60% 80% at 0% 100%, rgba(0,0,0,.18) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div className="container" style={{ paddingTop: 'clamp(56px, 8vw, 100px)', paddingBottom: 'clamp(64px, 9vw, 120px)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.8)', marginBottom: '32px' }}>
            <Link href="/kurs" style={{ color: 'inherit' }}>Alle kurs</Link>
            <span style={{ opacity: .5, margin: '0 10px' }}>/</span>
            <span>{course.kategori}</span>
          </div>
          <h1 style={{
            color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 500,
            fontSize: 'clamp(40px, 5.6vw, 80px)', lineHeight: 1.04,
            letterSpacing: '-0.03em', maxWidth: '18ch', margin: 0,
          }}>
            {course.tittel}
          </h1>
          {course.ingress && (
            <p style={{ fontSize: '19px', color: 'rgba(255,255,255,.9)', margin: '24px 0 32px', maxWidth: '50ch' }}>{course.ingress}</p>
          )}
          {quickMeta.length > 0 && (
            <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,.18)', fontSize: '14px', color: 'rgba(255,255,255,.85)' }}>
              {quickMeta.map(m => (
                <div key={m.label}>
                  <strong style={{ color: '#fff', display: 'block', fontWeight: 600, marginBottom: '4px' }}>{m.label}</strong>
                  {m.value}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Two-col layout ── */}
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 0.85fr', gap: '64px', padding: 'clamp(56px, 8vw, 96px) 0' }}>

          {/* ── Body ── */}
          <article>
            {course.intro && (
              <section style={{ marginBottom: '56px' }}>
                <span className="eyebrow">Innledning</span>
                <h2 style={{ marginTop: '16px', fontSize: 'clamp(28px, 3vw, 40px)', lineHeight: 1.1 }}>
                  En sterk innovasjonskultur er avgjørende for å tilpasse seg og lykkes.
                </h2>
                <p style={{ color: 'var(--ink-700)', fontSize: '17px', lineHeight: 1.65, marginTop: '16px', maxWidth: '70ch' }}>{course.intro}</p>
              </section>
            )}

            {course.about_tekst.length > 0 && (
              <section style={{ marginBottom: '56px' }}>
                <h2 style={{ fontSize: 'clamp(28px, 3vw, 40px)', lineHeight: 1.1, marginBottom: '20px' }}>Om kurset</h2>
                {course.about_tekst.map((p, i) => (
                  <p key={i} style={{ color: 'var(--ink-700)', fontSize: '17px', lineHeight: 1.65, maxWidth: '70ch' }}>{p}</p>
                ))}
              </section>
            )}

            {course.for_hvem && (
              <section style={{ marginBottom: '56px' }}>
                <h2 style={{ fontSize: 'clamp(28px, 3vw, 40px)', lineHeight: 1.1, marginBottom: '20px' }}>Hvem er kurset for</h2>
                <p style={{ color: 'var(--ink-700)', fontSize: '17px', lineHeight: 1.65, maxWidth: '70ch' }}>{course.for_hvem}</p>
              </section>
            )}

            {course.laringsutbytter.length > 0 && (
              <section style={{ marginBottom: '56px' }}>
                <h2 style={{ fontSize: 'clamp(28px, 3vw, 40px)', lineHeight: 1.1, marginBottom: '28px' }}>Hva lærer du?</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  {course.laringsutbytter.map((o, i) => (
                    <div key={i} style={{
                      background: 'var(--off-white)',
                      border: '1px solid color-mix(in oklab, var(--ink) 7%, transparent)',
                      borderRadius: 'var(--radius)', padding: '22px 24px',
                    }}>
                      <span style={{ display: 'inline-block', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--accent-strong)', marginBottom: '8px', letterSpacing: '.12em' }}>
                        0{i + 1}
                      </span>
                      <h4 style={{ fontSize: '17px', lineHeight: 1.3, fontWeight: 600, margin: 0 }}>{o}</h4>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {course.innhold_avsnitt.length > 0 && (
              <section style={{ marginBottom: '56px' }}>
                <h2 style={{ fontSize: 'clamp(28px, 3vw, 40px)', lineHeight: 1.1, marginBottom: '20px' }}>Kursinnhold</h2>
                <ul style={{ paddingLeft: 0, listStyle: 'none', display: 'grid', gap: '16px', margin: '24px 0' }}>
                  {course.innhold_avsnitt.map((item, i) => (
                    <li key={i} style={{ paddingLeft: '36px', position: 'relative', fontSize: '16px', color: 'var(--ink-700)', lineHeight: 1.55 }}>
                      <span style={{ position: 'absolute', left: 0, top: '8px', width: '22px', height: '2px', background: 'var(--accent)', display: 'block' }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {course.oppfolging && (
              <section style={{ marginBottom: '56px' }}>
                <h2 style={{ fontSize: 'clamp(28px, 3vw, 40px)', lineHeight: 1.1, marginBottom: '20px' }}>Oppfølging etter kurset</h2>
                <p style={{ color: 'var(--ink-700)', fontSize: '17px', lineHeight: 1.65, maxWidth: '70ch' }}>{course.oppfolging}</p>
              </section>
            )}

            {course.prinsipper.length > 0 && (
              <section style={{ marginBottom: '56px' }}>
                <h2 style={{ fontSize: 'clamp(28px, 3vw, 40px)', lineHeight: 1.1, marginBottom: '20px' }}>Prinsipper vi legger vekt på</h2>
                <p style={{ color: 'var(--ink-700)', fontSize: '17px', lineHeight: 1.65, maxWidth: '70ch', marginBottom: '20px' }}>For å sikre at kursene våre gir mest mulig verdi har vi alltid:</p>
                <ul style={{ paddingLeft: 0, listStyle: 'none', display: 'grid', gap: '16px', margin: '24px 0' }}>
                  {course.prinsipper.map((p, i) => (
                    <li key={i} style={{ paddingLeft: '36px', position: 'relative', fontSize: '16px', color: 'var(--ink-700)', lineHeight: 1.55 }}>
                      <span style={{ position: 'absolute', left: 0, top: '8px', width: '22px', height: '2px', background: 'var(--accent)', display: 'block' }} />
                      {p}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section style={{ marginBottom: '56px' }}>
              <h2 style={{ fontSize: 'clamp(28px, 3vw, 40px)', lineHeight: 1.1, marginBottom: '28px' }}>Medvirkende</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px' }}>
                {[
                  { img: '/img/kristian.jpg', name: 'Kristian Wengen', role: 'Daglig leder, Tinkr', bio: 'Kristian er daglig leder i selskapet, sitter på hovedkontoret i Vadsø og har utviklet en rekke større bærekraftsprogram for blant annet Biotech North og Innovasjon Norge.' },
                  { img: '/img/ida.jpg', name: 'Ida Skjerve', role: 'Senior rådgiver, Tinkr', bio: 'Ida har lang erfaring og god kjennskap til offentlig sektor, sist fra Nordre Follo kommune. Med bakgrunn som pedagog og spesialpedagog klarer hun å formidle kompleks teori på en forståelig og enkel måte.' },
                ].map(instructor => (
                  <div key={instructor.name} style={{ display: 'grid', gridTemplateColumns: '96px 1fr', gap: '18px', alignItems: 'start' }}>
                    <img src={instructor.img} alt={instructor.name} style={{ width: '96px', height: '96px', objectFit: 'cover', borderRadius: '50%' }} />
                    <div>
                      <h4 style={{ fontSize: '18px', margin: 0, lineHeight: 1.2 }}>{instructor.name}</h4>
                      <div style={{ color: 'var(--accent-strong)', fontSize: '13px', fontWeight: 600, marginTop: '2px' }}>{instructor.role}</div>
                      <p style={{ fontSize: '14px', marginTop: '10px', color: 'var(--ink-500)', lineHeight: 1.55, maxWidth: 'none' }}>{instructor.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </article>

          {/* ── Booking sidebar ── */}
          <aside>
            <div style={{
              position: 'sticky', top: '100px',
              background: 'var(--paper)', borderRadius: 'var(--radius-lg)',
              border: '1px solid color-mix(in oklab, var(--ink) 8%, transparent)',
              padding: '28px', boxShadow: '0 8px 24px rgba(40,43,59,.06)',
            }}>
              <div style={{ paddingBottom: '24px', borderBottom: '1px solid var(--ink-100)', marginBottom: '24px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '40px', letterSpacing: '-.02em', color: 'var(--ink)', lineHeight: 1 }}>
                  {priceDisplay}{course.pris_ou && <span style={{ fontSize: '20px', color: 'var(--ink-500)', fontWeight: 400 }}>*</span>}
                </div>
                {priceNote && (
                  <div style={{ color: 'var(--ink-500)', fontSize: '13px', marginTop: '4px' }}>
                    <strong style={{ color: 'var(--pink)' }}>{course.pris_full}</strong> uten OU-refusjon · Inkl. lunsj og materiale
                  </div>
                )}
              </div>

              {course.datoer.length > 0 && (
                <div style={{ display: 'grid', gap: '18px', fontSize: '14px' }}>
                  {course.datoer.map(d => (
                    <div key={d.id} style={{ display: 'grid', gridTemplateColumns: '44px 1fr', gap: '14px', alignItems: 'center' }}>
                      <div style={{
                        background: 'var(--accent-soft)', color: 'var(--accent-strong)',
                        borderRadius: '10px', textAlign: 'center', padding: '8px 0',
                        fontWeight: 700, fontFamily: 'var(--font-display)',
                      }}>
                        <small style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 600, opacity: .7 }}>{d.maaned}</small>
                        <big style={{ fontSize: '20px', lineHeight: 1, display: 'block' }}>{d.dag}</big>
                      </div>
                      <div>
                        <strong style={{ display: 'block', color: 'var(--ink)', fontWeight: 600, fontSize: '15px' }}>{d.label}</strong>
                        {d.tid && <span style={{ color: 'var(--ink-500)' }}>{d.tid}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'grid', gap: '12px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--ink-100)', fontSize: '14px', color: 'var(--ink-700)' }}>
                {[
                  course.sted          && { icon: '📍', text: course.sted },
                  course.varighet      && { icon: '⏱', text: course.varighet },
                  course.max_deltakere && { icon: '👥', text: course.max_deltakere },
                ].filter(Boolean).map(r => r && (
                  <div key={r.text} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ fontSize: '16px' }}>{r.icon}</span>
                    {r.text}
                  </div>
                ))}
              </div>

              <PaameldingKnapp
                kursId={course.id}
                dynamicsEventId={course.dynamics_id ?? ''}
                kursTittel={course.tittel}
              />
            </div>
          </aside>
        </div>
      </div>

      {/* ── Final CTA ── */}
      <section className="section section--tight">
        <div className="container">
          <div style={{
            background: 'var(--ink)', color: '#fff',
            borderRadius: 'var(--radius-xl)',
            padding: 'clamp(48px, 6vw, 80px)',
            textAlign: 'center',
          }}>
            <span className="eyebrow" style={{ color: 'rgba(255,255,255,.6)', margin: '0 auto' }}>Trenger du sparring?</span>
            <h2 style={{ color: '#fff', maxWidth: '22ch', margin: '18px auto 18px' }}>Vi kan tilpasse kurset til ledergruppen din.</h2>
            <p style={{ color: 'rgba(255,255,255,.75)', maxWidth: '60ch', margin: '0 auto 28px' }}>Mange kommuner kjøper kurset som et internt forløp for hele ledergruppen sin. Ta kontakt så ser vi på det sammen.</p>
            <a href="mailto:hei@tinkr.no" className="btn" style={{ background: '#fff', color: 'var(--ink)', borderColor: '#fff' }}>
              Kontakt oss <span className="arrow">→</span>
            </a>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 980px) {
          .course-layout { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
        @media (max-width: 640px) {
          .learn-grid-inner { grid-template-columns: 1fr !important; }
          .instructors-inner { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  )
}
