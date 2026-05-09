import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

const TOTAL = 6

const ALL_COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda',
  'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain',
  'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
  'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria',
  'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon',
  'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros',
  'Congo (Brazzaville)', 'Congo (DRC)', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus',
  'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic',
  'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia',
  'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia',
  'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea',
  'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India',
  'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Ivory Coast',
  'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kosovo',
  'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia',
  'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi',
  'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania',
  'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia',
  'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal',
  'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea',
  'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine',
  'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland',
  'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis',
  'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino',
  'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles',
  'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands',
  'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka',
  'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan',
  'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago',
  'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine',
  'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay',
  'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen',
  'Zambia', 'Zimbabwe',
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
      aria-label="Question progress"
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
              color: done ? '#fff' : current ? 'var(--color-primary)' : 'var(--color-muted)',
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

// ─── Question prompt ──────────────────────────────────────────────────────────

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

// ─── Q1: Country of origin (fled from) ───────────────────────────────────────

function Q1({ draft, onSelect, t }) {
  const [query, setQuery] = useState('')
  const filtered = query.length > 0
    ? ALL_COUNTRIES.filter((c) => c.toLowerCase().includes(query.toLowerCase()))
    : ALL_COUNTRIES

  return (
    <>
      <Prompt>{t('p0q1.prompt')}</Prompt>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('p0q1.search')}
          style={{
            width: '100%',
            minHeight: 52,
            padding: '0 1rem',
            fontSize: '1rem',
            border: '1.5px solid var(--color-border)',
            borderRadius: 'var(--radius-btn)',
            background: 'var(--color-bg)',
            fontFamily: 'var(--font-ui)',
            marginBottom: '0.75rem',
            boxSizing: 'border-box',
          }}
        />
        <div style={{ maxHeight: 300, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {filtered.map((country) => (
            <ChoiceBtn
              key={country}
              label={country}
              selected={draft === country}
              onClick={() => onSelect(country)}
            />
          ))}
        </div>
      </div>
    </>
  )
}

// ─── Q2: Province + duration ─────────────────────────────────────────────────

function Q2({ draft, setDraft, t }) {
  const val = draft || {}
  const set = (k, v) => setDraft({ ...val, [k]: v })

  return (
    <>
      <Prompt>{t('p0q2.prompt')}</Prompt>
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
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>
    </>
  )
}

// ─── Q3: Sex ──────────────────────────────────────────────────────────────────

function Q3({ draft, onSelect, t }) {
  const opts = [
    [t('q1.man'), 'man'],
    [t('q1.woman'), 'woman'],
    [t('q1.nonbinary'), 'nonbinary'],
    [t('q1.notsay'), 'notsay'],
  ]
  return (
    <>
      <Prompt>{t('p0q3.prompt')}</Prompt>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', alignItems: 'center' }}>
        {opts.map(([label, val]) => (
          <ChoiceBtn key={val} label={label} selected={draft === val} onClick={() => onSelect(val)} />
        ))}
      </div>
    </>
  )
}

// ─── Q4: Age group ────────────────────────────────────────────────────────────

function Q4({ draft, onSelect, t }) {
  const opts = ['18–25', '26–35', '36–50', '51+']
  return (
    <>
      <Prompt>{t('p0q4.prompt')}</Prompt>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', alignItems: 'center' }}>
        {opts.map((val) => (
          <ChoiceBtn key={val} label={val} selected={draft === val} onClick={() => onSelect(val)} />
        ))}
      </div>
    </>
  )
}

// ─── Q5: How arrived ─────────────────────────────────────────────────────────

function Q5({ draft, onSelect, t }) {
  const opts = [
    [t('p0q5.plane'), 'plane'],
    [t('p0q5.road'), 'road'],
    [t('p0q5.boat'), 'boat'],
    [t('p0q5.train'), 'train'],
    [t('p0q5.other'), 'other'],
  ]
  return (
    <>
      <Prompt>{t('p0q5.prompt')}</Prompt>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', alignItems: 'center' }}>
        {opts.map(([label, val]) => (
          <ChoiceBtn key={val} label={label} selected={draft === val} onClick={() => onSelect(val)} />
        ))}
      </div>
    </>
  )
}

// ─── Q6: When arrived (Day / Month / Year) ────────────────────────────────────

function Q6({ draft, setDraft, t }) {
  const val = draft || {}
  const set = (k, v) => setDraft({ ...val, [k]: v })

  return (
    <>
      <Prompt>{t('p0q6.prompt')}</Prompt>
      <div style={{ width: '100%', maxWidth: 440, display: 'flex', gap: '0.75rem' }}>
        {[
          { key: 'day', label: t('p0q6.day'), placeholder: 'DD', min: 1, max: 31 },
          { key: 'month', label: t('p0q6.month'), placeholder: 'MM', min: 1, max: 12 },
          { key: 'year', label: t('p0q6.year'), placeholder: 'YYYY', min: 1900, max: new Date().getFullYear() },
        ].map(({ key, label, placeholder, min, max }) => (
          <div key={key} style={{ flex: key === 'year' ? 2 : 1 }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-muted)', marginBottom: '0.4rem', textAlign: 'center' }}>
              {label}
            </label>
            <input
              type="number"
              value={val[key] || ''}
              onChange={(e) => set(key, e.target.value)}
              placeholder={placeholder}
              min={min}
              max={max}
              style={{
                width: '100%',
                minHeight: 64,
                padding: '0 0.75rem',
                fontSize: '1.25rem',
                fontWeight: 600,
                textAlign: 'center',
                border: '1.5px solid var(--color-border)',
                borderRadius: 'var(--radius-btn)',
                background: 'var(--color-bg)',
                fontFamily: 'var(--font-ui)',
                boxSizing: 'border-box',
              }}
            />
          </div>
        ))}
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
        {t('p0.done.heading')}
      </h2>
      <p style={{ fontSize: '1.05rem', color: 'var(--color-muted)', lineHeight: 1.7, marginBottom: '2.5rem' }}>
        {t('p0.done.body')}
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
        {t('p0.done.submit')}
      </button>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function InterviewPhase0() {
  const { t, interviewPhase0, setInterviewPhase0, phase0Index, setPhase0Index } = useApp()
  const navigate = useNavigate()

  const initialStep = Math.min(phase0Index, TOTAL - 1)
  const [step, setStep] = useState(initialStep)
  const [answers, setAnswers] = useState(interviewPhase0 || {})
  const [draft, setDraft] = useState((interviewPhase0 || {})[initialStep] ?? null)
  const [done, setDone] = useState(false)

  const commitAndAdvance = (val) => {
    const saved = { ...answers, [step]: val }
    setAnswers(saved)
    setInterviewPhase0(saved)
    setDraft(null)
    if (step < TOTAL - 1) {
      setStep((s) => s + 1)
      setPhase0Index(step + 1)
    } else {
      setDone(true)
    }
  }

  // Choice questions auto-advance on selection
  const handleChoiceSelect = (val) => commitAndAdvance(val)

  // Text/composite questions use Next button
  const handleNext = () => {
    if (!draft) return
    commitAndAdvance(draft)
  }

  const handleSkip = () => {
    setDraft(null)
    if (step < TOTAL - 1) {
      setStep((s) => s + 1)
      setPhase0Index(step + 1)
    } else {
      setDone(true)
    }
  }

  const handlePrev = () => {
    setDraft(answers[step - 1] ?? null)
    setStep((s) => Math.max(s - 1, 0))
    setPhase0Index(step - 1)
  }

  const handleGoTo = (i) => {
    setDraft(answers[i] ?? null)
    setStep(i)
    setPhase0Index(i)
  }

  // Steps that need a Next button (composite / text inputs)
  const usesNextButton = [1, 5].includes(step)

  const renderQuestion = () => {
    switch (step) {
      case 0: return <Q1 draft={draft} onSelect={handleChoiceSelect} t={t} />
      case 1: return <Q2 draft={draft} setDraft={setDraft} t={t} />
      case 2: return <Q3 draft={draft} onSelect={handleChoiceSelect} t={t} />
      case 3: return <Q4 draft={draft} onSelect={handleChoiceSelect} t={t} />
      case 4: return <Q5 draft={draft} onSelect={handleChoiceSelect} t={t} />
      case 5: return <Q6 draft={draft} setDraft={setDraft} t={t} />
      default: return null
    }
  }

  if (done) {
    return (
      <div style={{ minHeight: 'calc(100vh - 48px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <DoneScreen onSubmit={() => navigate('/seeker/interview/1')} t={t} />
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 48px)',
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
            onClick={handleNext}
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
