/**
 * Vertical timeline component for case dossier.
 * Color-coded events with gap detection.
 *
 * @param {{ events: Array<{ date: string, event: string, type: 'persecution'|'travel'|'canada' }> }} props
 */

const TYPE_COLOR = {
  persecution: '#d94f3d',
  travel: '#3b82f6',
  canada: '#2eb87e',
}

const TYPE_LABEL = {
  persecution: 'Persecution',
  travel: 'Travel / Departure',
  canada: 'Canadian milestone',
}

function parseDate(str) {
  if (!str) return null
  const d = new Date(str)
  return isNaN(d.getTime()) ? null : d
}

function daysBetween(a, b) {
  return Math.round(Math.abs(b.getTime() - a.getTime()) / 86400000)
}

function formatDate(str) {
  const d = parseDate(str)
  if (!d) return str || ''
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[d.getMonth()]} ${d.getFullYear()}`
}

export default function TimelineComponent({ events = [] }) {
  if (events.length === 0) {
    return <p style={{ fontSize: '0.82rem', color: 'var(--color-muted)', fontStyle: 'italic' }}>No timeline events available.</p>
  }

  // Sort by date
  const sorted = [...events]
    .map(e => ({ ...e, _parsed: parseDate(e.date) }))
    .sort((a, b) => (a._parsed?.getTime() || 0) - (b._parsed?.getTime() || 0))

  // Detect gaps > 30 days
  const items = []
  for (let i = 0; i < sorted.length; i++) {
    items.push({ type: 'event', data: sorted[i], index: i })
    if (i < sorted.length - 1 && sorted[i]._parsed && sorted[i + 1]._parsed) {
      const gap = daysBetween(sorted[i]._parsed, sorted[i + 1]._parsed)
      if (gap > 30) {
        items.push({ type: 'gap', days: gap })
      }
    }
  }

  return (
    <div style={{ position: 'relative', paddingLeft: 20 }}>
      {/* Vertical line */}
      <div style={{ position: 'absolute', left: 7, top: 8, bottom: 8, width: 2, background: 'var(--color-border)' }} />

      {items.map((item, i) => {
        if (item.type === 'gap') {
          return (
            <div key={`gap-${i}`} style={{ position: 'relative', padding: '0.35rem 0 0.35rem 20px', display: 'flex', alignItems: 'center' }}>
              <div style={{ position: 'absolute', left: 1, width: 14, height: 14, borderRadius: 3, background: '#e8a020', border: '2px solid var(--color-card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.5rem', fontWeight: 700, color: '#fff' }}>!</span>
              </div>
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#e8a020', fontStyle: 'italic' }}>
                ⚠ {item.days}-day gap
              </span>
            </div>
          )
        }

        const ev = item.data
        const color = TYPE_COLOR[ev.type] || 'var(--color-muted)'

        return (
          <div key={`ev-${i}`} style={{ position: 'relative', padding: '0.5rem 0 0.5rem 20px', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            {/* Dot */}
            <div style={{ position: 'absolute', left: 2, top: '0.65rem', width: 12, height: 12, borderRadius: '50%', background: color, border: '2px solid var(--color-card)', flexShrink: 0, zIndex: 1 }} />

            {/* Date */}
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-muted)', minWidth: 70, flexShrink: 0, fontFamily: 'monospace' }}>
              {formatDate(ev.date)}
            </span>

            {/* Description */}
            <div>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text)', lineHeight: 1.45 }}>{ev.event}</p>
              <span style={{ fontSize: '0.62rem', fontWeight: 600, color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {TYPE_LABEL[ev.type] || ev.type}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
