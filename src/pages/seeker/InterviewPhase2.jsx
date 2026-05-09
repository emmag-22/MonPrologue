import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import MicButton from '../../components/MicButton'

const LANG_BCP47 = {
  fr: 'fr-FR', en: 'en-CA', es: 'es-ES', ar: 'ar-SA',
  pt: 'pt-PT', ht: 'ht-HT', so: 'so-SO', ti: 'ti-ET',
  hi: 'hi-IN', fil: 'fil-PH', uk: 'uk-UA', fa: 'fa-IR',
  zh: 'zh-CN', ro: 'ro-RO', tr: 'tr-TR', bn: 'bn-BD',
  ur: 'ur-PK', sw: 'sw-KE', wo: 'wo-SN', ru: 'ru-RU',
}

const LANG_NAMES = {
  fr: 'French', en: 'English', es: 'Spanish', ar: 'Arabic',
  pt: 'Portuguese', ht: 'Haitian Creole', so: 'Somali', ti: 'Tigrinya',
  hi: 'Hindi', fil: 'Filipino', uk: 'Ukrainian', fa: 'Persian',
  zh: 'Mandarin Chinese', ro: 'Romanian', tr: 'Turkish', bn: 'Bengali',
  ur: 'Urdu', sw: 'Swahili', wo: 'Wolof', ru: 'Russian',
}

const SYSTEM_PROMPT = `You are a compassionate legal intake assistant helping an asylum seeker tell their story. Based on their answers so far, generate 5-7 follow-up questions that help them provide more information about the situation in their country, their understanding of political events, or their proximity to conflict zones. Start by asking them to locate where they were living in their country — the name of their city or region. Be sensitive and non-accusatory. Do not guide them toward specific answers. Avoid legal jargon. Write in plain simple language. Do not ask about gaps or inconsistencies. Return ONLY a valid JSON array, no explanation, no markdown: [{"id": 1, "question": "..."}]`

const P0_LABELS = [
  'Country of origin (fled from)',
  'Province and duration in Canada',
  'Gender identity',
  'Age group',
  'How arrived in Canada',
  'Date of arrival in Canada',
]

const P1_LABELS = [
  'Where born and grew up',
  'Religion / ethnicity / political affiliation',
  'When problems first started and initial event',
  'Life before problems began',
  'Whether accompanied by others who fled',
  'Contact with police or authorities for help',
  'Final event that triggered decision to leave',
  'How they left the country',
  'Transit through other countries before Canada',
  'Fear of what would happen upon return',
  'Whether situation in country has changed since departure',
  'Whether danger is localized or widespread',
]

function serializeAnswers(interviewPhase0, interviewPhase1) {
  let text = 'PRELIMINARY ANSWERS (Phase 0):\n'
  for (let i = 0; i < 6; i++) {
    const ans = interviewPhase0?.[i]
    if (ans == null) continue
    let val = typeof ans === 'object' ? JSON.stringify(ans) : String(ans)
    text += `- ${P0_LABELS[i]}: ${val}\n`
  }
  text += '\nNARRATIVE ANSWERS (Phase 1):\n'
  for (let i = 0; i < 12; i++) {
    const ans = interviewPhase1?.[i]
    if (ans == null) continue
    let val
    if (typeof ans === 'object' && ans !== null) {
      val = ans.choice
        ? `${ans.choice}${ans.text ? ' — ' + ans.text : ''}`
        : JSON.stringify(ans)
    } else {
      val = String(ans)
    }
    text += `- ${P1_LABELS[i]}: ${val}\n`
  }
  return text
}

async function fetchAIQuestions(context, langName) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('API key not configured')

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: `Please generate questions in ${langName}.\n\n${context}`,
      }],
    }),
  })

  if (!res.ok) throw new Error(`API error ${res.status}`)
  const data = await res.json()
  const text = data.content?.[0]?.text || ''
  console.log('[Phase2] Claude raw response:', text)
  // Strip markdown code fences if Claude wraps the JSON
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim()
  return JSON.parse(cleaned)
}

// ─── Step indicator (for AI questions) ────────────────────────────────────────

function StepBar({ step, total, answers }) {
  return (
    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
      {Array.from({ length: total }, (_, i) => {
        const done = answers[i] !== undefined
        const current = i === step
        return (
          <div
            key={i}
            style={{
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
              border: current ? '2.5px solid var(--color-primary)' : done ? 'none' : '1.5px solid var(--color-border)',
              background: done ? 'var(--color-primary)' : current ? 'var(--color-card)' : 'transparent',
              color: done ? '#fff' : current ? 'var(--color-primary)' : 'var(--color-muted)',
              fontSize: '0.8rem', fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {done
              ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7L6 11L12 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              : i + 1}
          </div>
        )
      })}
    </div>
  )
}

// ─── Loading screen ───────────────────────────────────────────────────────────

function LoadingScreen({ t }) {
  return (
    <div style={{ minHeight: 'calc(100vh - 48px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
      <div style={{
        width: 56, height: 56, border: '3px solid var(--color-border)',
        borderTopColor: 'var(--color-primary)', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite', marginBottom: '1.5rem',
      }} />
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
        {t('p2ai.loading.heading')}
      </p>
      <p style={{ fontSize: '0.95rem', color: 'var(--color-muted)' }}>
        {t('p2ai.loading.body')}
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// ─── Error screen ─────────────────────────────────────────────────────────────

function ErrorScreen({ onRetry, t }) {
  return (
    <div style={{ minHeight: 'calc(100vh - 48px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
      <div style={{
        width: 64, height: 64, borderRadius: '50%', background: 'rgba(192,57,43,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem',
      }}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <circle cx="14" cy="14" r="12" stroke="#C0392B" strokeWidth="2" />
          <path d="M14 8v7M14 19v1" stroke="#C0392B" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '1.5rem' }}>
        {t('p2ai.error.heading')}
      </p>
      <button
        onClick={onRetry}
        style={{
          minHeight: 52, padding: '0 2rem', background: 'var(--color-primary)', color: '#fff',
          border: 'none', borderRadius: 'var(--radius-btn)', fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
        }}
      >
        {t('p2ai.error.retry')}
      </button>
    </div>
  )
}

// ─── Done screen ──────────────────────────────────────────────────────────────

function DoneScreen({ onSubmit, t }) {
  return (
    <div style={{ textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
      <div style={{
        width: 80, height: 80, borderRadius: '50%', background: 'var(--color-primary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem',
      }}>
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
          <path d="M8 18L15 25L28 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--color-text)' }}>
        {t('p2ai.done.heading')}
      </h2>
      <p style={{ fontSize: '1.05rem', color: 'var(--color-muted)', lineHeight: 1.7, marginBottom: '2.5rem' }}>
        {t('p2ai.done.body')}
      </p>
      <button
        onClick={onSubmit}
        style={{
          width: '100%', minHeight: 56, background: 'var(--color-primary)', color: '#fff',
          border: 'none', borderRadius: 'var(--radius-btn)', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer',
        }}
      >
        {t('p2ai.done.submit')}
      </button>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function InterviewPhase2() {
  const { t, language, interviewPhase0, interviewPhase1, interviewPhase2, setInterviewPhase2, aiInterviewQuestions, setAiInterviewQuestions, phase2Index, setPhase2Index } = useApp()
  const navigate = useNavigate()
  const speechLang = LANG_BCP47[language] || 'fr-FR'
  const langName = LANG_NAMES[language] || 'French'

  const hasCache = aiInterviewQuestions.length > 0
  const safeInitialStep = hasCache ? Math.min(phase2Index, aiInterviewQuestions.length - 1) : 0

  const [status, setStatus] = useState(hasCache ? 'interview' : 'loading')
  const [questions, setQuestions] = useState(aiInterviewQuestions)
  const [step, setStep] = useState(safeInitialStep)
  const [answers, setAnswers] = useState(interviewPhase2 || {})
  const [draft, setDraft] = useState((interviewPhase2 || {})[safeInitialStep] || '')

  const load = useCallback(async () => {
    setStatus('loading')
    try {
      const context = serializeAnswers(interviewPhase0, interviewPhase1)
      const qs = await fetchAIQuestions(context, langName)
      const fetched = Array.isArray(qs) ? qs : []
      setQuestions(fetched)
      setAiInterviewQuestions(fetched)
      setStatus('interview')
    } catch {
      setStatus('error')
    }
  }, [interviewPhase0, interviewPhase1, langName, setAiInterviewQuestions])

  useEffect(() => {
    if (!hasCache) {
      load()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleNext = () => {
    const saved = { ...answers, [step]: draft }
    setAnswers(saved)
    setInterviewPhase2(saved)
    setDraft('')
    if (step < questions.length - 1) {
      setStep((s) => s + 1)
      setPhase2Index(step + 1)
    } else {
      setStatus('done')
    }
  }

  const handleSkip = () => {
    setDraft('')
    if (step < questions.length - 1) {
      setStep((s) => s + 1)
      setPhase2Index(step + 1)
    } else {
      setStatus('done')
    }
  }

  const handlePrev = () => {
    setDraft(answers[step - 1] ?? '')
    setStep((s) => Math.max(s - 1, 0))
    setPhase2Index(step - 1)
  }

  if (status === 'loading') return <LoadingScreen t={t} />
  if (status === 'error') return <ErrorScreen onRetry={load} t={t} />

  if (status === 'done') {
    return (
      <div style={{ minHeight: 'calc(100vh - 48px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <DoneScreen onSubmit={() => navigate('/seeker/interview/3')} t={t} />
      </div>
    )
  }

  const currentQ = questions[step]

  return (
    <div style={{
      minHeight: 'calc(100vh - 48px)', display: 'flex', flexDirection: 'column',
      padding: '1.5rem 1.25rem 6rem', maxWidth: 600, margin: '0 auto',
    }}>
      <StepBar step={step} total={questions.length} answers={answers} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {/* Question label */}
        <p style={{
          fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
          color: 'var(--color-muted)', marginBottom: '1rem',
        }}>
          {t('p2ai.label')}
        </p>

        {/* Question */}
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: '1.65rem', fontWeight: 600,
          color: 'var(--color-text)', lineHeight: 1.35, marginBottom: '1.75rem',
          maxWidth: 540, textAlign: 'center',
        }}>
          {currentQ?.question || ''}
        </h2>

        {/* Answer */}
        <div style={{ width: '100%', maxWidth: 520, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={t('p2ai.placeholder')}
            rows={7}
            style={{
              width: '100%', padding: '1rem', fontSize: '1rem', lineHeight: 1.7,
              border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-card)',
              background: 'var(--color-bg)', resize: 'vertical', fontFamily: 'var(--font-ui)',
              boxSizing: 'border-box',
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
            <MicButton onResult={(txt) => setDraft((d) => d ? d + ' ' + txt : txt)} lang={speechLang} />
            <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>{t('p2ai.mic')}</span>
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'var(--color-card)', borderTop: '1px solid var(--color-border)',
        padding: '1rem 1.25rem', display: 'flex', gap: '0.75rem', justifyContent: 'center',
      }}>
        {step > 0 && (
          <button
            onClick={handlePrev}
            style={{
              minHeight: 52, padding: '0 1.5rem', background: 'transparent',
              border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-btn)',
              fontSize: '1rem', fontWeight: 500, color: 'var(--color-text)', cursor: 'pointer',
            }}
          >
            {t('interview.prev')}
          </button>
        )}

        <button
          onClick={handleNext}
          disabled={!draft.trim()}
          style={{
            flex: 1, maxWidth: 280, minHeight: 52,
            background: draft.trim() ? 'var(--color-primary)' : 'var(--color-border)',
            color: draft.trim() ? '#fff' : 'var(--color-muted)',
            border: 'none', borderRadius: 'var(--radius-btn)',
            fontSize: '1rem', fontWeight: 600,
            cursor: draft.trim() ? 'pointer' : 'default',
          }}
        >
          {t('interview.next')}
        </button>

        <button
          onClick={handleSkip}
          style={{
            minHeight: 52, padding: '0 1.5rem', background: 'transparent', border: 'none',
            fontSize: '0.9rem', color: 'var(--color-muted)', cursor: 'pointer',
          }}
        >
          {t('interview.skip')}
        </button>
      </div>
    </div>
  )
}
