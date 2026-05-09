import { useApp } from '../context/AppContext'

const fakeCases = [
  { id: 'S-001', urgent: true, category: 'Haïti', status: 'pending' },
  { id: 'S-002', urgent: false, category: 'Colombia', status: 'pending' },
  { id: 'S-003', urgent: true, category: 'Nigeria', status: 'pending' },
]

export default function ClinicDashboard() {
  const { t } = useApp()

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: 800, margin: '0 auto' }}>
      <h1
        style={{
          fontSize: '1.5rem',
          fontWeight: 600,
          marginBottom: '1.5rem',
        }}
      >
        {t('clinic.dashboard.heading')}
      </h1>

      {/* Cases table */}
      <div
        style={{
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-card)',
          overflow: 'hidden',
          marginBottom: '1.5rem',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.9rem',
          }}
        >
          <thead>
            <tr
              style={{
                background: 'var(--color-bg)',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              <th style={thStyle}>{t('clinic.dashboard.session')}</th>
              <th style={thStyle}>{t('clinic.dashboard.urgency')}</th>
              <th style={thStyle}>{t('clinic.dashboard.category')}</th>
              <th style={thStyle}>{t('clinic.dashboard.status')}</th>
            </tr>
          </thead>
          <tbody>
            {fakeCases.map((c) => (
              <tr
                key={c.id}
                style={{ borderBottom: '1px solid var(--color-border)' }}
              >
                <td style={tdStyle}>{c.id}</td>
                <td style={tdStyle}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '0.2rem 0.6rem',
                      borderRadius: 999,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: c.urgent ? '#FDECEA' : '#F0F0EE',
                      color: c.urgent ? 'var(--color-danger)' : 'var(--color-muted)',
                    }}
                  >
                    {c.urgent ? t('clinic.dashboard.urgent') : t('clinic.dashboard.normal')}
                  </span>
                </td>
                <td style={tdStyle}>{c.category}</td>
                <td style={tdStyle}>
                  <span style={{ color: 'var(--color-muted)' }}>
                    {t('clinic.dashboard.pending')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TODO: Full case management interface */}
      <p
        style={{
          textAlign: 'center',
          color: 'var(--color-muted)',
          fontSize: '0.85rem',
          fontStyle: 'italic',
        }}
      >
        {t('clinic.dashboard.placeholder')}
      </p>
    </div>
  )
}

const thStyle = {
  textAlign: 'left',
  padding: '0.75rem 1rem',
  fontWeight: 600,
  fontSize: '0.8rem',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  color: 'var(--color-muted)',
}

const tdStyle = {
  padding: '0.75rem 1rem',
}
