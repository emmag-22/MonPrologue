import express from 'express'
import cors from 'cors'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import admin from 'firebase-admin'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ── Firebase setup ──
admin.initializeApp({ projectId: process.env.GCP_PROJECT_ID || 'dueprocessors' })
const db = admin.firestore()

const app = express()
app.use(cors())
app.use(express.json({ limit: '2mb' }))

// Serve built frontend in production
app.use(express.static(join(__dirname, 'dist')))

const PORT = process.env.PORT || 3001
const OPENJUSTICE_API_KEY = process.env.OPENJUSTICE_API_KEY
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
const OPENJUSTICE_FLOW_ID = process.env.OPENJUSTICE_FLOW_ID || '4567a9b4-ed32-4336-9bfc-af64442bf6dc'

// ── Load PDFs once at startup ──
import { readdirSync } from 'fs'
let IRPA_B64 = null
let GUIDE_B64 = null
try {
  const pdfDir = join(__dirname, 'public/pdfs')
  const files = readdirSync(pdfDir)
  const irpaFile = files.find(f => f.toLowerCase().includes('loi') || f.toLowerCase().includes('irpa') || f.toLowerCase().includes('immigration'))
  const guideFile = files.find(f => f.includes('C-2') || f.toLowerCase().includes('guide') || f.toLowerCase().includes('asylum'))
  if (irpaFile) {
    IRPA_B64 = readFileSync(join(pdfDir, irpaFile)).toString('base64')
    console.log(`Loaded IRPA PDF: ${irpaFile}`)
  } else { console.warn('IRPA PDF not found in public/pdfs/') }
  if (guideFile) {
    GUIDE_B64 = readFileSync(join(pdfDir, guideFile)).toString('base64')
    console.log(`Loaded guide PDF: ${guideFile}`)
  } else { console.warn('Guide PDF not found in public/pdfs/') }
} catch (e) { console.warn('Error loading PDFs:', e.message) }

// ── Helper: call Claude with optional PDF documents ──
async function callClaude({ system, userContent, model = 'claude-sonnet-4-6', maxTokens = 4096, includePdfs = false }) {
  // Build content blocks
  const content = []

  if (includePdfs) {
    if (IRPA_B64) {
      content.push({
        type: 'document',
        source: { type: 'base64', media_type: 'application/pdf', data: IRPA_B64 },
        title: 'Immigration and Refugee Protection Act (IRPA)',
        context: 'Canadian federal legislation governing refugee claims. Use this to cite specific IRPA sections in your analysis.',
      })
    }
    if (GUIDE_B64) {
      content.push({
        type: 'document',
        source: { type: 'base64', media_type: 'application/pdf', data: GUIDE_B64 },
        title: 'Quebec Asylum Seeker Guide',
        context: 'Quebec provincial guide for asylum seekers. Use this to identify available resources and services.',
      })
    }
  }

  // Add the text message
  if (typeof userContent === 'string') {
    content.push({ type: 'text', text: userContent })
  } else {
    content.push(...userContent)
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content }],
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Claude API error (${res.status}): ${err}`)
  }
  const data = await res.json()
  return data.content[0].text
}

// Helper: extract JSON from Claude response
function extractJSON(text) {
  const match = text.match(/```json\s*([\s\S]*?)```/) || text.match(/(\{[\s\S]*\})/) || text.match(/(\[[\s\S]*\])/)
  if (match) {
    try { return JSON.parse(match[1] || match[0]) } catch {}
  }
  try { return JSON.parse(text) } catch {}
  return null
}

// ── 1. Generate follow-up questions ──
app.post('/api/generate-questions', async (req, res) => {
  try {
    const { context, language, systemPrompt } = req.body

    // Use custom system prompt if provided (Phase 2 sends its own), otherwise default
    const system = systemPrompt || `You are a compassionate intake assistant helping an asylum seeker.
Based on their answers, generate 5-7 follow-up questions in the specified language.
Output ONLY a valid JSON array of question strings.
Example: ["Question one?", "Question two?"]`

    const text = await callClaude({
      system,
      userContent: `Please generate questions in ${language}.\n\n${context}`,
      model: 'claude-haiku-4-5-20251001',
      maxTokens: 1024,
    })

    // Parse — handle both ["string"] and [{ id, question }] formats
    const match = text.match(/\[[\s\S]*\]/)
    let questions = []
    if (match) {
      const parsed = JSON.parse(match[0])
      questions = parsed.map((q, i) => typeof q === 'string' ? q : (q.question || q))
    }
    res.json({ questions })
  } catch (err) {
    console.error('generate-questions error:', err.message)
    const status = err.message.includes('429') ? 429 : 500
    res.status(status).json({ error: err.message })
  }
})

// ── 2. Analyze case via OpenJustice ──
app.post('/api/analyze', async (req, res) => {
  try {
    const { intake } = req.body

    const message = [
      `Country: ${intake.country}`,
      `Persecution ground: ${intake.ground}`,
      `Narrative: ${intake.narrative}`,
      `Timeline: ${intake.timeline}`,
      `State protection: ${intake.stateProtection}`,
      `Internal flight alternative: ${intake.internalFlight}`,
      `Time in Canada: ${intake.timeInCanada}`,
      `Sex: ${intake.sex}`,
      `Age group: ${intake.ageGroup}`,
    ].join('\n')

    const ojRes = await fetch('https://api.openjustice.ai/dialog-flow-executions/run', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENJUSTICE_API_KEY}`,
      },
      body: JSON.stringify({
        dialogFlowId: OPENJUSTICE_FLOW_ID,
        model: 'gpt-4o-mini',
        messages: [{ content: message }],
      }),
    })

    if (!ojRes.ok) {
      const err = await ojRes.text()
      throw new Error(`OpenJustice error (${ojRes.status}): ${err}`)
    }

    const data = await ojRes.json()

    const facts = {}
    for (const [, fact] of Object.entries(data.facts || {})) {
      if (fact.label) facts[fact.label] = fact.prediction
    }

    res.json({
      status: data.status,
      executionId: data.executionId,
      facts,
      finalOutput: data.finalOutput || '',
      nodeResults: data.nodeResults,
      totalTokens: data.totalTokens,
    })
  } catch (err) {
    console.error('analyze error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ── 3. Generate BOC narrative ──
app.post('/api/generate-boc', async (req, res) => {
  try {
    const { intake, dossier } = req.body

    const system = `You are a legal writing assistant helping prepare Basis of Claim (BOC) narratives for refugee claimants in Canada. You work alongside legal professionals at Quebec legal aid clinics.

Generate TWO versions of a BOC narrative:

**SEEKER VERSION:** Plain, warm language at grade 6 reading level. In claimant's voice. No legal jargon.

**CLINIC VERSION:** Proper IRB BOC format. Addresses Convention ground, state protection, IFA. Flags areas needing strengthening.

RULES: Never assess credibility. Never fabricate details. Flag gaps rather than filling them. Narrative gaps may reflect trauma.`

    const text = await callClaude({
      system,
      userContent: `## Intake Data\nCountry: ${intake.country}\nGround: ${intake.ground}\nNarrative: ${intake.narrative}\nTimeline: ${intake.timeline}\nState protection: ${intake.stateProtection}\nIFA: ${intake.internalFlight}\nTime in Canada: ${intake.timeInCanada}\nSex: ${intake.sex}\nAge: ${intake.ageGroup}\n\n## OpenJustice Analysis\n${dossier}`,
    })

    const markers = ['CLINIC VERSION', 'LEGAL VERSION', 'IRB VERSION', '## Clinic', '## Legal']
    let splitIdx = -1
    for (const m of markers) {
      const idx = text.indexOf(m)
      if (idx !== -1) { splitIdx = idx; break }
    }

    res.json({
      seekerVersion: splitIdx > -1 ? text.substring(0, splitIdx).trim() : text,
      clinicVersion: splitIdx > -1 ? text.substring(splitIdx).trim() : text,
    })
  } catch (err) {
    console.error('generate-boc error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ── 4. Full assessment with legislation PDFs ──
app.post('/api/assess', async (req, res) => {
  try {
    const { answers, language } = req.body

    const system = `You are an expert Canadian immigration lawyer specializing in refugee protection claims under the Immigration and Refugee Protection Act (IRPA). You have been provided with:
1. The full text of the IRPA
2. The Quebec asylum seeker guide

Analyze the claimant's answers against the legislation and produce a comprehensive JSON assessment.

You MUST output ONLY valid JSON with this exact structure:
{
  "conventionGround": {
    "primary": "race|religion|nationality|political_opinion|particular_social_group",
    "analysis": "2-3 sentence explanation of why this ground applies",
    "irpaSections": ["s.96", "s.97(1)"],
    "strength": "strong|moderate|weak"
  },
  "claimStrength": "Strong|Moderate-Strong|Moderate|Weak|Insufficient",
  "coherenceFlags": [
    {
      "area": "short label (e.g. 'Timeline gap')",
      "detail": "specific question for the lawyer to explore — never a credibility judgment",
      "irpaRelevance": "why this matters under IRPA"
    }
  ],
  "ifaAssessment": {
    "likely": true|false,
    "addressed": true|false,
    "analysis": "1-2 sentences"
  },
  "stateProtection": {
    "sought": true|false,
    "adequate": true|false,
    "analysis": "1-2 sentences"
  },
  "seekerReport": {
    "title": "plain-language title in the claimant's language",
    "summary": "3-5 sentences in warm, simple language (grade 6) explaining what was found. In the claimant's language. No legal jargon. Encouraging.",
    "nextSteps": ["step 1 in plain language", "step 2", "step 3"],
    "safetyMessage": "reassuring message about their safety and rights in the claimant's language"
  },
  "clinicReport": {
    "conventionGroundAnalysis": "detailed legal analysis citing IRPA sections",
    "narrativeAssessment": "assessment of narrative completeness and coherence — flag gaps as lawyer preparation questions, NEVER as credibility concerns",
    "recommendedActions": ["action 1 for lawyer", "action 2", "action 3"],
    "irpaCitations": ["full citation with section number and relevance"],
    "riskLevel": "high|medium|low",
    "estimatedProcessingNotes": "relevant procedural notes"
  },
  "resources": [
    {
      "name": "resource name",
      "description": "what they offer",
      "contact": "phone or website if known",
      "relevance": "why this resource matches this claimant"
    }
  ]
}

CRITICAL RULES:
- All coherenceFlags must be framed as questions for the lawyer, NEVER as credibility judgments
- Narrative gaps may reflect trauma, memory fragmentation, or translation — note this
- The seekerReport must be in the language specified (${language})
- The clinicReport must be in English (standard for IRB)
- Cite specific IRPA sections where relevant
- Resources should be Quebec-specific where possible
- If information is insufficient, say so — never fabricate`

    const text = await callClaude({
      system,
      userContent: answers,
      includePdfs: true,
      maxTokens: 8192,
    })

    const parsed = extractJSON(text)
    if (!parsed) throw new Error('Failed to parse assessment JSON')

    res.json(parsed)
  } catch (err) {
    console.error('assess error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ── 5. Generate legislation-grounded Phase 2 questions ──
app.post('/api/assess-phase1', async (req, res) => {
  try {
    const { answers, language } = req.body

    const system = `You are a Canadian refugee lawyer. You have the IRPA and Quebec asylum seeker guide. Based on the claimant's Phase 1 intake answers, generate personalized narrative interview questions.

Output ONLY valid JSON:
{
  "questions": [
    {
      "id": "p2q1",
      "text": "the question in ${language}",
      "purpose": "why this question matters legally (English, for internal use)",
      "irpaSection": "relevant IRPA section if applicable",
      "inputType": "text|choice",
      "choices": ["only if inputType is choice"]
    }
  ],
  "initialAssessment": {
    "likelyGround": "preliminary Convention ground",
    "keyAreas": ["area needing exploration 1", "area 2"],
    "urgencyIndicators": ["any flags suggesting urgency"]
  }
}

Generate 12-16 questions. Questions must be:
- Specific to this claimant's country, ground, and situation
- In ${language} (question text only — purpose stays English)
- Compassionate and non-judgmental
- Ordered from least to most sensitive
- Covering: background, persecution details, evidence, state protection, IFA, fear of return`

    const text = await callClaude({
      system,
      userContent: answers,
      includePdfs: true,
      maxTokens: 4096,
    })

    const parsed = extractJSON(text)
    if (!parsed) throw new Error('Failed to parse phase1 assessment JSON')

    res.json(parsed)
  } catch (err) {
    console.error('assess-phase1 error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ── 6. Search similar IRB cases via OpenJustice library ──
app.post('/api/similar-cases', async (req, res) => {
  try {
    const { country, convention_ground, claim_strength } = req.body
    const query = `IRB RPD refugee claim ${country} ${convention_ground} persecution`

    // Try OpenJustice library search endpoints
    const endpoints = [
      '/api/v1/library/search',
      '/api/v1/documents/search',
      '/library/search',
    ]

    for (const endpoint of endpoints) {
      try {
        const ojRes = await fetch(`https://staging.openjustice.ai${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENJUSTICE_API_KEY}`,
          },
          body: JSON.stringify({
            query,
            filters: { jurisdiction: 'Canada' },
            limit: 5,
          }),
        })
        if (ojRes.ok) {
          const data = await ojRes.json()
          if (data.results?.length > 0 || data.documents?.length > 0 || data.cases?.length > 0) {
            const items = data.results || data.documents || data.cases
            res.json({
              cases: items.slice(0, 5).map(item => ({
                title: item.title || item.name || 'Untitled',
                summary: item.summary || item.excerpt || item.content?.substring(0, 300) || '',
                outcome: item.outcome || item.decision || 'Unknown',
                key_factors: item.key_factors || item.factors || [],
                url: item.url || item.link || null,
              })),
            })
            return
          }
        }
      } catch { /* try next endpoint */ }
    }

    // No endpoint worked — return empty to trigger frontend fallback
    res.json({ cases: [] })
  } catch (err) {
    console.error('similar-cases error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ── 7. Submit a case from seeker to clinic ──
app.post('/api/cases', async (req, res) => {
  try {
    const { clinic, sessionPin, answers, contactInfo } = req.body
    if (!clinic) return res.status(400).json({ error: 'Clinic is required' })

    const p0 = answers?.p0 || {}
    // Phase 0 order: 0=Country, 1=Province/duration, 2=Gender, 3=Age, 4=Arrival method, 5=Arrival date
    const country = typeof p0[0] === 'string' ? p0[0] : 'Unknown'
    const gender = typeof p0[2] === 'string' ? p0[2] : ''
    const ageGroup = typeof p0[3] === 'string' ? p0[3] : ''

    const caseId = `${Math.floor(1000 + Math.random() * 9000)}-QC`
    const now = new Date().toISOString()

    const caseDoc = {
      id: caseId,
      sessionId: `#${caseId}`,
      sessionPin: sessionPin || null,
      clinic,
      country,
      countryFlag: '',
      legalCategory: 'Section 96 — Refugee',
      claimStrength: 'Pending',
      detailTag: 'New submission',
      filedDate: now.split('T')[0],
      hearingDate: null,
      status: 'open',
      contactInfo: contactInfo || null,
      answers,
      createdAt: now,
    }

    await db.collection('cases').doc(caseId).set(caseDoc)
    console.log(`Case ${caseId} submitted to clinic: ${clinic}`)

    res.json({ caseId, sessionId: `#${caseId}` })
  } catch (err) {
    console.error('submit case error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ── 8. Fetch cases for a clinic ──
app.get('/api/cases', async (req, res) => {
  try {
    const { clinic } = req.query
    if (!clinic) return res.status(400).json({ error: 'Clinic query param required' })

    const snapshot = await db.collection('cases')
      .where('clinic', '==', clinic)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get()

    const cases = []
    snapshot.forEach(doc => cases.push(doc.data()))

    res.json({ cases })
  } catch (err) {
    console.error('fetch cases error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// SPA fallback — serve index.html for all non-API routes
app.get('/{*path}', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Mon Prologue API server running on http://localhost:${PORT}`)
})
