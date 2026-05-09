import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { generateFullAssessment } from '../../lib/assessment'

export default function SeekerReport() {
  const { interviewAnswers, interviewPhase1, interviewPhase2, language, t } = useApp()
  const navigate = useNavigate()

  const [status, setStatus] = useState('loading')
  const [report, setReport] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function run() {
      setStatus('loading')
      const result = await generateFullAssessment(
        interviewAnswers, interviewPhase1, interviewPhase2, language
      )
      if (!cancelled) {
        setReport(result)
        setStatus('ready')
      }
    }
    run()
    return () => { cancelled = true }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem', textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, border: '3px solid var(--color-border)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ fontSize: '1.1rem', color: 'var(--color-text)', marginTop: '1.5rem', fontFamily: 'var(--font-display)' }}>
          {language === 'fr' ? 'Nous préparons votre dossier…' : 'We are preparing your file…'}
        </p>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-muted)', marginTop: '0.5rem' }}>
          {language === 'fr' ? 'Cela peut prendre quelques instants.' : 'This may take a moment.'}
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  const seeker = report?.seekerReport || {}
  const resources = report?.resources || []

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 1.5rem 3rem', maxWidth: 560, margin: '0 auto' }}>
      {/* Success icon */}
      <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', marginTop: '1rem' }}>
        <svg width="38" height="38" viewBox="0 0 38 38" fill="none" aria-hidden="true">
          <path d="M10 19L17 26L28 13" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '1rem', textAlign: 'center', lineHeight: 1.3 }}>
        {seeker.title || t('seeker.report.heading')}
      </h1>

      <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--color-text)', textAlign: 'center', marginBottom: '1.5rem' }}>
        {seeker.summary || t('seeker.report.body')}
      </p>

      {/* Safety message */}
      {seeker.safetyMessage && (
        <div style={{ display: 'flex', gap: '0.75rem', padding: '1rem 1.25rem', background: 'rgba(13, 92, 58, 0.06)', border: '1px solid rgba(13, 92, 58, 0.15)', borderRadius: 'var(--radius-card)', marginBottom: '1.5rem', width: '100%' }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: 2 }} aria-hidden="true">
            <path d="M10 2L3 5V9C3 13.8 6.1 18.2 10 19C13.9 18.2 17 13.8 17 9V5L10 2Z" fill="var(--color-primary)" opacity="0.15" stroke="var(--color-primary)" strokeWidth="1.5" />
            <path d="M7 10L9.5 12.5L13 8" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--color-text)' }}>
            {seeker.safetyMessage}
          </p>
        </div>
      )}

      {/* Next steps */}
      {seeker.nextSteps?.length > 0 && (
        <div style={{ width: '100%', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.75rem' }}>
            {language === 'fr' ? 'Prochaines étapes' : 'Next steps'}
          </h2>
          <ol style={{ paddingLeft: '1.25rem', margin: 0 }}>
            {seeker.nextSteps.map((step, i) => (
              <li key={i} style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--color-text)', marginBottom: '0.5rem' }}>{step}</li>
            ))}
          </ol>
        </div>
      )}

      {/* Resources */}
      {resources.length > 0 && (
        <div style={{ width: '100%', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.75rem' }}>
            {language === 'fr' ? 'Ressources pour vous' : 'Resources for you'}
          </h2>
          {resources.map((r, i) => (
            <div key={i} style={{ padding: '0.85rem 1rem', background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 8, marginBottom: '0.5rem' }}>
              <p style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-text)', marginBottom: '0.25rem' }}>{r.name}</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', lineHeight: 1.5, marginBottom: '0.25rem' }}>{r.description}</p>
              {r.contact && <p style={{ fontSize: '0.82rem', color: 'var(--color-primary)', fontWeight: 500 }}>{r.contact}</p>}
            </div>
          ))}
        </div>
      )}

      <button onClick={() => navigate('/seeker/share')} style={{ width: '100%', minHeight: 56, background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-btn)', fontSize: '1.125rem', fontWeight: 600, cursor: 'pointer', marginBottom: '0.75rem', marginTop: '0.5rem' }}>
        {t('seeker.report.share') || (language === 'fr' ? 'Partager avec une clinique' : 'Share with a clinic')}
      </button>

      <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'var(--color-muted)', fontSize: '0.9rem', cursor: 'pointer', padding: '0.5rem', minHeight: 52 }}>
        {t('seeker.welcome.back')}
      </button>
    </div>
  )
}
