import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

export default function PinDisplay() {
  const { sessionPin, t } = useApp()
  const navigate = useNavigate()

  useEffect(() => {
    if (!sessionPin) navigate('/')
  }, [sessionPin, navigate])

  if (!sessionPin) return null

  const formatted = `${sessionPin.slice(0, 3)} ${sessionPin.slice(3)}`

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
      {/* Lock icon */}
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
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
          <rect x="9" y="17" width="18" height="13" rx="2" stroke="white" strokeWidth="2" />
          <path d="M13 17v-4a5 5 0 0110 0v4" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <circle cx="18" cy="23" r="2" fill="white" />
        </svg>
      </div>

      <p
        style={{
          fontSize: '0.95rem',
          fontWeight: 600,
          color: 'var(--color-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: '0.75rem',
        }}
      >
        {t('pin.heading')}
      </p>

      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '4.5rem',
          fontWeight: 700,
          color: 'var(--color-primary)',
          letterSpacing: '0.18em',
          lineHeight: 1,
          marginBottom: '2rem',
        }}
      >
        {formatted}
      </div>

      <p
        style={{
          fontSize: '1.05rem',
          lineHeight: 1.7,
          color: 'var(--color-text)',
          maxWidth: 420,
          marginBottom: '3rem',
        }}
      >
        {t('pin.instruction')}
      </p>

      <button
        onClick={() => navigate('/seeker')}
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
        }}
      >
        {t('pin.cta')}
      </button>
    </div>
  )
}
