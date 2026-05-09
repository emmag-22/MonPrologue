import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const VALID = { estabId: 'QC-1042', employeeId: 'LP-8821', password: 'monprologue2026' }

export default function ClinicLogin() {
  const { setClinicAuth } = useApp()
  const navigate = useNavigate()

  const [estab, setEstab] = useState('')
  const [employee, setEmployee] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (
      estab.trim() === VALID.estabId &&
      employee.trim() === VALID.employeeId &&
      password === VALID.password
    ) {
      setClinicAuth({ estabId: estab.trim(), employeeId: employee.trim() })
      navigate('/clinic/dashboard')
    } else {
      setError('Identifiants incorrects · Invalid credentials')
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 56px)',
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
            fontFamily: 'var(--font-display)',
            fontSize: '1.4rem',
            fontWeight: 600,
            color: 'var(--color-text)',
            marginBottom: '0.25rem',
            lineHeight: 1.3,
          }}
        >
          Accès clinique
        </h1>
        <p
          style={{
            fontSize: '0.8rem',
            color: 'var(--color-muted)',
            marginBottom: '2rem',
          }}
        >
          Legal clinic access
        </p>

        <FieldGroup
          label="Numéro d'établissement"
          sublabel="Establishment number"
          value={estab}
          onChange={setEstab}
          placeholder="QC-XXXX"
          autoComplete="organization"
        />
        <FieldGroup
          label="Numéro d'employé"
          sublabel="Employee number"
          value={employee}
          onChange={setEmployee}
          placeholder="LP-XXXX"
          autoComplete="username"
        />
        <FieldGroup
          label="Mot de passe"
          sublabel="Password"
          value={password}
          onChange={setPassword}
          type="password"
          autoComplete="current-password"
        />

        {error && (
          <p
            style={{
              fontSize: '0.8rem',
              color: 'var(--color-danger)',
              marginBottom: '1rem',
              padding: '0.6rem 0.75rem',
              background: 'rgba(192,57,43,0.06)',
              border: '1px solid rgba(192,57,43,0.2)',
              borderRadius: 'var(--radius-btn)',
            }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '0.75rem',
            background: 'var(--color-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-btn)',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            minHeight: 52,
            marginBottom: '1.25rem',
          }}
        >
          Se connecter · Log in
        </button>

        <p
          style={{
            fontSize: '0.78rem',
            color: 'var(--color-muted)',
            textAlign: 'center',
            lineHeight: 1.5,
          }}
        >
          Vous avez reçu vos identifiants de votre organisation.
          <br />
          <span style={{ fontSize: '0.72rem' }}>
            You received your credentials from your organisation.
          </span>
        </p>
      </form>
    </div>
  )
}

function FieldGroup({ label, sublabel, value, onChange, type = 'text', placeholder = '', autoComplete }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <label style={{ display: 'block', marginBottom: '0.4rem' }}>
        <span
          style={{
            display: 'block',
            fontSize: '0.85rem',
            fontWeight: 500,
            color: 'var(--color-text)',
          }}
        >
          {label}
        </span>
        <span
          style={{
            display: 'block',
            fontSize: '0.72rem',
            color: 'var(--color-muted)',
            marginTop: '0.05rem',
          }}
        >
          {sublabel}
        </span>
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
        style={{
          width: '100%',
          padding: '0.65rem 0.75rem',
          background: 'var(--color-bg)',
          border: '1.5px solid var(--color-border)',
          borderRadius: 'var(--radius-btn)',
          fontSize: '0.95rem',
          color: 'var(--color-text)',
          fontFamily: 'var(--font-ui)',
          outline: 'none',
          transition: 'border-color 0.15s',
        }}
        onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
        onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
      />
    </div>
  )
}
