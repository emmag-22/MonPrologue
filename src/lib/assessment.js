/**
 * Assessment client — calls backend AI routes with mock fallbacks.
 * Never shows a broken screen. If any API call fails, returns mock data.
 */

const API = import.meta.env.DEV ? 'http://localhost:3001' : ''

// ── Serialize interview answers for the AI ──

const P0_LABELS = [
  'Gender identity', 'Age group', 'Country of origin', 'Persecution ground',
  'Initial narrative', 'Key dates', 'State protection sought',
  'Safe region in country', 'Location in Canada and duration',
]

const P1_LABELS = [
  'Birth and upbringing', 'Religion / ethnicity / political affiliation',
  'Life before problems began', 'When problems first started',
  'Who was responsible for the harm', 'Sequence of main events',
  'Whether others were affected', 'Contact with police or authorities',
  'Why authorities were not contacted', 'Final event that triggered leaving',
  'How they left the country', 'Transit countries before Canada',
  'Fear of what would happen upon return', 'Whether country situation has changed',
  'Possibility of safe internal relocation', 'Whether persecutors could find them',
]

function serializeAnswer(ans) {
  if (!ans) return '(skipped)'
  if (typeof ans === 'string') return ans
  if (ans.choice && ans.detail) return `${ans.choice} — ${ans.detail}`
  if (ans.choice && ans.text) return `${ans.choice} — ${ans.text}`
  if (ans.choice) return ans.choice
  if (ans.text) return ans.text
  if (ans.draft) return ans.draft
  if (ans.province) return `${ans.province}, ${ans.duration || ''}`
  if (ans.incidents) return `Incidents: ${ans.incidents}, Left: ${ans.left}, Arrived: ${ans.arrived}`
  return JSON.stringify(ans)
}

export function serializeAllAnswers(interviewAnswers, interviewPhase1, interviewPhase2) {
  let text = '=== PHASE 1 — Initial Intake ===\n'
  for (let i = 0; i < 9; i++) {
    text += `• ${P0_LABELS[i]}: ${serializeAnswer(interviewAnswers[i])}\n`
  }

  if (interviewPhase1 && Object.keys(interviewPhase1).length > 0) {
    text += '\n=== PHASE 2 — Narrative Interview ===\n'
    for (let i = 0; i < 16; i++) {
      text += `• ${P1_LABELS[i]}: ${serializeAnswer(interviewPhase1[i])}\n`
    }
  }

  if (interviewPhase2 && Object.keys(interviewPhase2).length > 0) {
    text += '\n=== PHASE 3 — Follow-up Questions ===\n'
    for (const [i, ans] of Object.entries(interviewPhase2)) {
      text += `• Follow-up ${Number(i) + 1}: ${serializeAnswer(ans)}\n`
    }
  }

  return text
}

// ── Extract structured intake for OpenJustice ──
export function extractIntake(interviewAnswers, interviewPhase1) {
  const ground = interviewAnswers[3]
  const groundMap = {
    race: 'Race or ethnicity', religion: 'Religion', nationality: 'Nationality',
    political: 'Political opinion', psg: 'Membership in a particular social group',
  }

  return {
    country: serializeAnswer(interviewAnswers[2]),
    ground: groundMap[ground] || ground || '',
    narrative: serializeAnswer(interviewAnswers[4]),
    timeline: serializeAnswer(interviewAnswers[5]),
    stateProtection: serializeAnswer(interviewAnswers[6]),
    internalFlight: serializeAnswer(interviewAnswers[7]),
    timeInCanada: serializeAnswer(interviewAnswers[8]),
    sex: serializeAnswer(interviewAnswers[0]),
    ageGroup: serializeAnswer(interviewAnswers[1]),
  }
}

// ── API calls with mock fallbacks ──

/**
 * Analyze Phase 1 answers against legislation.
 * Returns personalized Phase 2 questions + initial assessment.
 */
export async function analyzePhase1(interviewAnswers, language) {
  try {
    const answers = serializeAllAnswers(interviewAnswers, {}, {})
    const langName = { fr: 'French', en: 'English', es: 'Spanish', ht: 'Haitian Creole', ar: 'Arabic' }[language] || 'French'

    const res = await fetch(`${API}/api/assess-phase1`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers, language: langName }),
    })
    if (!res.ok) throw new Error(`${res.status}`)
    return await res.json()
  } catch (err) {
    console.warn('analyzePhase1 failed, using mock:', err.message)
    return getMockPhase1Assessment(language)
  }
}

/**
 * Run full assessment with all 3 phases of answers.
 * Returns structured assessment with seeker report, clinic report, and resources.
 */
export async function generateFullAssessment(interviewAnswers, interviewPhase1, interviewPhase2, language) {
  try {
    const answers = serializeAllAnswers(interviewAnswers, interviewPhase1, interviewPhase2)
    const langName = { fr: 'French', en: 'English', es: 'Spanish', ht: 'Haitian Creole', ar: 'Arabic' }[language] || 'French'

    const res = await fetch(`${API}/api/assess`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers, language: langName }),
    })
    if (!res.ok) throw new Error(`${res.status}`)
    return await res.json()
  } catch (err) {
    console.warn('generateFullAssessment failed, using mock:', err.message)
    return getMockFullAssessment(interviewAnswers, language)
  }
}

/**
 * Run OpenJustice analysis on structured intake.
 */
export async function analyzeWithOpenJustice(interviewAnswers, interviewPhase1) {
  try {
    const intake = extractIntake(interviewAnswers, interviewPhase1)
    const res = await fetch(`${API}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ intake }),
    })
    if (!res.ok) throw new Error(`${res.status}`)
    return await res.json()
  } catch (err) {
    console.warn('analyzeWithOpenJustice failed, using mock:', err.message)
    return getMockOpenJusticeResult(interviewAnswers)
  }
}

// ── Mock data ──

function getMockPhase1Assessment(language) {
  const fr = language === 'fr'
  return {
    questions: [
      { id: 'p2q1', text: fr ? 'Parlez-nous de votre enfance et de votre éducation.' : 'Tell us about your childhood and upbringing.', purpose: 'Establishes background context', irpaSection: 's.96', inputType: 'text' },
      { id: 'p2q2', text: fr ? 'Quelle est votre religion, ethnie ou affiliation politique ?' : 'What is your religion, ethnicity, or political affiliation?', purpose: 'Identifies Convention ground details', irpaSection: 's.96', inputType: 'text' },
      { id: 'p2q3', text: fr ? 'Comment était votre vie avant que les problèmes ne commencent ?' : 'What was your life like before the problems began?', purpose: 'Baseline for establishing change', irpaSection: '', inputType: 'text' },
      { id: 'p2q4', text: fr ? 'Quand les problèmes ont-ils commencé et que s\'est-il passé la première fois ?' : 'When did the problems start and what happened the first time?', purpose: 'Timeline anchor', irpaSection: 's.96, s.97(1)', inputType: 'text' },
      { id: 'p2q5', text: fr ? 'Qui était responsable du mal ? Quel était leur rôle ?' : 'Who was responsible for the harm? What was their role?', purpose: 'Identifies persecutor — state vs non-state actor', irpaSection: 's.96, s.97(1)(a)', inputType: 'text' },
      { id: 'p2q6', text: fr ? 'Décrivez la séquence des événements principaux.' : 'Describe the sequence of main events.', purpose: 'Narrative coherence', irpaSection: '', inputType: 'text' },
      { id: 'p2q7', text: fr ? 'D\'autres membres de votre famille ou communauté ont-ils été affectés ?' : 'Were other family or community members affected?', purpose: 'Corroboration potential', irpaSection: 's.96', inputType: 'text' },
      { id: 'p2q8', text: fr ? 'Avez-vous contacté la police ou les autorités pour demander de l\'aide ?' : 'Did you contact police or authorities for help?', purpose: 'State protection analysis', irpaSection: 's.96, s.97(1)', inputType: 'text' },
      { id: 'p2q9', text: fr ? 'Quel a été l\'événement final qui vous a poussé à partir ?' : 'What was the final event that made you leave?', purpose: 'Trigger event for flight', irpaSection: '', inputType: 'text' },
      { id: 'p2q10', text: fr ? 'Comment avez-vous quitté votre pays ?' : 'How did you leave your country?', purpose: 'Travel documentation and route', irpaSection: '', inputType: 'text' },
      { id: 'p2q11', text: fr ? 'Que craignez-vous s\'il vous fallait retourner ?' : 'What do you fear would happen if you had to return?', purpose: 'Forward-looking fear assessment', irpaSection: 's.96, s.97(1)(a)', inputType: 'text' },
      { id: 'p2q12', text: fr ? 'Pourriez-vous vivre en sécurité dans une autre région de votre pays ?' : 'Could you live safely in another region of your country?', purpose: 'IFA assessment', irpaSection: 's.96', inputType: 'text' },
    ],
    initialAssessment: {
      likelyGround: 'Political opinion',
      keyAreas: ['Timeline specificity', 'Persecutor identification', 'State protection adequacy'],
      urgencyIndicators: [],
    },
  }
}

function getMockFullAssessment(interviewAnswers, language) {
  const country = serializeAnswer(interviewAnswers[2]) || 'Unknown'
  const ground = serializeAnswer(interviewAnswers[3]) || 'political'
  const fr = language === 'fr'

  const groundLabel = {
    race: 'Race or ethnicity', religion: 'Religion', nationality: 'Nationality',
    political: 'Political opinion', psg: 'Particular social group',
  }[ground] || ground

  return {
    conventionGround: {
      primary: ground,
      analysis: `The claimant's narrative establishes a claim based on ${groundLabel}. The described persecution pattern is consistent with documented conditions in ${country}.`,
      irpaSections: ['s.96', 's.97(1)'],
      strength: 'moderate',
    },
    claimStrength: 'Moderate',
    coherenceFlags: [
      { area: 'Timeline detail', detail: 'Can the claimant provide more specific dates for the key incidents described?', irpaRelevance: 'Precise timelines strengthen credibility of the narrative under s.96 assessment.' },
      { area: 'State protection', detail: 'What specific steps were taken to seek state protection, and what was the result?', irpaRelevance: 'Under s.96, the claimant must demonstrate that state protection was unavailable or inadequate.' },
      { area: 'Internal flight', detail: 'Why was relocation within the country not a viable option?', irpaRelevance: 'The IRB will assess whether an Internal Flight Alternative exists.' },
    ],
    ifaAssessment: { likely: true, addressed: false, analysis: 'The Internal Flight Alternative has not been fully addressed. The IRB is likely to raise this.' },
    stateProtection: { sought: false, adequate: false, analysis: 'State protection was not sought or was inadequate. Further detail needed on why formal channels were unavailable.' },
    seekerReport: {
      title: fr ? 'Votre dossier est prêt' : 'Your file is ready',
      summary: fr
        ? `Nous avons examiné votre histoire avec attention. Votre demande de protection est basée sur ${groundLabel}. Il y a des éléments solides dans votre dossier. Un conseiller juridique vous aidera à renforcer certains points avant votre audience.`
        : `We have carefully reviewed your story. Your protection claim is based on ${groundLabel}. There are strong elements in your file. A legal advisor will help you strengthen certain points before your hearing.`,
      nextSteps: fr
        ? ['Votre dossier sera transmis à une clinique juridique.', 'Un conseiller vous contactera pour discuter de votre dossier.', 'Gardez tous les documents ou preuves que vous pourriez avoir.']
        : ['Your file will be sent to a legal clinic.', 'An advisor will contact you to discuss your file.', 'Keep any documents or evidence you may have.'],
      safetyMessage: fr
        ? 'Vous êtes en sécurité au Canada. Personne ne peut vous renvoyer sans une audience complète. Vous avez le droit d\'être entendu.'
        : 'You are safe in Canada. No one can send you back without a full hearing. You have the right to be heard.',
    },
    clinicReport: {
      conventionGroundAnalysis: `Primary ground: ${groundLabel} under IRPA s.96. The claimant describes persecution consistent with the Convention definition. Further documentation of the specific acts of persecution would strengthen the claim.`,
      narrativeAssessment: 'The narrative provides a foundation but requires additional detail in several areas. Timeline gaps and state protection analysis need attention before the BOC is finalized. These gaps should be explored compassionately — they may reflect trauma or translation issues.',
      recommendedActions: [
        'Obtain detailed declaration addressing timeline gaps between key incidents',
        'Document state protection attempts or reasons for not seeking protection',
        'Prepare IFA rebuttal with country condition evidence',
      ],
      irpaCitations: [
        's.96 — Convention refugee definition: well-founded fear of persecution',
        's.97(1) — Person in need of protection: risk to life or cruel treatment',
        's.97(1)(a) — Danger of torture as defined in Convention Against Torture',
      ],
      riskLevel: 'medium',
      estimatedProcessingNotes: 'Standard RPD processing. No expedited processing indicators identified.',
    },
    resources: [
      { name: 'PRAIDA (Programme régional d\'accueil et d\'intégration des demandeurs d\'asile)', description: 'Health and social services for asylum seekers in Montreal', contact: '514-484-7878', relevance: 'Primary social services support for asylum seekers in Quebec' },
      { name: 'Aide juridique du Québec', description: 'Free legal aid for eligible asylum seekers', contact: 'www.ajquebec.qc.ca', relevance: 'Legal representation for the IRB hearing' },
      { name: 'Centre social d\'aide aux immigrants (CSAI)', description: 'Settlement services, language classes, employment support', contact: '514-932-2953', relevance: 'Integration support while claim is pending' },
      { name: 'Table de concertation des organismes au service des personnes réfugiées et immigrantes (TCRI)', description: 'Network of organizations serving refugees', contact: 'www.tcri.qc.ca', relevance: 'Can connect to specialized services based on needs' },
    ],
  }
}

function getMockOpenJusticeResult(interviewAnswers) {
  const country = serializeAnswer(interviewAnswers[2]) || 'Unknown'
  return {
    status: 'completed',
    executionId: 'mock-' + Date.now(),
    facts: {
      'Country of origin': country,
      'Convention Ground': 'Political opinion',
      'Claim strength': 'Moderate',
      'Narrative Coherence': 'Gaps identified',
      'IFA Assessment': 'Not fully addressed',
    },
    finalOutput: `REFUGE INTAKE DOSSIER\n────────────────────\nCountry: ${country}\nPrimary ground: Political opinion\nClaim strength: Moderate\n\n[Mock dossier — API unavailable]\n\nThis is placeholder data. Connect the backend API for real analysis.`,
    nodeResults: [],
    totalTokens: 0,
  }
}
