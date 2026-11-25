import type { University } from './schema'

/**
 * Japan — read from official pages on 2 September 2026.
 *
 * THREE THINGS THAT CHANGE THE ADVICE COMPLETELY
 *
 * 1. UTOKYO PEAK IS CLOSING. The University of Tokyo states that September
 *    2026 was the FINAL intake for PEAK. Any guidance naming PEAK is now
 *    obsolete. The 2027 English-track route is the new UTokyo College of
 *    Design, first intake 2027, 100 places.
 *
 * 2. THERE IS NO ENGLISH-TAUGHT UNDERGRADUATE MEDICINE at any of these five.
 *    Kyoto says so outright. Keio and Science Tokyo place medicine in
 *    Japanese-medium routes requiring high Japanese proficiency.
 *
 * 3. NO ONE PUBLISHES AN IB CUT-OFF except UTokyo. Waseda: "There is no
 *    minimum score requirement for the standardized test." Keio: "There are no
 *    cut-off IB, SAT, or ACT scores" and no subject requirements at all. Kyoto
 *    and Science Tokyo set no total either. Admission is a dossier judgement,
 *    which is why the matcher must not show Reach / Match / Safety here.
 *
 * A NOTE ON "ENGLISH-TAUGHT". Kyoto's iUP is not what it sounds like: the
 * final two years are "taught mainly, or exclusively, in Japanese", with a
 * Japanese qualifying test between the preparatory course and faculty entry.
 * Only Kyoto's Civil Engineering ICP is fully in English.
 */
export const JP_UNIVERSITIES: University[] = [
  {
    id: 'utokyo',
    name: 'University of Tokyo',
    city: 'Tokyo',
    country: 'Japan',
    tier: 'high',
    admissionModel: 'dossier',
    headline: "The 2027 English route is the new College of Design: 100 places, applications 15 October – 5 November 2026.",
    ibTypicalLow: 38,
    ibTypicalHigh: 38,
    ibNote: "College of Design (2027): 38 of 42 points for your six subjects, plus at least 2 points from TOK and the Extended Essay.",
    ieltsOverall: 6.0,
    ieltsNote: 'College of Design: TOEFL iBT 80, IELTS 6.0, Duolingo 110. Only scores taken from 1 January 2025. Route B applicants are exempt after four years of English-medium schooling.',
    satPolicy: 'accepted',
    satNote: 'SAT 1480 or above (ERW plus Maths); ACT composite 33 or above; three A-levels at A or above. EJU is explicitly NOT accepted for the College of Design.',
    tuitionCurrency: 'JPY',
    tuitionIntlMin: 642960,
    tuitionIntlMax: 642960,
    tuitionYear: 'PEAK 2026 figures: JPY 642,960 tuition plus a JPY 282,000 admission fee. College of Design fees were not published.',
    applicationSystem: 'Programme-specific online portal',
    deadlineNote: 'College of Design 2027: applications 15 October – 5 November 2026; video assignment 13–16 November; Route B online interview 13–22 January 2027.',
    cycle: '2027 entry',
    checkedOn: '2026-09-02',
    sources: [
      'https://design.adm.u-tokyo.ac.jp/admissions/admissions-overview-2027/',
      'https://www.u-tokyo.ac.jp/en/prospective-students/undergraduate_english.html',
    ],
    gaps: [
      'College of Design tuition, degree structure and subject prerequisites are all unpublished.',
      'Route A requires Japan\'s Common Test at roughly 80% plus in-person screening — not realistic for an overseas IB student. Route B is the international route.',
    ],
    areas: [
      { area: 'Medicine', offered: false, language: 'Japanese', note: 'Japanese-medium Special Screening only.' },
      { area: 'Engineering', offered: false, language: 'Japanese', note: 'No English-taught first-year engineering degree.' },
      { area: 'Computer Science', offered: false, language: 'Japanese' },
      { area: 'Economics & Business', offered: false, language: 'Japanese' },
      { area: 'Law', offered: false, language: 'Japanese' },
      {
        area: 'Architecture & Art', offered: true, course: 'UTokyo College of Design',
        language: 'English', ibPoints: 38, ibHl: '38 of 42 plus 2 from TOK and EE',
        note: "A design degree that applies design thinking across many fields. It is not an architecture or fine art degree.",
        admissionsTest: 'Document screening, a video assignment, then a 30-minute online interview (Route B)',
        source: 'https://design.adm.u-tokyo.ac.jp/admissions/admissions-overview-2027/',
      },
      { area: 'Psychology', offered: false },
    ],
  },

  {
    id: 'kyoto',
    name: 'Kyoto University',
    city: 'Kyoto',
    country: 'Japan',
    tier: 'high',
    admissionModel: 'dossier',
    headline: "iUP offers full tuition waivers and a monthly allowance; the last two years are taught in Japanese.",
    ibNote: "The IB Diploma is accepted. You send predicted grades when you apply. For science, engineering, pharmacy and agriculture, Mathematics: Analysis and Approaches HL is highly recommended.",
    ieltsOverall: 6.0,
    ieltsNote: 'iUP states there is no specific minimum; successful candidates averaged TOEFL iBT 90 or IELTS 6.5. Civil Engineering ICP sets TOEFL iBT 72 or IELTS 6.0.',
    tuitionCurrency: 'JPY',
    tuitionIntlMin: 535800,
    tuitionIntlMax: 535800,
    tuitionYear: 'Annual undergraduate tuition, plus a JPY 282,000 admission fee. Full waivers of both are available for all iUP students, with a monthly allowance of up to JPY 120,000 during the preparatory course.',
    applicationSystem: 'admission.iup.kyoto-u.ac.jp',
    deadlineNote: 'iUP for October 2027: applications 2 November – 3 December 2026; interview 1–16 March 2027; results 6 April 2027.',
    cycle: 'October 2027 enrolment',
    checkedOn: '2026-09-02',
    sources: ['https://www.iup.kyoto-u.ac.jp/Application_Guidelines_for_October_2027_Enrollment.pdf'],
    gaps: ['The five iUP-eligible engineering departments are not named, so whether computer science or architecture is among them is unknown.'],
    areas: [
      {
        area: 'Medicine', offered: false,
        note: 'Explicitly excluded: "The program does not currently offer enrollment in the Faculty of Medicine."',
        source: 'https://www.iup.kyoto-u.ac.jp/Application_Guidelines_for_October_2027_Enrollment.pdf',
      },
      {
        area: 'Engineering', offered: true, course: 'Civil Engineering ICP (fully English); iUP Faculty of Engineering',
        language: 'English for ICP; English then Japanese for iUP',
        hlRequired: ['Mathematics', 'Physics'],
        note: "Civil Engineering ICP is taught fully in English. You need HL Mathematics and HL Physics; Chemistry can be SL. The SAT is not accepted.",
        admissionsTest: 'EJU is the default for ICP; A-levels, IB, ACT or AP may substitute',
        source: 'https://www.s-ge.t.kyoto-u.ac.jp/int/en/admission/application/guidelines/2027guidelines-and-application-forms/july-2026-updated-guidelines-for-applicants-in-2027.pdf',
      },
      { area: 'Computer Science', offered: false, note: 'No standalone English-taught CS degree found.' },
      {
        area: 'Economics & Business', offered: true, course: 'iUP — Faculty of Economics',
        language: 'English and Japanese for 2.5 years, then mainly Japanese',
        note: "SL Mathematics is accepted.",
        admissionsTest: 'Document screening plus an English-language interview',
      },
      {
        area: 'Law', offered: true, course: 'iUP — Faculty of Law',
        language: 'English and Japanese for 2.5 years, then mainly Japanese',
      },
      { area: 'Architecture & Art', offered: false, note: 'Architecture sits in the Faculty of Engineering but the eligible departments were not named.' },
      { area: 'Psychology', offered: false },
    ],
  },

  {
    id: 'waseda',
    name: 'Waseda University',
    city: 'Tokyo',
    country: 'Japan',
    tier: 'high',
    admissionModel: 'dossier',
    headline: "Waseda reviews your documents, and holds an interview only if it needs more information.",
    ibNote: "You need the full IB Diploma (the IB Certificate is not accepted), with six subjects and at least three at Higher Level (HL). Predicted grades are accepted. In 2026, successful TAISI applicants averaged 36.8 of 42.",
    ieltsNote: 'TOEFL or IELTS required but with NO minimum score at any school except JCulP, which sets TOEFL iBT 95 or IELTS 7.0. Waived for SAT/ACT submitters and for an IB taught entirely in English. Home-edition tests are not accepted.',
    satPolicy: 'accepted',
    satNote: 'SAT, ACT, A-levels, Gaokao, Abitur and others accepted. Super-scoring is NOT accepted — only one sitting\'s composite.',
    tuitionCurrency: 'JPY',
    tuitionIntlMin: 1091000,
    tuitionIntlMax: 1891000,
    tuitionYear: 'Waseda\'s own FAQ gives roughly 1.2–1.8 million JPY per year. Admission fee JPY 200,000; screening fee JPY 10,000 from outside Japan.',
    applicationSystem: 'The Admissions Office (TAO) portal',
    deadlineNote: 'September 2026 entry closed 10 February 2026. The 2027 guides were not yet published when checked.',
    cycle: 'September 2026 (2027 guides pending)',
    checkedOn: '2026-09-02',
    sources: [
      'https://www.waseda.jp/inst/admission/en/undergraduate/english/',
      'https://www.waseda.jp/fsci/assets/uploads/2025/10/Application-Guide-for-September-2026-Entry_FSE.pdf',
    ],
    areas: [
      { area: 'Medicine', offered: false },
      {
        area: 'Engineering', offered: true, course: 'Mechanical Engineering; Civil and Environmental Engineering',
        language: 'English',
        hlRequired: ['Mathematics', 'Physics', 'Chemistry'],
        note: "Your test scores must include Mathematics, Physics and Chemistry.",
        admissionsTest: 'Document screening; interview only if required',
        source: 'https://www.waseda.jp/fsci/assets/uploads/2025/10/Application-Guide-for-September-2026-Entry_FSE.pdf',
      },
      {
        area: 'Computer Science', offered: true, course: 'Computer Science and Communications Engineering',
        language: 'English',
        hlRequired: ['Mathematics', 'Physics', 'Chemistry'],
        note: "Your test scores must include Mathematics, Physics and Chemistry.",
        source: 'https://www.waseda.jp/fsci/assets/uploads/2025/10/Application-Guide-for-September-2026-Entry_FSE.pdf',
      },
      {
        area: 'Economics & Business', offered: true, course: 'BA Economics; BA Political Science; BA Global Political Economy',
        language: 'English',
        hlRequired: ['Mathematics'],
        note: "Your exam subjects should include mathematics.",
        source: 'https://www.waseda.jp/fpse/pse/assets/uploads/2025/09/Application-Guide-for-September-2026-Entry-AO-Admissions-SPSE.pdf',
      },
      { area: 'Law', offered: false, note: 'The School of Law is not part of the English-based degree programme.' },
      { area: 'Architecture & Art', offered: false, note: 'Architecture sits in Creative Science and Engineering but only Mechanical and Civil are offered in English.' },
      {
        area: 'Psychology', offered: false,
        note: 'No English psychology degree. The nearest are SILS (liberal arts) and TAISI (social innovation), both with NO subject requirements at all.',
      },
    ],
  },

  {
    id: 'keio',
    name: 'Keio University',
    city: 'Tokyo',
    country: 'Japan',
    tier: 'high',
    admissionModel: 'dossier',
    headline: "Admission is by document review only.",
    ibNote: "PEARL and GIGA accept final or predicted IB grades.",
    ieltsNote: 'PEARL requires TOEFL or IELTS from every applicant INCLUDING native speakers, but sets no cut-off. GIGA: no minimum band, and waived if the school taught in English.',
    satPolicy: 'accepted',
    satNote: 'PEARL accepts ONLY IB, SAT or ACT. Abitur, Baccalauréat and A-levels establish eligibility but are NOT accepted as the standardised test — a real trap for A-level students.',
    tuitionCurrency: 'JPY',
    tuitionIntlMin: 1268350,
    tuitionIntlMax: 1531350,
    tuitionYear: '2025 reference figures — PEARL about 1.27m, GIGA about 1.53m per year, plus a JPY 200,000 admission fee. Fall 2026 fees were not finalised.',
    applicationSystem: 'TAO portal for PEARL; admission.sfc.keio.ac.jp/giga for GIGA',
    deadlineNote: 'PEARL runs three periods from late October to April. GIGA Winter AO closed 23 January 2026 for September 2026 or April 2027 entry.',
    cycle: 'September 2026 / April 2027',
    checkedOn: '2026-09-02',
    sources: [
      'https://www.keio.ac.jp/en/admissions/undergraduate/pearl/application_guidebook.pdf',
      'https://www.keio.ac.jp/en/admissions/undergraduate/index.html',
    ],
    gaps: ['Full-ride scholarships are available exclusively for GIGA international students before enrolment.'],
    areas: [
      { area: 'Medicine', offered: false, language: 'Japanese' },
      { area: 'Engineering', offered: false, language: 'Japanese' },
      {
        area: 'Computer Science', offered: true, course: 'GIGA — BA in Environment and Information Studies',
        language: 'English-based',
        note: "An interdisciplinary information-studies degree. About 20% of courses are taught in English.",
        admissionsTest: 'Document screening only — no interview, no exam',
      },
      {
        area: 'Economics & Business', offered: true, course: 'PEARL — Faculty of Economics',
        language: 'English',
        admissionsTest: 'Document screening only; "No interview is required"',
        source: 'https://www.keio.ac.jp/en/admissions/undergraduate/pearl/application_guidebook.pdf',
      },
      { area: 'Law', offered: false, language: 'Japanese' },
      { area: 'Architecture & Art', offered: false },
      { area: 'Psychology', offered: false },
    ],
  },

  {
    id: 'science-tokyo',
    name: 'Institute of Science Tokyo',
    city: 'Tokyo',
    country: 'Japan',
    tier: 'high',
    admissionModel: 'dossier',
    headline: "There is a written exam in maths, physics and chemistry, plus an interview.",
    ibNote: "You can send your IB results as optional supporting material at the second screening.",
    ieltsNote: 'TOEFL iBT, TOEIC or IELTS Academic taken from 21 August 2024, with NO minimum score. Exempt for nationals of Australia, Canada, Ireland, New Zealand, the UK and the USA.',
    tuitionCurrency: 'JPY',
    tuitionIntlMin: 635400,
    tuitionIntlMax: 635400,
    tuitionYear: 'April 2027 entry, plus a JPY 282,000 enrolment fee. MEXT scholars pay neither and receive JPY 120,000 a month for four years.',
    applicationSystem: 'The Admissions Office (TAO)',
    deadlineNote: 'April 2027 entry: applications closed 21 August 2026 — already past. Secondary screening 28 September – 23 October 2026.',
    cycle: 'April 2027',
    checkedOn: '2026-09-02',
    sources: ['https://admissions.isct.ac.jp/en/013/undergraduate/programs/gsep'],
    gaps: [
      'Formed by the merger of Tokyo Institute of Technology and Tokyo Medical and Dental University; the medical faculty pages could not be fetched.',
      'Applicants cannot hold Japanese nationality, including dual nationality.',
    ],
    areas: [
      { area: 'Medicine', offered: false, note: 'No English-taught undergraduate medicine, despite the merger with a medical and dental university.' },
      {
        area: 'Engineering', offered: true, course: 'GSEP — BEng in Transdisciplinary Science and Engineering',
        language: 'English',
        note: "A written exam in high-school mathematics, physics and chemistry, then an interview with professors. If you send IB results, HL Mathematics: Analysis and Approaches, HL Physics and HL Chemistry are the subjects they look at.",
        admissionsTest: 'Document screening, then a written maths/physics/chemistry exam and a professor interview',
        source: 'https://admissions.isct.ac.jp/en/013/undergraduate/programs/gsep',
      },
      { area: 'Computer Science', offered: false, note: 'No dedicated English CS degree; GSEP is transdisciplinary.' },
      { area: 'Economics & Business', offered: false },
      { area: 'Law', offered: false },
      { area: 'Architecture & Art', offered: false, language: 'Japanese' },
      { area: 'Psychology', offered: false },
    ],
  },
]

/*
 * STILL TO RESEARCH for Japan: Osaka, Tohoku, Nagoya, Sophia and Ritsumeikan
 * APU. Sophia and APU are the accessible tier and both run substantial
 * English-taught undergraduate programmes, so they matter more here than the
 * remaining national universities.
 */
