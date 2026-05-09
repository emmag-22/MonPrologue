/**
 * Claude API client for BOC narrative generation.
 *
 * Takes the structured dossier from the OpenJustice reasoning flow
 * and generates a draft Basis of Claim narrative in two versions:
 *   1. Seeker version — plain language, warm, encouraging
 *   2. Clinic version — IRB format, legally structured, ready to edit
 */

const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY
const MODEL = 'claude-sonnet-4-20250514'

/**
 * Generate a draft BOC narrative from the OpenJustice dossier and seeker intake.
 *
 * @param {import('./openjustice').SeekerIntake} intake — raw seeker inputs
 * @param {import('./openjustice').FlowDossier} dossier — OpenJustice analysis
 * @returns {Promise<{ seekerVersion: string, clinicVersion: string }>}
 */
export async function generateBOCNarrative(intake, dossier) {
  const systemPrompt = `You are a legal writing assistant helping prepare Basis of Claim (BOC) narratives for refugee claimants in Canada. You work alongside legal professionals at Quebec legal aid clinics.

You will receive:
1. Structured intake data from an asylum seeker
2. A legal analysis from the OpenJustice reasoning flow (Convention ground mapping, coherence flags, IFA assessment, claim strength)

Your task is to generate TWO versions of a BOC narrative:

**SEEKER VERSION:**
- Written in plain, warm language at a grade 6 reading level
- In the claimant's voice ("I left my country because...")
- No legal jargon
- Encouraging tone — this is their story, told back to them clearly
- In the language they used during intake

**CLINIC VERSION:**
- Written in proper IRB BOC format
- Structured to address the Convention refugee ground identified
- Addresses state protection and Internal Flight Alternative
- Flags areas that need strengthening (based on coherence analysis)
- Professional legal register
- In English (standard for IRB submissions in Quebec)

CRITICAL RULES:
- Never assess credibility or truthfulness
- Never fabricate details not present in the intake
- Flag gaps rather than filling them
- Narrative gaps may reflect trauma — note them respectfully
- Include the standard disclaimer about legal review required`

  const userPrompt = `## Seeker Intake Data

Country of origin: ${intake.country}
Claimed persecution ground: ${intake.ground}
Narrative: ${intake.narrative}
Timeline: ${intake.timeline}
State protection: ${intake.stateProtection}
Internal flight alternative: ${intake.internalFlight}
Time in Canada: ${intake.timeInCanada}
Sex: ${intake.sex}
Age group: ${intake.ageGroup}

## OpenJustice Legal Analysis

${dossier.rawOutput}

---

Please generate both the SEEKER VERSION and CLINIC VERSION of the BOC narrative. Separate them clearly with headers.`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Claude API error (${response.status}): ${errorText}`)
  }

  const data = await response.json()
  const fullText = data.content[0].text

  // Split the response into seeker and clinic versions
  return parseBOCResponse(fullText)
}

/**
 * Parse Claude's response into seeker and clinic versions.
 */
function parseBOCResponse(text) {
  const clinicMarkers = ['CLINIC VERSION', 'LEGAL VERSION', 'IRB VERSION', '## Clinic', '## Legal']
  let splitIndex = -1

  for (const marker of clinicMarkers) {
    const idx = text.indexOf(marker)
    if (idx !== -1) {
      splitIndex = idx
      break
    }
  }

  if (splitIndex === -1) {
    // Couldn't split — return full text as both
    return { seekerVersion: text, clinicVersion: text }
  }

  return {
    seekerVersion: text.substring(0, splitIndex).trim(),
    clinicVersion: text.substring(splitIndex).trim(),
  }
}
