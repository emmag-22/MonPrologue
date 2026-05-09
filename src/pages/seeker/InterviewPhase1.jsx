import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import MicButton from '../../components/MicButton'

const TOTAL = 12

const LANG_BCP47 = {
  fr: 'fr-FR', en: 'en-CA', es: 'es-ES', ar: 'ar-SA',
  pt: 'pt-PT', ht: 'ht-HT', so: 'so-SO', ti: 'ti-ET',
  hi: 'hi-IN', fil: 'fil-PH', uk: 'uk-UA', fa: 'fa-IR',
  zh: 'zh-CN', ro: 'ro-RO', tr: 'tr-TR', bn: 'bn-BD',
  ur: 'ur-PK', sw: 'sw-KE', wo: 'wo-SN', ru: 'ru-RU',
}

// Steps 7 and 10 auto-advance on button click; all others need Next
const AUTO_ADVANCE = new Set([7, 10])

// ─── Step indicator ────────────────────────────────────────────────────────────

function StepBar({ step, answers, total, onGoTo }) {
  return (
    <div
      role="navigation"
      aria-label="Interview progress"
      style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', marginBottom: '1.75rem', flexWrap: 'wrap' }}
    >
      {Array.from({ length: total }, (_, i) => {
        const done = answers[i] !== undefined
        const current = i === step
        return (
          <button
            key={i}
            onClick={() => onGoTo(i)}
            aria-label={`Question ${i + 1}${done ? ', completed' : ''}`}
            aria-current={current ? 'step' : undefined}
            style={{
              width: 36, height: 36, borderRadius: '50%',
              border: current ? '2.5px solid var(--color-primary)' : done ? 'none' : '1.5px solid var(--color-border)',
              background: done ? 'var(--color-primary)' : current ? 'var(--color-card)' : 'transparent',
              color: done ? '#fff' : current ? 'var(--color-primary)' : 'var(--color-muted)',
              fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 150ms ease', flexShrink: 0,
            }}
          >
            {done
              ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7L6 11L12 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              : i + 1}
          </button>
        )
      })}
    </div>
  )
}

// ─── Shared primitives ────────────────────────────────────────────────────────

function Prompt({ children }) {
  return (
    <h2 style={{
      fontFamily: 'var(--font-display)', fontSize: '1.65rem', fontWeight: 600,
      color: 'var(--color-text)', lineHeight: 1.35, marginBottom: '1.75rem',
      maxWidth: 540, textAlign: 'center',
    }}>
      {children}
    </h2>
  )
}

function ChoiceBtn({ label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', maxWidth: 460, minHeight: 64,
        background: selected ? 'var(--color-primary)' : 'var(--color-card)',
        color: selected ? '#fff' : 'var(--color-text)',
        border: selected ? '2px solid var(--color-primary)' : '1.5px solid var(--color-border)',
        borderRadius: 'var(--radius-btn)', fontSize: '1.05rem', fontWeight: 500,
        cursor: 'pointer', textAlign: 'left', padding: '0 1.5rem',
        transition: 'all 150ms ease',
      }}
    >
      {label}
    </button>
  )
}

function TextArea({ value, onChange, placeholder, lang, onMicResult, t }) {
  return (
    <div style={{ width: '100%', maxWidth: 520, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={7}
        style={{
          width: '100%', padding: '1rem', fontSize: '1rem', lineHeight: 1.7,
          border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-card)',
          background: 'var(--color-bg)', resize: 'vertical', fontFamily: 'var(--font-ui)',
          boxSizing: 'border-box',
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
        <MicButton onResult={onMicResult} lang={lang} />
        <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>{t('p1.mic')}</span>
      </div>
    </div>
  )
}

function DetailArea({ value, onChange, placeholder }) {
  return (
    <textarea
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={4}
      style={{
        width: '100%', maxWidth: 460, marginTop: '0.75rem', padding: '1rem',
        fontSize: '1rem', lineHeight: 1.7,
        border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-card)',
        background: 'var(--color-bg)', resize: 'vertical', fontFamily: 'var(--font-ui)',
        boxSizing: 'border-box',
      }}
    />
  )
}

// ─── Individual question renderers ────────────────────────────────────────────

// Q1–Q4, Q7, Q10: pure text + mic
function TextQ({ prompt, draft, setDraft, t, lang }) {
  return (
    <>
      <Prompt>{prompt}</Prompt>
      <TextArea
        value={draft}
        onChange={setDraft}
        placeholder={t('p1.placeholder')}
        lang={lang}
        onMicResult={(txt) => setDraft((d) => (d ? d + ' ' + txt : txt))}
        t={t}
      />
    </>
  )
}

// Q5: Oui/Non + conditional textarea if Oui
function Q5({ draft, setDraft, t }) {
  const choice = draft?.choice
  const text = draft?.text || ''
  const setChoice = (c) => setDraft({ choice: c, text: '' })
  const setText = (v) => setDraft({ ...(draft || {}), text: v })

  return (
    <>
      <Prompt>{t('p1q5.prompt')}</Prompt>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', alignItems: 'center' }}>
        <ChoiceBtn label={t('p1q5.oui')} selected={choice === 'oui'} onClick={() => setChoice('oui')} />
        <ChoiceBtn label={t('p1q5.non')} selected={choice === 'non'} onClick={() => setChoice('non')} />
        {choice === 'oui' && (
          <DetailArea value={text} onChange={setText} placeholder={t('p1q5.detail')} />
        )}
      </div>
    </>
  )
}

// Q6: Yes/No/Tried + textarea explanation
function Q6({ draft, setDraft, t }) {
  const choice = draft?.choice
  const text = draft?.text || ''
  const setChoice = (c) => setDraft({ choice: c, text })
  const setText = (v) => setDraft({ ...(draft || {}), text: v })

  return (
    <>
      <Prompt>{t('p1q6.prompt')}</Prompt>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', alignItems: 'center' }}>
        <ChoiceBtn label={t('p1q6.yes')} selected={choice === 'yes'} onClick={() => setChoice('yes')} />
        <ChoiceBtn label={t('p1q6.no')} selected={choice === 'no'} onClick={() => setChoice('no')} />
        <ChoiceBtn label={t('p1q6.tried')} selected={choice === 'tried'} onClick={() => setChoice('tried')} />
        {choice && (
          <DetailArea value={text} onChange={setText} placeholder={t('p1q6.detail')} />
        )}
      </div>
    </>
  )
}

// Q8: How did you leave — 4 buttons, auto-advances
function Q8({ draft, onSelect, t }) {
  const opts = [
    [t('p1q8.valid'), 'valid'],
    [t('p1q8.false'), 'false'],
    [t('p1q8.none'), 'none'],
    [t('p1q8.other'), 'other'],
  ]
  return (
    <>
      <Prompt>{t('p1q8.prompt')}</Prompt>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', alignItems: 'center' }}>
        {opts.map(([label, val]) => (
          <ChoiceBtn key={val} label={label} selected={draft === val} onClick={() => onSelect(val)} />
        ))}
      </div>
    </>
  )
}

// Q9: Transit country Yes/No + conditional detail text
function Q9({ draft, setDraft, t }) {
  const choice = draft?.choice
  const text = draft?.text || ''
  const setChoice = (c) => setDraft({ choice: c, text: '' })
  const setText = (v) => setDraft({ ...(draft || {}), text: v })

  return (
    <>
      <Prompt>{t('p1q9.prompt')}</Prompt>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', alignItems: 'center' }}>
        <ChoiceBtn label={t('p1q9.yes')} selected={choice === 'yes'} onClick={() => setChoice('yes')} />
        <ChoiceBtn label={t('p1q9.no')} selected={choice === 'no'} onClick={() => setChoice('no')} />
        {choice === 'yes' && (
          <DetailArea value={text} onChange={setText} placeholder={t('p1q9.detail')} />
        )}
      </div>
    </>
  )
}

// Q11: Situation changed — 3 buttons, auto-advances
function Q11({ draft, onSelect, t }) {
  const opts = [
    [t('p1q11.worse'), 'worse'],
    [t('p1q11.same'), 'same'],
    [t('p1q11.unknown'), 'unknown'],
  ]
  return (
    <>
      <Prompt>{t('p1q11.prompt')}</Prompt>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', alignItems: 'center' }}>
        {opts.map(([label, val]) => (
          <ChoiceBtn key={val} label={label} selected={draft === val} onClick={() => onSelect(val)} />
        ))}
      </div>
    </>
  )
}

// Q12: Danger zone — 3 buttons + detail textarea
function Q12({ draft, setDraft, t }) {
  const choice = draft?.choice
  const text = draft?.text || ''
  const setChoice = (c) => setDraft({ choice: c, text })
  const setText = (v) => setDraft({ ...(draft || {}), text: v })

  const opts = [
    [t('p1q12.zone'), 'zone'],
    [t('p1q12.generalise'), 'generalise'],
    [t('p1q12.unknown'), 'unknown'],
  ]

  return (
    <>
      <Prompt>{t('p1q12.prompt')}</Prompt>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', alignItems: 'center' }}>
        {opts.map(([label, val]) => (
          <ChoiceBtn key={val} label={label} selected={choice === val} onClick={() => setChoice(val)} />
        ))}
        {choice && (
          <DetailArea value={text} onChange={setText} placeholder={t('p1q12.detail')} />
        )}
      </div>
    </>
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
        {t('p1.done.heading')}
      </h2>
      <p style={{ fontSize: '1.05rem', color: 'var(--color-muted)', lineHeight: 1.7, marginBottom: '2.5rem' }}>
        {t('p1.done.body')}
      </p>
      <button
        onClick={onSubmit}
        style={{
          width: '100%', minHeight: 56, background: 'var(--color-primary)', color: '#fff',
          border: 'none', borderRadius: 'var(--radius-btn)', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer',
        }}
      >
        {t('p1.done.submit')}
      </button>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function InterviewPhase1() {
  const { t, language, interviewPhase1, setInterviewPhase1, phase1Index, setPhase1Index } = useApp()
  const navigate = useNavigate()
  const lang = LANG_BCP47[language] || 'fr-FR'

  const initialStep = Math.min(phase1Index, TOTAL - 1)
  const [step, setStep] = useState(initialStep)
  const [answers, setAnswers] = useState(interviewPhase1 || {})
  const [draft, setDraft] = useState((interviewPhase1 || {})[initialStep] ?? null)
  const [done, setDone] = useState(false)

  const commitAndAdvance = (val) => {
    const saved = { ...answers, [step]: val }
    setAnswers(saved)
    setInterviewPhase1(saved)
    setDraft(null)
    if (step < TOTAL - 1) {
      setStep((s) => s + 1)
      setPhase1Index(step + 1)
    } else {
      setDone(true)
    }
  }

  const handleAutoSelect = (val) => commitAndAdvance(val)

  const handleNext = () => {
    const val = draft ?? ''
    commitAndAdvance(val)
  }

  const handleSkip = () => {
    setDraft(null)
    if (step < TOTAL - 1) {
      setStep((s) => s + 1)
      setPhase1Index(step + 1)
    } else {
      setDone(true)
    }
  }

  const handlePrev = () => {
    setDraft(answers[step - 1] ?? null)
    setStep((s) => Math.max(s - 1, 0))
    setPhase1Index(step - 1)
  }

  const handleGoTo = (i) => {
    setDraft(answers[i] ?? null)
    setStep(i)
    setPhase1Index(i)
  }

  const nextEnabled = () => {
    if (AUTO_ADVANCE.has(step)) return false
    if ([4, 5, 8, 11].includes(step)) return !!(draft?.choice)
    return !!(draft && draft.length > 0)
  }

  const renderQuestion = () => {
    switch (step) {
      case 0: return <TextQ prompt={t('p1q1.prompt')} draft={draft} setDraft={setDraft} t={t} lang={lang} />
      case 1: return <TextQ prompt={t('p1q2.prompt')} draft={draft} setDraft={setDraft} t={t} lang={lang} />
      case 2: return <TextQ prompt={t('p1q3.prompt')} draft={draft} setDraft={setDraft} t={t} lang={lang} />
      case 3: return <TextQ prompt={t('p1q4.prompt')} draft={draft} setDraft={setDraft} t={t} lang={lang} />
      case 4: return <Q5 draft={draft} setDraft={setDraft} t={t} />
      case 5: return <Q6 draft={draft} setDraft={setDraft} t={t} />
      case 6: return <TextQ prompt={t('p1q7.prompt')} draft={draft} setDraft={setDraft} t={t} lang={lang} />
      case 7: return <Q8 draft={draft} onSelect={handleAutoSelect} t={t} />
      case 8: return <Q9 draft={draft} setDraft={setDraft} t={t} />
      case 9: return <TextQ prompt={t('p1q10.prompt')} draft={draft} setDraft={setDraft} t={t} lang={lang} />
      case 10: return <Q11 draft={draft} onSelect={handleAutoSelect} t={t} />
      case 11: return <Q12 draft={draft} setDraft={setDraft} t={t} />
      default: return null
    }
  }

  if (done) {
    return (
      <div style={{ minHeight: 'calc(100vh - 48px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <DoneScreen onSubmit={() => navigate('/seeker/interview/2')} t={t} />
      </div>
    )
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 48px)', display: 'flex', flexDirection: 'column',
      padding: '1.5rem 1.25rem 6rem', maxWidth: 600, margin: '0 auto',
    }}>
      <StepBar step={step} answers={answers} total={TOTAL} onGoTo={handleGoTo} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {renderQuestion()}
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

        {!AUTO_ADVANCE.has(step) && (
          <button
            onClick={handleNext}
            disabled={!nextEnabled()}
            style={{
              flex: 1, maxWidth: 280, minHeight: 52,
              background: nextEnabled() ? 'var(--color-primary)' : 'var(--color-border)',
              color: nextEnabled() ? '#fff' : 'var(--color-muted)',
              border: 'none', borderRadius: 'var(--radius-btn)',
              fontSize: '1rem', fontWeight: 600,
              cursor: nextEnabled() ? 'pointer' : 'default',
            }}
          >
            {t('interview.next')}
          </button>
        )}

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
