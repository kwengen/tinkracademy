import type { Metadata } from 'next'
import './globals.css'
import { Nav } from '../components/Nav'
import { Footer } from '../components/Footer'
import { AuthProvider } from '../lib/auth'
import { EditModeProvider } from '../components/EditModeContext'
import { AdminEditBar } from '../components/AdminEditBar'

// ── Tilpass disse for hvert prosjekt ──────────────────────────────────────────
export const metadata: Metadata = {
  title: 'WengenCMS – din nettside',
  description: 'Beskrivelse av nettsiden.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nb">
      <body>
        <AuthProvider>
          <EditModeProvider>
            <Nav />
            {children}
            <Footer />
            <AdminEditBar />
          </EditModeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
