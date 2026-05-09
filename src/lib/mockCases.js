export const mockCases = [
  {
    id: '4821-QC',
    sessionId: '#4821-QC',
    country: 'Haiti',
    countryFlag: '🇭🇹',
    legalCategory: 'Section 96 — Refugee',
    claimStrength: 'Strong',
    detailTag: 'Explicit threat',
    filedDate: '2026-01-15',
    hearingDate: '2026-05-12',
    status: 'open',
  },
  {
    id: '3294-QC',
    sessionId: '#3294-QC',
    country: 'Democratic Republic of Congo',
    countryFlag: '🇨🇩',
    legalCategory: 'Section 97 — Person in Need of Protection',
    claimStrength: 'Moderate',
    detailTag: 'Minor claimant',
    filedDate: '2026-04-01',
    hearingDate: null,
    status: 'open',
  },
  {
    id: '5517-QC',
    sessionId: '#5517-QC',
    country: 'Mexico',
    countryFlag: '🇲🇽',
    legalCategory: 'Both 96 & 97',
    claimStrength: 'Moderate-Strong',
    detailTag: 'IFA unaddressed',
    filedDate: '2026-02-20',
    hearingDate: '2026-05-24',
    status: 'working',
  },
  {
    id: '2083-QC',
    sessionId: '#2083-QC',
    country: 'Honduras',
    countryFlag: '🇭🇳',
    legalCategory: 'Section 97 — Medical Ineligible',
    claimStrength: 'Weak',
    detailTag: 's.97 Ineligible — Medical',
    filedDate: '2025-10-01',
    hearingDate: null,
    status: 'open',
  },
  {
    id: '6142-QC',
    sessionId: '#6142-QC',
    country: 'Colombia',
    countryFlag: '🇨🇴',
    legalCategory: 'Section 96 — Refugee',
    claimStrength: 'Moderate',
    detailTag: 'State actor',
    filedDate: '2026-02-10',
    hearingDate: '2026-06-23',
    status: 'working',
  },
  {
    id: '7756-QC',
    sessionId: '#7756-QC',
    country: 'Nigeria',
    countryFlag: '🇳🇬',
    legalCategory: 'Both 96 & 97',
    claimStrength: 'Moderate-Strong',
    detailTag: 'IFA unaddressed',
    filedDate: '2026-01-10',
    hearingDate: null,
    status: 'working',
  },
  {
    id: '1908-QC',
    sessionId: '#1908-QC',
    country: 'Venezuela',
    countryFlag: '🇻🇪',
    legalCategory: 'Section 97 — Person in Need of Protection',
    claimStrength: 'Strong',
    detailTag: 'State actor',
    filedDate: '2026-04-09',
    hearingDate: null,
    status: 'open',
  },
  {
    id: '8430-QC',
    sessionId: '#8430-QC',
    country: 'Guatemala',
    countryFlag: '🇬🇹',
    legalCategory: 'Section 96 — Refugee',
    claimStrength: 'Moderate',
    detailTag: 'IFA unaddressed',
    filedDate: '2026-03-09',
    hearingDate: null,
    status: 'archived',
  },
]

// ── Generate mock dossier data for a case ──
const GROUND_MAP = {
  'Section 96 — Refugee': 'political_opinion',
  'Section 97 — Person in Need of Protection': 'particular_social_group',
  'Both 96 & 97': 'political_opinion',
  'Section 97 — Medical Ineligible': 'particular_social_group',
}

export function getMockDossierForCase(caseObj) {
  if (!caseObj) return getMockDossierForCase({ country: 'Unknown', claimStrength: 'Moderate', legalCategory: 'Section 96 — Refugee', detailTag: '' })

  const ground = GROUND_MAP[caseObj.legalCategory] || 'political_opinion'
  const isStrong = caseObj.claimStrength === 'Strong' || caseObj.claimStrength === 'Moderate-Strong'
  const hasIFA = caseObj.detailTag?.includes('IFA')

  return {
    conventionGround: {
      primary: ground,
      analysis: `The claimant from ${caseObj.country} presents a claim grounded in ${ground.replace(/_/g, ' ')} under IRPA s.96. The described pattern of persecution is consistent with documented country conditions. ${isStrong ? 'The claim presents strong prima facie elements.' : 'Additional documentation would strengthen the claim.'}`,
      irpaSections: caseObj.legalCategory.includes('97') ? ['s.96', 's.97(1)', 's.97(1)(a)'] : ['s.96'],
      strength: isStrong ? 'strong' : 'moderate',
    },
    claimStrength: caseObj.claimStrength,
    coherenceFlags: [
      { area: 'Timeline specificity', detail: 'Can the claimant provide more precise dates for the key persecution events described in the narrative?', irpaRelevance: 'Precise timelines strengthen the narrative coherence assessment under s.96.' },
      { area: 'Persecutor identification', detail: 'What specific role or capacity did the persecutor(s) hold? Were they state actors, agents of the state, or non-state actors?', irpaRelevance: 'The distinction between state and non-state actors affects the state protection analysis.' },
      ...(hasIFA ? [{ area: 'Internal Flight Alternative', detail: 'Why was relocation within the country not a viable safety option? What specific risks would the claimant face in other regions?', irpaRelevance: 'The IRB will assess whether a viable IFA exists. This must be explicitly rebutted.' }] : []),
      { area: 'State protection', detail: 'What specific steps were taken to seek protection from state authorities, and what was the outcome?', irpaRelevance: 'Under s.96, the claimant must demonstrate state protection was unavailable, inadequate, or dangerous to seek.' },
      { area: 'Corroborating evidence', detail: 'Does the claimant have access to any documentation — medical records, police reports, news articles, witness statements, or photographs?', irpaRelevance: 'Documentary evidence strengthens the claim, though its absence does not preclude protection.' },
    ],
    ifaAssessment: {
      likely: true,
      addressed: !hasIFA,
      analysis: hasIFA
        ? 'The Internal Flight Alternative has not been addressed in the current narrative. The IRB is very likely to raise this issue. Counsel should prepare a detailed IFA rebuttal with country-specific evidence.'
        : 'The claimant has addressed internal relocation. The IFA analysis should be reviewed for completeness before the hearing.',
    },
    stateProtection: {
      sought: caseObj.detailTag === 'State actor' ? false : true,
      adequate: false,
      analysis: caseObj.detailTag === 'State actor'
        ? 'The persecutor is identified as a state actor, which fundamentally undermines the availability of state protection. This is a strong element of the claim under s.96.'
        : 'State protection was either not sought or was inadequate. Further detail on formal complaints or reasons for not seeking protection should be documented.',
    },
    seekerReport: {
      title: 'Your file is ready',
      summary: `We have carefully reviewed your story. Your protection claim has been analyzed and your file is ready for a legal clinic. A legal advisor will help you prepare for your hearing.`,
      nextSteps: ['Your file will be shared with a legal clinic.', 'A legal advisor will review your case.', 'Keep any documents or evidence you have.'],
      safetyMessage: 'You are safe in Canada. No one can send you back without a full hearing. You have the right to be heard.',
    },
    clinicReport: {
      conventionGroundAnalysis: `Primary ground: ${ground.replace(/_/g, ' ')} under IRPA s.96. The claimant from ${caseObj.country} describes persecution consistent with the Convention refugee definition. ${caseObj.legalCategory.includes('97') ? 'A parallel s.97(1) claim for risk to life or cruel and unusual treatment should also be considered.' : ''} The claim strength is assessed as ${caseObj.claimStrength.toLowerCase()} based on the available evidence and narrative coherence.`,
      narrativeAssessment: 'The narrative provides a substantive foundation but requires targeted supplementation in the flagged areas. Timeline gaps and state protection documentation are the primary areas for counsel attention. These gaps should be explored compassionately — they may reflect trauma, memory fragmentation, or language barriers rather than inconsistency.',
      recommendedActions: [
        'Obtain a detailed statutory declaration addressing the timeline gaps between key incidents',
        'Document state protection attempts with specificity, or explain why formal channels were unavailable or unsafe',
        hasIFA ? 'Prepare a comprehensive IFA rebuttal supported by current country condition reports' : 'Review IFA position and prepare supporting country condition evidence',
        'Identify and collect any available corroborating evidence (medical, documentary, testimonial)',
        'Review National Documentation Package for updated country conditions',
      ],
      irpaCitations: [
        's.96 — Convention refugee: well-founded fear of persecution for reasons of race, religion, nationality, membership in a particular social group, or political opinion',
        's.97(1) — Person in need of protection: risk to life, or risk of cruel and unusual treatment or punishment',
        's.97(1)(a) — Danger of torture as defined under Article 1 of the Convention Against Torture',
        's.100(1) — Referral of eligible claim to the Refugee Protection Division',
        's.170 — Proceedings before the RPD shall be conducted as informally and quickly as the circumstances and considerations of fairness and natural justice permit',
      ],
      riskLevel: isStrong ? 'low' : (caseObj.claimStrength === 'Weak' ? 'high' : 'medium'),
      estimatedProcessingNotes: `Standard RPD processing. ${caseObj.hearingDate ? 'Hearing date scheduled — prioritize BOC preparation.' : 'No hearing date yet — use this time to strengthen the file.'} ${caseObj.detailTag === 'Minor claimant' ? 'Minor claimant protocols apply — designated representative required.' : ''}`,
    },
    resources: [
      { name: 'PRAIDA', description: 'Programme régional d\'accueil et d\'intégration des demandeurs d\'asile — health and social services', contact: '514-484-7878', relevance: 'Primary social services for asylum seekers in Montreal' },
      { name: 'Aide juridique du Québec', description: 'Free legal aid for eligible asylum seekers', contact: 'www.ajquebec.qc.ca', relevance: 'Legal representation for IRB hearings' },
      { name: 'CSAI', description: 'Centre social d\'aide aux immigrants — settlement services, language classes', contact: '514-932-2953', relevance: 'Integration support while claim is pending' },
    ],
  }
}

const RED_DETAIL_TAGS = new Set([
  'Explicit threat',
  'Imminent bodily harm',
  'Physical violence',
  'Minor claimant',
])

export function getPriority(caseObj) {
  const today = Date.now()

  const daysUntilHearing = caseObj.hearingDate
    ? Math.round((new Date(caseObj.hearingDate).getTime() - today) / 86400000)
    : null

  const daysSinceFiling = Math.round(
    (today - new Date(caseObj.filedDate).getTime()) / 86400000
  )

  if (
    (daysUntilHearing !== null && daysUntilHearing <= 7) ||
    RED_DETAIL_TAGS.has(caseObj.detailTag)
  )
    return 'red'

  if (
    (daysUntilHearing !== null && daysUntilHearing <= 30) ||
    (daysUntilHearing === null && daysSinceFiling > 180)
  )
    return 'orange'

  if (
    (daysUntilHearing !== null && daysUntilHearing <= 60) ||
    (daysUntilHearing === null && daysSinceFiling > 90)
  )
    return 'yellow'

  return 'green'
}
