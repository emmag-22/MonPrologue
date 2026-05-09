import { Outlet, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Logo from '../components/Logo'

export default function ClinicShell() {
  const { language, setLanguage, clinicAuth, setClinicAuth, setRole, t } = useApp()
  const navigate = useNavigate()

  const handleLogout = () => {
    setClinicAuth(null)
    setRole(null)
    navigate('/')
  }

  const toggleLang = () => setLanguage(language === 'fr' ? 'en' : 'fr')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Pink aura gradient at top */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, var(--color-primary), var(--color-pink), var(--color-primary))', zIndex: 100 }} />

      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.5rem', height: 56, background: 'var(--color-card)', borderBottom: '1px solid var(--color-border)' }}>
        <Logo size="sm" />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* FR/EN toggle */}
          <button onClick={toggleLang} style={{ padding: '0.3rem 0.65rem', borderRadius: 999, fontSize: '0.72rem', fontWeight: 600, border: '1.5px solid var(--color-border)', background: 'transparent', color: 'var(--color-text)', cursor: 'pointer', letterSpacing: '0.03em' }}>
            {language === 'fr' ? 'EN' : 'FR'}
          </button>

          {clinicAuth && (
            <>
              <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--color-muted)', letterSpacing: '0.04em' }}>
                {clinicAuth.employeeId}
              </span>
              <button onClick={handleLogout} style={{ padding: '0.4rem 0.9rem', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-btn)', fontSize: '0.78rem', fontWeight: 500, color: 'var(--color-text)', background: 'transparent', cursor: 'pointer', minHeight: 34 }}>
                {t('clinic.logout')}
              </button>
            </>
          )}
        </div>
      </nav>

      <Outlet />
    </div>
  )
}
