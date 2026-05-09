import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

// Translation keys for each phase's questions
const PHASE0_KEYS = [
  'p0q1.prompt', 'p0q2.prompt', 'p0q3.prompt',
  'p0q4.prompt', 'p0q5.prompt', 'p0q6.prompt',
]
const PHASE1_KEYS = [
  'p1q1.prompt', 'p1q2.prompt', 'p1q3.prompt', 'p1q4.prompt',
  'p1q5.prompt', 'p1q6.prompt', 'p1q7.prompt', 'p1q8.prompt',
  'p1q9.prompt', 'p1q10.prompt', 'p1q11.prompt', 'p1q12.prompt',
]
const PHASE2_KEYS = [
  'p2q1.prompt', 'p2q2.prompt', 'p2q3.prompt', 'p2q4.prompt',
  'p2q5.prompt', 'p2q6.prompt', 'p2q7.prompt', 'p2q8.prompt',
  'p2q9.prompt', 'p2q10.prompt', 'p2q11.prompt', 'p2q12.prompt',
  'p2q13.prompt', 'p2q14.prompt', 'p2q15.prompt', 'p2q16.prompt',
]

function formatAnswer(answer) {
  if (answer === null || answer === undefined) return null
  if (typeof answer === 'string') return answer || null
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
    // Standard interview answer { choice?, text?, draft? }
    const parts = []
    if (answer.choice) parts.push(String(answer.choice))
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

function QARow({ label, answer, isFirst }) {
  const formatted = formatAnswer(answer)
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
        <QARow key={i} label={q.label} answer={q.answer} isFirst={i === 0} />
      ))}
    </div>
  )
}

export default function SeekerReview() {
  const {
    t,
    interviewPhase0,
    interviewAnswers,
    interviewPhase1,
    interviewPhase2,
    aiInterviewQuestions,
  } = useApp()
  const navigate = useNavigate()

  const sections = [
    {
      titleFr: 'Questions préliminaires',
      titleEn: 'Preliminary questions',
      editRoute: '/seeker/interview/0',
      questions: PHASE0_KEYS.map((key, i) => ({
        label: t(key),
        answer: interviewPhase0[i],
      })),
    },
    {
      titleFr: 'Votre histoire',
      titleEn: 'Your story',
      editRoute: '/seeker/interview/1',
      questions: PHASE1_KEYS.map((key, i) => ({
        label: t(key),
        answer: interviewAnswers[i],
      })),
    },
    {
      titleFr: 'Questions personnalisées',
      titleEn: 'Personalized questions',
      editRoute: '/seeker/interview/2',
      questions: PHASE2_KEYS.map((key, i) => ({
        label: t(key),
        answer: interviewPhase1[i],
      })),
    },
    {
      titleFr: 'Questions sensibles',
      titleEn: 'Sensitive questions',
      editRoute: '/seeker/interview/3',
      questions: (aiInterviewQuestions || []).map((q, i) => ({
        label: q,
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
