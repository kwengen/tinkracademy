import Link from 'next/link'

// ── Tilpass footer-innholdet for hvert prosjekt ───────────────────────────────
const SITE_NAME    = 'WengenCMS'
const SITE_TAGLINE = 'Et CMS-rammeverk for raskt å bygge nye nettsider.'
const CURRENT_YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <div className="footer__logo">{SITE_NAME}</div>
            <p className="footer__tagline">{SITE_TAGLINE}</p>
          </div>
          <div className="footer__col">
            <h4>Innhold</h4>
            <ul>
              <li><Link href="/artikler">Artikler</Link></li>
            </ul>
          </div>
          <div className="footer__col">
            <h4>Konto</h4>
            <ul>
              <li><Link href="/logg-inn">Logg inn</Link></li>
              <li><Link href="/registrer">Registrer deg</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <p>© {CURRENT_YEAR} {SITE_NAME}. Alle rettigheter reservert.</p>
        </div>
      </div>
    </footer>
  )
}
