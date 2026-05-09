import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function SeekerWelcome() {
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
      {/* Shield / checkmark icon */}
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
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
          <path
            d="M20 4L6 10V18C6 27.6 12.2 36.4 20 38C27.8 36.4 34 27.6 34 18V10L20 4Z"
            fill="rgba(255,255,255,0.2)"
            stroke="white"
            strokeWidth="2"
          />
          <path
            d="M14 20L18 24L26 16"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2rem',
          fontWeight: 600,
          color: 'var(--color-text)',
          marginBottom: '1.25rem',
        }}
      >
        {t('seeker.welcome.heading')}
      </h1>

      <p
        style={{
          fontSize: '1.125rem',
          lineHeight: 1.7,
          color: 'var(--color-text)',
          maxWidth: 520,
          marginBottom: '2.5rem',
        }}
      >
        {t('seeker.welcome.body')}
      </p>

      {/* TODO: Phase 1 interview questions */}

      <button
        onClick={() => navigate('/seeker/interview/1')}
        aria-label={t('seeker.welcome.start')}
        style={{
          width: '100%',
          maxWidth: 440,
          height: 56,
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
        {t('seeker.welcome.start')}
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
        aria-label={t('seeker.welcome.back')}
      >
        {t('seeker.welcome.back')}
      </button>
    </div>
  )
}
