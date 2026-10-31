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
    // Extended Essay, first assessment May 2027 (guide published 2025).
    // The old 34-mark model (Focus and method / K&U / Critical thinking 12 /
    // Presentation / Engagement 6) was last assessed in November 2026, so
    // every EE submitted from here on is marked out of 30 like this.
    // Criterion names and maxima match the new guide. Descriptors are our own
    // short summaries, not the IB's markband text. The IB does not publish EE
    // grade boundaries in advance: gradeScale is an estimate, scaled from the
    // proportions of past sessions — indicative only, like the IA scales.
    // Criterion E marks the RPF statement: if the student pastes only the
    // essay, there is little for E to go on.
    id: 'ib-ee',
    framework: 'IB',
    documentType: 'Extended Essay',
    label: 'IB — Extended Essay (May 2027 onward)',
    totalMax: 30,
    gradeScale: [
      { grade: 'A', min: 24 }, { grade: 'B', min: 19 }, { grade: 'C', min: 12 },
      { grade: 'D', min: 6 }, { grade: 'E', min: 0 }
    ],
    criteria: [
      { id: 'A', name: 'Framework for the essay', max: 6, description: 'Research question, chosen approach and methods, and a structure and presentation that support the argument', bands: [
        { range: '5-6', descriptor: 'A focused, clearly stated research question; the approach and methods are well chosen and justified; structure, layout and referencing consistently support the reader' },
        { range: '3-4', descriptor: 'Research question stated but broad or only partly focused; methods mostly appropriate; structure and referencing generally clear with lapses' },
        { range: '1-2', descriptor: 'Research question unclear or too broad; approach poorly suited or unexplained; structure and referencing get in the way' },
      ]},
      { id: 'B', name: 'Knowledge and understanding', max: 6, description: 'Subject knowledge, terminology and use of sources, in the context of the research question', bands: [
        { range: '5-6', descriptor: 'Knowledge is accurate, relevant and well contextualised; subject terminology and concepts used precisely; sources well selected' },
        { range: '3-4', descriptor: 'Knowledge mostly relevant and accurate; terminology generally appropriate; sources adequate' },
        { range: '1-2', descriptor: 'Knowledge limited, largely descriptive or not connected to the research question; terminology weak' },
      ]},
      { id: 'C', name: 'Analysis and line of argument', max: 6, description: 'How evidence is analysed and built into a coherent, reasoned argument that answers the research question', bands: [
        { range: '5-6', descriptor: 'Evidence is analysed, not just reported; a clear, coherent line of argument runs through the essay and answers the research question' },
        { range: '3-4', descriptor: 'Some effective analysis; the argument is present but uneven or partly descriptive' },
        { range: '1-2', descriptor: 'Mostly description or summary; little analysis and no clear line of argument' },
      ]},
      { id: 'D', name: 'Discussion and evaluation', max: 8, description: 'Weighing evidence, sources and methods, considering other views and limitations, and reaching a conclusion the essay supports', bands: [
        { range: '7-8', descriptor: 'Sustained, critical evaluation of evidence, sources and methods; alternative views and limitations weighed; conclusion fully supported and its significance discussed' },
        { range: '5-6', descriptor: 'Evaluation present and mostly relevant; some alternative views or limitations considered; conclusion largely supported' },
        { range: '3-4', descriptor: 'Evaluation limited or generic; conclusion only partly supported by the discussion' },
        { range: '1-2', descriptor: 'Little or no evaluation; conclusion missing, unsupported or merely restates the findings' },
      ]},
      { id: 'E', name: 'Reflection', max: 4, description: 'The reflective statement on the Reflection and Progress Form (up to 500 words): decisions made, challenges, and what the student learned as a researcher', bands: [
        { range: '3-4', descriptor: 'Reflection is evaluative: explains key decisions and how thinking and approach changed, showing growth as a researcher' },
        { range: '1-2', descriptor: 'Reflection is mostly descriptive of what was done, with little evaluation of decisions or learning' },
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