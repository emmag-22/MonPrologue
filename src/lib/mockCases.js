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
    clinicReport: (() => {
      const filed = new Date(caseObj.filedDate || '2026-01-15')
      const now = new Date()
      const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r }
      const daysUntil = (d) => Math.round((d.getTime() - now.getTime()) / 86400000)
      const fmt = (d) => d.toISOString().split('T')[0]
      const eligDate = addDays(filed, 3)
      const bocDate = addDays(eligDate, 15)
      const hearingEst = caseObj.hearingDate ? new Date(caseObj.hearingDate) : addDays(filed, 120)
      const discDate = addDays(hearingEst, -10)
      const caseId = `REF-2026-${caseObj.id?.replace('-QC', '') || '0000'}`

      return {
        caseId,
        priority: daysUntil(bocDate) < 7 ? 'URGENT' : (daysUntil(bocDate) < 30 || caseObj.detailTag === 'Explicit threat' || caseObj.detailTag === 'Minor claimant') ? 'HIGH' : 'NORMAL',
        currentStatus: caseObj.hearingDate ? 'Pre-hearing preparation' : daysUntil(bocDate) > 0 ? 'Awaiting BOC submission' : 'BOC deadline passed — expedite',
        narrativeSummary: `The claimant is a national of ${caseObj.country} who seeks refugee protection on the basis of ${ground.replace(/_/g, ' ')}. ${caseObj.detailTag === 'State actor' ? 'The alleged persecutor has been identified as a state actor, which is a significant element strengthening the claim.' : `The claimant reports ${caseObj.detailTag?.toLowerCase() || 'persecution'} in their country of origin.`} The claimant entered Canada and has been residing in Quebec. ${hasIFA ? 'The Internal Flight Alternative has not been addressed in the current narrative and the IRB is likely to raise this issue.' : 'The claimant has addressed the Internal Flight Alternative.'} State protection ${caseObj.detailTag === 'State actor' ? 'is fundamentally compromised given the involvement of state actors' : 'was either not sought or was inadequate'}. The claim strength is assessed as ${caseObj.claimStrength}.`,
        timelineEvents: [
          { date: fmt(addDays(filed, -365)), event: 'First persecution incident reported by claimant', type: 'persecution' },
          { date: fmt(addDays(filed, -180)), event: 'Escalation — direct threats to claimant and family', type: 'persecution' },
          { date: fmt(addDays(filed, -90)), event: `Departed ${caseObj.country}`, type: 'travel' },
          { date: fmt(addDays(filed, -30)), event: 'Transit through third country', type: 'travel' },
          { date: fmt(filed), event: 'Arrived in Canada — asylum claim filed', type: 'canada' },
          { date: fmt(eligDate), event: 'Eligibility interview (estimated)', type: 'canada' },
          { date: fmt(bocDate), event: 'BOC form deadline', type: 'canada' },
          ...(caseObj.hearingDate ? [{ date: caseObj.hearingDate, event: 'RPD hearing scheduled', type: 'canada' }] : []),
        ],
        geopoliticalContext: {
          summary: `${caseObj.country} continues to face significant human rights challenges relevant to claims based on ${ground.replace(/_/g, ' ')}. International monitoring organizations have documented systematic patterns of persecution, including restrictions on civil liberties, extrajudicial actions by security forces, and inadequate state protection for vulnerable populations.\n\nRecent developments (2024-2026) indicate that conditions have not substantially improved. ${caseObj.detailTag === 'State actor' ? 'Reports of state-sponsored persecution remain a primary concern, with multiple documented cases of political dissidents and civil society members facing harassment, detention, and violence.' : 'Non-state actors continue to operate with impunity in several regions, and the state\'s capacity to provide adequate protection remains limited.'} The current National Documentation Package should be reviewed for the most recent country condition evidence.`,
          sources: [
            { name: 'Amnesty International — Annual Report', url: `https://www.amnesty.org/en/location/${caseObj.country.toLowerCase().replace(/\s+/g, '-')}/report/`, relevance_note: `Comprehensive human rights assessment for ${caseObj.country}`, year: 2025 },
            { name: 'Human Rights Watch — World Report', url: `https://www.hrw.org/world-report/2025/country-chapters/${caseObj.country.toLowerCase().replace(/\s+/g, '-')}`, relevance_note: `Detailed documentation of human rights violations in ${caseObj.country}`, year: 2025 },
            { name: 'UNHCR Refworld', url: `https://www.refworld.org/country/${caseObj.country.toLowerCase().replace(/\s+/g, '')}`, relevance_note: 'Refugee-specific country guidance and COI', year: 2025 },
            { name: 'US State Dept — Human Rights Report', url: 'https://www.state.gov/reports-bureau-of-democracy-human-rights-and-labor/country-reports-on-human-rights-practices/', relevance_note: `US government assessment of ${caseObj.country}`, year: 2024 },
            { name: 'Freedom House', url: `https://freedomhouse.org/country/${caseObj.country.toLowerCase().replace(/\s+/g, '-')}`, relevance_note: 'Political rights and civil liberties index', year: 2025 },
            { name: 'ECOI', url: `https://www.ecoi.net/en/countries/${caseObj.country.toLowerCase().replace(/\s+/g, '-')}/`, relevance_note: 'Aggregated country of origin information', year: 2025 },
          ],
        },
        deadlineFlags: [
          { name: 'Eligibility interview', dueDate: fmt(eligDate), daysRemaining: daysUntil(eligDate) },
          { name: 'BOC form submission', dueDate: fmt(bocDate), daysRemaining: daysUntil(bocDate) },
          { name: 'Document disclosure', dueDate: fmt(discDate), daysRemaining: daysUntil(discDate) },
          { name: caseObj.hearingDate ? 'RPD hearing' : 'Estimated hearing', dueDate: fmt(hearingEst), daysRemaining: daysUntil(hearingEst) },
        ],
        legalExclusionFlags: [
          { issue: 'Safe Third Country Agreement', severity: 'MEDIUM', irpaSection: 's.101(1)(e)', explanation: `If the claimant entered Canada from the US at a designated port of entry, the STCA may bar the claim. Exceptions include having family in Canada, being an unaccompanied minor, or holding a valid Canadian visa. Verify entry method.` },
          { issue: 'Prior claims in other countries', severity: 'LOW', irpaSection: 's.101(1)(c.1)', explanation: 'No indication of prior claims in other countries. Confirm with claimant during BOC preparation.' },
          { issue: 'Security inadmissibility screening', severity: 'LOW', irpaSection: 's.34 IRPA', explanation: 'No indicators of security-related inadmissibility identified. Standard screening applies.' },
          ...(caseObj.detailTag === 'Minor claimant' ? [{ issue: 'Minor claimant — designated representative required', severity: 'HIGH', irpaSection: 's.167(2)', explanation: 'The claimant is a minor. A designated representative must be appointed before the RPD hearing. This is a mandatory procedural requirement.' }] : []),
        ],
        narrativeFlags: [
          { issue: 'Gap between last incident and departure', phase: 0, answerId: 'p0-5', quote: 'Timeline indicates a gap between the last persecution event and departure from country of origin.' },
          { issue: 'State protection claim needs detail', phase: 0, answerId: 'p0-6', quote: 'The claimant\'s account of state protection attempts lacks specificity regarding formal complaints or police reports.' },
          ...(hasIFA ? [{ issue: 'IFA not addressed', phase: 0, answerId: 'p0-7', quote: 'The Internal Flight Alternative has not been addressed. The IRB will likely raise this issue.' }] : []),
          { issue: 'Persecutor capacity unclear', phase: 1, answerId: 'p1-4', quote: 'The role, reach, and capacity of the persecutor(s) needs further clarification.' },
        ],
        conventionGroundAnalysis: `Primary ground: ${ground.replace(/_/g, ' ')} under IRPA s.96. The claimant from ${caseObj.country} describes persecution consistent with the Convention refugee definition. ${caseObj.legalCategory.includes('97') ? 'A parallel s.97(1) claim for risk to life or cruel and unusual treatment should also be considered.' : ''} The claim strength is assessed as ${caseObj.claimStrength.toLowerCase()}.`,
        narrativeAssessment: 'The narrative provides a substantive foundation but requires targeted supplementation in the flagged areas. Timeline gaps and state protection documentation are the primary areas for counsel attention. These gaps should be explored compassionately — they may reflect trauma, memory fragmentation, or language barriers.',
        recommendedActions: [
          'Obtain a detailed statutory declaration addressing timeline gaps between key incidents',
          'Document state protection attempts with specificity, or explain why formal channels were unavailable',
          hasIFA ? 'Prepare a comprehensive IFA rebuttal supported by current country condition reports' : 'Review IFA position and prepare supporting country condition evidence',
          'Identify and collect any available corroborating evidence (medical, documentary, testimonial)',
          'Review National Documentation Package for updated country conditions',
        ],
        irpaCitations: [
          's.96 — Convention refugee: well-founded fear of persecution for reasons of race, religion, nationality, membership in a particular social group, or political opinion',
          's.97(1) — Person in need of protection: risk to life, or risk of cruel and unusual treatment or punishment',
          's.97(1)(a) — Danger of torture as defined under Article 1 of the Convention Against Torture',
          's.100(1) — Referral of eligible claim to the Refugee Protection Division',
          's.170 — RPD proceedings shall be conducted informally and quickly as fairness permits',
        ],
        riskLevel: isStrong ? 'low' : (caseObj.claimStrength === 'Weak' ? 'high' : 'medium'),
        estimatedProcessingNotes: `Standard RPD processing. ${caseObj.hearingDate ? 'Hearing date scheduled — prioritize BOC preparation.' : 'No hearing date yet — use this time to strengthen the file.'} ${caseObj.detailTag === 'Minor claimant' ? 'Minor claimant protocols apply — designated representative required.' : ''}`,
      }
    })(),
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
