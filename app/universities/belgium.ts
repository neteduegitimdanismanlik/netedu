import type { University } from './schema'

/**
 * Belgium — read from official pages on 3 September 2026.
 *
 * HOW BELGIAN ADMISSION WORKS, and why Reach / Match / Safety does not apply
 * Admission is OPEN. If your secondary diploma is recognised as equivalent and
 * you have the right language level, you may enrol. There is no grade offer,
 * no points threshold, and no IB total anywhere in this file. UCLouvain and
 * ULB name the IB explicitly as AUTOMATICALLY equivalent to a Belgian
 * secondary diploma, which is the only role it plays.
 *
 * THE REAL BARRIER IS LANGUAGE. Flemish universities (KU Leuven, Ghent, VUB)
 * teach undergraduate almost entirely in DUTCH; francophone ones (UCLouvain,
 * ULB) in FRENCH. A handful of English-taught bachelors exist and they are
 * listed here. Everything else needs B2 in Dutch or French.
 *
 * THE EXCEPTIONS ARE MEDICINE AND DENTISTRY. Flanders runs the
 * toelatingsexamen arts en tandarts — in Dutch only — covering biology,
 * chemistry, physics and mathematics, with a ranked, capped intake. Wallonia
 * runs the ARES concours d'entrée, sat in person in Brussels. Separately,
 * UCLouvain caps NON-RESIDENT students in three courses and settles
 * oversubscription by a random draw supervised by a bailiff.
 *
 * DATES: no university has published 2027 entry. The 2026/27 non-EEA deadlines
 * (31 March / 1 April 2026) have already passed. Expect the 2027/28 windows to
 * open between October 2026 and February 2027.
 */
export const BE_UNIVERSITIES: University[] = [
  {
    id: 'kuleuven',
    name: 'KU Leuven',
    city: 'Leuven',
    country: 'Belgium',
    tier: 'high',
    admissionModel: 'open',
    teachingLanguage: 'Dutch',
    cycle: 'not established',
    checkedOn: '2026-09-03',
    sources: ['https://www.kuleuven.be/english/prospective-students'],
    gaps: [
      'RESEARCH FAILED. Every kuleuven.be host blocked automated reading across roughly fifteen attempts. Nothing below headline level could be verified — not the programme list, not the fees, not the deadlines. This record exists only so the gap is visible; it must be filled by hand or from a different network.',
    ],
    areas: [],
  },

  {
    id: 'ghent',
    name: 'Ghent University',
    city: 'Ghent',
    country: 'Belgium',
    tier: 'high',
    admissionModel: 'open',
    teachingLanguage: 'Dutch',
    headline: "Admission is open with a recognised diploma. Almost all bachelors are taught in Dutch, including the medicine exam.",
    ibNote: "IB English B at the stated levels counts as proof of English (B2).",
    ieltsOverall: 6.0,
    ieltsNote: 'For English-taught programmes: IELTS 6.0 (B2), 7.0 (C1), 7.5+ (C2). Dutch-taught programmes need ITNA B2, CNaVT STRT or Staatsexamen NT2 II. Passing the medicine entrance exam also counts as Dutch B2.',
    tuitionCurrency: 'EUR',
    tuitionIntlMin: 1181,
    tuitionIntlMax: 1181,
    tuitionYear: '2026/27 Dutch-taught bachelor: EUR 305.40 fixed plus EUR 14.60 per credit — the SAME rate for EEA and non-EEA students',
    applicationSystem: 'Online application with Qualification Check verification',
    deadlineNote: 'Visa needed: apply October–March, before 1 April. No visa needed: October–May, before 1 June.',
    cycle: '2026/27',
    checkedOn: '2026-09-03',
    sources: [
      'https://www.ugent.be/prospect/en/administration/application/requirement/bachelor.htm',
      'https://studiekiezer.ugent.be/2026/bachelor-of-science-in-medicine',
    ],
    gaps: [
      'The non-EEA fee for ENGLISH-taught bachelors is cross-referenced to the master rate and the amount is not on the page.',
      'The study-chooser reports three English-taught bachelors but only names one.',
    ],
    areas: [
      {
        area: 'Medicine', offered: true, course: 'Bachelor of Science in Medicine',
        language: 'Dutch',
        note: "Limited places: you must pass the exam and rank high enough.",
        admissionsTest: 'Toelatingsexamen arts en tandarts — biology, chemistry, physics, mathematics, plus generic competences',
        testLocations: 'Flanders, in Dutch only',
        source: 'https://www.ugent.be/ge/nl/toekomstige-studenten/toelatingsexamen',
      },
      {
        area: 'Engineering', offered: true, course: 'Engineering sciences and fourteen other science bachelors',
        language: 'Dutch',
        note: "You must take a starting test, but you can enrol whatever your result. Taught in Dutch.",
        admissionsTest: 'Starttoets (compulsory, non-blocking)',
        source: 'https://www.ugent.be/prospect/en/administration/application/requirement/admission-bachelor/positioningtests-admissionexams.htm',
      },
      {
        area: 'Computer Science', offered: true, language: 'Dutch',
      },
      {
        area: 'Economics & Business', offered: true, language: 'Dutch',
      },
      { area: 'Law', offered: false, note: 'Not checked.' },
      { area: 'Architecture & Art', offered: false, note: 'Not checked.' },
      {
        area: 'Psychology', offered: true, course: 'Bachelor of Social Sciences is the one confirmed English-taught bachelor',
        language: 'English',
        note: "Apply for the English Social Sciences bachelor through VUB.",
      },
    ],
  },

  {
    id: 'uclouvain',
    name: 'UCLouvain',
    city: 'Louvain-la-Neuve',
    country: 'Belgium',
    tier: 'high',
    admissionModel: 'open',
    teachingLanguage: 'French',
    headline: "The IB is recognised automatically. Three courses limit places for non-residents and use a lottery.",
    ibNote: "The IB Diploma is automatically recognised as equal to a Belgian secondary diploma, so you do not need a separate equivalence decision. The Turkish national diploma does need one.",
    ieltsNote: 'French evidence (DELF, DALF, TCF or equivalent) is required unless prior study was in French. UCLouvain does not state the CEFR level on the pages fetched. Waived for programmes taught entirely in English.',
    tuitionCurrency: 'EUR',
    tuitionIntlMin: 5369,
    tuitionIntlMax: 5369,
    tuitionYear: '2026/27 pending approval: EUR 1,194 tuition plus a EUR 4,175 non-EU contribution',
    applicationSystem: 'UCLouvain online application',
    deadlineNote: 'Non-EU needing a visa: 31 March. EU or visa-exempt with a foreign qualification: 13 September. EU students holding an IB: 30 September.',
    cycle: '2026/27',
    checkedOn: '2026-09-03',
    sources: [
      'https://www.uclouvain.be/en/enrolment/uclouvain-application-requirements',
      'https://www.uclouvain.be/en/enrolment/limited-enrolment-courses',
    ],
    gaps: ['No bachelor-level English-taught programme list was found. The required French CEFR level is not stated.'],
    areas: [
      {
        area: 'Medicine', offered: true, course: 'Bachelier en médecine / en sciences dentaires',
        language: 'French',
        note: "Candidates are ranked by score, up to a number of places set by the government.",
        admissionsTest: 'ARES concours d\'entrée en médecine et sciences dentaires',
        testLocations: 'In person in Brussels, 27 August 2026; registration 18 May – 5 July 2026',
        source: 'https://uclouvain.be/fr/facultes/mede/examen-entree',
      },
      {
        area: 'Engineering', offered: true, course: 'Bachelor in engineering (Louvain School of Engineering)',
        language: 'French',
        note: "You must pass a special entrance exam set by the engineering school. Check the website for its subjects and dates.",
        admissionsTest: 'Special entrance exam (Louvain School of Engineering)',
        source: 'https://uclouvain.be/en/enrolment/uclouvain-entrance-exams',
      },
      { area: 'Computer Science', offered: false, note: 'Not checked.' },
      { area: 'Economics & Business', offered: false, note: 'Not checked.' },
      { area: 'Law', offered: false, note: 'Not checked.' },
      { area: 'Architecture & Art', offered: false, note: 'Not checked.' },
      {
        area: 'Psychology', offered: true, course: 'Psychology and Education: Speech and Language Therapy',
        language: 'French',
        note: "Places for non-residents are limited (26 in 2026/27). If there are more applicants, places are drawn by lottery.",
        source: 'https://www.uclouvain.be/en/enrolment/limited-enrolment-courses',
      },
    ],
  },

  {
    id: 'ulb',
    name: 'Université libre de Bruxelles',
    city: 'Brussels',
    country: 'Belgium',
    tier: 'mid',
    admissionModel: 'open',
    teachingLanguage: 'French',
    headline: "The engineering entrance exam has no limit on how many students pass.",
    ibNote: "The IB Diploma is accepted for admission.",
    tuitionCurrency: 'EUR',
    tuitionIntlMin: 5369,
    tuitionIntlMax: 5369,
    tuitionYear: '2026/27: EUR 1,194 plus EUR 4,175 for non-EU nationals, plus a non-refundable EUR 200 administrative fee before the file is even examined',
    applicationSystem: 'ULB online application',
    deadlineNote: 'Non-European students, all programmes: 16 February – 31 March. European and EU-resident students: end of June – 30 September.',
    cycle: '2026/27',
    checkedOn: '2026-09-03',
    sources: [
      'https://www.ulb.be/en/prepare-your-application/eligibility-requirements',
      'https://polytech.ulb.be/fr/etudes/esa',
    ],
    gaps: [
      'ULB\'s own pages CONTRADICT each other on French proficiency: the central eligibility page says the French test applies only to Master of Education candidates, while Solvay tells non-Belgian diploma holders they will probably have to sit it. Unresolved.',
      'The non-resident quota percentages for the "études contingentées" are not published on ULB pages.',
    ],
    areas: [
      {
        area: 'Medicine', offered: true, language: 'French',
        note: "Places for non-residents are limited.",
        admissionsTest: 'ARES concours d\'entrée en médecine et sciences dentaires',
        source: 'https://www.ulb.be/en/prepare-your-application/eligibility-requirements',
      },
      {
        area: 'Engineering', offered: true, course: 'Bachelor in Engineering Sciences (ingénieur civil)',
        language: 'French',
        note: "The entrance exam (ESA) tests mathematics only. If you pass, you are admitted. Preparation courses are offered.",
        admissionsTest: 'Examen spécial d\'admission (ESA)',
        source: 'https://polytech.ulb.be/fr/etudes/esa',
      },
      { area: 'Computer Science', offered: false, note: 'Not checked.' },
      {
        area: 'Economics & Business', offered: true, course: 'Bachelor in Business Engineering, option Anglais',
        language: 'English',
        note: "Taught in English.",
        source: 'https://www.ulb.be/en/programme/ba-ingee',
      },
      { area: 'Law', offered: false, note: 'Not checked.' },
      { area: 'Architecture & Art', offered: false, note: 'Not checked.' },
      { area: 'Psychology', offered: true, language: 'French', note: "Places for non-residents are limited." },
    ],
  },

  {
    id: 'vub',
    name: 'Vrije Universiteit Brussel',
    city: 'Brussels',
    country: 'Belgium',
    tier: 'mid',
    admissionModel: 'open',
    teachingLanguage: 'Dutch, with some English-taught bachelors',
    headline: "VUB has English-taught bachelors and lists its IELTS requirements.",
    ieltsOverall: 6.5,
    ieltsComponent: 6.0,
    ieltsNote: 'TOEFL iBT 79 with 18 per component (or 4.5 with 4.0 on the scale used from 21 January 2026); Cambridge B2 First 170. Certificates must be under five years old. Dutch-taught needs NT2 II, CNaVT STRT or ITNA at B2.',
    tuitionCurrency: 'EUR',
    tuitionIntlMin: 5320,
    tuitionIntlMax: 5320,
    tuitionYear: '2026/27 non-EEA worked example: EUR 2,200 fixed plus EUR 52 per credit = EUR 5,320 for a 60-credit year',
    applicationSystem: 'VUB online application',
    deadlineNote: 'Foreign diploma, non-EEA: 31 March 2026. Foreign diploma, EEA: 31 July. Study contract must be signed by 8 October or the application is cancelled.',
    cycle: '2026/27',
    checkedOn: '2026-09-03',
    sources: [
      'https://www.vub.be/en/studying-vub/apply-and-enrol-vub/admission-requirements-and-deadlines/academic-and-language-requirements',
      'https://www.vub.be/en/studying-vub/all-study-programmes-vub/bachelors-and-masters-programmes-vub/bachelor-business-economics/bachelor-business-economics-programme',
    ],
    gaps: ['The full list of English-taught bachelors and the complete fee table are published only as PDFs that were not retrieved.'],
    areas: [
      {
        area: 'Medicine', offered: true, language: 'Dutch',
        admissionsTest: 'Toelatingsexamen arts en tandarts — biology, chemistry, physics, mathematics, plus generic competences',
        note: "Passing the exam also counts as proof of Dutch at B2 level.",
        source: 'https://www.vub.be/en/studying-vub/apply-and-enrol-vub/admission-requirements-and-deadlines/academic-and-language-requirements',
      },
      { area: 'Engineering', offered: false, note: 'Not checked.' },
      { area: 'Computer Science', offered: false, note: 'Not checked.' },
      {
        area: 'Economics & Business', offered: true, course: 'Bachelor Business Economics',
        language: 'English',
        note: "VUB recommends a good foundation in mathematics and offers an online self-test.",
        source: 'https://www.vub.be/en/studying-vub/all-study-programmes-vub/bachelors-and-masters-programmes-vub/bachelor-business-economics/bachelor-business-economics-programme',
      },
      { area: 'Law', offered: false, note: 'Not checked.' },
      { area: 'Architecture & Art', offered: false, note: 'Not checked.' },
      {
        area: 'Psychology', offered: true, course: 'Bachelor of Social Sciences (jointly with Ghent)',
        language: 'English',
      },
    ],
  },
]

/*
 * STILL TO RESEARCH for Belgium: Antwerp, Liège, Hasselt, Namur, Vesalius
 * College Brussels — the mid and accessible tiers. KU Leuven also needs a
 * complete re-run from a different network.
 */
