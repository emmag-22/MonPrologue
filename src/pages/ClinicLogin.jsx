import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function ClinicLogin() {
  const { t } = useApp()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: real authentication
    navigate('/clinic/dashboard')
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 60px)',
        padding: '2rem 1.5rem',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: 440,
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-card)',
          padding: '2.5rem 2rem',
        }}
      >
        <h1
          style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            marginBottom: '1.75rem',
            lineHeight: 1.4,
          }}
        >
          {t('clinic.login.heading')}
        </h1>

        <label
          style={{
            display: 'block',
            fontSize: '0.85rem',
            fontWeight: 500,
            marginBottom: '0.4rem',
            color: 'var(--color-text)',
          }}
        >
          {t('clinic.login.email')}
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-label={t('clinic.login.email')}
          style={{
            width: '100%',
            padding: '0.65rem 0.75rem',
            border: '1.5px solid var(--color-border)',
            borderRadius: 'var(--radius-btn)',
            fontSize: '0.95rem',
            marginBottom: '1rem',
            background: 'var(--color-bg)',
          }}
        />

        <label
          style={{
            display: 'block',
            fontSize: '0.85rem',
            fontWeight: 500,
            marginBottom: '0.4rem',
            color: 'var(--color-text)',
          }}
        >
          {t('clinic.login.password')}
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          aria-label={t('clinic.login.password')}
          style={{
            width: '100%',
            padding: '0.65rem 0.75rem',
            border: '1.5px solid var(--color-border)',
            borderRadius: 'var(--radius-btn)',
            fontSize: '0.95rem',
            marginBottom: '1.5rem',
            background: 'var(--color-bg)',
          }}
        />

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '0.7rem',
            background: 'var(--color-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-btn)',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            marginBottom: '1.25rem',
            minHeight: 44,
          }}
        >
          {t('clinic.login.submit')}
        </button>

        <p
          style={{
            fontSize: '0.8rem',
            color: 'var(--color-muted)',
            textAlign: 'center',
            lineHeight: 1.5,
          }}
        >
          {t('clinic.login.hint')}
        </p>
      </form>
    </div>
  )
}
