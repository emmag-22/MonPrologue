import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { getPriority } from '../lib/mockCases'

const PRIORITY_COLOR = {
  red:    '#d94f3d',
  orange: '#e8a020',
  yellow: '#d4b84a',
  green:  '#2eb87e',
}

const STRENGTH_STYLE = {
  'Strong':          { color: '#0D5C3A', background: 'rgba(13,92,58,0.08)' },
  'Moderate-Strong': { color: '#1a9b8a', background: 'rgba(26,155,138,0.1)' },
  'Moderate':        { color: '#8a6200', background: 'rgba(232,160,32,0.1)' },
  'Weak':            { color: '#C0392B', background: 'rgba(192,57,43,0.08)' },
}

const STRENGTH_LABEL = {
  'Strong':          'STRONG',
  'Moderate-Strong': 'MOD–STRONG',
  'Moderate':        'MODERATE',
  'Weak':            'WEAK',
}

const RED_FLAG_TAGS = new Set([
  'Explicit threat',
  'Imminent bodily harm',
  'Physical violence',
  'Minor claimant',
])

const TABS = [
  { key: 'open',     fr: 'Dossiers ouverts',  en: 'Open cases' },
  { key: 'working',  fr: 'En traitement',      en: 'Working' },
  { key: 'archived', fr: 'Archivés',           en: 'Archived' },
]

function formatDate(iso) {
  const d = new Date(iso)
  const m = ['jan', 'fév', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sep', 'oct', 'nov', 'déc']
  return `${d.getDate()} ${m[d.getMonth()]} ${d.getFullYear()}`
}

function CaseCard({ caseObj, onClick }) {
  const priority  = getPriority(caseObj)
  const isMedical = caseObj.legalCategory === 'Section 97 — Medical Ineligible'
  const isRedTag  = RED_FLAG_TAGS.has(caseObj.detailTag)
  const daysSince = Math.round((Date.now() - new Date(caseObj.filedDate).getTime()) / 86400000)

  const strengthStyle = isMedical
    ? { color: 'var(--color-muted)', background: 'rgba(122,122,114,0.08)' }
    : STRENGTH_STYLE[caseObj.claimStrength] ?? STRENGTH_STYLE['Moderate']

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
      {/* Urgency band */}
      <div style={{ width: 4, background: PRIORITY_COLOR[priority], flexShrink: 0 }} />

      {/* Content */}
      <div
        style={{
          flex: 1,
          padding: '0.875rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.45rem',
        }}
      >
        {/* Row 1: session ID + strength badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
          <span
            style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              padding: '0.2rem 0.6rem',
              borderRadius: 999,
              ...strengthStyle,
            }}
          >
            {STRENGTH_LABEL[caseObj.claimStrength]}
          </span>
        </div>

        {/* Row 2: flag + country */}
        <div style={{ fontSize: '0.9rem', color: 'var(--color-text)', fontWeight: 500 }}>
          {caseObj.countryFlag}&nbsp;&nbsp;{caseObj.country}
        </div>

        {/* Row 3: legal category */}
        <div
          style={{
            fontSize: '0.75rem',
            color: 'var(--color-muted)',
            fontFamily: 'monospace',
            letterSpacing: '0.01em',
          }}
        >
          {caseObj.legalCategory}
        </div>

        {/* Row 4: detail tag + days since filing */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 500,
              padding: '0.2rem 0.6rem',
              borderRadius: 999,
              background: isRedTag
                ? 'rgba(192,57,43,0.07)'
                : 'rgba(122,122,114,0.08)',
              color: isRedTag ? 'var(--color-danger)' : 'var(--color-muted)',
              border: isRedTag
                ? '1px solid rgba(192,57,43,0.2)'
                : '1px solid transparent',
              boxShadow: isRedTag ? '0 0 6px rgba(192,57,43,0.15)' : 'none',
            }}
          >
            {caseObj.detailTag}
          </span>
          <span
            style={{
              fontSize: '0.73rem',
              color: 'var(--color-muted)',
              fontFamily: 'monospace',
            }}
          >
            {daysSince}j · {formatDate(caseObj.filedDate)}
          </span>
        </div>
      </div>
    </button>
  )
}

export default function ClinicDashboard() {
  const { isAuthenticated, cases } = useApp()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('open')

  useEffect(() => {
    if (!isAuthenticated()) navigate('/clinic', { replace: true })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
          gap: '0.65rem',
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
    </div>
  )
}
