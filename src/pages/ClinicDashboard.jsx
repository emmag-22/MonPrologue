import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { getPriority } from '../lib/mockCases'

const PRIORITY_COLOR = {
  red:    'var(--urgent-red)',
  orange: 'var(--urgent-orange)',
  yellow: 'var(--urgent-yellow)',
  green:  'var(--urgent-green)',
}

const STRENGTH_STYLE = {
  'Strong':          { color: '#2eb87e', background: '#071f14' },
  'Moderate-Strong': { color: '#1a9b8a', background: '#071917' },
  'Moderate':        { color: '#e8a020', background: '#1f1400' },
  'Weak':            { color: '#d94f3d', background: '#1a0806' },
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
  const priority   = getPriority(caseObj)
  const isMedical  = caseObj.legalCategory === 'Section 97 — Medical Ineligible'
  const isRedTag   = RED_FLAG_TAGS.has(caseObj.detailTag)
  const daysSince  = Math.round((Date.now() - new Date(caseObj.filedDate).getTime()) / 86400000)

  const strengthStyle = isMedical
    ? { color: '#8a9bb0', background: '#1a2e42' }
    : STRENGTH_STYLE[caseObj.claimStrength] ?? STRENGTH_STYLE['Moderate']

  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        width: '100%',
        textAlign: 'left',
        background: 'var(--navy-mid)',
        border: '1px solid var(--border)',
        borderRadius: 6,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'border-color 0.15s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--navy-light)')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      {/* Urgency band */}
      <div style={{ width: 4, background: PRIORITY_COLOR[priority], flexShrink: 0 }} />

      {/* Content */}
      <div
        style={{
          flex: 1,
          padding: '0.75rem 1rem',
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
              color: 'var(--off-white)',
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
              padding: '0.2rem 0.55rem',
              borderRadius: 999,
              ...strengthStyle,
            }}
          >
            {STRENGTH_LABEL[caseObj.claimStrength]}
          </span>
        </div>

        {/* Row 2: flag + country */}
        <div
          style={{
            fontSize: '0.9rem',
            color: 'var(--off-white)',
            fontWeight: 500,
          }}
        >
          {caseObj.countryFlag}&nbsp;&nbsp;{caseObj.country}
        </div>

        {/* Row 3: legal category */}
        <div
          style={{
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            fontFamily: 'monospace',
            letterSpacing: '0.02em',
          }}
        >
          {caseObj.legalCategory}
        </div>

        {/* Row 4: detail tag + days since filing */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 500,
              padding: '0.2rem 0.55rem',
              borderRadius: 999,
              background: isRedTag ? 'rgba(217,79,61,0.12)' : 'rgba(138,155,176,0.1)',
              color: isRedTag ? 'var(--urgent-red)' : 'var(--text-muted)',
              border: isRedTag ? '1px solid rgba(217,79,61,0.3)' : '1px solid transparent',
              boxShadow: isRedTag ? '0 0 8px rgba(217,79,61,0.25)' : 'none',
            }}
          >
            {caseObj.detailTag}
          </span>
          <span
            style={{
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              fontFamily: 'monospace',
              letterSpacing: '0.02em',
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
    <div style={{ minHeight: 'calc(100vh - 52px)', background: 'var(--navy)' }}>
      {/* Tab bar */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--border)',
          background: 'var(--navy-mid)',
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
                padding: '0.75rem 1.25rem 0.65rem',
                background: 'none',
                border: 'none',
                borderBottom: active ? '2px solid var(--off-white)' : '2px solid transparent',
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
                  fontSize: '0.82rem',
                  fontWeight: active ? 600 : 400,
                  color: active ? 'var(--off-white)' : 'var(--text-muted)',
                  letterSpacing: '0.01em',
                }}
              >
                {tab.fr}
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    padding: '0.05rem 0.4rem',
                    borderRadius: 999,
                    background: active ? 'var(--navy-light)' : 'rgba(138,155,176,0.1)',
                    color: active ? 'var(--off-white)' : 'var(--text-muted)',
                  }}
                >
                  {tabCounts[tab.key]}
                </span>
              </span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
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
          gap: '0.6rem',
        }}
      >
        {visible.length === 0 ? (
          <p
            style={{
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              marginTop: '3rem',
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
