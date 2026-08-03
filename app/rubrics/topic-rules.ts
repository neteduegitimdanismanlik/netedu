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

const IB_SCIENCES_CONTEXTS: TopicContext[] = [
  { id: 'lab-practical', label: 'Hands-on lab', hint: 'You run the experiment yourself with school equipment' },
  { id: 'fieldwork', label: 'Fieldwork', hint: 'Sampling outside the lab — a site, a habitat, a population' },
  { id: 'database', label: 'Database study', hint: 'Published datasets analysed in a way the original authors did not' },
  { id: 'modelling', label: 'Spreadsheet modelling', hint: 'A quantitative model built and tested against real values' },
  { id: 'simulation', label: 'Simulation', hint: 'Software that produces variation, not the same answer every run' },
];

const IB_SCIENCES_RULES: TopicRule[] = [
  {
    id: 'answerable-by-search',
    label: 'The answer is already published',
    detail:
      'If the research question can be settled by looking it up, there is nothing to investigate. ' +
      'Fires on questions with a known textbook answer and no new variable, range or system of the student\'s own.',
    severity: 'fatal',
    hits: ['A'],
  },
  {
    id: 'no-quantitative-data',
    label: 'No quantitative data',
    detail:
      'Quantitative data is required. Qualitative observation can support but cannot carry the ' +
      'investigation. A purely descriptive idea is invalid from the start.',
    severity: 'fatal',
    hits: ['B'],
  },
  {
    id: 'variable-not-quantifiable',
    label: 'Variable cannot be measured',
    detail:
      'Both the independent and dependent variable must be measurable with available equipment. ' +
      'Fires on vague constructs ("freshness", "quality", "effectiveness") with no stated method of measurement.',
    severity: 'fatal',
    hits: ['A', 'B'],
  },
  {
    id: 'interdisciplinary-drift',
    label: 'Drifting into another subject',
    detail:
      'The investigation must sit in the subject being assessed. A chemistry IA that turns into a ' +
      'health claim, or a biology IA that becomes a physics measurement, loses the subject-specific depth.',
    severity: 'major',
    hits: ['A', 'C'],
  },
  {
    id: 'repeat-of-class-prac',
    label: 'A class practical repeated',
    detail:
      'Running a standard prescribed practical unchanged gives nothing to design. There must be a ' +
      'genuine extension: a different range, a different system, a different dependent variable.',
    severity: 'major',
    hits: ['A'],
  },
  {
    id: 'below-five-datapoints',
    label: 'Too few levels of the independent variable',
    detail:
      'An investigation looking for a trend needs at least five values of the independent variable. ' +
      'Four is acceptable only with a stated reason, such as an expensive or hazardous reagent.',
    severity: 'major',
    hits: ['A', 'B'],
  },
  {
    id: 'scope-exceeds-10h',
    label: 'Too big for the time available',
    detail:
      'The IA is a ten-hour task. Longitudinal designs, organism growth over weeks, or equipment the ' +
      'school does not own will not finish.',
    severity: 'major',
    hits: ['A'],
  },
  {
    id: 'scope-too-narrow',
    label: 'Too thin to reach the descriptors',
    detail:
      'The opposite failure: a question so small that evaluation and conclusion have nothing to work ' +
      'with. There must be enough depth for every criterion to be met meaningfully.',
    severity: 'major',
    hits: ['C', 'D'],
  },
  {
    id: 'uncontrolled-environment',
    label: 'Control variables not actually controlled',
    detail:
      'Naming a control variable is not controlling it. Fires when temperature, light or pH are listed ' +
      'as controlled with no method — "room temperature" is not control.',
    severity: 'major',
    hits: ['A'],
  },
  {
    id: 'no-uncertainty-plan',
    label: 'No plan for uncertainty',
    detail:
      'In physics and chemistry, measurement uncertainty has to be planned from the start — instrument ' +
      'precision, propagation, and how it will be shown. Without it the conclusion cannot be fully ' +
      'consistent with the processed data.',
    severity: 'major',
    hits: ['B', 'C'],
  },
  {
    id: 'stats-mismatch',
    label: 'Statistical treatment does not fit the subject',
    detail:
      'Biology expects statistical treatment with sample sizes that justify it. Physics does not expect ' +
      'statistical tests at all — uncertainty propagation takes their place. Chemistry sits between. ' +
      'Fires when the planned analysis does not match the subject or the sample is too small for the test.',
    severity: 'major',
    hits: ['B'],
  },
  {
    id: 'sample-not-characterized',
    label: 'Sample not properly described',
    detail:
      'A material has to be specified well enough to be reproducible: variety, origin, concentration, ' +
      'storage. "Red wine" or "soil" is not a description. In biology the organism needs its binomial name.',
    severity: 'major',
    hits: ['A'],
  },
  {
    id: 'safety-or-disposal-unaddressed',
    label: 'Safety, ethics or disposal not addressed',
    detail:
      'Naming a hazard is not enough — it has to be mitigated, and chemical waste needs a stated disposal ' +
      'route. Human participants need consent. If there is genuinely no safety, ethical or environmental ' +
      'issue, say so explicitly.',
    severity: 'major',
    hits: ['A'],
  },
  {
    id: 'published-table-source',
    label: 'Data lifted from a published table',
    detail:
      'Tables inside published papers are rarely suitable as a data source — usually already processed ' +
      'and too small. A genuine database study needs a dataset large enough to sample from.',
    severity: 'major',
    hits: ['A', 'B'],
  },
  {
    id: 'simulation-no-variation',
    label: 'Simulation with no variation',
    detail:
      'A simulation that returns the identical value on every run produces no uncertainty and no spread, ' +
      'so there is almost nothing to analyse or evaluate.',
    severity: 'major',
    hits: ['B', 'D'],
  },
  {
    id: 'class-duplicate-risk',
    label: 'Overlaps with classmates',
    detail:
      'Group work is capped at three students and no two may submit the same raw data set. If the idea is ' +
      'a common one, the point of difference must be settled up front.',
    severity: 'minor',
  },
  {
    id: 'duplicate-with-ee',
    label: 'Same work as the Extended Essay',
    detail: 'The same investigation cannot be submitted as both an IA and an EE.',
    severity: 'minor',
  },
  {
    id: 'unrealistic-range',
    label: 'Range not realistic for the system',
    detail:
      'The values chosen have to make sense for the system being studied. Testing sea water at 50 °C when ' +
      'the warmest surface sea is near 32 °C signals weak understanding of the context.',
    severity: 'minor',
    hits: ['A'],
  },
  {
    id: 'vague-outcome-terms',
    label: 'Vague outcome wording',
    detail:
      'Words like "efficient", "better" or "suitable" in the research question have no measurable meaning. ' +
      'State what is actually being measured.',
    severity: 'minor',
    hits: ['A'],
  },
  {
    id: 'background-too-general',
    label: 'Background too general',
    detail:
      'The theoretical background has to be directly relevant to this question. A broad survey of the ' +
      'field caps the first strand of research design.',
    severity: 'minor',
    hits: ['A'],
  },
];

const IB_SCIENCES_RULESET: TopicRuleSet = {
  rubricId: 'ib-ia-sciences',
  label: 'IB Sciences IA (Biology / Chemistry / Physics)',
  contexts: IB_SCIENCES_CONTEXTS,
  rules: IB_SCIENCES_RULES,
  titleGuidance: [
    'The research question must name the independent and dependent variable, or the two variables being related.',
    'It must include a brief description of the system, not just the variables in the abstract.',
    'Avoid immeasurable words — say what is measured and in what units.',
  ],
  dataGuidance: [
    'At least five levels of the independent variable when looking for a trend; four only with a stated reason.',
    'Repeats are not fixed at a number but must be justified.',
    'Control variables need a stated method of control, not just a name.',
    'Uncertainty is planned before collection in physics and chemistry, not added afterwards.',
    'The sample or material must be described well enough for someone else to obtain the same thing.',
  ],
  scopeNote:
    'This tool does not design the experiment. It suggests investigations and rules them out. ' +
    'Take the shortlist to your teacher before you start collecting.',
};
/* ------------------------------------------------------------------ */
/* Registry                                                            */
/* ------------------------------------------------------------------ */

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