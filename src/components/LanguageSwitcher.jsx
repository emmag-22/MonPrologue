import { useState, useEffect, useRef } from 'react'
import { useApp } from '../context/AppContext'

const LANGUAGES = [
  { code: 'fr',  flag: '🇫🇷', label: 'Français' },
  { code: 'en',  flag: '🇬🇧', label: 'English' },
  { code: 'es',  flag: '🇪🇸', label: 'Español' },
  { code: 'ht',  flag: '🇭🇹', label: 'Haitian Creole' },
  { code: 'ar',  flag: '🇸🇦', label: 'Arabic / العربية' },
  { code: 'pt',  flag: '🇵🇹', label: 'Português' },
  { code: 'so',  flag: '🇸🇴', label: 'Somali' },
  { code: 'ti',  flag: '🇪🇹', label: 'Tigrinya' },
  { code: 'hi',  flag: '🇮🇳', label: 'Hindi' },
  { code: 'fil', flag: '🇵🇭', label: 'Filipino' },
  { code: 'uk',  flag: '🇺🇦', label: 'Українська' },
  { code: 'fa',  flag: '🇮🇷', label: 'فارسی' },
  { code: 'zh',  flag: '🇨🇳', label: '中文' },
  { code: 'ro',  flag: '🇷🇴', label: 'Română' },
  { code: 'tr',  flag: '🇹🇷', label: 'Türkçe' },
  { code: 'bn',  flag: '🇧🇩', label: 'বাংলা' },
  { code: 'ur',  flag: '🇵🇰', label: 'اردو' },
  { code: 'sw',  flag: '🇰🇪', label: 'Swahili' },
  { code: 'wo',  flag: '🇸🇳', label: 'Wolof' },
  { code: 'ru',  flag: '🇷🇺', label: 'Русский' },
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
          gap: '0.4rem',
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
        <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>{current.flag}</span>
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
            width: 220,
            maxHeight: 360,
            overflowY: 'auto',
            padding: '0.4rem',
          }}
        >
          {LANGUAGES.map((lang) => {
            const active = language === lang.code
            return (
              <button
                key={lang.code}
                onClick={() => { setLanguage(lang.code); setOpen(false) }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 6,
                  fontSize: '0.9rem',
                  fontWeight: active ? 600 : 400,
                  color: active ? 'var(--color-primary)' : 'var(--color-text)',
                  background: active ? '#F0F5F2' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  minHeight: 38,
                }}
              >
                <span style={{ fontSize: '1.15rem', lineHeight: 1, flexShrink: 0 }}>
                  {lang.flag}
                </span>
                {lang.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
