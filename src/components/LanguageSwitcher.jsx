import { useState, useEffect, useRef } from 'react'
import { useApp } from '../context/AppContext'

const LANGUAGES = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'ar', label: 'العربية' },
  { code: 'pt', label: 'Português' },
  { code: 'ht', label: 'Kreyòl ayisyen' },
  { code: 'so', label: 'Soomaali' },
  { code: 'ti', label: 'ትግርኛ' },
  { code: 'am', label: 'አማርኛ' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'ur', label: 'اردو' },
  { code: 'tr', label: 'Türkçe' },
  { code: 'fa', label: 'فارسی' },
  { code: 'ru', label: 'Русский' },
  { code: 'uk', label: 'Українська' },
  { code: 'ro', label: 'Română' },
  { code: 'sw', label: 'Kiswahili' },
  { code: 'wo', label: 'Wolof' },
  { code: 'zh', label: '中文' },
]

export default function LanguageSwitcher({ containerStyle }) {
  const { language, setLanguage } = useApp()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const handle = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  const current = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0]

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        zIndex: 200,
        ...containerStyle,
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Change language"
        aria-expanded={open}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          padding: '0.5rem 0.75rem',
          background: 'var(--color-card)',
          border: '1.5px solid var(--color-border)',
          borderRadius: 999,
          fontSize: '0.85rem',
          fontWeight: 500,
          color: 'var(--color-text)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          cursor: 'pointer',
          minHeight: 40,
          whiteSpace: 'nowrap',
        }}
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          style={{ flexShrink: 0 }}
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 010 20" />
          <path d="M12 2a15.3 15.3 0 000 20" />
        </svg>
        {current.label}
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 0.4rem)',
            right: 0,
            background: 'var(--color-card)',
            border: '1.5px solid var(--color-border)',
            borderRadius: 'var(--radius-card)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            width: 200,
            maxHeight: 360,
            overflowY: 'auto',
            padding: '0.4rem',
          }}
        >
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { setLanguage(lang.code); setOpen(false) }}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '0.5rem 0.75rem',
                borderRadius: 6,
                fontSize: '0.9rem',
                fontWeight: language === lang.code ? 600 : 400,
                color: language === lang.code ? 'var(--color-primary)' : 'var(--color-text)',
                background: language === lang.code ? '#F0F5F2' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                minHeight: 36,
              }}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
