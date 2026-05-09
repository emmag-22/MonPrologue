import { Outlet, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Logo from '../components/Logo'

export default function ClinicShell() {
  const { clinicAuth, setClinicAuth, setRole } = useApp()
  const navigate = useNavigate()

  const handleLogout = () => {
    setClinicAuth(null)
    setRole(null)
    navigate('/')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
          height: 56,
          background: 'var(--color-card)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <Logo size="sm" />

        {clinicAuth && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '0.78rem',
                color: 'var(--color-muted)',
                letterSpacing: '0.04em',
              }}
            >
              {clinicAuth.employeeId} · {clinicAuth.estabId}
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: '0.4rem 0.9rem',
                border: '1.5px solid var(--color-border)',
                borderRadius: 'var(--radius-btn)',
                fontSize: '0.8rem',
                fontWeight: 500,
                color: 'var(--color-text)',
                background: 'transparent',
                cursor: 'pointer',
                minHeight: 34,
              }}
            >
              Se déconnecter
            </button>
          </div>
        )}
      </nav>

      <Outlet />
    </div>
  )
}
