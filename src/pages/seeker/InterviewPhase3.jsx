import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import MicButton from '../../components/MicButton'

const LANG_BCP47 = {
  fr: 'fr-FR', en: 'en-US', es: 'es-ES', ar: 'ar-SA',
  pt: 'pt-PT', ht: 'ht-HT', so: 'so-SO', ti: 'ti-ET',
  am: 'am-ET', hi: 'hi-IN', bn: 'bn-BD', ur: 'ur-PK',
  tr: 'tr-TR', fa: 'fa-IR', ru: 'ru-RU', uk: 'uk-UA',
  ro: 'ro-RO', sw: 'sw-KE', wo: 'wo-SN', zh: 'zh-CN',
}

const LANG_NAMES = {
  fr: 'French', en: 'English', es: 'Spanish', ar: 'Arabic',
  pt: 'Portuguese', ht: 'Haitian Creole', so: 'Somali', ti: 'Tigrinya',
  am: 'Amharic', hi: 'Hindi', bn: 'Bengali', ur: 'Urdu',
  tr: 'Turkish', fa: 'Persian', ru: 'Russian', uk: 'Ukrainian',
  ro: 'Romanian', sw: 'Swahili', wo: 'Wolof', zh: 'Mandarin Chinese',
}

const SYSTEM_PROMPT = `You are a Canadian refugee lawyer preparing a client's asylum claim for the Immigration and Refugee Board (IRB). You have reviewed the client's initial intake answers and narrative interview.

Your task: generate 5 to 8 targeted follow-up questions that will strengthen this specific asylum claim.

Focus on:
- Gaps or missing detail in the timeline of events
- Specific details about persecutors (role, capacity, reach)
- Evidence the client may have (documents, photos, witnesses, medical records)
- Medical or psychological impact of the persecution
- The legal grounds for asylum (race, religion, nationality, political opinion, membership in a social group)
- Why internal relocation within the country was not a safe option

Rules:
- Questions must be directly relevant to this particular client's story — not generic
- Do not repeat any question already asked in the intake or narrative interviews
- Be compassionate, clear, and non-judgmental
- Output ONLY a valid JSON array of question strings in the language specified
- Example format: ["Question one?", "Question two?", "Question three?"]`

const P0_LABELS = [
  'Gender identity',
  'Age group',
  'Country of origin',
  'Persecution ground',
  'Initial narrative',
  'Key dates (incidents / left country / arrived Canada)',
  'State protection sought',
  'Safe region in country of origin',
  'Location in Canada and duration',
]

const P1_LABELS = [
  'Birth and upbringing',
  'Religion / ethnicity / political affiliation',
  'Life before problems began',
  'When problems first started and initial incident',
  'Who was responsible for the harm',
  'Sequence of main events',
  'Whether others in family or community were affected',
  'Contact with police or authorities for help',
  'Why authorities were not contacted (if applicable)',
  'Final event that triggered the decision to leave',
  'How they left the country',
  'Transit countries before Canada',
  'Fear of what would happen upon return',
  'Whether the country situation has changed since departure',
  'Possibility of safe internal relocation',
  'Whether persecutors could find them anywhere in the country',
]

function serializeAnswers(interviewAnswers, interviewPhase1) {
  let text = 'PHASE 0 — Initial intake:\n'
  for (let i = 0; i < 9; i++) {
    const ans = interviewAnswers[i]
    if (!ans) continue
    const label = P0_LABELS[i]
    const val = ans.choice
      ? `${ans.choice}${ans.text ? ' — ' + ans.text : ''}${ans.draft ? ' — ' + ans.draft : ''}`
      : ans.text || ans.draft || JSON.stringify(ans)
    text += `• ${label}: ${val}\n`
  }

  text += '\nPHASE 1 — Narrative interview:\n'
  for (let i = 0; i < 16; i++) {
    const ans = interviewPhase1[i]
    if (!ans) continue
    const label = P1_LABELS[i]
    const val = ans.choice
      ? `${ans.choice}${ans.text ? ' — ' + ans.text : ''}${ans.draft ? ' — ' + ans.draft : ''}`
      : ans.text || ans.draft || JSON.stringify(ans)
    text += `• ${label}: ${val}\n`
  }
  return text
}

export default function InterviewPhase3() {
  const { language, interviewAnswers, interviewPhase1, setInterviewPhase2, t } = useApp()
  const navigate = useNavigate()

  const [status, setStatus] = useState('loading') // loading | error | interview | done
  const [questions, setQuestions] = useState([])
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [draft, setDraft] = useState('')

  async function fetchQuestions() {
    setStatus('loading')
    try {
      const context = serializeAnswers(interviewAnswers, interviewPhase1)
      const langName = LANG_NAMES[language] || 'French'
      const userMsg = `Client answers:\n\n${context}\n\nGenerate the follow-up questions in ${langName}.`

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-allow-browser': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userMsg }],
        }),
      })

      if (!res.ok) throw new Error(`API ${res.status}`)

      const data = await res.json()
      const text = data.content?.[0]?.text || ''
      const match = text.match(/\[[\s\S]*\]/)
      if (!match) throw new Error('No JSON array in response')
      const parsed = JSON.parse(match[0])
      if (!Array.isArray(parsed) || parsed.length === 0) throw new Error('Empty questions array')

      setQuestions(parsed)
      setStep(0)
      setAnswers({})
      setDraft('')
      setStatus('interview')
    } catch (err) {
      console.error('InterviewPhase3 fetch error:', err)
      setStatus('error')
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchQuestions() }, [])

  const handleNext = () => {
    const saved = { text: draft }
    const next = step + 1
    setAnswers(prev => ({ ...prev, [step]: saved }))
    if (next >= questions.length) {
      setStatus('done')
    } else {
      setDraft(answers[next]?.text || '')
      setStep(next)
    }
  }

  const handlePrev = () => {
    if (step === 0) return
    const saved = { text: draft }
    setAnswers(prev => ({ ...prev, [step]: saved }))
    const prev = step - 1
    setDraft(answers[prev]?.text || '')
    setStep(prev)
  }

  const handleSkip = () => {
    const next = step + 1
    setAnswers(prev => ({ ...prev, [step]: { text: '' } }))
    if (next >= questions.length) {
      setStatus('done')
    } else {
      setDraft(answers[next]?.text || '')
      setStep(next)
    }
  }

  const goToStep = (i) => {
    const saved = { text: draft }
    setAnswers(prev => ({ ...prev, [step]: saved }))
    setDraft(answers[i]?.text || '')
    setStep(i)
  }

  const handleSubmit = () => {
    setInterviewPhase2(answers)
    navigate('/seeker/report')
  }

  const isRTL = language === 'ar' || language === 'fa' || language === 'ur'
  const bcp47 = LANG_BCP47[language] || 'fr-FR'

  // ── Loading ───────────────────────────────────────────────────────────────────
  if (status === 'loading') {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <style>{`@keyframes p3spin { to { transform: rotate(360deg); } }`}</style>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            border: '4px solid var(--color-border)',
            borderTopColor: 'var(--color-primary)',
            animation: 'p3spin 1s linear infinite',
            marginBottom: '1.5rem',
          }}
        />
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem',
            fontWeight: 600,
            color: 'var(--color-text)',
            marginBottom: '0.75rem',
          }}
        >
          {t('p3.loading.heading')}
        </h2>
        <p style={{ color: 'var(--color-muted)', fontSize: '1rem' }}>
          {t('p3.loading.body')}
        </p>
      </div>
    )
  }

  // ── Error ─────────────────────────────────────────────────────────────────────
  if (status === 'error') {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center',
          gap: '1.5rem',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem',
            fontWeight: 600,
            color: 'var(--color-danger)',
          }}
        >
          {t('p3.error.heading')}
        </h2>
        <button
          onClick={fetchQuestions}
          style={{
            background: 'var(--color-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-btn)',
            padding: '0.875rem 2rem',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            minHeight: 52,
          }}
        >
          {t('p3.error.retry')}
        </button>
      </div>
    )
  }

  // ── Done ──────────────────────────────────────────────────────────────────────
  if (status === 'done') {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1.5rem',
          textAlign: 'center',
          direction: isRTL ? 'rtl' : 'ltr',
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '2rem',
          }}
        >
          <svg width="38" height="38" viewBox="0 0 38 38" fill="none" aria-hidden="true">
            <path d="M10 19L17 26L28 13" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2rem',
            fontWeight: 600,
            color: 'var(--color-text)',
            marginBottom: '1rem',
            lineHeight: 1.3,
          }}
        >
          {t('p3.done.heading')}
        </h1>
        <p
          style={{
            fontSize: '1.05rem',
            lineHeight: 1.7,
            color: 'var(--color-muted)',
            maxWidth: 480,
            marginBottom: '3rem',
          }}
        >
          {t('p3.done.body')}
        </p>
        <button
          onClick={handleSubmit}
          style={{
            width: '100%',
            maxWidth: 440,
            minHeight: 56,
            background: 'var(--color-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-btn)',
            fontSize: '1.125rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {t('p3.done.submit')}
        </button>
      </div>
    )
  }

  // ── Interview ─────────────────────────────────────────────────────────────────
  const total = questions.length
  const question = questions[step]
  const isLast = step === total - 1

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: '5rem 1.5rem 7rem',
        maxWidth: 640,
        margin: '0 auto',
        direction: isRTL ? 'rtl' : 'ltr',
      }}
    >
      {/* Step bar */}
      <div
        role="navigation"
        aria-label="Interview progress"
        style={{
          display: 'flex',
          gap: '0.5rem',
          justifyContent: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
        }}
      >
        {Array.from({ length: total }, (_, i) => {
          const done = answers[i] !== undefined
          const current = i === step
          return (
            <button
              key={i}
              onClick={() => goToStep(i)}
              aria-label={`Question ${i + 1}${done ? ', completed' : ''}`}
              aria-current={current ? 'step' : undefined}
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                border: current
                  ? '2.5px solid var(--color-primary)'
                  : done
                    ? 'none'
                    : '1.5px solid var(--color-border)',
                background: current ? '#fff' : done ? 'var(--color-primary)' : 'transparent',
                color: current ? 'var(--color-primary)' : done ? '#fff' : 'var(--color-muted)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {done && !current ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7l3 3 5-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                i + 1
              )}
            </button>
          )
        })}
      </div>

      {/* AI generated label */}
      <p
        style={{
          fontSize: '0.75rem',
          color: 'var(--color-muted)',
          marginBottom: '0.75rem',
          fontStyle: 'italic',
          textAlign: isRTL ? 'right' : 'left',
        }}
      >
        {t('p3.label')}
      </p>

      {/* Question */}
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.35rem',
          fontWeight: 600,
          color: 'var(--color-text)',
          marginBottom: '1.5rem',
          lineHeight: 1.4,
          textAlign: isRTL ? 'right' : 'left',
        }}
      >
        {question}
      </h2>

      {/* Textarea + mic */}
      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        <textarea
          value={draft}
          onChange={e => setDraft(e.target.value)}
          placeholder={t('p3.placeholder')}
          dir={isRTL ? 'rtl' : 'ltr'}
          style={{
            width: '100%',
            minHeight: 160,
            padding: '1rem',
            paddingBottom: '3.5rem',
            borderRadius: 'var(--radius-card)',
            border: '1.5px solid var(--color-border)',
            background: 'var(--color-card)',
            fontSize: '1rem',
            lineHeight: 1.6,
            resize: 'vertical',
            fontFamily: 'var(--font-ui)',
            boxSizing: 'border-box',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '0.75rem',
            right: isRTL ? 'auto' : '0.75rem',
            left: isRTL ? '0.75rem' : 'auto',
          }}
        >
          <MicButton
            lang={bcp47}
            onResult={text => setDraft(prev => (prev ? prev + ' ' + text : text))}
          />
        </div>
      </div>

      {/* Bottom nav */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'var(--color-bg)',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          gap: '0.75rem',
          padding: '0.875rem 1.5rem',
          zIndex: 100,
        }}
      >
        <button
          onClick={handlePrev}
          disabled={step === 0}
          style={{
            flex: 1,
            minHeight: 52,
            background: 'none',
            border: '1.5px solid var(--color-border)',
            borderRadius: 'var(--radius-btn)',
            fontSize: '1rem',
            fontWeight: 600,
            color: step === 0 ? 'var(--color-muted)' : 'var(--color-text)',
            cursor: step === 0 ? 'default' : 'pointer',
            opacity: step === 0 ? 0.4 : 1,
          }}
        >
          {t('interview.prev')}
        </button>
        <button
          onClick={handleSkip}
          style={{
            minWidth: 80,
            minHeight: 52,
            background: 'none',
            border: 'none',
            fontSize: '0.9rem',
            color: 'var(--color-muted)',
            cursor: 'pointer',
            padding: '0 0.5rem',
          }}
        >
          {t('interview.skip')}
        </button>
        <button
          onClick={handleNext}
          style={{
            flex: 2,
            minHeight: 52,
            background: 'var(--color-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-btn)',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {isLast ? t('p3.done.submit') : t('interview.next')}
        </button>
      </div>
    </div>
  )
}
