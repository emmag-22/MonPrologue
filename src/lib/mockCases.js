// ── Sample interview answers per case (for transcript demo) ──
const SAMPLE_ANSWERS = {
  '4821-QC': {
    p0: {
      0: 'Man', 1: '26-35', 2: 'Haiti', 3: 'political',
      4: 'I was a member of a local political group opposing the ruling party in Port-au-Prince. In August 2024, armed men came to my home and threatened to kill me if I continued my political activities. I recognized one of them as working with the local government official in our district. After that night, I received threatening phone calls every few days. In March 2025, my house was vandalized and a note was left saying next time they would come for me personally.',
      5: { incidents: '2024-08', left: '2025-03', arrived: '2025-04' },
      6: { choice: 'no', detail: 'I did not go to the police because the men who threatened me were connected to the local government. A neighbor who reported similar threats was himself arrested and beaten in custody.' },
      7: { choice: 'no', detail: 'I tried staying with family in Cap-Haïtien for two weeks but received threats there as well. Haiti is a small country and the political networks reach everywhere. The gang affiliated with the government controls multiple regions.' },
      8: { province: 'Quebec', duration: '1 year, 1 month' },
    },
    p1: {
      0: { text: 'I grew up in Port-au-Prince in a working-class family. My father was a teacher and my mother sold goods at the market. I went to school until age 18 and then worked as a mechanic.' },
      1: { text: 'I am Catholic. I am Black Haitian. I became involved in local politics through a community organization that opposed the corruption of local government officials who were using gangs to control our neighborhood.' },
      2: { text: 'Before the problems, I had a normal life. I worked in my shop, I had friends, I was active in my church community. I got involved in politics because gangs controlled our area and nothing was being done.' },
      3: { text: 'The problems started in June 2024 when our group organized a peaceful demonstration against the local government official. Two weeks later, members of our group began receiving threats. I was specifically targeted in August 2024.' },
      4: { text: 'The people responsible were members of a gang called G-9 that works for the local government official, Monsieur Jean-Baptiste. The main person who threatened me was known as "Ti Rouge" — he is the gang leader in our area and everyone knows he takes orders from the official.' },
      5: { text: 'June 2024 — We organized a peaceful demonstration. July 2024 — Other members began receiving threats. August 2024 — Armed men came to my house at night and threatened to kill me. September to February — I received threatening calls regularly, sometimes twice a week. March 2025 — My house was vandalized with a death threat note. March 2025 — I fled to the Dominican Republic. April 2025 — I flew from Santo Domingo to Montreal.' },
      6: { choice: 'yes', detail: 'Yes, two other members of our political group were attacked. One was beaten badly and was hospitalized for three weeks. Another had his business burned down. Several members have gone into hiding.' },
      7: { choice: 'tried', detail: 'I went to the police station in our district but the officer told me there was nothing he could do and suggested I "stop making trouble." I believe the police are complicit because they never intervene when the gangs operate in our area.' },
      8: { text: 'The police told me to stop making trouble. They did not file a report. I did not try again because I was afraid that going to the police would only make the situation worse and alert the gang that I was trying to build a case.' },
      9: { text: 'The final event was when I came home on March 10, 2025 and found my door broken, my belongings thrown on the floor, and a note pinned to my bed that said "La prochaine fois, c\'est toi" — next time, it\'s you. I packed a bag and left that same night to my cousin in the Dominican Republic.' },
      10: 'other',
      11: { choice: 'yes', detail: 'I went to the Dominican Republic first. I stayed with a cousin in Santo Domingo for 3 weeks while I arranged to fly to Canada. I did not feel safe there either because Haitian gangs have connections in the DR.' },
      12: { text: 'If I return, I believe I will be killed. The gang members explicitly threatened my life. They have already attacked other members of our group. The political situation has only gotten worse since I left. My family tells me people are still looking for me.' },
      13: 'worse',
      14: { choice: 'no', detail: 'Haiti is a very small country. The gang networks are national. Even in Cap-Haïtien, which is far from Port-au-Prince, I received threats within two weeks. There is no safe place in Haiti for someone who has publicly opposed these groups.' },
      15: { choice: 'yes', detail: 'Yes, absolutely. They found me in Cap-Haïtien. They have connections in every major city. The gang network in Haiti operates nationally and is connected to the government. If they want to find someone, they will find them.' },
    },
    p2: {
      0: { text: 'I have photos on my phone of the vandalized house and the death threat note. I also have a medical report from my friend who was hospitalized after being beaten. I have screenshots of some of the threatening text messages, although I lost some when I had to change phones.' },
      1: { text: 'The psychological impact has been severe. I have nightmares almost every night. I am always afraid. When I hear loud noises I panic. I have been seeing a psychologist at the CLSC in Montreal since July 2025.' },
      2: { text: 'My wife and two children are still in Haiti. They are staying with her parents in a rural area. I worry about them every day. The gang has asked my wife where I am, but she told them she does not know.' },
    },
  },
  '3294-QC': {
    p0: {
      0: 'Woman', 1: '18–25', 2: 'Democratic Republic of Congo', 3: 'psg',
      4: 'I am a young woman from Bukavu in eastern DRC. My father was killed by armed militia in 2023 during a village raid. After his death, the militia leader claimed me as his "wife." I was held for 4 months and subjected to repeated sexual violence. I escaped with the help of a church worker and eventually made it to Canada.',
      5: { incidents: '2023-06', left: '2024-09', arrived: '2025-02' },
      6: { choice: 'tried', detail: 'A church worker tried to report to the local FARDC soldiers but they said it was a "family matter" and refused to intervene. The militia operates freely in our area and the army does nothing.' },
      7: { choice: 'no', detail: 'The militia operates across all of South Kivu province. Even in Bukavu city, they have informants. Other women who escaped have been recaptured. There is no safe place in eastern DRC.' },
      8: { province: 'Quebec', duration: '1 year, 3 months' },
    },
    p1: {
      0: { text: 'I grew up in a small village near Bukavu in South Kivu. My father was a farmer and community leader. I went to school until grade 10 when the fighting disrupted everything. I am the eldest of five children.' },
      1: { text: 'I am Catholic. I am from the Bashi ethnic group. My family had no political involvement — we are ordinary farmers. But in eastern DRC, being a young woman in an area controlled by militia is itself a danger.' },
      2: { text: 'Before June 2023, my life was difficult but normal for our region. I helped my mother with farming, I attended church, I had friends. The armed groups were in the area but had not yet targeted our village directly.' },
      3: { text: 'In June 2023, the M23-affiliated militia attacked our village. They killed my father and three other men. The militia leader, who called himself "Colonel Bosco," selected me and two other young women. We were taken to their camp.' },
      4: { text: 'The main person was the militia leader "Colonel Bosco." He is a commander of a group affiliated with M23. He has approximately 50-60 fighters under his command. He operates in the hills around Bukavu and the army does not challenge him.' },
      5: { text: 'June 2023 — Village attacked, father killed, I was taken. June to October 2023 — Held in militia camp, subjected to repeated sexual violence. October 2023 — Escaped with help of a church worker during a camp relocation. November 2023 to August 2024 — Hiding in Bukavu with church support. September 2024 — Church network helped me travel to Uganda. February 2025 — Arrived in Canada via a flight from Kampala.' },
      6: { choice: 'yes', detail: 'Two other women were taken with me. Many other girls in surrounding villages have been taken by the same militia. Sexual violence by armed groups is widespread and systematic in eastern DRC.' },
      7: { choice: 'tried', detail: 'The church worker approached the FARDC soldiers stationed near our village. They said it was a family matter and they could not get involved. Everyone knows the FARDC and the militias sometimes cooperate.' },
      8: { text: 'The FARDC treats sexual violence by militias as normal. There is no functioning justice system in South Kivu for these cases. The police are afraid of the militias. Going to them would only put me in more danger.' },
      9: { text: 'While hiding in Bukavu, I learned that "Colonel Bosco" had sent men looking for me. He considered me his property. The church worker who helped me told me I had to leave the country because they could not protect me any longer.' },
      10: 'none',
      11: { choice: 'yes', detail: 'I traveled overland from Bukavu to Kampala, Uganda, with forged travel documents arranged by the church network. I stayed in Kampala for 5 months in a refugee settlement while my case was being arranged.' },
      12: { text: 'If I return, I will be recaptured by the militia. "Colonel Bosco" considers me his property. Women who have escaped and been recaptured have been severely punished — some have been killed. I cannot go back.' },
      13: 'worse',
      14: { choice: 'no', detail: 'Eastern DRC is all controlled by various armed groups. Even in Kinshasa, which is far away, Congolese women from the east face discrimination and have no support networks. The DRC government cannot protect civilians from militia violence.' },
      15: { choice: 'yes', detail: 'The militia has networks and informants. When I was hiding in Bukavu, they found out where I was within weeks. They have connections with traders and transporters who travel throughout eastern DRC.' },
    },
    p2: {
      0: { text: 'I have a letter from the church worker in Bukavu confirming what happened. I have medical records from the refugee clinic in Kampala documenting injuries consistent with sexual violence. I also have a letter from my mother confirming the attack on our village.' },
      1: { text: 'I am currently receiving trauma counseling at a CLSC in Montreal. I was diagnosed with PTSD. I have nightmares, flashbacks, and difficulty being around men I don\'t know. I am also receiving gynecological care for injuries from the violence.' },
    },
  },
  '6142-QC': {
    p0: {
      0: 'Man', 1: '36-50', 2: 'Colombia', 3: 'political',
      4: 'I am a journalist from Medellín. I investigated corruption involving local politicians and the Clan del Golfo cartel. After publishing articles exposing their connection, I received death threats. My colleague who worked on the same story was murdered in December 2024. The police investigation went nowhere — I believe the police are compromised.',
      5: { incidents: '2024-06', left: '2025-01', arrived: '2025-02' },
      6: { choice: 'tried', detail: 'I filed complaints with the Fiscalía (prosecutor\'s office) twice. Both times, the investigation stalled. A detective privately told me the case was "too sensitive" and advised me to leave the country.' },
      7: { choice: 'no', detail: 'The Clan del Golfo operates nationally. They have killed journalists in Bogotá, Cali, and Barranquilla. The Colombian government\'s protection program for journalists (CERREM) is underfunded and has failed to protect several journalists who were later killed.' },
      8: { province: 'Quebec', duration: '1 year, 3 months' },
    },
    p1: {
      0: { text: 'I was born in Medellín, studied journalism at Universidad de Antioquia, and worked for 15 years as an investigative journalist. I specialized in reporting on organized crime and political corruption in Antioquia department.' },
      1: { text: 'I have no formal political affiliation. My political expression is through my journalism. I believe in press freedom and government accountability. In Colombia, this is considered a political opinion because it challenges powerful people.' },
      2: { text: 'I had a good career, a family, a house in Medellín. I was respected in my profession. I won the Simón Bolívar journalism prize in 2022. My life was normal until I began investigating the Clan del Golfo connections.' },
      3: { text: 'In June 2024, I published the first article linking the Clan del Golfo to local politicians in Antioquia. Within a week, I received phone calls telling me to stop or face consequences.' },
      4: { text: 'The threats came from members of the Clan del Golfo, Colombia\'s largest neo-paramilitary organization. They work hand-in-hand with corrupt local officials, including a sitting member of the departmental assembly.' },
      5: { text: 'June 2024 — Published first investigative article. June 2024 — First phone threats. August 2024 — My car was followed by motorcycles on two occasions. October 2024 — A written death threat was left at my office. December 2024 — My colleague Carlos Muñoz was shot and killed. January 2025 — I fled Colombia with my family.' },
      6: { choice: 'yes', detail: 'My colleague Carlos Muñoz was murdered in December 2024. He was shot three times outside his home. Other journalists covering the same story have received threats and several have gone into hiding or exile.' },
      7: { choice: 'tried', detail: 'I filed two formal complaints with the Fiscalía. I was enrolled in the CERREM journalist protection program. They assigned me a bodyguard for 3 months, but the protection was withdrawn due to "budget constraints." The investigation into the threats produced no results.' },
      8: { text: 'After my colleague was killed, I realized the state protection program was completely inadequate. A detective I trust told me the investigation was being blocked from above. He said, "Go, while you still can."' },
      9: { text: 'When Carlos was murdered on December 12, 2024, I knew I was next. We were working on the same investigation. The same people who threatened me killed him. I started planning to leave immediately.' },
      10: 'valid',
      11: { choice: 'yes', detail: 'I flew from Bogotá to Mexico City, then to Montreal. I used my own passport. I entered Canada on a tourist visa that I had from a previous conference trip.' },
      12: { text: 'If I return, I will be killed like Carlos. The Clan del Golfo has killed over 30 journalists and human rights defenders in the past 5 years. Not a single perpetrator has been convicted. The message is clear — anyone who speaks will be silenced.' },
      13: 'worse',
      14: { choice: 'no', detail: 'The Clan del Golfo operates in 28 of Colombia\'s 32 departments. They have killed people in every major city. The CERREM protection program has been unable to stop the killings. There is no safe place in Colombia for someone who has exposed their operations.' },
      15: { choice: 'yes', detail: 'They tracked my movements using motorcycle surveillance. They knew where my office was, where my children went to school, where my wife worked. If I return, they will find me.' },
    },
    p2: {
      0: { text: 'I have copies of all published articles with my byline. I have screenshots of the threatening messages. I have the police complaint filing numbers. I have Carlos\'s death certificate and news articles about his murder. I have the letter from the Fiscalía detective.' },
      1: { text: 'I suffer from anxiety and insomnia since Carlos was killed. I am seeing a therapist in Montreal. My wife has been diagnosed with depression since we arrived. My children are having difficulty adjusting and my daughter has nightmares.' },
      2: { text: 'Reporters Without Borders has documented Colombia as one of the most dangerous countries for journalists. I can provide their reports. The Committee to Protect Journalists (CPJ) has a file on my case.' },
    },
  },
}

// Build sample answers for cases that don't have custom ones
function buildGenericAnswers(caseObj) {
  const groundMap = {
    'Section 96 — Refugee': 'political',
    'Section 97 — Person in Need of Protection': 'psg',
    'Both 96 & 97': 'political',
    'Section 97 — Medical Ineligible': 'psg',
  }
  return {
    p0: {
      0: 'Man', 1: '26-35', 2: caseObj.country, 3: groundMap[caseObj.legalCategory] || 'political',
      4: `I experienced persecution in ${caseObj.country} related to ${caseObj.detailTag || 'my personal situation'}. I was forced to flee for my safety after multiple incidents that made it impossible to continue living there.`,
      5: { incidents: '2024-01', left: '2025-01', arrived: '2025-03' },
      6: { choice: 'tried', detail: 'I attempted to seek help from local authorities but they were unable or unwilling to provide protection.' },
      7: { choice: 'no', detail: `I could not relocate safely within ${caseObj.country}. The threats I faced extended beyond my immediate area.` },
      8: { province: 'Quebec', duration: '1 year' },
    },
    p1: {
      0: { text: `I grew up in ${caseObj.country}. I had a normal childhood and received education in my community.` },
      1: { text: 'I prefer not to go into detail about my religious and ethnic background at this time.' },
      2: { text: 'Before the problems began, I had a stable life with work and family.' },
      3: { text: 'The problems began when I became a target due to my background and activities.' },
      4: { text: 'The people responsible were individuals with power and connections in my area.' },
      5: { text: 'There were multiple incidents over a period of several months that escalated in severity.' },
      6: { choice: 'yes', detail: 'Others in my community were also affected by similar threats and violence.' },
      7: { choice: 'tried', detail: 'I attempted to file a complaint but the authorities were not helpful.' },
      8: { text: 'The authorities did not take my situation seriously.' },
      9: { text: 'The final event was a direct threat that made me realize I had to leave immediately for my safety.' },
      10: 'other',
      11: { choice: 'no' },
      12: { text: 'I fear for my life if I am forced to return.' },
      13: 'worse',
      14: { choice: 'no', detail: 'There is no safe area within my country where I could live without fear.' },
      15: { choice: 'yes', detail: 'The people who threatened me have the resources and connections to find me anywhere in the country.' },
    },
    p2: {
      0: { text: 'I have some documents that may support my claim. I am gathering what I can.' },
    },
  }
}

export function getMockAnswersForCase(caseId) {
  if (SAMPLE_ANSWERS[caseId]) return SAMPLE_ANSWERS[caseId]
  const c = mockCases.find(mc => mc.id === caseId)
  return c ? buildGenericAnswers(c) : buildGenericAnswers({ country: 'Unknown', legalCategory: 'Section 96 — Refugee', detailTag: '' })
}

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

export function getMockDossierForCase(caseObj, lang = 'en') {
  if (!caseObj) return getMockDossierForCase({ country: 'Unknown', claimStrength: 'Moderate', legalCategory: 'Section 96 — Refugee', detailTag: '' }, lang)
  const fr = lang === 'fr'

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
      { area: fr ? 'Précision chronologique' : 'Timeline specificity', detail: fr ? 'Le demandeur peut-il fournir des dates plus précises pour les événements de persécution décrits ?' : 'Can the claimant provide more precise dates for the key persecution events described in the narrative?', irpaRelevance: fr ? 'Une chronologie précise renforce l\'évaluation de la cohérence narrative sous l\'art. 96.' : 'Precise timelines strengthen the narrative coherence assessment under s.96.' },
      { area: fr ? 'Identification du persécuteur' : 'Persecutor identification', detail: fr ? 'Quel rôle ou quelle capacité le(s) persécuteur(s) avai(en)t-il(s) ? Étaient-ils des acteurs étatiques ou non étatiques ?' : 'What specific role or capacity did the persecutor(s) hold? Were they state actors, agents of the state, or non-state actors?', irpaRelevance: fr ? 'La distinction entre acteurs étatiques et non étatiques affecte l\'analyse de la protection de l\'État.' : 'The distinction between state and non-state actors affects the state protection analysis.' },
      ...(hasIFA ? [{ area: fr ? 'Possibilité de refuge intérieur' : 'Internal Flight Alternative', detail: fr ? 'Pourquoi la réinstallation dans le pays n\'était-elle pas une option sûre ? Quels risques le demandeur courrait-il dans d\'autres régions ?' : 'Why was relocation within the country not a viable safety option? What specific risks would the claimant face in other regions?', irpaRelevance: fr ? 'La CISR évaluera s\'il existe une PRI viable. Celle-ci doit être explicitement réfutée.' : 'The IRB will assess whether a viable IFA exists. This must be explicitly rebutted.' }] : []),
      { area: fr ? 'Protection de l\'État' : 'State protection', detail: fr ? 'Quelles démarches ont été entreprises pour obtenir la protection des autorités, et quel en a été le résultat ?' : 'What specific steps were taken to seek protection from state authorities, and what was the outcome?', irpaRelevance: fr ? 'Sous l\'art. 96, le demandeur doit démontrer que la protection de l\'État était inadéquate ou indisponible.' : 'Under s.96, the claimant must demonstrate state protection was unavailable, inadequate, or dangerous to seek.' },
      { area: fr ? 'Preuves corroborantes' : 'Corroborating evidence', detail: fr ? 'Le demandeur a-t-il accès à de la documentation — dossiers médicaux, rapports de police, articles, témoignages ou photographies ?' : 'Does the claimant have access to any documentation — medical records, police reports, news articles, witness statements, or photographs?', irpaRelevance: fr ? 'Les preuves documentaires renforcent la demande, bien que leur absence n\'exclut pas la protection.' : 'Documentary evidence strengthens the claim, though its absence does not preclude protection.' },
    ],
    ifaAssessment: {
      likely: true,
      addressed: !hasIFA,
      analysis: hasIFA
        ? (fr ? 'La possibilité de refuge intérieur (PRI) n\'a pas été abordée dans le récit actuel. La CISR est très susceptible de soulever cette question. Le conseiller devrait préparer une réfutation détaillée avec des preuves spécifiques au pays.' : 'The Internal Flight Alternative has not been addressed in the current narrative. The IRB is very likely to raise this issue. Counsel should prepare a detailed IFA rebuttal with country-specific evidence.')
        : (fr ? 'Le demandeur a abordé la réinstallation interne. L\'analyse de la PRI devrait être revue avant l\'audience.' : 'The claimant has addressed internal relocation. The IFA analysis should be reviewed for completeness before the hearing.'),
    },
    stateProtection: {
      sought: caseObj.detailTag === 'State actor' ? false : true,
      adequate: false,
      analysis: caseObj.detailTag === 'State actor'
        ? (fr ? 'Le persécuteur est identifié comme un acteur étatique, ce qui compromet fondamentalement la disponibilité de la protection de l\'État. C\'est un élément fort de la demande sous l\'art. 96.' : 'The persecutor is identified as a state actor, which fundamentally undermines the availability of state protection. This is a strong element of the claim under s.96.')
        : (fr ? 'La protection de l\'État n\'a pas été demandée ou était inadéquate. Des détails supplémentaires sur les plaintes formelles ou les raisons de ne pas avoir cherché protection sont nécessaires.' : 'State protection was either not sought or was inadequate. Further detail on formal complaints or reasons for not seeking protection should be documented.'),
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
        currentStatus: caseObj.hearingDate ? (fr ? 'Préparation pré-audience' : 'Pre-hearing preparation') : daysUntil(bocDate) > 0 ? (fr ? 'En attente de soumission du FDA' : 'Awaiting BOC submission') : (fr ? 'Échéance FDA dépassée — accélérer' : 'BOC deadline passed — expedite'),
        narrativeSummary: `The claimant is a national of ${caseObj.country} who seeks refugee protection on the basis of ${ground.replace(/_/g, ' ')}. ${caseObj.detailTag === 'State actor' ? 'The alleged persecutor has been identified as a state actor, which is a significant element strengthening the claim.' : `The claimant reports ${caseObj.detailTag?.toLowerCase() || 'persecution'} in their country of origin.`} The claimant entered Canada and has been residing in Quebec. ${hasIFA ? 'The Internal Flight Alternative has not been addressed in the current narrative and the IRB is likely to raise this issue.' : 'The claimant has addressed the Internal Flight Alternative.'} State protection ${caseObj.detailTag === 'State actor' ? 'is fundamentally compromised given the involvement of state actors' : 'was either not sought or was inadequate'}. The claim strength is assessed as ${caseObj.claimStrength}.`,
        timelineEvents: [
          { date: fmt(addDays(filed, -365)), event: fr ? 'Premier incident de persécution signalé' : 'First persecution incident reported by claimant', type: 'persecution' },
          { date: fmt(addDays(filed, -180)), event: fr ? 'Escalade — menaces directes au demandeur et sa famille' : 'Escalation — direct threats to claimant and family', type: 'persecution' },
          { date: fmt(addDays(filed, -90)), event: fr ? `Départ de ${caseObj.country}` : `Departed ${caseObj.country}`, type: 'travel' },
          { date: fmt(addDays(filed, -30)), event: fr ? 'Transit par un pays tiers' : 'Transit through third country', type: 'travel' },
          { date: fmt(filed), event: fr ? 'Arrivée au Canada — demande d\'asile déposée' : 'Arrived in Canada — asylum claim filed', type: 'canada' },
          { date: fmt(eligDate), event: fr ? 'Entrevue d\'admissibilité (estimée)' : 'Eligibility interview (estimated)', type: 'canada' },
          { date: fmt(bocDate), event: fr ? 'Échéance du FDA' : 'BOC form deadline', type: 'canada' },
          ...(caseObj.hearingDate ? [{ date: caseObj.hearingDate, event: fr ? 'Audience SPR prévue' : 'RPD hearing scheduled', type: 'canada' }] : []),
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
          { name: fr ? 'Entrevue d\'admissibilité' : 'Eligibility interview', dueDate: fmt(eligDate), daysRemaining: daysUntil(eligDate) },
          { name: fr ? 'Soumission du FDA' : 'BOC form submission', dueDate: fmt(bocDate), daysRemaining: daysUntil(bocDate) },
          { name: fr ? 'Communication de documents' : 'Document disclosure', dueDate: fmt(discDate), daysRemaining: daysUntil(discDate) },
          { name: caseObj.hearingDate ? (fr ? 'Audience SPR' : 'RPD hearing') : (fr ? 'Audience estimée' : 'Estimated hearing'), dueDate: fmt(hearingEst), daysRemaining: daysUntil(hearingEst) },
        ],
        legalExclusionFlags: [
          { issue: fr ? 'Entente sur les tiers pays sûrs' : 'Safe Third Country Agreement', severity: 'MEDIUM', irpaSection: 's.101(1)(e)', explanation: fr ? 'Si le demandeur est entré au Canada depuis les É.-U. à un point d\'entrée désigné, l\'ETPS pourrait s\'appliquer. Exceptions : famille au Canada, mineur non accompagné, ou visa canadien valide.' : 'If the claimant entered Canada from the US at a designated port of entry, the STCA may bar the claim. Exceptions include having family in Canada, being an unaccompanied minor, or holding a valid Canadian visa. Verify entry method.' },
          { issue: fr ? 'Demandes antérieures dans d\'autres pays' : 'Prior claims in other countries', severity: 'LOW', irpaSection: 's.101(1)(c.1)', explanation: fr ? 'Aucune indication de demandes antérieures. À confirmer avec le demandeur lors de la préparation du FDA.' : 'No indication of prior claims in other countries. Confirm with claimant during BOC preparation.' },
          { issue: fr ? 'Filtrage de sécurité' : 'Security inadmissibility screening', severity: 'LOW', irpaSection: 's.34 IRPA', explanation: fr ? 'Aucun indicateur d\'interdiction de territoire pour raisons de sécurité identifié. Filtrage standard applicable.' : 'No indicators of security-related inadmissibility identified. Standard screening applies.' },
          ...(caseObj.detailTag === 'Minor claimant' ? [{ issue: fr ? 'Demandeur mineur — représentant désigné requis' : 'Minor claimant — designated representative required', severity: 'HIGH', irpaSection: 's.167(2)', explanation: fr ? 'Le demandeur est mineur. Un représentant désigné doit être nommé avant l\'audience de la SPR.' : 'The claimant is a minor. A designated representative must be appointed before the RPD hearing. This is a mandatory procedural requirement.' }] : []),
        ],
        narrativeFlags: [
          { issue: fr ? 'Écart entre le dernier incident et le départ' : 'Gap between last incident and departure', phase: 0, answerId: 'p0-5', quote: fr ? 'La chronologie indique un écart entre le dernier événement de persécution et le départ du pays d\'origine.' : 'Timeline indicates a gap between the last persecution event and departure from country of origin.' },
          { issue: fr ? 'La protection de l\'État manque de détails' : 'State protection claim needs detail', phase: 0, answerId: 'p0-6', quote: fr ? 'Le récit du demandeur concernant les tentatives de protection de l\'État manque de précision.' : 'The claimant\'s account of state protection attempts lacks specificity regarding formal complaints or police reports.' },
          ...(hasIFA ? [{ issue: fr ? 'PRI non abordée' : 'IFA not addressed', phase: 0, answerId: 'p0-7', quote: fr ? 'La possibilité de refuge intérieur n\'a pas été abordée. La CISR soulèvera probablement cette question.' : 'The Internal Flight Alternative has not been addressed. The IRB will likely raise this issue.' }] : []),
          { issue: fr ? 'Capacité du persécuteur floue' : 'Persecutor capacity unclear', phase: 1, answerId: 'p1-4', quote: fr ? 'Le rôle, la portée et la capacité du/des persécuteur(s) nécessitent des précisions.' : 'The role, reach, and capacity of the persecutor(s) needs further clarification.' },
        ],
        conventionGroundAnalysis: `Primary ground: ${ground.replace(/_/g, ' ')} under IRPA s.96. The claimant from ${caseObj.country} describes persecution consistent with the Convention refugee definition. ${caseObj.legalCategory.includes('97') ? 'A parallel s.97(1) claim for risk to life or cruel and unusual treatment should also be considered.' : ''} The claim strength is assessed as ${caseObj.claimStrength.toLowerCase()}.`,
        narrativeAssessment: 'The narrative provides a substantive foundation but requires targeted supplementation in the flagged areas. Timeline gaps and state protection documentation are the primary areas for counsel attention. These gaps should be explored compassionately — they may reflect trauma, memory fragmentation, or language barriers.',
        recommendedActions: [
          fr ? 'Obtenir une déclaration détaillée comblant les lacunes chronologiques entre les incidents clés' : 'Obtain a detailed statutory declaration addressing timeline gaps between key incidents',
          fr ? 'Documenter les tentatives de protection de l\'État ou expliquer pourquoi les voies formelles n\'étaient pas disponibles' : 'Document state protection attempts with specificity, or explain why formal channels were unavailable',
          hasIFA ? (fr ? 'Préparer une réfutation complète de la PRI appuyée par des rapports sur les conditions du pays' : 'Prepare a comprehensive IFA rebuttal supported by current country condition reports') : (fr ? 'Revoir la position sur la PRI et préparer des preuves sur les conditions du pays' : 'Review IFA position and prepare supporting country condition evidence'),
          fr ? 'Identifier et rassembler toute preuve corroborante disponible (médicale, documentaire, testimoniale)' : 'Identify and collect any available corroborating evidence (medical, documentary, testimonial)',
          fr ? 'Consulter le Cartable national de documentation pour les conditions à jour du pays' : 'Review National Documentation Package for updated country conditions',
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
