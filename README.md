Try it out: https://mon-prologue-732763036355.us-central1.run.app/

# Mon Prologue

> Montréal AI × Law Hackathon 2026 · Track 3 — Conflict Analytics Lab
> Powered by OpenJustice · Claude · Firebase

---

## What it is

A two-sided platform connecting asylum seekers in Quebec with legal aid clinics. Seekers tell their story through a guided, multilingual interview. Clinics receive a structured legal dossier with IRPA analysis, deadline tracking, and country condition intelligence.

## How it works

**Seeker side** — Calm, one-question-at-a-time intake in French, English, Spanish, Haitian Creole, or Arabic. Voice input supported. No accounts — just a 6-digit PIN. At the end, the seeker selects a clinic and their file is transmitted.

**Clinic side** — Dashboard showing all assigned cases with urgency flags. Each case opens a full legal dossier: Convention ground mapping, coherence flags (framed as lawyer questions, never credibility judgments), IFA assessment, IRPA deadline tracker, geopolitical context with source links, similar IRB decisions, and the full interview transcript.

## AI architecture

1. **OpenJustice reasoning flow** — Custom no-code pipeline (Conflict Analytics Lab, Queen's University). Fact nodes extract structured legal inputs, reasoning nodes analyze Convention grounds, narrative coherence, and IFA, switch nodes route by ground, outcome node generates the clinic dossier. Grounded in IRB jurisprudence via citation footnotes.

2. **Claude API** — Generates personalized follow-up questions based on the seeker's answers and the IRPA + Quebec asylum guide PDFs (sent as document blocks). Also produces the seeker's plain-language report.

3. **Country intelligence** — Geopolitical briefing with links to Amnesty, HRW, UNHCR, State Dept, Freedom House, ECOI.

## What the AI does NOT do

No credibility scoring. No truthfulness assessment. Coherence flags are internal to the claimant's own narrative — gaps may reflect trauma, not inconsistency. The AI supports the lawyer's preparation; it does not replace their judgment.

## Tech stack

| | |
|---|---|
| Frontend | React 18 + Vite |
| Backend | Express (Node.js) |
| Database | Firebase Firestore |
| AI | Claude (Anthropic) + OpenJustice |
| Voice | Web Speech API |
| Deployment | Google Cloud Run |

## Setup

```bash
git clone https://github.com/emmag-22/MonPrologue.git
cd MonPrologue
npm install
cp .env.example .env
npm run dev
```

## Environment variables

```
OPENJUSTICE_API_KEY=
OPENJUSTICE_FLOW_ID=
ANTHROPIC_API_KEY=
GCP_PROJECT_ID=
```

## Clinic demo login

- Establishment: `QC-1042`
- Employee: `LP-8821`
- Password: `monprologue2026`

## Privacy

No persistent raw text. Seeker anonymity via PIN until explicit consent. Nothing used for AI training. Designed for Quebec Law 25 compliance.

## Team

Built at the Montréal AI × Law Hackathon 2026.
Track 3 — Conflict Analytics Lab: Building Accessible Legal AI.

## Disclaimer

This is a preparation tool, not legal advice. All AI output must be reviewed by a qualified legal professional.
