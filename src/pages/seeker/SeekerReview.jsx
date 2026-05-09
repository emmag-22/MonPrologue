import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

const RESOURCE_LABELS = {
  'shelter':       { fr: 'Hébergement temporaire', en: 'Temporary shelter' },
  'housing':       { fr: 'Aide pour trouver un logement permanent', en: 'Assistance finding permanent housing' },
  'info-sessions': { fr: "Sessions d'information sur la vie au Québec", en: 'Information sessions on life in Québec' },
  'financial-aid': { fr: "Aide financière de dernier recours", en: 'Last resort financial assistance' },
  'education':     { fr: 'Éducation préscolaire, primaire et secondaire', en: 'Preschool, elementary and secondary education' },
  'childcare':     { fr: 'Services de garde à faible coût', en: 'Low-cost childcare services' },
  'employment':    { fr: "Services universels d'emploi", en: 'Universal employment services' },
  'french':        { fr: 'Cours de français', en: 'French courses' },
  'legal':         { fr: 'Assistance juridique', en: 'Legal assistance' },
  'praida-social': { fr: 'Services sociaux PRAIDA — composante psychosociale', en: 'PRAIDA psychosocial services (social work)' },
  'praida-health': { fr: 'Services de santé PRAIDA — soins préventifs et de première ligne', en: 'PRAIDA health services — preventive and primary care' },
  'federal-health':{ fr: 'Services de santé via le Programme fédéral de santé intérimaire', en: 'Federal Interim Health Program' },
}

const PHASE0_KEYS = [
  'p0q1.prompt', 'p0q2.prompt', 'p0q3.prompt',
  'p0q4.prompt', 'p0q5.prompt', 'p0q6.prompt',
]
const PHASE1_KEYS = [
  'p1q1.prompt', 'p1q2.prompt', 'p1q3.prompt', 'p1q4.prompt',
  'p1q5.prompt', 'p1q6.prompt', 'p1q7.prompt', 'p1q8.prompt',
  'p1q9.prompt', 'p1q10.prompt', 'p1q11.prompt', 'p1q12.prompt',
]

// choiceLabels: optional { rawValue: displayLabel } map for multiple-choice answers
function formatAnswer(answer, choiceLabels) {
  if (answer === null || answer === undefined) return null
  if (typeof answer === 'string') {
    if (!answer) return null
    return choiceLabels ? (choiceLabels[answer] ?? answer) : answer
  }
  if (typeof answer === 'object') {
    // Date object { day, month, year }
    if ('day' in answer || 'month' in answer || 'year' in answer) {
      const parts = [answer.day, answer.month, answer.year].filter(Boolean)
      return parts.length ? parts.join(' / ') : null
    }
    // Province + duration { province, duration }
    if ('province' in answer || 'duration' in answer) {
      const parts = [answer.province, answer.duration].filter(Boolean)
      return parts.length ? parts.join(' · ') : null
    }
    // Standard interview answer { choice?, text? }
    const parts = []
    if (answer.choice) {
      const label = choiceLabels ? (choiceLabels[answer.choice] ?? answer.choice) : answer.choice
      parts.push(String(label))
    }
    if (answer.text) parts.push(String(answer.text))
    if (answer.draft) {
      if (typeof answer.draft === 'object') {
        const nested = [answer.draft.incidents, answer.draft.left, answer.draft.arrived].filter(Boolean)
        if (nested.length) parts.push(nested.join(' · '))
      } else if (String(answer.draft)) {
        parts.push(String(answer.draft))
      }
    }
    return parts.length ? parts.join(' — ') : null
  }
  return null
}

function QARow({ label, answer, choiceLabels, isFirst }) {
  const formatted = formatAnswer(answer, choiceLabels)
  return (
    <div
      style={{
        borderTop: isFirst ? 'none' : '1px solid var(--color-border)',
        paddingTop: isFirst ? 0 : '1rem',
        marginTop: isFirst ? 0 : '1rem',
      }}
    >
      <p
        style={{
          fontSize: '0.78rem',
          fontWeight: 600,
          color: 'var(--color-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          marginBottom: '0.35rem',
          lineHeight: 1.4,
        }}
      >
        {label}
      </p>
      {formatted ? (
        <p
          style={{
            fontSize: '1rem',
            color: 'var(--color-text)',
            lineHeight: 1.65,
            wordBreak: 'break-word',
          }}
        >
          {formatted}
        </p>
      ) : (
        <p
          style={{
            fontSize: '0.92rem',
            color: 'var(--color-border)',
            fontStyle: 'italic',
          }}
        >
          Non répondu / Unanswered
        </p>
      )}
    </div>
  )
}

function Section({ titleFr, titleEn, editRoute, questions, navigate }) {
  if (questions.length === 0) return null
  return (
    <div
      style={{
        background: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-card)',
        padding: '1.5rem',
        marginBottom: '1.25rem',
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '1.25rem',
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.15rem',
              fontWeight: 600,
              color: 'var(--color-text)',
              lineHeight: 1.3,
              marginBottom: '0.2rem',
            }}
          >
            {titleFr}
          </h2>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-muted)' }}>
            {titleEn}
          </span>
        </div>
        <button
          onClick={() => navigate(editRoute)}
          style={{
            padding: '0.4rem 0.9rem',
            background: 'transparent',
            border: '1.5px solid var(--color-border)',
            borderRadius: 'var(--radius-btn)',
            fontSize: '0.85rem',
            fontWeight: 500,
            color: 'var(--color-primary)',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            minHeight: 36,
            flexShrink: 0,
            marginLeft: '1rem',
          }}
        >
          Modifier / Edit
        </button>
      </div>

      {questions.map((q, i) => (
        <QARow key={i} label={q.label} answer={q.answer} choiceLabels={q.choiceLabels} isFirst={i === 0} />
      ))}
    </div>
  )
}

function ResourcesSection({ services, navigate }) {
  const selectedIds = Array.isArray(services) ? services : []
  return (
    <div
      style={{
        background: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-card)',
        padding: '1.5rem',
        marginBottom: '1.25rem',
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '1.25rem',
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.15rem',
              fontWeight: 600,
              color: 'var(--color-text)',
              lineHeight: 1.3,
              marginBottom: '0.2rem',
            }}
          >
            Questions sensibles
          </h2>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-muted)' }}>
            Sensitive questions
          </span>
        </div>
        <button
          onClick={() => navigate('/seeker/interview/3')}
          style={{
            padding: '0.4rem 0.9rem',
            background: 'transparent',
            border: '1.5px solid var(--color-border)',
            borderRadius: 'var(--radius-btn)',
            fontSize: '0.85rem',
            fontWeight: 500,
            color: 'var(--color-primary)',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            minHeight: 36,
            flexShrink: 0,
            marginLeft: '1rem',
          }}
        >
          Modifier / Edit
        </button>
      </div>

      <p
        style={{
          fontSize: '0.78rem',
          fontWeight: 600,
          color: 'var(--color-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          marginBottom: '0.75rem',
        }}
      >
        Ressources sélectionnées / Selected resources
      </p>

      {selectedIds.length === 0 ? (
        <p style={{ fontSize: '0.92rem', color: 'var(--color-border)', fontStyle: 'italic' }}>
          Non répondu / Unanswered
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {selectedIds.map((id) => {
            const label = RESOURCE_LABELS[id]
            return (
              <div
                key={id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.6rem',
                  padding: '0.6rem 0.75rem',
                  background: 'rgba(13, 92, 58, 0.05)',
                  border: '1px solid rgba(13, 92, 58, 0.15)',
                  borderRadius: 8,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }} aria-hidden="true">
                  <path d="M3 8L7 12L13 5" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div>
                  <span style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text)', lineHeight: 1.4 }}>
                    {label ? label.fr : id}
                  </span>
                  {label && (
                    <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-muted)', lineHeight: 1.4 }}>
                      {label.en}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function SeekerReview() {
  const {
    t,
    interviewPhase0,
    interviewPhase1,
    interviewPhase2,
    interviewPhase3,
    aiInterviewQuestions,
  } = useApp()
  const navigate = useNavigate()

  useEffect(() => {
    console.log('[SeekerReview] Full context state:', {
      interviewPhase0,
      interviewPhase1,
      interviewPhase2,
      interviewPhase3,
      aiInterviewQuestions,
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Label maps for multiple-choice questions — maps raw stored value → display label
  const phase0ChoiceLabels = [
    null, // 0: country — plain string
    null, // 1: province + duration — handled by formatAnswer
    { man: t('q1.man'), woman: t('q1.woman'), nonbinary: t('q1.nonbinary'), notsay: t('q1.notsay') }, // 2: sex
    null, // 3: age group — already display values ('18–25' etc.)
    { plane: t('p0q5.plane'), road: t('p0q5.road'), boat: t('p0q5.boat'), train: t('p0q5.train'), other: t('p0q5.other') }, // 4: how arrived
    null, // 5: arrival date — handled by formatAnswer
  ]

  const phase1ChoiceLabels = [
    null, null, null, null,                                                                                          // 0–3: free text
    { oui: t('p1q5.oui'), non: t('p1q5.non') },                                                                    // 4: accompanied (Q5)
    { yes: t('p1q6.yes'), no: t('p1q6.no'), tried: t('p1q6.tried') },                                             // 5: authorities (Q6)
    null,                                                                                                            // 6: final event — free text
    { valid: t('p1q8.valid'), false: t('p1q8.false'), none: t('p1q8.none'), other: t('p1q8.other') },             // 7: how left (Q8, direct string)
    { yes: t('p1q9.yes'), no: t('p1q9.no') },                                                                      // 8: transit (Q9)
    null,                                                                                                            // 9: fear of return — free text
    { worse: t('p1q11.worse'), same: t('p1q11.same'), unknown: t('p1q11.unknown') },                               // 10: situation changed (Q11, direct string)
    { zone: t('p1q12.zone'), generalise: t('p1q12.generalise'), unknown: t('p1q12.unknown') },                     // 11: danger zone (Q12)
  ]

  const sections = [
    {
      titleFr: 'Questions préliminaires',
      titleEn: 'Preliminary questions',
      editRoute: '/seeker/interview/0',
      questions: PHASE0_KEYS.map((key, i) => ({
        label: t(key),
        answer: interviewPhase0[i],
        choiceLabels: phase0ChoiceLabels[i],
      })),
    },
    {
      titleFr: 'Votre histoire',
      titleEn: 'Your story',
      editRoute: '/seeker/interview/1',
      questions: PHASE1_KEYS.map((key, i) => ({
        label: t(key),
        answer: interviewPhase1[i],
        choiceLabels: phase1ChoiceLabels[i],
      })),
    },
    {
      titleFr: 'Questions personnalisées',
      titleEn: 'Personalized questions',
      editRoute: '/seeker/interview/2',
      // AI questions are dynamic — use the actual question text as the label
      questions: aiInterviewQuestions.map((q, i) => ({
        label: q.question,
        answer: interviewPhase2[i],
      })),
    },
  ]

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2.5rem 1.25rem 9rem',
        maxWidth: 640,
        margin: '0 auto',
      }}
    >
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2rem',
          fontWeight: 600,
          color: 'var(--color-text)',
          textAlign: 'center',
          marginBottom: '0.5rem',
          lineHeight: 1.25,
        }}
      >
        Votre dossier / Your file
      </h1>
      <p
        style={{
          fontSize: '1rem',
          color: 'var(--color-muted)',
          textAlign: 'center',
          marginBottom: '2.5rem',
          lineHeight: 1.6,
          maxWidth: 440,
        }}
      >
        Vérifiez vos réponses avant de soumettre
        <span
          style={{
            display: 'block',
            fontSize: '0.875rem',
            marginTop: '0.2rem',
          }}
        >
          Review your answers before submitting
        </span>
      </p>

      <div style={{ width: '100%' }}>
        {sections.map((section, i) => (
          <Section
            key={i}
            titleFr={section.titleFr}
            titleEn={section.titleEn}
            editRoute={section.editRoute}
            questions={section.questions}
            navigate={navigate}
          />
        ))}
        <ResourcesSection
          services={interviewPhase3?.services}
          navigate={navigate}
        />
      </div>

      {/* Fixed bottom actions */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'var(--color-card)',
          borderTop: '1px solid var(--color-border)',
          padding: '1rem 1.25rem',
          display: 'flex',
          gap: '0.75rem',
          zIndex: 100,
        }}
      >
        <button
          onClick={() => navigate('/seeker/interview/0')}
          style={{
            flex: 1,
            minHeight: 56,
            background: 'transparent',
            border: '1.5px solid var(--color-border)',
            borderRadius: 'var(--radius-btn)',
            fontSize: '1rem',
            fontWeight: 500,
            color: 'var(--color-text)',
            cursor: 'pointer',
          }}
        >
          Modifier / Edit
        </button>
        <button
          onClick={() => navigate('/seeker/contact')}
          style={{
            flex: 2,
            minHeight: 56,
            background: 'var(--color-primary)',
            border: 'none',
            borderRadius: 'var(--radius-btn)',
            fontSize: '1rem',
            fontWeight: 600,
            color: '#fff',
            cursor: 'pointer',
            lineHeight: 1.3,
          }}
        >
          Oui, tout est correct
          <span
            style={{
              display: 'block',
              fontSize: '0.78rem',
              fontWeight: 400,
              opacity: 0.85,
            }}
          >
            Yes, this is correct
          </span>
        </button>
      </div>
    </div>
  )
}
