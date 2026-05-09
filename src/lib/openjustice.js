/**
 * OpenJustice client — calls our backend which proxies to the OpenJustice API.
 * API keys stay on the server.
 */

const API = import.meta.env.DEV ? 'http://localhost:3001' : ''

/**
 * @typedef {Object} SeekerIntake
 * @property {string} country        — Country of origin
 * @property {string} ground         — Claimed persecution ground
 * @property {string} narrative      — What happened
 * @property {string} timeline       — Key dates
 * @property {string} stateProtection — Help from authorities
 * @property {string} internalFlight — Why they couldn't relocate
 * @property {string} timeInCanada   — Duration and location
 * @property {string} sex            — Gender identity
 * @property {string} ageGroup       — Age bracket
 */

/**
 * Send intake data to the backend, which runs the OpenJustice reasoning flow.
 * Returns the structured dossier with facts, node results, and final output.
 */
export async function analyzeCase(intake) {
  const res = await fetch(`${API}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ intake }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(err.error || `Server error (${res.status})`)
  }
  return res.json()
}
