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
