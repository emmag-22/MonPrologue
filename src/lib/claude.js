/**
 * Claude client — calls our backend which proxies to the Anthropic API.
 * API keys stay on the server.
 */

const API = import.meta.env.DEV ? 'http://localhost:3001' : ''

/**
 * Generate follow-up questions for Phase 3 interview.
 * @param {string} context — serialized Phase 1+2 answers
 * @param {string} language — language name (e.g. "French", "English")
 * @returns {Promise<string[]>} array of question strings
 */
export async function generateQuestions(context, language) {
  const res = await fetch(`${API}/api/generate-questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ context, language }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(err.error || `Server error (${res.status})`)
  }
  const data = await res.json()
  return data.questions
}

/**
 * Generate BOC narrative from intake data and OpenJustice dossier.
 * @param {import('./openjustice').SeekerIntake} intake
 * @param {string} dossier — the finalOutput text from OpenJustice
 * @returns {Promise<{ seekerVersion: string, clinicVersion: string }>}
 */
export async function generateBOCNarrative(intake, dossier) {
  const res = await fetch(`${API}/api/generate-boc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ intake, dossier }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(err.error || `Server error (${res.status})`)
  }
  return res.json()
}
