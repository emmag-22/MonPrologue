const DOOR_SVG = (
  <>
    <line x1="0" y1="248" x2="170" y2="248" stroke="#1a4a2e" strokeWidth="5" strokeLinecap="round"/>
    <line x1="18" y1="248" x2="18" y2="125" stroke="#1a4a2e" strokeWidth="5" strokeLinecap="round"/>
    <line x1="152" y1="248" x2="152" y2="125" stroke="#1a4a2e" strokeWidth="5" strokeLinecap="round"/>
    <path d="M18 125 Q18 30 85 30 Q152 30 152 125" fill="none" stroke="#1a4a2e" strokeWidth="5" strokeLinecap="round"/>
    <circle cx="132" cy="178" r="6.5" fill="#1a4a2e"/>
  </>
)

export default function Logo({ size = 'sm' }) {
  if (size === 'lg') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
        <svg viewBox="0 0 170 260" fill="none" height="80" aria-hidden="true">
          {DOOR_SVG}
        </svg>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontWeight: 700,
          fontSize: '3.25rem',
          color: 'var(--color-primary)',
          letterSpacing: '-0.02em',
          lineHeight: 1,
        }}>
          Mon Prologue
        </span>
      </div>
    )
  }

  // sm: horizontal, for topbars
  const smWidth = Math.round(32 * 170 / 260)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <svg
        viewBox="0 0 170 260"
        fill="none"
        style={{ height: 32, width: smWidth, flexShrink: 0 }}
        aria-hidden="true"
      >
        {DOOR_SVG}
      </svg>
      <span style={{
        fontFamily: 'var(--font-display)',
        fontStyle: 'italic',
        fontWeight: 700,
        fontSize: '1.25rem',
        color: 'var(--color-primary)',
        letterSpacing: '-0.02em',
        lineHeight: 1,
      }}>
        Mon Prologue
      </span>
    </div>
  )
}
