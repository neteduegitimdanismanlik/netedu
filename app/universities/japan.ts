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
    headline: 'PEAK closed after September 2026. The 2027 English route is the new College of Design — 100 places, applications 15 October – 5 November 2026.',
    ibTypicalLow: 38,
    ibTypicalHigh: 38,
    ibNote: 'College of Design 2027: "A total of 38 points out of 42 for the six subjects and at least 2 points for combined TOK and EE." The only published IB cut-off among these five universities.',
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
        note: 'Transdisciplinary "design" — design thinking applied across fields — NOT architecture or fine art. Fields of study were not specified on the 2027 page.',
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
    headline: 'Full tuition waivers plus a monthly allowance are available on iUP — but the final two years are taught in Japanese.',
    ibNote: 'The IB Diploma is accepted with NO minimum point total. Predicted grades are required at application. For science, engineering, pharmacy and agriculture, Mathematics: Analysis and Approaches HL is "highly recommended".',
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
        note: 'Civil Engineering ICP is the ONLY fully English undergraduate degree at Kyoto: Maths and Physics must be HL, Chemistry may be SL. It does NOT accept the SAT. iUP engineering additionally requires both physics and chemistry.',
        admissionsTest: 'EJU is the default for ICP; A-levels, IB, ACT or AP may substitute',
        source: 'https://www.s-ge.t.kyoto-u.ac.jp/int/en/admission/application/guidelines/2027guidelines-and-application-forms/july-2026-updated-guidelines-for-applicants-in-2027.pdf',
      },
      { area: 'Computer Science', offered: false, note: 'No standalone English-taught CS degree found.' },
      {
        area: 'Economics & Business', offered: true, course: 'iUP — Faculty of Economics',
        language: 'English and Japanese for 2.5 years, then mainly Japanese',
        hlRequired: ['Mathematics'],
        note: 'Standard Level mathematics is acceptable here.',
        admissionsTest: 'Document screening plus an English-language interview',
      },
      {
        area: 'Law', offered: true, course: 'iUP — Faculty of Law',
        language: 'English and Japanese for 2.5 years, then mainly Japanese',
        note: 'No specific subject requirements — any subjects are acceptable.',
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
    headline: 'No minimum score of any kind, no EJU, and an interview only if they need more information — the most open route in Japan.',
    ibNote: 'IB Diploma required (the Certificate is NOT accepted): at least six subjects with three or more at Higher Level. Predicted grades accepted. "There is no minimum score requirement for the standardized test." For reference, successful TAISI applicants in 2026 averaged 36.8 out of 42.',
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
        note: 'Waseda requires that the standardised test score INCLUDE Mathematics, Physics and Chemistry. Students can graduate taking only English-taught courses.',
        admissionsTest: 'Document screening; interview only if required',
        source: 'https://www.waseda.jp/fsci/assets/uploads/2025/10/Application-Guide-for-September-2026-Entry_FSE.pdf',
      },
      {
        area: 'Computer Science', offered: true, course: 'Computer Science and Communications Engineering',
        language: 'English',
        hlRequired: ['Mathematics', 'Physics', 'Chemistry'],
        note: 'The same three-subject rule as engineering — chemistry included, which is unusual for a computer science degree.',
        source: 'https://www.waseda.jp/fsci/assets/uploads/2025/10/Application-Guide-for-September-2026-Entry_FSE.pdf',
      },
      {
        area: 'Economics & Business', offered: true, course: 'BA Economics; BA Political Science; BA Global Political Economy',
        language: 'English',
        hlRequired: ['Mathematics'],
        note: 'Examination subjects MUST include mathematics. Applications without it are accepted but described as "less competitive".',
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
    headline: 'No interview, no exam, no travel to Japan, no cut-off scores, and no subject requirements. Documents only.',
    ibNote: 'PEARL: IB final or predicted grades accepted; "There are no cut-off IB, SAT, or ACT scores" and "There are no subject or subject level requirements for IB scores/grades" — so no HL requirement and no mathematics requirement even for economics. GIGA: no point requirement either.',
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
        note: 'An interdisciplinary information-studies degree, not a conventional computer science or engineering degree. Keio says a degree can be completed entirely in English, though only about 20% of the 600 courses are in English.',
        admissionsTest: 'Document screening only — no interview, no exam',
      },
      {
        area: 'Economics & Business', offered: true, course: 'PEARL — Faculty of Economics',
        language: 'English',
        note: 'NO subject requirements — mathematics is not formally required, which is remarkable for an economics degree and makes this an unusually open route for a strong humanities student.',
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
    headline: 'One English programme, and it sets a written maths, physics and chemistry exam plus an interview. The 2027 deadline has already passed.',
    ibNote: 'The IB is NOT a formal requirement and has no threshold — it is listed only among optional supporting materials at the second screening, alongside A-levels, SAT, ACT, AP and EJU.',
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
        note: 'The only English-medium bachelor here. Eight MEXT scholarship places plus up to ten privately funded international students. There is no grade threshold — instead a WRITTEN EXAM in high-school mathematics, physics and chemistry with short essay questions, plus an interview with professors. If IB is submitted, Maths AA HL, Physics HL and Chemistry HL are the named references.',
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
