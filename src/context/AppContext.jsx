import { createContext, useContext, useState, useCallback } from 'react'

const translations = {
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
      value={{ language, setLanguage, role, setRole, sessionPin, setSessionPin, t }}
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
