import { useState } from 'react'
import { useApp } from '../../context/AppContext'

const METHOD_ICONS = { email: '📧', phone: '📱', whatsapp: '💬' }

const METHODS = [
  { id: 'email',    labelFr: 'Courriel',   labelEn: 'Email',   type: 'email', placeholderFr: 'votre@courriel.com',            placeholderEn: 'your@email.com' },
  { id: 'phone',    labelFr: 'Téléphone',  labelEn: 'Phone',   type: 'tel',   placeholderFr: 'Votre numéro de téléphone',      placeholderEn: 'Your phone number' },
  { id: 'whatsapp', labelFr: 'WhatsApp',   labelEn: 'WhatsApp',type: 'tel',   placeholderFr: 'Votre numéro WhatsApp',          placeholderEn: 'Your WhatsApp number' },
]

export default function SeekerContact() {
  const { setContactInfo, setSessionPin, selectedClinic } = useApp()

  const [selected, setSelected] = useState(new Set())
  const [values, setValues] = useState({ email: '', phone: '', whatsapp: '' })
  const [submitted, setSubmitted] = useState(false)
  const [pin, setPin] = useState('')

  const toggle = (id) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const setValue = (id, v) => setValues((prev) => ({ ...prev, [id]: v }))

  const canSubmit = METHODS.some(
    (m) => selected.has(m.id) && values[m.id].trim().length > 0
  )

  const handleSubmit = () => {
    const raw = String(Math.floor(100000 + Math.random() * 900000))
    setSessionPin(raw)
    setPin(raw)
    setContactInfo({
      email:    selected.has('email')    ? values.email.trim()    : null,
      phone:    selected.has('phone')    ? values.phone.trim()    : null,
      whatsapp: selected.has('whatsapp') ? values.whatsapp.trim() : null,
    })
    setSubmitted(true)
  }

  // ── Confirmation ───────────────────────────────────────────────────────────────
  if (submitted) {
    const displayPin = `${pin.slice(0, 3)} ${pin.slice(3)}`
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1.5rem 4rem',
          textAlign: 'center',
          maxWidth: 480,
          margin: '0 auto',
        }}
      >
        {/* Checkmark */}
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: '50%',
            background: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '2rem',
          }}
        >
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
            <path
              d="M10 24L20 34L38 16"
              stroke="white"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.75rem',
            fontWeight: 600,
            color: 'var(--color-text)',
            marginBottom: '0.4rem',
            lineHeight: 1.3,
          }}
        >
          Votre dossier a été soumis
        </h1>
        <p
          style={{
            fontSize: '1rem',
            color: 'var(--color-muted)',
            marginBottom: '2.5rem',
          }}
        >
          Your file has been submitted
        </p>

        {/* PIN card */}
        <div
          style={{
            background: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-card)',
            padding: '1.75rem 2rem',
            marginBottom: '1rem',
            width: '100%',
          }}
        >
          <p
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--color-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '0.75rem',
            }}
          >
            Votre numéro de dossier / Your file number
          </p>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '4rem',
              fontWeight: 700,
              color: 'var(--color-primary)',
              letterSpacing: '0.18em',
              lineHeight: 1,
              marginBottom: '1.25rem',
            }}
          >
            {displayPin}
          </p>
          <p
            style={{
              fontSize: '0.95rem',
              color: 'var(--color-text)',
              lineHeight: 1.65,
            }}
          >
            Gardez ce numéro — votre clinique l&apos;utilisera pour retrouver votre dossier.
          </p>
          <p
            style={{
              fontSize: '0.85rem',
              color: 'var(--color-muted)',
              lineHeight: 1.5,
              marginTop: '0.35rem',
            }}
          >
            Keep this number — your clinic will use it to find your file.
          </p>
        </div>

        {/* Assigned clinic */}
        {selectedClinic && (
          <div
            style={{
              background: 'rgba(13, 92, 58, 0.05)',
              border: '1px solid rgba(13, 92, 58, 0.18)',
              borderRadius: 'var(--radius-card)',
              padding: '1rem 1.25rem',
              width: '100%',
              textAlign: 'left',
            }}
          >
            <p
              style={{
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--color-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.35rem',
              }}
            >
              Clinique assignée / Assigned clinic
            </p>
            <p
              style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: 'var(--color-text)',
              }}
            >
              {selectedClinic}
            </p>
          </div>
        )}
      </div>
    )
  }

  // ── Contact form ───────────────────────────────────────────────────────────────
  const inputStyle = {
    width: '100%',
    maxWidth: 440,
    minHeight: 52,
    padding: '0 1rem',
    fontSize: '1rem',
    border: '1.5px solid var(--color-border)',
    borderRadius: 'var(--radius-btn)',
    background: 'var(--color-bg)',
    fontFamily: 'var(--font-ui)',
    boxSizing: 'border-box',
    display: 'block',
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '3rem 1.5rem 9rem',
      }}
    >
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.75rem',
          fontWeight: 600,
          color: 'var(--color-text)',
          textAlign: 'center',
          marginBottom: '0.5rem',
          maxWidth: 480,
          lineHeight: 1.3,
        }}
      >
        Comment vous rejoindre ?
      </h1>
      <p
        style={{
          fontSize: '0.95rem',
          color: 'var(--color-muted)',
          textAlign: 'center',
          marginBottom: '0.3rem',
        }}
      >
        How can we reach you?
      </p>
      <p
        style={{
          fontSize: '0.875rem',
          color: 'var(--color-muted)',
          textAlign: 'center',
          marginBottom: '2.5rem',
          maxWidth: 400,
          lineHeight: 1.6,
        }}
      >
        Cette information sera partagée uniquement avec votre clinique.
        <span style={{ display: 'block', fontSize: '0.82rem', marginTop: '0.2rem' }}>
          This will only be shared with your clinic.
        </span>
      </p>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          width: '100%',
          alignItems: 'center',
        }}
      >
        {METHODS.map((m) => {
          const active = selected.has(m.id)
          return (
            <div
              key={m.id}
              style={{ width: '100%', maxWidth: 440, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
            >
              <button
                onClick={() => toggle(m.id)}
                style={{
                  width: '100%',
                  minHeight: 64,
                  background: active ? 'rgba(13, 92, 58, 0.06)' : 'var(--color-card)',
                  border: `2px solid ${active ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  borderRadius: 'var(--radius-btn)',
                  fontSize: '1.1rem',
                  fontWeight: 500,
                  color: active ? 'var(--color-primary)' : 'var(--color-text)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  padding: '0 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.875rem',
                  transition: 'border-color 150ms ease, background 150ms ease, color 150ms ease',
                }}
              >
                <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>{METHOD_ICONS[m.id]}</span>
                <span>
                  {m.labelFr}
                  {m.labelFr !== m.labelEn && (
                    <span style={{ color: 'var(--color-muted)', fontWeight: 400, fontSize: '0.9rem' }}>
                      {' / '}{m.labelEn}
                    </span>
                  )}
                </span>
              </button>

              {active && (
                <input
                  type={m.type}
                  value={values[m.id]}
                  onChange={(e) => setValue(m.id, e.target.value)}
                  placeholder={`${m.placeholderFr} / ${m.placeholderEn}`}
                  style={inputStyle}
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus={m.id === 'email'}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Fixed submit */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'var(--color-card)',
          borderTop: '1px solid var(--color-border)',
          padding: '1rem 1.25rem',
          zIndex: 100,
        }}
      >
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          style={{
            width: '100%',
            maxWidth: 440,
            display: 'block',
            margin: '0 auto',
            minHeight: 56,
            background: canSubmit ? 'var(--color-primary)' : 'var(--color-border)',
            color: canSubmit ? '#fff' : 'var(--color-muted)',
            border: 'none',
            borderRadius: 'var(--radius-btn)',
            fontSize: '1.125rem',
            fontWeight: 600,
            cursor: canSubmit ? 'pointer' : 'default',
            transition: 'background 150ms ease, color 150ms ease',
          }}
        >
          Soumettre / Submit
        </button>
      </div>
    </div>
  )
}
