import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

const RESOURCES = [
  {
    id: 'shelter',
    fr: 'Hébergement temporaire',
    en: 'Temporary shelter',
  },
  {
    id: 'housing',
    fr: 'Aide pour trouver un logement permanent',
    en: 'Assistance finding permanent housing',
  },
  {
    id: 'info-sessions',
    fr: 'Sessions d\'information sur la vie au Québec',
    en: 'Information sessions on life in Québec',
  },
  {
    id: 'financial-aid',
    fr: 'Aide financière de dernier recours',
    en: 'Last resort financial assistance',
  },
  {
    id: 'education',
    fr: 'Éducation préscolaire, primaire et secondaire',
    en: 'Preschool, elementary and secondary education',
  },
  {
    id: 'childcare',
    fr: 'Services de garde à faible coût',
    en: 'Low-cost childcare services',
  },
  {
    id: 'employment',
    fr: 'Services universels d\'emploi',
    en: 'Universal employment services',
  },
  {
    id: 'french',
    fr: 'Cours de français',
    en: 'French courses',
  },
  {
    id: 'legal',
    fr: 'Assistance juridique',
    en: 'Legal assistance',
  },
  {
    id: 'praida-social',
    fr: 'Services sociaux PRAIDA — composante psychosociale (travail social)',
    en: 'PRAIDA psychosocial services (social work)',
  },
  {
    id: 'praida-health',
    fr: 'Services de santé PRAIDA — soins préventifs et de première ligne',
    en: 'PRAIDA health services — preventive and primary care',
  },
  {
    id: 'federal-health',
    fr: 'Services de santé via le Programme fédéral de santé intérimaire',
    en: 'Federal Interim Health Program',
  },
]

const RESOURCES_PDF = 'https://cdn-contenu.quebec.ca/cdn-contenu/immigration/publications/en/GUI_asylum_seeker.pdf'

export default function InterviewPhase3() {
  const { t, setInterviewPhase3 } = useApp()
  const navigate = useNavigate()
  const [selected, setSelected] = useState(new Set())

  const toggle = (id) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleFinish = () => {
    setInterviewPhase3({ services: [...selected], submitted: true })
    navigate('/seeker/review')
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 48px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem 1.25rem 7rem',
      maxWidth: 580,
      margin: '0 auto',
    }}>
      {/* Icon */}
      <div style={{
        width: 72, height: 72, borderRadius: '50%', background: 'var(--color-primary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem',
      }}>
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
          <path d="M17 4L5 10V18C5 26 10.5 33 17 35C23.5 33 29 26 29 18V10L17 4Z"
            fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="2" />
          <path d="M12 17L16 21L22 14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Title */}
      <h1 style={{
        fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 600,
        color: 'var(--color-text)', textAlign: 'center', lineHeight: 1.3,
        marginBottom: '0.5rem',
      }}>
        {t('p3res.title')}
      </h1>

      {/* Subtitle */}
      <p style={{
        fontSize: '1rem', color: 'var(--color-muted)', textAlign: 'center',
        lineHeight: 1.6, marginBottom: '2rem', maxWidth: 460,
      }}>
        {t('p3res.subtitle')}
      </p>

      {/* Checklist */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '2rem' }}>
        {RESOURCES.map((r) => {
          const checked = selected.has(r.id)
          return (
            <button
              key={r.id}
              onClick={() => toggle(r.id)}
              role="checkbox"
              aria-checked={checked}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                width: '100%',
                minHeight: 64,
                padding: '0.85rem 1.25rem',
                background: checked ? 'rgba(13, 92, 58, 0.06)' : 'var(--color-card)',
                border: checked
                  ? '2px solid var(--color-primary)'
                  : '1.5px solid var(--color-border)',
                borderRadius: 'var(--radius-btn)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 150ms ease',
              }}
            >
              {/* Checkbox visual */}
              <div style={{
                width: 24, height: 24, borderRadius: 6, flexShrink: 0, marginTop: 2,
                background: checked ? 'var(--color-primary)' : 'transparent',
                border: checked ? '2px solid var(--color-primary)' : '2px solid var(--color-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 150ms ease',
              }}>
                {checked && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M2 7L6 11L12 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>

              {/* Labels */}
              <div>
                <span style={{
                  display: 'block', fontSize: '0.97rem', fontWeight: checked ? 600 : 500,
                  color: checked ? 'var(--color-primary)' : 'var(--color-text)', lineHeight: 1.4,
                }}>
                  {r.fr}
                </span>
                <span style={{
                  display: 'block', fontSize: '0.8rem', color: 'var(--color-muted)',
                  lineHeight: 1.4, marginTop: '0.15rem',
                }}>
                  {r.en}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Footer */}
      <div style={{
        width: '100%', padding: '1.25rem', background: 'rgba(13,92,58,0.05)',
        border: '1px solid rgba(13,92,58,0.15)', borderRadius: 'var(--radius-card)',
        marginBottom: '1.25rem',
      }}>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
          {t('p3res.footer')}
        </p>
        <a
          href={RESOURCES_PDF}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 500,
            textDecoration: 'underline', textUnderlineOffset: 3,
          }}
        >
          {t('p3res.link')} →
        </a>
      </div>

      {/* CTA */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'var(--color-card)', borderTop: '1px solid var(--color-border)',
        padding: '1rem 1.25rem',
      }}>
        <button
          onClick={handleFinish}
          style={{
            width: '100%', maxWidth: 520, display: 'block', margin: '0 auto',
            minHeight: 56, background: 'var(--color-primary)', color: '#fff',
            border: 'none', borderRadius: 'var(--radius-btn)',
            fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer',
          }}
        >
          {t('p3res.done.submit')}
        </button>
      </div>
    </div>
  )
}
