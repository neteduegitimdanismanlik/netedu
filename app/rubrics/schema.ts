import { extraRubrics } from './rubrics-extra'
// Rubric = data, not code.import { extraRubrics } from './rubrics-extra'
// To add a new framework (A-Level, AP, college essay), just add an entry here.

export interface Criterion {
  id: string
  name: string
  max: number
  description: string
  bands: { range: string; descriptor: string }[]
}

export interface Rubric {
  id: string
  framework: string
  documentType: string
  label: string
  totalMax: number
  gradeScale: { grade: string; min: number }[]
  criteria: Criterion[]
  guidance?: string
}

// NOTE on gradeScale: calculateGrade returns the first band whose `min` is met,
// so every gradeScale must stay sorted from highest `min` to lowest.
//
// NOTE on IA grade boundaries: the IB does not publish grade boundaries for the
// IA in isolation, and real boundaries shift each session after moderation.
// The scales below are indicative bands for feedback only — never present them
// to a student as a predicted grade.

export const rubrics: Rubric[] = [
  {
    id: 'ib-oral',
    framework: 'IB',
    documentType: 'Individual Oral',
    label: 'IB — Individual Oral',
    totalMax: 30,
    gradeScale: [
      { grade: '7', min: 26 }, { grade: '6', min: 22 }, { grade: '5', min: 17 },
      { grade: '4', min: 13 }, { grade: '3', min: 9 }, { grade: '2', min: 5 }, { grade: '1', min: 0 }
    ],
    criteria: [
      { id: 'A', name: 'Knowledge & Understanding', max: 10, description: 'Understanding of the extract, work and global issue', bands: [
        { range: '9-10', descriptor: 'Excellent knowledge with insightful references to the extract and global issue' },
        { range: '5-8', descriptor: 'Good understanding with relevant references' },
        { range: '1-4', descriptor: 'Limited understanding with few or superficial references' },
      ]},
      { id: 'B', name: 'Analysis & Evaluation', max: 10, description: 'Analysis of authorial choices and their effect', bands: [
        { range: '9-10', descriptor: 'Insightful analysis of how language choices construct meaning' },
        { range: '5-8', descriptor: 'Adequate analysis, sometimes descriptive' },
        { range: '1-4', descriptor: 'Mostly descriptive with little analysis' },
      ]},
      { id: 'C', name: 'Focus & Organization', max: 5, description: 'Structure, balance and coherence of the oral', bands: [
        { range: '4-5', descriptor: 'Well-structured, balanced and consistently focused' },
        { range: '2-3', descriptor: 'Generally organised with some imbalance' },
        { range: '0-1', descriptor: 'Poorly structured or unbalanced' },
      ]},
      { id: 'D', name: 'Language', max: 5, description: 'Clarity, accuracy, register and vocabulary', bands: [
        { range: '4-5', descriptor: 'Clear, accurate and varied language with appropriate register' },
        { range: '2-3', descriptor: 'Generally clear with occasional lapses' },
        { range: '0-1', descriptor: 'Frequently unclear or inaccurate' },
      ]},
    ]
  },
  {
    id: 'general-speaking',
    framework: 'General',
    documentType: 'Speaking Assessment',
    label: 'General — Speaking / Language Exam',
    totalMax: 20,
    gradeScale: [
      { grade: 'Excellent', min: 17 }, { grade: 'Strong', min: 13 },
      { grade: 'Adequate', min: 9 }, { grade: 'Developing', min: 0 }
    ],
    criteria: [
      { id: 'A', name: 'Fluency & Coherence', max: 5, description: 'Flow, pacing and logical connection of ideas', bands: [
        { range: '4-5', descriptor: 'Speaks fluently with natural pacing and coherent development' },
        { range: '2-3', descriptor: 'Generally fluent with noticeable hesitation' },
        { range: '0-1', descriptor: 'Frequent pauses disrupting communication' },
      ]},
      { id: 'B', name: 'Vocabulary', max: 5, description: 'Range and precision of word choice', bands: [
        { range: '4-5', descriptor: 'Wide, precise vocabulary used naturally' },
        { range: '2-3', descriptor: 'Adequate vocabulary with some repetition' },
        { range: '0-1', descriptor: 'Limited vocabulary restricting expression' },
      ]},
      { id: 'C', name: 'Grammar & Accuracy', max: 5, description: 'Range and control of grammatical structures', bands: [
        { range: '4-5', descriptor: 'Varied structures used accurately' },
        { range: '2-3', descriptor: 'Mix of simple and complex forms with some errors' },
        { range: '0-1', descriptor: 'Frequent errors affecting meaning' },
      ]},
      { id: 'D', name: 'Content & Delivery', max: 5, description: 'Relevance, depth and confidence of the response', bands: [
        { range: '4-5', descriptor: 'Rich, relevant content delivered confidently' },
        { range: '2-3', descriptor: 'Relevant but underdeveloped content' },
        { range: '0-1', descriptor: 'Thin or off-topic content' },
      ]},
    ]
  },
  {
    id: 'ib-ia-sciences',
    framework: 'IB',
    documentType: 'Internal Assessment',
    label: 'IB — Internal Assessment (Sciences)',
    totalMax: 24,
    gradeScale: [
      { grade: '7', min: 21 }, { grade: '6', min: 18 }, { grade: '5', min: 14 },
      { grade: '4', min: 11 }, { grade: '3', min: 8 }, { grade: '2', min: 5 }, { grade: '1', min: 0 }
    ],
    criteria: [
      {
        id: 'A', name: 'Research Design', max: 6,
        description: 'Research question, background, methodology and variables',
        bands: [
          { range: '5-6', descriptor: 'Clear, focused research question with well-justified methodology and fully identified variables' },
          { range: '3-4', descriptor: 'Relevant research question with mostly appropriate methodology' },
          { range: '1-2', descriptor: 'Vague research question with limited methodological detail' },
        ]
      },
      {
        id: 'B', name: 'Data Analysis', max: 6,
        description: 'Data processing, presentation and treatment of uncertainty',
        bands: [
          { range: '5-6', descriptor: 'Accurate processing with appropriate uncertainty treatment and clear presentation' },
          { range: '3-4', descriptor: 'Mostly correct processing with some gaps in uncertainty or presentation' },
          { range: '1-2', descriptor: 'Basic processing with significant omissions' },
        ]
      },
      {
        id: 'C', name: 'Conclusion', max: 6,
        description: 'Interpretation of results and comparison with accepted scientific context',
        bands: [
          { range: '5-6', descriptor: 'Justified conclusion fully supported by data and contextualised with accepted science' },
          { range: '3-4', descriptor: 'Conclusion described and partially supported by data' },
          { range: '1-2', descriptor: 'Conclusion stated with weak link to data' },
        ]
      },
      {
        id: 'D', name: 'Evaluation', max: 6,
        description: 'Limitations, weaknesses and realistic improvements',
        bands: [
          { range: '5-6', descriptor: 'Relevant limitations explained with realistic, specific improvements' },
          { range: '3-4', descriptor: 'Some limitations described with generic improvements' },
          { range: '1-2', descriptor: 'Limitations listed without meaningful evaluation' },
        ]
      },
    ]
  },
  {
    // Mathematics IA (analysis and approaches / applications and interpretation).
    // Criteria A-D are identical for SL and HL; only criterion E differs, so the
    // student's level must be supplied for criterion E to be judged correctly.
    id: 'ib-ia-maths',
    framework: 'IB',
    documentType: 'Internal Assessment',
    label: 'IB — Internal Assessment (Mathematics)',
    totalMax: 20,
    gradeScale: [
      { grade: '7', min: 17 }, { grade: '6', min: 15 }, { grade: '5', min: 12 },
      { grade: '4', min: 9 }, { grade: '3', min: 7 }, { grade: '2', min: 4 }, { grade: '1', min: 0 }
    ],
    criteria: [
      {
        id: 'A', name: 'Presentation', max: 4,
        description: 'Coherence, organisation and conciseness of the exploration',
        bands: [
          { range: '4', descriptor: 'Coherent, well-organised and concise; the reader can follow the argument without rereading, and every section serves the stated aim' },
          { range: '3', descriptor: 'Mostly coherent and organised; a section or two is padded or drifts from the aim' },
          { range: '2', descriptor: 'Some organisation, but the reader has to work to follow the thread; noticeable digressions' },
          { range: '0-1', descriptor: 'Little discernible structure; aim is unclear or abandoned' },
        ]
      },
      {
        id: 'B', name: 'Mathematical communication', max: 4,
        description: 'Notation, terminology, symbols, variables and use of graphs, tables and diagrams',
        bands: [
          { range: '4', descriptor: 'Notation and terminology are correct and consistent throughout; all variables and symbols are defined; graphs, tables and diagrams are appropriate and fully labelled' },
          { range: '3', descriptor: 'Largely correct notation with occasional lapses — an undefined symbol, an unlabelled axis' },
          { range: '2', descriptor: 'Some correct mathematical form, but frequent lapses or reliance on calculator/software notation instead of proper mathematical notation' },
          { range: '0-1', descriptor: 'Mathematical form is largely absent or incorrect' },
        ]
      },
      {
        id: 'C', name: 'Personal engagement', max: 3,
        description: 'Evidence of independent thinking, initiative and genuine ownership of the exploration',
        bands: [
          { range: '3', descriptor: 'Clear evidence of independent thinking — own data, own approach, or engaging with mathematics beyond what was taught; the personal connection changes how the work is done' },
          { range: '2', descriptor: 'Some evidence of engagement; a personal reason is stated and partly followed through' },
          { range: '1', descriptor: 'Minimal engagement; interest is asserted but has no consequence for the mathematics' },
          { range: '0', descriptor: 'No evidence of personal engagement' },
        ]
      },
      {
        id: 'D', name: 'Reflection', max: 3,
        description: 'Critical reflection on results, limitations and choices made',
        bands: [
          { range: '3', descriptor: 'Reflection is critical and substantial — limitations are examined, alternative approaches weighed, implications considered; it runs through the work rather than sitting only in the conclusion' },
          { range: '2', descriptor: 'Meaningful reflection, but mostly at the end and more descriptive than evaluative' },
          { range: '1', descriptor: 'Reflection is limited to restating what was done' },
          { range: '0', descriptor: 'No reflection' },
        ]
      },
      {
        id: 'E', name: 'Use of mathematics', max: 6,
        description: 'Relevance, correctness and depth of the mathematics, judged against the level of the course. SL and HL differ on this criterion only: HL additionally expects rigour and sophistication, not just correct computation.',
        bands: [
          { range: '6', descriptor: 'Mathematics is relevant to the aim, at or beyond the level of the course, and correct throughout; understanding is demonstrated rather than mechanically applied. HL: the approach shows rigour and sophistication — results are justified, not merely computed' },
          { range: '5', descriptor: 'Mathematics is at course level and correct apart from minor slips that do not affect the conclusions; understanding is evident. HL: some steps asserted without justification' },
          { range: '3-4', descriptor: 'Mathematics is mostly at course level but contains errors or unjustified steps; understanding is only partly demonstrated' },
          { range: '1-2', descriptor: 'Mathematics is below the level of the course or largely incorrect; limited understanding' },
          { range: '0', descriptor: 'No relevant mathematics' },
        ]
      },
    ]
  },
  {
    id: 'ib-ee',
    framework: 'IB',
    documentType: 'Extended Essay',
    label: 'IB — Extended Essay',
    totalMax: 34,
    gradeScale: [
      { grade: 'A', min: 27 }, { grade: 'B', min: 21 }, { grade: 'C', min: 14 },
      { grade: 'D', min: 7 }, { grade: 'E', min: 0 }
    ],
    criteria: [
      { id: 'A', name: 'Focus and Method', max: 6, description: 'Topic, research question and methodology', bands: [
        { range: '5-6', descriptor: 'Clearly identified and focused topic with an appropriate, well-explained research question and methodology' },
        { range: '3-4', descriptor: 'Topic and research question identified, methodology mostly appropriate' },
        { range: '1-2', descriptor: 'Topic communicated unclearly, research question too broad' },
      ]},
      { id: 'B', name: 'Knowledge and Understanding', max: 6, description: 'Subject context and terminology', bands: [
        { range: '5-6', descriptor: 'Knowledge is precise, well-contextualised, terminology used consistently and effectively' },
        { range: '3-4', descriptor: 'Knowledge is mostly relevant with generally accurate terminology' },
        { range: '1-2', descriptor: 'Knowledge is limited or largely descriptive' },
      ]},
      { id: 'C', name: 'Critical Thinking', max: 12, description: 'Research, analysis and argument', bands: [
        { range: '9-12', descriptor: 'Research is well-analysed, arguments are coherent, conclusions fully supported by evidence' },
        { range: '5-8', descriptor: 'Research is relevant, analysis present but inconsistent, arguments partially supported' },
        { range: '1-4', descriptor: 'Research is descriptive with minimal analysis and unsupported conclusions' },
      ]},
      { id: 'D', name: 'Presentation', max: 4, description: 'Structure, layout and citation', bands: [
        { range: '3-4', descriptor: 'Structure and layout consistently support the argument, citations complete' },
        { range: '1-2', descriptor: 'Presentation is mostly appropriate with some inconsistencies' },
      ]},
      { id: 'E', name: 'Engagement', max: 6, description: 'Reflection on process and decision-making', bands: [
        { range: '5-6', descriptor: 'Reflections are analytical and show genuine intellectual initiative' },
        { range: '3-4', descriptor: 'Reflections are descriptive of the process' },
        { range: '1-2', descriptor: 'Reflections are limited and superficial' },
      ]},
    ]
  },
  {
    id: 'general-college-essay',
    framework: 'General',
    documentType: 'University Essay',
    label: 'General — University Application Essay',
    totalMax: 20,
    gradeScale: [
      { grade: 'Excellent', min: 17 }, { grade: 'Strong', min: 13 },
      { grade: 'Adequate', min: 9 }, { grade: 'Weak', min: 0 }
    ],
    criteria: [
      { id: 'A', name: 'Personal Voice', max: 5, description: 'Authenticity and distinctiveness of the writer', bands: [
        { range: '4-5', descriptor: 'Voice is authentic, specific and memorable' },
        { range: '2-3', descriptor: 'Voice is present but generic in places' },
        { range: '0-1', descriptor: 'Voice is impersonal or cliched' },
      ]},
      { id: 'B', name: 'Narrative Structure', max: 5, description: 'Arc, pacing and coherence', bands: [
        { range: '4-5', descriptor: 'Clear arc with purposeful opening and resonant ending' },
        { range: '2-3', descriptor: 'Structure is functional but predictable' },
        { range: '0-1', descriptor: 'Disorganised or listing in nature' },
      ]},
      { id: 'C', name: 'Reflection & Insight', max: 5, description: 'Depth of self-understanding demonstrated', bands: [
        { range: '4-5', descriptor: 'Reflection reveals genuine growth and mature insight' },
        { range: '2-3', descriptor: 'Some reflection, mostly stated rather than shown' },
        { range: '0-1', descriptor: 'Describes events without reflection' },
      ]},
      { id: 'D', name: 'Language & Craft', max: 5, description: 'Precision, rhythm and control of language', bands: [
        { range: '4-5', descriptor: 'Precise, controlled prose with strong imagery' },
        { range: '2-3', descriptor: 'Clear but uneven prose' },
        { range: '0-1', descriptor: 'Frequent errors or vague phrasing' },
      ]},
    ]
  },
]

export function getRubric(id: string): any {
  return rubrics.find(r => r.id === id) ?? extraRubrics.find(r => r.id === id)
}

/** Every rubric, base and extended. Use this for pickers and filters. */
export function allRubrics(): any[] {
  return [...rubrics, ...extraRubrics]
}

export function calculateGrade(rubric: Rubric, total: number): string {
  for (const g of rubric.gradeScale) {
    if (total >= g.min) return g.grade
  }
  return rubric.gradeScale[rubric.gradeScale.length - 1].grade
}