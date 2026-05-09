export default function ConfirmBubble({ displayText, onConfirm, onChange, t }) {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 520,
        background: 'var(--color-card)',
        border: '1.5px solid var(--color-border)',
        borderRadius: 'var(--radius-card)',
        padding: '2rem 1.75rem',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        animation: 'fadeInUp 250ms ease both',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.25rem',
          fontWeight: 600,
          color: 'var(--color-text)',
          marginBottom: '0.75rem',
        }}
      >
        {t('interview.confirm.question')}
      </p>

      <p
        style={{
          fontSize: '1.05rem',
          color: 'var(--color-secondary)',
          background: '#F0F5F2',
          borderRadius: 8,
          padding: '0.75rem 1rem',
          marginBottom: '1.75rem',
          lineHeight: 1.6,
          wordBreak: 'break-word',
        }}
      >
        {displayText}
      </p>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          onClick={onConfirm}
          style={{
            flex: 1,
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
          {t('interview.confirm.yes')}
        </button>
        <button
          onClick={onChange}
          style={{
            flex: 1,
            minHeight: 52,
            background: 'transparent',
            color: 'var(--color-text)',
            border: '1.5px solid var(--color-border)',
            borderRadius: 'var(--radius-btn)',
            fontSize: '1rem',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          {t('interview.confirm.change')}
        </button>
      </div>
    </div>
  )
}
