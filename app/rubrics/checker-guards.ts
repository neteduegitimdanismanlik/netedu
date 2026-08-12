// app/rubrics/checker-guards.ts
//
// Marking behaviour that is NOT rubric text: how to apply the bands, what the
// model reliably gets wrong, and what separates the top band from the middle.
// DATA, NOT CODE — adding a subject means adding entries, not changing logic.
//
// Sources: IB subject guides + TSM + officially assessed student work with
// moderator commentary. IB sentences are never reproduced; these are our own
// statements of the facts and thresholds.

export interface ModelPitfall {
  id: string
  severity: 'critical' | 'high' | 'medium'
  /** The wrong thing the model is likely to assume. */
  claim: string
  /** What the source actually says. */
  reality: string
  /** How to spot the mistake in output. */
  detector: string
  /** Empty = applies to every subject on this rubric. */
  subjects?: string[]
}

export interface SixVersusFour {
  criterionId: string
  six: string
  four: string
  /** What the student must change to move up. */
  movingLine: string
}

export interface MarkingModel {
  rubricId: string
  /** How the criterion mark is decided from the strands. */
  bestFit: string[]
  zeroRules: string[]
  distributionFacts?: string[]
  sixVersusFour: SixVersusFour[]
  pitfalls: ModelPitfall[]
}

/* ------------------------------------------------------------------ */
/* IB Sciences — shared by Biology, Chemistry, Physics                  */
/* ------------------------------------------------------------------ */

const IB_SCIENCES_MARKING: MarkingModel = {
  rubricId: 'ib-ia-sciences',

  bestFit: [
    'The criterion mark is a holistic best-fit judgement, never the arithmetic mean of the strands. In the assessed samples one strand scored zero while the criterion still resolved to 2, and another report had two strands at 3-4 and one at 1-2 yet the criterion came out 3.',
    'Not every statement in a band has to be met. Where a band spans two marks, award the upper mark when the qualities are met strongly and the lower mark when they are met weakly.',
    'Only whole marks. Never produce a decimal.',
    'Mark positively: credit what the student did, not what they failed to do.',
    'Criteria are independent. A report can score 6 on one criterion and 2 on another, and in the samples it did.',
    'The top band does not mean flawless. It means depth across the strands.',
    'Evidence for one criterion may be scattered across the report. Students are not expected to answer the criteria in order, and a missing heading is not a missing criterion.',
  ],

  zeroRules: [
    'Zero for the whole criterion only when there is no evidence at all, or the response is wholly irrelevant or incomprehensible. This is rare.',
    'If a single strand is never addressed, that strand is zero — but if the other strands sit in upper bands, the criterion mark must still reflect what the student achieved. Do not apply a hard ceiling for one missing strand.',
  ],

  distributionFacts: [
    'Across seven officially assessed physics samples the totals were 11, 15, 16, 17, 19, 21 and 24 out of 24.',
    'Evaluation is the choke point: six of seven samples scored 4 or below (2, 2, 3, 3, 3, 4, 6). It has by far the lowest average of the four criteria.',
    'Conclusion is the most generous: five of seven scored 5 or 6.',
    'Research design clustered at 3-5; only one sample reached 6.',
    'One sample was a database study (15/24) and one a simulation (17/24). Neither was capped for its method — their losses came from Research design and Evaluation.',
  ],

  sixVersusFour: [
    {
      criterionId: 'A',
      six: 'Context narrows to the relationship between the two chosen variables and the limits of the system; every methodological decision — range, interval, number of repeats, control method, choice of instrument — carries its reason; a reader can rebuild the investigation after one reading.',
      four: 'Context is correct but general, like a textbook summary of the topic; the method is described but not justified; reproducing it requires the reader to fill in gaps and guess several details.',
      movingLine: 'Test every number in the method with "why this value" and put the answer in the text. Cut any background paragraph that steps outside the chosen pair of variables. State which instrument measured each quantity and how it was read.',
    },
    {
      criterionId: 'B',
      six: 'Communication is both clear and precise: the processing chain is followable at a glance and units, decimal places, significant figures and graph labelling are all conventionally correct; uncertainty is propagated at every stage; gradient uncertainty comes from max/min lines; every processing step targets the research question.',
      four: 'Communication is clear or precise but not both — either the processing follows but conventions are inconsistent, or conventions are right but the chain cannot be traced. Uncertainty is considered but with notable gaps: absent from some columns, conceptually wrong in others.',
      movingLine: 'Treat uncertainty as a chain, not a result: state its source in every raw column, propagate it through every step, show it as bars on the graph, carry it to the gradient with max/min lines, and express the result as a range. Remove all intermediate rounding.',
    },
    {
      criterionId: 'C',
      six: 'The conclusion is derived from the processed data including its uncertainty range; the relationship is named with the correct mathematical term; whether the experimental range contains the accepted value is stated explicitly; the accepted value is either traceably referenced or its absence is justified.',
      four: 'The conclusion is relevant and stated but does not fully match the analysis — usually because the uncertainty range never enters it; comparison with scientific context exists but is superficial, naming a law without a numerical comparison.',
      movingLine: 'Write the result as value ± range, then say in one sentence whether that range contains the accepted value. If it does not, do not hide it — discussing why raises the mark rather than lowering it. Naming a law is not a comparison.',
    },
    {
      criterionId: 'D',
      six: 'Weaknesses are specific to this investigation and each one is explained in terms of the direction and size of its effect on the result; limitations are treated separately from weaknesses (data range, boundaries of the system, validity of assumptions); each improvement maps onto a named weakness and is realistic in a school setting.',
      four: 'Weaknesses are specific and identified but almost all procedural, and their effects are not written down; improvements are relevant but brief; there is no evaluation of the method as a whole and no discussion of limitations.',
      movingLine: 'Add one sentence behind every weakness: this pushed the result in this direction by roughly this much. Alongside the procedural complaints put at least one question about the method as a whole and one boundary of validity. If the graph shows a systematic offset, name its direction and a possible physical cause.',
    },
  ],

  pitfalls: [
    {
      id: 'five-criterion-legacy',
      severity: 'critical',
      claim: 'The sciences IA has five criteria: Personal engagement, Exploration, Analysis, Evaluation and Communication.',
      reality: 'That is the pre-2025 rubric. From first assessment 2025 there are four criteria — Research design, Data analysis, Conclusion, Evaluation — each out of 6 and each worth a quarter of the total 24. Personal engagement is not assessed. Communication is not a separate criterion; it is embedded in all four.',
      detector: 'Output names personal engagement, exploration or communication as a criterion, or produces a criterion out of anything other than 6.',
    },
    {
      id: 'best-fit-is-arithmetic',
      severity: 'high',
      claim: 'The criterion mark is the average of the strand marks, and a band cannot be awarded unless every statement in it is met.',
      reality: 'The criterion mark is a holistic best-fit decision. Not every statement in a band needs to be met. In the samples a criterion resolved to 2 with one strand at zero, and to 3 with two strands at 3-4 and one at 1-2.',
      detector: 'Output averages strand marks, produces a decimal, or says a band cannot be given because one statement is unmet.',
    },
    {
      id: 'criterion-a-measures-design-quality',
      severity: 'high',
      claim: 'Research design measures how good the experiment is; a clever setup earns a high mark.',
      reality: 'It measures how effectively the methodology is COMMUNICATED. Assessment rests only on what is written. A well-designed but poorly described experiment scores low; a classic but completely described one scores high — the 6/6 sample was a standard spring experiment.',
      detector: 'The justification uses "the experiment is not original" or "the setup is too simple" to lower criterion A.',
    },
    {
      id: 'communication-scored-separately',
      severity: 'high',
      claim: 'Language, style, spelling and layout are marked, under communication or academic register.',
      reality: 'Effective communication is embedded in the four criteria, not marked separately. Expression errors matter only when they create ambiguity, contradiction or incomprehensibility. Passive or first-person voice makes no difference; prose and recipe-style methods are equally acceptable. Most candidates are not writing in their first language.',
      detector: 'Feedback offers grammar, register or "use formal language" advice as a reason for a mark.',
    },
    {
      id: 'ib-mandates-report-structure',
      severity: 'high',
      claim: 'There is a required report template: Introduction, Hypothesis, Variables, Method, Results, Discussion, Evaluation in that order.',
      reality: 'Structure is entirely the student\'s responsibility; the IB imposes no template. Evidence for one criterion may be spread across the report and students are not expected to respond to criteria linearly. No cover page or contents page is required.',
      detector: 'Output deducts for missing headings, says the work does not follow the standard IA structure, or looks for evidence only under an expected heading.',
    },
    {
      id: 'simulation-database-capped',
      severity: 'high',
      claim: 'Simulations and database studies are worth less than real lab work and cannot reach the top band.',
      reality: 'Lab work, fieldwork, spreadsheet modelling, database analysis and simulation are equally valid, alone or combined. In the samples the simulation scored 17/24 and the database study 15/24; their losses came from context and evaluation, not method type. The simulation scored 6 on Conclusion.',
      detector: 'Output says "you should do a real experiment", "a simulation cannot reach the top band", or treats database work as inherently weaker.',
    },
    {
      id: 'evaluation-equals-limitations-list',
      severity: 'high',
      claim: 'Listing weaknesses and improvements is enough for Evaluation; the longer the list, the higher the mark.',
      reality: 'Listing is the 1-2 band. Identifying specific weaknesses is 3-4. Explaining the relative impact of those weaknesses is 5-6. Weakness and limitation are also different: a limitation is how far the conclusion holds, given the data range, the boundaries of the system or the validity of the assumptions.',
      detector: 'Output treats item count as a signal, does not look for an impact statement, or responds warmly to generic limitations like "human reaction time" or "we should have taken more measurements".',
    },
    {
      id: 'sl-hl-difference',
      severity: 'medium',
      claim: 'HL students are expected to produce more data, more advanced mathematics, or beyond-syllabus content.',
      reality: 'The IA requirement is identical at SL and HL: same four criteria, same 24 marks, same 3,000 words, same 10 hours, same 20% weighting. Beyond-syllabus topics are open to both. The rubric contains no level distinction at all.',
      detector: 'Output asks for the level and adjusts expectations, or says something is "not enough for HL".',
    },
    {
      id: 'unique-topic-required',
      severity: 'medium',
      claim: 'The research question must be original; verifying a known law scores poorly.',
      reality: 'The question must be the student\'s own, not new to science. Going beyond the syllabus is not required. The 24/24 sample verified a known law of oscillation and the 19/24 sample was a classic sonometer experiment. A familiar topic raises expectations — it leaves no excuse for vague context or generic evaluation — but it imposes no ceiling.',
      detector: 'Output says the topic is too classic and should be changed, or presents originality as a marking criterion.',
    },
    {
      id: 'citations-always-required',
      severity: 'medium',
      claim: 'Every claim needs a citation, and a long bibliography earns marks under Conclusion.',
      reality: 'Widely accepted laws and theories need no citation; a specific numerical value quoted from elsewhere does. Sources must be limited to those actually used and must be traceable. In one sample the bibliography was full but nothing in the text referred to it, and that strand nearly scored zero. A gradient value produced by the investigation itself needs no source.',
      detector: 'Output treats the number of sources as a positive signal, or asks for a citation for a result the investigation produced.',
    },
    {
      id: 'appendix-counts',
      severity: 'medium',
      claim: 'Raw data and extra calculations can go in an appendix; the examiner reads them and accepts them as evidence.',
      reality: 'Appendices are not read. The only permitted appendix is consent forms from people who took part in data collection. Full raw data is no longer required as an appendix; the report carries a sample that covers the range of the independent variable at regular intervals.',
      detector: 'Output suggests moving detail to an appendix, or treats appendix content as markable evidence.',
    },
    {
      id: 'word-count-inclusions',
      severity: 'medium',
      claim: 'The 3,000-word limit includes tables, equations, calculations and the bibliography, and overrunning carries an automatic penalty.',
      reality: 'Excluded from the count: graphs and diagrams, data tables, equations, formulas and calculations, citations of every kind, the bibliography, and headings. There is no defined penalty for overrunning; the consequence is that the examiner is not obliged to read past the limit — which usually costs the conclusion and evaluation sections that sit at the end.',
      detector: 'Output counts tables or equations towards the word limit, or invents a fixed mark deduction for overrunning.',
    },
    {
      id: 'insufficient-data-always-penalized',
      severity: 'medium',
      claim: 'Little data always means a low mark, and a fixed minimum number of measurements applies to every investigation.',
      reality: 'There is no single standard for data sufficiency; the amount depends on the nature of the investigation and the time available. An investigation looking for a trend needs at least five levels of the independent variable, exceptionally four. If insufficient data was collected through no fault of the student and the processing matches the level of the research question, the highest marks are still available — what matters is that the report shows the student is aware of the limitation. But if there is no good reason for not collecting more, Data analysis is affected.',
      detector: 'Output invents a fixed "at least N measurements" rule, or treats a small dataset as an automatic deduction.',
    },

    /* Physics-specific */
    {
      id: 'statistics-expected',
      severity: 'high',
      subjects: ['Physics'],
      claim: 'A physics IA is expected to include a t-test, chi-squared, a correlation coefficient or standard-deviation-based analysis.',
      reality: 'Physics expects uncertainty propagation, not statistical testing. Standard deviation measures scatter and does not substitute for experimental uncertainty; gradient uncertainty comes from maximum and minimum gradient lines drawn by eye against the uncertainty bars. R² does not need to appear on the graph.',
      detector: 'Output suggests a statistical test, looks for a p-value or significance, or presents standard deviation as the correct route to gradient uncertainty.',
    },
    {
      id: 'precision-overclaim',
      severity: 'medium',
      subjects: ['Physics'],
      claim: 'The number of digits an instrument displays is its uncertainty.',
      reality: 'Realistic uncertainty accounts for how the instrument is actually used. A hand-operated stopwatch cannot claim ±0.001 s; human reaction time dominates. Uncertainty carries one significant figure, two only when it begins with 1, and is written to the same decimal place as the value.',
      detector: 'Output accepts an instrument-precision claim that ignores how the reading was taken, or writes value and uncertainty to different decimal places.',
    },
  ],
}

/* ------------------------------------------------------------------ */
/* Registry                                                            */
/* ------------------------------------------------------------------ */

const MARKING_MODELS: MarkingModel[] = [IB_SCIENCES_MARKING]

export function getMarkingModel(rubricId: string): MarkingModel | undefined {
  return MARKING_MODELS.find(m => m.rubricId === rubricId)
}

/** Pitfalls that apply to this rubric, filtered to the subject in play. */
export function getPitfalls(rubricId: string, subject?: string): ModelPitfall[] {
  const model = getMarkingModel(rubricId)
  if (!model) return []
  const s = (subject || '').toLowerCase()
  return model.pitfalls.filter(
    p => !p.subjects || p.subjects.some(x => s.includes(x.toLowerCase()))
  )
}