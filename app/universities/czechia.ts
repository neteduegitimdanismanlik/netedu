import type { University } from './schema'

/**
 * Czechia — read from official pages on 3 September 2026.
 *
 * WHY THIS COUNTRY MATTERS FOR A TURKISH STUDENT
 * Charles University sits the FIRST ROUND OF ITS MEDICINE ENTRANCE EXAM IN
 * ISTANBUL. A student can take it without leaving Turkey, and the second round
 * is an online interview. No IB points threshold, no English certificate for
 * 2026/27, and the fee is roughly a third of a UK medical degree. That single
 * fact is worth more to a Turkish applicant than most of the UK file.
 *
 * HOW CZECH ADMISSION WORKS
 * Entrance-exam driven and radically decentralised — Charles University states
 * outright that it "has no central Admission Office"; each of its 17 faculties
 * runs its own procedure. No IB points total is used anywhere in this file.
 * Charles's Faculty of Mathematics and Physics says so explicitly: the IB total
 * "is not a factor for admission" — only Mathematics AA HL at 6 or above.
 *
 * MONEY: Czech-taught study at public universities is free. English-taught
 * study is fee-paying, and the gap is enormous: EUR 5,000 for a humanities
 * bachelor against EUR 24,250 for medicine.
 */
export const CZ_UNIVERSITIES: University[] = [
  {
    id: 'charles',
    name: 'Charles University',
    city: 'Prague',
    country: 'Czechia',
    tier: 'high',
    admissionModel: 'test-ranked',
    headline: "The Medicine entrance exam can be taken in Istanbul, and the interview round is online.",
    ibNote: "For Mathematics and Physics programmes, you need Mathematics: Analysis and Approaches at Higher Level (HL) with a grade of 6 or higher.",
    ieltsOverall: 6.5,
    ieltsNote: 'Faculty-specific. Maths and Physics: TOEFL iBT 85 / IELTS 6.5 / Duolingo 110. Social Sciences PPE: IELTS 6.5 with 6.0 per band. Arts Psychology: B2, proof only AFTER admission. Medicine: NO English certificate required for 2026/27.',
    tuitionCurrency: 'EUR',
    tuitionIntlMin: 5000,
    tuitionIntlMax: 24250,
    tuitionYear: '2026/27',
    applicationSystem: 'Faculty-level e-application at is.cuni.cz; Social Sciences uses its own portal',
    deadlineNote: 'Set per faculty and they differ wildly: Medicine 5 September 2026, Computer Science 30 April 2026, Psychology 28 February, Liberal Arts 31 March.',
    cycle: '2026/27; Social Sciences already publishes 2027/28',
    checkedOn: '2026-09-03',
    sources: [
      'https://en.lf1.cuni.cz/admission-20262027',
      'https://en.lf1.cuni.cz/written-entrance-test-dates-and-locations',
      'https://www.mff.cuni.cz/en/admissions/admission-requirements-for-bachelor-s-programmes-in-english/2026-2027',
      'https://psychology.ff.cuni.cz/admissions/',
    ],
    gaps: ['Computer Science tuition is not stated on the admissions page. Social Sciences application fee unknown.'],
    areas: [
      {
        area: 'Medicine', offered: true, course: 'General Medicine (6 years, MUDr.) and Dentistry (5 years, MDDr.)',
        note: "A six-year medicine degree you start straight after school. Round 1 is a 90-minute written exam in Biology, Chemistry and General Science. Round 2 is five short online interviews, and only Round 2 decides admission.",
        admissionsTest: 'Two-round faculty entrance exam',
        testLocations: 'Istanbul 31 May 2026; also Prague, London, Berlin, Athens, Toronto, Tel Aviv, Hong Kong, Palma. The interview round is online for everyone.',
        tuition: 'EUR 24,250 per year (2026/27); application fee EUR 285',
        source: 'https://en.lf1.cuni.cz/admission-20262027',
      },
      { area: 'Engineering', offered: false, note: 'Charles is not a technical university.' },
      {
        area: 'Computer Science', offered: true, course: 'Computer Science (Faculty of Mathematics and Physics)',
        hlRequired: ['Mathematics: Analysis and Approaches'],
        note: "Admission is based on a test score, with no entrance exam. HL Mathematics: Analysis and Approaches with a grade 6 meets the requirement. You can also use SAT Math 720 (1250 total), ACT Math 32, or AP Calculus AB 5 / BC 4–5.",
        testThreshold: 'IB Mathematics AA HL grade 6 or above',
        source: 'https://www.mff.cuni.cz/en/admissions/admission-requirements-for-bachelor-s-programmes-in-english/2026-2027',
      },
      {
        area: 'Economics & Business', offered: true, course: 'Economics and Finance (BEF); Politics, Philosophy and Economics (PPE)',
        note: "You apply with your transcript, CV, motivation letter and proof of English, and you may have an online interview. For BEF, you need to show strong school mathematics, and SAT, ACT or SCIO scores are recommended.",
        tuition: 'EUR 7,000 per year',
        source: 'https://study.fsv.cuni.cz/study-programs/bachelor-programs/bef',
      },
      {
        area: 'Law', offered: false,
        note: 'No English-taught bachelor in law. The Faculty of Law\'s English "Specialised Law Studies" is post-bachelor.',
      },
      { area: 'Architecture & Art', offered: false },
      {
        area: 'Psychology', offered: true, course: 'Psychology BA (Faculty of Arts)',
        note: "Admission is based on a portfolio score out of 100: school grades (40), a motivation letter of up to 650 words (30), and your CV and activities (30).",
        tuition: 'CZK 250,000 per year (about EUR 10,000); application fee EUR 60',
        source: 'https://psychology.ff.cuni.cz/admissions/',
      },
    ],
  },

  {
    id: 'ctu-prague',
    name: 'Czech Technical University in Prague',
    city: 'Prague',
    country: 'Czechia',
    tier: 'mid',
    admissionModel: 'test-ranked',
    headline: "All entrance routes can be done online.",
    ieltsOverall: 5.5,
    ieltsNote: 'Faculty-specific and notably low: Information Technology accepts IELTS 5.5 or TOEFL iBT 65; Electrical Engineering wants IELTS 6.0 or TOEFL iBT 70 and does NOT accept Duolingo.',
    tuitionCurrency: 'CZK',
    tuitionIntlMin: 110000,
    tuitionIntlMax: 128000,
    tuitionYear: 'per academic year, 2026/27',
    applicationSystem: 'prihlaska.cvut.cz, administered by each faculty',
    deadlineNote: 'Information Technology 31 March 2026. Electrical Engineering 31 March for the application, with English-track documents by 14 August and online interviews 18–28 August 2026.',
    cycle: '2026/27 for Information Technology and Electrical Engineering',
    checkedOn: '2026-09-03',
    sources: [
      'https://fit.cvut.cz/en/applicants/admissions-procedure/bachelor-study-program',
      'https://fel.cvut.cz/en/admissions/admission-procedures/tuition-fees',
    ],
    gaps: [
      'The Mechanical Engineering conditions page retrieved was the 2023/24 version — its figures must be re-checked.',
      'Application fee differs by faculty: CZK 950 centrally, CZK 900 at Architecture, CZK 850 at Mechanical Engineering.',
    ],
    areas: [
      { area: 'Medicine', offered: false },
      {
        area: 'Engineering', offered: true, course: 'Electrical Engineering; Mechanical Engineering',
        note: "Electrical Engineering uses an online interview. Mechanical Engineering uses an online mathematics test at Czech school-leaving level; you need 50% to pass.",
        admissionsTest: 'Online interview (Electrical) or online mathematics test (Mechanical)',
        testLocations: 'Fully remote',
        tuition: 'CZK 110,000 per year (Electrical)',
        source: 'https://fel.cvut.cz/en/admissions/admission-procedures/step-by-step',
      },
      {
        area: 'Computer Science', offered: true, course: 'Informatics (six specialisations)',
        note: "A 90-minute multiple-choice mathematics test covering algebra, equations, functions, sequences, geometry, combinatorics and logic. No calculators.",
        admissionsTest: 'Mathematics entrance test',
        testLocations: 'Remote through SCIO on 31 January, 28 February, 28 March or 25 April 2026; in person 12 May 2026',
        tuition: 'CZK 64,000 per semester',
        source: 'https://fit.cvut.cz/en/applicants/admissions-procedure/bachelor-study-program',
      },
      { area: 'Economics & Business', offered: false },
      { area: 'Law', offered: false },
      {
        area: 'Architecture & Art', offered: false,
        note: 'CTU teaches architecture in English at MASTER\'S level only. There is no English-taught architecture bachelor.',
        source: 'https://www.fa.cvut.cz/en/applicants/admission/admission-procedure/master-s-degree',
      },
      { area: 'Psychology', offered: false },
    ],
  },

  {
    id: 'masaryk',
    name: 'Masaryk University',
    city: 'Brno',
    country: 'Czechia',
    tier: 'mid',
    admissionModel: 'test-ranked',
    headline: "The English-taught Medicine degree costs CZK 380,000 a year.",
    ibNote: "General Medicine accepts the IB Diploma as a school-leaving certificate.",
    ieltsNote: 'Generally B2, but Masaryk publishes no university-wide numbers. The Faculty of Science states outright: "We do not have any required form of a certificate or level of English."',
    tuitionCurrency: 'EUR',
    tuitionIntlMin: 3000,
    tuitionIntlMax: 16000,
    tuitionYear: '2026/27 — EUR 3,000 for social sciences up to about EUR 16,000 for medicine',
    applicationSystem: 'is.muni.cz/prihlaska',
    deadlineNote: 'Per faculty: Medicine 31 July, Science 28 February, Economics 30 April, Informatics 15 April, Social Studies 15 May.',
    cycle: '2026/27',
    checkedOn: '2026-09-03',
    sources: ['https://www.muni.cz/en/admissions'],
    gaps: ['Whether the medicine entrance exam can be sat outside Czechia is not stated on any page fetched — unlike Charles, no overseas centre is advertised.'],
    areas: [
      {
        area: 'Medicine', offered: true, course: 'General Medicine (6 years, MUDr.); Dentistry',
        note: "Three written exams — Chemistry, Biology and Physics — each with 40 multiple-choice questions in 50 minutes. Syllabi and sample tests are on the website.",
        admissionsTest: 'Written entrance exams in Chemistry, Biology and Physics',
        tuition: 'CZK 380,000 per year (General Medicine); CZK 400,000 (Dentistry)',
        source: 'https://www.med.muni.cz/en/admissions',
      },
      { area: 'Engineering', offered: false },
      {
        area: 'Computer Science', offered: true, course: 'Faculty of Informatics programmes; Data Analytics (Faculty of Science)',
        note: "Data Analytics is taught fully online, with a maximum of 10 students. Tuition is EUR 14,000.",
        tuition: 'EUR 4,500 per year (Informatics)',
        source: 'https://www.muni.cz/en/admissions',
      },
      {
        area: 'Economics & Business', offered: true, course: 'Business Management and Finance; Economics and Public Policy',
        note: "If your qualifications do not already meet the requirements, you take SCIO tests in English, general study skills and mathematics. You also send a motivation video.",
        admissionsTest: 'SCIO tests, conditional', tuition: 'CZK 100,000–120,000 per year',
        source: 'https://www.econ.muni.cz/en/admissions',
      },
      { area: 'Law', offered: false },
      {
        area: 'Architecture & Art', offered: true, course: 'Culture, Media and Performative Arts (Faculty of Arts)',
        tuition: 'CZK 76,000 per year',
      },
      { area: 'Psychology', offered: false, note: 'No English-taught psychology bachelor found at Masaryk. Charles University in Prague has one.' },
    ],
  },
  /* ---------------------------------------------------------------- */
  {
    id: 'palacky',
    name: 'Palacký University Olomouc',
    city: 'Olomouc',
    country: 'Czechia',
    tier: 'mid',
    admissionModel: 'test-ranked',
    headline: "The Medicine entrance exam can be taken fully online, on sixteen dates a year.",
    ibNote: "You need a secondary school-leaving certificate. The entrance exam decides admission.",
    ieltsOverall: 6.0,
    ieltsNote: 'IELTS 6.0, TOEFL 87, Cambridge FCE or PTE 59 — or simply sit the faculty’s own English test on exam day. Waived if your schooling was in English.',
    tuitionCurrency: 'EUR',
    tuitionIntlMin: 2000,
    tuitionIntlMax: 14000,
    tuitionYear: 'Per year for English-taught study: General Medicine EUR 12,500, Dentistry EUR 14,000, Physiotherapy EUR 8,000, English Philology EUR 4,200, English Language for Education EUR 2,000. Czech-taught study is free but needs Czech.',
    applicationSystem: 'Online, EUR 80 per application — which also covers the entrance exam, with no further fee',
    deadlineNote: '2026/27 applications opened 1 November 2025; the complete file is due two weeks before your chosen exam date, and everything closes 31 July 2026.',
    cycle: '2026/27',
    checkedOn: '2026-09-03',
    sources: [
      'https://www.lf.upol.cz/en/studyat-our-faculty/general-medicine-mudr/',
      'https://www.lf.upol.cz/en/officialnotice-board/',
      'https://www.studuj.upol.cz/en/study-programmes/',
    ],
    gaps: ['Some late-August exam dates are restricted to EU citizens or residence-permit holders, so a Turkish applicant should target the earlier ones.'],
    areas: [
      {
        area: 'Medicine', offered: true, course: 'General Medicine (MUDr., 6 years); Dentistry (MDDr., 5 years)',
        language: 'English',
        note: "A written exam in Biology, Chemistry, and Physics or Mathematics (your choice), then an interview. Medical checks and vaccinations are needed when you enrol.",
        admissionsTest: 'Written paper in Biology, Chemistry, and either Physics or Mathematics (your choice), plus an interview',
        testLocations: 'FULLY ONLINE on sixteen dates through 2026, or in person in Olomouc, or in Tel Aviv. There is NO Istanbul centre — unlike Charles University — so the online sitting is the Turkish route.',
        tuition: 'EUR 12,500 per year (Medicine); EUR 14,000 (Dentistry)',
        source: 'https://www.lf.upol.cz/en/studyat-our-faculty/general-medicine-mudr/',
      },
      { area: 'Engineering', offered: false },
      { area: 'Computer Science', offered: false },
      { area: 'Economics & Business', offered: false },
      { area: 'Law', offered: false },
      { area: 'Architecture & Art', offered: false },
      { area: 'Psychology', offered: false, note: 'Charles University in Prague has the English psychology bachelor; Palacký does not.' },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'uwb-pilsen',
    name: 'University of West Bohemia',
    city: 'Pilsen; the English bachelor is taught at the Cheb campus',
    country: 'Czechia',
    tier: 'accessible',
    admissionModel: 'test-ranked',
    headline: "The entrance process is an online interview.",
    ieltsOverall: 5.5,
    ieltsNote: 'B2 minimum: Cambridge First, IELTS 5.5 or TOEFL iBT 72. The university-wide page quotes an old "TOEFL 200" figure on a retired scale — the faculty regulation is the one that binds.',
    tuitionCurrency: 'EUR',
    tuitionYear: 'Not published for this programme. The only official figure is a university-wide statement of EUR 3,000–4,000 a year for English-taught study, which should not be treated as the price.',
    applicationSystem: 'University e-application; CZK 600 application fee',
    deadlineNote: '2026/27 second round closes 31 July 2026. The previous cycle ran applications 2 June – 31 July with exams in late August.',
    cycle: '2026/27',
    checkedOn: '2026-09-03',
    sources: [
      'https://www.international.zcu.cz/en/Full_Time_Student/study_in_english.html',
      'https://www.mdt.zcu.cz/',
    ],
    gaps: [
      'IMPORTANT: West Bohemia has NO medical faculty and no medicine in any language. The English medical school in Pilsen belongs to CHARLES UNIVERSITY, a completely different institution. Do not confuse the two.',
      'Tuition for the one English bachelor is not published anywhere — contact the programme.',
    ],
    areas: [
      { area: 'Medicine', offered: false, note: 'West Bohemia has no medical faculty at all. Pilsen’s English medicine is Charles University’s.' },
      { area: 'Engineering', offered: false, language: 'Czech', note: 'English study starts at master’s level.' },
      { area: 'Computer Science', offered: false, language: 'Czech' },
      {
        area: 'Economics & Business', offered: true, course: 'Management and Digital Technology (Cheb campus, double degree with OTH Amberg-Weiden)',
        language: 'English',
        admissionsTest: 'Two parts out of 120 — a 40-point school-record score (25 needed to progress) plus an 80-point interview in English',
        testThreshold: '60/120 to be admitted',
        testLocations: 'Fully online; you need a microphone and a webcam and nothing else',
        source: 'https://www.mdt.zcu.cz/',
      },
      { area: 'Law', offered: false },
      { area: 'Architecture & Art', offered: false },
      { area: 'Psychology', offered: false },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'vse-prague',
    name: 'Prague University of Economics and Business',
    city: 'Prague',
    country: 'Czechia',
    tier: 'mid',
    admissionModel: 'dossier',
    headline: "Tuition is EUR 6,000 a year, and the entrance step is an online interview on Teams.",
    ieltsNote: 'Unusually light. For International Business: "No English language test or language proficiency certificate is required" — B2 is recommended and your English is scored inside the interview instead.',
    tuitionCurrency: 'EUR',
    tuitionIntlMin: 6000,
    tuitionIntlMax: 6000,
    tuitionYear: 'Per year for English-taught bachelors, charged as EUR 3,000 a semester. Czech-taught study is free but needs Czech.',
    applicationSystem: 'University admissions portal',
    deadlineNote: 'International Business has published its 2027/28 cycle: applications open 1 November 2026, close 28 February 2027, interviews early March, results mid-March.',
    cycle: '2027/28 for International Business; 2026/27 elsewhere',
    checkedOn: '2026-09-03',
    sources: [
      'https://admissions.vse.cz/admission-procedure/',
      'https://ibb.vse.cz/admission-process/entrance-exam/',
      'https://fba.vse.cz/wp-content/uploads/sites/2/Admission-Procedure-Regulation-for-the-Academic-Year-202627_final-EN.pdf',
    ],
    gaps: [
      'The application fee reads EUR 100 on the central page and EUR 50 in the Faculty of Business Administration regulation. Both are official; they may differ by faculty.',
      'Diploma recognition (nostrification) needs notarised documents, certified Czech translations and a CZK 1,000 fee — VŠE will run it for you for about EUR 40 plus translation costs.',
    ],
    areas: [
      { area: 'Medicine', offered: false },
      { area: 'Engineering', offered: false },
      {
        area: 'Computer Science', offered: true, course: 'Business Information Systems and Computer Science',
        language: 'English',
        note: "Opens in September 2027. Check the website for admission details.",
      },
      {
        area: 'Economics & Business', offered: true, course: 'International Business; Business Administration; Economics; Economic Data Science; International and Diplomatic Studies',
        language: 'English',
        note: "International Business: an interview on a set topic, scored 50 for motivation and 50 for English — you need at least half in each. Business Administration: a 1,000–1,200 word essay, a spoken defence of it, and a three-minute video.",
        admissionsTest: 'Structured interview (International Business) or essay plus defence plus video (Business Administration)',
        testLocations: 'Fully remote — MS Teams. VŠE states applicants "do not need to come to the University in person".',
        tuition: 'EUR 6,000 per year',
        source: 'https://ibb.vse.cz/admission-process/entrance-exam/',
      },
      { area: 'Law', offered: false },
      { area: 'Architecture & Art', offered: false },
      { area: 'Psychology', offered: false },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'but-brno',
    name: 'Brno University of Technology',
    city: 'Brno',
    country: 'Czechia',
    tier: 'accessible',
    admissionModel: 'test-ranked',
    headline: "The entrance exam must be taken in person in Brno.",
    ieltsNote: 'No minimum published for bachelor entry. English is assessed as a session inside the entrance exam itself.',
    tuitionCurrency: 'EUR',
    tuitionIntlMin: 1000,
    tuitionIntlMax: 4500,
    tuitionYear: '2026/27 — Electrical Engineering EUR 1,000 for EU and Ukrainian students, EUR 4,500 non-EU; Civil Engineering EUR 3,950 / EUR 4,450; Mechanical Engineering EUR 3,000 for everyone. Non-EU electrical students can apply for a scholarship covering half the fee.',
    applicationSystem: 'University e-application; CZK 700 fee, plus CZK 750 for the foreign-education assessment',
    deadlineNote: 'Electrical Engineering: application and fee by 31 March, documents by 15 April 2026, exams in the second half of May, decision within a month.',
    cycle: '2026/27',
    checkedOn: '2026-09-03',
    sources: [
      'https://www.fekt.vut.cz/en/applicants/studies_in_english/fees',
      'https://www.fekt.vut.cz/en/applicants/studies_in_english/entrance_exam',
      'https://www.vut.cz/en/study-options/join-but',
    ],
    gaps: ['No English-taught computer science bachelor — the IT faculty teaches English only from master’s level. No English architecture bachelor either.'],
    areas: [
      { area: 'Medicine', offered: false },
      {
        area: 'Engineering', offered: true, course: 'Electrical Engineering (BPA-ELE); Civil Engineering; Fundamentals of Mechanical Engineering',
        language: 'English',
        note: "Bachelor applicants take the exam in person in Brno. A sample paper is on the website.",
        admissionsTest: 'Written test in mathematics, physics and informatics at school level, plus an English session',
        testLocations: 'IN PERSON in Brno only, typically the second half of May. No overseas centre and no remote option.',
        tuition: 'EUR 4,500 per year for non-EU students (Electrical Engineering)',
        source: 'https://www.fekt.vut.cz/en/applicants/studies_in_english/entrance_exam',
      },
      { area: 'Computer Science', offered: false, note: 'English only at master’s level.' },
      {
        area: 'Economics & Business', offered: true, course: 'Entrepreneurship and Small Business Development',
        language: 'English',
        note: "A group interview in English, scored out of 100; you need 30 to pass.",
        admissionsTest: 'Group oral interview in English',
        source: 'https://www.vut.cz/en/board/internal-legislation-fbm/-d265813/rules-of-admissions-and-conditions-for-admission-to-study-in-bachelor-and-master-programmes-taught-in-english-for-the-academic-year-2025-2026-p273922',
      },
      { area: 'Law', offered: false },
      { area: 'Architecture & Art', offered: false, language: 'Czech', note: 'English at master’s level only.' },
      { area: 'Psychology', offered: false },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'aau-prague',
    name: 'Anglo-American University',
    city: 'Prague',
    country: 'Czechia',
    tier: 'accessible',
    admissionModel: 'dossier',
    headline: "You need at least 24 IB points, with CAS, TOK and the Extended Essay completed.",
    ibTypicalLow: 24,
    ibTypicalHigh: 24,
    ibNote: "The IB Diploma is accepted with at least 24 points, including CAS, TOK and the Extended Essay. If you send your IB Diploma before the semester starts, you do not need a separate English test.",
    ieltsOverall: 6.0,
    ieltsComponent: 5.5,
    ieltsNote: 'B2: IELTS 6.0 with nothing below 5.5, TOEFL iBT 72, Cambridge FCE grade C or CAE 160. Duolingo is explicitly NOT accepted. Waived by an IB Diploma, or by English-medium secondary schooling in a listed country.',
    tuitionCurrency: 'EUR',
    tuitionIntlMin: 11934,
    tuitionIntlMax: 11934,
    tuitionYear: '2026/27 — about EUR 5,967 a semester for non-EU students (EUR 5,185 for EU/EFTA), roughly EUR 35,800 for the whole degree. A 5% rise is expected for students starting after 31 August 2026, which affects 2027 entry.',
    applicationSystem: 'AAU online application; CZK 1,000 fee',
    deadlineNote: 'ROLLING ADMISSIONS — "you can submit your applications all year round." No fixed deadline, which makes this the fallback when other cycles have closed.',
    cycle: '2026/27',
    checkedOn: '2026-09-03',
    sources: [
      'https://www.aauni.edu/admissions/undergraduate-admission/',
      'https://www.aauni.edu/admissions/tuition-payment/',
      'https://www.aauni.edu/programs/undergraduate/',
    ],
    gaps: ['A private, English-medium university — there is no free Czech-taught route here, unlike the public universities in this file.'],
    areas: [
      { area: 'Medicine', offered: false },
      { area: 'Engineering', offered: false },
      { area: 'Computer Science', offered: false },
      {
        area: 'Economics & Business', offered: true, course: 'BA in Business Administration (American and European double accreditation)',
        language: 'English',
        note: "You send your diploma, transcript, CV and a 250–650 word personal statement, then have an interview.",
        testLocations: 'Interview by Google Meet or in person',
        source: 'https://www.aauni.edu/admissions/undergraduate-admission/',
      },
      {
        area: 'Law', offered: true, course: 'BA in International and European Legal Studies',
        language: 'English',
      },
      {
        area: 'Architecture & Art', offered: true, course: 'BA in Visual Art Studies',
        language: 'English',
      },
      {
        area: 'Psychology', offered: true, course: 'BA in Psychology',
        language: 'English', note: "You send your documents, then have an online interview.",
      },
    ],
  },
]

/*
 * Czechia now holds eight universities across all three tiers. Still
 * missing: Czech University of Life Sciences, Technical University of Liberec,
 * and the Charles University Faculty of Medicine in PILSEN and HRADEC KRALOVE,
 * which are separate faculties from the Prague one already in this file and
 * run their own English medicine intakes.
 */
