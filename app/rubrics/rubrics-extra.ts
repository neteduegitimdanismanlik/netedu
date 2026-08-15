// app/rubrics/rubrics-extra.ts
//
// Rubrics that need fields the base Rubric interface does not carry:
// portfolio shape, per-instance word limits, calibration anchors, verb ladders.
// Self-contained: defines its own types so schema.ts stays untouched.
import { globalPoliticsRubricSL, globalPoliticsRubricHL } from './global-politics'
import { businessManagementRubric } from './business-management'
export interface ExtendedBand {
  range: string
  descriptor: string
}

export interface ExtendedCriterion {
  id: string
  name: string
  max: number
  description: string
  bands: ExtendedBand[]
  strands?: { id: string; label: string; bands: ExtendedBand[] }[]
  calibration?: string[]
  verbLadder?: string
}

export interface ExtendedRubric {
  id: string
  framework: string
  documentType: string
  label: string
  totalMax: number
  gradeScale: { grade: string; min: number }[]
  criteria: ExtendedCriterion[]
  guidance?: string
  weight?: number
  shape?: 'single' | 'portfolio'
  instanceCount?: number
  instanceLabel?: string
  portfolioCriteria?: ExtendedCriterion[]
  wordCount?: {
    limit: number
    unit: 'words' | 'pages'
    hard: boolean
    excluded: string[]
    included: string[]
    perInstance?: boolean
  }
}

export const extraRubrics: ExtendedRubric[] = [
  globalPoliticsRubricSL,
  globalPoliticsRubricHL,
  businessManagementRubric,
  {
    id: 'ib-ia-psychology',
    framework: 'IB',
    documentType: 'Internal Assessment',
    label: 'IB — Internal Assessment (Psychology)',
    totalMax: 24,
    weight: 25,
    // DOGRULANMADI: IB does not publish grade boundaries for the IA alone.
    gradeScale: [
      { grade: '7', min: 20 },
      { grade: '6', min: 17 },
      { grade: '5', min: 14 },
      { grade: '4', min: 11 },
      { grade: '3', min: 8 },
      { grade: '2', min: 5 },
      { grade: '1', min: 0 },
    ],
    criteria: [
      {
        id: 'A',
        name: 'Introduction',
        max: 6,
        description: 'How the research problem, the published research behind it and the aim are set up',
        verbLadder: 'psych',
        bands: [
          { range: '5-6', descriptor: 'The problem is explained rather than stated, at least two published studies are used and their link to the proposal is made explicit, and the aim names the population and the variables' },
          { range: '3-4', descriptor: 'The problem is described, published research is present but its relevance is asserted rather than argued, and the aim is stated but leaves the population or a variable open' },
          { range: '1-2', descriptor: 'The problem is identified only, research is listed without connection, or the aim is too broad to design against' },
        ],
        calibration: [
          'Top band: two published studies are not merely summarised; the gap the proposal fills is argued explicitly, and the aim carries both the population and the variables.',
          'Middle band: studies are present but linked only by saying they are relevant to the topic; the aim leaves one variable open.',
          'Low band: the topic is named, research is listed, and the aim is as broad as stress in teenagers.',
        ],
      },
      {
        id: 'B',
        name: 'Exploration',
        max: 6,
        description: 'How the chosen method, sampling and procedure are justified',
        verbLadder: 'psych',
        bands: [
          { range: '5-6', descriptor: 'The method is justified against the aim rather than merely named, the sampling technique fits the population and its limits are acknowledged, and the procedure is complete enough to run' },
          { range: '3-4', descriptor: 'The method is described and mostly appropriate, sampling is named without justification, and the procedure leaves decisions to the reader' },
          { range: '1-2', descriptor: 'The method is stated, sampling is unexplained, and the procedure could not be followed' },
        ],
        calibration: [
          'Top band: one of the four methods is chosen and the text says why this one and not another; the sampling technique fits the population and its limits are known.',
          'Middle band: the method is right but unjustified, such as naming convenience sampling with no reason given.',
          'Low band: the method is named and the procedure is too incomplete to run.',
        ],
      },
      {
        id: 'C',
        name: 'Analysis',
        max: 6,
        description: 'How the proposed data would be handled and what could be claimed from it',
        verbLadder: 'psych',
        bands: [
          { range: '5-6', descriptor: 'The planned treatment of the data fits the method and the aim, and the limits of what could be claimed are discussed rather than assumed' },
          { range: '3-4', descriptor: 'A treatment is described and broadly fits, but what the results could and could not show is left implicit' },
          { range: '1-2', descriptor: 'The treatment is stated with no link to the aim' },
        ],
        calibration: [
          'Top band: thematic analysis steps for a qualitative design, or the named test and why that test for a quantitative one; what the result could not prove is also written.',
          'Middle band: an analysis method is present but not linked back to the aim.',
          'Low band: the text says only that the data will be analysed.',
        ],
      },
      {
        id: 'D',
        name: 'Evaluation',
        max: 6,
        description: 'How the proposal reflects on its own limitations, ethics and researcher bias',
        verbLadder: 'linkage',
        bands: [
          { range: '5-6', descriptor: 'Limitations are tied to the specific design rather than listed generically, ethical considerations are connected to the actual participants and procedure, and researcher bias is discussed as an effect on this study' },
          { range: '3-4', descriptor: 'Limitations and ethics are described but stay at the level of any study of this type, and bias is named without being traced through' },
          { range: '1-2', descriptor: 'Limitations, ethics or bias are stated only' },
        ],
        calibration: [
          'Top band: every limitation is tied to a feature of this design; the ethics points are specific to this participant group; the effect of researcher bias on this particular study is discussed.',
          'Middle band: limitations are correct but would apply to any study of the type; bias is named but not traced.',
          'Low band: single-line statements such as saying ethical consent will be obtained.',
        ],
      },
    ],
    wordCount: {
      limit: 2200,
      unit: 'words',
      hard: true,
      excluded: ['bibliography', 'appendices', 'title page'],
      included: [],
    },
    guidance: 'This is a research PROPOSAL. The study is not carried out, so feasibility is not marked. A design that could not realistically be run is not penalised for that alone.',
  },
  {
    id: 'ib-ia-economics',
    framework: 'IB',
    documentType: 'Internal Assessment',
    label: 'IB — Internal Assessment (Economics)',
    shape: 'portfolio',
    instanceCount: 3,
    instanceLabel: 'commentary',
    // One commentary is marked out of 14. The full portfolio is (14 x 3) + 3 = 45.
    // The checker marks ONE commentary at a time, so totalMax is the single-piece ceiling.
    totalMax: 14,
    weight: 30,
    // DOGRULANMADI: IB does not publish grade boundaries for the IA alone.
    gradeScale: [
      { grade: '7', min: 12 },
      { grade: '6', min: 10 },
      { grade: '5', min: 8 },
      { grade: '4', min: 6 },
      { grade: '3', min: 4 },
      { grade: '2', min: 2 },
      { grade: '1', min: 0 },
    ],
    criteria: [
      {
        id: 'A',
        name: 'Diagrams',
        max: 3,
        description: 'Whether diagrams are correct, relevant and explained in the text',
        verbLadder: 'quality',
        bands: [
          { range: '3', descriptor: 'Diagrams are relevant, fully and correctly labelled, and explained step by step in the body so the reader follows the movement' },
          { range: '2', descriptor: 'Diagrams are relevant and mostly correct but the explanation is partial, or a label is missing or wrong' },
          { range: '1', descriptor: 'Diagrams appear but are not explained, or contain errors that undermine the point' },
        ],
        calibration: [
          'Full marks: axes, curves and shifts are labelled, and the body walks through the movement rather than gesturing at it.',
          'Middle: the diagram is correct but the text only says it is shown above.',
          'Low: a diagram appears unexplained, or a labelling error undermines the point.',
        ],
      },
      {
        id: 'B',
        name: 'Terminology',
        max: 2,
        description: 'Whether economic terms are used accurately and consistently',
        verbLadder: 'quality',
        bands: [
          { range: '2', descriptor: 'Terms are used accurately throughout and defined where the argument depends on them' },
          { range: '1', descriptor: 'Terms are mostly appropriate but some are loose or undefined where it matters' },
        ],
        calibration: [
          'Full marks: terms are precise and consistent, and the term the argument rests on is defined.',
          'Low: everyday language blurs into economic vocabulary, or a key term is left undefined.',
        ],
      },
      {
        id: 'C',
        name: 'Application and analysis',
        max: 3,
        description: 'Whether economic theory is applied to the article rather than described alongside it',
        verbLadder: 'quality',
        bands: [
          { range: '3', descriptor: 'Theory is applied to the specifics of this article and the chain of reasoning runs from the event to its economic consequence' },
          { range: '2', descriptor: 'Theory is applied but stays general, or the chain breaks before reaching a consequence' },
          { range: '1', descriptor: 'Theory is described next to a summary of the article rather than applied to it' },
        ],
        calibration: [
          'Full marks: the specific event in the article is connected to theory and the chain runs all the way to a consequence.',
          'Middle: the theory is correct but stays general rather than specific to this article.',
          'Low: an article summary followed by a textbook passage, with nothing joining them.',
        ],
      },
      {
        id: 'D',
        name: 'Key concept',
        max: 3,
        description: 'Whether the chosen key concept genuinely organises the commentary',
        verbLadder: 'quality',
        bands: [
          { range: '3', descriptor: 'The key concept runs through the commentary and shapes what is discussed, not just named at the start' },
          { range: '2', descriptor: 'The key concept is present and relevant but sits alongside the analysis rather than driving it' },
          { range: '1', descriptor: 'The key concept is named only' },
        ],
        calibration: [
          'Full marks: the concept is chosen early and determines what the commentary discusses; the conclusion returns to it.',
          'Middle: the concept is relevant but the analysis would read the same without it.',
          'Low: the concept appears only in the title block.',
        ],
      },
      {
        id: 'E',
        name: 'Evaluation',
        max: 3,
        description: 'Whether judgements are made and supported rather than asserted',
        verbLadder: 'quality',
        bands: [
          { range: '3', descriptor: 'Judgements are reasoned, consider more than one side, and rest on the analysis already made' },
          { range: '2', descriptor: 'Evaluation is present but one-sided, or asserted without support from the analysis' },
          { range: '1', descriptor: 'Evaluative words appear without reasoning behind them' },
        ],
        calibration: [
          'Full marks: short and long run, different stakeholders, or assumptions questioned; the judgement rests on the analysis.',
          'Middle: one-sided evaluation covering only the upside or only the downside.',
          'Low: a claim that a policy will be effective, with no reasoning.',
        ],
      },
    ],
    portfolioCriteria: [
      {
        id: 'F',
        name: 'Rubric requirements',
        max: 3,
        description: 'Whether the three commentaries together meet the formal requirements',
        verbLadder: 'quality',
        bands: [
          { range: '3', descriptor: 'All formal requirements are met across the three commentaries: different units, different sources, articles within the age limit, word limits respected, title blocks complete' },
          { range: '2', descriptor: 'One requirement is missed' },
          { range: '1', descriptor: 'More than one requirement is missed' },
        ],
        calibration: [
          'Full marks: three commentaries from three different syllabus units, three different sources, all articles within the age limit.',
          'Middle: two commentaries share a source, or one article is older than the limit.',
        ],
      },
    ],
    wordCount: {
      limit: 800,
      unit: 'words',
      hard: true,
      perInstance: true,
      excluded: ['diagrams', 'title block', 'bibliography'],
      included: ['definitions of terms', 'quotations'],
    },
    guidance: 'The IA is a portfolio of three commentaries. This checker marks ONE commentary at a time out of 14. The portfolio total is (14 x 3) + 3 = 45, where the extra 3 come from criterion F applied once to all three together.',
  },
]