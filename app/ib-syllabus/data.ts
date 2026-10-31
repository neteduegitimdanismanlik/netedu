// app/ib-syllabus/data.ts
//
// IB subject syllabus and assessment structure — data, not code, same rule as
// app/universities: every figure here was read off an official IBO subject
// brief, and every subject carries the URL it came from and the date it was
// checked. Topic names are the IB's own (they're the names students search
// for); every description is our own wording, never copied from a guide.
//
// A figure that could not be verified is left out (undefined) and the page
// says so — it is never filled from memory. That's why Economics has no SL
// weightings, and why several subjects (Mathematics, Computer Science,
// Business Management, ESS, SEHS) aren't in this file yet: their briefs could
// not be read when this was compiled.
//
// Hours: the IB's recommended teaching hours. Weights: % of the final grade.

export type SubtopicLevel = 'hl' | 'extra-hl'

export interface SyllabusSubtopic {
  name: string
  /** 'hl' = HL only. 'extra-hl' = taught to everyone, with additional HL content. */
  level?: SubtopicLevel
}

export interface SyllabusTopic {
  name: string
  hoursSL?: number | null
  hoursHL?: number | null
  /** The whole topic is HL only. */
  hlOnly?: boolean
  subtopics?: SyllabusSubtopic[]
  note?: string
}

export interface AssessmentComponent {
  component: string
  /** Our own one-line description of the format. */
  format: string
  /** Exam length in hours. Absent for internal assessment. */
  hours?: number
  /** % of the final grade; absent when not verified. */
  weight?: number
  internal?: boolean
}

export interface SyllabusSubject {
  slug: string
  subject: string
  group: string
  firstAssessment: string
  lastAssessment?: string
  hoursSL?: number
  hoursHL?: number
  topics: SyllabusTopic[]
  topicNote?: string
  assessment: { SL: AssessmentComponent[]; HL: AssessmentComponent[] }
  assessmentNote?: string
  ia: {
    name: string
    description: string
    /** number = weight; null = no IA at this level; undefined = not verified. */
    weightSL?: number | null
    weightHL?: number | null
  }
  /** Which /ib-ia pages this subject's IA lives on, and for which level. */
  iaPages: { slug: string; level?: 'SL' | 'HL' }[]
  notes: string[]
  /** Public URL of the source, when the IB publishes one. */
  source?: string
  /** What the figures were read from. Defaults to the subject brief. */
  sourceLabel?: string
  checkedOn: string
}

const CHECKED = '2026-10-31'
const G3 = 'Group 3 — Individuals and Societies'
const G4 = 'Group 4 — Sciences'
const G5 = 'Group 5 — Mathematics'

/** Biology, Chemistry and Physics share the same assessment model from 2025. */
function sciencesAssessment(paper1: string, paper2: string): SyllabusSubject['assessment'] {
  const ia: AssessmentComponent = {
    component: 'Internal assessment: scientific investigation',
    format: 'Open-ended individual investigation, written up as a report of up to 3,000 words',
    weight: 20,
    internal: true,
  }
  return {
    SL: [
      { component: 'Paper 1 (1A + 1B)', format: paper1, hours: 1.5, weight: 36 },
      { component: 'Paper 2', format: paper2, hours: 1.5, weight: 44 },
      ia,
    ],
    HL: [
      { component: 'Paper 1 (1A + 1B)', format: paper1, hours: 2, weight: 36 },
      { component: 'Paper 2', format: paper2, hours: 2.5, weight: 44 },
      ia,
    ],
  }
}

const SCIENCES_EXPERIMENTAL: SyllabusTopic = {
  name: 'Experimental programme',
  hoursSL: 40,
  hoursHL: 60,
  subtopics: [{ name: 'Practical work' }, { name: 'Collaborative sciences project' }, { name: 'Scientific investigation (the IA)' }],
  note: 'Practical work takes 20 hours at SL and 40 at HL; the collaborative project and the investigation take 10 hours each at both levels.',
}

const SCIENCES_IA = {
  name: 'Scientific investigation',
  description: 'An open-ended investigation of your own design, written up as a report of up to 3,000 words. The same task and criteria at SL and HL.',
  weightSL: 20,
  weightHL: 20,
}

export const SYLLABUS: SyllabusSubject[] = [
  {
    slug: 'biology',
    subject: 'Biology',
    group: G4,
    firstAssessment: '2025',
    hoursSL: 150,
    hoursHL: 240,
    topics: [
      {
        name: 'A. Unity and diversity', hoursSL: 19, hoursHL: 33,
        subtopics: [
          { name: 'Water' }, { name: 'Nucleic acids' }, { name: 'Origins of cells', level: 'hl' }, { name: 'Cell structure' },
          { name: 'Viruses', level: 'hl' }, { name: 'Diversity of organisms' }, { name: 'Classification and cladistics', level: 'hl' },
          { name: 'Evolution and speciation' }, { name: 'Conservation of biodiversity' },
        ],
      },
      {
        name: 'B. Form and function', hoursSL: 26, hoursHL: 39,
        subtopics: [
          { name: 'Carbohydrates and lipids' }, { name: 'Proteins' }, { name: 'Membranes and membrane transport' },
          { name: 'Organelles and compartmentalization' }, { name: 'Cell specialization' }, { name: 'Gas exchange' }, { name: 'Transport' },
          { name: 'Muscle and motility', level: 'hl' }, { name: 'Adaptation to environment' }, { name: 'Ecological niches' },
        ],
      },
      {
        name: 'C. Interaction and interdependence', hoursSL: 31, hoursHL: 48,
        subtopics: [
          { name: 'Enzymes and metabolism' }, { name: 'Cell respiration' }, { name: 'Photosynthesis' }, { name: 'Chemical signalling', level: 'hl' },
          { name: 'Neural signalling' }, { name: 'Integration of body systems' }, { name: 'Defence against disease' },
          { name: 'Populations and communities' }, { name: 'Transfer of energy and matter' },
        ],
      },
      {
        name: 'D. Continuity and change', hoursSL: 34, hoursHL: 60,
        subtopics: [
          { name: 'DNA replication' }, { name: 'Protein synthesis' }, { name: 'Mutations and gene editing' }, { name: 'Cell and nuclear division' },
          { name: 'Gene expression', level: 'hl' }, { name: 'Water potential' }, { name: 'Reproduction' }, { name: 'Inheritance' },
          { name: 'Homeostasis' }, { name: 'Natural selection' }, { name: 'Sustainability and change' }, { name: 'Climate change' },
        ],
      },
      SCIENCES_EXPERIMENTAL,
    ],
    topicNote: 'Topics marked HL only are taught to HL students alone. The rest are shared, with HL going deeper — which is where most of the extra 70 hours go.',
    assessment: sciencesAssessment(
      'Multiple-choice questions (1A), then data-based questions covering all four themes (1B)',
      'Data-based and short-answer questions, then extended-response questions'
    ),
    ia: SCIENCES_IA,
    iaPages: [{ slug: 'biology' }],
    notes: ['There are no option topics in this syllabus — the older Paper 3 with options is gone from first assessment 2025.'],
    source: 'https://www.ibo.org/globalassets/new-structure/recognition/pdfs/dp_sciences_biology_subject-brief_jan_2022_e.pdf',
    checkedOn: CHECKED,
  },
  {
    slug: 'chemistry',
    subject: 'Chemistry',
    group: G4,
    firstAssessment: '2025',
    hoursSL: 150,
    hoursHL: 240,
    topics: [
      {
        name: 'Structure 1. Models of the particulate nature of matter', hoursSL: 17, hoursHL: 21,
        subtopics: [
          { name: 'S1.1 Introduction to the particulate nature of matter' }, { name: 'S1.2 The nuclear atom' }, { name: 'S1.3 Electron configurations' },
          { name: 'S1.4 Counting particles by mass: the mole' }, { name: 'S1.5 Ideal gases' },
        ],
      },
      {
        name: 'Structure 2. Models of bonding and structure', hoursSL: 20, hoursHL: 30,
        subtopics: [{ name: 'S2.1 The ionic model' }, { name: 'S2.2 The covalent model' }, { name: 'S2.3 The metallic model' }, { name: 'S2.4 From models to materials' }],
      },
      {
        name: 'Structure 3. Classification of matter', hoursSL: 16, hoursHL: 31,
        subtopics: [{ name: 'S3.1 The periodic table: classification of elements' }, { name: 'S3.2 Functional groups: classification of organic compounds' }],
      },
      {
        name: 'Reactivity 1. What drives chemical reactions?', hoursSL: 12, hoursHL: 22,
        subtopics: [
          { name: 'R1.1 Measuring enthalpy change' }, { name: 'R1.2 Energy cycles in reactions' }, { name: 'R1.3 Energy from fuels' },
          { name: 'R1.4 Entropy and spontaneity', level: 'hl' },
        ],
      },
      {
        name: 'Reactivity 2. How much, how fast and how far?', hoursSL: 21, hoursHL: 31,
        subtopics: [
          { name: 'R2.1 How much? The amount of chemical change' }, { name: 'R2.2 How fast? The rate of chemical change' },
          { name: 'R2.3 How far? The extent of chemical change' },
        ],
      },
      {
        name: 'Reactivity 3. What are the mechanisms of chemical change?', hoursSL: 24, hoursHL: 45,
        subtopics: [
          { name: 'R3.1 Proton transfer reactions' }, { name: 'R3.2 Electron transfer reactions' }, { name: 'R3.3 Electron sharing reactions' },
          { name: 'R3.4 Electron-pair sharing reactions' },
        ],
      },
      SCIENCES_EXPERIMENTAL,
    ],
    topicNote: 'The course is built around two ideas — structure and reactivity — rather than a list of chapters. Only R1.4 is HL-only as a whole; most other sub-topics also carry additional HL content, which is why HL hours run higher across the board.',
    assessment: sciencesAssessment(
      'Multiple-choice questions (1A), then data-based questions and questions on experimental work (1B)',
      'Short-answer and extended-response questions'
    ),
    ia: SCIENCES_IA,
    iaPages: [{ slug: 'chemistry' }],
    notes: [],
    source: 'https://www.ibo.org/globalassets/new-structure/recognition/pdfs/dp_sciences_chemistry_subject-brief_jan_2022_e.pdf',
    checkedOn: CHECKED,
  },
  {
    slug: 'physics',
    subject: 'Physics',
    group: G4,
    firstAssessment: '2025',
    hoursSL: 150,
    hoursHL: 240,
    topics: [
      {
        name: 'A. Space, time and motion', hoursSL: 27, hoursHL: 42,
        subtopics: [
          { name: 'A.1 Kinematics' }, { name: 'A.2 Forces and momentum' }, { name: 'A.3 Work, energy and power' },
          { name: 'A.4 Rigid body mechanics', level: 'hl' }, { name: 'A.5 Galilean and special relativity', level: 'hl' },
        ],
      },
      {
        name: 'B. The particulate nature of matter', hoursSL: 24, hoursHL: 32,
        subtopics: [
          { name: 'B.1 Thermal energy transfers' }, { name: 'B.2 Greenhouse effect' }, { name: 'B.3 Gas laws' },
          { name: 'B.4 Thermodynamics', level: 'hl' }, { name: 'B.5 Current and circuits' },
        ],
      },
      {
        name: 'C. Wave behaviour', hoursSL: 17, hoursHL: 29,
        subtopics: [
          { name: 'C.1 Simple harmonic motion', level: 'extra-hl' }, { name: 'C.2 Wave model' }, { name: 'C.3 Wave phenomena', level: 'extra-hl' },
          { name: 'C.4 Standing waves and resonance' }, { name: 'C.5 Doppler effect', level: 'extra-hl' },
        ],
      },
      {
        name: 'D. Fields', hoursSL: 19, hoursHL: 38,
        subtopics: [
          { name: 'D.1 Gravitational fields', level: 'extra-hl' }, { name: 'D.2 Electric and magnetic fields', level: 'extra-hl' },
          { name: 'D.3 Motion in electromagnetic fields' }, { name: 'D.4 Induction', level: 'hl' },
        ],
      },
      {
        name: 'E. Nuclear and quantum physics', hoursSL: 23, hoursHL: 39,
        subtopics: [
          { name: 'E.1 Structure of the atom', level: 'extra-hl' }, { name: 'E.2 Quantum physics', level: 'hl' }, { name: 'E.3 Radioactive decay', level: 'extra-hl' },
          { name: 'E.4 Fission' }, { name: 'E.5 Fusion and stars' },
        ],
      },
      SCIENCES_EXPERIMENTAL,
    ],
    topicNote: 'Three kinds of sub-topic: shared by everyone, shared with extra HL content, and HL only.',
    assessment: sciencesAssessment(
      'Multiple-choice questions (1A), then data-based questions (1B)',
      'Short-answer and extended-response questions'
    ),
    ia: SCIENCES_IA,
    iaPages: [{ slug: 'physics' }],
    notes: [],
    source: 'https://ibo.org/globalassets/new-structure/recognition/pdfs/dp_sciences_physics_subject-brief_jan_2022_e.pdf',
    checkedOn: CHECKED,
  },
  {
    slug: 'design-technology',
    subject: 'Design Technology',
    group: G4,
    firstAssessment: '2027',
    hoursSL: 150,
    hoursHL: 240,
    topics: [
      {
        name: 'A. Design in theory', hoursSL: 33, hoursHL: 71,
        subtopics: [
          { name: 'A1.1 Ergonomics' }, { name: 'A2.1 User-centred research methods' }, { name: 'A2.2 Prototyping techniques' },
          { name: 'A3.1 Material classification and properties' }, { name: 'A3.2 Introduction to structural systems', level: 'hl' },
          { name: 'A3.3 Introduction to mechanical systems', level: 'hl' }, { name: 'A3.4 Introduction to electronic systems', level: 'hl' },
          { name: 'A4.1 Manufacturing techniques', level: 'hl' },
        ],
      },
      {
        name: 'B. Design in practice', hoursSL: 44, hoursHL: 77,
        subtopics: [
          { name: 'B1.1 User-centred design' }, { name: 'B2.1 The IB DP design process' }, { name: 'B2.2 Modelling and prototyping' },
          { name: 'B3.1 Material selection' }, { name: 'B3.2 Structural systems application and selection', level: 'hl' },
          { name: 'B3.3 Mechanical systems application and selection', level: 'hl' }, { name: 'B3.4 Electronic systems application and selection', level: 'hl' },
          { name: 'B4.1 Production systems', level: 'hl' },
        ],
      },
      {
        name: 'C. Design in context', hoursSL: 13, hoursHL: 32,
        subtopics: [
          { name: 'C1.1 Responsibility of the designer' }, { name: 'C1.2 Inclusive design' }, { name: 'C1.3 Beyond usability', level: 'hl' },
          { name: 'C2.1 Design for sustainability' }, { name: 'C2.2 Design for a circular economy' }, { name: 'C3.1 Product analysis and evaluation' },
          { name: 'C3.2 Life cycle analysis', level: 'hl' }, { name: 'C4.1 Design for manufacture strategies', level: 'hl' },
        ],
      },
      {
        name: 'Practical programme', hoursSL: 60, hoursHL: 60,
        subtopics: [{ name: 'Design project (the IA)' }, { name: 'Collaborative sciences project' }],
        note: '50 hours for the design project and 10 for the collaborative project, at both levels.',
      },
    ],
    topicNote: 'HL adds structural, mechanical and electronic systems and production, on top of the shared content.',
    assessment: {
      SL: [
        { component: 'Paper 1', format: 'Multiple-choice questions', hours: 1, weight: 20 },
        { component: 'Paper 2', format: 'Short-answer and extended-response questions', hours: 1.5, weight: 40 },
        { component: 'Internal assessment: design project', format: 'An individual design project', weight: 40, internal: true },
      ],
      HL: [
        { component: 'Paper 1', format: 'Multiple-choice questions', hours: 1.5, weight: 25 },
        { component: 'Paper 2', format: 'Short-answer and extended-response questions', hours: 2.5, weight: 45 },
        { component: 'Internal assessment: design project', format: 'An individual design project', weight: 30, internal: true },
      ],
    },
    ia: {
      name: 'Design project',
      description: 'An individual design project worked through the design cycle — from understanding a user to presenting a redesigned solution.',
      weightSL: 40,
      weightHL: 30,
    },
    iaPages: [{ slug: 'design-technology' }],
    notes: ['This is the new course (first assessment 2027). There is no HL Paper 3 in it — material describing one belongs to the previous course.'],
    source: 'https://www.ibo.org/globalassets/new-structure/university-admission/pdfs/dp_destech_subjectbrief_en.pdf',
    checkedOn: CHECKED,
  },
  {
    slug: 'global-politics',
    subject: 'Global Politics',
    group: G3,
    firstAssessment: '2026',
    hoursSL: 150,
    hoursHL: 240,
    topics: [
      { name: 'Core: Understanding power and global politics' },
      { name: 'Thematic studies', subtopics: [{ name: 'Rights and justice' }, { name: 'Development and sustainability' }, { name: 'Peace and conflict' }] },
      { name: 'HL extension: Global political challenges', hlOnly: true, hoursHL: 80 },
      { name: 'Engagement project (the IA)', hoursSL: 25, hoursHL: 35 },
    ],
    topicNote: 'The core and the three thematic studies take 125 hours together at both levels.',
    assessment: {
      SL: [
        { component: 'Paper 1', format: 'Source-based questions on the core', hours: 1.25, weight: 30 },
        { component: 'Paper 2', format: 'Extended-response questions on the thematic studies', hours: 1.5, weight: 40 },
        { component: 'Internal assessment: engagement project', format: 'A written report on a political issue you engaged with and researched', weight: 30, internal: true },
      ],
      HL: [
        { component: 'Paper 1', format: 'Source-based questions on the core', hours: 1.25, weight: 20 },
        { component: 'Paper 2', format: 'Extended-response questions on the thematic studies', hours: 1.5, weight: 30 },
        { component: 'Paper 3', format: 'Stimulus-based questions on the HL extension', hours: 1.5, weight: 30 },
        { component: 'Internal assessment: engagement project', format: 'A written report on a political issue you engaged with and researched', weight: 20, internal: true },
      ],
    },
    ia: {
      name: 'Engagement project',
      description: 'A written report on a political issue you have explored by engaging with it directly and researching it. HL adds a separate recommendation.',
      weightSL: 30,
      weightHL: 20,
    },
    iaPages: [{ slug: 'global-politics-sl', level: 'SL' }, { slug: 'global-politics-hl', level: 'HL' }],
    notes: ['The old HL oral was removed in this course and replaced by the HL Paper 3.'],
    source: 'https://www.ibo.org/globalassets/new-structure/university-admission/pdfs/global-politics-sl-hl-subject-brief-en.pdf',
    checkedOn: CHECKED,
  },
  {
    slug: 'digital-society',
    subject: 'Digital Society',
    group: G3,
    firstAssessment: '2024',
    hoursSL: 150,
    hoursHL: 240,
    topics: [
      {
        name: 'Concepts',
        subtopics: [{ name: 'Change' }, { name: 'Expression' }, { name: 'Identity' }, { name: 'Power' }, { name: 'Space' }, { name: 'Systems' }, { name: 'Values and ethics' }],
      },
      {
        name: 'Content',
        subtopics: [
          { name: 'Data' }, { name: 'Algorithms' }, { name: 'Computers' }, { name: 'Networks and the internet' }, { name: 'Media' },
          { name: 'Artificial intelligence' }, { name: 'Robots and autonomous technologies' },
        ],
      },
      {
        name: 'Contexts',
        subtopics: [
          { name: 'Cultural' }, { name: 'Economic' }, { name: 'Environmental' }, { name: 'Health' }, { name: 'Human knowledge' }, { name: 'Political' }, { name: 'Social' },
        ],
      },
      {
        name: 'HL extension: Challenges and interventions', hlOnly: true,
        subtopics: [{ name: 'Global well-being', level: 'hl' }, { name: 'Governance and human rights', level: 'hl' }, { name: 'Sustainable development', level: 'hl' }],
      },
    ],
    topicNote: 'Concepts, content and contexts are studied together rather than as separate units: a real digital system, looked at through a concept, in a context.',
    assessment: {
      SL: [
        { component: 'Paper 1', format: 'Questions on the syllabus, applied to real-world examples', hours: 1.5, weight: 40 },
        { component: 'Paper 2', format: 'Source-based questions', hours: 1.25, weight: 30 },
        { component: 'Internal assessment: inquiry project', format: 'Inquiry process document plus a recorded multimedia presentation', weight: 30, internal: true },
      ],
      HL: [
        { component: 'Paper 1', format: 'Questions on the syllabus and the HL extension, applied to real-world examples', hours: 2.25, weight: 35 },
        { component: 'Paper 2', format: 'Source-based questions', hours: 1.25, weight: 20 },
        { component: 'Paper 3', format: 'Questions on an intervention for an HL challenge, from a pre-released brief', hours: 1.25, weight: 25 },
        { component: 'Internal assessment: inquiry project', format: 'Inquiry process document plus a recorded multimedia presentation', weight: 20, internal: true },
      ],
    },
    ia: {
      name: 'Inquiry project',
      description: 'An inquiry into the impacts and implications of a digital system for people and communities, submitted as a process document and a recorded presentation. Same task at SL and HL.',
      weightSL: 30,
      weightHL: 20,
    },
    iaPages: [{ slug: 'digital-society' }],
    notes: [],
    source: 'https://www.ibo.org/globalassets/new-structure/recognition/pdfs/digital-society-subject-brief-en.pdf',
    checkedOn: CHECKED,
  },
  {
    slug: 'psychology',
    subject: 'Psychology',
    group: G3,
    firstAssessment: '2027',
    hoursSL: 150,
    hoursHL: 240,
    // Read from the full guide (December 2025 update), which supersedes the
    // 2024 subject brief. The brief described SL as exam-only with different
    // hours; the guide gives SL an internal assessment worth 30%.
    topics: [
      { name: 'Concepts', subtopics: [{ name: 'Bias' }, { name: 'Causality' }, { name: 'Change' }, { name: 'Measurement' }, { name: 'Perspective' }, { name: 'Responsibility' }] },
      { name: 'Content', subtopics: [{ name: 'Biological approach' }, { name: 'Cognitive approach' }, { name: 'Sociocultural approach' }, { name: 'Research methodology' }] },
      { name: 'Contexts', subtopics: [{ name: 'Health and well-being' }, { name: 'Human development' }, { name: 'Human relationships' }, { name: 'Learning and cognition' }] },
      { name: 'Integrating concepts, content and contexts', hoursSL: 100, hoursHL: 100 },
      { name: 'Class practicals (at least four)', hoursSL: 30, hoursHL: 30 },
      { name: 'HL extension: The role of culture, motivation and technology in shaping human behaviour', hlOnly: true, hoursHL: 45 },
      { name: 'HL extension: Data analysis and interpretation', hlOnly: true, hoursHL: 45 },
      { name: 'Internal assessment: research proposal', hoursSL: 20, hoursHL: 20 },
    ],
    topicNote: 'Concepts, content and contexts are taught together, not as separate units: the content is applied in each of the four contexts, and the class practicals sit inside them.',
    assessment: {
      SL: [
        { component: 'Paper 1', format: 'Short-answer questions and a concept-based extended response, integrating concepts, content and contexts', hours: 1.5, weight: 35 },
        { component: 'Paper 2', format: 'Questions on the class practicals, then the evaluation of an unseen study', hours: 1.5, weight: 35 },
        { component: 'Internal assessment: research proposal', format: 'A proposal for a study of a population of interest, up to 2,200 words', weight: 30, internal: true },
      ],
      HL: [
        { component: 'Paper 1', format: 'Short-answer questions and a concept-based extended response, integrating concepts, content and contexts', hours: 1.5, weight: 25 },
        { component: 'Paper 2', format: 'Questions on the class practicals, then the evaluation of an unseen study', hours: 1.5, weight: 25 },
        { component: 'Paper 3', format: 'Source-based questions analysing quantitative and qualitative research data, from one HL extension', hours: 1.75, weight: 30 },
        { component: 'Internal assessment: research proposal', format: 'A proposal for a study of a population of interest, up to 2,200 words', weight: 20, internal: true },
      ],
    },
    ia: {
      name: 'Research proposal',
      description: 'A proposal for a study of a population of interest, using one of the four research methods from the class practicals. It is designed, not carried out. Same task at SL and HL, marked out of 24.',
      weightSL: 30,
      weightHL: 20,
    },
    iaPages: [{ slug: 'psychology' }],
    notes: ['This is the new course, first assessed in May 2027.'],
    sourceLabel: 'IB Psychology guide, first assessment 2027 (December 2025 update)',
    checkedOn: CHECKED,
  },
  {
    slug: 'philosophy',
    subject: 'Philosophy',
    group: G3,
    firstAssessment: '2025',
    hoursSL: 150,
    hoursHL: 240,
    topics: [
      { name: 'Core theme: Being human', hoursSL: 45, hoursHL: 45 },
      {
        name: 'Optional themes (SL one, HL two)', hoursSL: 45, hoursHL: 90,
        subtopics: [
          { name: 'Aesthetics' }, { name: 'Epistemology' }, { name: 'Ethics' }, { name: 'Philosophy of religion' }, { name: 'Philosophy of science' },
          { name: 'Political philosophy' }, { name: 'Social philosophy' },
        ],
      },
      { name: 'Prescribed text (one from the IB list)', hoursSL: 40, hoursHL: 40 },
      { name: 'HL extension: Philosophy and contemporary issues', hlOnly: true, hoursHL: 45 },
      { name: 'Internal assessment: philosophical analysis', hoursSL: 20, hoursHL: 20 },
    ],
    assessment: {
      SL: [
        { component: 'Paper 1', format: 'A stimulus-based question on the core theme and an essay on your optional theme', hours: 1.75, weight: 50 },
        { component: 'Paper 2', format: 'An essay on your prescribed text', hours: 1, weight: 25 },
        { component: 'Internal assessment: philosophical analysis', format: 'A 2,000-word analysis of a non-philosophical stimulus', weight: 25, internal: true },
      ],
      HL: [
        { component: 'Paper 1', format: 'A stimulus-based question on the core theme and essays on both optional themes', hours: 2.5, weight: 40 },
        { component: 'Paper 2', format: 'An essay on your prescribed text', hours: 1, weight: 20 },
        { component: 'Paper 3', format: 'A response to an unseen philosophical text on a contemporary issue', hours: 1.25, weight: 20 },
        { component: 'Internal assessment: philosophical analysis', format: 'A 2,000-word analysis of a non-philosophical stimulus', weight: 20, internal: true },
      ],
    },
    ia: {
      name: 'Philosophical analysis',
      description: 'A 2,000-word philosophical analysis of a non-philosophical stimulus — a poem, a film scene, a painting. Same task at SL and HL.',
      weightSL: 25,
      weightHL: 20,
    },
    iaPages: [{ slug: 'philosophy' }],
    notes: [],
    source: 'https://www.ibo.org/globalassets/new-structure/university-admission/pdfs/dp-philosophy-brief-sl-hl-en.pdf',
    checkedOn: CHECKED,
  },
  {
    slug: 'economics',
    subject: 'Economics',
    group: G3,
    firstAssessment: '2022',
    lastAssessment: '2029',
    hoursHL: 240,
    topics: [
      { name: 'Unit 1: Introduction to economics', hoursHL: 10, subtopics: [{ name: '1.1 What is economics?' }, { name: '1.2 How do economists approach the world?' }] },
      {
        name: 'Unit 2: Microeconomics', hoursHL: 70,
        subtopics: [
          { name: '2.1 Demand' }, { name: '2.2 Supply' }, { name: '2.3 Competitive market equilibrium' },
          { name: '2.4 Critique of the maximizing behaviour of consumers and producers' }, { name: '2.5 Elasticity of demand' }, { name: '2.6 Elasticity of supply' },
          { name: '2.7 Role of government in microeconomics' }, { name: '2.8 Market failure — externalities and common pool or common access resources' },
          { name: '2.9 Market failure — public goods' }, { name: '2.10 Market failure — asymmetric information' }, { name: '2.11 Market failure — market power' },
          { name: "2.12 The market's inability to achieve equity" },
        ],
      },
      {
        name: 'Unit 3: Macroeconomics', hoursHL: 75,
        subtopics: [
          { name: '3.1 Measuring economic activity and illustrating its variations' }, { name: '3.2 Variations in economic activity — aggregate demand and aggregate supply' },
          { name: '3.3 Macroeconomic objectives' }, { name: '3.4 Economics of inequality and poverty' },
          { name: '3.5 Demand management (demand-side policies) — monetary policy' }, { name: '3.6 Demand management — fiscal policy' }, { name: '3.7 Supply-side policies' },
        ],
      },
      {
        name: 'Unit 4: The global economy', hoursHL: 65,
        subtopics: [
          { name: '4.1 Benefits of international trade' }, { name: '4.2 Types of trade protection' }, { name: '4.3 Arguments for and against trade control/protection' },
          { name: '4.4 Economic integration' }, { name: '4.5 Exchange rates' }, { name: '4.6 Balance of payments' }, { name: '4.7 Sustainable development' },
          { name: '4.8 Measuring development' }, { name: '4.9 Barriers to economic growth and/or economic development' },
          { name: '4.10 Economic growth and/or economic development strategies' },
        ],
      },
      { name: 'Internal assessment: portfolio of three commentaries', hoursHL: 20 },
    ],
    topicNote: 'SL and HL study the same four units; HL adds extension content within them, which the brief does not list topic by topic. Hours shown are HL.',
    assessment: {
      SL: [
        { component: 'Paper 1', format: 'Extended-response paper on all units' },
        { component: 'Paper 2', format: 'Data-response paper on all units' },
        { component: 'Internal assessment: portfolio', format: 'Three commentaries on news articles', internal: true },
      ],
      HL: [
        { component: 'Paper 1', format: 'Extended-response paper on all units', hours: 1.25, weight: 20 },
        { component: 'Paper 2', format: 'Data-response paper on all units', hours: 1.75, weight: 30 },
        { component: 'Paper 3', format: 'Policy paper on all units', hours: 1.75, weight: 30 },
        { component: 'Internal assessment: portfolio', format: 'Three commentaries on news articles', weight: 20, internal: true },
      ],
    },
    assessmentNote: "SL sits Papers 1 and 2 but not Paper 3. We haven't been able to verify the SL timings and weightings from the official SL brief yet, so they're not shown — check the official page.",
    ia: {
      name: 'Portfolio of three commentaries',
      description: 'Three commentaries on published news articles, each on a different unit (not the introductory one) and through a different key concept.',
      weightHL: 20,
    },
    iaPages: [{ slug: 'economics' }],
    notes: ['This course runs from first assessment 2022 to last assessment 2029.'],
    source: 'https://ibo.org/globalassets/new-structure/programmes/dp/pdfs/hl-economics-en.pdf',
    checkedOn: CHECKED,
  },
  {
    slug: 'business-management',
    subject: 'Business Management',
    group: G3,
    firstAssessment: '2024',
    hoursSL: 150,
    hoursHL: 240,
    topics: [
      {
        name: 'Unit 1: Introduction to business management', hoursSL: 20, hoursHL: 20,
        subtopics: [
          { name: '1.1 What is a business?' }, { name: '1.2 Types of business entities' }, { name: '1.3 Business objectives' },
          { name: '1.4 Stakeholders' }, { name: '1.5 Growth and evolution' }, { name: '1.6 Multinational companies (MNCs)' },
        ],
      },
      {
        name: 'Unit 2: Human resource management', hoursSL: 20, hoursHL: 35,
        subtopics: [
          { name: '2.1 Introduction to human resource management' }, { name: '2.2 Organizational structure' }, { name: '2.3 Leadership and management' },
          { name: '2.4 Motivation and demotivation' }, { name: '2.5 Organizational (corporate) culture', level: 'hl' }, { name: '2.6 Communication' },
          { name: '2.7 Industrial/employee relations', level: 'hl' },
        ],
      },
      {
        name: 'Unit 3: Finance and accounts', hoursSL: 30, hoursHL: 45,
        subtopics: [
          { name: '3.1 Introduction to finance' }, { name: '3.2 Sources of finance' }, { name: '3.3 Costs and revenues' }, { name: '3.4 Final accounts' },
          { name: '3.5 Profitability and liquidity ratio analysis' }, { name: '3.6 Debt/equity ratio analysis', level: 'hl' }, { name: '3.7 Cash flow' },
          { name: '3.8 Investment appraisal' }, { name: '3.9 Budgets', level: 'hl' },
        ],
      },
      {
        name: 'Unit 4: Marketing', hoursSL: 30, hoursHL: 35,
        subtopics: [
          { name: '4.1 Introduction to marketing' }, { name: '4.2 Marketing planning' }, { name: '4.3 Sales forecasting', level: 'hl' },
          { name: '4.4 Market research' }, { name: '4.5 The seven Ps of the marketing mix' }, { name: '4.6 International marketing', level: 'hl' },
        ],
      },
      {
        name: 'Unit 5: Operations management', hoursSL: 15, hoursHL: 45,
        subtopics: [
          { name: '5.1 Introduction to operations management' }, { name: '5.2 Operations methods' }, { name: '5.3 Lean production and quality management', level: 'hl' },
          { name: '5.4 Location' }, { name: '5.5 Break-even analysis' }, { name: '5.6 Production planning', level: 'hl' },
          { name: '5.7 Crisis management and contingency planning', level: 'hl' }, { name: '5.8 Research and development', level: 'hl' },
          { name: '5.9 Management information systems', level: 'hl' },
        ],
      },
      { name: 'Business management toolkit', hoursSL: 10, hoursHL: 35 },
      { name: 'Research for the Paper 1 pre-released statement', hoursSL: 5, hoursHL: 5 },
      { name: 'Internal assessment: business research project', hoursSL: 20, hoursHL: 20 },
    ],
    topicNote: 'Operations management is where the levels differ most — 15 hours at SL, 45 at HL, with five HL-only sub-topics.',
    assessment: {
      SL: [
        { component: 'Paper 1', format: 'Structured questions and one extended response on an unseen case study, set up by a pre-released statement', hours: 1.5, weight: 35 },
        { component: 'Paper 2', format: 'Structured and extended-response questions on unseen material with a quantitative focus', hours: 1.5, weight: 35 },
        { component: 'Internal assessment: business research project', format: 'A research project on a real organization, up to 1,800 words', weight: 30, internal: true },
      ],
      HL: [
        { component: 'Paper 1', format: 'Structured questions and one extended response on an unseen case study, set up by a pre-released statement', hours: 1.5, weight: 25 },
        { component: 'Paper 2', format: 'Structured and extended-response questions on unseen material with a quantitative focus, including HL topics', hours: 1.75, weight: 30 },
        { component: 'Paper 3', format: 'One compulsory question on unseen material about a social enterprise', hours: 1.25, weight: 25 },
        { component: 'Internal assessment: business research project', format: 'A research project on a real organization, up to 1,800 words', weight: 20, internal: true },
      ],
    },
    ia: {
      name: 'Business research project',
      description: 'A research project on a real business issue or problem facing a particular organization, seen through a key concept. Up to 1,800 words, marked out of 25. Same task at SL and HL.',
      weightSL: 30,
      weightHL: 20,
    },
    iaPages: [{ slug: 'business-management' }],
    notes: ['This course was first assessed in 2024. Older material describing an SL "written commentary" IA belongs to the previous course.'],
    source: 'https://www.ibo.org/globalassets/new-structure/university-admission/pdfs/subject-guides/business-management-guide.pdf',
    sourceLabel: 'IB Business management guide, first assessment 2024',
    checkedOn: CHECKED,
  },
  {
    slug: 'computer-science',
    subject: 'Computer Science',
    group: G4,
    firstAssessment: '2027',
    hoursSL: 150,
    hoursHL: 240,
    topics: [
      {
        name: 'Theme A: Concepts of computer science', hoursSL: 38, hoursHL: 72,
        subtopics: [{ name: 'A1 Computer fundamentals' }, { name: 'A2 Networks' }, { name: 'A3 Databases' }, { name: 'A4 Machine learning' }],
        note: 'A1–A3 take 11 hours each at SL and 18 at HL; machine learning goes from 5 hours at SL to 18 at HL.',
      },
      {
        name: 'Theme B: Computational thinking and problem-solving', hoursSL: 52, hoursHL: 93,
        subtopics: [
          { name: 'B1 Computational thinking' }, { name: 'B2 Programming' }, { name: 'B3 Object-oriented programming' },
          { name: 'B4 Abstract data types', level: 'hl' },
        ],
        note: 'Programming is the single biggest block: 40 hours at SL, 42 at HL.',
      },
      { name: 'Case study', hoursSL: 15, hoursHL: 30 },
      { name: 'Internal assessment: the computational solution', hoursSL: 35, hoursHL: 35 },
      { name: 'Collaborative sciences project', hoursSL: 10, hoursHL: 10 },
    ],
    assessment: {
      SL: [
        { component: 'Paper 1', format: 'Extended-response questions on theme A, then short-response questions on the pre-seen case study', hours: 1.25, weight: 35 },
        { component: 'Paper 2', format: 'Extended-response questions on theme B', hours: 1.25, weight: 35 },
        { component: 'Internal assessment: the computational solution', format: 'One task: a computational solution, marked out of 30', weight: 30, internal: true },
      ],
      HL: [
        { component: 'Paper 1', format: 'Extended-response questions on theme A, then short- and extended-response questions on the pre-seen case study', hours: 2, weight: 40 },
        { component: 'Paper 2', format: 'Extended-response questions on theme B', hours: 2, weight: 40 },
        { component: 'Internal assessment: the computational solution', format: 'One task: a computational solution, marked out of 30', weight: 20, internal: true },
      ],
    },
    ia: {
      name: 'The computational solution',
      description: 'One task: building and documenting a computational solution to a problem, marked out of 30. Same task at SL and HL.',
      weightSL: 30,
      weightHL: 20,
    },
    iaPages: [{ slug: 'computer-science' }],
    notes: ['This is the new course, first assessed in May 2027. There is no Paper 3 at HL any more — the case study is examined in Paper 1.'],
    source: 'https://ibo.org/globalassets/new-structure/university-admission/pdfs/subject-guides/computer-science-first-assessment-2027-guide-sbs.pdf',
    sourceLabel: 'IB Computer science guide, first assessment 2027',
    checkedOn: CHECKED,
  },
  {
    slug: 'mathematics-aa',
    subject: 'Mathematics AA',
    group: G5,
    firstAssessment: '2021',
    hoursSL: 150,
    hoursHL: 240,
    topics: [
      { name: 'Topic 1: Number and algebra', hoursSL: 19, hoursHL: 39 },
      { name: 'Topic 2: Functions', hoursSL: 21, hoursHL: 32 },
      { name: 'Topic 3: Geometry and trigonometry', hoursSL: 25, hoursHL: 51 },
      { name: 'Topic 4: Statistics and probability', hoursSL: 27, hoursHL: 33 },
      { name: 'Topic 5: Calculus', hoursSL: 28, hoursHL: 55 },
      { name: 'The toolkit and the mathematical exploration (the IA)', hoursSL: 30, hoursHL: 30 },
    ],
    topicNote: 'Mathematics: Analysis and Approaches. All five topics are compulsory at both levels; HL adds further content (marked "AHL" in the guide) inside each topic rather than separate topics. Calculus and geometry are where HL grows most.',
    assessment: {
      SL: [
        { component: 'Paper 1', format: 'Short- and extended-response questions — no calculator', hours: 1.5, weight: 40 },
        { component: 'Paper 2', format: 'Short- and extended-response questions — calculator required', hours: 1.5, weight: 40 },
        { component: 'Internal assessment: mathematical exploration', format: 'An individual written exploration, marked out of 20', weight: 20, internal: true },
      ],
      HL: [
        { component: 'Paper 1', format: 'Short- and extended-response questions — no calculator', hours: 2, weight: 30 },
        { component: 'Paper 2', format: 'Short- and extended-response questions — calculator required', hours: 2, weight: 30 },
        { component: 'Paper 3', format: 'Two extended problem-solving questions — calculator required', hours: 1.25, weight: 20 },
        { component: 'Internal assessment: mathematical exploration', format: 'An individual written exploration, marked out of 20', weight: 20, internal: true },
      ],
    },
    ia: {
      name: 'Mathematical exploration',
      description: 'An individual piece of written work investigating an area of mathematics of your choice, marked out of 20. Same task at SL and HL.',
      weightSL: 20,
      weightHL: 20,
    },
    iaPages: [{ slug: 'mathematics-aa' }],
    notes: [
      'The main exam difference from Mathematics AI: in AA, Paper 1 is taken without a calculator.',
      'You can take only one of the two IB mathematics courses.',
    ],
    source: 'https://ibo.org/globalassets/new-structure/university-admission/pdfs/subject-guides/mathematics-analysis-approaches-guide.pdf',
    sourceLabel: 'IB Mathematics: analysis and approaches guide, first assessment 2021 (November 2024 update)',
    checkedOn: CHECKED,
  },
  {
    slug: 'mathematics-ai',
    subject: 'Mathematics AI',
    group: G5,
    firstAssessment: '2021',
    hoursSL: 150,
    hoursHL: 240,
    topics: [
      { name: 'Topic 1: Number and algebra', hoursSL: 16, hoursHL: 29 },
      { name: 'Topic 2: Functions', hoursSL: 31, hoursHL: 42 },
      { name: 'Topic 3: Geometry and trigonometry', hoursSL: 18, hoursHL: 46 },
      { name: 'Topic 4: Statistics and probability', hoursSL: 36, hoursHL: 52 },
      { name: 'Topic 5: Calculus', hoursSL: 19, hoursHL: 41 },
      { name: 'The toolkit and the mathematical exploration (the IA)', hoursSL: 30, hoursHL: 30 },
    ],
    topicNote: 'Mathematics: Applications and Interpretation. All five topics are compulsory at both levels; HL adds further content (marked "AHL" in the guide) inside each topic. Statistics and probability is the biggest topic at both levels.',
    assessment: {
      SL: [
        { component: 'Paper 1', format: 'Short-response questions — calculator required', hours: 1.5, weight: 40 },
        { component: 'Paper 2', format: 'Extended-response questions — calculator required', hours: 1.5, weight: 40 },
        { component: 'Internal assessment: mathematical exploration', format: 'An individual written exploration, marked out of 20', weight: 20, internal: true },
      ],
      HL: [
        { component: 'Paper 1', format: 'Short-response questions — calculator required', hours: 2, weight: 30 },
        { component: 'Paper 2', format: 'Extended-response questions — calculator required', hours: 2, weight: 30 },
        { component: 'Paper 3', format: 'Two extended problem-solving questions — calculator required', hours: 1.25, weight: 20 },
        { component: 'Internal assessment: mathematical exploration', format: 'An individual written exploration, marked out of 20', weight: 20, internal: true },
      ],
    },
    ia: {
      name: 'Mathematical exploration',
      description: 'An individual piece of written work investigating an area of mathematics of your choice, marked out of 20. Same task at SL and HL.',
      weightSL: 20,
      weightHL: 20,
    },
    iaPages: [{ slug: 'mathematics-ai' }],
    notes: [
      'Every AI paper is taken with a calculator — unlike Mathematics AA, where Paper 1 is calculator-free.',
      'You can take only one of the two IB mathematics courses. Some university courses ask for AA specifically — check yours in the university pages.',
    ],
    sourceLabel: 'IB Mathematics: applications and interpretation guide, first assessment 2021 (August 2025 update)',
    checkedOn: CHECKED,
  },
]

export function syllabusBySlug(slug: string): SyllabusSubject | undefined {
  return SYLLABUS.find((s) => s.slug === slug)
}

/** The syllabus entry whose IA lives on this /ib-ia page, and which level that page covers. */
export function syllabusForIaPage(iaSlug: string): { s: SyllabusSubject; level?: 'SL' | 'HL' } | undefined {
  for (const s of SYLLABUS) {
    const p = s.iaPages.find((x) => x.slug === iaSlug)
    if (p) return { s, level: p.level }
  }
  return undefined
}

/**
 * One honest sentence about what the IA is worth, or null when we don't hold
 * a verified figure. Replaces the single rubric `weight`, which was wrong at
 * HL for every subject where the two levels differ.
 */
export function iaWeightSentence(s: SyllabusSubject, level?: 'SL' | 'HL'): string | null {
  const { weightSL, weightHL } = s.ia
  if (level === 'SL') return typeof weightSL === 'number' ? `It counts for ${weightSL}% of the final SL grade.` : null
  if (level === 'HL') {
    if (typeof weightHL !== 'number') return null
    return weightSL === null
      ? `It's HL only — worth ${weightHL}% of the final HL grade. SL students don't do an internal assessment in this subject.`
      : `It counts for ${weightHL}% of the final HL grade.`
  }
  if (typeof weightSL === 'number' && typeof weightHL === 'number') {
    return weightSL === weightHL
      ? `It counts for ${weightSL}% of the final grade at both SL and HL.`
      : `It counts for ${weightSL}% of the final grade at SL and ${weightHL}% at HL.`
  }
  if (typeof weightHL === 'number') return `It counts for ${weightHL}% of the final HL grade.`
  return null
}
