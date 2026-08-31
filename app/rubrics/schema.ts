import { extraRubrics } from './rubrics-extra'
// Rubric = data, not code.
// To add a new framework (A-Level, AP, college essay), just add an entry here.

export interface Criterion {
  id: string
  name: string
  max: number
  description: string
  bands: { range: string; descriptor: string }[]
  /**
   * False when the criterion's evidence is a video, audio file or artefact the
   * checker never sees. Such criteria are excluded from the prompt AND from the
   * total, and reported separately as unassessed — scoring them from text alone
   * would silently mark a student down for evidence they did submit.
   */
  textReadable?: boolean
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