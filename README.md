# Refuge
### AI-Powered Asylum Seeker Support Platform

> Built at the **Montréal AI × Law Hackathon 2026**
> Track 3 — Conflict Analytics Lab: Building Accessible Legal AI
> Powered by **OpenJustice** · Conflict Analytics Lab · Queen's University

---

## The Problem

Every year, thousands of people arrive in Québec fleeing persecution, violence, and danger. The asylum process they enter is one of the most complex legal journeys a person can face — and most navigate it entirely alone.

The backlog at Canada's Immigration and Refugee Board has grown to over **272,000 pending cases**. Claimants wait up to four years for a decision. Legal aid clinics are overwhelmed. And the single most important document in the process — the **Basis of Claim (BOC) form**, where a person must explain in writing why they fear returning to their country — is something most people complete by themselves, in a second language, while processing active trauma.

A poorly prepared BOC, a missed deadline, or an unaddressed legal argument can result in a rejected claim and deportation. The stakes could not be higher.

---

## What Refuge Does

Refuge is a bilingual web platform with two distinct sides — one built for asylum seekers, one built for the legal professionals who support them.

**For the asylum seeker**, Refuge is a calm, private companion that guides them through telling their story at home. No legal jargon. No blank forms. One simple question at a time, with the option to speak rather than type. The experience is designed for people who may have limited digital literacy, limited English or French, and who are carrying real fear. Nothing is shared without their explicit permission.

**For the legal clinic**, Refuge transforms hours of unstructured first meetings into a focused, immediately actionable case file. By the time a lawyer opens a new case, they already have a structured summary of the client's situation, a draft BOC narrative, a list of specific gaps to address before the hearing, and an overview of relevant country conditions and how similar cases have been decided at the IRB.

Same platform. Two completely different experiences. Because the needs are completely different.

---

## How the AI Works

Refuge uses a multi-layer AI architecture that combines a **custom-built legal reasoning flow** on the OpenJustice platform with the **Claude AI model** and **live intelligence feeds** from international human rights sources.

### Layer 1 — Custom Legal Reasoning Flow (OpenJustice)

The core intelligence of Refuge is a structured reasoning flow built inside the **OpenJustice platform** developed by the Conflict Analytics Lab at Queen's University. OpenJustice is a no-code legal AI platform that allows legal professionals to encode their own reasoning, legal tests, and jurisprudence directly into an AI workflow — going far beyond simple prompting.

Our reasoning flow is composed of five interconnected node types:

**Fact Nodes — Structured Intake**
The seeker's answers are collected as structured legal facts: country of origin, claimed persecution ground, incident narrative, timeline of events, state protection sought, internal flight alternative, time in Canada, age group, and sex. These are not free-text fields fed blindly into a model — they are typed, validated inputs that feed a legal reasoning pipeline.

**Reasoning Nodes — Legal Analysis**
Multiple reasoning nodes analyze the intake data in parallel, each focused on a specific legal question:

- *Convention Ground Mapping* — Which of the five Convention refugee grounds (race, religion, nationality, political opinion, membership in a particular social group) does the narrative establish? This is analyzed against the leading Supreme Court authority *Ward v. Canada [1993] 2 SCR 689* and subsequent IRB jurisprudence, grounded directly in our reasoning flow via citation footnotes.

- *Narrative Coherence Check* — Does the claimant's story hold together internally? The AI checks for timeline gaps, inconsistencies in who the persecutors are, whether state protection has been adequately explained, and whether an Internal Flight Alternative has been addressed. These are the exact pressure points IRB members probe at hearings.

- *IFA Assessment* — Is an Internal Flight Alternative argument likely to be raised, and has it been addressed in the narrative? This is one of the most common grounds for rejection at the IRB and is explicitly analyzed as a standalone node.

- *Overall Claim Strength* — Drawing on all prior analysis, the flow produces a synthesis: Strong / Moderate-Strong / Moderate / Weak / Insufficient information. This is not a credibility score. It is a professional assessment of the claim as currently presented, with three specific actions the lawyer should take before submission.

**Switch Nodes — Adaptive Routing**
The flow branches based on the identified Convention ground. A claim based on political opinion routes to supplementary questions about evidence of political activity. A claim based on membership in a particular social group routes to questions about the immutability of the characteristic. The reasoning adapts to the specific legal pathway of each case.

**Outcome Node — Structured Dossier Generation**
The Outcome Node synthesizes all upstream analysis into a structured clinic dossier using a Response Template — ensuring the output is always professionally formatted, consistently structured, and legally grounded. The template uses `{{ }}` blocks to direct the AI to generate specific content in designated sections while keeping the surrounding structure fixed and predictable.

### Layer 2 — Past Case Pattern Analysis

The OpenJustice platform provides access to a database of IRB Refugee Protection Division (RPD) and Refugee Appeal Division (RAD) decisions. Our reasoning flow is grounded in this case law through citation footnotes attached to each reasoning node — surfacing the specific precedents, jurisprudential guides, and Chairperson-identified decisions that govern claims from each country and on each Convention ground.

For the clinic, this surfaces as:
- Acceptance rate for similar claims (same country, same ground, past 3 years)
- Key factors that led to acceptance in comparable cases
- Key factors that led to rejection — which become the basis for the coherence flags

This is not statistical pattern-matching. It is the same case law a lawyer would research manually, organized and surfaced automatically by the reasoning flow.

### Layer 3 — Live Country Conditions Intelligence

The IRB uses **National Documentation Packages (NDPs)** — country-specific compilations of human rights reports, news, and government sources — as the standard evidence base for every refugee hearing. NDPs are updated periodically, but conditions on the ground change faster.

Refuge monitors live intelligence feeds to supplement the NDP with current context:
- **Human Rights Watch** country reports and urgent dispatches
- **Amnesty International** situation updates
- **UNHCR** country situation reports
- **US State Department** country reports

When a lawyer opens a case, the platform checks whether there has been a significant development in the past 90 days relevant to this country and this Convention ground. The result is a country conditions signal — displayed as a flagged summary with source links — that the lawyer can use to supplement the NDP with current evidence. This is the background research that currently takes a junior lawyer an hour to pull together. Refuge surfaces it automatically.

### Layer 4 — BOC Narrative Generation (Claude API)

Once the OpenJustice reasoning flow has analyzed the intake data and identified the strongest legal framing, the Claude API generates a **draft Basis of Claim narrative** in proper IRB format. The narrative is written in the claimant's voice, structured to address the key legal elements the IRB looks for, and pre-flagged with notes for the lawyer on areas that need strengthening.

The seeker sees a plain-language version of their story — warm, encouraging, and jargon-free. The lawyer sees the legally formatted draft, ready to edit and submit.

---

## What the AI Does NOT Do

This is as important as what it does.

The AI in Refuge does not produce a credibility score. It does not decide whether a claimant is telling the truth. It does not compare a person's story to political conditions and flag inconsistencies between them. It does not make or recommend a legal decision.

The coherence analysis is entirely **internal to the claimant's own account** — checking whether their story is consistent with itself, not whether it matches external expectations. A gap in someone's timeline might reflect trauma. It might reflect a translation issue. It might be something that needs to be explained. The lawyer finds out. The AI ensures they know to ask.

Every clinic dossier includes this footer: *"This tool does not assess the truthfulness of the claimant's account. Narrative gaps may reflect trauma, memory fragmentation, or translation issues, and must be explored compassionately by the legal professional."*

This design choice is grounded in research. Studies of AI used in asylum processing have documented bias against claimants from sub-Saharan Africa and South Asia, gender-based disparities, and the danger of automating what are fundamentally human judgments about fear and persecution. Refuge is built to avoid these failure modes. The AI supports the lawyer's preparation. It does not replace the lawyer's judgment.

---

## Privacy Architecture

Asylum seekers are among the most vulnerable people in any legal system. Their stories contain information that, in the wrong hands, could endanger not just them but family members still living in their country of origin. The platform is designed with this reality at its center.

### Data model
- **No persistent raw content.** Free-text narratives entered during the intake flow are processed and converted into a structured dossier. The raw text is never written to a database.
- **Seeker anonymity until handoff.** Sessions are identified by a 6-digit PIN only — no name, no email, no account — until the seeker explicitly chooses to share their file with a clinic.
- **Situation-not-person framing.** Every intake question asks about events and circumstances, not identity. Personal identifiers are entered once, at the moment of handoff, and only if the seeker consents.
- **No AI training on case data.** Nothing entered into Refuge is used to train any model. OpenJustice queries are stateless — the platform sends structured legal inputs, not personal narratives.

### Consent
Three explicit consent steps, each in plain language and in the seeker's chosen language:
1. What data the tool collects and why
2. Exactly what the clinic will see versus what stays private
3. The right to delete the session at any point before handoff

### Retention
The Refuge platform holds nothing beyond the session. The structured dossier transfers to the clinic's own case management system at handoff. The clinic manages retention from that point under their professional obligations — typically 7 years under Québec Bar rules. Refuge is a generation tool, not a storage system.

### Québec Law 25
Québec's *Loi 25* requires express consent for sensitive personal information. Asylum claim data — persecution history, family details, information about circumstances in a country of origin — is among the most sensitive information that exists. Refuge's consent model goes beyond what Law 25 requires. This is privacy by design, not privacy by compliance.

---

## UX Design Principles

The seeker portal and clinic portal are deliberately designed for two completely different users.

### Seeker portal — designed for low digital literacy
- **One question per screen.** No forms. No scrolling. No cognitive overload.
- **Voice-first.** The microphone button is the primary input. Text is secondary.
- **No blank boxes.** Every question has a plain-language prompt and a sentence starter.
- **Forgiveness over validation.** Any question can be skipped. The lawyer is informed, not the session blocked.
- **Save with a PIN.** A 6-digit code, no account required. Resume anytime, on any device.
- **Confirmation loop.** After each answer, the system reads it back: "Is that right?" — Yes / Change it.
- **Calm visual language.** No urgency. No countdown timers. No error colors. Large tap targets (52px minimum). Works on a cheap Android phone on a slow connection.
- **Languages:** French (default), English, Spanish, Haitian Creole.

### Clinic portal — designed for legal professionals
- Dense, information-rich case dashboard
- Urgency flags, case status, country signal indicators
- Full dossier view with coherence flags framed as lawyer preparation questions
- Draft BOC narrative, editable before submission
- Country conditions summary with source links
- IRB case pattern data from OpenJustice

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Routing | React Router v6 |
| Styling | Custom CSS — no UI library |
| Fonts | Fraunces (display) + DM Sans (UI) |
| State management | React Context API |
| Legal reasoning | OpenJustice platform (Conflict Analytics Lab, Queen's University) |
| AI model | Claude (`claude-sonnet-4-20250514`) via Anthropic API |
| Voice input | Web Speech API (browser-native) |
| Country intelligence | IRB NDP + HRW / Amnesty / UNHCR / State Dept. live feeds |
| Session management | PIN-based, no persistent auth on seeker side |
| Clinic auth | Credential login |

---

## Project Structure

```
refuge/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   │
│   ├── context/
│   │   └── AppContext.jsx           # Language, role, session PIN, t() helper
│   │
│   ├── pages/
│   │   ├── Landing.jsx              # Language bar + role selection
│   │   │
│   │   ├── seeker/
│   │   │   ├── SeekerShell.jsx
│   │   │   ├── SeekerWelcome.jsx    # "You are safe here"
│   │   │   ├── PreQuestions.jsx     # Age group, sex, country
│   │   │   ├── InterviewPhase1.jsx  # Template guided questions
│   │   │   ├── InterviewPhase2.jsx  # AI-curated follow-ups
│   │   │   ├── SeekerReport.jsx     # Plain-language seeker summary
│   │   │   └── ShareWithClinic.jsx  # Consent + handoff
│   │   │
│   │   └── clinic/
│   │       ├── ClinicShell.jsx
│   │       ├── ClinicLogin.jsx
│   │       ├── ClinicDashboard.jsx  # Case triage list
│   │       └── CaseDossier.jsx      # Full AI-analyzed case view
│   │
│   ├── components/
│   │   ├── LanguageBar.jsx
│   │   ├── RoleCard.jsx
│   │   ├── QuestionScreen.jsx
│   │   ├── MicButton.jsx
│   │   ├── ConfirmBubble.jsx
│   │   ├── PinSave.jsx
│   │   ├── DossierCard.jsx
│   │   ├── FlagBadge.jsx
│   │   └── CountrySignal.jsx
│   │
│   └── lib/
│       ├── openjustice.js           # OpenJustice reasoning flow execution
│       ├── claude.js                # Claude API — BOC narrative generation
│       ├── countryIntelligence.js   # Live feed aggregation
│       ├── translations.js          # All UI strings (FR/EN/ES/HT)
│       └── countries.js             # Country list + NDP metadata
│
├── public/
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

---

## OpenJustice Reasoning Flow Architecture

The reasoning flow built inside the OpenJustice platform follows this node structure:

```
Start
  └── Fact Node: Seeker Intake
        (country, ground, narrative, timeline,
         state protection, IFA, time in Canada, sex, age group)
            │
            ├── Reasoning Node: Convention Ground Mapping
            │     Which of the 5 grounds applies?
            │     Citation: Ward v. Canada [1993] 2 SCR 689
            │     Document Search: IRB RPD/RAD decisions, Québec
            │          │
            │          ├── Child Reasoning: Narrative Coherence Check
            │          │     Timeline gaps, IFA addressed?,
            │          │     state protection explained?,
            │          │     agency consistency
            │          │
            │          └── Child Reasoning: IFA Assessment
            │                Is IFA likely to be raised?
            │                Has it been addressed?
            │
            └── Switch Node: Ground Router
                  Political opinion → Political Evidence Fact Node
                  Particular social group → PSG Definition Fact Node
                  Default → Overall Claim Assessment
                        │
                        └── Reasoning Node: Overall Claim Assessment
                              Strength rating + 3 lawyer actions
                                    │
                                    └── Outcome Node: Clinic Dossier
                                          Structured report via
                                          Response Template
```

---

## Sample Clinic Dossier Output

```
REFUGE INTAKE DOSSIER
────────────────────────────────────────────────────────
Session:        #4821-QC
Country:        Haiti
Primary ground: Political opinion
Claim strength: Moderate-Strong
────────────────────────────────────────────────────────

COHERENCE FLAGS
Questions to explore with your client before submission:

1. There is a 6-month gap between the last described incident
   (September 2021) and the claimant's departure (March 2022).
   What was happening during this period?

2. The Internal Flight Alternative has not been addressed.
   Why was relocation to another part of Haiti not an option?

────────────────────────────────────────────────────────

IFA STATUS
IFA is likely to be raised by the IRB. It has not been
addressed in the current narrative.

STATE PROTECTION
The claimant states police "did not help" but has not described
whether a formal complaint was filed or why formal channels
were unavailable or unsafe.

────────────────────────────────────────────────────────

COUNTRY CONDITIONS SIGNAL               ⚠ RECENT UPDATE
NDP (Haiti) last updated: March 2025
Signal: Political violence ↑ Q1 2025
Source: HRW Haiti Report, April 2025
Assessment: Conditions support claim

────────────────────────────────────────────────────────

IRB CASE PATTERNS (via OpenJustice)
Haiti / Political opinion / 2022–2025
Acceptance rate: 71%  (n = 143 decisions)
Key acceptance factors: documented threats,
  failed state protection, specific targeting
Key rejection factors: vague chronology,
  IFA not rebutted, general risk only

────────────────────────────────────────────────────────

RECOMMENDED NEXT STEPS
1. Address the 6-month chronology gap in an amended narrative
2. Add a paragraph explicitly rebutting the IFA
3. Supplement state protection section with detail on
   whether a formal complaint was possible and why not

────────────────────────────────────────────────────────

DISCLAIMER
This dossier does not assess the truthfulness of the
claimant's account. Narrative gaps may reflect trauma,
memory fragmentation, or translation issues, and must be
explored compassionately by the legal professional.
This tool does not constitute legal advice.
```

---

## Environment Variables

```env
VITE_ANTHROPIC_API_KEY=           # Claude API key
VITE_OPENJUSTICE_API_KEY=         # OpenJustice API key (provided at hackathon)
VITE_OPENJUSTICE_FLOW_ID=         # ID of the deployed reasoning flow
```

---

## Setup

```bash
git clone https://github.com/your-team/refuge.git
cd refuge
npm install
cp .env.example .env
# Add your API keys to .env
npm run dev
```

---

## Routes

| Path | Page | Access |
|---|---|---|
| `/` | Landing — language + role selection | Public |
| `/seeker` | Seeker welcome | Public |
| `/seeker/pre` | Pre-questions (age, sex, country) | Public |
| `/seeker/interview/1` | Interview Phase 1 — guided story | Public |
| `/seeker/interview/2` | Interview Phase 2 — AI follow-ups | Public |
| `/seeker/report` | Seeker plain-language report | Public |
| `/seeker/share` | Consent + clinic handoff | Public |
| `/clinic` | Clinic login | Public |
| `/clinic/dashboard` | Case triage dashboard | Clinic auth |
| `/clinic/case/:id` | Full case dossier | Clinic auth |

---

## Legal Disclaimer

Refuge is a preparation and triage tool. It does not constitute legal advice. All AI-generated output — including BOC narrative drafts, coherence flags, and country conditions summaries — must be reviewed and validated by a qualified legal professional before any use in legal proceedings. The platform is designed to support, never replace, the judgment of a licensed lawyer or paralegal.

---

## Team

Built in 10 hours at the Montréal AI × Law Hackathon 2026.
Track 3 — Conflict Analytics Lab: Building Accessible Legal AI.
Challenge sponsor: Conflict Analytics Lab, Queen's University.