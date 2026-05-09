import { createContext, useContext, useState, useCallback } from 'react'

const translations = {
  // ── Interview navigation ──
  'interview.prev': { fr: '← Retour', en: '← Back', es: '← Atrás', ht: '← Retounen' },
  'interview.next': { fr: 'Suivant →', en: 'Next →', es: 'Siguiente →', ht: 'Swivan →' },
  'interview.skip': { fr: 'Passer', en: 'Skip', es: 'Omitir', ht: 'Pase' },
  'interview.confirm.question': { fr: 'C\'est exact ?', en: 'Is that right?', es: '¿Es correcto?', ht: 'Eske sa a kòrèk?' },
  'interview.confirm.yes': { fr: 'Oui, c\'est ça', en: 'Yes, that\'s right', es: 'Sí, correcto', ht: 'Wi, sa a kòrèk' },
  'interview.confirm.change': { fr: 'Modifier', en: 'Change it', es: 'Cambiarlo', ht: 'Chanje li' },
  'interview.done.heading': { fr: 'Vos réponses sont prêtes.', en: 'Your answers are ready.', es: 'Sus respuestas están listas.', ht: 'Repons ou yo pare.' },
  'interview.done.body': { fr: 'Merci de nous avoir partagé votre histoire. Vous pouvez maintenant transmettre votre dossier.', en: 'Thank you for sharing your story. You can now send your file.', es: 'Gracias por compartir su historia. Ahora puede enviar su expediente.', ht: 'Mèsi pou pataje istwa ou. Ou ka voye dosye ou kounye a.' },
  'interview.done.submit': { fr: 'Continuer', en: 'Continue', es: 'Continuar', ht: 'Kontinye' },

  // ── Q1: Sex ──
  'q1.prompt': { fr: 'Pour commencer — comment vous identifiez-vous ?', en: 'To start — how do you identify?', es: 'Para comenzar — ¿cómo se identifica?', ht: 'Pou kòmanse — kijan ou idantifye tèt ou?' },
  'q1.man': { fr: 'Homme', en: 'Man', es: 'Hombre', ht: 'Gason' },
  'q1.woman': { fr: 'Femme', en: 'Woman', es: 'Mujer', ht: 'Fanm' },
  'q1.nonbinary': { fr: 'Non-binaire', en: 'Non-binary', es: 'No binario', ht: 'Non-binè' },
  'q1.notsay': { fr: 'Préfère ne pas répondre', en: 'Prefer not to say', es: 'Prefiero no decirlo', ht: 'Prefere pa di' },

  // ── Q2: Age group ──
  'q2.prompt': { fr: 'Quel est votre groupe d\'âge ?', en: 'Which age group are you in?', es: '¿En qué grupo de edad está?', ht: 'Ki gwoup laj ou ye?' },

  // ── Q3: Country ──
  'q3.prompt': { fr: 'De quel pays venez-vous ?', en: 'What country are you from?', es: '¿De qué país viene?', ht: 'Ki peyi ou soti?' },
  'q3.search': { fr: 'Chercher un pays…', en: 'Search for a country…', es: 'Buscar un país…', ht: 'Chèche yon peyi…' },

  // ── Q4: Persecution ground ──
  'q4.prompt': { fr: 'Pourquoi craignez-vous de retourner dans votre pays ?', en: 'Why are you afraid to return to your country?', es: '¿Por qué teme regresar a su país?', ht: 'Poukisa ou pè retounen nan peyi ou?' },
  'q4.race': { fr: 'Race ou ethnie', en: 'Race or ethnicity', es: 'Raza o etnia', ht: 'Ras oswa etni' },
  'q4.religion': { fr: 'Religion', en: 'Religion', es: 'Religión', ht: 'Relijyon' },
  'q4.nationality': { fr: 'Nationalité', en: 'Nationality', es: 'Nacionalidad', ht: 'Nasyonalite' },
  'q4.political': { fr: 'Opinion politique', en: 'Political opinion', es: 'Opinión política', ht: 'Opinyon politik' },
  'q4.psg': { fr: 'Appartenance à un groupe social', en: 'Membership in a social group', es: 'Pertenencia a un grupo social', ht: 'Manm nan yon gwoup sosyal' },

  // ── Q5: Narrative ──
  'q5.prompt': { fr: 'Racontez-nous ce qui s\'est passé. Prenez votre temps.', en: 'Tell us what happened. Take your time.', es: 'Cuéntenos qué pasó. Tómese su tiempo.', ht: 'Rakonte nou sa ki te pase. Pran tan ou.' },
  'q5.placeholder': { fr: 'Vous pouvez écrire ici, ou utiliser le microphone pour parler…', en: 'You can write here, or use the microphone to speak…', es: 'Puede escribir aquí, o usar el micrófono para hablar…', ht: 'Ou ka ekri isit la, oswa itilize mikwofòn pou pale…' },
  'q5.mic': { fr: 'Appuyer pour parler', en: 'Tap to speak', es: 'Toque para hablar', ht: 'Touche pou pale' },

  // ── Q6: Dates ──
  'q6.prompt': { fr: 'Quelques dates importantes — faites de votre mieux.', en: 'A few important dates — do your best.', es: 'Algunas fechas importantes — haga lo que pueda.', ht: 'Kèk dat enpòtan — fè sa ou kapab.' },
  'q6.incidents': { fr: 'Quand les incidents ont-ils eu lieu ?', en: 'When did the incidents happen?', es: '¿Cuándo ocurrieron los incidentes?', ht: 'Ki lè ensidan yo te pase?' },
  'q6.left': { fr: 'Quand avez-vous quitté votre pays ?', en: 'When did you leave your country?', es: '¿Cuándo salió de su país?', ht: 'Ki lè ou te kite peyi ou?' },
  'q6.arrived': { fr: 'Quand êtes-vous arrivé(e) au Canada ?', en: 'When did you arrive in Canada?', es: '¿Cuándo llegó a Canadá?', ht: 'Ki lè ou te rive Kanada?' },

  // ── Q7: State protection ──
  'q7.prompt': { fr: 'Avez-vous demandé de l\'aide aux autorités de votre pays ?', en: 'Did you ask for help from authorities in your country?', es: '¿Pidió ayuda a las autoridades de su país?', ht: 'Èske ou te mande otorite nan peyi ou pou èd?' },
  'q7.yes': { fr: 'Oui', en: 'Yes', es: 'Sí', ht: 'Wi' },
  'q7.no': { fr: 'Non', en: 'No', es: 'No', ht: 'Non' },
  'q7.tried': { fr: 'J\'ai essayé mais ils n\'ont pas aidé', en: 'I tried but they didn\'t help', es: 'Lo intenté pero no me ayudaron', ht: 'Mwen te eseye men yo pa t ede' },
  'q7.detail': { fr: 'Pouvez-vous expliquer pourquoi vous n\'avez pas pu obtenir d\'aide ?', en: 'Can you explain why you couldn\'t get help?', es: '¿Puede explicar por qué no pudo obtener ayuda?', ht: 'Èske ou ka eksplike poukisa ou pa t kapab jwenn èd?' },

  // ── Q8: IFA ──
  'q8.prompt': { fr: 'Y a-t-il une région sûre dans votre pays où vous pourriez vivre ?', en: 'Is there a safe region in your country where you could live?', es: '¿Hay una región segura en su país donde podría vivir?', ht: 'Èske gen yon rejyon ki an sekirite nan peyi ou kote ou ta ka viv?' },
  'q8.yes': { fr: 'Oui', en: 'Yes', es: 'Sí', ht: 'Wi' },
  'q8.no': { fr: 'Non', en: 'No', es: 'No', ht: 'Non' },
  'q8.unknown': { fr: 'Je ne sais pas', en: 'I don\'t know', es: 'No lo sé', ht: 'Mwen pa konnen' },
  'q8.detail': { fr: 'Pouvez-vous expliquer pourquoi vous ne pouvez pas déménager ?', en: 'Can you explain why you can\'t relocate?', es: '¿Puede explicar por qué no puede reubicarse?', ht: 'Èske ou ka eksplike poukisa ou pa ka deplase?' },

  // ── Q9: Province + duration ──
  'q9.prompt': { fr: 'Où vivez-vous au Canada et depuis combien de temps ?', en: 'Where in Canada do you live and for how long?', es: '¿Dónde vive en Canadá y desde cuándo?', ht: 'Ki kote ou rete nan Kanada ak depi konbyen tan?' },
  'q9.province': { fr: 'Province ou territoire', en: 'Province or territory', es: 'Provincia o territorio', ht: 'Pwovens oswa teritwa' },
  'q9.duration': { fr: 'Depuis combien de temps ? (ex : 6 mois, 2 ans)', en: 'For how long? (e.g. 6 months, 2 years)', es: '¿Desde cuándo? (ej.: 6 meses, 2 años)', ht: 'Depi konbyen tan? (ex: 6 mwa, 2 an)' },
  // PIN display screen
  'pin.heading': {
    fr: 'Votre numéro de dossier',
    en: 'Your file number',
    es: 'Su número de expediente',
    ht: 'Nimewo dosye ou',
  },
  'pin.instruction': {
    fr: 'Notez ce numéro. La clinique utilisera ce code pour retrouver votre dossier.',
    en: 'Write this down. The clinic will use this number to find your file.',
    es: 'Anote este número. La clínica usará este código para encontrar su expediente.',
    ht: 'Ekri sa a. Klinik la ap itilize nimewo sa a pou jwenn dosye ou.',
  },
  'pin.cta': {
    fr: 'Je l\'ai noté',
    en: 'I\'ve written it down',
    es: 'Lo he anotado',
    ht: 'Mwen te ekri li',
  },

  // Landing — language bar
  'lang.fr': { fr: 'Français', en: 'Français', es: 'Français', ht: 'Français' },
  'lang.en': { fr: 'English', en: 'English', es: 'English', ht: 'English' },
  'lang.es': { fr: 'Español', en: 'Español', es: 'Español', ht: 'Español' },
  'lang.ht': { fr: 'Kreyòl', en: 'Kreyòl', es: 'Kreyòl', ht: 'Kreyòl' },
  'lang.more': { fr: 'More...', en: 'More...', es: 'More...', ht: 'More...' },

  // Landing — identity
  'landing.tagline': {
    fr: 'Votre guide pour la protection au Canada',
    en: 'Your guide to protection in Canada',
    es: 'Su guía para la protección en Canadá',
    ht: 'Gid ou pou pwoteksyon nan Kanada',
  },
  'landing.disclaimer': {
    fr: 'Cet outil ne constitue pas un avis juridique. / This tool does not constitute legal advice.',
    en: 'This tool does not constitute legal advice. / Cet outil ne constitue pas un avis juridique.',
    es: 'Esta herramienta no constituye asesoramiento jurídico.',
    ht: 'Zouti sa a pa konstitye konsèy legal.',
  },

  // Landing — seeker card
  'landing.seeker.title': {
    fr: 'Demandeur d\'asile',
    en: 'Asylum seeker',
    es: 'Solicitante de asilo',
    ht: 'Moun k ap chèche azil',
  },
  'landing.seeker.subtitle': {
    fr: 'Commencez votre demande',
    en: 'Start your application',
    es: 'Comience su solicitud',
    ht: 'Kòmanse aplikasyon ou',
  },

  // Landing — clinic card
  'landing.clinic.title': {
    fr: 'Professionnel juridique',
    en: 'Legal professional',
    es: 'Profesional jurídico',
    ht: 'Pwofesyonèl legal',
  },
  'landing.clinic.subtitle': {
    fr: 'Accéder au tableau de bord',
    en: 'Access the dashboard',
    es: 'Acceder al panel',
    ht: 'Aksede tablo bò',
  },

  // Seeker welcome
  'seeker.welcome.heading': {
    fr: 'Vous êtes en sécurité ici.',
    en: 'You are safe here.',
    es: 'Está seguro aquí.',
    ht: 'Ou an sekirite isit la.',
  },
  'seeker.welcome.body': {
    fr: 'Cet outil vous aide à préparer votre histoire pour votre conseiller juridique. Vous pouvez vous arrêter à tout moment et revenir plus tard. Rien n\'est partagé sans votre permission.',
    en: 'This tool helps you prepare your story for your legal helper. You can stop at any time and come back later. Nothing is shared without your permission.',
    es: 'Esta herramienta le ayuda a preparar su historia para su asesor legal. Puede detenerse en cualquier momento y volver más tarde. Nada se comparte sin su permiso.',
    ht: 'Zouti sa a ede ou prepare istwa ou pou konseye legal ou. Ou ka kanpe nenpòt lè epi retounen pita. Anyen pa pataje san pèmisyon ou.',
  },
  'seeker.welcome.start': {
    fr: 'Commencer',
    en: 'Start',
    es: 'Comenzar',
    ht: 'Kòmanse',
  },
  'seeker.welcome.back': {
    fr: '← Retour',
    en: '← Back',
    es: '← Volver',
    ht: '← Retounen',
  },

  // Seeker shell — pause button
  'seeker.pause': {
    fr: 'Pause — revenir plus tard',
    en: 'Pause — come back later',
    es: 'Pausa — volver más tarde',
    ht: 'Pòz — retounen pita',
  },
  'seeker.pause.alert': {
    fr: 'La fonctionnalité PIN arrive bientôt.',
    en: 'PIN feature coming soon.',
    es: 'La función PIN estará disponible pronto.',
    ht: 'Fonksyon PIN ap vini byento.',
  },

  // Clinic
  'clinic.nav.logo': { fr: 'Refuge', en: 'Refuge', es: 'Refuge', ht: 'Refuge' },
  'clinic.nav.logout': {
    fr: 'Déconnexion',
    en: 'Logout',
    es: 'Cerrar sesión',
    ht: 'Dekonekte',
  },
  'clinic.login.heading': {
    fr: 'Accès clinique juridique',
    en: 'Legal clinic access',
    es: 'Acceso clínica jurídica',
    ht: 'Aksè klinik legal',
  },
  'clinic.login.email': {
    fr: 'Courriel',
    en: 'Email',
    es: 'Correo electrónico',
    ht: 'Imèl',
  },
  'clinic.login.password': {
    fr: 'Mot de passe',
    en: 'Password',
    es: 'Contraseña',
    ht: 'Mo de pas',
  },
  'clinic.login.submit': {
    fr: 'Se connecter',
    en: 'Log in',
    es: 'Iniciar sesión',
    ht: 'Konekte',
  },
  'clinic.login.hint': {
    fr: 'Vous avez reçu vos identifiants de votre organisation.',
    en: 'You received your credentials from your organisation.',
    es: 'Recibió sus credenciales de su organización.',
    ht: 'Ou te resevwa idantifyan ou nan men òganizasyon ou.',
  },

  // Clinic dashboard
  'clinic.dashboard.heading': {
    fr: 'Tableau de bord',
    en: 'Dashboard',
    es: 'Panel de control',
    ht: 'Tablo bò',
  },
  'clinic.dashboard.session': {
    fr: 'Session',
    en: 'Session',
    es: 'Sesión',
    ht: 'Sesyon',
  },
  'clinic.dashboard.urgency': {
    fr: 'Urgence',
    en: 'Urgency',
    es: 'Urgencia',
    ht: 'Ijans',
  },
  'clinic.dashboard.category': {
    fr: 'Catégorie',
    en: 'Category',
    es: 'Categoría',
    ht: 'Kategori',
  },
  'clinic.dashboard.status': {
    fr: 'Statut',
    en: 'Status',
    es: 'Estado',
    ht: 'Estati',
  },
  'clinic.dashboard.urgent': {
    fr: 'Urgent',
    en: 'Urgent',
    es: 'Urgente',
    ht: 'Ijan',
  },
  'clinic.dashboard.normal': {
    fr: 'Normal',
    en: 'Normal',
    es: 'Normal',
    ht: 'Nòmal',
  },
  'clinic.dashboard.pending': {
    fr: 'En attente',
    en: 'Pending',
    es: 'Pendiente',
    ht: 'An atant',
  },
  'clinic.dashboard.placeholder': {
    fr: 'Fonctionnalité complète à venir bientôt.',
    en: 'Full case functionality coming soon.',
    es: 'Funcionalidad completa próximamente.',
    ht: 'Fonksyonalite konplè ap vini byento.',
  },
}

const AppContext = createContext()

export function AppProvider({ children }) {
  const [language, setLanguage] = useState('fr')
  const [role, setRole] = useState(null)
  const [sessionPin, setSessionPin] = useState(null)
  const [interviewAnswers, setInterviewAnswers] = useState({})

  const t = useCallback(
    (key) => {
      const entry = translations[key]
      if (!entry) return key
      return entry[language] || entry['fr'] || key
    },
    [language]
  )

  return (
    <AppContext.Provider
      value={{ language, setLanguage, role, setRole, sessionPin, setSessionPin, interviewAnswers, setInterviewAnswers, t }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
