import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import LanguageSwitcher from '../components/LanguageSwitcher'

const PHASE_ROUTES = [
  '/seeker/interview/0',
  '/seeker/interview/1',
  '/seeker/interview/2',
  '/seeker/interview/3',
  '/seeker/report',
]

function currentPhaseFromPath(pathname) {
  if (pathname.includes('/interview/0')) return 0
  if (pathname.includes('/interview/1')) return 1
  if (pathname.includes('/interview/2')) return 2
  if (pathname.includes('/interview/3')) return 3
  if (pathname.includes('/report')) return 4
  return -1
}

function PhaseNavBar({ t, interviewPhase0, interviewAnswers, interviewPhase1, interviewPhase2 }) {
  const navigate = useNavigate()
  const location = useLocation()
  const currentPhase = currentPhaseFromPath(location.pathname)

  if (currentPhase === -1) return null

  const hasData = (obj) => Object.keys(obj || {}).length > 0

  const completed = new Set([
    ...(hasData(interviewPhase0) ? [0] : []),
    ...(hasData(interviewAnswers) ? [1] : []),
    ...(hasData(interviewPhase1) ? [2] : []),
    ...(hasData(interviewPhase2) ? [3] : []),
  ])

  const PHASES = [
    { num: 0, route: PHASE_ROUTES[0] },
    { num: 1, route: PHASE_ROUTES[1] },
    { num: 2, route: PHASE_ROUTES[2] },
    { num: 3, route: PHASE_ROUTES[3] },
    { num: 4, route: PHASE_ROUTES[4] },
  ]

  return (
    <div
      role="navigation"
      aria-label="Interview phases"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        background: 'var(--color-card)',
        borderBottom: '1px solid var(--color-border)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        // Right padding so tabs don't slide under the fixed language switcher
        paddingRight: '100px',
      }}
    >
      {PHASES.map(({ num, route }) => {
        const isCurrent = num === currentPhase
        const isDone = completed.has(num)
        const isClickable = isDone && !isCurrent

        return (
          <button
            key={num}
            onClick={() => isClickable && navigate(route)}
            disabled={!isCurrent && !isDone}
            aria-current={isCurrent ? 'step' : undefined}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.2rem',
              padding: '0.55rem 0.25rem 0.5rem',
              background: isCurrent ? 'var(--color-primary)' : 'transparent',
              border: 'none',
              borderRight: '1px solid var(--color-border)',
              cursor: isClickable ? 'pointer' : 'default',
              transition: 'background 150ms',
              minHeight: 48,
            }}
          >
            {/* Phase number / checkmark */}
            <span
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                lineHeight: 1,
                color: isCurrent
                  ? '#fff'
                  : isDone
                    ? 'var(--color-primary)'
                    : 'var(--color-border)',
              }}
            >
              {isDone && !isCurrent ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M3 8L7 12L13 5"
                    stroke="var(--color-primary)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                num
              )}
            </span>

            {/* French title */}
            <span
              style={{
                fontSize: '0.58rem',
                fontWeight: isCurrent ? 600 : 400,
                lineHeight: 1.2,
                textAlign: 'center',
                color: isCurrent ? '#fff' : isDone ? 'var(--color-text)' : 'var(--color-border)',
                maxWidth: 72,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {t(`phase.nav.${num}`)}
            </span>

            {/* English subtitle */}
            <span
              style={{
                fontSize: '0.5rem',
                lineHeight: 1.2,
                textAlign: 'center',
                color: isCurrent ? 'rgba(255,255,255,0.7)' : isDone ? 'var(--color-muted)' : 'var(--color-border)',
                maxWidth: 72,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {/* English subtitle via a fixed map since t() uses current language */}
              {[
                'Preliminary questions',
                'Narrative drafting',
                'Personalized questions',
                'Sensitivity questions',
                'Review',
              ][num]}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default function SeekerShell() {
  const { t, interviewPhase0, interviewAnswers, interviewPhase1, interviewPhase2 } = useApp()

  const handlePause = () => {
    alert(t('seeker.pause.alert'))
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', position: 'relative' }}>
      <LanguageSwitcher />

      <PhaseNavBar
        t={t}
        interviewPhase0={interviewPhase0}
        interviewAnswers={interviewAnswers}
        interviewPhase1={interviewPhase1}
        interviewPhase2={interviewPhase2}
      />

      <Outlet />

      {/* Pause / come back later button */}
      <button
        onClick={handlePause}
        aria-label={t('seeker.pause')}
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.75rem 1.25rem',
          background: 'var(--color-card)',
          border: '1.5px solid var(--color-border)',
          borderRadius: 999,
          fontSize: '0.85rem',
          fontWeight: 500,
          color: 'var(--color-text)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          cursor: 'pointer',
          minHeight: 52,
          zIndex: 100,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <rect x="3" y="2" width="4" height="12" rx="1" />
          <rect x="9" y="2" width="4" height="12" rx="1" />
        </svg>
        {t('seeker.pause')}
      </button>
    </div>
  )
}
