export default function Logo({ size = 'sm' }) {
  const isLg = size === 'lg'
  const height = isLg ? 120 : 32
  const width = Math.round(height * 170 / 260)

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: isLg ? 'center' : 'flex-start',
      gap: isLg ? '1rem' : '0.5rem',
    }}>
      <svg
        viewBox="0 0 170 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ height, width, flexShrink: 0 }}
        aria-hidden="true"
      >
        <line x1="0" y1="248" x2="170" y2="248" stroke="#1a4a2e" strokeWidth="5" strokeLinecap="round"/>
        <line x1="18" y1="248" x2="18" y2="125" stroke="#1a4a2e" strokeWidth="5" strokeLinecap="round"/>
        <line x1="152" y1="248" x2="152" y2="125" stroke="#1a4a2e" strokeWidth="5" strokeLinecap="round"/>
        <path d="M18 125 Q18 30 85 30 Q152 30 152 125" fill="none" stroke="#1a4a2e" strokeWidth="5" strokeLinecap="round"/>
        <circle cx="132" cy="178" r="6.5" fill="#1a4a2e"/>
      </svg>
      <span style={{
        fontFamily: 'var(--font-display)',
        fontStyle: 'italic',
        fontWeight: 700,
        fontSize: isLg ? '3.25rem' : '1.25rem',
        color: 'var(--color-primary)',
        letterSpacing: '-0.02em',
        lineHeight: 1,
      }}>
        Mon Prologue
      </span>
    </div>
  )
}
