import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

const CLINICS = [
  'Le Collectif Bienvenue',
  'The Refugee Centre',
  'Clinique pour la justice migrante',
  'Just Solutions Legal Clinic',
  'PRAIDA',
  'Head and Hands',
  'Clinique juridique du Grand Montréal',
  'Action Réfugiés Montréal',
  "Maison d'Haïti",
  "Bienvenue à l'immigrant",
  'Table de concertation des organismes au service des personnes réfugiées et immigrantes',
  'Canadian Council for Refugees',
  'Conseil canadien pour les réfugiés',
  'Legal Aid Ontario – Refugee Law Services',
  'FCJ Refugee Centre',
  'Neighbourhood Legal Services',
  'Parkdale Community Legal Services',
  'MOSAIC',
  'Inasmuch Community Society',
  'Matthew House Refugee Services',
]

export default function SeekerClinicSelect() {
  const { setSelectedClinic, setSessionPin, t } = useApp()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [hovered, setHovered] = useState(null)

  const filtered = search.trim()
    ? CLINICS.filter(c => c.toLowerCase().includes(search.toLowerCase()))
    : CLINICS

  const proceed = (clinic) => {
    setSelectedClinic(clinic)
    const pin = String(Math.floor(100000 + Math.random() * 900000))
    setSessionPin(pin)
    navigate('/seeker/pin')
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '3.5rem 1.5rem 6rem',
      }}
    >
      {/* Building icon */}
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: 'var(--color-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.75rem',
        }}
      >
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
          <rect x="4" y="13" width="26" height="17" rx="1" stroke="white" strokeWidth="2" />
          <path d="M2 13L17 3L32 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="13" y="21" width="8" height="9" rx="1" fill="white" opacity="0.35" />
          <rect x="7" y="16" width="4" height="4" rx="0.5" fill="white" opacity="0.35" />
          <rect x="23" y="16" width="4" height="4" rx="0.5" fill="white" opacity="0.35" />
        </svg>
      </div>

      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.75rem',
          fontWeight: 600,
          color: 'var(--color-text)',
          textAlign: 'center',
          marginBottom: '2rem',
          maxWidth: 500,
          lineHeight: 1.3,
        }}
      >
        {t('clinic.select.title')}
      </h1>

      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder={t('clinic.select.search')}
        aria-label={t('clinic.select.search')}
        style={{
          width: '100%',
          maxWidth: 480,
          height: 52,
          padding: '0 1rem',
          border: '1.5px solid var(--color-border)',
          borderRadius: 'var(--radius-btn)',
          fontSize: '1rem',
          background: 'var(--color-card)',
          color: 'var(--color-text)',
          marginBottom: '0.75rem',
          outline: 'none',
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: 480,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          marginBottom: '1.25rem',
        }}
      >
        {filtered.map(clinic => (
          <button
            key={clinic}
            onClick={() => proceed(clinic)}
            onMouseEnter={() => setHovered(clinic)}
            onMouseLeave={() => setHovered(null)}
            style={{
              width: '100%',
              minHeight: 52,
              padding: '0.75rem 1rem',
              background: hovered === clinic ? 'rgba(13, 92, 58, 0.04)' : 'var(--color-card)',
              border: `1.5px solid ${hovered === clinic ? 'var(--color-primary)' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-btn)',
              fontSize: '0.975rem',
              fontWeight: 500,
              color: 'var(--color-text)',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'border-color 140ms ease, background 140ms ease',
              lineHeight: 1.4,
            }}
          >
            {clinic}
          </button>
        ))}

        {filtered.length === 0 && (
          <p
            style={{
              color: 'var(--color-muted)',
              textAlign: 'center',
              padding: '1rem 0',
              fontSize: '0.95rem',
            }}
          >
            {t('clinic.select.no-results')}
          </p>
        )}
      </div>

      <div
        style={{
          width: '100%',
          maxWidth: 480,
          height: 1,
          background: 'var(--color-border)',
          marginBottom: '0.75rem',
        }}
      />

      <button
        onClick={() => proceed(null)}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'var(--color-secondary)'
          e.currentTarget.style.color = 'var(--color-text)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'var(--color-border)'
          e.currentTarget.style.color = 'var(--color-muted)'
        }}
        style={{
          width: '100%',
          maxWidth: 480,
          minHeight: 52,
          padding: '0.75rem 1rem',
          background: 'none',
          border: '1.5px dashed var(--color-border)',
          borderRadius: 'var(--radius-btn)',
          fontSize: '0.95rem',
          fontWeight: 500,
          color: 'var(--color-muted)',
          textAlign: 'left',
          cursor: 'pointer',
          transition: 'border-color 140ms ease, color 140ms ease',
        }}
      >
        {t('clinic.select.unknown')}
      </button>
    </div>
  )
}
