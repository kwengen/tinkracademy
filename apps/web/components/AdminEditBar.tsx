'use client'

import { useAuth } from '@/lib/auth'
import { useEditMode } from './EditModeContext'

export function AdminEditBar() {
  const { role } = useAuth()
  const { isEditMode, toggle } = useEditMode()

  if (role !== 'admin' && role !== 'superadmin') return null

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: '.75rem',
      background: isEditMode ? 'var(--clr-primary)' : '#1A2332',
      color: 'white',
      padding: '.5rem .875rem .5rem .75rem',
      borderRadius: '2rem',
      boxShadow: '0 4px 16px rgba(0,0,0,.25)',
      fontSize: '.8125rem',
      fontWeight: 600,
      cursor: 'pointer',
      border: 'none',
      userSelect: 'none',
      transition: 'background .15s',
    }}
    onClick={toggle}
    role="button"
    tabIndex={0}
    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') toggle() }}
    title={isEditMode ? 'Avslutt redigeringsmodus' : 'Aktiver inline-redigering'}
    >
      <span style={{ fontSize: '1rem' }}>{isEditMode ? '✎' : '✏️'}</span>
      <span>{isEditMode ? 'Redigerer – klikk for å avslutte' : 'Rediger side'}</span>
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        background: isEditMode ? 'rgba(255,255,255,.25)' : 'rgba(255,255,255,.15)',
        fontSize: '.625rem',
      }}>
        {isEditMode ? '✓' : '→'}
      </span>
    </div>
  )
}
