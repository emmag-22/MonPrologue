Try it out: https://mon-prologue-732763036355.us-central1.run.app/

# Mon Prologue

> Montréal AI × Law Hackathon 2026 · Track 3 — Conflict Analytics Lab
> Powered by OpenJustice · Claude · Firebase

---

## The Problem

Every year, thousands of people arrive in Québec fleeing persecution. The asylum process is one of the most complex legal journeys a person can face — and most navigate it alone. Canada's IRB backlog has grown to over 272,000 pending cases. The most critical document, the Basis of Claim form, is often completed by claimants themselves, in a second language, while processing active trauma.

## What Mon Prologue Does

Mon Prologue is a bilingual platform with two sides, one for asylum seekers, one for the legal professionals who support them.

**For the seeker:** A calm, guided interview — one question at a time, with voice input, in French, English, Spanish, Haitian Creole, or Arabic. No accounts, no forms, no jargon. Just a 6-digit PIN. Nothing is shared without explicit consent.

**For the clinic:** A structured legal dossier generated from the seeker's answers. Convention ground mapping, coherence flags framed as lawyer preparation questions (never credibility judgments), IFA assessment, IRPA deadline tracking, geopolitical context with source links, similar IRB decision patterns, and the full interview transcript — ready to download as PDF.

Cases are transmitted from seeker to clinic via Firestore when the seeker selects their clinic and submits.

---

## AI Architecture

The platform uses a multi-layer AI system:

**Layer 1: OpenJustice Reasoning Flow**
A custom pipeline built on the OpenJustice platform (Conflict Analytics Lab, Queen's University). The flow uses fact nodes, reasoning nodes, switch nodes, and an outcome node to analyze intake data against IRB jurisprudence. It maps Convention grounds (citing *Ward v. Canada [1993] 2 SCR 689*), checks narrative coherence, assesses the Internal Flight Alternative, and produces a structured clinic dossier. Each reasoning node is grounded in citation footnotes from RPD/RAD decisions.

**Layer 2: Claude API + Legislation PDFs**
The IRPA and Quebec asylum seeker guide are loaded as PDF document blocks and sent to Claude alongside the seeker's answers. Claude generates personalized follow-up questions for Phase 2 of the interview, tailored to the claimant's specific country and situation. It also produces the seeker's plain-language report and the geopolitical context briefing.

**Layer 3: Country Intelligence**
Each case includes a geopolitical briefing with clickable source cards from Amnesty International, Human Rights Watch, UNHCR Refworld, US State Department, Freedom House, and ECOI.

### What the AI Does NOT Do

The AI does not score credibility. It does not assess truthfulness. Coherence flags are internal to the claimant's own narrative, a gap in a timeline might reflect trauma, a translation issue, or something that simply needs to be explored. The AI surfaces questions for the lawyer. It does not answer them.

Every dossier includes: *"This tool does not assess the truthfulness of the claimant's account. Narrative gaps may reflect trauma, memory fragmentation, or translation issues, and must be explored compassionately by the legal professional."*

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Backend | Express.js |
| Database | Firebase Firestore |
| AI Models | Claude Sonnet 4 (Anthropic) + Claude Haiku 4.5 |
| Legal Reasoning | OpenJustice (Conflict Analytics Lab, Queen's University) |
| Voice Input | Web Speech API |
| Deployment | Google Cloud Run |
| Languages | FR, EN, ES, HT, AR (20 options in language switcher) |

---

## Privacy

- No persistent raw text, narratives are processed into structured dossiers
- Seeker anonymity via 6-digit PIN until explicit consent to share
- Nothing entered is used for AI training
- Designed for Québec Law 25 compliance

---

## Setup

```bash
git clone https://github.com/emmag-22/MonPrologue.git
cd MonPrologue
npm install
cp .env.example .env    # Add API keys
npm run dev             # Frontend on :5173, backend on :3001
```

### Environment Variables

```
OPENJUSTICE_API_KEY=     # From hackathon
OPENJUSTICE_FLOW_ID=     # The reasoning flow ID
ANTHROPIC_API_KEY=       # Claude API key
GCP_PROJECT_ID=          # For Firestore
```

### Clinic Demo Login

- Establishment: `QC-1042`
- Employee: `LP-8821`
- Password: `monprologue2026`

---

## Team

Built at the Montréal AI × Law Hackathon 2026.
Track 3: Conflict Analytics Lab: Building Accessible Legal AI.
Challenge sponsor: Conflict Analytics Lab, Queen's University.

---

*Mon Prologue is a preparation tool, not legal advice. All AI-generated output must be reviewed by a qualified legal professional before use in any proceeding.*
