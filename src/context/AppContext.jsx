import { createContext, useContext, useState, useCallback } from 'react'
import { mockCases } from '../lib/mockCases'

const translations = {
  // ── Phase 1 — narrative drafting (12 questions) ──
  'p1q1.prompt': { fr: 'Où êtes-vous né(e) et où avez-vous grandi ?', en: 'Where were you born, and where did you grow up?', es: '¿Dónde nació y dónde creció?', ar: 'أين وُلدت وأين نشأت؟' },
  'p1q2.prompt': { fr: 'Quelle est votre religion, appartenance ethnique ou affiliation politique, si cela est lié à votre départ ?', en: 'What is your religion, ethnicity, or political affiliation, if relevant to why you left?', es: '¿Cuál es su religión, etnia o afiliación política relevante para por qué se fue?', ar: 'ما هو دينك أو انتماؤك العرقي أو السياسي إن كان ذا صلة بمغادرتك؟' },
  'p1q3.prompt': { fr: 'Quand les problèmes ont-ils commencé ? Quelle est la toute première chose qui s\'est passée ?', en: 'When did the problems first start? What was the very first thing that happened?', es: '¿Cuándo comenzaron los problemas? ¿Cuál fue lo primero que ocurrió?', ar: 'متى بدأت المشاكل؟ ما أول شيء حدث؟' },
  'p1q4.prompt': { fr: 'Comment était votre vie avant que les problèmes commencent ? Décrivez votre travail, votre famille et votre quotidien.', en: 'What was your life like before the problems began? Describe your work, family, and daily life.', es: '¿Cómo era su vida antes de que comenzaran los problemas? Describa su trabajo, familia y vida cotidiana.', ar: 'كيف كانت حياتك قبل أن تبدأ المشاكل؟ صف عملك وعائلتك وحياتك اليومية.' },
  'p1q5.prompt': { fr: 'Êtes-vous accompagné(e) de personnes qui ont également fui la même situation dans votre pays d\'origine ? Si non, est-ce qu\'ils ont fui dans d\'autres pays ?', en: 'Are you accompanied by people who also fled the same situation from your home country? If not, did they flee to other countries?', es: '¿Está acompañado de personas que también huyeron de la misma situación? Si no, ¿huyeron a otros países?', ar: 'هل أنت مصحوب بأشخاص فروا أيضاً من نفس الوضع؟ وإن لم يكونوا معك، هل فروا إلى بلدان أخرى؟' },
  'p1q5.oui': { fr: 'Oui', en: 'Yes', es: 'Sí', ar: 'نعم' },
  'p1q5.non': { fr: 'Non', en: 'No', es: 'No', ar: 'لا' },
  'p1q5.detail': { fr: 'Dites-nous en plus…', en: 'Tell us more…', es: 'Cuéntenos más…', ar: 'أخبرنا المزيد…' },
  'p1q6.prompt': { fr: 'Avez-vous contacté la police ou toute autre autorité pour obtenir de l\'aide ?', en: 'Did you go to the police or any authority for help?', es: '¿Fue a la policía o alguna autoridad en busca de ayuda?', ar: 'هل لجأت إلى الشرطة أو أي سلطة طلباً للمساعدة؟' },
  'p1q6.yes': { fr: 'Oui', en: 'Yes', es: 'Sí', ar: 'نعم' },
  'p1q6.no': { fr: 'Non', en: 'No', es: 'No', ar: 'لا' },
  'p1q6.tried': { fr: 'J\'ai essayé, mais c\'était dangereux', en: 'I tried but it was dangerous', es: 'Lo intenté pero era peligroso', ar: 'حاولت لكن كان ذلك خطيراً' },
  'p1q6.detail': { fr: 'Expliquez ce qui s\'est passé…', en: 'Explain what happened…', es: 'Explique lo que ocurrió…', ar: 'اشرح ما حدث…' },
  'p1q7.prompt': { fr: 'Quel a été l\'événement final qui vous a décidé(e) à quitter votre pays ?', en: 'What was the final event that made you decide to leave your country?', es: '¿Cuál fue el evento final que lo hizo decidir dejar su país?', ar: 'ما الحدث الأخير الذي دفعك إلى مغادرة بلدك؟' },
  'p1q8.prompt': { fr: 'Comment avez-vous quitté le pays ?', en: 'How did you leave?', es: '¿Cómo salió del país?', ar: 'كيف غادرت البلاد؟' },
  'p1q8.valid': { fr: 'Avec des documents valides', en: 'With valid documents', es: 'Con documentos válidos', ar: 'بوثائق سارية المفعول' },
  'p1q8.false': { fr: 'Avec de faux documents', en: 'With false documents', es: 'Con documentos falsos', ar: 'بوثائق مزورة' },
  'p1q8.none': { fr: 'Sans documents', en: 'Without documents', es: 'Sin documentos', ar: 'بدون وثائق' },
  'p1q8.other': { fr: 'Autre', en: 'Other', es: 'Otro', ar: 'أخرى' },
  'p1q9.prompt': { fr: 'Avez-vous transité ou séjourné dans un autre pays avant d\'arriver au Canada ?', en: 'Did you pass through or stay in any other country before arriving in Canada?', es: '¿Pasó por algún otro país antes de llegar a Canadá?', ar: 'هل مررت بأي بلد آخر قبل وصولك إلى كندا؟' },
  'p1q9.yes': { fr: 'Oui', en: 'Yes', es: 'Sí', ar: 'نعم' },
  'p1q9.no': { fr: 'Non', en: 'No', es: 'No', ar: 'لا' },
  'p1q9.detail': { fr: 'Quel pays, et pourquoi n\'y avez-vous pas demandé la protection ?', en: 'Which country, and why didn\'t you claim protection there?', es: '¿Qué país y por qué no solicitó protección allí?', ar: 'أي بلد، ولماذا لم تطلب الحماية هناك؟' },
  'p1q10.prompt': { fr: 'Que pensez-vous qu\'il vous arriverait si vous retourniez dans votre pays aujourd\'hui ?', en: 'What do you believe will happen to you if you return to your country today?', es: '¿Qué cree que le pasaría si regresara hoy a su país?', ar: 'ماذا تعتقد أنه سيحدث لك إذا عدت إلى بلدك اليوم؟' },
  'p1q11.prompt': { fr: 'La situation dans votre pays a-t-elle changé depuis votre départ ?', en: 'Has the situation in your country changed since you left?', es: '¿Ha cambiado la situación en su país desde que se fue?', ar: 'هل تغير الوضع في بلدك منذ مغادرتك؟' },
  'p1q11.worse': { fr: 'Elle s\'est aggravée', en: 'It has gotten worse', es: 'Ha empeorado', ar: 'لقد ازداد سوءاً' },
  'p1q11.same': { fr: 'Elle est la même', en: 'It is the same', es: 'Sigue igual', ar: 'لا يزال كما هو' },
  'p1q11.unknown': { fr: 'Je ne sais pas', en: 'I don\'t know', es: 'No lo sé', ar: 'لا أعرف' },
  'p1q12.prompt': { fr: 'Est-ce que le danger est situé dans une zone particulière dans votre pays, ou est-il généralisé à son entièreté ?', en: 'Is the danger located in a particular area of your country, or is it widespread throughout?', es: '¿El peligro está en una zona particular de su país o está generalizado?', ar: 'هل الخطر في منطقة معينة في بلدك أم أنه منتشر في كل أرجائه؟' },
  'p1q12.zone': { fr: 'Zone particulière', en: 'Particular area', es: 'Zona particular', ar: 'منطقة معينة' },
  'p1q12.generalise': { fr: 'Généralisé', en: 'Widespread', es: 'Generalizado', ar: 'منتشر' },
  'p1q12.unknown': { fr: 'Je ne sais pas', en: 'I don\'t know', es: 'No lo sé', ar: 'لا أعرف' },
  'p1q12.detail': { fr: 'Précisez si vous le savez…', en: 'Tell us more if you know…', es: 'Especifique si lo sabe…', ar: 'وضح إن كنت تعرف…' },
  'p1.placeholder': { fr: 'Vous pouvez écrire ici ou utiliser le microphone…', en: 'You can write here or use the microphone…', es: 'Puede escribir aquí o usar el micrófono…', ar: 'يمكنك الكتابة هنا أو استخدام الميكروفون…' },
  'p1.mic': { fr: 'Appuyer pour parler', en: 'Tap to speak', es: 'Toque para hablar', ar: 'اضغط للتحدث' },
  'p1.done.heading': { fr: 'Merci. Votre récit a été enregistré.', en: 'Thank you. Your story has been recorded.', es: 'Gracias. Su historia ha sido registrada.', ar: 'شكراً لك. تم تسجيل قصتك.' },
  'p1.done.body': { fr: 'Nous allons maintenant vous poser quelques questions personnalisées.', en: 'We will now ask you some personalized questions.', es: 'Ahora le haremos algunas preguntas personalizadas.', ar: 'سنطرح عليك الآن بعض الأسئلة الشخصية.' },
  'p1.done.submit': { fr: 'Continuer', en: 'Continue', es: 'Continuar', ar: 'متابعة' },

  // ── Phase 2 — AI personalized questions ──
  'p2ai.loading.heading': { fr: 'Nous préparons vos questions…', en: 'We are preparing your questions…', es: 'Estamos preparando sus preguntas…', ar: 'نحن نُعدّ أسئلتك…' },
  'p2ai.loading.body': { fr: 'Cela prend quelques secondes.', en: 'This takes a few seconds.', es: 'Esto tarda unos segundos.', ar: 'يستغرق هذا بضع ثوانٍ.' },
  'p2ai.error.heading': { fr: 'Nous n\'avons pas pu générer vos questions.', en: 'We couldn\'t generate your questions.', es: 'No pudimos generar sus preguntas.', ar: 'لم نتمكن من إنشاء أسئلتك.' },
  'p2ai.error.retry': { fr: 'Réessayer', en: 'Try again', es: 'Intentar de nuevo', ar: 'حاول مرة أخرى' },
  'p2ai.label': { fr: 'Question personnalisée', en: 'Personalized question', es: 'Pregunta personalizada', ar: 'سؤال مخصص' },
  'p2ai.placeholder': { fr: 'Vous pouvez écrire ici ou utiliser le microphone…', en: 'You can write here or use the microphone…', es: 'Puede escribir aquí o usar el micrófono…', ar: 'يمكنك الكتابة هنا أو استخدام الميكروفون…' },
  'p2ai.mic': { fr: 'Appuyer pour parler', en: 'Tap to speak', es: 'Toque para hablar', ar: 'اضغط للتحدث' },
  'p2ai.done.heading': { fr: 'Merci pour vos réponses.', en: 'Thank you for your answers.', es: 'Gracias por sus respuestas.', ar: 'شكراً على إجاباتك.' },
  'p2ai.done.body': { fr: 'Nous passons à la dernière étape.', en: 'We are moving to the last step.', es: 'Pasamos al último paso.', ar: 'ننتقل إلى الخطوة الأخيرة.' },
  'p2ai.done.submit': { fr: 'Continuer', en: 'Continue', es: 'Continuar', ar: 'متابعة' },

  // ── Phase 3 — resources checklist ──
  'p3res.title': { fr: 'Des ressources pour vous aider', en: 'Resources to help you', es: 'Recursos para ayudarle', ar: 'موارد لمساعدتك' },
  'p3res.subtitle': { fr: 'Lesquels de ces services pourraient vous être utiles ?', en: 'Which of these services might be helpful to you?', es: '¿Cuáles de estos servicios podrían ser útiles para usted?', ar: 'أيٌّ من هذه الخدمات قد يكون مفيداً لك؟' },
  'p3res.footer': { fr: 'Votre clinique pourra vous orienter vers ces ressources.', en: 'Your clinic will be able to direct you to these resources.', es: 'Su clínica podrá orientarle hacia estos recursos.', ar: 'ستتمكن عيادتك من توجيهك إلى هذه الموارد.' },
  'p3res.link': { fr: 'Voir toutes les ressources disponibles au Québec', en: 'See all available resources in Québec', es: 'Ver todos los recursos disponibles en Québec', ar: 'عرض جميع الموارد المتاحة في كيبيك' },
  'p3res.done.submit': { fr: 'Terminer', en: 'Finish', es: 'Terminar', ar: 'إنهاء' },

  // ── Interview navigation ──
  'interview.prev': { fr: '← Retour', en: '← Back', es: '← Atrás', ht: '← Retounen', ar: '← رجوع' },
  'interview.next': { fr: 'Suivant →', en: 'Next →', es: 'Siguiente →', ht: 'Swivan →', ar: 'التالي →' },
  'interview.skip': { fr: 'Passer', en: 'Skip', es: 'Omitir', ht: 'Pase', ar: 'تخطي' },
  'interview.confirm.question': { fr: 'C\'est exact ?', en: 'Is that right?', es: '¿Es correcto?', ht: 'Eske sa a kòrèk?', ar: 'هل هذا صحيح؟' },
  'interview.confirm.yes': { fr: 'Oui, c\'est ça', en: 'Yes, that\'s right', es: 'Sí, correcto', ht: 'Wi, sa a kòrèk', ar: 'نعم، هذا صحيح' },
  'interview.confirm.change': { fr: 'Modifier', en: 'Change it', es: 'Cambiarlo', ht: 'Chanje li', ar: 'تعديل' },
  'interview.done.heading': { fr: 'Vos réponses sont prêtes.', en: 'Your answers are ready.', es: 'Sus respuestas están listas.', ht: 'Repons ou yo pare.', ar: 'إجاباتك جاهزة.' },
  'interview.done.body': { fr: 'Merci de nous avoir partagé votre histoire. Vous pouvez maintenant transmettre votre dossier.', en: 'Thank you for sharing your story. You can now send your file.', es: 'Gracias por compartir su historia. Ahora puede enviar su expediente.', ht: 'Mèsi pou pataje istwa ou. Ou ka voye dosye ou kounye a.', ar: 'شكراً لمشاركة قصتك. يمكنك الآن إرسال ملفك.' },
  'interview.done.submit': { fr: 'Continuer', en: 'Continue', es: 'Continuar', ht: 'Kontinye', ar: 'متابعة' },

  // ── Q1: Sex ──
  'q1.prompt': { fr: 'Pour commencer — comment vous identifiez-vous ?', en: 'To start — how do you identify?', es: 'Para comenzar — ¿cómo se identifica?', ht: 'Pou kòmanse — kijan ou idantifye tèt ou?', ar: 'للبداية — كيف تعرّف عن نفسك؟' },
  'q1.man': { fr: 'Homme', en: 'Man', es: 'Hombre', ht: 'Gason', ar: 'رجل' },
  'q1.woman': { fr: 'Femme', en: 'Woman', es: 'Mujer', ht: 'Fanm', ar: 'امرأة' },
  'q1.nonbinary': { fr: 'Non-binaire', en: 'Non-binary', es: 'No binario', ht: 'Non-binè', ar: 'غير ثنائي' },
  'q1.notsay': { fr: 'Préfère ne pas répondre', en: 'Prefer not to say', es: 'Prefiero no decirlo', ht: 'Prefere pa di', ar: 'أفضل عدم الإجابة' },

  // ── Q2: Age group ──
  'q2.prompt': { fr: 'Quel est votre groupe d\'âge ?', en: 'Which age group are you in?', es: '¿En qué grupo de edad está?', ht: 'Ki gwoup laj ou ye?', ar: 'في أي فئة عمرية أنت؟' },

  // ── Q3: Country ──
  'q3.prompt': { fr: 'De quel pays venez-vous ?', en: 'What country are you from?', es: '¿De qué país viene?', ht: 'Ki peyi ou soti?', ar: 'من أي بلد أنت؟' },
  'q3.search': { fr: 'Chercher un pays…', en: 'Search for a country…', es: 'Buscar un país…', ht: 'Chèche yon peyi…', ar: 'ابحث عن بلد…' },

  // ── Q4: Persecution ground ──
  'q4.prompt': { fr: 'Pourquoi craignez-vous de retourner dans votre pays ?', en: 'Why are you afraid to return to your country?', es: '¿Por qué teme regresar a su país?', ht: 'Poukisa ou pè retounen nan peyi ou?', ar: 'لماذا تخشى العودة إلى بلدك؟' },
  'q4.race': { fr: 'Race ou ethnie', en: 'Race or ethnicity', es: 'Raza o etnia', ht: 'Ras oswa etni', ar: 'العرق أو الإثنية' },
  'q4.religion': { fr: 'Religion', en: 'Religion', es: 'Religión', ht: 'Relijyon', ar: 'الدين' },
  'q4.nationality': { fr: 'Nationalité', en: 'Nationality', es: 'Nacionalidad', ht: 'Nasyonalite', ar: 'الجنسية' },
  'q4.political': { fr: 'Opinion politique', en: 'Political opinion', es: 'Opinión política', ht: 'Opinyon politik', ar: 'الرأي السياسي' },
  'q4.psg': { fr: 'Appartenance à un groupe social', en: 'Membership in a social group', es: 'Pertenencia a un grupo social', ht: 'Manm nan yon gwoup sosyal', ar: 'الانتماء إلى فئة اجتماعية' },

  // ── Q5: Narrative ──
  'q5.prompt': { fr: 'Racontez-nous ce qui s\'est passé. Prenez votre temps.', en: 'Tell us what happened. Take your time.', es: 'Cuéntenos qué pasó. Tómese su tiempo.', ht: 'Rakonte nou sa ki te pase. Pran tan ou.', ar: 'أخبرنا بما حدث. خذ وقتك.' },
  'q5.placeholder': { fr: 'Vous pouvez écrire ici, ou utiliser le microphone pour parler…', en: 'You can write here, or use the microphone to speak…', es: 'Puede escribir aquí, o usar el micrófono para hablar…', ht: 'Ou ka ekri isit la, oswa itilize mikwofòn pou pale…', ar: 'يمكنك الكتابة هنا أو استخدام الميكروفون للتحدث…' },
  'q5.mic': { fr: 'Appuyer pour parler', en: 'Tap to speak', es: 'Toque para hablar', ht: 'Touche pou pale', ar: 'اضغط للتحدث' },

  // ── Q6: Dates ──
  'q6.prompt': { fr: 'Quelques dates importantes — faites de votre mieux.', en: 'A few important dates — do your best.', es: 'Algunas fechas importantes — haga lo que pueda.', ht: 'Kèk dat enpòtan — fè sa ou kapab.', ar: 'بعض التواريخ المهمة — أجب بما تستطيع.' },
  'q6.incidents': { fr: 'Quand les incidents ont-ils eu lieu ?', en: 'When did the incidents happen?', es: '¿Cuándo ocurrieron los incidentes?', ht: 'Ki lè ensidan yo te pase?', ar: 'متى وقعت الحوادث؟' },
  'q6.left': { fr: 'Quand avez-vous quitté votre pays ?', en: 'When did you leave your country?', es: '¿Cuándo salió de su país?', ht: 'Ki lè ou te kite peyi ou?', ar: 'متى غادرت بلدك؟' },
  'q6.arrived': { fr: 'Quand êtes-vous arrivé(e) au Canada ?', en: 'When did you arrive in Canada?', es: '¿Cuándo llegó a Canadá?', ht: 'Ki lè ou te rive Kanada?', ar: 'متى وصلت إلى كندا؟' },

  // ── Q7: State protection ──
  'q7.prompt': { fr: 'Avez-vous demandé de l\'aide aux autorités de votre pays ?', en: 'Did you ask for help from authorities in your country?', es: '¿Pidió ayuda a las autoridades de su país?', ht: 'Èske ou te mande otorite nan peyi ou pou èd?', ar: 'هل طلبت المساعدة من السلطات في بلدك؟' },
  'q7.yes': { fr: 'Oui', en: 'Yes', es: 'Sí', ht: 'Wi', ar: 'نعم' },
  'q7.no': { fr: 'Non', en: 'No', es: 'No', ht: 'Non', ar: 'لا' },
  'q7.tried': { fr: 'J\'ai essayé mais ils n\'ont pas aidé', en: 'I tried but they didn\'t help', es: 'Lo intenté pero no me ayudaron', ht: 'Mwen te eseye men yo pa t ede', ar: 'حاولت لكنهم لم يساعدوا' },
  'q7.detail': { fr: 'Pouvez-vous expliquer pourquoi vous n\'avez pas pu obtenir d\'aide ?', en: 'Can you explain why you couldn\'t get help?', es: '¿Puede explicar por qué no pudo obtener ayuda?', ht: 'Èske ou ka eksplike poukisa ou pa t kapab jwenn èd?', ar: 'هل يمكنك توضيح سبب عدم تمكنك من الحصول على المساعدة؟' },

  // ── Q8: IFA ──
  'q8.prompt': { fr: 'Y a-t-il une région sûre dans votre pays où vous pourriez vivre ?', en: 'Is there a safe region in your country where you could live?', es: '¿Hay una región segura en su país donde podría vivir?', ht: 'Èske gen yon rejyon ki an sekirite nan peyi ou kote ou ta ka viv?', ar: 'هل توجد منطقة آمنة في بلدك يمكنك العيش فيها؟' },
  'q8.yes': { fr: 'Oui', en: 'Yes', es: 'Sí', ht: 'Wi', ar: 'نعم' },
  'q8.no': { fr: 'Non', en: 'No', es: 'No', ht: 'Non', ar: 'لا' },
  'q8.unknown': { fr: 'Je ne sais pas', en: 'I don\'t know', es: 'No lo sé', ht: 'Mwen pa konnen', ar: 'لا أعرف' },
  'q8.detail': { fr: 'Pouvez-vous expliquer pourquoi vous ne pouvez pas déménager ?', en: 'Can you explain why you can\'t relocate?', es: '¿Puede explicar por qué no puede reubicarse?', ht: 'Èske ou ka eksplike poukisa ou pa ka deplase?', ar: 'هل يمكنك توضيح سبب عدم قدرتك على الانتقال؟' },

  // ── Q9: Province + duration ──
  'q9.prompt': { fr: 'Où vivez-vous au Canada et depuis combien de temps ?', en: 'Where in Canada do you live and for how long?', es: '¿Dónde vive en Canadá y desde cuándo?', ht: 'Ki kote ou rete nan Kanada ak depi konbyen tan?', ar: 'أين تعيش في كندا ومنذ متى؟' },
  'q9.province': { fr: 'Province ou territoire', en: 'Province or territory', es: 'Provincia o territorio', ht: 'Pwovens oswa teritwa', ar: 'المقاطعة أو الإقليم' },
  'q9.duration': { fr: 'Depuis combien de temps ? (ex : 6 mois, 2 ans)', en: 'For how long? (e.g. 6 months, 2 years)', es: '¿Desde cuándo? (ej.: 6 meses, 2 años)', ht: 'Depi konbyen tan? (ex: 6 mwa, 2 an)', ar: 'منذ متى؟ (مثال: 6 أشهر، سنتان)' },

  // PIN display screen
  'pin.heading': {
    fr: 'Votre numéro de dossier',
    en: 'Your file number',
    es: 'Su número de expediente',
    ht: 'Nimewo dosye ou',
    ar: 'رقم ملفك',
  },
  'pin.instruction': {
    fr: 'Notez ce numéro. La clinique utilisera ce code pour retrouver votre dossier.',
    en: 'Write this down. The clinic will use this number to find your file.',
    es: 'Anote este número. La clínica usará este código para encontrar su expediente.',
    ht: 'Ekri sa a. Klinik la ap itilize nimewo sa a pou jwenn dosye ou.',
    ar: 'دوّن هذا الرقم. ستستخدم العيادة هذا الرقم للعثور على ملفك.',
  },
  'pin.cta': {
    fr: 'Je l\'ai noté',
    en: 'I\'ve written it down',
    es: 'Lo he anotado',
    ht: 'Mwen te ekri li',
    ar: 'لقد دوّنته',
  },

  // ── Phase 2 — 16-question narrative interview ──
  'p2.text.placeholder': {
    fr: 'Vous pouvez écrire ici ou utiliser le microphone…',
    en: 'You can write here or use the microphone…',
    es: 'Puede escribir aquí o usar el micrófono…',
    ar: 'يمكنك الكتابة هنا أو استخدام الميكروفون…',
  },
  'p2.done.heading': {
    fr: 'Merci. Votre histoire a été enregistrée.',
    en: 'Thank you. Your story has been recorded.',
    es: 'Gracias. Su historia ha sido registrada.',
    ar: 'شكراً لك. تم تسجيل قصتك.',
  },
  'p2.done.body': {
    fr: 'Vos réponses aideront votre conseiller juridique à préparer votre dossier.',
    en: 'Your answers will help your legal helper prepare your file.',
    es: 'Sus respuestas ayudarán a su asesor legal a preparar su expediente.',
    ar: 'ستساعد إجاباتك مساعدك القانوني على إعداد ملفك.',
  },
  'p2.done.submit': {
    fr: 'Continuer',
    en: 'Continue',
    es: 'Continuar',
    ar: 'متابعة',
  },

  // Section 1 — Personal background
  'p2q1.prompt': {
    fr: 'Où êtes-vous né(e) et où avez-vous grandi ?',
    en: 'Where were you born, and where did you grow up?',
    es: '¿Dónde nació y dónde creció?',
    ar: 'أين وُلدت، وأين نشأت؟',
  },
  'p2q2.prompt': {
    fr: 'Quelle est votre religion, votre appartenance ethnique ou votre affiliation politique, si cela est lié à votre départ ?',
    en: 'What is your religion, ethnicity, or political affiliation, if relevant to why you left?',
    es: '¿Cuál es su religión, etnia o afiliación política, si es relevante para por qué se fue?',
    ar: 'ما هو دينك أو انتماؤك العرقي أو السياسي، إن كان له صلة بسبب مغادرتك؟',
  },
  'p2q3.prompt': {
    fr: 'Comment était votre vie avant que les problèmes commencent ? Décrivez votre travail, votre famille et votre quotidien.',
    en: 'What was your life like before the problems began? Describe your work, family, and daily life.',
    es: '¿Cómo era su vida antes de que comenzaran los problemas? Describa su trabajo, familia y vida cotidiana.',
    ar: 'كيف كانت حياتك قبل أن تبدأ المشاكل؟ صف عملك وعائلتك وحياتك اليومية.',
  },

  // Section 2 — Sequence of events
  'p2q4.prompt': {
    fr: 'Quand les problèmes ont-ils commencé ? Quelle est la toute première chose qui s\'est passée ?',
    en: 'When did the problems first start? What was the very first thing that happened?',
    es: '¿Cuándo comenzaron los problemas? ¿Cuál fue lo primero que ocurrió?',
    ar: 'متى بدأت المشاكل لأول مرة؟ ما أول شيء حدث؟',
  },
  'p2q5.prompt': {
    fr: 'Qui était responsable de ce qui vous est arrivé ? Décrivez leur rôle, non leur nom. (ex. : soldats gouvernementaux, milice locale, police)',
    en: 'Who was responsible for what happened to you? Describe their role, not their name. (e.g. government soldiers, local militia, police)',
    es: '¿Quién fue responsable de lo que le ocurrió? Describa su papel, no su nombre. (p. ej. soldados del gobierno, milicias locales, policía)',
    ar: 'من كان مسؤولاً عما حدث لك؟ صف دوره لا اسمه. (مثلاً: جنود حكوميون، ميليشيا محلية، شرطة)',
  },
  'p2q6.prompt': {
    fr: 'Que s\'est-il passé ensuite ? Racontez-nous les événements principaux dans l\'ordre.',
    en: 'What happened next? Walk us through the main events in the order they happened.',
    es: '¿Qué pasó después? Cuéntenos los eventos principales en el orden en que ocurrieron.',
    ar: 'ماذا حدث بعد ذلك؟ حدثنا عن الأحداث الرئيسية بالترتيب الزمني.',
  },
  'p2q7.prompt': {
    fr: 'D\'autres membres de votre famille ou de votre communauté ont-ils été touchés par la même situation ?',
    en: 'Was anyone else in your family or community affected by the same situation?',
    es: '¿Hubo alguien más en su familia o comunidad afectado por la misma situación?',
    ar: 'هل تأثر أي شخص آخر من عائلتك أو مجتمعك بنفس الوضع؟',
  },
  'p2q7.yes': { fr: 'Oui', en: 'Yes', es: 'Sí', ar: 'نعم' },
  'p2q7.no': { fr: 'Non', en: 'No', es: 'No', ar: 'لا' },
  'p2q7.detail': {
    fr: 'Dites-nous ce qui leur est arrivé.',
    en: 'Tell us what happened to them.',
    es: 'Cuéntenos qué les ocurrió.',
    ar: 'أخبرنا عما حدث لهم.',
  },

  // Section 3 — Attempts to seek protection
  'p2q8.prompt': {
    fr: 'Avez-vous contacté la police ou toute autre autorité pour obtenir de l\'aide ?',
    en: 'Did you go to the police or any authority for help?',
    es: '¿Fue a la policía o a alguna autoridad en busca de ayuda?',
    ar: 'هل لجأت إلى الشرطة أو أي سلطة طلباً للمساعدة؟',
  },
  'p2q8.yes': { fr: 'Oui', en: 'Yes', es: 'Sí', ar: 'نعم' },
  'p2q8.no': { fr: 'Non', en: 'No', es: 'No', ar: 'لا' },
  'p2q8.tried': {
    fr: 'J\'ai essayé, mais c\'était dangereux',
    en: 'I tried but it was dangerous',
    es: 'Lo intenté pero era peligroso',
    ar: 'حاولت لكن كان ذلك خطيراً',
  },
  'p2q8.detail': {
    fr: 'Expliquez ce qui s\'est passé.',
    en: 'Tell us what happened.',
    es: 'Cuéntenos qué ocurrió.',
    ar: 'أخبرنا عما حدث.',
  },
  'p2q9.prompt': {
    fr: 'Si vous n\'avez pas demandé d\'aide aux autorités — pourquoi ? Était-ce dangereux ou impossible ?',
    en: 'If you did not seek help from authorities — why not? Was it unsafe or impossible?',
    es: 'Si no buscó ayuda de las autoridades — ¿por qué no? ¿Era inseguro o imposible?',
    ar: 'إن لم تلجأ إلى السلطات طلباً للمساعدة — لماذا؟ هل كان ذلك غير آمن أو مستحيل؟',
  },

  // Section 4 — Decision to leave
  'p2q10.prompt': {
    fr: 'Quel a été l\'événement final qui vous a décidé à quitter votre pays ?',
    en: 'What was the final event that made you decide to leave your country?',
    es: '¿Cuál fue el evento final que lo hizo decidir dejar su país?',
    ar: 'ما الحدث الأخير الذي دفعك إلى اتخاذ قرار مغادرة بلدك؟',
  },
  'p2q11.prompt': {
    fr: 'Comment avez-vous quitté le pays ?',
    en: 'How did you leave?',
    es: '¿Cómo salió del país?',
    ar: 'كيف غادرت البلاد؟',
  },
  'p2q11.valid': { fr: 'Avec des documents valides', en: 'With valid documents', es: 'Con documentos válidos', ar: 'بوثائق سارية المفعول' },
  'p2q11.false': { fr: 'Avec de faux documents', en: 'With false documents', es: 'Con documentos falsos', ar: 'بوثائق مزورة' },
  'p2q11.none': { fr: 'Sans documents', en: 'Without documents', es: 'Sin documentos', ar: 'بدون وثائق' },
  'p2q11.other': { fr: 'Autre', en: 'Other', es: 'Otro', ar: 'أخرى' },
  'p2q12.prompt': {
    fr: 'Avez-vous transité ou séjourné dans un autre pays avant d\'arriver au Canada ?',
    en: 'Did you pass through or stay in any other country before arriving in Canada?',
    es: '¿Pasó o se quedó en algún otro país antes de llegar a Canadá?',
    ar: 'هل مررت بأي بلد آخر أو أقمت فيه قبل وصولك إلى كندا؟',
  },
  'p2q12.yes': { fr: 'Oui', en: 'Yes', es: 'Sí', ar: 'نعم' },
  'p2q12.no': { fr: 'Non', en: 'No', es: 'No', ar: 'لا' },
  'p2q12.detail': {
    fr: 'Quel pays, et pourquoi n\'y avez-vous pas demandé la protection ?',
    en: 'Which country, and why didn\'t you claim protection there?',
    es: '¿Qué país, y por qué no solicitó protección allí?',
    ar: 'أي بلد، ولماذا لم تطلب الحماية هناك؟',
  },

  // Section 5 — Fear of return
  'p2q13.prompt': {
    fr: 'Que pensez-vous qu\'il vous arriverait si vous retourniez dans votre pays aujourd\'hui ?',
    en: 'What do you believe will happen to you if you return to your country today?',
    es: '¿Qué cree que le pasaría si regresa a su país hoy?',
    ar: 'ماذا تعتقد أنه سيحدث لك إذا عدت إلى بلدك اليوم؟',
  },
  'p2q14.prompt': {
    fr: 'La situation dans votre pays a-t-elle changé depuis votre départ ?',
    en: 'Has the situation in your country changed since you left?',
    es: '¿Ha cambiado la situación en su país desde que se fue?',
    ar: 'هل تغير الوضع في بلدك منذ مغادرتك؟',
  },
  'p2q14.worse': { fr: 'Elle s\'est aggravée', en: 'It has gotten worse', es: 'Ha empeorado', ar: 'لقد ازداد سوءاً' },
  'p2q14.same': { fr: 'Elle est la même', en: 'It is the same', es: 'Sigue igual', ar: 'لا يزال كما هو' },
  'p2q14.unknown': { fr: 'Je ne sais pas', en: 'I don\'t know', es: 'No lo sé', ar: 'لا أعرف' },

  // Section 6 — Internal relocation
  'p2q15.prompt': {
    fr: 'Existe-t-il une ville ou une région dans votre pays où vous pourriez vivre en sécurité, loin des personnes qui vous ont nui ?',
    en: 'Is there any city or region in your country where you could live safely away from the people who harmed you?',
    es: '¿Hay alguna ciudad o región en su país donde pueda vivir con seguridad lejos de quienes le hicieron daño?',
    ar: 'هل توجد أي مدينة أو منطقة في بلدك يمكنك العيش فيها بأمان بعيداً عن من أضروا بك؟',
  },
  'p2q15.yes': { fr: 'Oui', en: 'Yes', es: 'Sí', ar: 'نعم' },
  'p2q15.no': { fr: 'Non', en: 'No', es: 'No', ar: 'لا' },
  'p2q15.unknown': { fr: 'Je ne sais pas', en: 'I don\'t know', es: 'No lo sé', ar: 'لا أعرف' },
  'p2q15.detail': {
    fr: 'Expliquez pourquoi vous ne pouvez pas vous réinstaller en toute sécurité.',
    en: 'Explain why you cannot relocate safely.',
    es: 'Explique por qué no puede reubicarse de forma segura.',
    ar: 'اشرح لماذا لا تستطيع الانتقال إلى مكان آمن.',
  },
  'p2q16.prompt': {
    fr: 'Les personnes qui vous ont nui pourraient-elles vous retrouver n\'importe où dans votre pays ?',
    en: 'Would the people who harmed you be able to find you anywhere in your country?',
    es: '¿Podrían encontrarle en cualquier parte de su país las personas que le hicieron daño?',
    ar: 'هل يستطيع من أضروا بك العثور عليك في أي مكان داخل بلدك؟',
  },
  'p2q16.yes': { fr: 'Oui', en: 'Yes', es: 'Sí', ar: 'نعم' },
  'p2q16.no': { fr: 'Non', en: 'No', es: 'No', ar: 'لا' },
  'p2q16.unknown': { fr: 'Je ne sais pas', en: 'I don\'t know', es: 'No lo sé', ar: 'لا أعرف' },
  'p2q16.detail': {
    fr: 'Expliquez pourquoi.',
    en: 'Tell us why.',
    es: 'Explíquenos por qué.',
    ar: 'أخبرنا لماذا.',
  },

  // ── Phase 0 — preliminary questions ──
  'p0q1.prompt': { fr: 'De quel pays avez-vous fui ?', en: 'What country did you flee from?', es: '¿De qué país huyó?', ar: 'من أي بلد فررت؟' },
  'p0q1.search': { fr: 'Chercher un pays…', en: 'Search for a country…', es: 'Buscar un país…', ar: 'ابحث عن بلد…' },
  'p0q2.prompt': { fr: 'Depuis combien de temps êtes-vous au Canada et dans quelle province ?', en: 'How long have you been in Canada, and in which province?', es: '¿Cuánto tiempo lleva en Canadá y en qué provincia?', ar: 'منذ متى وأنت في كندا وفي أي مقاطعة؟' },
  'p0q3.prompt': { fr: 'Comment vous identifiez-vous ?', en: 'How do you identify?', es: '¿Cómo se identifica?', ar: 'كيف تعرّف عن نفسك؟' },
  'p0q4.prompt': { fr: 'Dans quel groupe d\'âge êtes-vous ?', en: 'Which age group are you in?', es: '¿En qué grupo de edad está?', ar: 'في أي فئة عمرية أنت؟' },
  'p0q5.prompt': { fr: 'Comment êtes-vous arrivé(e) au Canada ?', en: 'How did you arrive in Canada?', es: '¿Cómo llegó a Canadá?', ar: 'كيف وصلت إلى كندا؟' },
  'p0q5.plane': { fr: 'Avion', en: 'Plane', es: 'Avión', ar: 'طائرة' },
  'p0q5.road': { fr: 'Route', en: 'Road', es: 'Carretera', ar: 'طريق بري' },
  'p0q5.boat': { fr: 'Bateau', en: 'Boat', es: 'Barco', ar: 'قارب' },
  'p0q5.train': { fr: 'Train', en: 'Train', es: 'Tren', ar: 'قطار' },
  'p0q5.other': { fr: 'Autre', en: 'Other', es: 'Otro', ar: 'أخرى' },
  'p0q6.prompt': { fr: 'Quand êtes-vous arrivé(e) au Canada ?', en: 'When did you arrive in Canada?', es: '¿Cuándo llegó a Canadá?', ar: 'متى وصلت إلى كندا؟' },
  'p0q6.day': { fr: 'Jour', en: 'Day', es: 'Día', ar: 'اليوم' },
  'p0q6.month': { fr: 'Mois', en: 'Month', es: 'Mes', ar: 'الشهر' },
  'p0q6.year': { fr: 'Année', en: 'Year', es: 'Año', ar: 'السنة' },
  'p0.done.heading': { fr: 'Questions préliminaires complètes.', en: 'Preliminary questions complete.', es: 'Preguntas preliminares completas.', ar: 'الأسئلة التمهيدية مكتملة.' },
  'p0.done.body': { fr: 'Continuons avec votre récit.', en: 'Let\'s continue with your story.', es: 'Continuemos con su historia.', ar: 'لنواصل مع قصتك.' },
  'p0.done.submit': { fr: 'Continuer', en: 'Continue', es: 'Continuar', ar: 'متابعة' },

  // Phase navigation bar
  'phase.nav.0': { fr: 'Questions préliminaires', en: 'Preliminary questions', es: 'Preguntas preliminares', ar: 'أسئلة تمهيدية' },
  'phase.nav.1': { fr: 'Rédaction du récit', en: 'Narrative drafting', es: 'Redacción del relato', ar: 'صياغة الرواية' },
  'phase.nav.2': { fr: 'Questions personnalisées', en: 'Personalized questions', es: 'Preguntas personalizadas', ar: 'أسئلة مخصصة' },
  'phase.nav.3': { fr: 'Questions sensibles', en: 'Sensitivity questions', es: 'Preguntas sensibles', ar: 'أسئلة حساسة' },
  'phase.nav.4': { fr: 'Révision', en: 'Review', es: 'Revisión', ar: 'مراجعة' },

  // Landing — language bar
  'lang.fr': { fr: 'Français', en: 'Français', es: 'Français', ht: 'Français', ar: 'Français' },
  'lang.en': { fr: 'English', en: 'English', es: 'English', ht: 'English', ar: 'English' },
  'lang.es': { fr: 'Español', en: 'Español', es: 'Español', ht: 'Español', ar: 'Español' },
  'lang.ht': { fr: 'Kreyòl', en: 'Kreyòl', es: 'Kreyòl', ht: 'Kreyòl', ar: 'Kreyòl' },
  'lang.more': { fr: 'More...', en: 'More...', es: 'More...', ht: 'More...', ar: 'More...' },

  // Landing — identity
  'landing.tagline': {
    fr: 'Votre guide pour la protection au Canada',
    en: 'Your guide to protection in Canada',
    es: 'Su guía para la protección en Canadá',
    ht: 'Gid ou pou pwoteksyon nan Kanada',
    ar: 'دليلك للحماية في كندا',
  },
  'landing.disclaimer': {
    fr: 'Cet outil ne constitue pas un avis juridique. / This tool does not constitute legal advice.',
    en: 'This tool does not constitute legal advice. / Cet outil ne constitue pas un avis juridique.',
    es: 'Esta herramienta no constituye asesoramiento jurídico.',
    ht: 'Zouti sa a pa konstitye konsèy legal.',
    ar: 'هذه الأداة لا تُشكّل استشارة قانونية.',
  },

  // Landing — seeker card
  'landing.seeker.title': {
    fr: 'Demandeur d\'asile',
    en: 'Asylum seeker',
    es: 'Solicitante de asilo',
    ht: 'Moun k ap chèche azil',
    ar: 'طالب اللجوء',
  },
  'landing.seeker.subtitle': {
    fr: 'Commencez votre demande',
    en: 'Start your application',
    es: 'Comience su solicitud',
    ht: 'Kòmanse aplikasyon ou',
    ar: 'ابدأ طلبك',
  },

  // Landing — clinic card
  'landing.clinic.title': {
    fr: 'Professionnel juridique',
    en: 'Legal professional',
    es: 'Profesional jurídico',
    ht: 'Pwofesyonèl legal',
    ar: 'محترف قانوني',
  },
  'landing.clinic.subtitle': {
    fr: 'Accéder au tableau de bord',
    en: 'Access the dashboard',
    es: 'Acceder al panel',
    ht: 'Aksede tablo bò',
    ar: 'الوصول إلى لوحة التحكم',
  },

  // ── Phase 3 — AI adaptive interview ──
  'p3.loading.heading': {
    fr: 'Nous préparons vos questions…',
    en: 'We are preparing your questions…',
    es: 'Estamos preparando sus preguntas…',
    ar: 'نحن نُعدّ أسئلتك…',
  },
  'p3.loading.body': {
    fr: 'Cela prend quelques secondes.',
    en: 'This takes a few seconds.',
    es: 'Esto tarda unos segundos.',
    ar: 'يستغرق هذا بضع ثوانٍ.',
  },
  'p3.error.heading': {
    fr: 'Nous n\'avons pas pu générer vos questions.',
    en: 'We couldn\'t generate your questions.',
    es: 'No pudimos generar sus preguntas.',
    ar: 'لم نتمكن من إنشاء أسئلتك.',
  },
  'p3.error.retry': {
    fr: 'Réessayer',
    en: 'Try again',
    es: 'Intentar de nuevo',
    ar: 'حاول مرة أخرى',
  },
  'p3.label': {
    fr: 'Question générée à partir de votre histoire',
    en: 'Question generated based on your story',
    es: 'Pregunta generada a partir de su historia',
    ar: 'سؤال مُولَّد بناءً على قصتك',
  },
  'p3.placeholder': {
    fr: 'Vous pouvez écrire ici ou utiliser le microphone…',
    en: 'You can write here or use the microphone…',
    es: 'Puede escribir aquí o usar el micrófono…',
    ar: 'يمكنك الكتابة هنا أو استخدام الميكروفون…',
  },
  'p3.done.heading': {
    fr: 'Votre histoire est complète.',
    en: 'Your story is complete.',
    es: 'Su historia está completa.',
    ar: 'قصتك اكتملت.',
  },
  'p3.done.body': {
    fr: 'Nous préparons votre dossier.',
    en: 'We are preparing your file.',
    es: 'Estamos preparando su expediente.',
    ar: 'نحن نُعدّ ملفك.',
  },
  'p3.done.submit': {
    fr: 'Voir mon dossier',
    en: 'See my file',
    es: 'Ver mi expediente',
    ar: 'عرض ملفي',
  },

  // Seeker report
  'seeker.report.heading': {
    fr: 'Votre dossier est prêt.',
    en: 'Your file is ready.',
    es: 'Su expediente está listo.',
    ar: 'ملفك جاهز.',
  },
  'seeker.report.body': {
    fr: 'Merci d\'avoir partagé votre histoire. Vous pouvez maintenant transmettre votre dossier à une clinique juridique.',
    en: 'Thank you for sharing your story. You can now send your file to a legal clinic.',
    es: 'Gracias por compartir su historia. Ahora puede enviar su expediente a una clínica jurídica.',
    ar: 'شكراً لك على مشاركة قصتك. يمكنك الآن إرسال ملفك إلى عيادة قانونية.',
  },
  'seeker.report.share': {
    fr: 'Partager avec une clinique',
    en: 'Share with a clinic',
    es: 'Compartir con una clínica',
    ar: 'مشاركة مع عيادة قانونية',
  },

  // Seeker welcome
  'seeker.welcome.heading': {
    fr: 'Vous êtes en sécurité ici.',
    en: 'You are safe here.',
    es: 'Está seguro aquí.',
    ht: 'Ou an sekirite isit la.',
    ar: 'أنت بأمان هنا.',
  },
  'seeker.welcome.body': {
    fr: 'Cet outil vous aide à préparer votre histoire pour votre conseiller juridique. Vous pouvez vous arrêter à tout moment et revenir plus tard. Rien n\'est partagé sans votre permission.',
    en: 'This tool helps you prepare your story for your legal helper. You can stop at any time and come back later. Nothing is shared without your permission.',
    es: 'Esta herramienta le ayuda a preparar su historia para su asesor legal. Puede detenerse en cualquier momento y volver más tarde. Nada se comparte sin su permiso.',
    ht: 'Zouti sa a ede ou prepare istwa ou pou konseye legal ou. Ou ka kanpe nenpòt lè epi retounen pita. Anyen pa pataje san pèmisyon ou.',
    ar: 'تساعدك هذه الأداة على تحضير قصتك لمساعدك القانوني. يمكنك التوقف في أي وقت والعودة لاحقاً. لا يُشارَك أي شيء دون إذنك.',
  },
  'seeker.welcome.start': {
    fr: 'Commencer',
    en: 'Start',
    es: 'Comenzar',
    ht: 'Kòmanse',
    ar: 'ابدأ',
  },
  'seeker.welcome.back': {
    fr: '← Retour',
    en: '← Back',
    es: '← Volver',
    ht: '← Retounen',
    ar: '← رجوع',
  },

  // Seeker shell — pause button
  'seeker.pause': {
    fr: 'Pause — revenir plus tard',
    en: 'Pause — come back later',
    es: 'Pausa — volver más tarde',
    ht: 'Pòz — retounen pita',
    ar: 'إيقاف مؤقت — العودة لاحقاً',
  },
  'seeker.pause.alert': {
    fr: 'La fonctionnalité PIN arrive bientôt.',
    en: 'PIN feature coming soon.',
    es: 'La función PIN estará disponible pronto.',
    ht: 'Fonksyon PIN ap vini byento.',
    ar: 'ميزة الرقم السري قريباً.',
  },

  // Clinic select screen (seeker flow)
  'clinic.select.title': {
    fr: 'Choisissez votre clinique / Choose your clinic',
    en: 'Choose your clinic / Choisissez votre clinique',
    es: 'Elija su clínica / Choose your clinic',
    ht: 'Chwazi klinik ou / Choose your clinic',
    ar: 'اختر عيادتك / Choose your clinic',
  },
  'clinic.select.search': {
    fr: 'Rechercher une clinique…',
    en: 'Search for a clinic…',
    es: 'Buscar una clínica…',
    ht: 'Chèche yon klinik…',
    ar: 'ابحث عن عيادة…',
  },
  'clinic.select.unknown': {
    fr: "Je ne sais pas encore / I don't know yet",
    en: "I don't know yet / Je ne sais pas encore",
    es: 'No lo sé todavía / I don\'t know yet',
    ht: "Mwen pa konnen ankò / I don't know yet",
    ar: "لا أعرف بعد / I don't know yet",
  },
  'clinic.select.no-results': {
    fr: 'Aucun résultat.',
    en: 'No results.',
    es: 'Sin resultados.',
    ht: 'Pa gen rezilta.',
    ar: 'لا توجد نتائج.',
  },

  // Clinic
  'clinic.nav.logo': { fr: 'Refuge', en: 'Refuge', es: 'Refuge', ht: 'Refuge', ar: 'Refuge' },
  'clinic.nav.logout': {
    fr: 'Déconnexion',
    en: 'Logout',
    es: 'Cerrar sesión',
    ht: 'Dekonekte',
    ar: 'تسجيل الخروج',
  },
  'clinic.login.heading': {
    fr: 'Accès clinique juridique',
    en: 'Legal clinic access',
    es: 'Acceso clínica jurídica',
    ht: 'Aksè klinik legal',
    ar: 'الوصول إلى العيادة القانونية',
  },
  'clinic.login.email': {
    fr: 'Courriel',
    en: 'Email',
    es: 'Correo electrónico',
    ht: 'Imèl',
    ar: 'البريد الإلكتروني',
  },
  'clinic.login.password': {
    fr: 'Mot de passe',
    en: 'Password',
    es: 'Contraseña',
    ht: 'Mo de pas',
    ar: 'كلمة المرور',
  },
  'clinic.login.submit': {
    fr: 'Se connecter',
    en: 'Log in',
    es: 'Iniciar sesión',
    ht: 'Konekte',
    ar: 'تسجيل الدخول',
  },
  'clinic.login.hint': {
    fr: 'Vous avez reçu vos identifiants de votre organisation.',
    en: 'You received your credentials from your organisation.',
    es: 'Recibió sus credenciales de su organización.',
    ht: 'Ou te resevwa idantifyan ou nan men òganizasyon ou.',
    ar: 'لقد تلقيت بيانات اعتمادك من مؤسستك.',
  },

  // Clinic dashboard
  'clinic.dashboard.heading': {
    fr: 'Tableau de bord',
    en: 'Dashboard',
    es: 'Panel de control',
    ht: 'Tablo bò',
    ar: 'لوحة التحكم',
  },
  'clinic.dashboard.session': {
    fr: 'Session',
    en: 'Session',
    es: 'Sesión',
    ht: 'Sesyon',
    ar: 'الجلسة',
  },
  'clinic.dashboard.urgency': {
    fr: 'Urgence',
    en: 'Urgency',
    es: 'Urgencia',
    ht: 'Ijans',
    ar: 'الأولوية',
  },
  'clinic.dashboard.category': {
    fr: 'Catégorie',
    en: 'Category',
    es: 'Categoría',
    ht: 'Kategori',
    ar: 'الفئة',
  },
  'clinic.dashboard.status': {
    fr: 'Statut',
    en: 'Status',
    es: 'Estado',
    ht: 'Estati',
    ar: 'الحالة',
  },
  'clinic.dashboard.urgent': {
    fr: 'Urgent',
    en: 'Urgent',
    es: 'Urgente',
    ht: 'Ijan',
    ar: 'عاجل',
  },
  'clinic.dashboard.normal': {
    fr: 'Normal',
    en: 'Normal',
    es: 'Normal',
    ht: 'Nòmal',
    ar: 'عادي',
  },
  'clinic.dashboard.pending': {
    fr: 'En attente',
    en: 'Pending',
    es: 'Pendiente',
    ht: 'An atant',
    ar: 'قيد الانتظار',
  },
  'clinic.dashboard.placeholder': {
    fr: 'Fonctionnalité complète à venir bientôt.',
    en: 'Full case functionality coming soon.',
    es: 'Funcionalidad completa próximamente.',
    ht: 'Fonksyonalite konplè ap vini byento.',
    ar: 'الوظائف الكاملة للملف قريباً.',
  },
}

const AppContext = createContext()

export function AppProvider({ children }) {
  const [language, setLanguage] = useState('fr')
  const [role, setRole] = useState(null)
  const [sessionPin, setSessionPin] = useState(null)
  const [selectedClinic, setSelectedClinic] = useState(null)
  const [interviewPhase0, setInterviewPhase0] = useState({})
  const [interviewAnswers, setInterviewAnswers] = useState({})
  const [interviewPhase1, setInterviewPhase1] = useState({})
  const [interviewPhase2, setInterviewPhase2] = useState({})
  const [interviewPhase3, setInterviewPhase3] = useState(null)
  const [aiInterviewQuestions, setAiInterviewQuestions] = useState([])
  const [contactInfo, setContactInfo] = useState(null)
  const [clinicAuth, setClinicAuth] = useState(null)

  const isAuthenticated = useCallback(() => clinicAuth !== null, [clinicAuth])

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
      value={{ language, setLanguage, role, setRole, sessionPin, setSessionPin, selectedClinic, setSelectedClinic, interviewPhase0, setInterviewPhase0, interviewAnswers, setInterviewAnswers, interviewPhase1, setInterviewPhase1, interviewPhase2, setInterviewPhase2, interviewPhase3, setInterviewPhase3, aiInterviewQuestions, setAiInterviewQuestions, contactInfo, setContactInfo, clinicAuth, setClinicAuth, isAuthenticated, cases: mockCases, t }}
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
