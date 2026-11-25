import type { University } from './schema'

/**
 * Switzerland — read from official pages on 2 September 2026.
 *
 * TWO FACTS A STUDENT MUST HEAR BEFORE ANYTHING ELSE
 *
 * 1. MEDICINE IS CLOSED. swissuniversities, which runs the national medical
 *    registration, states it plainly: without a Swiss passport or long-term
 *    Swiss residence you cannot be admitted to medical studies in Switzerland.
 *    A student visa does not count. This applies at ETH, Zurich and Geneva
 *    alike. Do not put a Turkish student through the EMS test expecting a place.
 *
 * 2. THERE IS NO ENGLISH-TAUGHT BACHELOR at any of these institutions. ETH and
 *    Zurich teach in German and require C1. EPFL and Geneva teach in French —
 *    EPFL allows at most one English course per semester in year one, rising to
 *    half the courses from year two. Switzerland is a master's destination for
 *    an English-speaking student, not an undergraduate one.
 *
 * HOW ADMISSION WORKS: recognition, not offers. The IB is accepted only with a
 * MINIMUM TOTAL and a strict SIX-SUBJECT COMBINATION. Miss the combination and
 * you must sit an entrance examination — conducted in German at ETH, in French
 * at EPFL. The subject rules below are the real barrier and are quoted exactly.
 */
export const CH_UNIVERSITIES: University[] = [
  {
    id: 'ethz',
    name: 'ETH Zurich',
    city: 'Zurich',
    country: 'Switzerland',
    tier: 'high',
    admissionModel: 'recognition',
    teachingLanguage: 'German',
    headline: "You need IB 38/42 with a set subject combination, or you take an entrance exam in German. C1 German is required.",
    ibTypicalLow: 38,
    ibTypicalHigh: 38,
    ibNote: "You can be admitted without an exam with 38 of 42 points (not counting bonus points) and the right subjects. At Higher Level (HL): Mathematics (either course); Physics, Chemistry or Biology; and a Language A. At SL: three more subjects from ETH's list. If you do not meet all of this, you take the Reduced Entrance Examination.",
    ieltsNote: 'German C1 is the requirement, not English. Certificates must be under two years old and submitted by 31 March or the application is rejected on formal grounds. No English certificate requirement was found.',
    tuitionCurrency: 'CHF',
    tuitionIntlMin: 4380,
    tuitionIntlMax: 4380,
    tuitionYear: 'From autumn 2025: CHF 2,190 per semester for foreign students not resident in Switzerland when they gained their entrance qualification — triple the CHF 730 Swiss rate. Plus CHF 74 semester fees and a one-off CHF 150 application fee.',
    applicationSystem: 'ETH online application — one bachelor programme only',
    deadlineNote: '1 December – 31 March 23:59 CET for an autumn start. The entrance examination runs 18–28 January 2027 with registration 15 September – 15 October 2026.',
    cycle: '2026/27',
    checkedOn: '2026-09-02',
    sources: [
      'https://ethz.ch/content/dam/ethz/main/education/admission/bachelor/andere-qual/ETH-ZulassungsbedingungenHS2026_EN.pdf',
      'https://ethz.ch/en/studies/bachelor/application/non-swiss-matriculation-certificate/eth-entrance-examination.html',
      'https://ethz.ch/students/en/studies/financial/tuition-fees.html',
    ],
    areas: [
      {
        area: 'Medicine', offered: false, language: 'German',
        note: 'CLOSED to applicants without Swiss residence. ETH lists the only exceptions: Liechtenstein citizens, C-permit holders, spouses of Swiss citizens, EU/EFTA citizens employed a year or more in a Swiss medical profession, family-reunification permit holders, children of diplomats, recognised refugees. A student visa is not among them.',
        source: 'https://ethz.ch/en/studies/bachelor/application/bachelor-human-medicine/application-admission.html',
      },
      {
        area: 'Engineering', offered: true, language: 'German',
        ibPoints: 38, hlRequired: ['Mathematics', 'one of physics, chemistry or biology', 'one language A'],
        admissionsTest: 'Reduced or Comprehensive Entrance Examination if the IB rule is not met — conducted in German',
        source: 'https://ethz.ch/en/studies/bachelor.html',
      },
      {
        area: 'Computer Science', offered: true, course: 'Computer Science (D-INFK)', language: 'German',
        ibPoints: 38, hlRequired: ['Mathematics', 'one of physics, chemistry or biology', 'one language A'],
        source: 'https://ethz.ch/en/studies/bachelor.html',
      },
      { area: 'Economics & Business', offered: false, note: 'Not among ETH\'s bachelor offerings.' },
      { area: 'Law', offered: false },
      {
        area: 'Architecture & Art', offered: true, course: 'Architecture', language: 'German',
        ibPoints: 38, hlRequired: ['Mathematics', 'one of physics, chemistry or biology', 'one language A'],
        note: "The mathematics and science subject rule also applies to architecture.",
        source: 'https://ethz.ch/en/studies/bachelor.html',
      },
      { area: 'Psychology', offered: false },
    ],
  },

  {
    id: 'epfl',
    name: 'EPFL',
    city: 'Lausanne',
    country: 'Switzerland',
    tier: 'high',
    admissionModel: 'recognition',
    teachingLanguage: 'French',
    headline: "You need IB 38/42 and grade 6 in both mathematics and physics.",
    ibTypicalLow: 38,
    ibTypicalHigh: 38,
    ibNote: "You need at least 38 of 42 points (not counting bonus points), with at least a 6 in Mathematics and in Physics. At Higher Level (HL) you need Mathematics (either course), Physics, and Chemistry, Biology or Computer Science. You also need two modern languages and one of History, Geography, Economics or Philosophy, at HL or SL.",
    ieltsNote: 'French B2 is required and C1 highly recommended; a French competence certificate is a mandatory application document. No English requirement was found.',
    tuitionCurrency: 'CHF',
    tuitionIntlMin: 4380,
    tuitionIntlMax: 4380,
    tuitionYear: 'From autumn 2025: CHF 2,190 per semester for foreign students, tripled from CHF 730. Total semester invoice CHF 2,240. One-off application fee CHF 150.',
    applicationSystem: 'EPFL online application',
    deadlineNote: 'Applications open mid-November; submit by 30 April. Final documents by 10 July.',
    cycle: '2026/27',
    checkedOn: '2026-09-02',
    sources: [
      'https://www.epfl.ch/education/admission/admission-2/bachelor-admission-criteria-and-application/',
      'https://www.epfl.ch/education/studies/en/rules-and-procedures/study-taxes/tuition-fee-other-fees/',
    ],
    gaps: ['From 2025 EPFL caps first-year intake at 3,000. Swiss maturité holders are guaranteed a place; IB, EU, EFTA and UK certificate holders are accepted only "within the places available" at the beginning of August — so meeting the criteria does not guarantee admission.'],
    areas: [
      { area: 'Medicine', offered: false, note: 'Not among EPFL\'s thirteen bachelor programmes.' },
      {
        area: 'Engineering', offered: true, course: 'Civil, Electrical, Mechanical, Microengineering, Materials, Chemical, Environmental, Life Sciences Engineering',
        language: 'French',
        ibPoints: 38, hlRequired: ['Mathematics', 'Physics', 'one of chemistry, biology or computer science'],
        note: "You need grade 6 in both mathematics and physics. IB holders from the EU, EFTA and UK apply with the IB only; they cannot register for the entrance exam.",
        source: 'https://www.epfl.ch/education/admission/admission-2/bachelor-admission-criteria-and-application/',
      },
      {
        area: 'Computer Science', offered: true, course: 'Computer Science; Communication Systems', language: 'French',
        ibPoints: 38, hlRequired: ['Mathematics', 'Physics', 'one of chemistry, biology or computer science'],
        note: "You need HL Physics. HL Computer Science can only be your third subject.",
        source: 'https://www.epfl.ch/education/admission/admission-2/bachelor-admission-criteria-and-application/',
      },
      { area: 'Economics & Business', offered: false },
      { area: 'Law', offered: false },
      {
        area: 'Architecture & Art', offered: true, course: 'Architecture', language: 'French',
        ibPoints: 38, hlRequired: ['Mathematics', 'Physics', 'one of chemistry, biology or computer science'],
        note: "You need grade 6 in both mathematics and physics.",
        source: 'https://www.epfl.ch/education/bachelor/programs/',
      },
      { area: 'Psychology', offered: false },
    ],
  },

  {
    id: 'uzh',
    name: 'University of Zurich',
    city: 'Zurich',
    country: 'Switzerland',
    tier: 'high',
    admissionModel: 'recognition',
    teachingLanguage: 'German',
    headline: "You need IB 32/42, German at C1 level, and a set combination of subjects.",
    ibTypicalLow: 32,
    ibTypicalHigh: 32,
    ibNote: "You need 32 of 42 points (not counting bonus points) and six subjects, one from each group: first language, second language, Mathematics, a natural science, a humanities or social science, and one more. At least three must be at Higher Level (HL), including Mathematics or a natural science.",
    ieltsNote: 'German C1 required before matriculation. Accepted certificate names were not on the pages fetched.',
    tuitionCurrency: 'CHF',
    tuitionIntlMin: 2440,
    tuitionIntlMax: 2440,
    tuitionYear: 'CHF 720 per semester plus a CHF 500 per-semester foreign-student surcharge at bachelor level, so CHF 1,220 a semester plus CHF 59 contributions. Application fee CHF 100.',
    applicationSystem: 'UZH application system',
    deadlineNote: 'Foreign qualification, autumn start: 1 January – 30 April. Medicine 1 January – 31 March plus swissuniversities registration by 15 February.',
    cycle: 'not stated on the fees page',
    checkedOn: '2026-09-02',
    sources: [
      'https://www.uzh.ch/en/studies/application/bachelor.html',
      'https://www.swissuniversities.ch/en/themen/zulassung/zulassung-universitaere-hochschulen/international-baccalaureate',
      'https://www.uzh.ch/en/studies/application/fees.html',
    ],
    gaps: [
      'Faculty-level pages could not be reached, so no programme-specific requirements were verified for engineering, computer science, economics, law, architecture or psychology.',
      'The exact wording of the foreign-student surcharge eligibility could not be read; treat CHF 1,220 a semester as provisional.',
      'Applicants from countries outside the Lisbon Recognition Convention must sit the ECUS examination, held once a year in August — so autumn enrolment only.',
    ],
    areas: [
      {
        area: 'Medicine', offered: false, language: 'German',
        note: 'CLOSED. swissuniversities: without a Swiss passport or long-term residence you cannot be admitted to medical studies in Switzerland. Numerus clausus with the EMS aptitude test, CHF 300, registration December to 15 February.',
        source: 'https://www.swissuniversities.ch/en/service/applying-to-medical-school',
      },
      { area: 'Engineering', offered: false, note: 'Not verified — faculty pages unreachable.' },
      { area: 'Computer Science', offered: false, note: 'Not verified — faculty pages unreachable.' },
      { area: 'Economics & Business', offered: false, note: 'Not verified — faculty pages unreachable.' },
      { area: 'Law', offered: false, note: 'Not verified — faculty pages unreachable.' },
      { area: 'Architecture & Art', offered: false, note: 'Not verified.' },
      { area: 'Psychology', offered: false, note: 'Not verified — faculty pages unreachable.' },
    ],
  },

  {
    id: 'unige',
    name: 'University of Geneva',
    city: 'Geneva',
    country: 'Switzerland',
    tier: 'mid',
    admissionModel: 'recognition',
    teachingLanguage: 'French',
    headline: "Tuition is CHF 500 a semester.",
    ibTypicalLow: 32,
    ibTypicalHigh: 32,
    ibNote: "You need at least 32 points (not counting bonus points), with three Higher Level (HL) subjects, one of them a science (Mathematics, Chemistry, Biology or Physics), and three SL subjects, all studied over your last two years.",
    ieltsNote: 'French B2 minimum, proven by certificate or by passing UNIGE\'s own French examination, which is eliminatory for some programmes. Applicants educated in English may enrol without the French test grade in some cases.',
    tuitionCurrency: 'CHF',
    tuitionIntlMin: 1000,
    tuitionIntlMax: 1000,
    tuitionYear: 'CHF 500 per semester, with no separate international rate found on the fees page. Registration fee CHF 65 for holders of a foreign diploma.',
    applicationSystem: 'UNIGE immatriculation',
    deadlineNote: 'Opens 15 January. 28 February for applicants sitting ECUS or needing a visa; 30 April for everyone else.',
    cycle: '2026/27',
    checkedOn: '2026-09-02',
    sources: [
      'https://www.unige.ch/immatriculations/en/conditions',
      'https://www.unige.ch/immatriculations/informations/taxes',
      'https://www.unige.ch/gsem/en/programs/bachelor/admissions/',
    ],
    gaps: ['The fees page states no academic year and shows no international surcharge — absence of evidence, not evidence of absence. Faculty pages beyond the business school were not reachable.'],
    areas: [
      {
        area: 'Medicine', offered: false, language: 'French',
        note: 'UNIGE states only "special admission conditions". The bar comes from swissuniversities: no Swiss passport or long-term residence means no medical studies in Switzerland. Whether Geneva uses the EMS test or first-year elimination could not be confirmed.',
        source: 'https://www.unige.ch/medecine/enseignement1/bachelor-et-master-en-medecine-humaine/admissions/futursetudiants/procedureinscriptionmedecine',
      },
      { area: 'Engineering', offered: false, note: 'Largely EPFL territory; not verified at Geneva.' },
      { area: 'Computer Science', offered: false, note: 'Not verified.' },
      {
        area: 'Economics & Business', offered: true, course: 'GSEM Bachelor (Geneva School of Economics and Management)',
        language: 'Year one in both French and English; years two and three in one or the other',
        ibPoints: 32, hlRequired: ['one science (mathematics, chemistry, biology or physics)'],
        note: "You must pass a French language test, unless you qualify for the exemption for applicants educated in English.",
        source: 'https://www.unige.ch/gsem/en/programs/bachelor/admissions/',
      },
      { area: 'Law', offered: false, note: 'Not verified.' },
      { area: 'Architecture & Art', offered: false, note: 'Not verified.' },
      { area: 'Psychology', offered: false, note: 'Not verified.' },
    ],
  },
]

/*
 * STILL TO RESEARCH for Switzerland: University of St. Gallen (its pages could
 * not be reached at all — swissuniversities lists it as 32/42 plus an HSG
 * selection procedure), Lausanne, Bern, Basel, USI Lugano, Franklin University
 * Switzerland. Franklin and USI are the ones most likely to teach in English.
 */
