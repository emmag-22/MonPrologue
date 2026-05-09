import { useState, useRef } from 'react'

export default function MicButton({ onResult, lang = 'fr-FR' }) {
  const [listening, setListening] = useState(false)
  const recRef = useRef(null)

  const SpeechRecognition =
    typeof window !== 'undefined' &&
    (window.SpeechRecognition || window.webkitSpeechRecognition)

  const toggle = () => {
    if (!SpeechRecognition) {
      alert('Voice input is not supported in this browser.')
      return
    }
    if (listening) {
      recRef.current?.stop()
      return
    }
    const rec = new SpeechRecognition()
    rec.lang = lang
    rec.interimResults = false
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript
      onResult?.(transcript)
    }
    rec.onend = () => setListening(false)
    rec.onerror = () => setListening(false)
    recRef.current = rec
    rec.start()
    setListening(true)
  }

  return (
    <button
      onClick={toggle}
      aria-label={listening ? 'Stop recording' : 'Start voice input'}
      style={{
        width: 72,
        height: 72,
        borderRadius: '50%',
        background: listening ? '#C0392B' : 'var(--color-primary)',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: listening
          ? '0 0 0 8px rgba(192,57,43,0.2)'
          : '0 4px 16px rgba(13,92,58,0.25)',
        transition: 'background 200ms ease, box-shadow 200ms ease',
        cursor: 'pointer',
        animation: listening ? 'pulse 1.2s ease infinite' : 'none',
      }}
    >
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="10" y="3" width="8" height="14" rx="4" fill="white" />
        <path
          d="M5 13a9 9 0 0018 0"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line x1="14" y1="22" x2="14" y2="26" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <line x1="10" y1="26" x2="18" y2="26" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </button>
  )
}
