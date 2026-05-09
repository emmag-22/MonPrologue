import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express()
app.use(cors())
app.use(express.json({ limit: '1mb' }))

// Serve built frontend in production
app.use(express.static(join(__dirname, 'dist')))

const PORT = process.env.PORT || 3001
const OPENJUSTICE_API_KEY = process.env.OPENJUSTICE_API_KEY
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
const OPENJUSTICE_FLOW_ID = process.env.OPENJUSTICE_FLOW_ID || '4567a9b4-ed32-4336-9bfc-af64442bf6dc'

// ── Helper: call Claude API ──
async function callClaude({ system, userMessage, model = 'claude-sonnet-4-6', maxTokens = 4096 }) {
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
      messages: [{ role: 'user', content: userMessage }],
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Claude API error (${res.status}): ${err}`)
  }
  const data = await res.json()
  return data.content[0].text
}

// ── 1. Generate follow-up questions (Phase 3) ──
app.post('/api/generate-questions', async (req, res) => {
  try {
    const { context, language } = req.body

    const system = `You are a Canadian refugee lawyer preparing a client's asylum claim for the Immigration and Refugee Board (IRB). You have reviewed the client's initial intake answers and narrative interview.

Your task: generate 5 to 8 targeted follow-up questions that will strengthen this specific asylum claim.

Focus on:
- Gaps or missing detail in the timeline of events
- Specific details about persecutors (role, capacity, reach)
- Evidence the client may have (documents, photos, witnesses, medical records)
- Medical or psychological impact of the persecution
- The legal grounds for asylum (race, religion, nationality, political opinion, membership in a social group)
- Why internal relocation within the country was not a safe option

Rules:
- Questions must be directly relevant to this particular client's story — not generic
- Do not repeat any question already asked in the intake or narrative interviews
- Be compassionate, clear, and non-judgmental
- Output ONLY a valid JSON array of question strings in the language specified
- Example format: ["Question one?", "Question two?", "Question three?"]`

    const text = await callClaude({
      system,
      userMessage: `Client answers:\n\n${context}\n\nGenerate the follow-up questions in ${language}.`,
      maxTokens: 1024,
    })

    // Extract JSON array from response
    const match = text.match(/\[[\s\S]*\]/)
    const questions = match ? JSON.parse(match[0]) : []
    res.json({ questions })
  } catch (err) {
    console.error('generate-questions error:', err.message)
    res.status(500).json({ error: err.message })
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

    // Extract structured facts
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

You will receive structured intake data and a legal analysis from the OpenJustice reasoning flow.

Generate TWO versions of a BOC narrative:

**SEEKER VERSION:**
- Plain, warm language at a grade 6 reading level
- In the claimant's voice ("I left my country because...")
- No legal jargon, encouraging tone

**CLINIC VERSION:**
- Proper IRB BOC format
- Addresses the Convention refugee ground, state protection, and IFA
- Flags areas needing strengthening
- Professional legal register, in English

RULES:
- Never assess credibility or truthfulness
- Never fabricate details not in the intake
- Flag gaps rather than filling them
- Narrative gaps may reflect trauma — note respectfully`

    const userMessage = `## Intake Data
Country: ${intake.country}
Ground: ${intake.ground}
Narrative: ${intake.narrative}
Timeline: ${intake.timeline}
State protection: ${intake.stateProtection}
IFA: ${intake.internalFlight}
Time in Canada: ${intake.timeInCanada}
Sex: ${intake.sex}
Age: ${intake.ageGroup}

## OpenJustice Analysis
${dossier}`

    const text = await callClaude({ system, userMessage })

    // Split into seeker and clinic versions
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

// SPA fallback — serve index.html for all non-API routes
app.get('/{*path}', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Refuge API server running on http://localhost:${PORT}`)
})
