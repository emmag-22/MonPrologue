import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import styles from './Landing.module.css'

const languages = [
  { code: 'fr', flag: '🇫🇷', label: 'Français' },
  { code: 'en', flag: '🇨🇦', label: 'English' },
  { code: 'es', flag: '🇪🇸', label: 'Español' },
  { code: 'ht', flag: '🇭🇹', label: 'Kreyòl' },
]

function HouseIcon() {
  return (
    <svg className={styles.cardIcon} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 24L24 8L42 24" />
      <path d="M12 22V40H36V22" />
      <rect x="20" y="28" width="8" height="12" />
    </svg>
  )
}

function BriefcaseIcon() {
  return (
    <svg className={styles.cardIcon} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="6" y="16" width="36" height="24" rx="3" />
      <path d="M16 16V12C16 9.8 17.8 8 20 8H28C30.2 8 32 9.8 32 12V16" />
      <path d="M6 26H42" />
    </svg>
  )
}

export default function Landing() {
  const { language, setLanguage, setRole, t } = useApp()
  const navigate = useNavigate()

  const handleSeeker = () => {
    setRole('seeker')
    navigate('/seeker')
  }

  const handleClinic = () => {
    setRole('clinic')
    navigate('/clinic')
  }

  return (
    <div className={styles.container}>
      {/* Language selector */}
      <nav className={styles.langBar} aria-label="Language selection">
        {languages.map((lang) => (
          <button
            key={lang.code}
            className={`${styles.langBtn} ${language === lang.code ? styles.langBtnActive : ''}`}
            onClick={() => setLanguage(lang.code)}
            aria-pressed={language === lang.code}
            aria-label={`${lang.label}`}
          >
            <span aria-hidden="true">{lang.flag}</span>
            {lang.label}
          </button>
        ))}
        <button
          className={styles.langBtn}
          onClick={() => alert('More languages coming soon')}
          aria-label="More languages"
        >
          🌐 More...
        </button>
      </nav>

      {/* App identity */}
      <div className={styles.identity}>
        <h1 className={styles.appName}>Refuge</h1>
        <p className={styles.tagline}>{t('landing.tagline')}</p>
        <p className={styles.disclaimer}>{t('landing.disclaimer')}</p>
      </div>

      {/* Role cards */}
      <div className={styles.cards}>
        <button
          className={styles.card}
          onClick={handleSeeker}
          aria-label={t('landing.seeker.title')}
        >
          <HouseIcon />
          <span className={styles.cardTitle}>{t('landing.seeker.title')}</span>
          <span className={styles.cardSubtitle}>{t('landing.seeker.subtitle')}</span>
        </button>

        <button
          className={styles.card}
          onClick={handleClinic}
          aria-label={t('landing.clinic.title')}
        >
          <BriefcaseIcon />
          <span className={styles.cardTitle}>{t('landing.clinic.title')}</span>
          <span className={styles.cardSubtitle}>{t('landing.clinic.subtitle')}</span>
        </button>
      </div>
    </div>
  )
}
