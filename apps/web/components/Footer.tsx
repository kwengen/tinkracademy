import Link from 'next/link'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="brand">
              <img className="logo" src="/img/tinkr-academy-logo-white.png" alt="Tinkr Academy" />
            </Link>
            <p>Praktisk kompetanseheving for innovasjonsledere i offentlig sektor. Forskningsbasert, KS-godkjent og forankret i kommunal hverdag.</p>
          </div>
          <div>
            <h4>Akademiet</h4>
            <ul>
              <li><Link href="/kurs">Alle kurs</Link></li>
              <li><Link href="/nettverk">Innovasjonsnettverket</Link></li>
              <li><Link href="/om">Om Tinkr Academy</Link></li>
              <li><Link href="/om#medvirkende">Medvirkende</Link></li>
            </ul>
          </div>
          <div>
            <h4>For kommuner</h4>
            <ul>
              <li><Link href="#">OU-midler &amp; refusjon</Link></li>
              <li><Link href="#">Skreddersydde forløp</Link></li>
              <li><Link href="#">Webinarer</Link></li>
            </ul>
          </div>
          <div>
            <h4>Kontakt</h4>
            <ul>
              <li><a href="mailto:hei@tinkr.no">hei@tinkr.no</a></li>
              <li style={{ color: 'color-mix(in oklab, var(--paper) 60%, transparent)' }}>Stillverksveien 28, Lillestrøm</li>
              <li style={{ color: 'color-mix(in oklab, var(--paper) 60%, transparent)' }}>Hovedkontor Vadsø</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Tinkr AS. Alle rettigheter forbeholdt.</span>
          <span>Personvern · Vilkår · Cookies</span>
        </div>
      </div>
    </footer>
  )
}
