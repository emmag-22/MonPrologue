import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { getMockDossierForCase } from '../lib/mockCases'

const STRENGTH_STYLE = {
  'Strong':          { color: '#2eb87e', bg: 'rgba(46,184,126,0.08)', border: 'rgba(46,184,126,0.2)' },
  'Moderate-Strong': { color: '#1a9b8a', bg: 'rgba(26,155,138,0.08)', border: 'rgba(26,155,138,0.2)' },
  'Moderate':        { color: '#e8a020', bg: 'rgba(232,160,32,0.08)', border: 'rgba(232,160,32,0.2)' },
  'Weak':            { color: '#d94f3d', bg: 'rgba(217,79,61,0.08)', border: 'rgba(217,79,61,0.2)' },
}

const RISK_STYLE = {
  high:   { color: '#d94f3d', label: 'HIGH RISK' },
  medium: { color: '#e8a020', label: 'MEDIUM RISK' },
  low:    { color: '#2eb87e', label: 'LOW RISK' },
}

export default function CaseDossier() {
  const { id } = useParams()
  const { isAuthenticated, cases } = useApp()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated()) navigate('/clinic', { replace: true })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const caseObj = useMemo(() => cases.find(c => c.id === id), [cases, id])
  const dossier = useMemo(() => getMockDossierForCase(caseObj), [caseObj])

  if (!caseObj) {
    return (
      <div style={{ minHeight: 'calc(100vh - 56px)', padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <button onClick={() => navigate('/clinic/dashboard')} style={backBtnStyle}>← Tableau de bord · Dashboard</button>
          <Card><p style={{ color: 'var(--color-muted)' }}>Case not found.</p></Card>
        </div>
      </div>
    )
  }

  const ss = STRENGTH_STYLE[caseObj.claimStrength] || STRENGTH_STYLE['Moderate']
  const rs = RISK_STYLE[dossier.clinicReport.riskLevel] || RISK_STYLE.medium

  return (
    <div style={{ minHeight: 'calc(100vh - 56px)', padding: '2rem 1.5rem' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <button onClick={() => navigate('/clinic/dashboard')} style={backBtnStyle}>← Tableau de bord · Dashboard</button>

        {/* Header */}
        <Card style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <p style={labelStyle}>DOSSIER · CASE FILE</p>
              <p style={{ fontFamily: 'monospace', fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-text)', letterSpacing: '0.06em' }}>
                {caseObj.sessionId}
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text)', marginTop: '0.35rem' }}>
                {caseObj.countryFlag} {caseObj.country}
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em', padding: '0.25rem 0.65rem', borderRadius: 999, color: ss.color, background: ss.bg, border: `1px solid ${ss.border}` }}>
                {caseObj.claimStrength?.toUpperCase()}
              </span>
              <span style={{ fontSize: '0.65rem', fontWeight: 600, color: rs.color, letterSpacing: '0.05em' }}>
                {rs.label}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
            <MetaItem label="Legal Category" value={caseObj.legalCategory} />
            <MetaItem label="Filed" value={caseObj.filedDate} />
            <MetaItem label="Hearing" value={caseObj.hearingDate || 'Not scheduled'} />
            <MetaItem label="Detail" value={caseObj.detailTag} />
          </div>
        </Card>

        {/* Convention Ground */}
        <Card title="Convention Ground Analysis">
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            <span style={tagStyle}>{dossier.conventionGround.primary?.replace(/_/g, ' ')}</span>
            <span style={{ ...tagStyle, background: ss.bg, color: ss.color, border: `1px solid ${ss.border}` }}>
              Strength: {dossier.conventionGround.strength}
            </span>
          </div>
          <p style={bodyStyle}>{dossier.conventionGround.analysis}</p>
          {dossier.conventionGround.irpaSections?.length > 0 && (
            <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              {dossier.conventionGround.irpaSections.map((s, i) => (
                <span key={i} style={citationStyle}>{s}</span>
              ))}
            </div>
          )}
        </Card>

        {/* Coherence Flags */}
        <Card title="Coherence Flags — Questions for Counsel">
          <p style={{ fontSize: '0.72rem', color: 'var(--color-muted)', marginBottom: '0.75rem', fontStyle: 'italic' }}>
            These are preparation questions, not credibility judgments. Gaps may reflect trauma, memory fragmentation, or translation.
          </p>
          {dossier.coherenceFlags.map((flag, i) => (
            <div key={i} style={{ padding: '0.65rem 0.85rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-btn)', marginBottom: '0.5rem', borderLeft: '3px solid #e8a020' }}>
              <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.25rem' }}>{flag.area}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text)', lineHeight: 1.5, opacity: 0.85 }}>{flag.detail}</p>
              {flag.irpaRelevance && <p style={{ fontSize: '0.72rem', color: 'var(--color-muted)', marginTop: '0.3rem' }}>{flag.irpaRelevance}</p>}
            </div>
          ))}
        </Card>

        {/* IFA + State Protection */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <Card title="IFA Assessment">
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <StatusBadge label="IFA likely" active={dossier.ifaAssessment.likely} />
              <StatusBadge label="Addressed" active={dossier.ifaAssessment.addressed} positive />
            </div>
            <p style={bodyStyle}>{dossier.ifaAssessment.analysis}</p>
          </Card>

          <Card title="State Protection">
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <StatusBadge label="Sought" active={dossier.stateProtection.sought} positive />
              <StatusBadge label="Adequate" active={dossier.stateProtection.adequate} positive />
            </div>
            <p style={bodyStyle}>{dossier.stateProtection.analysis}</p>
          </Card>
        </div>

        {/* Full Legal Analysis */}
        <Card title="Legal Analysis">
          <Section label="Convention Ground">{dossier.clinicReport.conventionGroundAnalysis}</Section>
          <Section label="Narrative Assessment">{dossier.clinicReport.narrativeAssessment}</Section>
          {dossier.clinicReport.estimatedProcessingNotes && (
            <Section label="Processing Notes">{dossier.clinicReport.estimatedProcessingNotes}</Section>
          )}
        </Card>

        {/* IRPA Citations */}
        <Card title="IRPA Citations">
          {dossier.clinicReport.irpaCitations.map((c, i) => (
            <div key={i} style={{ padding: '0.5rem 0.75rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-btn)', marginBottom: '0.4rem', borderLeft: '3px solid var(--color-primary)' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text)', lineHeight: 1.5 }}>{c}</p>
            </div>
          ))}
        </Card>

        {/* Recommended Actions */}
        <Card title="Recommended Actions">
          <ol style={{ paddingLeft: '1.1rem', margin: 0 }}>
            {dossier.clinicReport.recommendedActions.map((a, i) => (
              <li key={i} style={{ fontSize: '0.85rem', color: 'var(--color-text)', lineHeight: 1.6, marginBottom: '0.4rem' }}>{a}</li>
            ))}
          </ol>
        </Card>

        {/* Resources */}
        {dossier.resources?.length > 0 && (
          <Card title="Matched Resources">
            {dossier.resources.map((r, i) => (
              <div key={i} style={{ padding: '0.6rem 0.85rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-btn)', marginBottom: '0.4rem' }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)' }}>{r.name}</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--color-muted)', lineHeight: 1.4 }}>{r.description}</p>
                {r.contact && <p style={{ fontSize: '0.75rem', color: 'var(--color-primary)', marginTop: '0.2rem' }}>{r.contact}</p>}
              </div>
            ))}
          </Card>
        )}

        {/* Disclaimer */}
        <div style={{ padding: '1rem', borderTop: '1px solid var(--color-border)', marginTop: '0.5rem' }}>
          <p style={{ fontSize: '0.7rem', color: 'var(--color-muted)', lineHeight: 1.6, fontStyle: 'italic' }}>
            This dossier does not assess the truthfulness of the claimant's account. Narrative gaps may reflect trauma, memory fragmentation, or translation issues, and must be explored compassionately by the legal professional. This tool does not constitute legal advice.
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Reusable components ──

function Card({ title, children, style = {} }) {
  return (
    <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-card)', padding: '1rem 1.25rem', marginBottom: '0.75rem', ...style }}>
      {title && <p style={{ ...labelStyle, marginBottom: '0.75rem' }}>{title.toUpperCase()}</p>}
      {children}
    </div>
  )
}

function MetaItem({ label, value }) {
  return (
    <div>
      <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.08em', color: 'var(--color-muted)', textTransform: 'uppercase' }}>{label}</p>
      <p style={{ fontSize: '0.82rem', color: 'var(--color-text)', fontWeight: 500, marginTop: '0.1rem' }}>{value}</p>
    </div>
  )
}

function StatusBadge({ label, active, positive = false }) {
  const color = active
    ? (positive ? 'var(--color-primary)' : '#d94f3d')
    : 'var(--color-muted)'
  return (
    <span style={{
      fontSize: '0.68rem', fontWeight: 600, padding: '0.2rem 0.55rem', borderRadius: 999,
      background: `${color}10`,
      color, border: `1px solid ${color}30`,
    }}>
      {active ? '●' : '○'} {label}
    </span>
  )
}

function Section({ label, children }) {
  return (
    <div style={{ marginBottom: '0.85rem' }}>
      <p style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.3rem' }}>{label}</p>
      <p style={{ fontSize: '0.85rem', color: 'var(--color-text)', lineHeight: 1.6, opacity: 0.88 }}>{children}</p>
    </div>
  )
}

// ── Styles ──
const backBtnStyle = {
  background: 'none', border: 'none', color: 'var(--color-muted)', fontSize: '0.82rem',
  cursor: 'pointer', padding: 0, marginBottom: '1.25rem',
}

const labelStyle = {
  fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.08em',
  color: 'var(--color-muted)', textTransform: 'uppercase',
}

const bodyStyle = {
  fontSize: '0.85rem', color: 'var(--color-text)', lineHeight: 1.6, opacity: 0.88,
}

const tagStyle = {
  fontSize: '0.72rem', fontWeight: 600, padding: '0.25rem 0.7rem', borderRadius: 999,
  background: 'var(--color-bg)', color: 'var(--color-text)', border: '1px solid var(--color-border)',
  textTransform: 'capitalize',
}

const citationStyle = {
  fontSize: '0.68rem', fontWeight: 600, padding: '0.15rem 0.5rem', borderRadius: 4,
  background: 'rgba(13, 92, 58, 0.06)', color: 'var(--color-primary)',
  border: '1px solid rgba(13, 92, 58, 0.15)', fontFamily: 'monospace',
}
