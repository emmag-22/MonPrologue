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
    <div style={{ minHeight: 'calc(100vh - 52px)', background: 'var(--navy)', padding: '2rem 1.5rem' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        {/* Back link */}
        <button
          onClick={() => navigate('/clinic/dashboard')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '0.78rem',
            cursor: 'pointer',
            padding: 0,
            marginBottom: '1.5rem',
            letterSpacing: '0.02em',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          ← Tableau de bord · Dashboard
        </button>

        {/* Header */}
        <div
          style={{
            background: 'var(--navy-mid)',
            border: '1px solid var(--border)',
            borderRadius: 6,
            padding: '1.25rem 1.5rem',
            marginBottom: '1.5rem',
          }}
        >
          <p
            style={{
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              marginBottom: '0.4rem',
            }}
          >
            DOSSIER · CASE FILE
          </p>
          <p
            style={{
              fontFamily: 'monospace',
              fontSize: '1.4rem',
              fontWeight: 700,
              color: 'var(--off-white)',
              letterSpacing: '0.06em',
            }}
          >
            #{id}
          </p>
        </div>

        {/* Stub */}
        <div
          style={{
            background: 'var(--navy-mid)',
            border: '1px solid var(--border)',
            borderRadius: 6,
            padding: '3rem 1.5rem',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontSize: '0.9rem',
              color: 'var(--text-muted)',
              fontStyle: 'italic',
            }}
          >
            Dossier complet — à venir · Full dossier coming soon
          </p>
        </div>
      </div>
    </div>
  )
}
