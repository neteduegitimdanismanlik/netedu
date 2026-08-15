// app/rubrics/checker-guards.ts
//
// Marking behaviour that is NOT rubric text: how to apply the bands, what the
// model reliably gets wrong, and what separates the top band from the middle.
// DATA, NOT CODE — adding a subject means adding entries, not changing logic.
//
// Sources: IB subject guides + TSM + officially assessed student work with
// moderator commentary. IB sentences are never reproduced; these are our own
// statements of the facts and thresholds.
import { globalPoliticsMarkingSL, globalPoliticsMarkingHL } from './global-politics'
import { businessManagementMarking } from './business-management'
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
  /** Empty = applies to every subject on this rubric. */
  subjects?: string[]
}

export interface HardCeiling {
  /** The condition, written so the model can test it against the work. */
  when: string
  criterionId: string
  /** The mark this condition caps the criterion at. */
  max: number
  why: string
  /** 'instance' caps one piece; 'portfolio' caps the whole submission. */
  scope?: 'instance' | 'portfolio'
}

export interface MarkingModel {
  rubricId: string
  bestFit: string[]
  zeroRules: string[]
  /** Rule-based caps applied BEFORE best-fit. Empty for pure best-fit subjects. */
  hardCeilings?: HardCeiling[]
  /** Caps that bind a single strand, leaving the criterion free to best-fit above. */
  strandCeilings?: HardCeiling[]
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
    'A single misstatement in an otherwise consistent report is a slip, not a band-defining error. In the assessed samples a report that once described the relationship incorrectly still scored 6 on Conclusion because the derivation, the graph and the rest of the text were coherent. Ask whether the error runs through the work or appears once.',
  ],

  zeroRules: [
    'Zero for the whole criterion only when there is no evidence at all, or the response is wholly irrelevant or incomprehensible. This is rare.',
    'If a single strand is never addressed, that strand is zero — but if the other strands sit in upper bands, the criterion mark must still reflect what the student achieved. Do not apply a hard ceiling for one missing strand.',
  ],

  distributionFacts: [
    'Across seven officially assessed physics samples the totals were 11, 15, 16, 17, 19, 21 and 24 out of 24.',
    'Evaluation is the choke point: six of seven samples scored 4 or below. It has by far the lowest average of the four criteria.',
    'Conclusion is the most generous: five of seven scored 5 or 6.',
    'Research design clustered at 3-5; only one sample reached 6.',
    'One sample was a database study and one a simulation. Neither was capped for its method — their losses came from Research design and Evaluation.',
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
      six: 'Communication is both clear and precise: the processing chain is followable at a glance and units, decimal places, significant figures and graph labelling are all conventionally correct; uncertainty is propagated at every stage; every processing step targets the research question.',
      four: 'Communication is clear or precise but not both — either the processing follows but conventions are inconsistent, or conventions are right but the chain cannot be traced. Uncertainty is considered but with notable gaps: absent from some columns, conceptually wrong in others.',
      movingLine: 'Treat uncertainty as a chain, not a result: state its source in every raw column, propagate it through every step, show it on the graph, carry it to the gradient, and express the result as a range. Remove all intermediate rounding.',
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
      movingLine: 'Add one sentence behind every weakness: this pushed the result in this direction by roughly this much. Alongside the procedural complaints put at least one question about the method as a whole and one boundary of validity.',
    },
    {
      criterionId: 'B',
      subjects: ['Chemistry'],
      six: 'Decimal places are consistent between raw data, stated precision and processed values; outliers are named even when kept; uncertainty is attacked from two or more routes.',
      four: 'Precise but not clear, or clear but not precise; propagation is present but with inaccuracies; outliers are unidentified or silently dropped.',
      movingLine: 'What separates the bands here is whether outliers are identified and any exclusion justified — not whether error bars or statistics appear. With sample sizes typically under 15, a silently dropped point is highly visible; present the result with and without it.',
    },
    {
      criterionId: 'D',
      subjects: ['Chemistry'],
      six: 'Weaknesses are ranked by impact with the direction of systematic error tied to the feature that caused it; improvements made during design are credited; infeasible fixes are named as infeasible.',
      four: 'Weaknesses are specific and described, but the significant ones should have been solved at the design stage.',
      movingLine: 'The question is whether the classic technique limitation was designed around before it is discussed. Naming heat loss after working in an open uninsulated vessel, or an uncalibrated meter after using one, earns nothing.',
    },
    {
      criterionId: 'B',
      subjects: ['Biology'],
      six: 'Means and dispersion are calculated, a realistic trend line is fitted before R² is read, an appropriate correlation coefficient or significance test is applied and its choice justified, and the bar type on every graph is named in the title.',
      four: 'Means and standard deviations are calculated and the graphing is appropriate, but no trend line, no R² and no significance test appear — processing stops at description.',
      movingLine: 'Add the inferential step the data already supports, and say in one sentence why that test fits this question shape rather than another.',
    },
    {
      criterionId: 'C',
      subjects: ['Biology'],
      six: 'The statistic is interpreted for what it actually means, its uncertainty is carried into the strength of the claim, and published biological mechanism is used to explain why the result came out this way.',
      four: 'The trend is read correctly and the question is answered, but the scientific context is general background rather than mechanism specific to the organism, enzyme or system studied.',
      movingLine: 'Cite a source addressing the specific mechanism, not the general phenomenon, and use it to explain the direction and size of your result.',
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
      reality: 'There is no single standard for data sufficiency; the amount depends on the nature of the investigation and the time available. An investigation looking for a trend needs at least five levels of the independent variable, exceptionally four. If insufficient data was collected through no fault of the student and the processing matches the level of the research question, the highest marks are still available — what matters is that the report shows the student is aware of the limitation.',
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

    /* Chemistry-specific */
    {
      id: 'sig-figs-expected',
      severity: 'high',
      subjects: ['Chemistry'],
      claim: 'Significant-figure discipline is part of precise communication and its absence is a defect.',
      reality: 'Significant-figure conventions are not expected in this subject. Consistent decimal places matched to instrument precision are what is assessed; significant figures are judged only when the student chooses to use them.',
      detector: 'Feedback flags significant-figure inconsistency, or recommends rounding to a stated number of significant figures, on a report whose decimal places are already consistent.',
    },
    {
      id: 'statistics-rewarded',
      severity: 'high',
      subjects: ['Chemistry'],
      claim: 'A t-test, ANOVA or correlation test strengthens the analysis and should be suggested.',
      reality: 'Statistical testing is discouraged in this subject and merely tolerated when well executed. Standard deviation is unjustified below n=5, standard error of the mean below n=30, other tests below n=10 — and a range from maximum minus minimum is explicitly acceptable instead.',
      detector: 'Feedback proposes a named statistical test, or accepts a standard deviation computed on three or four replicates without comment.',
    },
    {
      id: 'logarithmic-quantities-averaged',
      severity: 'high',
      subjects: ['Chemistry'],
      claim: 'Replicate pH or absorbance values can be averaged and propagated like any other measurement.',
      reality: 'Logarithmic quantities need separate treatment; averaging pH values directly is a case requiring special mathematical attention.',
      detector: 'Feedback credits a mean pH, or propagates an uncertainty through a logarithmic quantity by simple addition of absolutes.',
    },
    {
      id: 'uncertainty-bars-required',
      severity: 'medium',
      subjects: ['Chemistry'],
      claim: 'Graphs without error bars show inadequate consideration of uncertainty.',
      reality: 'Uncertainty bars are not required in this subject. Propagation, replicate spread, gradient bounds and comparison with theoretical values are each sufficient on their own.',
      detector: 'Any recommendation to add error bars, or a criterion B deduction whose stated reason is their absence.',
    },

    /* Biology-specific */
    {
      id: 'statistics-treated-as-optional',
      severity: 'critical',
      subjects: ['Biology'],
      claim: 'Means, standard deviation and a trend line are sufficient processing, and a significance test is a nice extra.',
      reality: 'In biology a correlation coefficient or significance test is the normal expectation for top-band processing. Graded work sitting at means-plus-SD with no trend line, no R² and no test lands in the middle band on criterion B. Do not carry the physics or chemistry stance across.',
      detector: 'Feedback praises processing as complete while no inferential statistic appears anywhere, or attaches "optional" or "if you have time" to significance testing.',
    },
    {
      id: 'wrong-test-recommended',
      severity: 'high',
      subjects: ['Biology'],
      claim: 'ANOVA or a t-test suits a question about the relationship between two continuous variables, or a correlation coefficient suits a comparison between discrete treatment groups.',
      reality: 'Test choice must follow question shape: correlational questions take Pearson or Spearman plus a significance step; group comparisons take a t-test or ANOVA with a post-hoc. A mismatched test scores worse than no test, because it produces an answer that does not address the research question.',
      detector: 'The recommended statistic and the research question shape disagree, or ANOVA is suggested with no post-hoc test named.',
    },
    {
      id: 'error-bar-type-unchallenged',
      severity: 'high',
      subjects: ['Biology'],
      claim: '"Error bars added" satisfies the uncertainty strand.',
      reality: 'The bar type must be named in the figure title and the choice justified. SD and range bars cannot support significance claims through overlap, and SEM on a small sample is indefensible.',
      detector: 'Feedback credits error bars while the report never states whether they are range, SD, SEM or 95% CI, or while overlap is used to argue significance.',
    },
    /* SEHS-specific */
    {
      id: 'sehs-read-as-biology',
      severity: 'critical',
      subjects: ['Sports Exercise'],
      claim: 'SEHS is a Group 4 subject, so human-participant expectations are an edge case as in biology and a short ethics note suffices.',
      reality: 'Human participants are the norm in SEHS. The consent form, parental consent for under-16s, physical readiness screening and risk mitigation are directly scored components of the second strand of Research design. Ingestion protocols are also entirely prohibited — biology has no such absolute ban.',
      detector: 'Feedback mentions human participants but contains none of the words consent, parental consent, screening or right to withdraw; or it treats an ingested substance as an acceptable independent variable.',
    },
    {
      id: 'small-n-auto-penalty',
      severity: 'high',
      subjects: ['Sports Exercise'],
      claim: 'Eight participants is a weak sample and lowers the Data analysis mark by itself.',
      reality: 'In SEHS a sample is typically accepted as small (n≤30) or very small (n<15). There is no single standard for data quantity; the criterion is proportionality to ten hours of work. If data was limited through no fault of the student and the processing matches what the research question needs, the highest marks remain available. The penalty comes not from small n itself but from the student failing to recognise that it limits the conclusion.',
      detector: 'The comment gives "the sample is too small" as a reason for a deduction without checking whether the student addressed the limitation in Conclusion or Evaluation.',
    },
    {
      id: 'uncertainty-propagation-imported',
      severity: 'high',
      subjects: ['Sports Exercise'],
      claim: 'Uncertainty must be propagated through physiological measurements; without propagation the second strand of Data analysis is incomplete.',
      reality: 'Propagation of uncertainties is not systematically expected in SEHS. What is expected is discussion of the reliability and variability of the data: standard deviation, range, uncertainty bars, R², significance testing. Inferential testing, by contrast, is generally expected — the opposite of the chemistry stance that statistics are discouraged.',
      detector: 'Feedback lists "uncertainty propagation", "propagation" or "errors should be combined" as a shortcoming. The correct shortcoming here is absence of an inferential test or a superficial discussion of variability.',
    },
    {
      id: 'ttest-threshold-overstated',
      severity: 'medium',
      subjects: ['Sports Exercise'],
      claim: 'There is a single minimum sample size for a t-test, below which the test is invalid.',
      reality: 'The source gives two thresholds: the mathematical tools section treats n≥5 as permitted for any data set, while the data analysis section says n<10 is generally too small and asks for at least 10 repeats for an effective t-test. This is not a contradiction but the difference between permitted and powerful. Presenting one number as an absolute threshold misleads the student; feedback should give both.',
      detector: 'The comment states "a t-test needs at least X participants" as a single figure and never mentions the validity conditions — two groups, measurement data, similar standard deviations, normal distribution.',
    },
  ],
}

/* ------------------------------------------------------------------ */
/* IB Psychology IA — research proposal                                 */
/* ------------------------------------------------------------------ */

const IB_PSYCHOLOGY_MARKING: MarkingModel = {
  rubricId: 'ib-ia-psychology',

  bestFit: [
    'The criterion mark is a holistic best-fit judgement across the strands, not an average.',
    'Only whole marks. Mark positively: credit what is there.',
    'Criteria are independent — a proposal can be strong on Introduction and weak on Evaluation.',
    'Apply the hard ceilings below BEFORE best-fit. Where a ceiling binds, best-fit operates only underneath it.',
    'Strand ceilings bind one strand only. The criterion mark can still sit above a capped strand if the other strands are stronger.',
  ],

  zeroRules: [
    'Zero applies at strand level here, not only at criterion level: a strand never addressed scores zero even when the rest of the criterion is sound.',
    'A criterion scores zero only when no strand carries any creditable evidence.',
  ],

  hardCeilings: [
    {
      when: 'Only one published study is used to justify the proposal',
      criterionId: 'A',
      max: 4,
      why: 'The introduction cannot establish a research problem from a single source; the guide expects the proposal to sit in a body of work.',
    },
    {
      when: 'A published measurement scale or instrument is used without the student adapting or justifying it',
      criterionId: 'C',
      max: 2,
      why: 'The analysis criterion asks what the student would do with the data, and lifting an existing scale wholesale leaves no methodological decision to assess.',
    },
    {
      when: 'The instrument contains fewer than five items',
      criterionId: 'C',
      max: 2,
      why: 'Too few items to generate data the proposed treatment could act on.',
    },
    {
      when: 'A second method from the same family is added without a stated reason',
      criterionId: 'D',
      max: 2,
      why: 'Method stacking without justification signals the design was not reasoned through.',
    },
  ],

  strandCeilings: [
    {
      when: 'The aim is stated without naming the population or leaves a variable open',
      criterionId: 'A',
      max: 2,
      why: 'A broad aim caps the aim strand, but the criterion can still rise on the strength of the research review.',
    },
    {
      when: 'Researcher bias is named but its effect on this study is not traced',
      criterionId: 'D',
      max: 2,
      why: 'Naming is the low band on this strand; the criterion can still rise on limitations and ethics.',
    },
  ],

  sixVersusFour: [
    {
      criterionId: 'A',
      six: 'The problem is argued rather than announced, two or more published studies are used to show what is missing, and the aim carries both the population and the variables.',
      four: 'The problem is described, studies are present but connected only by topic, and the aim leaves one element open.',
      movingLine: 'State what the existing studies did NOT settle, then write an aim that names who is being studied and what is being measured.',
    },
    {
      criterionId: 'D',
      six: 'Every limitation is tied to a feature of this design, ethics are specific to these participants, and researcher bias is traced through to an effect on the findings.',
      four: 'Limitations and ethics are correct but would fit any study of this type, and bias is named without being followed through.',
      movingLine: 'For each limitation, add the sentence "in this study that would mean...". Ethics points must name the actual participant group.',
    },
  ],

  pitfalls: [
    {
      id: 'feasibility-marked',
      severity: 'critical',
      claim: 'A proposal that could not realistically be carried out — clinical populations, longitudinal designs, expensive equipment — should lose marks for being unworkable.',
      reality: 'The study is never carried out. The IA is a proposal, and feasibility is not a criterion. A design requiring participants with a clinical diagnosis or years of follow-up is entirely acceptable if the reasoning is sound.',
      detector: 'Feedback says the study is impractical, too expensive, or could not be completed in the time available, and treats that as a weakness.',
    },
    {
      id: 'best-fit-overrides-ceiling',
      severity: 'critical',
      claim: 'Best-fit means every band is reachable if the overall quality is high enough.',
      reality: 'Psychology applies rule-based ceilings before best-fit. One published study caps Introduction at 4 regardless of how well it is written; fewer than five items caps Analysis at 2. Best-fit then operates underneath the ceiling.',
      detector: 'A criterion is awarded above a ceiling listed in this model, with quality of writing given as the reason.',
    },
    {
      id: 'qualitative-treated-as-weaker',
      severity: 'high',
      claim: 'A quantitative design with a statistical test is stronger than an interview or observation study.',
      reality: 'Qualitative and quantitative methods are equally valid. The criteria ask whether the chosen method is justified against the aim, not which family it belongs to.',
      detector: 'Feedback suggests adding a statistical test to a qualitative proposal, or describes an interview design as less rigorous.',
    },
    {
      id: 'sciences-structure-imported',
      severity: 'high',
      claim: 'The proposal should follow a scientific report structure with variables, controls, apparatus and a hypothesis.',
      reality: 'This is a proposal in psychology, not a lab report. There is no requirement for control variables, apparatus lists or uncertainty. Ethics and researcher bias carry the weight that evaluation of method carries in the sciences.',
      detector: 'Feedback asks for control variables, apparatus, uncertainty or repeat trials.',
    },
  ],
}

/* ------------------------------------------------------------------ */
/* IB Economics IA — one commentary from a portfolio of three           */
/* ------------------------------------------------------------------ */

const IB_ECONOMICS_MARKING: MarkingModel = {
  rubricId: 'ib-ia-economics',

  bestFit: [
    'Each criterion is judged on its own; the maxima are small (2 or 3) so a single clear failure moves the mark.',
    'Only whole marks. Mark positively.',
    'You are marking ONE commentary out of 14. Do not attempt to judge the portfolio as a whole.',
    'Criterion F is a portfolio-level criterion and cannot be assessed from a single commentary. Do not award it.',
  ],

  zeroRules: [
    'Zero for a criterion only where there is no creditable evidence at all — no diagram at all for A, no evaluative statement at all for E.',
  ],

  hardCeilings: [
    {
      when: 'A diagram is present but never referred to or explained in the body text',
      criterionId: 'A',
      max: 1,
      scope: 'instance',
      why: 'The criterion assesses explanation, not the presence of a figure.',
    },
    {
      when: 'The key concept is named in the title block but does not appear in the analysis',
      criterionId: 'D',
      max: 1,
      scope: 'instance',
      why: 'Naming without organising is the bottom band.',
    },
    {
      when: 'The same key concept is used in more than one commentary of the portfolio',
      criterionId: 'D',
      max: 0,
      scope: 'portfolio',
      why: 'The three commentaries must use three different key concepts. This cannot be checked from a single commentary — flag it as a risk rather than applying it.',
    },
  ],

  sixVersusFour: [
    {
      criterionId: 'C',
      six: 'Theory is applied to the specific event in the article and the chain runs from that event to an economic consequence.',
      four: 'Theory is correct but general, or the chain stops before a consequence is reached.',
      movingLine: 'Name the actual figure, policy or firm from the article inside the analysis, then follow it through to who gains and who loses.',
    },
    {
      criterionId: 'E',
      six: 'Judgements consider more than one side and rest on the analysis already made in the commentary.',
      four: 'Evaluation is one-sided, or the judgement appears without the analysis behind it.',
      movingLine: 'Add the other side — short run against long run, or a stakeholder who loses — and tie the judgement back to a step already argued.',
    },
  ],

  pitfalls: [
    {
      id: 'portfolio-total-confused',
      severity: 'critical',
      claim: 'The economics IA is marked out of 45, so this commentary should be scored on that scale.',
      reality: 'One commentary is marked out of 14 across criteria A to E. The portfolio total of 45 is (14 x 3) + 3, where the extra 3 come from criterion F applied once to all three commentaries together. Never score a single commentary out of 45.',
      detector: 'The total or any criterion is expressed against 45, or criterion F is awarded a mark.',
    },
    {
      id: 'diagram-presence-credited',
      severity: 'high',
      claim: 'A correct, well-drawn diagram earns full marks on criterion A.',
      reality: 'Criterion A assesses whether the diagram is explained in the body. A flawless diagram that the text merely points at sits at the bottom of the range; the reader must be walked through the movement.',
      detector: 'Feedback praises the diagram for accuracy or presentation without checking whether the text explains it.',
    },
    {
      id: 'article-summary-as-analysis',
      severity: 'high',
      claim: 'A commentary that accurately summarises the article and then explains the relevant theory has applied that theory.',
      reality: 'Application means the theory acts on the specifics of the article. A summary followed by a textbook passage, with nothing joining them, is the bottom band of criterion C.',
      detector: 'Feedback credits application while the analysis would read identically with a different article.',
    },
    {
      id: 'sciences-verb-ladder-imported',
      severity: 'medium',
      claim: 'The bands climb from stating to describing to explaining, as in the sciences.',
      reality: 'Economics bands climb a quality ladder: limited, then appropriate, then effective, with balance carrying weight in evaluation. Looking for the science verbs mismarks the middle band.',
      detector: 'Feedback justifies a mark by saying the student described rather than explained.',
    },
  ],
}

/* ------------------------------------------------------------------ */
/* Registry                                                            */
/* ------------------------------------------------------------------ */

const MARKING_MODELS: MarkingModel[] = [
  IB_SCIENCES_MARKING,
  IB_PSYCHOLOGY_MARKING,
  IB_ECONOMICS_MARKING,
  globalPoliticsMarkingSL,
  globalPoliticsMarkingHL,
  businessManagementMarking,
]

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