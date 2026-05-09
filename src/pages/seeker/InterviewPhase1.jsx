import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import MicButton from '../../components/MicButton'

// ─── Constants ────────────────────────────────────────────────────────────────

const TOTAL = 9

const COMMON_COUNTRIES = [
  'Afghanistan', 'Algeria', 'Angola', 'Bangladesh', 'Cameroon', 'China',
  'Colombia', 'Democratic Republic of Congo', 'El Salvador', 'Eritrea',
  'Ethiopia', 'Guatemala', 'Haiti', 'Honduras', 'India', 'Iran', 'Iraq',
  'Jamaica', 'Mexico', 'Myanmar', 'Nigeria', 'Pakistan', 'Philippines',
  'Somalia', 'Sri Lanka', 'Syria', 'Turkey', 'Ukraine', 'Venezuela',
  'Zimbabwe',
]

const PROVINCES = [
  'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
  'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia',
  'Nunavut', 'Ontario', 'Prince Edward Island', 'Québec',
  'Saskatchewan', 'Yukon',
]

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

// ─── Question prompts ─────────────────────────────────────────────────────────

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

// ─── Individual question renderers ────────────────────────────────────────────

function Q1({ draft, setDraft, onSelect, t }) {
  const opts = [
    [t('q1.man'), 'man'],
    [t('q1.woman'), 'woman'],
    [t('q1.nonbinary'), 'nonbinary'],
    [t('q1.notsay'), 'notsay'],
  ]
  return (
    <>
      <Prompt>{t('q1.prompt')}</Prompt>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', alignItems: 'center' }}>
        {opts.map(([label, val]) => (
          <ChoiceBtn key={val} label={label} selected={draft === val} onClick={() => onSelect(val, label)} />
        ))}
      </div>
    </>
  )
}

function Q2({ draft, onSelect, t }) {
  const opts = ['18–25', '26–35', '36–50', '51+']
  return (
    <>
      <Prompt>{t('q2.prompt')}</Prompt>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', alignItems: 'center' }}>
        {opts.map((val) => (
          <ChoiceBtn key={val} label={val} selected={draft === val} onClick={() => onSelect(val, val)} />
        ))}
      </div>
    </>
  )
}

function Q3({ draft, setDraft, onSelect, t }) {
  const [query, setQuery] = useState('')
  const filtered = query.length > 0
    ? COMMON_COUNTRIES.filter((c) => c.toLowerCase().includes(query.toLowerCase()))
    : COMMON_COUNTRIES

  return (
    <>
      <Prompt>{t('q3.prompt')}</Prompt>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('q3.search')}
          style={{
            width: '100%',
            minHeight: 52,
            padding: '0 1rem',
            fontSize: '1rem',
            border: '1.5px solid var(--color-border)',
            borderRadius: 'var(--radius-btn)',
            background: 'var(--color-bg)',
            marginBottom: '0.75rem',
          }}
        />
        <div style={{ maxHeight: 280, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {filtered.map((country) => (
            <ChoiceBtn
              key={country}
              label={country}
              selected={draft === country}
              onClick={() => onSelect(country, country)}
            />
          ))}
        </div>
      </div>
    </>
  )
}

function Q4({ draft, onSelect, t }) {
  const opts = [
    [t('q4.race'), 'race'],
    [t('q4.religion'), 'religion'],
    [t('q4.nationality'), 'nationality'],
    [t('q4.political'), 'political'],
    [t('q4.psg'), 'psg'],
  ]
  return (
    <>
      <Prompt>{t('q4.prompt')}</Prompt>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', alignItems: 'center' }}>
        {opts.map(([label, val]) => (
          <ChoiceBtn key={val} label={label} selected={draft === val} onClick={() => onSelect(val, label)} />
        ))}
      </div>
    </>
  )
}

function Q5({ draft, setDraft, onNext, t, lang }) {
  return (
    <>
      <Prompt>{t('q5.prompt')}</Prompt>
      <div style={{ width: '100%', maxWidth: 520, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
        <textarea
          value={draft || ''}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={t('q5.placeholder')}
          rows={7}
          style={{
            width: '100%',
            padding: '1rem',
            fontSize: '1rem',
            lineHeight: 1.7,
            border: '1.5px solid var(--color-border)',
            borderRadius: 'var(--radius-card)',
            background: 'var(--color-bg)',
            resize: 'vertical',
            fontFamily: 'var(--font-ui)',
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <MicButton onResult={(text) => setDraft((d) => (d ? d + ' ' + text : text))} lang={lang} />
          <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>{t('q5.mic')}</span>
        </div>
      </div>
    </>
  )
}

function Q6({ draft, setDraft, t }) {
  const val = draft || {}
  const set = (k, v) => setDraft({ ...val, [k]: v })

  return (
    <>
      <Prompt>{t('q6.prompt')}</Prompt>
      <div style={{ width: '100%', maxWidth: 440, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {[
          ['incidents', t('q6.incidents')],
          ['left', t('q6.left')],
          ['arrived', t('q6.arrived')],
        ].map(([key, label]) => (
          <div key={key}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-muted)', marginBottom: '0.4rem' }}>
              {label}
            </label>
            <input
              type="month"
              value={val[key] || ''}
              onChange={(e) => set(key, e.target.value)}
              style={{
                width: '100%',
                minHeight: 52,
                padding: '0 1rem',
                fontSize: '1rem',
                border: '1.5px solid var(--color-border)',
                borderRadius: 'var(--radius-btn)',
                background: 'var(--color-bg)',
                fontFamily: 'var(--font-ui)',
              }}
            />
          </div>
        ))}
      </div>
    </>
  )
}

function Q7({ draft, setDraft, onSelect, t }) {
  const choice = draft?.choice
  const detail = draft?.detail || ''
  const setChoice = (c) => setDraft({ choice: c, detail: '' })
  const setDetail = (d) => setDraft({ ...(draft || {}), detail: d })

  const opts = [
    [t('q7.yes'), 'yes'],
    [t('q7.no'), 'no'],
    [t('q7.tried'), 'tried'],
  ]

  return (
    <>
      <Prompt>{t('q7.prompt')}</Prompt>
      <div style={{ width: '100%', maxWidth: 440, display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
        {opts.map(([label, val]) => (
          <ChoiceBtn key={val} label={label} selected={choice === val} onClick={() => setChoice(val)} />
        ))}
        {choice && choice !== 'yes' && (
          <textarea
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder={t('q7.detail')}
            rows={4}
            style={{
              width: '100%',
              marginTop: '0.5rem',
              padding: '1rem',
              fontSize: '1rem',
              lineHeight: 1.7,
              border: '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-card)',
              background: 'var(--color-bg)',
              resize: 'vertical',
              fontFamily: 'var(--font-ui)',
            }}
          />
        )}
      </div>
    </>
  )
}

function Q8({ draft, setDraft, t }) {
  const choice = draft?.choice
  const detail = draft?.detail || ''
  const setChoice = (c) => setDraft({ choice: c, detail: '' })
  const setDetail = (d) => setDraft({ ...(draft || {}), detail: d })

  const opts = [
    [t('q8.yes'), 'yes'],
    [t('q8.no'), 'no'],
    [t('q8.unknown'), 'unknown'],
  ]

  return (
    <>
      <Prompt>{t('q8.prompt')}</Prompt>
      <div style={{ width: '100%', maxWidth: 440, display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
        {opts.map(([label, val]) => (
          <ChoiceBtn key={val} label={label} selected={choice === val} onClick={() => setChoice(val)} />
        ))}
        {choice && choice !== 'yes' && (
          <textarea
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder={t('q8.detail')}
            rows={4}
            style={{
              width: '100%',
              marginTop: '0.5rem',
              padding: '1rem',
              fontSize: '1rem',
              lineHeight: 1.7,
              border: '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-card)',
              background: 'var(--color-bg)',
              resize: 'vertical',
              fontFamily: 'var(--font-ui)',
            }}
          />
        )}
      </div>
    </>
  )
}

function Q9({ draft, setDraft, t }) {
  const val = draft || {}
  const set = (k, v) => setDraft({ ...val, [k]: v })

  return (
    <>
      <Prompt>{t('q9.prompt')}</Prompt>
      <div style={{ width: '100%', maxWidth: 440, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-muted)', marginBottom: '0.4rem' }}>
            {t('q9.province')}
          </label>
          <select
            value={val.province || ''}
            onChange={(e) => set('province', e.target.value)}
            style={{
              width: '100%',
              minHeight: 52,
              padding: '0 1rem',
              fontSize: '1rem',
              border: '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-btn)',
              background: 'var(--color-bg)',
              fontFamily: 'var(--font-ui)',
              appearance: 'auto',
            }}
          >
            <option value="" disabled>{t('q9.province')}</option>
            {PROVINCES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-muted)', marginBottom: '0.4rem' }}>
            {t('q9.duration')}
          </label>
          <input
            type="text"
            value={val.duration || ''}
            onChange={(e) => set('duration', e.target.value)}
            placeholder={t('q9.duration')}
            style={{
              width: '100%',
              minHeight: 52,
              padding: '0 1rem',
              fontSize: '1rem',
              border: '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-btn)',
              background: 'var(--color-bg)',
              fontFamily: 'var(--font-ui)',
            }}
          />
        </div>
      </div>
    </>
  )
}

// ─── Done screen ──────────────────────────────────────────────────────────────

function DoneScreen({ onSubmit, t }) {
  return (
    <div style={{ textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
      <div
        style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'var(--color-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 2rem',
        }}
      >
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
          <path d="M8 18L15 25L28 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--color-text)' }}>
        {t('interview.done.heading')}
      </h2>
      <p style={{ fontSize: '1.05rem', color: 'var(--color-muted)', lineHeight: 1.7, marginBottom: '2.5rem' }}>
        {t('interview.done.body')}
      </p>
      <button
        onClick={onSubmit}
        style={{
          width: '100%', minHeight: 56,
          background: 'var(--color-primary)', color: '#fff',
          border: 'none', borderRadius: 'var(--radius-btn)',
          fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer',
        }}
      >
        {t('interview.done.submit')}
      </button>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function InterviewPhase1() {
  const { t, language, setInterviewAnswers } = useApp()
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [draft, setDraft] = useState(null)
  const [done, setDone] = useState(false)

  // Map language codes to BCP-47 for SpeechRecognition
  const langMap = { fr: 'fr-FR', en: 'en-CA', es: 'es-ES', ht: 'fr-HT' }
  const speechLang = langMap[language] || 'fr-FR'

  const commitAndAdvance = (val) => {
    const saved = { ...answers, [step]: val }
    setAnswers(saved)
    setDraft(null)
    if (step < TOTAL - 1) {
      setStep((s) => s + 1)
    } else {
      setInterviewAnswers(saved)
      setDone(true)
    }
  }

  // Called by choice-button questions — commits immediately, no confirm step
  const handleChoiceSelect = (val, _label) => {
    commitAndAdvance(val)
  }

  // Called by the "Next" button for text/date/object questions
  const handleTextNext = () => {
    if (!draft) return
    commitAndAdvance(draft)
  }

  const handleSkip = () => {
    setDraft(null)
    setStep((s) => Math.min(s + 1, TOTAL - 1))
  }

  const handlePrev = () => {
    setDraft(answers[step - 1] ?? null)
    setStep((s) => Math.max(s - 1, 0))
  }

  const handleGoTo = (i) => {
    setDraft(answers[i] ?? null)
    setStep(i)
  }

  // Which questions use "Next" button rather than auto-confirm on click
  const usesNextButton = [4, 5, 6, 7, 8].includes(step)

  const renderQuestion = () => {
    switch (step) {
      case 0: return <Q1 draft={draft} setDraft={setDraft} onSelect={handleChoiceSelect} t={t} />
      case 1: return <Q2 draft={draft} setDraft={setDraft} onSelect={handleChoiceSelect} t={t} />
      case 2: return <Q3 draft={draft} setDraft={setDraft} onSelect={handleChoiceSelect} t={t} />
      case 3: return <Q4 draft={draft} setDraft={setDraft} onSelect={handleChoiceSelect} t={t} />
      case 4: return <Q5 draft={draft} setDraft={setDraft} t={t} lang={speechLang} />
      case 5: return <Q6 draft={draft} setDraft={setDraft} t={t} />
      case 6: return <Q7 draft={draft} setDraft={setDraft} onSelect={handleChoiceSelect} t={t} />
      case 7: return <Q8 draft={draft} setDraft={setDraft} t={t} />
      case 8: return <Q9 draft={draft} setDraft={setDraft} t={t} />
      default: return null
    }
  }

  if (done) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <DoneScreen onSubmit={() => navigate('/seeker/interview/2')} t={t} />
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
      {/* Step indicator */}
      <StepBar step={step} answers={answers} total={TOTAL} onGoTo={handleGoTo} />

      {/* Question */}
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
