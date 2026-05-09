import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import MicButton from '../../components/MicButton'

const TOTAL = 16

// Q9 (step 8) is auto-skipped when Q8 (step 7) was answered "yes"
function getNextStep(step, answer) {
  if (step === 7 && answer?.choice === 'yes') return 9
  return step + 1
}

function getPrevStep(step, answers) {
  if (step === 9 && answers[7]?.choice === 'yes') return 7
  return step - 1
}

// ─── Step indicator ────────────────────────────────────────────────────────────

function StepBar({ step, answers, total, onGoTo }) {
  return (
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
            onClick={() => onGoTo(i)}
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
              background: done
                ? 'var(--color-primary)'
                : current
                  ? 'var(--color-card)'
                  : 'transparent',
              color: done
                ? '#fff'
                : current
                  ? 'var(--color-primary)'
                  : 'var(--color-muted)',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 150ms ease',
            }}
          >
            {done ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8L7 12L13 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              i + 1
            )}
          </button>
        )
      })}
    </div>
  )
}

// ─── Choice button ─────────────────────────────────────────────────────────────

function ChoiceBtn({ label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        maxWidth: 440,
        minHeight: 64,
        background: selected ? 'var(--color-primary)' : 'var(--color-card)',
        color: selected ? '#fff' : 'var(--color-text)',
        border: selected ? '2px solid var(--color-primary)' : '1.5px solid var(--color-border)',
        borderRadius: 'var(--radius-btn)',
        fontSize: '1.1rem',
        fontWeight: 500,
        cursor: 'pointer',
        textAlign: 'left',
        padding: '0 1.5rem',
        transition: 'all 150ms ease',
      }}
    >
      {label}
    </button>
  )
}

// ─── Question prompt ───────────────────────────────────────────────────────────

function Prompt({ children }) {
  return (
    <h2
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.75rem',
        fontWeight: 600,
        color: 'var(--color-text)',
        lineHeight: 1.35,
        marginBottom: '2rem',
        maxWidth: 520,
        textAlign: 'center',
      }}
    >
      {children}
    </h2>
  )
}

// ─── Textarea style ────────────────────────────────────────────────────────────

const textareaStyle = {
  width: '100%',
  padding: '1rem',
  fontSize: '1rem',
  lineHeight: 1.7,
  border: '1.5px solid var(--color-border)',
  borderRadius: 'var(--radius-card)',
  background: 'var(--color-bg)',
  resize: 'vertical',
  fontFamily: 'var(--font-ui)',
}

const detailTextareaStyle = {
  ...textareaStyle,
  marginTop: '0.5rem',
}

// ─── TextQ — text question with MicButton ──────────────────────────────────────

function TextQ({ draft, setDraft, promptKey, t, lang }) {
  return (
    <>
      <Prompt>{t(promptKey)}</Prompt>
      <div
        style={{
          width: '100%',
          maxWidth: 520,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem',
        }}
      >
        <textarea
          value={draft || ''}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={t('p2.text.placeholder')}
          rows={7}
          style={textareaStyle}
        />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <MicButton onResult={(text) => setDraft((d) => (d ? d + ' ' + text : text))} lang={lang} />
          <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>{t('q5.mic')}</span>
        </div>
      </div>
    </>
  )
}

// ─── Q7: Family / community affected ──────────────────────────────────────────

function Q7({ draft, setDraft, t }) {
  const choice = draft?.choice
  const detail = draft?.detail || ''
  const setChoice = (c) => setDraft({ choice: c, detail: '' })
  const setDetail = (d) => setDraft({ ...(draft || {}), detail: d })

  return (
    <>
      <Prompt>{t('p2q7.prompt')}</Prompt>
      <div
        style={{
          width: '100%',
          maxWidth: 440,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          alignItems: 'center',
        }}
      >
        {[
          [t('p2q7.yes'), 'yes'],
          [t('p2q7.no'), 'no'],
        ].map(([label, val]) => (
          <ChoiceBtn key={val} label={label} selected={choice === val} onClick={() => setChoice(val)} />
        ))}
        {choice === 'yes' && (
          <textarea
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder={t('p2q7.detail')}
            rows={4}
            style={detailTextareaStyle}
          />
        )}
      </div>
    </>
  )
}

// ─── Q8: Police / authority ────────────────────────────────────────────────────

function Q8({ draft, setDraft, t }) {
  const choice = draft?.choice
  const detail = draft?.detail || ''
  const setChoice = (c) => setDraft({ choice: c, detail: '' })
  const setDetail = (d) => setDraft({ ...(draft || {}), detail: d })

  return (
    <>
      <Prompt>{t('p2q8.prompt')}</Prompt>
      <div
        style={{
          width: '100%',
          maxWidth: 440,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          alignItems: 'center',
        }}
      >
        {[
          [t('p2q8.yes'), 'yes'],
          [t('p2q8.no'), 'no'],
          [t('p2q8.tried'), 'tried'],
        ].map(([label, val]) => (
          <ChoiceBtn key={val} label={label} selected={choice === val} onClick={() => setChoice(val)} />
        ))}
        {choice && (
          <textarea
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder={t('p2q8.detail')}
            rows={4}
            style={detailTextareaStyle}
          />
        )}
      </div>
    </>
  )
}

// ─── Q11: How did you leave ────────────────────────────────────────────────────

function Q11({ draft, onSelect, t }) {
  return (
    <>
      <Prompt>{t('p2q11.prompt')}</Prompt>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          width: '100%',
          alignItems: 'center',
        }}
      >
        {[
          [t('p2q11.valid'), 'valid'],
          [t('p2q11.false'), 'false'],
          [t('p2q11.none'), 'none'],
          [t('p2q11.other'), 'other'],
        ].map(([label, val]) => (
          <ChoiceBtn key={val} label={label} selected={draft === val} onClick={() => onSelect(val)} />
        ))}
      </div>
    </>
  )
}

// ─── Q12: Other countries ──────────────────────────────────────────────────────

function Q12({ draft, setDraft, t }) {
  const choice = draft?.choice
  const detail = draft?.detail || ''
  const setChoice = (c) => setDraft({ choice: c, detail: '' })
  const setDetail = (d) => setDraft({ ...(draft || {}), detail: d })

  return (
    <>
      <Prompt>{t('p2q12.prompt')}</Prompt>
      <div
        style={{
          width: '100%',
          maxWidth: 440,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          alignItems: 'center',
        }}
      >
        {[
          [t('p2q12.yes'), 'yes'],
          [t('p2q12.no'), 'no'],
        ].map(([label, val]) => (
          <ChoiceBtn key={val} label={label} selected={choice === val} onClick={() => setChoice(val)} />
        ))}
        {choice === 'yes' && (
          <textarea
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder={t('p2q12.detail')}
            rows={4}
            style={detailTextareaStyle}
          />
        )}
      </div>
    </>
  )
}

// ─── Q14: Situation changed ────────────────────────────────────────────────────

function Q14({ draft, onSelect, t }) {
  return (
    <>
      <Prompt>{t('p2q14.prompt')}</Prompt>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          width: '100%',
          alignItems: 'center',
        }}
      >
        {[
          [t('p2q14.worse'), 'worse'],
          [t('p2q14.same'), 'same'],
          [t('p2q14.unknown'), 'unknown'],
        ].map(([label, val]) => (
          <ChoiceBtn key={val} label={label} selected={draft === val} onClick={() => onSelect(val)} />
        ))}
      </div>
    </>
  )
}

// ─── Q15: Safe region ──────────────────────────────────────────────────────────

function Q15({ draft, setDraft, t }) {
  const choice = draft?.choice
  const detail = draft?.detail || ''
  const setChoice = (c) => setDraft({ choice: c, detail: '' })
  const setDetail = (d) => setDraft({ ...(draft || {}), detail: d })

  return (
    <>
      <Prompt>{t('p2q15.prompt')}</Prompt>
      <div
        style={{
          width: '100%',
          maxWidth: 440,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          alignItems: 'center',
        }}
      >
        {[
          [t('p2q15.yes'), 'yes'],
          [t('p2q15.no'), 'no'],
          [t('p2q15.unknown'), 'unknown'],
        ].map(([label, val]) => (
          <ChoiceBtn key={val} label={label} selected={choice === val} onClick={() => setChoice(val)} />
        ))}
        {(choice === 'no' || choice === 'unknown') && (
          <textarea
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder={t('p2q15.detail')}
            rows={4}
            style={detailTextareaStyle}
          />
        )}
      </div>
    </>
  )
}

// ─── Q16: Can they find you ────────────────────────────────────────────────────

function Q16({ draft, setDraft, t }) {
  const choice = draft?.choice
  const detail = draft?.detail || ''
  const setChoice = (c) => setDraft({ choice: c, detail: '' })
  const setDetail = (d) => setDraft({ ...(draft || {}), detail: d })

  return (
    <>
      <Prompt>{t('p2q16.prompt')}</Prompt>
      <div
        style={{
          width: '100%',
          maxWidth: 440,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          alignItems: 'center',
        }}
      >
        {[
          [t('p2q16.yes'), 'yes'],
          [t('p2q16.no'), 'no'],
          [t('p2q16.unknown'), 'unknown'],
        ].map(([label, val]) => (
          <ChoiceBtn key={val} label={label} selected={choice === val} onClick={() => setChoice(val)} />
        ))}
        {choice && (
          <textarea
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder={t('p2q16.detail')}
            rows={4}
            style={detailTextareaStyle}
          />
        )}
      </div>
    </>
  )
}

// ─── Done screen ───────────────────────────────────────────────────────────────

function DoneScreen({ onSubmit, t }) {
  return (
    <div style={{ textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'var(--color-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 2rem',
        }}
      >
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
          <path d="M8 18L15 25L28 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2rem',
          fontWeight: 600,
          marginBottom: '1rem',
          color: 'var(--color-text)',
        }}
      >
        {t('p2.done.heading')}
      </h2>
      <p style={{ fontSize: '1.05rem', color: 'var(--color-muted)', lineHeight: 1.7, marginBottom: '2.5rem' }}>
        {t('p2.done.body')}
      </p>
      <button
        onClick={onSubmit}
        style={{
          width: '100%',
          minHeight: 56,
          background: 'var(--color-primary)',
          color: '#fff',
          border: 'none',
          borderRadius: 'var(--radius-btn)',
          fontSize: '1.1rem',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        {t('p2.done.submit')}
      </button>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function InterviewPhase2() {
  const { t, language, setInterviewPhase1 } = useApp()
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [draft, setDraft] = useState(null)
  const [done, setDone] = useState(false)

  const langMap = { fr: 'fr-FR', en: 'en-CA', es: 'es-ES', ht: 'fr-HT', ar: 'ar-SA' }
  const speechLang = langMap[language] || 'fr-FR'

  const commitAndAdvance = (val) => {
    const saved = { ...answers, [step]: val }
    setAnswers(saved)
    setDraft(null)
    const next = getNextStep(step, val)
    if (next < TOTAL) {
      setStep(next)
    } else {
      setInterviewPhase1(saved)
      setDone(true)
    }
  }

  // Used by Q11 and Q14 (auto-advance on click, no textarea)
  const handleChoiceSelect = (val) => {
    commitAndAdvance(val)
  }

  // Used by all text and choice+textarea questions via the Next button
  const handleTextNext = () => {
    if (!draft) return
    commitAndAdvance(draft)
  }

  const handleSkip = () => {
    setDraft(null)
    // undefined answer → no conditional skip (Q9 still shows even if Q8 skipped)
    const next = getNextStep(step, undefined)
    setStep(Math.min(next, TOTAL - 1))
  }

  const handlePrev = () => {
    const prev = getPrevStep(step, answers)
    setDraft(answers[prev] ?? null)
    setStep(prev)
  }

  const handleGoTo = (i) => {
    setDraft(answers[i] ?? null)
    setStep(i)
  }

  // Q11 (step 10) and Q14 (step 13) auto-advance on click — no Next button
  const usesNextButton = step !== 10 && step !== 13

  const renderQuestion = () => {
    switch (step) {
      case 0:  return <TextQ draft={draft} setDraft={setDraft} promptKey="p2q1.prompt"  t={t} lang={speechLang} />
      case 1:  return <TextQ draft={draft} setDraft={setDraft} promptKey="p2q2.prompt"  t={t} lang={speechLang} />
      case 2:  return <TextQ draft={draft} setDraft={setDraft} promptKey="p2q3.prompt"  t={t} lang={speechLang} />
      case 3:  return <TextQ draft={draft} setDraft={setDraft} promptKey="p2q4.prompt"  t={t} lang={speechLang} />
      case 4:  return <TextQ draft={draft} setDraft={setDraft} promptKey="p2q5.prompt"  t={t} lang={speechLang} />
      case 5:  return <TextQ draft={draft} setDraft={setDraft} promptKey="p2q6.prompt"  t={t} lang={speechLang} />
      case 6:  return <Q7   draft={draft} setDraft={setDraft} t={t} />
      case 7:  return <Q8   draft={draft} setDraft={setDraft} t={t} />
      case 8:  return <TextQ draft={draft} setDraft={setDraft} promptKey="p2q9.prompt"  t={t} lang={speechLang} />
      case 9:  return <TextQ draft={draft} setDraft={setDraft} promptKey="p2q10.prompt" t={t} lang={speechLang} />
      case 10: return <Q11  draft={draft} onSelect={handleChoiceSelect} t={t} />
      case 11: return <Q12  draft={draft} setDraft={setDraft} t={t} />
      case 12: return <TextQ draft={draft} setDraft={setDraft} promptKey="p2q13.prompt" t={t} lang={speechLang} />
      case 13: return <Q14  draft={draft} onSelect={handleChoiceSelect} t={t} />
      case 14: return <Q15  draft={draft} setDraft={setDraft} t={t} />
      case 15: return <Q16  draft={draft} setDraft={setDraft} t={t} />
      default: return null
    }
  }

  if (done) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}
      >
        <DoneScreen onSubmit={() => navigate('/seeker/interview/3')} t={t} />
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem 1.25rem 6rem',
        maxWidth: 600,
        margin: '0 auto',
      }}
    >
      <StepBar step={step} answers={answers} total={TOTAL} onGoTo={handleGoTo} />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0',
        }}
      >
        {renderQuestion()}
      </div>

      {/* Bottom navigation */}
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
          justifyContent: 'center',
        }}
      >
        {step > 0 && (
          <button
            onClick={handlePrev}
            style={{
              minHeight: 52,
              padding: '0 1.5rem',
              background: 'transparent',
              border: '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-btn)',
              fontSize: '1rem',
              fontWeight: 500,
              color: 'var(--color-text)',
              cursor: 'pointer',
            }}
          >
            {t('interview.prev')}
          </button>
        )}

        {usesNextButton && (
          <button
            onClick={handleTextNext}
            disabled={!draft}
            style={{
              flex: 1,
              maxWidth: 280,
              minHeight: 52,
              background: draft ? 'var(--color-primary)' : 'var(--color-border)',
              color: draft ? '#fff' : 'var(--color-muted)',
              border: 'none',
              borderRadius: 'var(--radius-btn)',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: draft ? 'pointer' : 'default',
            }}
          >
            {t('interview.next')}
          </button>
        )}

        <button
          onClick={handleSkip}
          style={{
            minHeight: 52,
            padding: '0 1.5rem',
            background: 'transparent',
            border: 'none',
            fontSize: '0.9rem',
            color: 'var(--color-muted)',
            cursor: 'pointer',
          }}
        >
          {t('interview.skip')}
        </button>
      </div>
    </div>
  )
}
