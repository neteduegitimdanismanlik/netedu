// app/rubrics/global-politics.ts
//
// IB Global Politics — Engagement Project (IA).
// SL and HL are SEPARATE rubrics: SL is A-E out of 24, HL adds criterion F
// and totals 30. Criteria A-E are word-for-word identical at both levels, so
// they are defined once here and reused.
//
// Level is carried by the SUBJECT name ("Global Politics SL" / "Global
// Politics HL"), not by a level selector. See subject-map.ts.
//
// Source: IB Global Politics subject guide (2026, July 2024 update), TSM,
// and four marked HL samples with moderator commentary. IB sentences are
// never reproduced; this is our own statement of the facts and thresholds.
//
// NOT SHIPPED YET: TopicSeedPool (BLOCK 6) and FeedbackTemplateSet (BLOCK 7).
// Both need schema layers that do not exist. They are held for the topic-pool
// work item.

import type { ExtendedRubric, ExtendedCriterion } from './rubrics-extra'
import type { MarkingModel, ModelPitfall, SixVersusFour } from './checker-guards'
import type { TopicRuleSet, TopicRule, TopicContext } from './topic-rules'

const GP = ['Global Politics']

/* ------------------------------------------------------------------ */
/* Criteria A-E — identical at SL and HL                               */
/* ------------------------------------------------------------------ */

const GP_CRITERIA_SHARED: ExtendedCriterion[] = [
  {
    id: 'A',
    name: 'Explanation and justification',
    max: 4,
    description:
      'Whether the political issue is set out and explained, and whether the choice of engagement activities is justified against it. Three things carry the mark: identifying and explaining the issue, explaining why the project is significant and appropriate, and justifying why these particular activities were chosen.',
    verbLadder: 'engagement',
    bands: [
      { range: '0', descriptor: 'Does not reach any of the descriptors below' },
      { range: '1-2', descriptor: 'The issue is named but not opened up, significance and appropriateness are asserted rather than explained, and the engagement activities are described without their link to the issue being justified' },
      { range: '3-4', descriptor: 'The issue is both named and explained, why the project is significant and appropriate is clear, and the relevance of the engagement activities to the issue is justified' },
    ],
    calibration: [
      'Top band (4/4): the introduction says concretely how the issue appears in this particular community or locality, and then the link "so I did this activity with this organisation" is made explicitly. In the marked samples, the reports scoring 4 had a narrow focus with the activity choice derived from it.',
      'Middle band (3/4): issue and activity are both clear, but why THIS town, THIS institution is never said. In two marked samples that was the only reason 3 was awarded instead of 4.',
      'Low band (1-2/4): at the level of "migration interests me, so I visited an organisation" — the issue is left as a broad theme and the activities are listed without a reason for choosing them.',
    ],
  },
  {
    id: 'B',
    name: 'Process',
    max: 3,
    description:
      'Whether the research and engagement process is evidenced in the report as planned and joined up. Single-strand criterion — one mark per band, no upper or lower end within a band.',
    verbLadder: 'engagement',
    bands: [
      { range: '0', descriptor: 'Does not reach any of the descriptors below' },
      { range: '1', descriptor: 'Evidence of process is limited; what was done and what was read come through only in fragments' },
      { range: '2', descriptor: 'The process is adequately evidenced; the research and engagement steps can be followed' },
      { range: '3', descriptor: 'The process is well planned and integrated; preliminary research, engagement and complementary research are set up so that each feeds the next' },
    ],
    calibration: [
      'Top band (3/3): what was read BEFORE the engagement, what changed during it, and what was researched afterwards to close a specific gap are each visible separately. In the marked samples 3/3 came when the process was supported by additional sources.',
      'Middle band (2/3): how the engagement ran is clear but the research side is vague — which source was consulted and why is never stated. That was exactly why two marked samples scored 2.',
      'Low band (1/3): no trace of process beyond "I did an interview and read some things online".',
    ],
  },
  {
    id: 'C',
    name: 'Analysis and synthesis',
    max: 8,
    description:
      'Whether the political issue is analysed from the specific context of the engagement, and whether the perspectives of sources and stakeholders are brought together. Three things carry the mark: understanding and applying course concepts and content, analysing the issue, and synthesising stakeholder and source perspectives.',
    verbLadder: 'engagement',
    bands: [
      { range: '0', descriptor: 'Does not reach any of the descriptors below' },
      { range: '1-2', descriptor: 'The report is largely descriptive; references to course concepts are vague; the issue is named but not analysed; perspectives are not brought together at all' },
      { range: '3-4', descriptor: 'Analysis and synthesis are limited; grasp of course concepts and content is partial; stakeholder and source perspectives sit side by side without being related to each other' },
      { range: '5-6', descriptor: 'Analysis is adequate; concepts are used correctly but at surface level; the issue is partly analysed; perspectives are partly brought together but the connection is not clear throughout' },
      { range: '7-8', descriptor: 'Analysis is effective; concepts are understood and genuinely applied; the issue is clearly analysed; stakeholder and source perspectives are brought into contact with each other to produce a coherent reading' },
    ],
    calibration: [
      'Top band (7-8/8): every substantive claim is tied to a source or to engagement evidence; at least two stakeholders\' conflicting readings are compared in the same passage; a course concept — types of power, legitimacy, sovereignty, interdependence — is put to work explaining the issue rather than merely defined. None of the four marked samples reached this band.',
      'Middle band (5-6/8): theory, concepts, sources and synthesis are all present but shallow. Samples scoring 6/8 were marked down for "plenty of synthesis but insufficient academic sourcing for the central concept" or "some claims not justified with additional sources"; those scoring 5/8 had not deepened the course links, or claimed a stakeholder perspective that the text never showed.',
      'Low band (1-4/8): the engagement narrative keeps running while the issue stays in the background; concepts are dispatched in a single defining sentence; only one side speaks.',
    ],
  },
  {
    id: 'D',
    name: 'Evaluation and reflection',
    max: 6,
    description:
      'Whether the limits of the chosen sources and the engagement activities are weighed, and whether the project is critically evaluated as a learning experience. Three things carry the mark: evaluating the research and engagement, recognising and explaining personal position and bias, and evaluating the project as a learning experience.',
    verbLadder: 'engagement',
    bands: [
      { range: '0', descriptor: 'Does not reach any of the descriptors below' },
      { range: '1-2', descriptor: 'Evaluation and reflection are limited; research and engagement activities are not weighed; the student\'s own position and biases are not named; reflection on the learning experience is superficial' },
      { range: '3-4', descriptor: 'Evaluation and reflection are adequate; activities are partly weighed; some of the student\'s own positions and biases are named; there is reasonable reflection on the learning experience' },
      { range: '5-6', descriptor: 'Evaluation and reflection are critical; the limits of the research and the engagement are genuinely interrogated; personal position and bias are not merely named but their effect is explained; the learning experience is treated in depth' },
    ],
    calibration: [
      'Top band (5-6/6): concrete discussion of limits, of the kind "the interviewee was the organisation\'s spokesperson, so I cross-checked that answer against this source"; where and why the student\'s initial expectation turned out wrong is written down. None of the four marked samples reached this band.',
      'Middle band (3-4/6): the experience is reflected on but the lessons drawn are accepted without critical filtering, or the balance holds in the analysis and disappears in the conclusion. This was the most common band in the marked samples.',
      'Low band (1-2/6): no explicit reflection on the engagement experience, or a one-line "I learned a lot" closing.',
    ],
  },
  {
    id: 'E',
    name: 'Communication',
    max: 3,
    description:
      'Whether the organisation of the report and the clarity of expression support the reader\'s understanding. Single-strand criterion — one mark per band. This is about traceability, not grammar or style.',
    verbLadder: 'engagement',
    bands: [
      { range: '0', descriptor: 'Does not reach any of the descriptors below' },
      { range: '1', descriptor: 'Organisation and clarity are limited; the structure does not carry the reader' },
      { range: '2', descriptor: 'Organisation is adequate; the report supports understanding' },
      { range: '3', descriptor: 'Organisation is effective; the report is coherently constructed and carries the reader from start to finish' },
    ],
    calibration: [
      'Top band (3/3): each paragraph does one job, sources are shown clearly in the text, and the reader never asks "where did that come from".',
      'Middle band (2/3): the structure is sound but some claims stand unsupported — in two marked samples the reason for 2 rather than 3 was not disorganisation but unjustified claims.',
      'Low band (1/3): inconsistent paragraphing, missing citations, the argument cannot be followed.',
    ],
  },
]

const GP_CRITERION_F: ExtendedCriterion = {
  id: 'F',
  name: 'Recommendation',
  max: 6,
  description:
    'HL ONLY — a separate recommendation text addressing the political issue, grounded in evidence and embedded in the context. Three things carry the mark: whether the recommendation is supported by evidence, whether it suits the issue and the context, and whether likely consequences and obstacles are addressed.',
  verbLadder: 'engagement',
  bands: [
    { range: '0', descriptor: 'No separate recommendation text is submitted, or it does not reach any of the descriptors below' },
    { range: '1-2', descriptor: 'The recommendation is limited; its grounding is partial and barely tied to concrete evidence; it addresses the issue only in part; likely consequences and obstacles are not mentioned at all' },
    { range: '3-4', descriptor: 'The recommendation is adequate; it is supported by relevant evidence and reasonably addresses the issue in the context studied; likely consequences and obstacles are named' },
    { range: '5-6', descriptor: 'The recommendation is effective; it is well supported by relevant and specific evidence, genuinely addresses the issue within its context, and likely consequences and obstacles are explained' },
  ],
  calibration: [
    'Top band (5-6/6): the recommendation grows out of the report\'s own findings and out of what the stakeholders actually said; who would implement it and what resistance it would meet are answered. In the marked samples 5/6 went to the work whose recommendations tied directly to the engagement experience.',
    'Middle band (3-4/6): the recommendation is reasonable but could have been appended to any other report — at the level of "youth participation should be increased" or "an awareness campaign should be run". In the marked samples this generality was the only reason for 3-4.',
    'Low band (1-2/6): the recommendation is a wish; there is no evidential link and no discussion of feasibility.',
  ],
}

/* ------------------------------------------------------------------ */
/* Rubrics                                                             */
/* ------------------------------------------------------------------ */

// DOGRULANMADI: IB does not publish grade boundaries for the IA alone. Both
// scales below are in-product estimates and are marked as such in the UI.
const GP_GRADESCALE_SL: { grade: string; min: number }[] = [
  { grade: '7', min: 20 },
  { grade: '6', min: 18 },
  { grade: '5', min: 14 },
  { grade: '4', min: 11 },
  { grade: '3', min: 8 },
  { grade: '2', min: 5 },
  { grade: '1', min: 0 },
]

const GP_GRADESCALE_HL: { grade: string; min: number }[] = [
  { grade: '7', min: 25 },
  { grade: '6', min: 22 },
  { grade: '5', min: 18 },
  { grade: '4', min: 14 },
  { grade: '3', min: 10 },
  { grade: '2', min: 6 },
  { grade: '1', min: 0 },
]

const GP_WORDCOUNT_EXCLUDED = [
  'acknowledgements',
  'contents page',
  'statistical data tables',
  'figures and diagrams',
  'equations, formulas and calculations',
  'short in-text citations',
  'full references in footnotes or endnotes',
  'bibliography',
  'appendices',
]

const GP_WORDCOUNT_INCLUDED = [
  'the whole body of the report',
  'definitions of terms in the body',
  'quotations in the body',
]

export const globalPoliticsRubricSL: ExtendedRubric = {
  id: 'ib-ia-global-politics-sl',
  framework: 'IB',
  documentType: 'Internal Assessment',
  label: 'IB — Internal Assessment (Global Politics SL, Engagement Project)',
  totalMax: 24,
  weight: 30,
  gradeScale: GP_GRADESCALE_SL,
  criteria: GP_CRITERIA_SHARED,
  wordCount: {
    limit: 2000,
    unit: 'words',
    hard: true,
    excluded: GP_WORDCOUNT_EXCLUDED,
    included: GP_WORDCOUNT_INCLUDED,
  },
  guidance:
    'SL is marked out of 24 across criteria A to E. Criterion F (Recommendation) exists only at HL — do not look for a recommendation text and do not award F. The engagement project is worth 30% of the SL grade and 25 hours are allocated to it. The report is written; there is no oral component in this subject.',
}

export const globalPoliticsRubricHL: ExtendedRubric = {
  id: 'ib-ia-global-politics-hl',
  framework: 'IB',
  documentType: 'Internal Assessment',
  label: 'IB — Internal Assessment (Global Politics HL, Engagement Project)',
  totalMax: 30,
  weight: 20,
  gradeScale: GP_GRADESCALE_HL,
  criteria: [...GP_CRITERIA_SHARED, GP_CRITERION_F],
  wordCount: {
    limit: 2000,
    unit: 'words',
    hard: true,
    excluded: [...GP_WORDCOUNT_EXCLUDED, 'the HL recommendation text (it has its own separate 400-word limit)'],
    included: GP_WORDCOUNT_INCLUDED,
  },
  guidance:
    'HL is marked out of 30 across criteria A to F. There are TWO submitted texts: the report (up to 2,000 words) and a SEPARATE recommendation text (up to 400 words), which is what criterion F assesses. If the student has pasted both into one submission, expect a divider before the recommendation section. Two word counts should be declared, not one. Criteria A to E are identical to SL — HL carries no higher expectation on them. The engagement project is worth 20% of the HL grade and 35 hours are allocated to it.',
}

/* ------------------------------------------------------------------ */
/* Marking model — shared parts                                        */
/* ------------------------------------------------------------------ */

const GP_BESTFIT_SHARED = [
  'Each criterion is applied on its own; a high mark on one does not lift another and a low mark does not drag one down.',
  'Not every statement in a descriptor has to be met. Judge the balance and compensate.',
  'When caught between two descriptors, reread both and take the better fit.',
  'Where a band spans two marks, work approaching the threshold of the band above takes the upper mark. Only whole marks.',
  'Mark positively: credit what the student did.',
  'DIFFERENT: criteria B and E carry ONE mark per band (1 / 2 / 3). There is no upper-end or lower-end judgement within a band on these two — the decision is directly between three levels.',
]

const GP_ZERORULES_SHARED = [
  'Zero at criterion level: if the work does not even reach the descriptor of band 1 for that criterion, it is zero.',
  'ABSOLUTE RULE, outside best-fit — unethical work scores zero for the WHOLE component, not for one criterion. Fabricating or distorting data falls under this rule.',
  'Do NOT apply that absolute rule as a mark. If there is any sign of an ethical problem — absent consent, participants under 12, deception, breach of confidentiality, covert observation, invented data — produce no marks at all. Say the work must be reviewed with the teacher before it can be assessed, and explain which signal triggered this.',
]

const GP_DISTRIBUTION_SHARED = [
  'Totals of the four marked HL samples read: 17, 20, 23, 24 out of 30.',
  'Criterion D is the weakest: 2, 3, 3, 4 out of 6 across the four. None reached the 5-6 band. Evaluation and reflection is the number one source of lost marks in this subject.',
  'Criterion C did not reach its top band either: 5, 5, 6, 6 out of 8. "Analysis present but no depth" is the most frequent comment.',
  'Criteria B and E look like easy full marks and are not: 2 or 3 in all four. B scored 2 whenever the research process was vague; E scored 2 whenever claims were unjustified — not because of disorganisation.',
  'Criterion A scored 3 or 4 in all four. Where it was 3, the single missing element was an explanation of why that geographic or institutional focus was chosen.',
  'WARNING: these four samples have not been through IB standardisation and are stated to be replaced after first assessment in 2026. Use the distribution as a trend signal, not as a norm.',
]

const GP_SIX_VS_FOUR_SHARED: SixVersusFour[] = [
  {
    criterionId: 'A',
    subjects: GP,
    six: '4/4 — the issue is explained together with the community scale it sits at and why it is examined there; the choice of activity follows logically from that focus.',
    four: '3/4 — issue and activity are both clear, but "why this city, this institution, this country" is left unanswered.',
    movingLine: 'The justification of the focus. Not the content — the defence of the choice.',
  },
  {
    criterionId: 'B',
    subjects: GP,
    six: '3/3 — the chain of preliminary research, engagement and complementary research is visible, and each link grows out of the previous one.',
    four: '2/3 — how the engagement ran is clear, how the research was chosen is not.',
    movingLine: 'Visibility of the research side. The engagement narrative alone does not earn 3.',
  },
  {
    criterionId: 'C',
    subjects: GP,
    six: '7-8/8 — at least two stakeholders\' conflicting readings are compared in one place; a course concept is put to work explaining the issue; claims are tied to sources.',
    four: '5-6/8 — concepts are used correctly and synthesis is attempted, but the central concept is not opened up academically and some claims stand unsupported.',
    movingLine: 'The difference between defining a concept and making it do work. And: the difference between placing perspectives side by side and bringing them into contact.',
  },
  {
    criterionId: 'D',
    subjects: GP,
    six: '5-6/6 — the limits of sources and interviewees are discussed concretely; HOW the student\'s own position bent the analysis is explained.',
    four: '3-4/6 — the experience is reflected on but the lessons are accepted unquestioned; bias is named but its effect is not traced.',
    movingLine: 'The difference between "I had a bias" and "this bias affected this finding in this way". Also whether the balance survives into the conclusion.',
  },
  {
    criterionId: 'E',
    subjects: GP,
    six: '3/3 — paragraphing is consistent AND the source of every claim is visible in the text.',
    four: '2/3 — the structure is good but some claims hang in the air.',
    movingLine: 'What separates the bands here is traceability, not aesthetics.',
  },
]

const GP_SIX_VS_FOUR_F: SixVersusFour = {
  criterionId: 'F',
  subjects: GP,
  six: '5-6/6 — the recommendation grows out of the student\'s own interviews and the report\'s findings; who implements it, what it costs or where it meets resistance is discussed.',
  four: '3-4/6 — the recommendation is reasonable and relevant but could be pasted onto another report; it is not embedded in the context.',
  movingLine: 'Whether the recommendation can be traced back to the report\'s findings. General truths do not get past 4.',
}

const GP_PITFALLS_SHARED: ModelPitfall[] = [
  {
    id: 'gp-treats-as-research-report',
    severity: 'critical',
    subjects: GP,
    claim: 'This is a social science research report, so it needs variables, a sample size, a methodology section and a reliability check; marks come off when they are missing.',
    reality: 'The guide and the TSM put the weight of the task on active engagement and define the role of research as complementing the experience. The TSM says explicitly that research here is not expected to be at extended-essay scale. Sample, variable and statistics appear in no criterion.',
    detector: 'The draft feedback contains "sample", "methodology", "validity", "variable" or "n =". Regenerate without them.',
  },
  {
    id: 'gp-scores-the-experience-not-the-link',
    severity: 'critical',
    subjects: GP,
    claim: 'The more impressive or extensive the engagement, the higher the mark.',
    reality: 'The guide does not ask the student to narrate at length what they did; it asks them to analyse what that experience added to their understanding of the political issue. What criterion C rewards is not the experience itself but the joining of experience with sources. Where the engagement is large and many-parted, the guide asks the student to narrow to the parts most relevant to the issue.',
    detector: 'A high proportion of the text is engagement narrative and no course concept appears in those sections — raise a criterion C warning rather than praising an impressive engagement.',
  },
  {
    id: 'gp-penalizes-first-person',
    severity: 'high',
    subjects: GP,
    claim: 'First-person narration and personal motivation are academic weaknesses.',
    reality: 'The opposite. Criterion A asks why the project matters to the student and criterion D asks the student to name their own position and biases. All the marked samples are in the first person. The ABSENCE of the first person costs marks on D.',
    detector: 'Advice such as "use more objective language" or "avoid the first person" appears anywhere in the output.',
  },
  {
    id: 'gp-documentary-counts-as-engagement',
    severity: 'critical',
    subjects: GP,
    claim: 'Watching a documentary, following the news or reading articles online counts as engagement.',
    reality: 'The guide requires experiential learning and contact with external stakeholders; the TSM gives interviews, demonstrations, symposium or conference attendance and internships as formal examples. Reading belongs to preliminary and complementary research — it is preparation for engagement, not a substitute.',
    detector: 'There is no moment in the report where the student made physical or interactive contact with a stakeholder. Raise it as a fatal-level warning.',
  },
  {
    id: 'gp-mishandles-political-stance',
    severity: 'high',
    subjects: GP,
    claim: 'The student stating a political opinion should be penalised — or it makes no difference at all.',
    reality: 'Both are wrong. Holding a position is not penalised; concealing it is. The top band of criterion D asks for personal position and bias to be explained. What is penalised is one-sided advocacy presented as analysis and the absence of the opposing perspective — that lowers C and D together.',
    detector: 'Where the text carries explicit advocacy, check separately: for D, "is the position named"; for C, "does an opposing stakeholder speak".',
  },
  {
    id: 'gp-imports-science-verb-ladder',
    severity: 'high',
    subjects: GP,
    claim: 'The bands climb through design, data processing, uncertainty, conclusion and evaluation as in the sciences.',
    reality: 'Uncertainty, repeats, control variables and margin of error appear nowhere in this rubric. The ladder here runs description, then application, then interrogation, and the mark of the top band is not accuracy but multiple perspectives being brought into contact.',
    detector: 'Output contains "uncertainty", "control variable", "number of repeats" or "raw data table". Block it.',
  },
  {
    id: 'gp-counts-recommendation-in-report-limit',
    severity: 'medium',
    subjects: GP,
    claim: 'The HL recommendation text counts towards the 2,000-word report limit, so the submission is over length.',
    reality: 'The HL recommendation is submitted as a separate section, sits outside the report\'s 2,000 words and carries its own 400-word limit. In all four marked samples the two counts were declared separately.',
    detector: 'Look for two separate word-count declarations; if only one appears, tell the student to split them.',
  },
  {
    id: 'gp-treats-overlength-as-deduction',
    severity: 'medium',
    subjects: GP,
    claim: 'Going over the limit means a fixed number of marks is deducted.',
    reality: 'There is no deduction. Nothing past the limit is read. The practical consequence is usually that the conclusion and reflection sections at the end are cut, which collapses D and F while C partly survives.',
    detector: 'Do not write a penalty for overrunning; say which section will be cut and which criterion will collapse as a result.',
  },
  {
    id: 'gp-ignores-under-length-risk',
    severity: 'medium',
    subjects: GP,
    claim: 'A short report is concise and should be praised for it.',
    reality: 'The guide says work significantly under the limit is not expected to meet the task requirements fully and is likely to score low. All four marked samples fell between 1,987 and 2,000 words.',
    detector: 'If the report is under roughly 1,600 words, warn, and show which criterion — usually C and D — has not found room.',
  },
]

/* ------------------------------------------------------------------ */
/* Marking models — one per level                                      */
/* ------------------------------------------------------------------ */

export const globalPoliticsMarkingSL: MarkingModel = {
  rubricId: 'ib-ia-global-politics-sl',
  bestFit: [
    ...GP_BESTFIT_SHARED,
    'This candidate is SL. There are FIVE criteria, A to E, and the total is 24. Criterion F does not exist at SL — do not look for a recommendation text and do not award F.',
  ],
  zeroRules: GP_ZERORULES_SHARED,
  distributionFacts: [
    ...GP_DISTRIBUTION_SHARED,
    'No marked SL sample was available. The SL calibration is derived from the criterion descriptors and from the HL samples on criteria A to E, which are identical at both levels.',
  ],
  sixVersusFour: GP_SIX_VS_FOUR_SHARED,
  pitfalls: [
    ...GP_PITFALLS_SHARED,
    {
      id: 'gp-sl-marked-out-of-thirty',
      severity: 'high',
      subjects: GP,
      claim: 'The Global Politics IA is out of 30, so this SL report should be scored on that scale.',
      reality: 'Criterion F is HL only. The SL total is 24 across A to E. The weighting also runs the other way from intuition: SL 30%, HL 20%.',
      detector: 'Any criterion F mark, or a total expressed against 30, on an SL submission.',
    },
  ],
}

export const globalPoliticsMarkingHL: MarkingModel = {
  rubricId: 'ib-ia-global-politics-hl',
  bestFit: [
    ...GP_BESTFIT_SHARED,
    'This candidate is HL. There are SIX criteria, A to F, and the total is 30. Criterion F assesses the separate recommendation text of up to 400 words.',
    'DIFFERENT: criteria A to E are word-for-word identical at SL and HL. HL adds only F; there is no raised expectation on A to E.',
  ],
  zeroRules: [
    ...GP_ZERORULES_SHARED,
    'If no separate recommendation text is present, criterion F is zero — but only F. Do not let it pull down A to E.',
  ],
  distributionFacts: GP_DISTRIBUTION_SHARED,
  sixVersusFour: [...GP_SIX_VS_FOUR_SHARED, GP_SIX_VS_FOUR_F],
  pitfalls: [
    ...GP_PITFALLS_SHARED,
    {
      id: 'gp-hl-recommendation-not-found',
      severity: 'high',
      subjects: GP,
      claim: 'No recommendation section is visible, so the student must be SL and should be marked out of 24.',
      reality: 'This candidate is HL. A missing recommendation text is a lost criterion F, not a change of level. Score F as zero, keep the total against 30, and tell the student plainly that the separate recommendation section is required.',
      detector: 'The total is expressed against 24, or criterion F is silently omitted, on an HL submission.',
    },
  ],
}

/* ------------------------------------------------------------------ */
/* Topic rules — shared between levels                                 */
/* ------------------------------------------------------------------ */

const GP_CONTEXTS: TopicContext[] = [
  { id: 'core-power', label: 'Core: power, sovereignty, legitimacy, interdependence', hint: 'Projects framing the issue through types of power (hard and soft, structural and relational, power to / over / with) or through legitimacy.' },
  { id: 'rights-justice', label: 'Thematic study: rights and justice', hint: 'Projects on the recognition, protection and monitoring of rights claims, and on responses to violations.' },
  { id: 'development-sustainability', label: 'Thematic study: development and sustainability', hint: 'Projects touching poverty, inequality, pathways of development and sustainability debates.' },
  { id: 'peace-conflict', label: 'Thematic study: peace and conflict', hint: 'Projects on conflict dynamics, direct, structural and cultural violence, mediation and peacebuilding.' },
  { id: 'hl-challenges', label: 'Global political challenges', hint: 'Borders, environment, equality, health, identity, poverty, security, technology. The TSM offers these as starting points; SL students may use them too.' },
]

const GP_RULES: TopicRule[] = [
  {
    id: 'no-experiential-element',
    label: 'No experiential element',
    detail:
      'Fires when the plan is only to read, watch, follow the news, scan online articles or gather survey results from the internet. Phrases such as "I watched a documentary", "I listened to a podcast", "I reviewed the articles" or "I did a literature review" are the signal. This task is built on active engagement; reading is preparatory and complementary only, and never substitutes for it.',
    severity: 'fatal',
    hits: ['A', 'B', 'C', 'D'],
  },
  {
    id: 'apolitical-activity',
    label: 'The activity is not political and the issue was attached afterwards',
    detail:
      'Fires when the activity is apolitical in itself and a political issue has been stuck onto it from outside. Beach cleanups, tree planting, fundraising and handing out aid are the typical cases. The same area becomes valid once the activity takes the form of advocacy or a campaign and involves negotiation with local government — at that point a comparison between citizen activism and state responsibility becomes a real issue.',
    severity: 'fatal',
    hits: ['A', 'C'],
  },
  {
    id: 'issue-not-local-or-community',
    label: 'The issue has not been brought down to local or community scale',
    detail:
      'Fires when the student has picked an international issue — UN reform, a war, global climate negotiations — with no point of contact at local or community level. The task requires the issue to be examined locally or in a community. A global issue is not forbidden; it must have a local manifestation and a stakeholder the student can actually reach.',
    severity: 'major',
    hits: ['A', 'C'],
  },
  {
    id: 'topic-too-broad',
    label: 'The issue has been left as a theme',
    detail:
      'Fires when the title is a field name such as migration, climate change, women\'s rights or poverty. The guide asks for a concrete and sufficiently analysable political issue to be settled before the engagements begin; otherwise the activities cannot carry the issue. The issue has to come down to a single question.',
    severity: 'major',
    hits: ['A', 'C'],
  },
  {
    id: 'unsafe-setting',
    label: 'A setting carrying a safety risk',
    detail:
      'Fires when a politically tense demonstration, a polarised rally, an area with security risk, or any setting that puts the safety of the student or the participants in question is proposed. The guide\'s test is plain: if there is doubt or concern about an activity, it is probably not a suitable engagement. Where this turns into an ethical breach, the whole component is zeroed.',
    severity: 'fatal',
    hits: ['A', 'B'],
  },
  {
    id: 'minors-as-participants',
    label: 'Participants who are minors',
    detail:
      'Children under 12 cannot be participants under any circumstances. Interviews with people aged 12 to 16 require the written consent of a parent or guardian, who must be fully informed about the nature of the activity; where the activity runs in a school, the written consent of the relevant teachers is also required. Fires on plans mentioning a school, a dormitory, a children\'s centre or a youth club.',
    severity: 'fatal',
    hits: ['B'],
  },
  {
    id: 'consent-privacy-and-data',
    label: 'Consent, anonymity and data retention',
    detail:
      'Fires on covert observation, participants unaware they are being recorded, photographs taken without permission, personal data being shared, or online data not deleted after the project. Participants must be briefed, given the right to withdraw, and kept anonymous unless they explicitly ask otherwise. Exception: what interviewees say in an elected or appointed public role, or in an official role in a non-governmental organisation, may be used without their personal details.',
    severity: 'fatal',
    hits: ['B', 'D'],
  },
  {
    id: 'constrained-interviewee',
    label: 'An interviewee who cannot speak freely',
    detail:
      'Fires where the interviewee is under pressure, in a relationship of dependency, or otherwise not in a position to answer freely. The guide asks that research not be conducted with such people, and that where there is any such doubt the primary data be complemented with other sources or alternative engagements.',
    severity: 'major',
    hits: ['B', 'C', 'D'],
  },
  {
    id: 'family-as-source',
    label: 'A family member as a source',
    detail:
      'Fires when the student plans to use a parent, relative or close family circle as an interviewee. The guide does not recommend it; where it happens anyway, it must be declared explicitly in the report. Failing to declare it is a problem both ethically and for criterion D.',
    severity: 'minor',
    hits: ['B', 'D'],
  },
  {
    id: 'single-perspective-design',
    label: 'Only one stakeholder perspective has been designed in',
    detail:
      'Fires when the plan involves contact with only one institution, one side, or one interest group. Criterion C explicitly rewards the synthesis of stakeholder and source perspectives; where only one voice exists there is nothing to synthesise. At least two stakeholders in different positions must be targeted at the design stage.',
    severity: 'major',
    hits: ['C', 'D'],
  },
  {
    id: 'host-framing-adopted',
    label: 'The host organisation\'s framing has been adopted unquestioned',
    detail:
      'Fires when the student is volunteering with an NGO, an association, a municipal unit or a campaign. The organisation\'s own narrative is ready-made, coherent and persuasive, and the report can mistake it for analysis. The guide says the view gained through engagement is partial and limited, and that the job of the research is to establish what other views are possible.',
    severity: 'major',
    hits: ['C', 'D'],
  },
  {
    id: 'no-course-concept-anchor',
    label: 'No anchor to a course concept',
    detail:
      'Fires when the chosen issue and activity connect naturally to none of the core concepts — power, sovereignty, legitimacy, interdependence — nor to the prescribed content of the thematic studies. Tying the project to a particular unit is not required, but the analysis showing knowledge of course content and concepts is a condition of criterion C.',
    severity: 'major',
    hits: ['C'],
  },
  {
    id: 'duplicate-of-ee-or-other-component',
    label: 'The same work used in another component',
    detail:
      'The same work cannot be submitted as both the engagement project and the extended essay. Working in the same subject area is not forbidden; submitting the same work is. Overlap with CAS is a separate matter — sources may be shared, but the IA report must be independent and the student\'s own.',
    severity: 'fatal',
    hits: ['A', 'B'],
  },
  {
    id: 'group-work-without-differentiation',
    label: 'Shared engagement, undifferentiated project',
    detail:
      'Fires when more than one student attends the same organisation or the same activity. The guide explicitly permits this and may even recommend it so as not to exhaust community resources. But each student\'s individual contribution must be distinct, must carry its own focus — a different political issue or a different engagement role — and the report must be entirely individual, including the primary sources it produces.',
    severity: 'major',
    hits: ['A', 'B', 'E'],
  },
  {
    id: 'advocacy-without-declared-position',
    label: 'Undeclared advocacy',
    detail:
      'Fires when the student\'s political position saturates the text but is named nowhere. Holding a position is not the problem; criterion D already asks for personal position and bias to be explained. The problem is one-sided advocacy presented as neutral analysis — that lowers both C and D.',
    severity: 'major',
    hits: ['C', 'D'],
  },
  {
    id: 'fabricated-or-altered-evidence',
    label: 'Fabricated or altered evidence',
    detail:
      'Writing up an interview that never happened, inventing quotations, generating survey results or altering evidence of engagement. The guide directly prohibits fabricating or distorting data; unethical work results in the whole component being zeroed.',
    severity: 'fatal',
    hits: ['A', 'B', 'C', 'D', 'E'],
  },
]

const GP_TITLE_GUIDANCE = [
  'The title should be a question. The TSM recommends formulating an initial question tightly bound to the issue and refining it as the process runs.',
  'The question should be evaluative rather than descriptive: not "what is happening" but "to what extent", "how effectively", "in whose interest". All four marked samples were written as evaluative questions.',
  'The title should carry the geographic or institutional focus of the issue — which community, which institution, which locality. This is exactly what separates 4/4 from 3/4 on criterion A.',
  'The form of engagement need not appear in the title, but the issue it points to must be one the student can actually make contact with. Answer "who could I ask this" before writing the title.',
  'If a single concept is placed at the centre of the title, that concept must be opened up academically in the report. One marked sample scored 6 rather than 8 on C for not supporting its central concept with enough academic sources.',
]

const GP_DATA_GUIDANCE = [
  'Primary evidence comes from the engagement itself: interview transcripts or quotations, survey responses, photographs, meeting notes, field observation records.',
  'Secondary sources will predominate and that is normal — most of the primary research is already inside the engagement. Newspapers, magazines, academic articles, books, carefully chosen web sources and audiovisual material are all legitimate.',
  'Primary sources that matter to the discussion should be attached as appendices. Appendices do not count towards the word limit.',
  'The research should not be at extended-essay scale. The TSM puts the weight of the task on active engagement and gives research the role of deepening understanding of the issue.',
  'The real job of the research is to create balance: the view from the engagement is partial and limited, and the research establishes what other views are possible and where each is strong and weak. The synthesis strand of criterion C feeds from here.',
  'In-text citation and a bibliography in a recognised academic style are required. The most common reason for 2 rather than 3 on criterion E is not disorganisation but unjustified claims.',
  'The word count must be declared as part of the report. At HL two separate figures are given: the report and the recommendation.',
  'Data gathered online must be deleted once the research is finished and used only for this project.',
]

const GP_SCOPE_NOTE =
  'The engagement project examines a political issue at local or community level, through active engagement together with complementary research. Choosing a topic is not enough on its own: the issue and the form of engagement are chosen together and constrain each other. Tying the issue to a particular part of the syllabus is not required, but the analysis must show knowledge of course content and key concepts. The teacher must approve both the issue and the activities before any formal contact is made with external stakeholders — the guide treats this as the precondition for access to all mark levels.'

export const globalPoliticsRulesSL: TopicRuleSet = {
  rubricId: 'ib-ia-global-politics-sl',
  label: 'IB Global Politics IA — SL (Engagement Project)',
  contexts: GP_CONTEXTS,
  rules: GP_RULES,
  titleGuidance: GP_TITLE_GUIDANCE,
  dataGuidance: GP_DATA_GUIDANCE,
  scopeNote: GP_SCOPE_NOTE + ' At SL the project is marked out of 24 across criteria A to E, is worth 30% of the grade, and 25 hours are allocated to it.',
}

export const globalPoliticsRulesHL: TopicRuleSet = {
  rubricId: 'ib-ia-global-politics-hl',
  label: 'IB Global Politics IA — HL (Engagement Project)',
  contexts: GP_CONTEXTS,
  rules: GP_RULES,
  titleGuidance: GP_TITLE_GUIDANCE,
  dataGuidance: GP_DATA_GUIDANCE,
  scopeNote: GP_SCOPE_NOTE + ' At HL the project is marked out of 30 across criteria A to F, is worth 20% of the grade, and 35 hours are allocated to it. A separate recommendation text of up to 400 words is submitted alongside the report.',
}