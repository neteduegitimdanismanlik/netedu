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
    headline: 'Open admission on a recognised diploma. Almost every bachelor is in Dutch; the medicine exam is in Dutch too.',
    ibNote: 'No IB points total is used for admission. The IB appears only as evidence of English — IB English B at stated levels counts as B2 proof.',
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
        note: 'Ghent notes that only about 30% of Flemish final-year pupils pass the exam. Capped, ranked intake — you must pass AND rank well.',
        admissionsTest: 'Toelatingsexamen arts en tandarts — biology, chemistry, physics, mathematics, plus generic competences',
        testLocations: 'Flanders, in Dutch only',
        source: 'https://www.ugent.be/ge/nl/toekomstige-studenten/toelatingsexamen',
      },
      {
        area: 'Engineering', offered: true, course: 'Engineering sciences and fourteen other science bachelors',
        language: 'Dutch',
        note: 'No entrance exam. A compulsory "starttoets" applies but it is NOT blocking — Ghent states you may enrol regardless of the result; failing triggers a remedial course. In Dutch.',
        admissionsTest: 'Starttoets (compulsory, non-blocking)',
        source: 'https://www.ugent.be/prospect/en/administration/application/requirement/admission-bachelor/positioningtests-admissionexams.htm',
      },
      {
        area: 'Computer Science', offered: true, language: 'Dutch',
        note: 'No entrance exam; an optional recommended positioning test exists.',
      },
      {
        area: 'Economics & Business', offered: true, language: 'Dutch',
        note: 'No entrance exam; an optional positioning test exists.',
      },
      { area: 'Law', offered: false, note: 'Not checked.' },
      { area: 'Architecture & Art', offered: false, note: 'Not checked.' },
      {
        area: 'Psychology', offered: true, course: 'Bachelor of Social Sciences is the one confirmed English-taught bachelor',
        language: 'English',
        note: 'Application and enrolment for the English Social Sciences bachelor run through VUB, not Ghent.',
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
    headline: 'The IB is automatically recognised — no equivalence procedure needed. Three courses cap non-residents and settle it by lottery.',
    ibNote: 'The IB Diploma is AUTOMATICALLY recognised as equivalent to a Belgian secondary diploma and needs no Fédération Wallonie-Bruxelles equivalence decision. No points total is used. This is a real advantage over the Turkish national diploma, which does need the equivalence.',
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
        note: 'Candidates are ranked by average score and selected down to a government-set quota. UCLouvain defers the exam syllabus to ARES and does not publish the subjects itself.',
        admissionsTest: 'ARES concours d\'entrée en médecine et sciences dentaires',
        testLocations: 'In person in Brussels, 27 August 2026; registration 18 May – 5 July 2026',
        source: 'https://uclouvain.be/fr/facultes/mede/examen-entree',
      },
      {
        area: 'Engineering', offered: true, course: 'Bachelor in engineering (Louvain School of Engineering)',
        language: 'French',
        note: 'A special entrance exam set by the engineering school is required. Its subjects and dates were not on the pages fetched.',
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
        note: 'No entrance exam, but a NON-RESIDENT quota of 30% of the previous intake — 26 places in 2026/27. If oversubscribed, places are drawn at random before a bailiff. Physiotherapy works the same way with 139 places; Veterinary Medicine at 20% with 28.',
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
    headline: 'The engineering entrance exam is an exam, not a competition — ULB states there is no cap on how many pass.',
    ibNote: 'The IB Diploma is listed as a recognised qualification giving access. No points total is applied.',
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
        note: 'Listed as an "études contingentées" programme with a non-resident quota whose percentage ULB does not publish.',
        admissionsTest: 'ARES concours d\'entrée en médecine et sciences dentaires',
        source: 'https://www.ulb.be/en/prepare-your-application/eligibility-requirements',
      },
      {
        area: 'Engineering', offered: true, course: 'Bachelor in Engineering Sciences (ingénieur civil)',
        language: 'French',
        note: 'The ESA tests MATHEMATICS ONLY. ULB is explicit that it is "un examen et non un concours" with no limit on the number admitted — pass it and you are in. Preparatory courses are offered.',
        admissionsTest: 'Examen spécial d\'admission (ESA)',
        source: 'https://polytech.ulb.be/fr/etudes/esa',
      },
      { area: 'Computer Science', offered: false, note: 'Not checked.' },
      {
        area: 'Economics & Business', offered: true, course: 'Bachelor in Business Engineering, option Anglais',
        language: 'English',
        note: 'A confirmed English-taught bachelor at ULB — rare in Belgium. No entrance exam. Solvay bachelors are otherwise mostly in French.',
        source: 'https://www.ulb.be/en/programme/ba-ingee',
      },
      { area: 'Law', offered: false, note: 'Not checked.' },
      { area: 'Architecture & Art', offered: false, note: 'Not checked.' },
      { area: 'Psychology', offered: true, language: 'French', note: 'An "études contingentées" programme with a non-resident quota; details not published.' },
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
    headline: 'One of the few Belgian universities with confirmed English-taught bachelors — and it publishes real IELTS numbers.',
    ibNote: 'No IB statement and no points total found on any VUB page.',
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
        note: 'Passing the exam also serves as proof of Dutch at B2.',
        source: 'https://www.vub.be/en/studying-vub/apply-and-enrol-vub/admission-requirements-and-deadlines/academic-and-language-requirements',
      },
      { area: 'Engineering', offered: false, note: 'Not checked.' },
      { area: 'Computer Science', offered: false, note: 'Not checked.' },
      {
        area: 'Economics & Business', offered: true, course: 'Bachelor Business Economics',
        language: 'English',
        note: 'No entrance exam and no formal mathematics prerequisite, but VUB says a good foundation in mathematics is essential and offers an online self-test. Neither is an admission condition.',
        source: 'https://www.vub.be/en/studying-vub/all-study-programmes-vub/bachelors-and-masters-programmes-vub/bachelor-business-economics/bachelor-business-economics-programme',
      },
      { area: 'Law', offered: false, note: 'Not checked.' },
      { area: 'Architecture & Art', offered: false, note: 'Not checked.' },
      {
        area: 'Psychology', offered: true, course: 'Bachelor of Social Sciences (jointly with Ghent)',
        language: 'English',
        note: 'Ghent directs applicants for this programme to apply and enrol through VUB.',
      },
    ],
  },
]

/*
 * STILL TO RESEARCH for Belgium: Antwerp, Liège, Hasselt, Namur, Vesalius
 * College Brussels — the mid and accessible tiers. KU Leuven also needs a
 * complete re-run from a different network.
 */
