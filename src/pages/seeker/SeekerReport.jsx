import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

export default function SeekerReport() {
  const { t } = useApp()
  const navigate = useNavigate()

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'var(--color-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '2rem',
        }}
      >
        <svg width="38" height="38" viewBox="0 0 38 38" fill="none" aria-hidden="true">
          <path d="M10 19L17 26L28 13" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2rem',
          fontWeight: 600,
          color: 'var(--color-text)',
          marginBottom: '1.25rem',
          lineHeight: 1.3,
        }}
      >
        {t('seeker.report.heading')}
      </h1>

      <p
        style={{
          fontSize: '1.05rem',
          lineHeight: 1.7,
          color: 'var(--color-muted)',
          maxWidth: 480,
          marginBottom: '3rem',
        }}
      >
        {t('seeker.report.body')}
      </p>

      <button
        onClick={() => navigate('/seeker/share')}
        style={{
          width: '100%',
          maxWidth: 440,
          minHeight: 56,
          background: 'var(--color-primary)',
          color: '#fff',
          border: 'none',
          borderRadius: 'var(--radius-btn)',
          fontSize: '1.125rem',
          fontWeight: 600,
          cursor: 'pointer',
          marginBottom: '1rem',
        }}
      >
        {t('seeker.report.share')}
      </button>

      <button
        onClick={() => navigate('/')}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--color-muted)',
          fontSize: '0.9rem',
          cursor: 'pointer',
          padding: '0.5rem',
          minHeight: 52,
        }}
      >
        {t('seeker.welcome.back')}
      </button>
    </div>
  )
}
