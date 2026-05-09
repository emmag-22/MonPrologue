import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const VALID = { estabId: 'QC-1042', employeeId: 'LP-8821', password: 'refuge2026' }

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
        minHeight: 'calc(100vh - 52px)',
        padding: '2rem 1.5rem',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: 400,
          background: 'var(--navy-mid)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        {/* Form header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <p
            style={{
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              marginBottom: '0.15rem',
            }}
          >
            CLINIQUE JURIDIQUE · LEGAL CLINIC
          </p>
          <p
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--off-white)',
              fontFamily: 'var(--font-display)',
            }}
          >
            Accès au tableau de bord
          </p>
          <p
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              marginTop: '0.1rem',
            }}
          >
            Dashboard access
          </p>
        </div>

        {/* Fields */}
        <div style={{ padding: '1.5rem' }}>
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
                fontSize: '0.78rem',
                color: 'var(--urgent-red)',
                marginBottom: '1rem',
                padding: '0.5rem 0.75rem',
                background: 'rgba(217,79,61,0.08)',
                border: '1px solid rgba(217,79,61,0.25)',
                borderRadius: 4,
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.7rem',
              background: 'var(--urgent-green)',
              color: '#071f14',
              border: 'none',
              borderRadius: 4,
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '0.02em',
              minHeight: 44,
            }}
          >
            Se connecter · Log in
          </button>
        </div>
      </form>
    </div>
  )
}

function FieldGroup({ label, sublabel, value, onChange, type = 'text', placeholder = '', autoComplete }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', marginBottom: '0.35rem' }}>
        <span style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--off-white)' }}>
          {label}
        </span>
        <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.05rem' }}>
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
          padding: '0.55rem 0.75rem',
          background: 'var(--navy)',
          border: '1px solid var(--border)',
          borderRadius: 4,
          fontSize: '0.9rem',
          color: 'var(--off-white)',
          fontFamily: 'monospace',
          letterSpacing: '0.03em',
          outline: 'none',
        }}
        onFocus={(e) => (e.target.style.borderColor = 'var(--text-muted)')}
        onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
      />
    </div>
  )
}
