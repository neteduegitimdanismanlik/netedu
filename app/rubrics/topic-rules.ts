// app/rubrics/topic-rules.ts
//
// Rule data for Topic Finder. DATA, NOT CODE.
// Adding a new framework (A-Level, AP) = a new TopicRuleSet entry here.
//
// Source: IB Mathematics AA teacher support material (TSM) — "Choosing a topic",
// "Frequently asked questions about the IA", criterion notes.
// RULE: IB's sentences are never copied. The text below is our own wording of
// the facts and constraints extracted from that source.
//
// DELIBERATELY NOT SHIPPED: the ~200 sample IA titles in the TSM appendix. Only
// the category names were taken. (Those titles come from work that "attained a
// variety of marks" — they carry no quality signal, so copyright aside they
// were not worth shipping.)

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
/* IB Mathematics IA (AA / AI, SL + HL)                                */
/* ------------------------------------------------------------------ */

/**
 * The category headings from the TSM appendix. TEN of them — the previous
 * version had 7, missing People / Sport and leisure / Travel and transport.
 */
const IB_MATHS_CONTEXTS: TopicContext[] = [
  {
    id: 'aesthetics',
    label: 'Aesthetics',
    hint: 'Proportion, symmetry, architectural form, colour, visual perception',
  },
  {
    id: 'business-finance',
    label: 'Business and finance',
    hint: 'Pricing, interest, risk, optimization, allocation of resources',
  },
  {
    id: 'food-drink',
    label: 'Food and drink',
    hint: 'Scaling recipes, heat transfer, packaging volume, consumption',
  },
  {
    id: 'health-fitness',
    label: 'Health and fitness',
    hint: 'Training load, growth curves, dosage, epidemiology',
  },
  {
    id: 'geometry-trigonometry',
    label: 'Geometry and trigonometry',
    hint: 'Curve fitting, tiling, projection, three-dimensional form',
  },
  {
    id: 'nature-resources',
    label: 'Nature and natural resources',
    hint: 'Populations, climate series, water, energy, biological pattern',
  },
  {
    id: 'number',
    label: 'Number',
    hint: 'Sequences, primes, modular arithmetic, numerical patterns',
  },
  {
    id: 'people',
    label: 'People',
    hint: 'Population, voting systems, language, behaviour, survey data',
  },
  {
    id: 'sport-leisure',
    label: 'Sport and leisure',
    hint: 'Performance statistics, game theory, motion, games of chance',
  },
  {
    id: 'travel-transport',
    label: 'Travel and transport',
    hint: 'Routing, traffic flow, timetables, fuel, navigation',
  },
];

const IB_MATHS_RULES: TopicRule[] = [
  {
    id: 'prior-learning-only',
    label: 'Mathematics below course level',
    detail:
      'If the mathematics involved sits entirely at pre-DP level (means, percentages, ' +
      'simple ratios, bar charts), the topic hits a ceiling on criterion E. The ' +
      'mathematics is expected to be commensurate with the level of the course. ' +
      'Fires when the idea involves only descriptive statistics.',
    severity: 'fatal',
    hits: ['E'],
  },
  {
    id: 'descriptive-or-historical',
    label: 'Purely descriptive or historical',
    detail:
      'If the topic only recounts a mathematician\'s life, the history of a theorem, or ' +
      'the shape of a field, the criteria cannot be applied. There must be mathematics ' +
      'the student does, not mathematics the student describes.',
    severity: 'fatal',
    hits: ['C', 'D', 'E'],
  },
  {
    id: 'complexity-for-show',
    label: 'Complexity for its own sake',
    detail:
      'Heavy machinery where simple mathematics would do does not strengthen a topic; ' +
      'the mathematics has to move the work forward. Fires when a method appears to ' +
      'have been chosen to look difficult. A few things done well beats many done poorly.',
    severity: 'major',
    hits: ['E'],
  },
  {
    id: 'scope-too-broad',
    label: 'Scope too broad',
    detail:
      'Ideas chasing several independent questions at once cannot go deep in 12-20 ' +
      'pages. One well-defined aim is required. Ideas phrased as "I will investigate X" ' +
      'usually land here.',
    severity: 'major',
    hits: ['A', 'E'],
  },
  {
    id: 'data-insufficient',
    label: 'Not enough data for the technique',
    detail:
      'If data is used, enough of it must be obtainable for the chosen technique to be ' +
      'valid. Building a regression or a hypothesis test on a tiny sample invalidates ' +
      'the result. Fires when the data source and size are not established up front.',
    severity: 'major',
    hits: ['E', 'D'],
  },
  {
    id: 'data-reused',
    label: 'Data comes from other DP work',
    detail:
      'Reusing data collected for an EE, a science IA, or fieldwork is discouraged. It ' +
      'is only acceptable if analysed in a completely different way and the teacher is ' +
      'informed.',
    severity: 'minor',
  },
  {
    id: 'no-personal-hook',
    label: 'No personal connection',
    detail:
      'If the topic is someone else\'s problem being solved, criterion C stays weak. ' +
      'There must be an entry point showing the student has made the work their own: ' +
      'their own question, their own data, their own context.',
    severity: 'major',
    hits: ['C'],
  },
  {
    id: 'title-is-stimulus',
    label: 'Title is just the stimulus',
    detail:
      'A bare field name like "Number patterns" does not say where the work goes. The ' +
      'title should state the actual question the stimulus led to.',
    severity: 'minor',
    hits: ['A'],
  },
  {
    id: 'audience-mismatch',
    label: 'Wrong target audience',
    detail:
      'The writing should be accessible to fellow students. If the idea sits in a field ' +
      'only a specialist reader could follow, the communication criterion suffers.',
    severity: 'minor',
    hits: ['B'],
  },
  {
    id: 'outside-syllabus-drift',
    label: 'Drifting outside the syllabus',
    detail:
      'Mathematics beyond the syllabus is not needed for full marks. If used, its level ' +
      'should be comparable to the syllabus and it must be explained and referenced. ' +
      'Fires when a topic was chosen only because it is "advanced".',
    severity: 'minor',
    hits: ['E'],
  },
  {
    id: 'technology-substitution',
    label: 'Feeding numbers into software',
    detail:
      'Entering values into a formula or a package and reporting the output does not ' +
      'demonstrate understanding. Technology is unrestricted, but the reasoning behind ' +
      'the result has to be shown.',
    severity: 'minor',
    hits: ['E'],
  },
  {
    id: 'interpretation-deferred',
    label: 'Interpretation left to the end',
    detail:
      'Results should be interpreted where they are produced and summarized in the ' +
      'conclusion. If the plan piles all interpretation at the end, communication and ' +
      'reflection both weaken.',
    severity: 'minor',
    hits: ['B', 'D'],
  },
  {
    id: 'repetition-padding',
    label: 'Padding through repetition',
    detail:
      'Repeating the same calculation with different numbers adds length, not marks. ' +
      'Lack of conciseness is penalized. Fires when the plan is "I will repeat this for ' +
      '10 different examples".',
    severity: 'minor',
    hits: ['A'],
  },
  {
    id: 'class-duplicate-risk',
    label: 'Risk of overlapping with classmates',
    detail:
      'The same title is allowed, but no two students may submit the same mathematics. ' +
      'If a very common pattern is chosen (golden ratio measurements, basketball shot ' +
      'angles), the point of difference must be settled up front.',
    severity: 'minor',
  },
];

const IB_MATHS_LEVEL_NOTES: Record<string, string> = {
  SL:
    'At SL, the top level asks for mathematics that is at course level, relevant and ' +
    'correct, with understanding demonstrated. An exotic topic is not required. A plain ' +
    'but well-constructed idea can be "strong" at SL.',
  HL:
    'At HL, the top level additionally asks for sophistication and rigour: either ' +
    'mathematics at HL level, or SL mathematics used in a way beyond what an SL student ' +
    'would be expected to manage, with claims justified. A routine SL treatment hits a ' +
    'ceiling at HL — an idea that is "strong" at SL may be "workable" at HL.',
};

const IB_MATHS_RULESET: TopicRuleSet = {
  rubricId: 'ib-ia-maths',
  label: 'IB Mathematics IA (Exploration)',
  contexts: IB_MATHS_CONTEXTS,
  rules: IB_MATHS_RULES,
  levelNotes: IB_MATHS_LEVEL_NOTES,
  titleGuidance: [
    'The title should state the question, not the field.',
    'A stimulus word is not a title; the title shows where that word led.',
    'One sentence, one aim.',
  ],
  dataGuidance: [
    'Where the data comes from, how many observations there will be, and whether that is enough for the technique — all three settled up front.',
    'If secondary data is used, the source and the sampling method must be stated.',
    'Data collected for another DP task should not be reused.',
  ],
  scopeNote:
    'This tool does not write the IA. It suggests topics and rules them out. The output ' +
    'is a shortlist to take to your teacher.',
};
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

const TOPIC_RULE_SETS: TopicRuleSet[] = [IB_MATHS_RULESET, IB_SCIENCES_RULESET];

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