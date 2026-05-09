import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function CaseDossier() {
  const { id } = useParams()
  const { isAuthenticated } = useApp()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated()) navigate('/clinic', { replace: true })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ minHeight: 'calc(100vh - 56px)', padding: '2rem 1.5rem' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <button
          onClick={() => navigate('/clinic/dashboard')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-muted)',
            fontSize: '0.82rem',
            cursor: 'pointer',
            padding: 0,
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}
        >
          ← Tableau de bord · Dashboard
        </button>

        <div
          style={{
            background: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-card)',
            padding: '1.5rem',
            marginBottom: '1rem',
          }}
        >
          <p
            style={{
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              color: 'var(--color-muted)',
              textTransform: 'uppercase',
              marginBottom: '0.4rem',
            }}
          >
            Dossier · Case file
          </p>
          <p
            style={{
              fontFamily: 'monospace',
              fontSize: '1.4rem',
              fontWeight: 700,
              color: 'var(--color-text)',
              letterSpacing: '0.04em',
            }}
          >
            #{id}
          </p>
        </div>

        <div
          style={{
            background: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-card)',
            padding: '3rem 1.5rem',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '0.9rem', color: 'var(--color-muted)', fontStyle: 'italic' }}>
            Dossier complet — à venir · Full dossier coming soon
          </p>
        </div>
      </div>
    </div>
  )
}
