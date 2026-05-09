import { useState, useEffect, useMemo, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { getMockDossierForCase, getMockAnswersForCase } from '../lib/mockCases'
import { searchSimilarCases } from '../lib/openjustice'
import { buildTranscript } from '../lib/assessment'
import TimelineComponent from '../components/TimelineComponent'

// ── Color helpers ──
const PRIORITY_STYLE = {
  URGENT: { color: '#fff', bg: '#d94f3d' },
  HIGH:   { color: '#fff', bg: '#e8a020' },
  NORMAL: { color: 'var(--color-text)', bg: 'rgba(46,184,126,0.12)' },
}
const deadlineColor = (days) => days < 7 ? '#d94f3d' : days < 30 ? '#e8a020' : '#2eb87e'
const severityColor = { HIGH: '#d94f3d', MEDIUM: '#e8a020', LOW: '#2eb87e' }
const outcomeColor = (o) => o === 'Accepted' ? '#2eb87e' : o === 'Rejected' ? '#d94f3d' : '#e8a020'

export default function CaseDossier() {
  const { id } = useParams()
  const { isAuthenticated, cases, interviewAnswers, interviewPhase1, interviewPhase2, t } = useApp()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated()) navigate('/clinic', { replace: true })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const caseObj = useMemo(() => cases.find(c => c.id === id), [cases, id])
  const dossier = useMemo(() => getMockDossierForCase(caseObj), [caseObj])
  const cr = dossier.clinicReport

  const [similarCases, setSimilarCases] = useState(null)
  useEffect(() => {
    if (!caseObj) return
    let cancelled = false
    searchSimilarCases({
      country: caseObj.country,
      convention_ground: dossier.conventionGround.primary || '',
      claim_strength: caseObj.claimStrength || '',
    }).then(c => { if (!cancelled) setSimilarCases(c) })
    return () => { cancelled = true }
  }, [caseObj?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const transcript = useMemo(() => {
    const hasRealAnswers = interviewAnswers && Object.keys(interviewAnswers).length > 0
    if (hasRealAnswers) return buildTranscript(interviewAnswers, interviewPhase1 || {}, interviewPhase2 || {})
    const mock = getMockAnswersForCase(id)
    return buildTranscript(mock.p0 || {}, mock.p1 || {}, mock.p2 || {})
  }, [interviewAnswers, interviewPhase1, interviewPhase2, id])

  const handleFlagClick = useCallback((answerId) => {
    const el = document.getElementById(answerId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el.classList.add('highlight-answer')
      setTimeout(() => el.classList.remove('highlight-answer'), 3000)
    }
  }, [])

  const handleDownloadTranscript = useCallback(() => {
    let text = `MON PROLOGUE — CASE TRANSCRIPT\nCase: ${cr.caseId || caseObj?.sessionId || id}\nDate: ${new Date().toISOString().split('T')[0]}\n`
    for (const item of transcript) {
      if (typeof item === 'string') { text += item + '\n'; continue }
      text += `\nQ: ${item.q}\nA: ${item.a}\n`
    }
    const blob = new Blob([text], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `MonPrologue_Transcript_${cr.caseId || id}_${new Date().toISOString().split('T')[0]}.txt`
    a.click()
    URL.revokeObjectURL(a.href)
  }, [transcript, cr.caseId, caseObj, id])

  const handlePrint = useCallback(() => {
    const prev = document.title
    document.title = `MonPrologue_Report_${cr.caseId || id}_${new Date().toISOString().split('T')[0]}`
    window.print()
    document.title = prev
  }, [cr.caseId, id])

  if (!caseObj) {
    return (
      <div style={{ minHeight: 'calc(100vh - 56px)', padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <button onClick={() => navigate('/clinic/dashboard')} style={backBtn}>{t('clinic.back')}</button>
          <Card t={t}><p style={{ color: 'var(--color-muted)' }}>Case not found.</p></Card>
        </div>
      </div>
    )
  }

  const ps = PRIORITY_STYLE[cr.priority] || PRIORITY_STYLE.NORMAL

  return (
    <div id="clinic-report" style={{ minHeight: 'calc(100vh - 56px)', padding: '1.5rem 1rem 3rem' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <button onClick={() => navigate('/clinic/dashboard')} style={backBtn}>{t('clinic.back')}</button>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={handleDownloadTranscript} style={actionBtn}>{t('clinic.download.transcript')}</button>
            <button onClick={handlePrint} style={actionBtn}>{t('clinic.download.pdf')}</button>
          </div>
        </div>

        {/* ═══ SECTION 1 — CASE BRIEF ═══ */}
        <Card t={t} style={{ pageBreakAfter: 'avoid' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <div>
              <p style={labelSm}>{t('clinic.case.brief')}</p>
              <p style={{ fontFamily: 'monospace', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)', letterSpacing: '0.04em' }}>
                {cr.caseId || caseObj.sessionId}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '0.25rem 0.7rem', borderRadius: 999, color: ps.color, background: ps.bg }}>
                {cr.priority || 'NORMAL'}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-muted)', fontStyle: 'italic' }}>
                {cr.currentStatus || 'Pending'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <Stat label={t('clinic.dashboard.category')} value={`${caseObj.countryFlag} ${caseObj.country}`} />
            <Stat label={t('clinic.case.ground')} value={dossier.conventionGround.primary?.replace(/_/g, ' ')} />
            <Stat label={t('clinic.dashboard.status')} value={caseObj.filedDate} />
          </div>

          {cr.deadlineFlags?.length > 0 && (
            <div>
              <p style={{ ...labelSm, marginBottom: '0.4rem' }}>{t('clinic.case.deadlines')}</p>
              <div style={{ display: 'grid', gap: '0.35rem' }}>
                {cr.deadlineFlags.map((d, i) => {
                  const c = deadlineColor(d.daysRemaining)
                  return (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0.65rem', background: 'var(--color-bg)', borderRadius: 4, borderLeft: `3px solid ${c}` }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-text)' }}>{d.name}</span>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-muted)', fontFamily: 'monospace' }}>{d.dueDate}</span>
                        <span style={{ fontSize: '0.68rem', fontWeight: 700, color: c }}>
                          {d.daysRemaining > 0 ? `${d.daysRemaining}d` : `${Math.abs(d.daysRemaining)}d`}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </Card>

        {/* ═══ SECTION 2 — NARRATIVE + TIMELINE ═══ */}
        <div className="print-break" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <Card t={t} title={t('clinic.case.narrative')}>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text)', lineHeight: 1.7, opacity: 0.9 }}>
              {cr.narrativeSummary || cr.narrativeAssessment || ''}
            </p>
          </Card>
          <Card t={t} title={t('clinic.case.timeline')}>
            <TimelineComponent events={cr.timelineEvents || []} />
          </Card>
        </div>

        {/* ═══ SECTION 3 — GEOPOLITICAL CONTEXT ═══ */}
        <Card t={t} title={t('clinic.case.geo')} className="print-break">
          {cr.geopoliticalContext ? (
            <>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text)', lineHeight: 1.7, opacity: 0.9, marginBottom: '1rem', whiteSpace: 'pre-line' }}>
                {cr.geopoliticalContext.summary}
              </p>
              {cr.geopoliticalContext.sources?.length > 0 && (
                <>
                  <p style={{ ...labelSm, marginBottom: '0.5rem' }}>{t('clinic.case.geo.sources')}</p>
                  <div style={{ display: 'grid', gap: '0.4rem' }}>
                    {cr.geopoliticalContext.sources.map((s, i) => {
                      const isRecent = s.year >= new Date().getFullYear()
                      return (
                        <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: 'var(--color-bg)', borderRadius: 4, textDecoration: 'none', border: '1px solid var(--color-border)', gap: '0.5rem' }}>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary)' }}>{s.name}</p>
                            <p style={{ fontSize: '0.7rem', color: 'var(--color-muted)', lineHeight: 1.4 }}>{s.relevance_note}</p>
                          </div>
                          <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center', flexShrink: 0 }}>
                            {isRecent && <span style={{ fontSize: '0.58rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: 999, background: 'rgba(46,184,126,0.1)', color: '#2eb87e', border: '1px solid rgba(46,184,126,0.2)' }}>RECENT</span>}
                            <span style={{ fontSize: '0.68rem', color: 'var(--color-muted)', fontFamily: 'monospace' }}>{s.year}</span>
                          </div>
                        </a>
                      )
                    })}
                  </div>
                </>
              )}
            </>
          ) : (
            <p style={{ fontSize: '0.82rem', color: 'var(--color-muted)', fontStyle: 'italic' }}>{t('clinic.case.geo.empty')}</p>
          )}
        </Card>

        {/* ═══ SECTION 4 — RED FLAGS ═══ */}
        <Card t={t} title={t('clinic.case.flags')} className="print-break">
          <p style={{ ...labelSm, marginBottom: '0.4rem' }}>{t('clinic.case.flags.deadlines')}</p>
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {(cr.deadlineFlags || []).filter(d => d.daysRemaining < 30).map((d, i) => (
              <span key={i} style={{ fontSize: '0.68rem', fontWeight: 600, padding: '0.2rem 0.55rem', borderRadius: 999, color: deadlineColor(d.daysRemaining), background: `${deadlineColor(d.daysRemaining)}12`, border: `1px solid ${deadlineColor(d.daysRemaining)}30` }}>
                {d.name}: {d.daysRemaining > 0 ? `${d.daysRemaining}d` : 'OVERDUE'}
              </span>
            ))}
            {(cr.deadlineFlags || []).filter(d => d.daysRemaining < 30).length === 0 && (
              <span style={{ fontSize: '0.78rem', color: '#2eb87e' }}>{t('clinic.case.flags.none')}</span>
            )}
          </div>

          <p style={{ ...labelSm, marginBottom: '0.4rem' }}>{t('clinic.case.flags.exclusions')}</p>
          <div style={{ display: 'grid', gap: '0.4rem', marginBottom: '1rem' }}>
            {(cr.legalExclusionFlags || []).map((f, i) => {
              const sc = severityColor[f.severity] || severityColor.LOW
              return (
                <div key={i} style={{ padding: '0.6rem 0.85rem', background: 'var(--color-bg)', borderRadius: 4, borderLeft: `3px solid ${sc}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text)' }}>{f.issue}</span>
                    <span style={{ fontSize: '0.62rem', fontWeight: 700, color: sc, letterSpacing: '0.05em' }}>{f.severity} · {f.irpaSection}</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--color-text)', lineHeight: 1.5, opacity: 0.85 }}>{f.explanation}</p>
                </div>
              )
            })}
          </div>

          <p style={{ ...labelSm, marginBottom: '0.4rem' }}>{t('clinic.case.flags.narrative')}</p>
          <p style={{ fontSize: '0.68rem', color: 'var(--color-muted)', marginBottom: '0.5rem', fontStyle: 'italic' }}>
            {t('clinic.case.flags.narrative.hint')}
          </p>
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            {(cr.narrativeFlags || []).map((f, i) => (
              <button key={i} onClick={() => handleFlagClick(f.answerId)} style={{ fontSize: '0.72rem', fontWeight: 500, padding: '0.3rem 0.7rem', borderRadius: 999, background: 'var(--color-pink-soft)', color: '#c0607e', border: '1px solid rgba(232,160,191,0.3)', cursor: 'pointer' }}>
                ⚠ {f.issue}
              </button>
            ))}
          </div>
        </Card>

        {/* ═══ SECTION 5 — SIMILAR CASES ═══ */}
        <Card t={t} title={t('clinic.case.similar')} className="print-break">
          {!similarCases ? (
            <p style={{ fontSize: '0.82rem', color: 'var(--color-muted)', fontStyle: 'italic' }}>{t('clinic.case.similar.loading')}</p>
          ) : similarCases.length > 0 ? (
            <>
              {similarCases.map((sc, i) => {
                const oc = outcomeColor(sc.outcome)
                return (
                  <div key={i} style={{ padding: '0.85rem 1rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-btn)', marginBottom: '0.6rem', border: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                      <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text)', flex: 1 }}>
                        {sc.url ? <a href={sc.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>{sc.title}</a> : sc.title}
                      </p>
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: 999, color: oc, background: `${oc}12`, border: `1px solid ${oc}25`, whiteSpace: 'nowrap', flexShrink: 0 }}>
                        {sc.outcome}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--color-text)', lineHeight: 1.5, opacity: 0.85, marginBottom: '0.4rem' }}>{sc.summary}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                      {sc.key_factors?.map((f, j) => (
                        <span key={j} style={{ fontSize: '0.65rem', padding: '0.12rem 0.45rem', borderRadius: 999, background: 'var(--color-card)', border: '1px solid var(--color-border)', color: 'var(--color-muted)' }}>{f}</span>
                      ))}
                    </div>
                  </div>
                )
              })}
              <p style={{ fontSize: '0.68rem', color: 'var(--color-muted)', marginTop: '0.5rem', fontStyle: 'italic' }}>
                {t('clinic.case.similar.note')}
              </p>
            </>
          ) : (
            <p style={{ fontSize: '0.82rem', color: 'var(--color-muted)', fontStyle: 'italic' }}>{t('clinic.case.similar.none')}</p>
          )}
        </Card>

        {/* ═══ SECTION 6 — APPENDIX ═══ */}
        <Card t={t} title={t('clinic.case.appendix')} className="print-break">
          <div className="no-print" style={{ marginBottom: '0.75rem' }}>
            <button onClick={handleDownloadTranscript} style={actionBtn}>{t('clinic.download.transcript')}</button>
          </div>
          {transcript.map((item, i) => {
            if (typeof item === 'string') {
              return <p key={i} style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text)', marginTop: '1rem', marginBottom: '0.3rem' }}>{item}</p>
            }
            return (
              <div key={i} id={item.id} style={{ padding: '0.5rem 0.75rem', marginBottom: '0.35rem', borderRadius: 4, transition: 'background 0.3s ease' }}>
                <p style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-muted)', marginBottom: '0.15rem' }}>Q: {item.q}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text)', lineHeight: 1.5 }}>A: {item.a}</p>
              </div>
            )
          })}
        </Card>

        {/* Disclaimer */}
        <div className="print-footer-text" style={{ padding: '1rem', borderTop: '1px solid var(--color-border)', marginTop: '0.5rem' }}>
          <p style={{ fontSize: '0.7rem', color: 'var(--color-muted)', lineHeight: 1.6, fontStyle: 'italic' }}>
            {t('clinic.case.disclaimer')}
          </p>
        </div>
      </div>

      <style>{`
        .highlight-answer {
          background: var(--color-pink-soft) !important;
          border-left: 3px solid var(--color-pink) !important;
        }
      `}</style>
    </div>
  )
}

function Card({ title, children, style = {}, className = '' }) {
  return (
    <div className={className} style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-card)', padding: '1rem 1.25rem', marginBottom: '0.75rem', ...style }}>
      {title && <p style={{ ...labelSm, marginBottom: '0.75rem' }}>{title.toUpperCase()}</p>}
      {children}
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div>
      <p style={{ fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.08em', color: 'var(--color-muted)', textTransform: 'uppercase' }}>{label}</p>
      <p style={{ fontSize: '0.82rem', color: 'var(--color-text)', fontWeight: 500, marginTop: '0.05rem', textTransform: 'capitalize' }}>{value}</p>
    </div>
  )
}

const backBtn = { background: 'none', border: 'none', color: 'var(--color-muted)', fontSize: '0.82rem', cursor: 'pointer', padding: 0 }
const actionBtn = { fontSize: '0.75rem', fontWeight: 600, padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-btn)', background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)', cursor: 'pointer' }
const labelSm = { fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.08em', color: 'var(--color-muted)', textTransform: 'uppercase' }
