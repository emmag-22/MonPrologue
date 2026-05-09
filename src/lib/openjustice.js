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

  // Link to a real CanLII search for similar IRB decisions
  const searchQuery = encodeURIComponent(`${countryName} ${ground} refugee`)
  const searchUrl = `https://www.canlii.org/en/#search/type=decision&ccId=irb&text=${searchQuery}`

  return [
    {
      title: `Illustrative RPD decision — ${countryName} (${ground}, accepted)`,
      summary: `In comparable RPD cases involving ${countryName} nationals claiming persecution on the basis of ${ground}, panels have accepted claims where the claimant provided credible and detailed testimony with a consistent timeline, corroborated by country condition evidence from the National Documentation Package. In successful claims, the panel found state protection inadequate and no viable Internal Flight Alternative.`,
      outcome: 'Accepted',
      key_factors: [
        'Credible and detailed testimony with consistent timeline',
        'Corroborating country condition evidence from NDP',
        'State protection demonstrated to be inadequate',
      ],
      url: searchUrl,
    },
    {
      title: `Illustrative RPD decision — ${countryName} (${ground}, rejected)`,
      summary: `In comparable RPD cases where claims from ${countryName} based on ${ground} were rejected, panels identified significant gaps in the claimant's timeline that were not adequately explained. The Internal Flight Alternative was not sufficiently rebutted, and the panel determined that the claimant could have relocated safely within ${countryName}.`,
      outcome: 'Rejected',
      key_factors: [
        'Timeline inconsistencies not adequately explained',
        'Internal Flight Alternative not rebutted',
        'Insufficient evidence of country-wide persecution',
      ],
      url: searchUrl,
    },
    {
      title: `Illustrative RAD decision — ${countryName} (${ground}, overturned)`,
      summary: `In comparable RAD appeals involving ${countryName} and ${ground}, appellants have successfully argued that the RPD erred in its assessment of state protection. The RAD found that updated country condition evidence demonstrated a deterioration of conditions, and the RPD's failure to consider this evidence constituted a reviewable error. The original decision was set aside.`,
      outcome: 'Accepted on appeal',
      key_factors: [
        'Updated country condition evidence presented on appeal',
        'RPD error in state protection analysis identified',
        'Deteriorating conditions supported forward-looking risk',
      ],
      url: searchUrl,
    },
  ]
}
