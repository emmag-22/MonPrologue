/**
 * OpenJustice API client
 *
 * Executes the custom reasoning flow built on the OpenJustice platform
 * (Conflict Analytics Lab, Queen's University).
 *
 * API: POST https://api.openjustice.ai/dialog-flow-executions/run
 * Auth: Bearer token
 * Flow ID: 4567a9b4-ed32-4336-9bfc-af64442bf6dc
 *
 * The flow analyzes asylum seeker intake data through:
 *   1. Fact Node (Seeker Intake) — extracts structured legal facts
 *   2. Reasoning Node (Convention Ground) — maps to refugee grounds
 *   3. Switch Node (Ground Router) — routes by identified ground
 *   4. Reasoning Node (Overall Claim Assessment) — rates strength
 *   5. Outcome Node (Clinic Dossier) — generates structured report
 */

const API_BASE = 'https://api.openjustice.ai'
const FLOW_ID = import.meta.env.VITE_OPENJUSTICE_FLOW_ID || '4567a9b4-ed32-4336-9bfc-af64442bf6dc'
const API_KEY = import.meta.env.VITE_OPENJUSTICE_API_KEY

/**
 * @typedef {Object} SeekerIntake
 * @property {string} country        — Country of origin (e.g. "Haiti")
 * @property {string} ground         — Claimed persecution ground (e.g. "Political opinion")
 * @property {string} narrative      — What happened — the full story
 * @property {string} timeline       — Key dates in sequence
 * @property {string} stateProtection — Did they seek help from authorities
 * @property {string} internalFlight — Why they couldn't relocate within country
 * @property {string} timeInCanada   — How long in Canada and where
 * @property {string} sex            — Man / Woman / Non-binary / Prefer not to say
 * @property {string} ageGroup       — Age bracket (e.g. "26-35")
 */

/**
 * @typedef {Object} FlowResult
 * @property {string}  status          — "completed" | "failed"
 * @property {string}  executionId     — unique execution ID
 * @property {Object}  facts           — extracted facts with labels, predictions, probabilities
 * @property {Array}   nodeResults     — per-node results (fact, reasoning, switch, outcome)
 * @property {string}  finalOutput     — the full clinic dossier text
 * @property {Object}  parsed          — structured data extracted from facts and node results
 * @property {number}  totalTokens     — total token usage
 */

/**
 * Format seeker intake data into a single message for the OpenJustice flow.
 * The flow's fact node extracts structured fields from this text.
 */
function formatIntakeMessage(intake) {
  return [
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
}

/**
 * Execute the OpenJustice reasoning flow with seeker intake data.
 * Uses the stateless /dialog-flow-executions/run endpoint (JSON response).
 *
 * @param {SeekerIntake} intake
 * @param {Object} [options]
 * @param {string} [options.model='gpt-4o-mini'] — AI model for the flow
 * @returns {Promise<FlowResult>}
 */
export async function executeReasoningFlow(intake, options = {}) {
  const model = options.model || 'gpt-4o-mini'

  const response = await fetch(`${API_BASE}/dialog-flow-executions/run`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      dialogFlowId: FLOW_ID,
      model,
      messages: [{ content: formatIntakeMessage(intake) }],
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`OpenJustice API error (${response.status}): ${errorText}`)
  }

  const data = await response.json()

  if (data.status !== 'completed') {
    throw new Error(`OpenJustice flow did not complete. Status: ${data.status}`)
  }

  return {
    status: data.status,
    executionId: data.executionId,
    facts: data.facts,
    nodeResults: data.nodeResults,
    finalOutput: data.finalOutput || '',
    parsed: parseFlowData(data),
    totalTokens: data.totalTokens,
  }
}

/**
 * Execute with SSE streaming for real-time progress updates.
 * Returns an EventSource-like interface for tracking node execution.
 *
 * @param {SeekerIntake} intake
 * @param {Object} callbacks
 * @param {Function} [callbacks.onNodeStarted]    — called when a node begins
 * @param {Function} [callbacks.onNodeResult]     — called when a node completes
 * @param {Function} [callbacks.onProgress]       — called on progress updates
 * @param {Function} [callbacks.onMessage]        — called on streamed text chunks
 * @param {Function} [callbacks.onComplete]       — called with final result
 * @param {Function} [callbacks.onError]          — called on error
 * @param {Object} [options]
 * @param {string} [options.model='gpt-4o-mini']
 */
export async function executeReasoningFlowStream(intake, callbacks = {}, options = {}) {
  const model = options.model || 'gpt-4o-mini'

  const response = await fetch(`${API_BASE}/dialog-flow-executions/run/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      dialogFlowId: FLOW_ID,
      model,
      messages: [{ content: formatIntakeMessage(intake) }],
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`OpenJustice API error (${response.status}): ${errorText}`)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    let currentEvent = null
    for (const line of lines) {
      if (line.startsWith('event: ')) {
        currentEvent = line.slice(7).trim()
      } else if (line.startsWith('data: ') && currentEvent) {
        try {
          const payload = JSON.parse(line.slice(6))
          switch (currentEvent) {
            case 'node-started':
              callbacks.onNodeStarted?.(payload)
              break
            case 'node-result':
              callbacks.onNodeResult?.(payload)
              break
            case 'progress-update':
              callbacks.onProgress?.(payload)
              break
            case 'message':
              callbacks.onMessage?.(payload)
              break
            case 'execution-completed':
              callbacks.onComplete?.(payload)
              break
            case 'result':
              callbacks.onComplete?.(payload)
              break
            case 'error':
              callbacks.onError?.(payload)
              break
          }
        } catch {
          // skip unparseable lines
        }
        currentEvent = null
      }
    }
  }
}

/**
 * Extract structured data from the raw API response.
 * Pulls key fields from the facts dictionary and node results.
 */
function parseFlowData(data) {
  const facts = data.facts || {}
  const nodeResults = data.nodeResults || []

  // Extract labeled facts into a clean object
  const extractedFacts = {}
  for (const [, fact] of Object.entries(facts)) {
    if (fact.label && fact.prediction !== undefined) {
      extractedFacts[fact.label] = {
        value: fact.prediction,
        probability: fact.probability,
        source: fact.source,
      }
    }
  }

  // Find key node outputs
  const conventionGroundNode = nodeResults.find(
    (n) => n.nodeConfig?.type === 'reasoning' && n.nodeConfig?.label === 'Convention Ground'
  )
  const assessmentNode = nodeResults.find(
    (n) => n.nodeConfig?.type === 'reasoning' && n.nodeConfig?.label === 'Overall Claim Assessment'
  )
  const dossierNode = nodeResults.find(
    (n) => n.nodeConfig?.type === 'outcome'
  )

  // Parse reasoning node JSON outputs
  let conventionGroundData = {}
  let assessmentData = {}
  try {
    if (conventionGroundNode?.nodeExecutionResults?.output) {
      conventionGroundData = JSON.parse(conventionGroundNode.nodeExecutionResults.output)
    }
  } catch { /* output may not be JSON */ }
  try {
    if (assessmentNode?.nodeExecutionResults?.output) {
      assessmentData = JSON.parse(assessmentNode.nodeExecutionResults.output)
    }
  } catch { /* output may not be JSON */ }

  return {
    facts: extractedFacts,
    conventionGround: conventionGroundData.prediction || extractedFacts['Convention Ground']?.value || '',
    claimStrength: assessmentData.prediction || extractedFacts['Overall Claim Assessment']?.value || '',
    narrativeCoherence: extractedFacts['Narrative Coherence']?.value || '',
    ifaAssessment: extractedFacts['IFA Assessment']?.value || '',
    conventionGroundAnalysis: conventionGroundData,
    overallAssessment: assessmentData,
    dossierText: dossierNode?.nodeExecutionResults?.output || data.finalOutput || '',
  }
}
