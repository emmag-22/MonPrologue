import { Outlet } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function SeekerShell() {
  const { t } = useApp()

  const handlePause = () => {
    alert(t('seeker.pause.alert'))
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', position: 'relative' }}>
      <Outlet />

      {/* Pause / come back later button */}
      <button
        onClick={handlePause}
        aria-label={t('seeker.pause')}
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.75rem 1.25rem',
          background: 'var(--color-card)',
          border: '1.5px solid var(--color-border)',
          borderRadius: 999,
          fontSize: '0.85rem',
          fontWeight: 500,
          color: 'var(--color-text)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          cursor: 'pointer',
          minHeight: 52,
          zIndex: 100,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <rect x="3" y="2" width="4" height="12" rx="1" />
          <rect x="9" y="2" width="4" height="12" rx="1" />
        </svg>
        {t('seeker.pause')}
      </button>
    </div>
  )
}
