import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { getPriority } from '../lib/mockCases'

const PRIORITY_COLOR = {
  red:    '#FF2D2D',
  orange: '#FF8C00',
  yellow: '#FFD700',
  green:  '#00CC44',
}

const TABS = [
  { key: 'open',     fr: 'Dossiers ouverts',  en: 'Open cases' },
  { key: 'working',  fr: 'En traitement',      en: 'Working' },
  { key: 'archived', fr: 'Archivés',           en: 'Archived' },
]

const LEGEND = [
  { color: '#FF2D2D', label: 'Audience imminente / Menace explicite' },
  { color: '#FF8C00', label: 'Audience dans 30 jours / Dossier ancien' },
  { color: '#FFD700', label: 'Audience dans 60 jours' },
  { color: '#00CC44', label: 'Nouveau dossier' },
]

function CaseCard({ caseObj, onClick }) {
  const priority = getPriority(caseObj)

  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        width: '100%',
        textAlign: 'left',
        background: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-card)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'box-shadow 0.15s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)')}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
    >
      {/* Urgency sidebar */}
      <div style={{ width: 10, background: PRIORITY_COLOR[priority], flexShrink: 0 }} />

      {/* Content */}
      <div
        style={{
          flex: 1,
          padding: '0.75rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.3rem',
        }}
      >
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: 'var(--color-text)',
            letterSpacing: '0.04em',
          }}
        >
          {caseObj.sessionId}
        </span>
        <span style={{ fontSize: '0.9rem', color: 'var(--color-text)', fontWeight: 500 }}>
          {caseObj.countryFlag}&nbsp;&nbsp;{caseObj.country}
        </span>
      </div>

      {/* Right urgency bar */}
      <div style={{ width: 6, background: PRIORITY_COLOR[priority], flexShrink: 0 }} />
    </button>
  )
}

const CLINIC_NAME = 'Le Collectif Bienvenue'

export default function ClinicDashboard() {
  const { isAuthenticated, cases: mockCases } = useApp()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('open')
  const [liveCases, setLiveCases] = useState([])

  useEffect(() => {
    if (!isAuthenticated()) navigate('/clinic', { replace: true })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch real cases from Firestore
  useEffect(() => {
    const API = import.meta.env.DEV ? 'http://localhost:3001' : ''
    fetch(`${API}/api/cases?clinic=${encodeURIComponent(CLINIC_NAME)}`)
      .then(r => r.ok ? r.json() : { cases: [] })
      .then(data => setLiveCases(data.cases || []))
      .catch(() => {})
  }, [])

  // Merge mock + live cases (live cases first, dedupe by id)
  const seen = new Set()
  const cases = [...liveCases, ...mockCases].filter(c => {
    if (seen.has(c.id)) return false
    seen.add(c.id)
    return true
  })

  const tabCounts = Object.fromEntries(
    TABS.map((t) => [t.key, cases.filter((c) => c.status === t.key).length])
  )
  const visible = cases.filter((c) => c.status === activeTab)

  return (
    <div style={{ minHeight: 'calc(100vh - 56px)', padding: '0 0 3rem' }}>
      {/* Tab bar */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--color-border)',
          background: 'var(--color-card)',
          padding: '0 1.5rem',
        }}
      >
        {TABS.map((tab) => {
          const active = tab.key === activeTab
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0.8rem 1.25rem 0.65rem',
                background: 'none',
                border: 'none',
                borderBottom: active
                  ? '2px solid var(--color-primary)'
                  : '2px solid transparent',
                cursor: 'pointer',
                marginBottom: '-1px',
                gap: '0.05rem',
              }}
            >
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontSize: '0.85rem',
                  fontWeight: active ? 600 : 400,
                  color: active ? 'var(--color-primary)' : 'var(--color-muted)',
                }}
              >
                {tab.fr}
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    padding: '0.05rem 0.45rem',
                    borderRadius: 999,
                    background: active
                      ? 'rgba(13,92,58,0.1)'
                      : 'rgba(122,122,114,0.1)',
                    color: active ? 'var(--color-primary)' : 'var(--color-muted)',
                  }}
                >
                  {tabCounts[tab.key]}
                </span>
              </span>
              <span style={{ fontSize: '0.68rem', color: 'var(--color-muted)' }}>
                {tab.en}
              </span>
            </button>
          )
        })}
      </div>

      {/* Case list */}
      <div
        style={{
          maxWidth: 860,
          margin: '0 auto',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        {visible.length === 0 ? (
          <p
            style={{
              textAlign: 'center',
              color: 'var(--color-muted)',
              fontSize: '0.85rem',
              marginTop: '3rem',
              fontStyle: 'italic',
            }}
          >
            Aucun dossier · No cases
          </p>
        ) : (
          visible.map((c) => (
            <CaseCard
              key={c.id}
              caseObj={c}
              onClick={() => navigate(`/clinic/case/${c.id}`)}
            />
          ))
        )}
      </div>

      {/* Legend */}
      <div
        style={{
          position: 'fixed',
          bottom: '1.25rem',
          left: '1.25rem',
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 8,
          padding: '0.6rem 0.85rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          zIndex: 50,
        }}
      >
        {LEGEND.map(({ color, label }) => (
          <div
            key={color}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                background: color,
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: '0.68rem', color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
