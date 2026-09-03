import type { University } from './schema'

/**
 * France — read from official pages on 3 September 2026.
 *
 * THE ONE THING TO UNDERSTAND: France does not make grade offers. Four of
 * these five publish NO academic threshold at all. École Polytechnique is the
 * single exception, and even it says "there are no minimum grades required to
 * be able to apply" — it names required SUBJECTS instead.
 *
 * WHICH DOOR YOU GO THROUGH DEPENDS ON YOUR PASSPORT AND YOUR DIPLOMA
 *   Parcoursup        — anyone holding a French or European baccalaureate
 *   Études en France  — non-EU applicants in the 70-odd Campus France countries
 *                       (Turkey is one), through the local Campus France office
 *   DAP dossier blanc — non-EU applicants where Campus France has no office
 *   Own portal        — Sciences Po and École Polytechnique bypass all of this
 *
 * MONEY IS THE SURPRISE. A public university licence costs EUR 178 a year.
 * Paris-Saclay exempts non-EU students down to that same EUR 178 by decision
 * CA-2026-013. The selective private-style institutions are a different world:
 * Sciences Po EUR 14,900, Polytechnique EUR 19,600, PSL's AI bachelor
 * EUR 19,500.
 *
 * MEDICINE: not formally closed, but gated behind CERTIFIED C1 FRENCH and the
 * DAP. Sorbonne's health faculty is explicit — "we require C1 level in French.
 * We will only accept official certificates."
 */
export const FR_UNIVERSITIES: University[] = [
  {
    id: 'sciencespo',
    name: 'Sciences Po',
    city: 'Paris and six regional campuses',
    country: 'France',
    tier: 'high',
    admissionModel: 'dossier',
    headline: 'No minimum grades of any kind. Scored out of 120: three application components at 20 each, plus an interview worth 60.',
    ibNote: 'No minimum IB points and no HL subject requirements. The FAQ states plainly that there are no minimum grade requirements for the IB or for A-levels. Selection is holistic.',
    satPolicy: 'accepted',
    satNote: 'Sciences Po\'s own words: "Submitting SAT/ACT scores is possible but entirely optional (and not expected)."',
    ieltsNote: 'No language certificate is required at application. Sciences Po asks applicants to judge for themselves whether their level fits the campus they choose.',
    teachingLanguage: 'Varies by campus — Le Havre is English, Menton French or English, Paris French',
    tuitionCurrency: 'EUR',
    tuitionIntlMin: 14900,
    tuitionIntlMax: 14900,
    tuitionYear: '2026/27 — a flat non-EU rate. EU students are income-scaled from EUR 0 to EUR 12,363, and Sciences Po says nearly one in three students holds a full-fee scholarship.',
    applicationSystem: 'Sciences Po\'s own International Admissions Pathway; Parcoursup only for applicants in French schools',
    deadlineNote: 'September 2026 intake: opened 30 October 2025, closed 10 March 2026. Interviews about six weeks later. The 2027 calendar was not yet published.',
    cycle: 'September 2026',
    checkedOn: '2026-09-03',
    sources: [
      'https://www.sciencespo.fr/admissions/en/undergraduate/foreign-secondary-schools/',
      'https://www.sciencespo.fr/admissions/en/undergraduate/faq/',
      'https://www.sciencespo.fr/students/en/fees-funding/tuition-fees/',
    ],
    gaps: ['The "Bachelor of Arts and Sciences" is a separate four-year dual degree taught in FRENCH — not the main undergraduate route. The English option is the Bachelor of Arts at Le Havre, Menton or Reims.'],
    areas: [
      { area: 'Medicine', offered: false },
      { area: 'Engineering', offered: false },
      { area: 'Computer Science', offered: false },
      {
        area: 'Economics & Business', offered: true, course: 'Bachelor of Arts, Economics major',
        note: 'No published grade threshold. Dossier plus interview, and only applicants above a cut-off on the written application are invited to interview.',
        interview: true,
        source: 'https://www.sciencespo.fr/college/en/academics/bachelor/',
      },
      {
        area: 'Law', offered: true, course: 'Bachelor of Arts, Law major',
        note: 'No published grade threshold. The interview covers a self-introduction, an image-analysis task and a discussion of motivation.',
        interview: true,
        source: 'https://www.sciencespo.fr/college/en/academics/bachelor/',
      },
      { area: 'Architecture & Art', offered: false },
      { area: 'Psychology', offered: false },
    ],
  },

  {
    id: 'polytechnique',
    name: 'École Polytechnique',
    city: 'Palaiseau',
    country: 'France',
    tier: 'high',
    admissionModel: 'dossier',
    headline: 'Entirely in English, three rolling rounds, and the only French institution here that names required HL subjects.',
    ibNote: 'Mathematics at Higher Level, preferably Analysis and Approaches, AND at least one other science at Higher Level. No points minimum — "For the moment, there are no minimum grades required to be able to apply." What they look for is a strong GPA and high potential in mathematics.',
    ieltsOverall: 6.5,
    ieltsComponent: 6.0,
    ieltsNote: 'English C1 is mandatory: TOEFL iBT 90, IELTS 6.5 with 6.0 in every skill, or Cambridge CAE/CPE grade B. Exemption for native speakers or two years of English-medium secondary schooling. No French is needed to apply.',
    tuitionCurrency: 'EUR',
    tuitionIntlMin: 19600,
    tuitionIntlMax: 19600,
    tuitionYear: 'Non-EU EUR 19,600; EU/EEA EUR 15,900. Fees stay constant for the whole programme. Aid is limited and generally does not cover full tuition.',
    applicationSystem: 'candidatures.polytechnique.fr — not Parcoursup, not Études en France',
    deadlineNote: '2027 entry, three rounds: 17 September – 20 October 2026 (results January), 21 October 2026 – 6 January 2027 (results March), 7 January – 8 February 2027 (results April).',
    cycle: '2027 entry',
    checkedOn: '2026-09-03',
    sources: [
      'https://programmes.polytechnique.edu/en/bachelors-admissions/bachelor-of-science/admissions-criteria-and-procedure',
      'https://programmes.polytechnique.edu/en/bachelor/admissions/faq',
      'https://programmes.polytechnique.edu/en/bachelor/costs-and-funding/tuition-fees',
    ],
    gaps: ['Two official pages disagree on the application fee: EUR 105 on the admissions criteria page, EUR 95 in the FAQ. Both fetched, neither resolved.'],
    areas: [
      { area: 'Medicine', offered: false },
      {
        area: 'Engineering', offered: true, course: 'Bachelor of Science — Mathematics and Physics double major',
        language: 'English',
        hlRequired: ['Mathematics', 'one other science'],
        note: 'Three years, 180 ECTS, entirely taught in English. Mathematics AA is preferred over AI. Every round includes an interview.',
        interview: true,
        source: 'https://programmes.polytechnique.edu/en/bachelor/about-the-bachelor/bachelor-of-science',
      },
      {
        area: 'Computer Science', offered: true, course: 'Bachelor of Science — Mathematics and Computer Science double major',
        language: 'English',
        hlRequired: ['Mathematics', 'one other science'],
        interview: true,
        source: 'https://programmes.polytechnique.edu/en/bachelor/admissions/faq',
      },
      {
        area: 'Economics & Business', offered: true, course: 'Bachelor of Science — Mathematics and Economics double major',
        language: 'English',
        hlRequired: ['Mathematics', 'one other science'],
        note: 'Even the economics track carries the full mathematics-and-science HL requirement.',
        interview: true,
        source: 'https://programmes.polytechnique.edu/en/bachelor/about-the-bachelor/bachelor-of-science',
      },
      { area: 'Law', offered: false },
      { area: 'Architecture & Art', offered: false },
      { area: 'Psychology', offered: false },
    ],
  },

  {
    id: 'psl',
    name: 'Université PSL',
    city: 'Paris',
    country: 'France',
    tier: 'high',
    admissionModel: 'dossier',
    headline: 'Two fully English bachelors — an AI degree at EUR 19,500 and a new engineering one — while CPES costs EUR 178.',
    ibNote: 'No IB points or HL subjects published. The AI bachelor asks for a general baccalaureate or recognised equivalent, strong results across all subjects, and advanced school mathematics covering limits, continuity, differentiation, integration, probability, complex numbers and polynomial equations.',
    ieltsNote: 'The AI bachelor wants a C1 command of English. The engineering bachelor wants English B2 and French A2, and accepts TOEFL, IELTS, DELF/DALF, SAT, ACT or TSI as optional evidence.',
    teachingLanguage: 'Mixed — two English bachelors, the rest in French',
    tuitionCurrency: 'EUR',
    tuitionIntlMin: 178,
    tuitionIntlMax: 19500,
    tuitionYear: 'CPES EUR 178 for 2025/26; the AI bachelor EUR 19,500 for 2026/27 with an EU income scale from EUR 0 to EUR 14,900. Plus EUR 105 CVEC.',
    applicationSystem: 'Depends on the programme and passport: Parcoursup, Études en France, DAP, or the engineering bachelor\'s own platform',
    deadlineNote: 'Parcoursup 2026: opens 19 January, choices by 12 March, confirmation 1 April. The AI bachelor via Campus France ran 1 October – 15 December 2025.',
    cycle: '2026 entry',
    checkedOn: '2026-09-03',
    sources: [
      'https://psl.eu/en/education/applying-bachelors-degree',
      'https://psl.eu/en/education/international-bachelor-science-ai',
      'https://psl.eu/en/international-admissions-procedures-psl',
    ],
    gaps: ['Tuition for the engineering bachelor and for the Dauphine-PSL bachelors is not published on any page fetched.'],
    areas: [
      { area: 'Medicine', offered: false },
      {
        area: 'Engineering', offered: true, course: 'International Bachelor of Environmentally Engaged Engineering (Mines Paris-PSL, Sophia Antipolis)',
        language: 'English',
        note: 'New for 2026 and taught entirely in English. Application is transcripts, a cover letter, a CV and two references, then a motivational interview in English by videoconference.',
        interview: true,
        source: 'https://psl.eu/en/education/international-bachelor-environmentally-engaged-engineering-i-be3',
      },
      {
        area: 'Computer Science', offered: true, course: 'International Bachelor of Science in Artificial Intelligence (IBSAI)',
        language: 'English',
        note: 'All classes in English, three years, 180 ECTS. No test and no interview — selection is a file review on academic record, language and motivation. No numeric threshold is published.',
        tuition: 'EUR 19,500 per year',
        source: 'https://psl.eu/en/education/international-bachelor-science-ai',
      },
      {
        area: 'Economics & Business', offered: true, course: 'Dauphine-PSL: Applied Economics, Management, Organizational Sciences',
        language: 'French, with Organizational Sciences partly in English',
        note: 'Parcoursup for European baccalaureate holders; DAP through Études en France for non-EU holders of a foreign diploma.',
        source: 'https://dauphine.psl.eu/en/international/come-study-at-dauphine/international-students/how-to-apply',
      },
      { area: 'Law', offered: true, course: 'Dauphine-PSL Bachelor in Law', language: 'French', note: 'No threshold published.' },
      {
        area: 'Architecture & Art', offered: true, course: 'ENSAD undergraduate diploma; Architecture studies diploma; CNSAD acting',
        language: 'French',
        note: 'CNSAD runs its own procedure entirely outside Parcoursup.',
        source: 'https://psl.eu/en/education/applying-bachelors-degree',
      },
      { area: 'Psychology', offered: false },
    ],
  },

  {
    id: 'sorbonne',
    name: 'Sorbonne Université',
    city: 'Paris',
    country: 'France',
    tier: 'high',
    admissionModel: 'open',
    teachingLanguage: 'French — B2 minimum is described as indispensable',
    headline: 'EUR 178 a year, no grade threshold at all — but no English-taught licence either, and medicine needs certified C1 French.',
    ibNote: 'No IB points or HL subjects published. Entry rests on holding a recognised secondary qualification and going through the right procedure, not on a grade.',
    ieltsNote: 'French is what matters: B2 minimum for Licence 1, proven by TCF, DELF or TEF. Medicine requires C1 and accepts official certificates only.',
    tuitionCurrency: 'EUR',
    tuitionIntlMin: 178,
    tuitionIntlMax: 178,
    tuitionYear: '2026/27 standard licence fee, plus the compulsory CVEC. Sorbonne does apply a higher differentiated non-EU fee but also runs a broad exemption policy; the gross amount is not published.',
    applicationSystem: 'DAP through Études en France for non-EU holders of a foreign diploma; Parcoursup for anyone holding a French or European baccalaureate',
    deadlineNote: 'DAP for Licence 1: 1 October 2025 – 15 January 2026. Parcoursup: 19 January – 12 March 2026. University response 30 April 2026.',
    cycle: '2026/27',
    checkedOn: '2026-09-03',
    sources: [
      'https://sciences.sorbonne-universite.fr/international-1/venir-la-faculte/etudiantes-et-etudiants-internationaux/venir-titre-individuel-0',
      'https://www.sorbonne-universite.fr/en/education/study-sorbonne-university/enrolment-procedures-and-tuition-fees',
      'https://sante.sorbonne-universite.fr/en/international/incoming/admission-1st-year-medical-studies',
    ],
    gaps: [
      'No English-taught licence was found on any official page.',
      'Sorbonne Université has NO law faculty — law in Paris is at Université Paris 1 Panthéon-Sorbonne, a different institution — and no architecture school.',
      'The differentiated non-EU fee amount is never stated, only the exemption policy.',
    ],
    areas: [
      {
        area: 'Medicine', offered: true, course: 'PASS / L.AS, first year of medical studies',
        language: 'French',
        note: 'The gate is language, not grades: "we require C1 level in French. We will only accept official certificates." The faculty looks for good results in scientific subjects and reads the cover letter, but publishes no academic threshold.',
        source: 'https://sante.sorbonne-universite.fr/en/international/incoming/admission-1st-year-medical-studies',
      },
      {
        area: 'Engineering', offered: true, course: 'Licences in the Faculty of Science and Engineering',
        language: 'French, B2 indispensable',
        note: 'No published grade threshold and no HL subject list. DAP for non-EU applicants with a foreign diploma.',
        source: 'https://sciences.sorbonne-universite.fr/international-1/venir-la-faculte/etudiantes-et-etudiants-internationaux/venir-titre-individuel-0',
      },
      { area: 'Computer Science', offered: true, language: 'French, B2 indispensable', note: 'Within the Faculty of Science and Engineering. No threshold published.' },
      { area: 'Economics & Business', offered: false, note: 'Not confirmed at undergraduate level.' },
      { area: 'Law', offered: false, note: 'Sorbonne Université has no law faculty.' },
      { area: 'Architecture & Art', offered: false, note: 'No architecture school.' },
      { area: 'Psychology', offered: false, note: 'Not confirmed.' },
    ],
  },

  {
    id: 'paris-saclay',
    name: 'Université Paris-Saclay',
    city: 'Gif-sur-Yvette and Orsay',
    country: 'France',
    tier: 'high',
    admissionModel: 'open',
    teachingLanguage: 'French — "A good level of French (B2 or C1) is required to attend the courses"',
    headline: 'Non-EU students are exempted down to the domestic EUR 178 by university decision — one of the cheapest options anywhere in this file.',
    ibNote: 'No IB points or HL subjects published on any official page.',
    ieltsNote: 'French B2 or C1. The accepted tests and minimum scores are not published on the pages fetched.',
    tuitionCurrency: 'EUR',
    tuitionIntlMin: 178,
    tuitionIntlMax: 178,
    tuitionYear: '2026/27. Paris-Saclay grants non-EU students a partial exemption bringing them to the same EUR 178 as domestic students, by administrative decision CA-2026-013 of 3 February 2026.',
    applicationSystem: 'Parcoursup for French or European baccalaureate holders of any nationality; Études en France for non-EU applicants in Campus France countries; DAP dossier blanc elsewhere',
    deadlineNote: 'DAP dossier blanc typically November to January. Parcoursup 19 January – 12 March 2026. Health studies for 2025/26 closed 15 December 2025 with a response by 30 April.',
    cycle: '2026/27',
    checkedOn: '2026-09-03',
    sources: [
      'https://www.universite-paris-saclay.fr/etudiants-internationaux-candidater-en-premier-cycle',
      'https://www.universite-paris-saclay.fr/admission/droits-dinscription',
      'https://www.medecine.universite-paris-saclay.fr/formations/acces-direct-aux-etudes-de-sante/acces-en-premiere-annee-des-formations-de-sante-pass/las-pour-les-etudiants-extracommunautaires',
    ],
    gaps: [
      'No list of English-taught bachelors exists — Paris-Saclay publishes an English-taught list for MASTER\'S only.',
      'The Jean Monnet law faculty page could not be fetched.',
    ],
    areas: [
      {
        area: 'Medicine', offered: true, course: 'PASS / LAS, first year of health studies',
        language: 'French',
        note: 'DAP is compulsory for non-EU holders of a foreign diploma. Paris-Saclay warns that entering this procedure does not entitle a successful candidate to any study exemptions. No academic threshold and no international quota is published.',
        source: 'https://www.medecine.universite-paris-saclay.fr/formations/acces-direct-aux-etudes-de-sante/acces-en-premiere-annee-des-formations-de-sante-pass/las-pour-les-etudiants-extracommunautaires',
      },
      {
        area: 'Engineering', offered: true, course: 'BUT (three-year technology degree) and DEUST',
        language: 'French',
        note: 'No threshold published.',
      },
      {
        area: 'Computer Science', offered: true, course: 'Bachelor of Computer Sciences Applied to Business Management',
        note: 'Language of instruction is not stated on the programme page.',
        source: 'https://www.ritm.universite-paris-saclay.fr/bachelors/',
      },
      {
        area: 'Economics & Business', offered: true, course: 'Bachelor in Economics and Management; Double Degree in Economics and Mathematics',
        note: 'The double degree is described as selective, but no criteria are published.',
        source: 'https://www.ritm.universite-paris-saclay.fr/bachelors/',
      },
      { area: 'Law', offered: true, course: 'Faculté Jean Monnet', language: 'French', note: 'Programme names and requirements could not be verified — the faculty page would not load.' },
      { area: 'Architecture & Art', offered: false, note: 'Not found at undergraduate level.' },
      { area: 'Psychology', offered: false, note: 'Not confirmed.' },
    ],
  },
]

/*
 * STILL TO RESEARCH for France: HEC Paris, ESSEC, ESCP, EDHEC, Université
 * Paris Cité and the American University of Paris — the business schools and
 * the accessible tier this file is missing.
 */
