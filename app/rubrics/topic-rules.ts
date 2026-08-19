// app/rubrics/topic-rules.ts
//
// Rule data for Topic Finder. DATA, NOT CODE.
// Adding a new framework (A-Level, AP) = a new TopicRuleSet entry here.
//
// RULE: IB's sentences are never copied. The text below is our own wording of
// the facts and constraints extracted from that source.
//
import { globalPoliticsRulesSL, globalPoliticsRulesHL } from './global-politics'
import { businessManagementRules } from './business-management'
import { computerScienceRules } from './computer-science'
import { mathematicsRules } from './mathematics'
import { digitalSocietyRules } from './digital-society'
import { philosophyRules } from './philosophy'
import { languageAOralRules } from './language-a-oral'
import { languageBOralRuleSets } from './language-b-oral'
export type TopicVerdict = 'strong' | 'workable' | 'risky' | 'unworkable';

export type RuleSeverity = 'fatal' | 'major' | 'minor';

export interface TopicRule {
  /** The id the model returns. The UI looks up the label from this. */
  id: string;
  label: string;
  /** Sent to the model: when this rule fires. */
  detail: string;
  severity: RuleSeverity;
  /** Which criteria it damages — so the report can say why. */
  hits?: string[];
}

export interface TopicContext {
  id: string;
  label: string;
  /** Short hint shown to the student. */
  hint: string;
}

export interface TopicRuleSet {
  rubricId: string;
  label: string;
  /** The context list the student can narrow by. */
  contexts: TopicContext[];
  rules: TopicRule[];
  /** SL/HL difference. Keys match the `level` value. */
  levelNotes?: Record<string, string>;
  titleGuidance: string[];
  dataGuidance: string[];
  /** The tool's boundary — goes into both the prompt and the UI. */
  scopeNote: string;
}

/* ------------------------------------------------------------------ */
/* IB Sciences IA (Biology / Chemistry / Physics)                      */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* IB Sciences IA — Biology / Chemistry / Physics                      */
/* Source: subject guides + TSM + officially assessed student work.     */
/* ------------------------------------------------------------------ */

const IB_SCIENCES_CONTEXTS: TopicContext[] = [
  { id: 'hands-on', label: 'Laboratory experiment', hint: 'The student changes the independent variable physically and takes their own measurements.' },
  { id: 'fieldwork', label: 'Fieldwork', hint: 'Variables are not controlled but selected from conditions as found.' },
  { id: 'database', label: 'Database study', hint: 'Data is drawn from an external archive; the selection and filtering decisions are the student\'s methodology.' },
  { id: 'simulation', label: 'Simulation', hint: 'Data is produced by a software model; the model itself is a source of limitation.' },
  { id: 'spreadsheet-model', label: 'Spreadsheet or computational model', hint: 'The student builds a mathematical model and sweeps its parameters.' },
];

const IB_SCIENCES_RULES: TopicRule[] = [
  {
    id: 'no-quantifiable-variables',
    label: 'No measurable independent or dependent variable',
    detail:
      'Fires when the research question does not name two quantities and a relationship between them. The dependent variable may be derived (a rate, a ratio), but it must be measurable. Without variables, the first strand of criterion A and the whole of C and D become inapplicable.',
    severity: 'fatal',
    hits: ['A', 'C', 'D'],
  },
  {
    id: 'off-subject-focus',
    label: 'Focus sits outside the subject',
    detail:
      'Fires when the research question is predominantly a biology, chemistry, engineering-design or psychology question rather than one belonging to the subject being assessed. The IA is not an opportunity for interdisciplinary work; a question that drifts out of the subject cannot be marked against its criteria. Reframe it around variables that belong to the subject.',
    severity: 'fatal',
    hits: ['A'],
  },
  {
    id: 'shared-raw-data',
    label: 'Raw data shared with another student',
    detail:
      'Fires when the same raw data set would appear in two reports. Groups are capped at three students, and even where data is collected together each student must use a different independent variable, a different dependent variable, or a different subset of the shared pool. Otherwise it becomes an academic misconduct matter.',
    severity: 'fatal',
    hits: ['A', 'B'],
  },
  {
    id: 'published-table-reanalysis',
    label: 'Re-analysis of a table from a published paper',
    detail:
      'Fires when the data comes from a table already processed and presented in a paper. The authors have made the sampling, filtering and derivation decisions, leaving the student no methodological decisions to show under criterion A. Choose an archive holding raw or minimally processed records.',
    severity: 'major',
    hits: ['A', 'B'],
  },
  {
    id: 'below-five-datapoints',
    label: 'Fewer than five levels of the independent variable',
    detail:
      'Fires when a trend or relationship is sought and the independent variable takes fewer than five values. Four is acceptable in exceptional cases, fewer is not. Because it makes a gradient and its uncertainty impossible to extract, it pulls down B and C as well as A.',
    severity: 'major',
    hits: ['A', 'B', 'C'],
  },
  {
    id: 'no-uncertainty-source',
    label: 'No stated source for measurement uncertainty',
    detail:
      'Fires when uncertainty never appears in the tables and graphs, or a number is given without saying where it came from. Every raw column heading needs a unit and an uncertainty, justified from the instrument least count, the manufacturer specification, or the half-range of repeats. Without this, criterion B cannot exceed 3-4 and a fully consistent conclusion is not possible under C.',
    severity: 'major',
    hits: ['B', 'C'],
  },
  {
    id: 'identical-repeats',
    label: 'Repeats return identical values',
    detail:
      'Fires in simulations and deterministic models where repeated runs with the same input produce the same output. Such repeats do not count as sufficient data and the half-range method yields zero uncertainty, which is not accepted. The student must either vary additional conditions or derive uncertainty from reading resolution and model step size.',
    severity: 'major',
    hits: ['B', 'D'],
  },
  {
    id: 'context-bloat',
    label: 'Background has become a textbook summary',
    detail:
      'Fires when the introduction runs to pages of general theory without focusing on the research question itself. Criterion A measures the effectiveness of communication, not the quantity of knowledge: broad general background counts as broad context and pins the first strand at 3-4. Context should describe precisely the relationship between the chosen variables and the boundaries of the system.',
    severity: 'major',
    hits: ['A'],
  },
  {
    id: 'two-investigations-in-one',
    label: 'Effectively two investigations in one report',
    detail:
      'Fires when the student adds a second surface, material or method, repeats the same procedure, and makes no meaningful comparison between the two sets. This spends the word limit on repetition instead of depth and thins out the methodological detail. Going deeper into one system always scores better.',
    severity: 'major',
    hits: ['A', 'D'],
  },
  {
    id: 'evaluation-as-afterthought',
    label: 'Evaluation squeezed onto the last page',
    detail:
      'Fires when the evaluation is a bulleted list of procedural complaints with no statement of how each weakness affected the result in direction and size. Evaluation is statistically the lowest-scoring criterion of the IA: identifying a specific weakness is the 3-4 band, explaining its relative impact is 5-6. Limitations — data range, validity of assumptions — must also be treated separately from weaknesses.',
    severity: 'major',
    hits: ['D'],
  },
  {
    id: 'generic-limitations',
    label: 'Generic list of limitations',
    detail:
      'Fires on phrases that would fit almost any experiment: human reaction time, ambient temperature not controlled, uncalibrated meter, more measurements should have been taken. These are generic by definition and correspond to the 1-2 band under D. A known limitation such as heat loss in calorimetry only carries weight if the student tried to reduce it at the design stage.',
    severity: 'major',
    hits: ['D'],
  },
  {
    id: 'statistical-uncertainty-substitution',
    label: 'Standard deviation used as gradient uncertainty',
    detail:
      'Fires when the standard deviation or standard error reported by graphing software is presented as the experimental uncertainty of the gradient. Standard deviation measures only the scatter of the points and takes no account of measurement uncertainty. The expected method is maximum and minimum gradient lines drawn by eye against the uncertainty bars.',
    severity: 'minor',
    hits: ['B', 'C'],
  },
  {
    id: 'precision-overclaim',
    label: 'Claiming precision the instrument cannot deliver',
    detail:
      'Fires on claims such as ±0.001 s from a hand-operated stopwatch, ±0.01 cm from a tape measure, or ±0.0005 m from a millimetre rule. The number of digits an instrument displays is not the realistic uncertainty; reaction time and reading conditions enlarge it. This is both a precision error under B and a missed weakness under D.',
    severity: 'minor',
    hits: ['B', 'D'],
  },
  {
    id: 'answer-known-in-advance',
    label: 'The answer is known before starting',
    detail:
      'Fires when the research question amounts to verifying a known law. This is not fatal on its own — a classic verification can score full marks — but it leaves no excuse for vague context or generic evaluation. Superficial work on a familiar topic is marked more harshly than usual.',
    severity: 'minor',
    hits: ['A', 'D'],
  },
  {
    id: 'word-count-overrun',
    label: 'Over 3,000 words',
    detail:
      'Fires when the report exceeds 3,000 words. The examiner is not obliged to read beyond the limit, which in practice leaves the conclusion and evaluation sections at the end without evidence. Data tables, graphs, equations, calculations, citations, the bibliography and headings are excluded from the count, so the limit is generous for a well-written report.',
    severity: 'minor',
    hits: ['C', 'D'],
  },
  {
    id: 'appendix-dependency',
    label: 'Critical information left in an appendix',
    detail:
      'Fires when method detail, processed data or a sample calculation sits in an appendix rather than the body. Appendices are not read; the only exception is participant consent forms. Evidence in an appendix counts as never written.',
    severity: 'minor',
    hits: ['A', 'B'],
  },
  /* Chemistry-specific */
  {
    id: 'visual-only-computational-work',
    label: 'Modelling that returns no calculated property',
    detail:
      'Fires when a computational or molecular-modelling route produces images rather than numbers — "3D model", "visualise the molecule", "show the geometry". Visual-only modelling is rarely suitable as the basis of an investigation; the package must calculate properties, and the level of theory and convergence settings then function as control variables.',
    severity: 'fatal',
    hits: ['A', 'B'],
  },
  {
    id: 'waste-disposal-unspecified',
    label: 'Disposal route not described',
    detail:
      'Fires when reagents are named but no disposal method is given — heavy metal salts, organic solvents, strong acids, transition metal waste. Awareness of a hazard is not mitigation of it; the student must state what happened to the specific chemicals and organic matter, even where a technician handles it under school policy.',
    severity: 'major',
    hits: ['A'],
  },
  {
    id: 'reagent-identity-vague',
    label: 'Sample or solution specified only by category',
    detail:
      'Fires on a sample named only by its class — "tap water", "red wine", "soil", "commercial bleach" — or a solution given without concentration and preparation route. The properties that vary within the category are the ones that move the result, so the data cannot be assessed without them.',
    severity: 'major',
    hits: ['A', 'B'],
  },
  {
    id: 'technique-limitation-not-designed-out',
    label: 'Known technique limitation left in the design',
    detail:
      'Fires on an open uninsulated calorimeter, an uncalibrated pH meter or colorimeter, or unmanaged sample storage. These belong to the design phase; carrying them through means the evaluation reports an avoidable error instead of a ranked impact.',
    severity: 'major',
    hits: ['A', 'D'],
  },
  {
    id: 'unbalanced-or-stateless-equations',
    label: 'Equations unbalanced or missing state symbols',
    detail:
      'Fires when a reaction is written without balancing or without state symbols. Treated as a baseline convention, so failure signals imprecise communication across the whole report rather than an isolated slip.',
    severity: 'minor',
    hits: ['B'],
  },

  /* Biology-specific */
  {
    id: 'unregulated-living-material',
    label: 'Living material without ethics or consent handling',
    detail:
      'Fires on human participants, vertebrates, or field organisms where no consent form, no ethical statement and no consideration of harm to the organism or site appears. Human participants require an informed consent form; fieldwork requires consideration of impact on the site.',
    severity: 'fatal',
    hits: ['A'],
  },
  {
    id: 'missing-binomial-name',
    label: 'Organism named only in common terms',
    detail:
      'Fires when the research question or method names a living organism as "onion", "yeast", "grass" or "beetle" without genus and species. Biology expects the scientific name wherever an organism is relevant, correctly italicised with a lower-case species epithet. Common names alone leave the study material undefined and weaken both the question and the method description.',
    severity: 'major',
    hits: ['A', 'B'],
  },
  {
    id: 'sample-too-small-for-test',
    label: 'Planned n cannot carry the planned statistic',
    detail:
      'Fires when the design promises a t-test, ANOVA or standard error of the mean but the replicate count falls below the threshold that statistic needs — three replicates with a t-test, or SEM quoted on a handful of readings. Either raise n or switch to range bars and a rank-based test.',
    severity: 'major',
    hits: ['A', 'B'],
  },
  {
    id: 'correlation-strength-misread',
    label: 'R² used as a claim about data quality',
    detail:
      'Fires when a high R² is offered as evidence that data are reliable or accurate, or when R² is used to describe the direction of a relationship. It measures fit only and is directionless. Also fires when R² is displayed on a polynomial or geometric trend line, where it does not apply.',
    severity: 'major',
    hits: ['B', 'C'],
  },
  {
    id: 'biological-variability-ignored',
    label: 'Between-specimen variation treated as error',
    detail:
      'Fires when variation across individual organisms, tissue samples or field sites is described purely as measurement error to be eliminated. In biology this variation is part of the system and belongs in the uncertainty treatment and the evaluation, not written off.',
    severity: 'minor',
    hits: ['B', 'D'],
  },
  /* SEHS-specific */
  {
    id: 'ingestion-protocol-banned',
    label: 'Ingestion protocol is prohibited',
    detail:
      'Fires when the topic requires giving participants food, caffeine, energy drinks, sports gels, creatine, beta-alanine, supplements or any stimulant or medication. Investigations built on the effect of caffeine on reaction time, carbohydrate loading on endurance, or an energy drink on sprint speed all fall inside this. The topic must be reframed so that the ingested substance is no longer the independent variable — timing of the last meal, for instance, can be treated as a control variable.',
    severity: 'fatal',
    hits: ['A'],
  },
  {
    id: 'human-subjects-consent',
    label: 'Consent or parental consent missing',
    detail:
      'Fires when human participants are involved and there is no evidence of an informed consent form. The form must cover voluntariness, the right to withdraw, anonymity and use of the data; parental consent is additionally required for participants under 16. Consent forms are the one permitted appendix, so placing them there is fine — the problem is their absence. In assessed samples, not seeking consent caps the second strand of Research design at the 3-4 band rather than zeroing the criterion.',
    severity: 'major',
    hits: ['A'],
  },
  {
    id: 'no-physical-readiness-screening',
    label: 'No physical readiness screening',
    detail:
      'Fires when a protocol involves maximal or submaximal exertion — beep test, Wingate, one-rep max, run to exhaustion, repeated vertical jumps — without a tool screening participants for physical readiness. A PAR-Q or equivalent, a warm-up protocol, supervision arrangements and exclusion criteria are expected. Naming the risk is not enough; how it was mitigated must be shown.',
    severity: 'major',
    hits: ['A'],
  },
  {
    id: 'order-and-practice-effects',
    label: 'Order and practice effects unmanaged',
    detail:
      'Fires when the same participant enters more than one condition and the order of conditions is not randomised, or when the measurement drifts because the participant improves at the task. This applies to any design involving skill, coordination, reaction or a cognitive task. The expected solution is randomised condition order, practice trials and adequate rest between conditions, with the reasoning written down. It also carries into Evaluation: if the effect is not discussed, the relative-impact explanation is incomplete.',
    severity: 'major',
    hits: ['A', 'D'],
  },
  {
    id: 'unlabelled-uncertainty-bars',
    label: 'Uncertainty bar type not stated',
    detail:
      'Fires when a graph shows means without uncertainty bars, or with bars whose type (±1SD, ±2SD, SEM, 95% CI) is not labelled. Plotting standard deviation as a bar while never giving its numerical value anywhere amounts to the same thing. Overlap of SD or range bars also cannot support a significance claim; significance needs an inferential test.',
    severity: 'major',
    hits: ['B', 'D'],
  },
];

const IB_SCIENCES_RULESET: TopicRuleSet = {
  rubricId: 'ib-ia-sciences',
  label: 'IB Sciences IA (Biology / Chemistry / Physics)',
  contexts: IB_SCIENCES_CONTEXTS,
  rules: IB_SCIENCES_RULES,
  levelNotes: {
    SL: 'The IA requirement, criteria, word limit and time allocation are identical at SL and HL. There is no separate threshold or allowance for SL.',
    HL: 'HL students are not expected to produce more data or more advanced mathematics; the same rubric, the same 3,000 words and the same 10 hours apply. Beyond-syllabus topics are open to both levels.',
  },
  titleGuidance: [
    'The title should reflect the research question rather than the field: it names two quantities and the relationship between them.',
    'The dependent variable may be a derived quantity such as a rate or a ratio; in that case its link to the raw measured quantities is established in the background.',
    'No cover page or contents page. The report opens with the title, the candidate code, any group members\' codes, and the word count.',
    'Title and opening paragraph together should tell the reader what the investigation is.',
  ],
  dataGuidance: [
    'At least five levels of the independent variable when seeking a trend, exceptionally four. The choice of range and interval must be justified, and the justification should come from preliminary trials.',
    'The number of repeats is open but must be justified. Repeats do not reduce random error; they make the size of the uncertainty visible.',
    'The amount of data should be proportionate to ten hours of work. Not every investigation is expected to generate a lot: systems that yield data quickly are not compared against slow ones on measurement count.',
    'Rough processing while collecting is recommended — an inadequate range or interval only becomes visible once a graph is drawn, and at that point it can still be fixed.',
    'The report carries a sample covering the range at regular intervals, not the full raw data set; the teacher must have seen the complete set.',
    'For database and simulation work, the source name, address and extraction steps should be documented with screenshots; the filtering criteria are part of the methodology.',
    'Unexpected or inconclusive data is not a flaw: the report is expected to describe what happened, including problems encountered and how they were handled.',
  ],
  scopeNote:
    'Assessment rests only on the evidence written in the report, and the four criteria measure different aspects of the same text; evidence is not expected in a linear or standard order. Each criterion mark is a holistic best-fit decision rather than an average of strands, and not every statement in a band must be met. Marking is positive: what the student did is credited, not what they could have done.',
};

/* ------------------------------------------------------------------ */
/* IB Psychology IA — research proposal                                 */
/* ------------------------------------------------------------------ */

const IB_PSYCHOLOGY_CONTEXTS: TopicContext[] = [
  { id: 'experiment', label: 'Experiment', hint: 'Two or more conditions with a manipulated variable' },
  { id: 'interview', label: 'Interview', hint: 'Semi-structured conversation producing transcript data' },
  { id: 'observation', label: 'Observation', hint: 'Behaviour recorded in a natural or structured setting' },
  { id: 'questionnaire', label: 'Questionnaire', hint: 'A written instrument administered to a defined sample' },
];

const IB_PSYCHOLOGY_RULES: TopicRule[] = [
  {
    id: 'prohibited-participant-group',
    label: 'Participant group is not permitted',
    detail:
      'Fires when the proposal recruits participants under 16 without parental consent, people with a clinical diagnosis approached as patients, or anyone in a relationship of dependency on the researcher. These are not feasibility concerns — they are ethical limits that apply even though the study is never run.',
    severity: 'fatal',
    hits: ['B', 'D'],
  },
  {
    id: 'method-not-one-of-four',
    label: 'Method is outside the permitted four',
    detail:
      'Fires when the proposed method is not clearly one of experiment, interview, observation or questionnaire. Mixed designs that never settle on a primary method fall here too — the criteria are written against a single chosen method.',
    severity: 'fatal',
    hits: ['B'],
  },
  {
    id: 'aim-too-broad',
    label: 'The aim does not name a population or a variable',
    detail:
      'Fires on aims like "to investigate stress in teenagers" or "to explore social media use". The aim must carry who is being studied and what is being measured or compared. A broad aim caps the aim strand of Introduction at the bottom band and leaves the rest of the design unanchored.',
    severity: 'major',
    hits: ['A', 'B'],
  },
  {
    id: 'single-study-foundation',
    label: 'Only one published study behind the proposal',
    detail:
      'Fires when the introduction rests on a single piece of published research. At least two are expected, and their relationship to each other is what establishes the gap the proposal fills. This caps Introduction at 4 regardless of how well the single study is discussed.',
    severity: 'major',
    hits: ['A'],
  },
  {
    id: 'instrument-too-thin',
    label: 'Instrument has fewer than five items',
    detail:
      'Fires when a questionnaire or interview schedule carries fewer than five items, or when the items are not written out at all. Too thin to generate data the proposed analysis could act on; caps Analysis at 2.',
    severity: 'major',
    hits: ['B', 'C'],
  },
  {
    id: 'scale-lifted-unadapted',
    label: 'Published scale used without adaptation or justification',
    detail:
      'Fires when an existing measurement instrument is adopted wholesale with no reasoning about why it fits this population and this aim. The analysis criterion asks what the student decided; lifting a scale leaves nothing to assess.',
    severity: 'major',
    hits: ['B', 'C'],
  },
  {
    id: 'method-stacking',
    label: 'A second method added without reason',
    detail:
      'Fires when the proposal bolts on an extra method from the same family — a questionnaire alongside an interview, say — without stating what the second one adds. Reads as indecision rather than design, and caps Evaluation at 2.',
    severity: 'minor',
    hits: ['B', 'D'],
  },
];

const IB_PSYCHOLOGY_RULESET: TopicRuleSet = {
  rubricId: 'ib-ia-psychology',
  label: 'IB Psychology IA (Research Proposal)',
  contexts: IB_PSYCHOLOGY_CONTEXTS,
  rules: IB_PSYCHOLOGY_RULES,
  titleGuidance: [
    'The aim names the population and the variables: who is being studied, and what is being measured or compared.',
    'A relationship between two variables, or a comparison between two conditions, is what the aim should express.',
    'Avoid words that cannot be operationalised — wellbeing, performance, success — unless the instrument defines them.',
  ],
  dataGuidance: [
    'The study is never carried out, so no data is collected. What is assessed is the plan.',
    'The sampling technique must fit the population named in the aim, and its limits should be acknowledged.',
    'A questionnaire or interview schedule needs at least five items, written out in full.',
    'A published scale may be used only if adapted, with reasoning about why it fits this population.',
    'The planned treatment of the data must be named specifically: which test and why, or which analytic approach and how.',
  ],
  scopeNote:
    'This is a research PROPOSAL — the study is not run, and feasibility is not assessed. A design requiring clinical participants or years of follow-up is acceptable if the reasoning holds. What is marked is the quality of the thinking, not whether it could be executed.',
};

/* ------------------------------------------------------------------ */
/* IB Economics IA — one commentary from a portfolio of three           */
/* ------------------------------------------------------------------ */

const IB_ECONOMICS_CONTEXTS: TopicContext[] = [
  { id: 'microeconomics', label: 'Microeconomics', hint: 'Markets, elasticity, market failure, intervention' },
  { id: 'macroeconomics', label: 'Macroeconomics', hint: 'Growth, inflation, unemployment, fiscal and monetary policy' },
  { id: 'global-economy', label: 'The global economy', hint: 'Trade, exchange rates, integration, development' },
];

const IB_ECONOMICS_RULES: TopicRule[] = [
  {
    id: 'article-carries-no-diagram',
    label: 'The article cannot yield a diagram',
    detail:
      'Fires when the article reports a situation with no change to model — a description of an industry, a profile of a company, a statistical roundup. Every commentary needs at least one diagram that shows a movement, and the article has to contain something that moves.',
    severity: 'fatal',
    hits: ['A', 'C'],
  },
  {
    id: 'article-too-old',
    label: 'The article is outside the age limit',
    detail:
      'Fires when the article predates the limit set for the portfolio. Age is checked against the publication date, not the date of the events described. An old article invalidates the commentary at portfolio level.',
    severity: 'fatal',
    hits: ['F'],
  },
  {
    id: 'article-is-analysis-not-news',
    label: 'The source is already an economic analysis',
    detail:
      'Fires when the chosen piece is itself an economics commentary, an opinion column arguing a case, or a textbook extract. The commentary must supply the analysis; a source that already contains it leaves the student paraphrasing.',
    severity: 'major',
    hits: ['C', 'D'],
  },
  {
    id: 'key-concept-not-chosen-early',
    label: 'Key concept picked after the analysis',
    detail:
      'Fires when the key concept appears only in the title block or the closing paragraph. The concept is supposed to determine what the commentary examines; if the analysis would read the same without it, it was not organising anything.',
    severity: 'major',
    hits: ['D'],
  },
  {
    id: 'repeats-unit-or-source',
    label: 'Repeats a unit or source used elsewhere in the portfolio',
    detail:
      'Fires when this commentary draws on the same syllabus unit, the same publication or the same key concept as another commentary in the portfolio. Cannot be verified from a single commentary — surface it as a risk for the student to check against their other two.',
    severity: 'major',
    hits: ['F'],
  },
  {
    id: 'scope-too-wide-for-800',
    label: 'The chosen angle cannot fit 800 words',
    detail:
      'Fires when the commentary sets out to cover an entire policy, an entire market or several countries. Eight hundred words holds one diagram, one chain of reasoning and one evaluated judgement. Breadth here reads as thinness.',
    severity: 'major',
    hits: ['C', 'E'],
  },
  {
    id: 'title-block-incomplete',
    label: 'Title block missing required fields',
    detail:
      'Fires when the commentary omits the article title, source, publication date, date of commentary, word count, syllabus unit or key concept. These are formal requirements assessed at portfolio level.',
    severity: 'minor',
    hits: ['F'],
  },
];

const IB_ECONOMICS_RULESET: TopicRuleSet = {
  rubricId: 'ib-ia-economics',
  label: 'IB Economics IA (Commentary Portfolio)',
  contexts: IB_ECONOMICS_CONTEXTS,
  rules: IB_ECONOMICS_RULES,
  titleGuidance: [
    'The commentary is built around one article, so the angle is chosen from what the article makes visible.',
    'One diagram, one chain of reasoning and one evaluated judgement is what 800 words holds.',
    'The key concept is chosen before writing and determines what the commentary examines.',
  ],
  dataGuidance: [
    'The source is a news article, not an economic analysis. If the piece already argues the economics, there is nothing left to apply.',
    'The article must contain a change — a policy, a price movement, a shock — so that a diagram has something to show.',
    'Across the portfolio: three different syllabus units, three different sources, three different key concepts.',
    'The title block carries the article title, source, publication date, commentary date, word count, unit and key concept.',
  ],
  scopeNote:
    'The IA is a portfolio of three commentaries, marked at 14 each plus 3 for the portfolio as a whole — 45 in total. This tool works on ONE commentary at a time. Requirements that span the three (different units, sources and key concepts) are flagged as risks, not verified.',
};

/* ------------------------------------------------------------------ */
/* Registry                                                            */
/* ------------------------------------------------------------------ */

const TOPIC_RULE_SETS: TopicRuleSet[] = [
  IB_SCIENCES_RULESET,
  IB_PSYCHOLOGY_RULESET,
  IB_ECONOMICS_RULESET,
  globalPoliticsRulesSL,
  globalPoliticsRulesHL,
  businessManagementRules,
  computerScienceRules,
  mathematicsRules,
  digitalSocietyRules,
  philosophyRules,
    ...languageBOralRuleSets,
  languageAOralRules,
];
/** Rule sets that have a rubric. The UI builds its selector from this. */
export function listTopicRuleSets(): TopicRuleSet[] {
  return TOPIC_RULE_SETS;
}

export function getTopicRules(rubricId: string): TopicRuleSet | undefined {
  return TOPIC_RULE_SETS.find((s) => s.rubricId === rubricId);
}

export function hasTopicRules(rubricId: string): boolean {
  return TOPIC_RULE_SETS.some((s) => s.rubricId === rubricId);
}

export function getRule(rubricId: string, ruleId: string): TopicRule | undefined {
  return getTopicRules(rubricId)?.rules.find((r) => r.id === ruleId);
}

/** Rule sets that require a level selection. */
export function topicRulesNeedLevel(rubricId: string): boolean {
  const set = getTopicRules(rubricId);
  return Boolean(set?.levelNotes && Object.keys(set.levelNotes).length > 0);
}

export const VERDICT_LABELS: Record<TopicVerdict, string> = {
  strong: 'Strong',
  workable: 'Workable',
  risky: 'Risky',
  unworkable: 'Unworkable',
};

export const VERDICT_DESCRIPTIONS: Record<TopicVerdict, string> = {
  strong: 'The idea holds. There is room to score across every criterion.',
  workable: 'It runs, but at least one thing needs narrowing or strengthening.',
  risky: 'There is a serious gap. Left unfixed, the hours are wasted.',
  unworkable: 'The criteria cannot be applied as written. The idea has to change.',
};

/** Ordering used when turning the report into a prompt. */
export const SEVERITY_ORDER: Record<RuleSeverity, number> = {
  fatal: 0,
  major: 1,
  minor: 2,
};