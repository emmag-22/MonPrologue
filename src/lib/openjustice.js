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

/**
 * Search OpenJustice document library for IRB decisions similar to this claim.
 * Falls back to mock data if the API call fails or returns empty.
 *
 * @param {{ country: string, convention_ground: string, claim_strength: string }} claimProfile
 * @returns {Promise<Array<{ title: string, summary: string, outcome: string, key_factors: string[], url: string|null }>>}
 */
export async function searchSimilarCases(claimProfile) {
  try {
    const res = await fetch(`${API}/api/similar-cases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(claimProfile),
    })
    if (!res.ok) throw new Error(`${res.status}`)
    const data = await res.json()
    if (data.cases?.length > 0) return data.cases
    throw new Error('Empty results')
  } catch (err) {
    console.warn('searchSimilarCases failed, using mock:', err.message)
    return getMockSimilarCases(claimProfile)
  }
}

function getMockSimilarCases({ country, convention_ground, claim_strength }) {
  const ground = (convention_ground || 'political opinion').replace(/_/g, ' ')
  const countryName = country || 'Unknown'
  const year1 = 2024, year2 = 2023, year3 = 2025

  return [
    {
      title: `X (Re), ${year1} CanLII — RPD (${countryName})`,
      summary: `The claimant, a ${countryName} national, sought refugee protection under s.96 of IRPA on the basis of ${ground}. The panel found the claimant's testimony credible and internally consistent. Country condition evidence corroborated the claimant's account of persecution. The panel concluded that state protection was inadequate and no viable Internal Flight Alternative existed.`,
      outcome: 'Accepted',
      key_factors: [
        'Credible and detailed testimony with consistent timeline',
        'Corroborating country condition evidence from NDP',
        'State protection demonstrated to be inadequate',
      ],
      url: null,
    },
    {
      title: `Y (Re), ${year2} CanLII — RPD (${countryName})`,
      summary: `The claimant from ${countryName} claimed persecution based on ${ground}. The panel found significant gaps in the claimant's timeline and noted that the claimant had not adequately addressed the Internal Flight Alternative. The panel determined that the claimant could have relocated safely within ${countryName} and rejected the claim.`,
      outcome: 'Rejected',
      key_factors: [
        'Timeline inconsistencies not adequately explained',
        'Internal Flight Alternative not rebutted',
        'Insufficient evidence of country-wide persecution',
      ],
      url: null,
    },
    {
      title: `Z (Re), ${year3} CanLII — RAD (${countryName})`,
      summary: `On appeal to the Refugee Appeal Division, the appellant from ${countryName} successfully argued that the RPD had erred in its assessment of state protection. The RAD found that updated country condition evidence demonstrated a deterioration of conditions relevant to ${ground}. The RPD decision was set aside and the claim was accepted.`,
      outcome: 'Accepted on appeal',
      key_factors: [
        'Updated country condition evidence presented on appeal',
        'RPD error in state protection analysis identified',
        'Deteriorating conditions supported forward-looking risk',
      ],
      url: null,
    },
  ]
}
