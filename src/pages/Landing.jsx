import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import LanguageSwitcher from '../components/LanguageSwitcher'
import Logo from '../components/Logo'
import styles from './Landing.module.css'

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

function DoorAnimation() {
  return (
    <div className={styles.doorOverlay} aria-hidden="true">
      <div className={styles.doorRays} />
      <div className={styles.doorCenter}>
        <div className={styles.doorGlowWrap}>
          <div className={styles.doorGlow} />
          <svg
            className={styles.doorSvgAnim}
            viewBox="0 0 170 260"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line className={styles.floorLine} x1="0" y1="248" x2="170" y2="248" stroke="#1a4a2e" strokeWidth="5" strokeLinecap="round"/>
            <line className={styles.leftPost} x1="18" y1="248" x2="18" y2="125" stroke="#1a4a2e" strokeWidth="5" strokeLinecap="round"/>
            <path className={styles.archPath} d="M18 125 Q18 30 85 30 Q152 30 152 125" fill="none" stroke="#1a4a2e" strokeWidth="5" strokeLinecap="round"/>
            <line className={styles.rightPost} x1="152" y1="125" x2="152" y2="248" stroke="#1a4a2e" strokeWidth="5" strokeLinecap="round"/>
            <circle className={styles.knobCircle} cx="132" cy="178" r="6.5" fill="#1a4a2e"/>
          </svg>
        </div>
        <span className={styles.doorAnimText}>Mon Prologue</span>
      </div>
    </div>
  )
}

export default function Landing() {
  const { setRole, t } = useApp()
  const navigate = useNavigate()

  const [animDone, setAnimDone] = useState(
    () => sessionStorage.getItem('mp-intro-played') === 'true'
  )

  useEffect(() => {
    if (animDone) return
    const timer = setTimeout(() => {
      sessionStorage.setItem('mp-intro-played', 'true')
      setAnimDone(true)
    }, 4000)
    return () => clearTimeout(timer)
  }, [animDone])

  const handleSeeker = () => {
    setRole('seeker')
    navigate('/seeker/clinic-select')
  }

  const handleClinic = () => {
    setRole('clinic')
    navigate('/clinic')
  }

  return (
    <div className={styles.container}>
      {!animDone && <DoorAnimation />}

      <LanguageSwitcher />

      <div className={`${styles.identity} ${!animDone ? styles.contentAnimated : ''}`}>
        <Logo size="lg" />
        <p className={styles.tagline}>{t('landing.tagline')}</p>
        <p className={styles.disclaimer}>{t('landing.disclaimer')}</p>
      </div>

      <div className={`${styles.cards} ${!animDone ? styles.contentAnimated : ''}`}>
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
