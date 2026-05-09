import { Outlet, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function ClinicShell() {
  const { t, setRole } = useApp()
  const navigate = useNavigate()

  const handleLogout = () => {
    setRole(null)
    navigate('/')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F3' }}>
      {/* Top nav */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1.5rem',
          background: 'var(--color-card)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'var(--color-primary)',
          }}
        >
          {t('clinic.nav.logo')}
        </span>
        <button
          onClick={handleLogout}
          aria-label={t('clinic.nav.logout')}
          style={{
            padding: '0.5rem 1rem',
            border: '1.5px solid var(--color-border)',
            borderRadius: 'var(--radius-btn)',
            fontSize: '0.85rem',
            fontWeight: 500,
            color: 'var(--color-text)',
            background: 'transparent',
            cursor: 'pointer',
            minHeight: 36,
          }}
        >
          {t('clinic.nav.logout')}
        </button>
      </nav>

      <Outlet />
    </div>
  )
}
