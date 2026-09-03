import type { University } from './schema'

/**
 * Netherlands — read from official pages on 2 September 2026.
 *
 * HOW DUTCH ADMISSION ACTUALLY WORKS, and why it is not the UK
 * There is no conditional offer and, at these universities, no IB points
 * threshold at all. Three things decide a place:
 *   1. Is the diploma recognised as equivalent to Dutch VWO?
 *   2. Does it carry the named prior subjects — almost always Mathematics
 *      Analysis and Approaches HL, often Physics HL on top?
 *   3. For a capped (numerus fixus) programme, how did you rank in the
 *      selection round, which closes on 15 January?
 *
 * The 15 January deadline is the single most important fact in this file. It
 * is roughly five months earlier than the deadline for uncapped programmes,
 * and missing it costs the whole year.
 *
 * TWO WARNINGS FOR TURKISH STUDENTS
 * - TU Delft states plainly that the Turkish secondary diploma is NOT
 *   equivalent to VWO: a completed first university year with a 75% average
 *   is required first. An IB Diploma avoids this entirely.
 * - Most Dutch bachelors are taught in DUTCH. TU Delft runs only four
 *   programmes fully in English out of seventeen.
 */
export const NL_UNIVERSITIES: University[] = [
  {
    id: 'uva',
    name: 'University of Amsterdam',
    city: 'Amsterdam',
    country: 'Netherlands',
    tier: 'high',
    admissionModel: 'selection',
    headline: 'No IB points threshold. Capped programmes select on 15 January; miss it and you wait a year.',
    ibNote: 'No university-wide IB points total is published. Requirements are set per programme as prior subjects, e.g. Psychology needs mathematics taken to the final year and final examinations at Dutch VWO "Wiskunde A" level. The one programme that does publish a total is PPLE: 34 points across six subjects, excluding TOK and Extended Essay bonus points, with Mathematics AA or AI at SL or HL grade 4 minimum.',
    ieltsOverall: 6.5,
    ieltsComponent: 6.0,
    ieltsNote: 'TOEFL iBT 92, or 4.5 on the scale used from January 2026. Exempt after fully English-taught secondary education in Australia, Canada, Ireland, New Zealand, the UK or the US.',
    tuitionCurrency: 'EUR',
    tuitionIntlMin: 13900,
    tuitionIntlMax: 34700,
    tuitionYear: '2026/27',
    applicationSystem: 'Studielink, then a programme-level document upload or selection portal',
    deadlineNote: 'Capped programmes 15 January. Everyone else 1 May, with English certificates advised by 1 April.',
    cycle: '2026/27 (2027 selection dates published)',
    checkedOn: '2026-09-02',
    sources: [
      'https://www.uva.nl/en/education/admissions/bachelors/applying-for-a-degree-programme.html',
      'https://www.uva.nl/en/education/fees-and-funding/tuition-fees/tuition-fees.html',
      'https://www.uva.nl/en/education/admissions/bachelors/applying-for-a-selective-bachelors-programme.html',
    ],
    gaps: ['Architecture and Art were not checked. Medicine (Geneeskunde) is Dutch-taught and capped.'],
    areas: [
      {
        area: 'Medicine', offered: false,
        note: 'Geneeskunde is taught in Dutch and is a capped programme. There is no English-taught medicine bachelor at UvA.',
        source: 'https://www.uva.nl/en/education/admissions/bachelors/applying-for-a-selective-bachelors-programme.html',
      },
      { area: 'Engineering', offered: false, note: 'No English-taught engineering bachelor at UvA.' },
      {
        area: 'Computer Science', offered: false,
        language: 'Dutch',
        note: 'Both Computer Science (Informatica) and Artificial Intelligence are taught in Dutch. Not available to an English-only applicant.',
        source: 'https://www.uva.nl/en/programmes/bachelors/computer-science/computer-science.html',
      },
      {
        area: 'Economics & Business', offered: true, course: 'Economics and Business Economics; Business Administration',
        note: 'Both capped. Economics and Business Economics has 850 first-year places on the English track; Business Administration has 650 and adds an online selection test in February. Mathematics proficiency is assessed but the required level is not published.',
        admissionsTest: 'Programme selection procedure', testThreshold: 'Ranking published 15 April',
        source: 'https://www.uva.nl/en/programmes/bachelors/economics--business-economics/application-and-admission/application-and-admission.html',
      },
      {
        area: 'Law', offered: true, course: 'PPLE — Politics, Psychology, Law and Economics',
        ibPoints: 34,
        hlRequired: ['Mathematics'],
        note: 'The only UvA programme publishing an IB total: 34 across six subjects, EXCLUDING the TOK and Extended Essay bonus. Mathematics AA or AI at SL or HL, grade 4 minimum. Selective but not capped. A standalone Dutch LLB also exists.',
        source: 'https://pple.uva.nl/how-to-apply/entry-requirements/requirements-per-diploma-type/your-entry-requirements.html',
      },
      { area: 'Architecture & Art', offered: false, note: 'Not checked — no page fetched.' },
      {
        area: 'Psychology', offered: true, course: 'Psychology',
        hlRequired: ['Mathematics'],
        note: 'Capped at 600 places. Mathematics must run to the final year AND the final examinations, at least at Dutch VWO "Wiskunde A" level. Lectures, materials and exams are in English for everyone; the track choice only affects tutorials. Studielink opens 1 October, closes 15 January; ranking 15 April.',
        admissionsTest: 'Compulsory selection procedure',
        source: 'https://www.uva.nl/en/programmes/bachelors/psychology/application-and-admission/international-prior-education/application-and-admission.html',
      },
    ],
  },

  {
    id: 'tudelft',
    name: 'Delft University of Technology',
    city: 'Delft',
    country: 'Netherlands',
    tier: 'high',
    admissionModel: 'selection',
    headline: 'Only Mathematics Analysis and Approaches HL is accepted — Applications and Interpretation is not, for any programme.',
    ibNote: 'Full IB Diploma with named HL subjects; no points total is published. TU Delft accepts ONLY Mathematics: Analysis and Approaches HL. Mathematics is mandatory for every bachelor; Physics for all except Computer Science and Engineering and Applied Mathematics; Chemistry for Applied Earth Sciences, Clinical Technology, Life Science and Technology, Molecular Science and Technology and Nanobiology; Biology for Nanobiology and Clinical Technology.',
    ieltsOverall: 6.5,
    ieltsNote: 'TOEFL iBT 90 for English-taught programmes. Certificates older than two years are not accepted.',
    tuitionCurrency: 'EUR',
    tuitionIntlMin: 19906,
    tuitionIntlMax: 19906,
    tuitionYear: '2026/27',
    applicationSystem: 'Studielink',
    deadlineNote: 'Capped programmes 15 January 23:59. Other programmes 1 April for a non-Dutch diploma.',
    cycle: '2026/27',
    checkedOn: '2026-09-02',
    sources: [
      'https://www.tudelft.nl/en/education/admission-and-application/bsc-international-diploma/admission-requirements/diploma-with-additional-requirements',
      'https://www.tudelft.nl/en/education/study-programme-orientation/practical-matters/tuition-fee-finances',
      'https://www.tudelft.nl/en/education/programmes/bachelors',
    ],
    gaps: [
      'The Turkish secondary diploma is NOT accepted as equivalent to Dutch VWO. Holders must first complete 60 ECTS of a related bachelor at an accredited university with a 75% average. An IB Diploma avoids this.',
      'Only four of seventeen bachelors are taught fully in English.',
    ],
    areas: [
      { area: 'Medicine', offered: false, language: 'Dutch', note: 'No medicine degree. Clinical Technology, the nearest programme, is Dutch-taught.' },
      {
        area: 'Engineering', offered: true, course: 'Aerospace Engineering',
        hlRequired: ['Mathematics: Analysis and Approaches', 'Physics'],
        note: 'Capped at about 440 first-year places with a selection procedure. Every other engineering bachelor — Mechanical, Civil, Electrical, Industrial Design, Marine, Systems Engineering — is taught in DUTCH.',
        admissionsTest: 'Selection procedure',
        source: 'https://www.tudelft.nl/en/onderwijs/opleidingen/bachelors/ae/bsc-aerospace-engineering/from-application-to-enrolment/admission-requirements',
      },
      {
        area: 'Computer Science', offered: true, course: 'Computer Science and Engineering',
        hlRequired: ['Mathematics: Analysis and Approaches'],
        note: 'Physics is NOT required for this one — the only TU Delft engineering-side programme where that is true. Capped, with a selection procedure.',
        admissionsTest: 'Selection procedure',
        source: 'https://www.tudelft.nl/en/onderwijs/opleidingen/bachelors/computer-science-and-engineering/bachelor-of-computer-science-and-engineering/from-application-to-enrollment/admission-requirements',
      },
      { area: 'Economics & Business', offered: false },
      { area: 'Law', offered: false },
      {
        area: 'Architecture & Art', offered: false, language: 'Dutch',
        note: 'Architecture, Urbanism and Building Sciences exists but is taught in Dutch, so it is closed to an English-only applicant.',
        source: 'https://www.tudelft.nl/en/education/programmes/bachelors',
      },
      { area: 'Psychology', offered: false },
    ],
  },

  {
    id: 'tue',
    name: 'Eindhoven University of Technology',
    city: 'Eindhoven',
    country: 'Netherlands',
    tier: 'mid',
    admissionModel: 'selection',
    headline: 'Mathematics Analysis and Approaches HL is required for every single bachelor, without exception.',
    ibNote: 'Full IB Diploma with named HL subjects; no points total. Mathematics: Analysis and Approaches HL is required for EVERY programme. Physics HL is added for Applied Physics, Architecture, Automotive, Electrical, Industrial Design, Mechanical, Biomedical and Medical Sciences and Technology. Applications and Interpretation is not accepted.',
    ieltsOverall: 6.5,
    ieltsComponent: 6.0,
    ieltsNote: 'TOEFL iBT 90 before 21 January 2026; 4.5 overall with 4.5 per section on the new scale after. TU/e states no exemptions exist beyond its published list.',
    tuitionCurrency: 'EUR',
    tuitionIntlMin: 18600,
    tuitionIntlMax: 22400,
    tuitionYear: '18,600 for 2026/27 rising to 22,400 for 2027/28',
    applicationSystem: 'Studielink, then a TU/e application with document upload and a fee',
    deadlineNote: 'Capped programmes 15 January 23:59 CET (2027 entry opens 1 October 2026). All others 1 May.',
    cycle: '2027/28 selection list published',
    checkedOn: '2026-09-02',
    sources: [
      'https://www.tue.nl/en/education/become-a-tue-student/admission-and-enrollment/eligibility',
      'https://www.tue.nl/en/education/become-a-tue-student/tuition-fees-and-other-study-costs/tuition-fee/',
      'https://www.tue.nl/en/education/bachelor-college/selection',
    ],
    gaps: [
      'The IB subject-requirement PDF carries a 2021 filename and may predate the 2027 cycle.',
      'Turkish diploma policy was not found — TU/e uses per-country pages and the Turkey page could not be reached.',
      'Language of instruction was individually confirmed only for Psychology and Technology and the Chemical Engineering English track.',
    ],
    areas: [
      {
        area: 'Medicine', offered: true, course: 'Medical Sciences and Technology',
        hlRequired: ['Mathematics: Analysis and Approaches', 'Physics'],
        note: 'Not a medical degree — an engineering-side programme. It does not lead to a licence to practise.',
      },
      {
        area: 'Engineering', offered: true, course: 'Mechanical Engineering and seven others',
        hlRequired: ['Mathematics: Analysis and Approaches', 'Physics'],
        note: 'Mechanical Engineering is capped for 2027/28. Industrial Engineering and Sustainable Innovation need Mathematics only, no Physics.',
        admissionsTest: 'GPA from standardised subjects plus a programme test in March–April',
        source: 'https://www.tue.nl/en/education/bachelor-college/selection',
      },
      {
        area: 'Computer Science', offered: true, course: 'Computer Science and Engineering; Data Science',
        hlRequired: ['Mathematics: Analysis and Approaches'],
        note: 'No Physics required. Computer Science and Engineering is capped for 2027/28; Data Science is not.',
        admissionsTest: 'Selection procedure', testThreshold: 'Ranking by email 15 April',
        source: 'https://www.tue.nl/en/education/bachelor-college/selection',
      },
      {
        area: 'Economics & Business', offered: true, course: 'Industrial Engineering',
        hlRequired: ['Mathematics: Analysis and Approaches'],
        note: 'The nearest thing TU/e offers — there is no economics or business bachelor.',
      },
      { area: 'Law', offered: false },
      {
        area: 'Architecture & Art', offered: true, course: 'Architecture, Urbanism and Building Sciences',
        hlRequired: ['Mathematics: Analysis and Approaches', 'Physics'],
        note: 'Capped, with a cognitive skills test AND an on-campus Selection Day. Note the Mathematics requirement — this is an architecture course that will not accept a student without HL Maths.',
        admissionsTest: 'Cognitive skills test plus Selection Day',
        source: 'https://www.tue.nl/en/education/bachelor-college/selection',
      },
      {
        area: 'Psychology', offered: true, course: 'Psychology and Technology',
        language: 'English',
        hlRequired: ['Mathematics: Analysis and Approaches'],
        note: 'Confirmed English-taught and not capped, so the 1 May deadline applies. Mathematics at Dutch VWO "Mathematics B" level is required — unusual for psychology.',
        source: 'https://www.tue.nl/en/education/bachelor-college/bachelor-psychology-technology',
      },
    ],
  },
  /* ---------------------------------------------------------------- */
  {
    id: 'groningen',
    name: 'University of Groningen',
    city: 'Groningen',
    country: 'Netherlands',
    tier: 'mid',
    admissionModel: 'selection',
    headline: '34 English-taught bachelors, and several capped ones are decided by an UNWEIGHTED LOTTERY — grades get you into the draw, not past it.',
    ibNote: 'The full IB Diploma is accepted as equivalent to Dutch VWO. NO points total. Requirements are named subjects: Applied Mathematics wants Mathematics AA HL; Physics wants AA HL plus Physics HL; Medicine wants Biology HL, Chemistry HL and at least SL Physics and Mathematics; business programmes accept AA at SL or HL, or AI at HL.',
    ieltsOverall: 6.5,
    ieltsNote: 'Varies by faculty: Science and Engineering wants 6.5 with 6.5 in every section; the LLB in International and European Law wants 7.0 with 6.0 per section AND a GPA equivalent to 7.0 on the Dutch scale. An IB taught in English exempts you.',
    tuitionCurrency: 'EUR',
    tuitionIntlMin: 14000,
    tuitionIntlMax: 32000,
    tuitionYear: '2026/27 — EUR 14,000 for most faculties, EUR 19,800 for Science and Engineering, EUR 17,200 for University College, EUR 32,000 for Medicine and Dentistry. The EU rate is EUR 2,694.',
    applicationSystem: 'Studielink plus the Progress Portal; University College charges a EUR 100 application fee',
    deadlineNote: 'Capped programmes 15 January (open from 1 October). Everyone else 1 May. Non-EU language certificates by 1 July. University College closes 1 November 2026 for non-Dutch diplomas.',
    cycle: '2026/27 fees; 2027 entry guide',
    checkedOn: '2026-09-02',
    sources: [
      'https://www.rug.nl/education/application-enrolment-tuition-fees/tuition-fee/bachelor',
      'https://www.rug.nl/education/application-enrolment-tuition-fees/admission/procedures/non-dutch-qualification/fixus-non-dutch-qualification',
      'https://www.rug.nl/ucg/application/',
    ],
    areas: [
      {
        area: 'Medicine', offered: false, language: 'Dutch',
        note: '400 places, allocated by UNWEIGHTED LOTTERY — no amount of academic strength improves your odds. Dutch-taught.',
        source: 'https://www.rug.nl/education/application-enrolment-tuition-fees/admission/procedures/non-dutch-qualification/fixus-non-dutch-qualification',
      },
      { area: 'Engineering', offered: true, language: 'English', hlRequired: ['Mathematics: Analysis and Approaches'], note: 'Science and Engineering programmes; Physics adds HL Physics.' },
      { area: 'Computer Science', offered: true, course: 'Computing Science', language: 'English', hlRequired: ['Mathematics: Analysis and Approaches'] },
      {
        area: 'Economics & Business', offered: true, course: 'International Business; Economics and Business Economics; Econometrics and Operations Research',
        language: 'English',
        hlRequired: ['Mathematics'],
        note: 'International Business has 550 places and selects on TEST RESULTS rather than a lottery — one of the few where preparation actually helps. Mathematics AA at SL or HL, or AI at HL.',
        admissionsTest: 'Selection test',
      },
      {
        area: 'Law', offered: true, course: 'LLB International and European Law',
        language: 'English',
        note: 'The toughest English bar at Groningen: IELTS 7.0, and non-EU applicants also need a GPA equivalent to 7.0 out of 10 on the Dutch scale.',
        source: 'https://www.rug.nl/rechten/education/international-programmes/llb/application/admission-requirements',
      },
      {
        area: 'Architecture & Art', offered: false,
        note: 'Not offered. University College Groningen (Liberal Arts and Sciences) is the nearest broad option — about 135 students a year, selected holistically, with a compulsory three-to-five minute motivation video that is central to the decision.',
      },
      {
        area: 'Psychology', offered: true, course: 'Psychology (English track)',
        language: 'English',
        note: '250 places on the English track, decided by a SELECTION EXAM. The Dutch track has 365 places and uses an unweighted lottery instead — a real strategic difference between the two.',
        admissionsTest: 'Selection exam',
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'erasmus',
    name: 'Erasmus University Rotterdam',
    city: 'Rotterdam',
    country: 'Netherlands',
    tier: 'mid',
    admissionModel: 'selection',
    headline: 'Accepts the Turkish Lise Diplomasi — but only from a Genel Lise, and with a compulsory extra mathematics entrance exam.',
    ibNote: 'Erasmus states it plainly: "The full IB diploma is sufficient for general admission." No points total for general admission. Subject grades are set per programme — Economics and Business Economics wants Mathematics AA HL grade 4, or AA SL grade 5, or AI HL grade 5.',
    ieltsOverall: 6.0,
    ieltsNote: 'By programme: Economics and Econometrics want IELTS 6.0 or TOEFL 80; Psychology and Communication want 7.0 or TOEFL 95. Certificates must be under two years old.',
    tuitionCurrency: 'EUR',
    tuitionIntlMin: 13500,
    tuitionIntlMax: 32200,
    tuitionYear: '2026/27 — EUR 13,500 standard, EUR 14,000 at Rotterdam School of Management, EUR 16,300 at University College, EUR 32,200 for Medicine.',
    applicationSystem: 'Studielink, then the EUR Admissions Portal. EUR 100 non-refundable application fee for every international diploma holder.',
    deadlineNote: 'Capped programmes 15 January, results after 15 April. Non-EEA 1 May, EEA 1 August. You may register for at most TWO capped programmes a year, and attempt any one programme at most three times.',
    cycle: '2026/27',
    checkedOn: '2026-09-02',
    sources: [
      'https://eur.nl/en/education/bachelor-programmes/admission-and-application-bachelor/diploma-overview',
      'https://www.eur.nl/en/education/practical-matters/registration/tuition-fee/tuition-fee-2026-2027',
      'https://www.eur.nl/en/education/bachelor-programmes/admission-and-application-bachelor/programmes-limited-places-numerus-fixus',
    ],
    gaps: [
      'TURKISH DIPLOMA: the Lise Diplomasi from a Genel Lise is accepted, with a MANDATORY additional mathematics entrance exam. Imam-Hatip, Meslek, Teknik and Güzel Sanatlar diplomas are considered only alongside a completed first university year with a 3.0 GPA. A Lise Diplomasi held together with the IB Diploma is assessed as an IB application instead.',
      'Erasmus warns that meeting the requirements "does not automatically mean you will be selected" — every international bachelor is described as selective.',
    ],
    areas: [
      { area: 'Medicine', offered: false, language: 'Dutch', note: '400 places, Dutch-taught, EUR 32,200 for non-EEA students.' },
      { area: 'Engineering', offered: false },
      {
        area: 'Computer Science', offered: true, course: 'Nanobiology; Econometrics and Operations Research',
        language: 'English',
        note: 'No conventional computer science bachelor. Nanobiology is capped at 120 places.',
      },
      {
        area: 'Economics & Business', offered: true, course: 'International Bachelor Economics and Business Economics (IBEB); International Business Administration (IBA)',
        language: 'English',
        hlRequired: ['Mathematics'],
        note: 'IBEB has 700 places, IBA 750 — the largest English intakes in this file. IBEB wants Mathematics AA HL grade 4, AA SL grade 5, or AI HL grade 5.',
        source: 'https://www.eur.nl/en/bachelor/international-bachelor-economics-and-business-economics/admission',
      },
      { area: 'Law', offered: false, note: 'Not verified as an English bachelor.' },
      {
        area: 'Architecture & Art', offered: true, course: 'International Bachelor Arts and Culture Studies',
        language: 'English', note: 'A studies degree, not a studio one. IELTS 6.5.',
      },
      {
        area: 'Psychology', offered: true, course: 'International Bachelor in Psychology',
        language: 'English',
        note: '600 places shared between the Dutch and English tracks. IELTS 7.0 or TOEFL 95.',
        source: 'https://www.eur.nl/en/bachelor/international-bachelor-psychology/admission',
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'maastricht',
    name: 'Maastricht University',
    city: 'Maastricht',
    country: 'Netherlands',
    tier: 'mid',
    admissionModel: 'selection',
    headline: 'The widest English offer in the Netherlands and the cheapest fees — but the strictest line on the Turkish diploma.',
    ibNote: 'The IB Diploma with at least three Higher Level subjects. NO points total. Data Science and Artificial Intelligence names Mathematics: Analysis and Approaches HL as the VWO equivalent.',
    ieltsOverall: 6.0,
    ieltsNote: 'European Law School: IELTS 6.0 or TOEFL 80, and no evidence at all is needed from an IB Diploma holder. The university-wide page could not be read.',
    tuitionCurrency: 'EUR',
    tuitionIntlMin: 10600,
    tuitionIntlMax: 32000,
    tuitionYear: '2026/27 — EUR 10,600 for the social sciences, law, economics and psychology group (the lowest non-EU fee anywhere in this file), EUR 14,600 for sciences and engineering, EUR 16,309 for the university colleges, EUR 32,000 for Medicine.',
    applicationSystem: 'Studielink for capped programmes; the rest could not be verified',
    deadlineNote: 'Non-EU 1 April 23:59 CET — a MONTH EARLIER than most Dutch universities. EU 1 May. Capped programmes 15 January. University College Maastricht closes 5 January for non-EU.',
    cycle: '2026/27 fees; 2025/26 diploma rules',
    checkedOn: '2026-09-02',
    sources: [
      'https://www.maastrichtuniversity.nl/file/foreign-diploma-requirements-bachelor-programmes-2025-2026pdf',
      'https://www.maastrichtuniversity.nl/file/overzicht-instellingstarieven-overgangsregeling-bachelors-en-masters-2026-27pdf',
      'https://www.maastrichtuniversity.nl/file/reglement-selectie-fixusopleidingen-2025-2026enpdf',
    ],
    gaps: [
      'TURKISH DIPLOMA: the strictest of the five. Maastricht requires the Lise Diplomasi from a Genel Lise PLUS successful completion of all first-year credits of a university bachelor. A student holding the full IB Diploma is assessed on the IB row instead and skips that entirely — which is the single strongest argument for the IB here.',
      'The exact count of English-taught bachelors could not be established; the curriculum subdomain blocks automated reading.',
    ],
    areas: [
      {
        area: 'Medicine', offered: false, language: 'Dutch',
        note: 'Two selection rounds — a portfolio, a homework assignment, then a selection day testing cognitive AND interpersonal competencies. Dutch-taught, EUR 32,000.',
      },
      { area: 'Engineering', offered: true, course: 'Business Engineering; Circular Engineering', language: 'English', tuition: 'EUR 14,600 per year' },
      {
        area: 'Computer Science', offered: true, course: 'Data Science and Artificial Intelligence; Computer Science',
        language: 'English',
        hlRequired: ['Mathematics: Analysis and Approaches'],
        tuition: 'EUR 14,600 per year',
        source: 'https://www.maastrichtuniversity.nl/file/admissionrequirementsbadatascienceandartificialintelligence2025-2026pdf',
      },
      {
        area: 'Economics & Business', offered: true, course: 'International Business; Economics and Business Economics; Econometrics and Operations Research; Business Analytics',
        language: 'English',
        note: 'International Business is capped and scored transparently: essay 33%, CV 33%, school grades 33%. Tuition EUR 10,600 — remarkably low.',
        admissionsTest: 'Essay, CV and grades, equally weighted',
      },
      {
        area: 'Law', offered: true, course: 'European Law School',
        language: 'English',
        note: 'Capped, and places are awarded by an UNWEIGHTED LOTTERY supervised by a notary. Meeting the requirements is all you can control. IB holders need no English certificate.',
        tuition: 'EUR 10,600 per year',
      },
      { area: 'Architecture & Art', offered: true, course: 'Arts and Culture', language: 'English', tuition: 'EUR 10,600 per year' },
      {
        area: 'Psychology', offered: true, course: 'Psychology; Brain Science',
        language: 'English or Dutch',
        note: 'Capped, selected by an online assessment covering school grades, study attitude, motivation and subject knowledge.',
        admissionsTest: 'Online assessment',
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'twente',
    name: 'University of Twente',
    city: 'Enschede',
    country: 'Netherlands',
    tier: 'mid',
    admissionModel: 'selection',
    headline: 'Publishes an exact HL subject table for every engineering programme, and says outright there is no minimum IB grade.',
    ibNote: 'Twente is unusually direct: "A successfully completed International Baccalaureate diploma is required... In general, there is no minimum IB grade requirement." What matters is the subject table — Mechanical Engineering needs Mathematics AA HL and Physics HL; Civil, Electrical and Industrial Design need AA HL with Physics at SL or HL; Technical Medicine needs AA HL, Physics HL, plus Chemistry and Biology at least at SL; social science programmes accept either Mathematics stream at either level.',
    ieltsOverall: 6.0,
    ieltsComponent: 5.5,
    ieltsNote: 'TOEFL iBT 80 with 18 per section before January 2026; 4.0 overall on the new scale after. An IB exemption is NOT mentioned on the language page — unlike at Maastricht and Erasmus.',
    tuitionCurrency: 'EUR',
    tuitionIntlMin: 12300,
    tuitionIntlMax: 16400,
    tuitionYear: '2026/27 — EUR 12,300 for social sciences, EUR 16,400 for technical programmes. Rising to EUR 12,652 for 2027/28. The EU rate is EUR 2,694.',
    applicationSystem: 'Studielink then the Osiris portal. A EUR 100 non-refundable fee is required BEFORE the application is even reviewed.',
    deadlineNote: 'Non-EEA needing a visa: 1 May. EU 1 July. Capped programmes 15 January. Proof of graduation by 1 July.',
    cycle: '2026/27, some 2027/28 fees published',
    checkedOn: '2026-09-02',
    sources: [
      'https://www.utwente.nl/en/education/bachelor/admission/diplomas/international-baccalaureate/',
      'https://www.utwente.nl/en/education/bachelor/study-costs/tuition-fees/',
      'https://www.utwente.nl/en/education/bachelor/application-enrolment/deadlines/',
    ],
    gaps: [
      'No Turkey-specific page was found on the Twente site.',
      'University College Twente no longer exists.',
      'Several programmes have compulsory MATCHING rather than selection — Twente states it is "not a selection process" and the advice is non-binding, so it does not cost you a place.',
    ],
    areas: [
      {
        area: 'Medicine', offered: true, course: 'Technical Medicine',
        language: 'English or Dutch',
        hlRequired: ['Mathematics: Analysis and Approaches', 'Physics'],
        note: 'Not a medical licence degree. Also needs Chemistry and Biology at least at Standard Level. Capped, deadline 15 January.',
      },
      {
        area: 'Engineering', offered: true, course: 'Mechanical Engineering; Civil Engineering; Industrial Design Engineering; Advanced Technology',
        language: 'English',
        hlRequired: ['Mathematics: Analysis and Approaches', 'Physics'],
        note: 'All three Engineering Technology bachelors are taught in English. Mechanical and Advanced Technology need Physics at HL; Civil and Industrial Design accept it at SL.',
        source: 'https://www.utwente.nl/en/education/bachelor/admission/diplomas/international-baccalaureate/',
      },
      {
        area: 'Computer Science', offered: true, course: 'Technical Computer Science; Applied Mathematics',
        language: 'English',
        hlRequired: ['Mathematics: Analysis and Approaches'],
        note: 'Technical Computer Science has compulsory matching, which is advisory only and does not gate the place.',
      },
      {
        area: 'Economics & Business', offered: true, course: 'International Business Administration',
        language: 'English',
        note: 'Either Mathematics stream at either level. EUR 12,300 a year.',
      },
      { area: 'Law', offered: false },
      { area: 'Architecture & Art', offered: true, course: 'Industrial Design Engineering', language: 'English', note: 'An engineering degree with HL Mathematics required — not a portfolio-based design course.' },
      {
        area: 'Psychology', offered: true, course: 'Psychology (English track)',
        language: 'English',
        note: 'Capped and scored openly: a matching assignment 20%, a psychology test 40%, a methods and statistics test 40%. You only get a ranking number if you sit all three. Deadline 15 January.',
        admissionsTest: 'Three-part online selection',
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'tilburg',
    name: 'Tilburg University',
    city: 'Tilburg',
    country: 'Netherlands',
    tier: 'accessible',
    admissionModel: 'selection',
    headline: 'The one Dutch university that takes the Turkish Lise Diplomasi on its own — with a Diploma Puanı of at least 85%.',
    ibTypicalLow: 24,
    ibTypicalHigh: 24,
    ibNote: 'Tilburg IS one of the few that sets a points total: a minimum of 24, and only the FULL Diploma including Theory of Knowledge, the Extended Essay and CAS. At least three subjects at Higher Level. Individual certificates are not accepted, and "predicted grades are not used for the evaluation" — which rules out a conditional offer on predictions.',
    ieltsOverall: 6.0,
    ieltsNote: 'IELTS 6.0 with 5.5 in Writing and Speaking; TOEFL iBT 80 before 21 January 2026, or 4.5 after. Results must be no older than two years AND must be in hand AT THE TIME OF APPLICATION — they cannot be added later. An IB taught in English exempts you.',
    tuitionCurrency: 'EUR',
    tuitionYear: 'Institutional fees are 2025/26 on the pages fetched; the statutory EU rate for 2026/27 is EUR 2,694.',
    applicationSystem: 'Studielink plus the Tilburg application portal',
    deadlineNote: 'Capped programmes 15 January.',
    cycle: '2025/26 fees; 2026/27 statutory rate',
    checkedOn: '2026-09-02',
    sources: [
      'https://www.tilburguniversity.edu/education/bachelors-programs/application-and-admission/diploma-requirements',
      'https://www.tilburguniversity.edu/education/bachelors-programs/application-and-admission',
    ],
    gaps: [
      'TURKISH DIPLOMA — the most accommodating in this file: "Lise diplomasi with a Diploma Puani (Notu) of at least 85%" from a Genel Lise is accepted directly, with no extra university year and no extra exam. Imam-Hatip, Meslek and Teknik diplomas are not.',
      'Two official Tilburg pages disagree on the Cambridge English threshold: 173 with 160 subscores on one, 169 with 162 on the University College page.',
      'The programme filter page returned an error, so the full English-taught list could not be counted.',
    ],
    areas: [
      { area: 'Medicine', offered: false },
      { area: 'Engineering', offered: false },
      {
        area: 'Computer Science', offered: true, course: 'Cognitive Science and Artificial Intelligence; Data Science (joint degree)',
        language: 'English',
        note: 'Data Science sets different English requirements from the rest of the university.',
      },
      {
        area: 'Economics & Business', offered: true, course: 'International Business Administration; Entrepreneurship and Business Innovation',
        language: 'English',
      },
      { area: 'Law', offered: true, course: 'Global Law (LLB)', language: 'English' },
      { area: 'Architecture & Art', offered: true, course: 'Digital Culture & Society', language: 'English', note: 'A culture and society degree, not a design one.' },
      { area: 'Psychology', offered: true, course: 'Psychology (English track)', language: 'English' },
    ],
  },
]

/*
 * The Netherlands now holds eight universities. Utrecht and Leiden were
 * started but the run was cut off before their figures could be verified, so
 * they are deliberately absent rather than half-filled. Radboud and VU
 * Amsterdam would round out the accessible tier.
 */
