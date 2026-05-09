import { Outlet, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function ClinicShell() {
  const { clinicAuth, setClinicAuth, setRole } = useApp()
  const navigate = useNavigate()

  const handleLogout = () => {
    setClinicAuth(null)
    setRole(null)
    navigate('/')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)' }}>
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
          height: 52,
          background: 'var(--navy-mid)',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: '1.2rem',
            fontWeight: 600,
            color: 'var(--off-white)',
            letterSpacing: '0.06em',
          }}
        >
          REFUGE
        </span>

        {clinicAuth && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.04em',
              }}
            >
              {clinicAuth.employeeId} · {clinicAuth.estabId}
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: '0.35rem 0.85rem',
                border: '1px solid var(--border)',
                borderRadius: 4,
                fontSize: '0.78rem',
                fontWeight: 500,
                color: 'var(--text-muted)',
                background: 'transparent',
                cursor: 'pointer',
                letterSpacing: '0.02em',
                minHeight: 30,
              }}
            >
              Se déconnecter · Log out
            </button>
          </div>
        )}
      </nav>

      <Outlet />
    </div>
  )
}
