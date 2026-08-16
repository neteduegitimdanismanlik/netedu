// app/rubrics/mathematics.ts
//
// IB Mathematics — the exploration (IA). Five criteria, 20 marks.
// One rubric serves all four combinations: AA and AI, SL and HL.
//
// The AA and AI criterion tables are word-for-word identical, and IB publishes
// the assessed exemplars jointly for both courses. Criteria A to D are identical
// at SL and HL too; criterion E is the only thing that changes with level, and
// its maximum is 6 either way, so the total stays 20. Level therefore travels as
// a parameter (needsLevel: true), not as a second rubric.
//
// Source: AA guide, AI guide, both TSMs, and seven exemplars marked against the
// 2021 criteria with moderator commentary. IB sentences are never reproduced.
//
// NOT SHIPPED: the ~200 sample IA titles in the TSM appendix. Only the category
// names were taken — those titles come from work that attained a variety of
// marks, so they carry no quality signal.

import type { ExtendedRubric } from './rubrics-extra'
import type { MarkingModel } from './checker-guards'
import type { TopicRuleSet } from './topic-rules'
import type { SubjectExemplars } from './topic-exemplars'

const MATHS = ['Mathematics']

/* ------------------------------------------------------------------ */
/* Rubric                                                              */
/* ------------------------------------------------------------------ */

export const mathematicsRubric: ExtendedRubric = {
  id: 'ib-ia-maths',
  framework: 'IB',
  documentType: 'Internal Assessment',
  label: 'IB — Internal Assessment (Mathematics, the exploration)',
  totalMax: 20,
  shape: 'single',
  weight: 20,

  // DOGRULANMADI: the IB does not publish grade boundaries for the exploration
  // in isolation. The scale below is an in-product estimate only and should not
  // be presented to a student as a predicted grade.
  gradeScale: [
    { grade: '7', min: 17 },
    { grade: '6', min: 15 },
    { grade: '5', min: 12 },
    { grade: '4', min: 9 },
    { grade: '3', min: 7 },
    { grade: '2', min: 4 },
    { grade: '1', min: 0 },
  ],

  wordCount: {
    limit: 20,
    unit: 'pages',
    hard: false,
    included: ['diagrams', 'graphs'],
    excluded: ['bibliography'],
  },

  guidance:
    'One individual mathematical exploration, marked out of 20 and worth 20% of the subject grade at both SL and HL. Criteria A to D are identical for SL and HL and identical for analysis and approaches and applications and interpretation. Criterion E is the only thing that changes with level, and it does not change with course; its maximum is 6 either way. Length guidance is roughly 12 to 20 pages at double line spacing, counting diagrams and graphs, not counting the bibliography — this is guidance, not a limit. Work may fall short of 12 pages, and diagram-heavy work may exceed 20. There is no length penalty and no cap; excess length reaches the mark only through conciseness in criterion A. The cover page must state the title and the number of pages. References are not assessed; their absence is an academic honesty matter, not a rubric one. Marking is best-fit and criterion-referenced: compensate across aspects within a criterion, award the mark that most fairly reflects the balance, and do not require every element of a descriptor to be met. Whole numbers only.',

  criteria: [
    {
      id: 'A',
      name: 'Presentation',
      max: 4,
      verbLadder: 'quality',
      description:
        'Organization and coherence of the exploration as a piece of writing. Coherent means logically developed, easy to follow, and arriving where the stated aim said it would. Well organized means there is an introduction, the aim is stated, and there is a conclusion, with graphs, tables and diagrams placed where the reader needs them rather than pushed into appendices; appendices are for large data sets and supplementary material only. Concise means no irrelevant material and no repeated calculations, graphs or explanations. Technology is not required, and choosing an analytic route over a technological one is not by itself a failure of conciseness.',
      bands: [
        { range: '0', descriptor: 'Falls below the level 1 description' },
        { range: '1', descriptor: 'Either develops logically or shows some structure, but not both' },
        { range: '2', descriptor: 'Develops logically to some degree and shows some structure' },
        { range: '3', descriptor: 'Develops logically and is properly structured' },
        { range: '4', descriptor: 'Develops logically, is properly structured, and carries nothing surplus' },
      ],
      calibration: [
        'Level 3 is the working default for competent work. In seven moderated scripts A was 3 in every single one and 4 was never awarded.',
        'Three of those seven sheets state that 2 was too harsh and 4 too generous, and that best fit produced 3.',
        'What blocked level 4 in the moderated set: an over-long introduction, repeated calculations, performing by hand a computation the reader already accepts, and restating the same coordinates section after section.',
        'A diagram sitting far from the text that discusses it, so the reader must scroll back and forth, was charged to coherence and pulled a script to 3.',
        'Complexity of subject matter is not an excuse for length. Two moderated scripts were called concise given their complexity and still landed on 3.',
        'Do not charge poor notation here — notation belongs to criterion B. One moderator flagged blurry formulas under A only because they impeded readability, and said so explicitly to avoid double-counting.',
      ],
    },
    {
      id: 'B',
      name: 'Mathematical communication',
      max: 4,
      verbLadder: 'quality',
      description:
        'Whether the student used appropriate mathematical language — notation, symbols, terminology; defined key terms and variables where needed; used more than one form of representation where appropriate, such as formulae, diagrams, tables, charts, graphs and models; and set out deductive work and proofs in a logical order where that applied. Calculator and computer notation is acceptable only when it is software generated; otherwise proper mathematical notation is expected.',
      bands: [
        { range: '0', descriptor: 'Falls below the level 1 description' },
        { range: '1', descriptor: 'Some of the mathematical communication present is relevant, and it is only partly fit for purpose' },
        { range: '2', descriptor: 'Some relevant and fit-for-purpose mathematical communication is present' },
        { range: '3', descriptor: 'Communication is relevant, fit for purpose, and holds up across most of the work' },
        { range: '4', descriptor: 'Communication is relevant, fit for purpose, and holds up from start to finish' },
      ],
      calibration: [
        'A single form of representation can reach level 4, provided that form suits the topic. Variety is not a requirement.',
        'At level 4, minor errors that do not impair clear communication are not penalised. One moderated script took 4 with a few lapses that did not impair communication.',
        'Accumulated small slips are what produce 3 rather than 4: unlabelled axes, a missing approximation symbol when values are estimated, subscripts not used where needed, italicised trigonometric notation, a coefficient written against an angle without brackets, undefined variables in one model among several.',
        'Two things sit at level 1: graphs that are not labelled, and consistent calculator or computer notation with no other correct mathematical form alongside it.',
        'Level of accuracy counts here. A script whose accuracy was inconsistent and never discussed was held to 3.',
        'In the moderated set B was 3 five times and 4 twice, and never fell below 3. Reserve 1 and 2 for genuinely confusing or undefined notation.',
      ],
    },
    {
      id: 'C',
      name: 'Personal engagement',
      max: 3,
      verbLadder: 'quality',
      description:
        'The extent to which the student engages with the topic by exploring the mathematics and making it their own. It is not a measure of effort. It may show as thinking independently or creatively, presenting mathematical ideas in the student own way, approaching the topic from more than one perspective, or making and testing predictions. The evidence must be in the work itself; a teacher stating that the student was highly engaged does not count. Textbook-style explorations, and reproductions of readily available mathematics without the student own angle on it, are unlikely to reach the higher levels.',
      bands: [
        { range: '0', descriptor: 'Falls below the level 1 description' },
        { range: '1', descriptor: 'Some personal engagement is evidenced' },
        { range: '2', descriptor: 'Significant personal engagement is evidenced — authentic engagement on a few occasions, visibly driving the exploration forward' },
        { range: '3', descriptor: 'Outstanding personal engagement is evidenced — numerous instances of high quality, driving the work forward creatively, leaving the impression of complete understanding of the context of the topic' },
      ],
      calibration: [
        'C was 3 in six of the seven moderated scripts. On competent work this is not where marks are lost, and a checker that routinely awards 1 or 2 to engaged work is miscalibrated.',
        'An ordinary, frequently chosen topic with unchallenging mathematics still took 3, because the candidate generated their own candidate designs and gave reasons for the one they picked.',
        'What earned 3: investigating a real situation from more than one perspective, self-driven inquiry into unfamiliar mathematics, continually testing better ways to model the same thing, keeping the target audience in view throughout.',
        'The one 2 went to a script whose engagement was real but confined to devising the task and researching new topics, without that engagement continuing to drive the work.',
        'Interest stated once in the introduction and never returned to is level 1 territory.',
        'This criterion survived the 2021 revision. It was not removed. Its maximum dropped from 4 to 3 and the top descriptor changed from abundant to outstanding.',
      ],
    },
    {
      id: 'D',
      name: 'Reflection',
      max: 3,
      verbLadder: 'quality',
      description:
        'How the student reviews, analyses and evaluates the exploration. Reflection may sit in the conclusion but may equally run through the whole report. Simply describing results is limited reflection. Meaningful reflection shows in linking back to the aim, saying what was learned, weighing a limitation, or comparing mathematical approaches. Critical reflection is crucial, decisive or deeply insightful; it usually develops the exploration by taking the mathematical results and working out what they do to the student understanding of the topic. Substantial evidence means the critical reflection runs throughout; if it appears only at the end it has to be of high quality and show how it developed the exploration.',
      bands: [
        { range: '0', descriptor: 'Falls below the level 1 description' },
        { range: '1', descriptor: 'Limited reflection is evidenced' },
        { range: '2', descriptor: 'Meaningful reflection is evidenced' },
        { range: '3', descriptor: 'Critical reflection is evidenced substantially' },
      ],
      calibration: [
        'This is the discriminating criterion on strong work. Across seven moderated scripts D was 3 twice, 2 four times and 1 once, while A, B and C sat flat at 3.',
        'Level 2 is what sincere, continuous, non-decisive reflection produces. Several sheets say the reflection was present at every step and moved the work along, and still stopped at 2.',
        'The recurring reason for capping at 2: judging goodness of fit by eye rather than quantitatively, and asserting that an error of a few per cent validates a model without justifying that claim.',
        'A script that reflected only towards the end took 3, because that closing reflection was thorough and showed clear understanding of the outcomes and their implications. End-loaded reflection is not automatically capped.',
        'Restating a result in words — describing a weak correlation as barely correlating — is level 1, not level 2.',
        'Missed opportunities count: a real-world feature of the situation that obviously bears on the model and is never mentioned pulled one script to 1.',
        'Do not charge the same weakness here and in E. Where a missing goodness-of-fit analysis was already charged to E as a lack of rigour, the moderator deliberately left D untouched.',
      ],
    },
    {
      id: 'E',
      name: 'Use of mathematics',
      max: 6,
      verbLadder: 'quality',
      description:
        'The extent to which the student uses relevant mathematics. This is the one criterion whose ladder differs by level: each band below gives the SL descriptor and the HL descriptor. Score against exactly one of them, the one matching the candidate level, and ignore the other; the maximum is 6 either way. Relevant means mathematics that carries the exploration towards its aim — mathematics made complicated where simple mathematics would have done is not relevant. Work should be commensurate with the level of the course, meaning it should not rest entirely on prior learning. Demonstrated is load-bearing: producing the right answer does not by itself demonstrate understanding. Mathematics counts as correct even with occasional minor errors, so long as they neither disrupt the flow nor lead to an unreasonable outcome; precise mathematics is error-free and holds an appropriate level of accuracy throughout. At HL, sophistication means either HL-level mathematics or SL-level mathematics used in a complex way beyond what an SL student could reasonably be expected to do; rigour means clarity of logic and language, with claims that matter to the exploration justified or proven. Only a few small elements of mathematics may be enough: doing a few things well beats doing many things poorly.',
      bands: [
        { range: '0', descriptor: 'Falls below the level 1 description. Same at SL and HL' },
        { range: '1', descriptor: 'SL: some relevant mathematics appears. HL: some relevant mathematics appears, and the understanding shown is limited' },
        { range: '2', descriptor: 'SL: some relevant mathematics appears, and the understanding shown is limited. HL: some relevant mathematics appears, it is partly correct, and some knowledge and understanding are shown' },
        { range: '3', descriptor: 'SL: the mathematics is relevant and matches the level of the course, and the understanding shown is limited. HL: the mathematics is relevant and matches the level of the course, it is correct, and some knowledge and understanding are shown' },
        { range: '4', descriptor: 'SL: the mathematics is relevant and matches the level of the course, it is partly correct, and some knowledge and understanding are shown. HL: the mathematics is relevant and matches the level of the course, it is correct, and good knowledge and understanding are shown' },
        { range: '5', descriptor: 'SL: the mathematics is relevant and matches the level of the course, it is mostly correct, and good knowledge and understanding are shown. HL: the mathematics is relevant and matches the level of the course, it is correct and shows sophistication or rigour, and thorough knowledge and understanding are shown' },
        { range: '6', descriptor: 'SL: the mathematics is relevant and matches the level of the course, it is correct, and thorough knowledge and understanding are shown. HL: the mathematics is relevant and matches the level of the course, it is precise and shows sophistication and rigour, and thorough knowledge and understanding are shown' },
      ],
      calibration: [
        'On the same script HL is always at or below SL. Across seven moderated scripts the gap was 1 mark four times and 2 marks three times. A checker that scores HL at or above SL for the same work has misread the ladder.',
        'SL ran high in the moderated set: five 6s, one 5, one 4. HL never reached 6 in those same seven; the ceiling in practice was 5.',
        'The single most common HL blocker is precision. One error anywhere, even one corrected on the following line, stops the work being precise and holds HL at 5.',
        'That same error does not necessarily cost anything at SL, where occasional minor errors still count as correct. This asymmetry is the main source of the SL to HL gap.',
        'Absence of an analytic goodness-of-fit test, where a model was fitted, was read as absence of rigour and held HL at 5 despite thorough understanding and sophisticated work.',
        'Using HL-level processes is not the same as sophistication. One script drew on HL content but applied it without sophistication or rigour and took HL 4 against SL 6.',
        'Going beyond the syllabus is not required for the top mark. Two moderated sheets carry an explicit comment that a candidate need not exceed syllabus content to earn top or near-top marks here.',
        'An error running throughout — using circumference where area was needed — still left a script at SL 5 and HL 4, because the rest was correct and understanding was demonstrated.',
        'Where correct steps appear with no statement of the rules being applied to get from one line to the next, understanding is not demonstrated, whatever the answer.',
      ],
    },
  ],
}

/* ------------------------------------------------------------------ */
/* Marking model                                                       */
/* ------------------------------------------------------------------ */

export const mathematicsMarking: MarkingModel = {
  rubricId: 'ib-ia-maths',

  bestFit: [
    'Best fit is explicit in both guides. Compensate when the work matches different aspects of one criterion at different levels, and award the mark that most fairly reflects the balance. Not every element of a descriptor needs to be met.',
    'Where a level covers more than one mark, award the upper mark when the qualities are shown to a great extent and the lower when shown to a lesser extent.',
    'When work seems to sit between two descriptors, read both again and choose the one that describes it better. Do not average, and do not split the difference with a fraction.',
    'The moderated commentaries apply this openly and the phrasing is worth copying: several read that one mark was too harsh and another too generous, so best fit gave the middle one. Say which two marks were in play and why the middle one won.',
    'Apply each criterion independently. A high mark on one implies nothing about the others. There is no expected distribution.',
    'The highest descriptors do not require faultless work. Do not treat level 4 on A or B, or level 3 on C or D, as theoretical.',
    'Never charge the same weakness to two criteria. A missing goodness-of-fit analysis is a lack of rigour under E or a failure of critical reflection under D — pick one.',
    'Whole numbers only, at every criterion and in the total.',
    'Criterion E is the only criterion that differs by level, and the level must be known before it can be scored. Criteria A to D are identical at SL and HL, and all five are identical for analysis and approaches and for applications and interpretation.',
  ],

  zeroRules: [
    'Award 0 on a criterion only when the work does not reach the level 1 description of that criterion.',
    'There is no mechanism for zeroing the whole exploration through the rubric. Length, missing references, absent bibliography, weak topic choice and heavy technology use all reach the mark through the criteria or not at all.',
    'A student who does not submit an exploration receives no grade for mathematics. This is a registration consequence, not a mark to be awarded.',
    'Do not award 0 to criterion C because engagement is asserted rather than shown. If any engagement is evidenced at all, that is level 1.',
  ],

  hardCeilings: [
    {
      when: 'The work produces correct answers without demonstrating understanding — steps stated without the reasoning that justifies them, or values pushed through a formula with no account of what the output means',
      criterionId: 'E',
      max: 1,
      why: 'Obtaining the correct answer is not sufficient to demonstrate understanding, and understanding is required to reach level 2 or higher. A moderated script was marked down specifically for not stating which rules took it from one line to the next.',
    },
    {
      when: 'The exploration repeats calculations, explanations, graphs or descriptions, or carries material irrelevant to its aim — including an over-long introduction or a data table restated section by section',
      criterionId: 'A',
      max: 3,
      why: 'Conciseness is the only thing separating level 4 from level 3, and repetitive or irrelevant material is precisely what is not concise. In seven moderated scripts this held every one of them at 3.',
    },
    {
      when: 'Calculator or computer notation is used consistently in place of proper mathematical notation with no other correct mathematical form alongside it, or graphs go unlabelled throughout',
      criterionId: 'B',
      max: 1,
      why: 'Both of these are named as level 1. Software-generated notation is the only exception, and only where it genuinely is software output.',
    },
    {
      when: 'Critical reflection appears only at the end of the exploration and is not of high quality, or does not show how it developed the exploration',
      criterionId: 'D',
      max: 2,
      why: 'Substantial evidence normally means critical reflection running throughout. End-loaded reflection can still reach 3, but only if it is high quality and demonstrably developed the work.',
    },
    {
      when: 'HL only: the mathematics contains any error, including one corrected on the next line or one whose follow-through work is otherwise sound',
      criterionId: 'E',
      max: 5,
      why: 'Level 6 at HL requires precise mathematics, meaning error-free with appropriate accuracy throughout. Two moderated scripts were held at 5 by a single error. This ceiling does not exist at SL, where occasional minor errors still count as correct.',
    },
    {
      when: 'HL only: mathematical claims that matter to the exploration are asserted rather than justified — most commonly, a model declared a good fit on visual inspection with no analytic goodness-of-fit test',
      criterionId: 'E',
      max: 5,
      why: 'Rigour requires that relevant claims be justified or proven. A moderated script with thorough understanding and sophisticated, beyond-syllabus mathematics was held at 5 for exactly this.',
    },
  ],

  distributionFacts: [
    'Base rates come from seven moderated scripts marked under the 2021 criteria. Small sample; treat as direction, not as quotas.',
    'Criterion A: 3 in seven of seven. Level 4 was never awarded. If a script is heading for A4, check for repetition first.',
    'Criterion B: 3 in five of seven, 4 in two. Never below 3 in that set.',
    'Criterion C: 3 in six of seven, 2 in one. Never below 2.',
    'Criterion D: 3 twice, 2 four times, 1 once. This is where the seven scripts actually separated from each other.',
    'Criterion E at SL: 6 five times, 5 once, 4 once. At HL on the same seven scripts: 5 five times, 4 twice, 3 once, and never 6.',
    'Totals ran 14 to 18 at SL and 13 to 17 at HL. The weakest script lost its marks in D and E; its A, B and C were indistinguishable from the strongest.',
    'The SL to HL gap on criterion E was 1 mark four times and 2 marks three times, and never zero or negative.',
  ],

  sixVersusFour: [
    {
      criterionId: 'A',
      subjects: MATHS,
      six: 'Top mark, 4 of 4 — the report develops logically, is properly structured with an introduction, stated aim and conclusion, places its visuals where the reader needs them, and contains nothing surplus.',
      four: 'Middle mark, 2 of 4 — there is some logical development and some structure, but the reader has to work: the aim is thin or implied, the conclusion partial, and the parts do not obviously connect.',
      movingLine: 'The line between 3 and 4 is conciseness alone, and it is where nearly all real work stops — seven of seven moderated scripts sat at 3. The line between 2 and 3 is whether the reader can follow without backtracking. Do not use A to punish notation.',
    },
    {
      criterionId: 'B',
      subjects: MATHS,
      six: 'Top mark, 4 of 4 — notation, symbols and terminology appropriate and consistent from first page to last, key terms and variables defined where needed, representation suited to the topic. A single form of representation is enough if it is the right one.',
      four: 'Middle mark, 2 of 4 — some relevant, appropriate communication, but patchy: variables undefined in places, terminology drifting, accuracy inconsistent and never discussed.',
      movingLine: 'The line between 3 and 4 is consistency, not variety or volume. Slips that accumulate produce 3; slips a reader does not notice produce 4. Drop to 1 only for unlabelled graphs throughout or wall-to-wall calculator notation.',
    },
    {
      criterionId: 'C',
      subjects: MATHS,
      six: 'Top mark, 3 of 3 — numerous high-quality instances of the student making the work their own, driving it forward creatively: testing successive approaches, coming at the problem from different angles, teaching themselves what they needed.',
      four: 'Middle mark, 2 of 3 — authentic engagement on a few occasions that visibly move the work along, but not sustained through the exploration.',
      movingLine: 'The line is whether the engagement keeps driving the exploration or fires once and stops. Six of seven moderated scripts reached 3, including one on a common topic with easy mathematics, so do not treat 3 as exceptional. Effort is not engagement.',
    },
    {
      criterionId: 'D',
      subjects: MATHS,
      six: 'Top mark, 3 of 3 — critical reflection running through the work: implications of results discussed, strengths and weaknesses of approaches weighed, alternative perspectives taken, next steps considered.',
      four: 'Middle mark, 2 of 3 — meaningful reflection that is sincere and often continuous but never decisive.',
      movingLine: 'This is the criterion that separates strong scripts. The line between 2 and 3 in the moderated set was almost always quantitative justification: models judged by eye rather than by a fit statistic, and error margins declared acceptable without support, capped otherwise excellent work at 2.',
    },
    {
      criterionId: 'E',
      subjects: MATHS,
      six: 'Top mark, 6 of 6, level-dependent. At SL: relevant mathematics at course level, correct, with thorough understanding shown throughout — occasional minor errors do not block this. At HL: the same, but precise rather than merely correct, and showing both sophistication and rigour.',
      four: 'Middle mark, 4 of 6, also level-dependent. At SL: relevant mathematics at course level that is partly correct, with some understanding. At HL: relevant mathematics at course level that is correct, with good understanding — the same script would often be a 6 at SL.',
      movingLine: 'At SL the ladder runs on correctness and depth of understanding. At HL those are assumed by level 4 and the last two marks are bought with sophistication, rigour and precision. At HL one error costs the 6, and unjustified claims cost the 6. Going beyond the syllabus buys nothing on its own.',
    },
  ],

  pitfalls: [
    {
      id: 'maths-correctness-is-everything',
      severity: 'critical',
      subjects: MATHS,
      claim: 'The exploration is essentially a mathematics problem, so accuracy is the score. Flawless work scores high and work with errors scores low.',
      reality: 'Mathematics is one criterion of five and carries 6 of 20. Presentation, communication, engagement and reflection carry 14. In the moderated set a script with errors running through it still took SL 5 on E, while the criterion that actually separated scripts was reflection. A clean but shallow exploration loses in D and C.',
      detector: 'The report justifies its overall mark mainly by counting mathematical errors, or the E mark and the total move together while A to D stay flat across different scripts.',
    },
    {
      id: 'maths-length-as-quality',
      severity: 'high',
      subjects: MATHS,
      claim: 'The exploration should be 12 to 20 pages, so short work is underdeveloped and over-long work should be penalised or capped.',
      reality: 'The 12 to 20 page figure is guidance at double line spacing, counting diagrams and graphs, not counting the bibliography. An exploration may be under 12 pages, and work needing several diagrams may run past 20. There is no cap, no deduction and no hard limit anywhere in the rubric. Length reaches the mark only through conciseness in criterion A, and then only because of repetition or irrelevance.',
      detector: 'The report mentions a page count as a reason for a mark, treats 12 pages as a minimum, or applies a penalty on account of length rather than pointing at specific repeated or irrelevant material.',
    },
    {
      id: 'maths-exotic-topic-bonus',
      severity: 'high',
      subjects: MATHS,
      claim: 'Advanced or unusual mathematics beyond the syllabus signals a strong exploration, and a familiar topic with syllabus-level mathematics cannot reach the top.',
      reality: 'Two moderated sheets say the opposite outright: a candidate need not go beyond the syllabus to produce excellent work deserving the top mark in criterion E. Both took the top SL mark with syllabus mathematics. A script using beyond-syllabus material without sophistication took HL 4. Mathematics made complicated where simple mathematics would do is not relevant, and a few small elements done well beat many done poorly.',
      detector: 'The report rewards the syllabus level of the content itself, describes a topic as too simple or too common to score well, or treats out-of-syllabus techniques as evidence for a high E without asking whether they were understood and explained.',
    },
    {
      id: 'maths-engagement-misread',
      severity: 'high',
      subjects: MATHS,
      claim: 'Personal engagement was dropped in the 2021 revision, or it is decorative framing, or it is measured by how hard the student evidently worked.',
      reality: 'Personal engagement is criterion C and carries 3 marks. What changed in 2021 is that its maximum fell from 4 to 3 and its top descriptor changed from abundant to outstanding. It is not a measure of effort, and the evidence must be visible in the work — a teacher statement does not count. It was 3 in six of seven moderated scripts.',
      detector: 'The report omits criterion C, marks it out of 4, or justifies its mark by how much time or work the student appears to have put in.',
    },
    {
      id: 'maths-technology',
      severity: 'medium',
      subjects: MATHS,
      claim: 'Heavy use of software or a calculator either weakens the exploration, or else the output itself counts as the mathematics.',
      reality: 'Both readings are wrong. Technology is not required but is encouraged, and students are explicitly encouraged to use it to obtain results. Choosing an analytic route instead does not make the work less concise. But understanding still has to be demonstrated: substituting values into a formula does not necessarily demonstrate understanding of the results. Software-generated notation is acceptable under criterion B; hand-written calculator notation is not.',
      detector: 'The report deducts marks for using software, credits an E mark to output presented without interpretation, or flags software-generated notation as a criterion B failing.',
    },
    {
      id: 'maths-aa-vs-ai-expectations',
      severity: 'high',
      subjects: MATHS,
      claim: 'Analysis and approaches explorations should contain proof and pure mathematics, and applications and interpretation explorations should contain data collection and modelling, so each should be judged against those expectations.',
      reality: 'The five criteria in the AA guide and the AI guide are word-for-word identical, including both the SL and HL versions of criterion E, and the moderated exemplars are published jointly for both courses. No criterion mentions proof, data collection or modelling as a requirement of either course. The only content constraint is that the mathematics be relevant and commensurate with the level of the student own course.',
      detector: 'The report expects proof because the course is AA, expects collected data or a fitted model because the course is AI, or names a criterion as course-specific.',
    },
    {
      id: 'maths-hl-standard-at-sl',
      severity: 'critical',
      subjects: MATHS,
      claim: 'Sophistication, rigour and precision are what good mathematics means, so they belong in the judgement whatever the level.',
      reality: 'Those three words appear only in the HL criterion E ladder. The SL ladder runs on relevance, commensurate level, correctness and depth of understanding, and its top mark asks only that the mathematics be correct — with occasional minor errors still counting as correct. Criteria A to D are identical at both levels and contain none of these terms. On every one of seven moderated scripts the HL mark on E was one or two marks below the SL mark for the very same work.',
      detector: 'The report uses the words sophistication, rigour or precision when marking an SL exploration, penalises an SL script for a minor computational error, or produces an SL mark on E at or below the HL mark for the same work.',
    },
    {
      id: 'maths-science-ladder',
      severity: 'high',
      subjects: MATHS,
      claim: 'This is an investigation, so it needs a research question, controlled and independent variables, uncertainty analysis, repeat trials and a sample size justification.',
      reality: 'None of this appears anywhere in the mathematics criteria. The exploration needs a stated aim, not a hypothesis; there are no variables to control, no uncertainties to propagate and no trials to repeat. The requirements around data are different in kind: each student collects their own, pooled group measurements must be described as such, and secondary data needs its source and sampling process stated.',
      detector: 'The report asks for a research question, variables, uncertainties, error bars, repeats or a sample size justification, or marks their absence down under any criterion.',
    },
    {
      id: 'maths-citations-as-criterion',
      severity: 'medium',
      subjects: MATHS,
      claim: 'Sourcing, referencing and academic honesty are part of the mark, so a missing or weak bibliography should cost marks.',
      reality: 'References are not assessed. A missing bibliography may be raised as an academic honesty matter, which is a separate process, but it is not a rubric penalty and no criterion mentions referencing. There is no requirement to use external resource material at all.',
      detector: 'The report deducts under any criterion for citation quality or a missing bibliography, or lists referencing among the assessed elements.',
    },
    {
      id: 'maths-double-penalty',
      severity: 'high',
      subjects: MATHS,
      claim: 'A weakness that touches several criteria should be reflected in each of them.',
      reality: 'The moderated commentaries explicitly refuse this. Where a script fitted models without any analytic goodness-of-fit test, the moderator charged it to criterion E as a lack of rigour and stated that criterion D was therefore left alone, so that a double penalty was avoided.',
      detector: 'The same failing — unjustified fit, weak notation, repetition — appears as a stated reason under two or more criteria.',
    },
    {
      id: 'maths-stale-criteria',
      severity: 'critical',
      subjects: MATHS,
      claim: 'The criteria are Communication, Mathematical presentation, Personal engagement, Reflection and Use of mathematics, with maxima of 4, 3, 4, 3 and 6.',
      reality: 'That is the retired rubric, last examined in 2020, and a large share of the assessed exemplars still in circulation are marked against it. The current criteria are Presentation (4), Mathematical communication (4), Personal engagement (3), Reflection (3) and Use of mathematics (6). Criterion B gained a mark, criterion C lost one, criteria A and B were renamed. The total is 20 under both.',
      detector: 'The report names criterion A as Communication or criterion B as Mathematical presentation, marks B out of 3 or C out of 4, or uses the word abundant for the top of criterion C.',
    },
    {
      id: 'maths-teacher-testimony',
      severity: 'medium',
      subjects: MATHS,
      claim: 'Background information from the teacher about the student engagement or understanding can support a higher mark.',
      reality: 'There must be evidence of personal engagement in the student own work, and a teacher comment that the student was highly engaged is not sufficient. Some older exemplar commentaries lean on teacher background notes, and those predate the 2021 criteria. Judge only what is in the exploration.',
      detector: 'The report cites, or asks for, teacher testimony or classroom context as grounds for a mark on C or E.',
    },
  ],
}

/* ------------------------------------------------------------------ */
/* Topic rules                                                         */
/* ------------------------------------------------------------------ */

export const mathematicsRules: TopicRuleSet = {
  rubricId: 'ib-ia-maths',
  label: 'IB Mathematics IA (the exploration)',

  contexts: [
    { id: 'pure-result', label: 'A pure mathematical result or structure', hint: 'A theorem, identity, sequence or structure explored and where possible justified. Strong fit for rigour at HL. The risk is reproduction: the student must add their own angle, examples or extension.' },
    { id: 'object-geometry', label: 'The geometry of a physical object', hint: 'Measuring or photographing a real object and recovering its shape with functions, curves or solids of revolution. Reliably strong on personal engagement. Watch conciseness — coordinate tables tend to get restated.' },
    { id: 'motion-and-path', label: 'Motion, paths and mechanisms', hint: 'Tracing how something moves and describing that path mathematically. Naturally produces multiple representations for criterion B. Reflection has to go past the model fitting.' },
    { id: 'optimization', label: 'Optimizing a design or a decision', hint: 'Minimizing material, cost, time or distance subject to constraints. A common choice and none the worse for it, but a common topic makes personal engagement harder to evidence.' },
    { id: 'model-fitting', label: 'Fitting a model to collected or sourced data', hint: 'The most common shape and the one that most often stalls on reflection. Fit must be argued quantitatively, not asserted from the look of a graph.' },
    { id: 'relationship-testing', label: 'Testing a relationship between two quantities', hint: 'Correlation and regression on paired data. The mathematics is often light, so the marks live in whether the student justifies the test being appropriate and interprets the result in context.' },
    { id: 'probability-and-games', label: 'Probability, chance and games', hint: 'Analysing a game, a puzzle or a chance process, often alongside simulation. Simulation is good evidence of engagement, but the theoretical treatment has to be there too.' },
    { id: 'algorithmic', label: 'Algorithms, computation and coding', hint: 'Iterative methods, encoding schemes, counting procedures. The recurring failure is describing what an algorithm does without showing why it works.' },
    { id: 'financial-and-social', label: 'Financial, demographic or social quantities', hint: 'Growth, repayment, population or resource questions. Data provenance matters: sourced figures need their origin and sampling stated.' },
    { id: 'pattern-in-art', label: 'Pattern, symmetry, music and design', hint: 'Tiling, harmony, proportion, ornament. Rich in representation, thin in argument unless the student commits to a mathematical question rather than a tour.' },
  ],

  rules: [
    {
      id: 'maths-no-descriptive-topic',
      label: 'The topic must let all five criteria be applied',
      detail: 'A topic has to be chosen so that the assessment criteria can be applied to it. Purely descriptive historical topics are named as an example of what is not appropriate. A survey of a mathematician life, or a narrative account of how a field developed, gives criterion E nothing to grip.',
      severity: 'fatal',
      hits: ['E', 'D'],
    },
    {
      id: 'maths-aim-must-be-stated',
      label: 'A stated aim, and a conclusion that meets it',
      detail: 'Well organized means there is an introduction that describes the aim, and a conclusion. Coherent means the work is logically developed and meets that aim. A brief or implied aim was cited as the reason a moderated script fell to the bottom of criterion A. Note this is an aim, not a research question or a hypothesis.',
      severity: 'major',
      hits: ['A'],
    },
    {
      id: 'maths-own-data',
      label: 'Each student collects their own data',
      detail: 'Where the exploration uses collected information, data or measurements, each student must collect their own, even when measurements come from a group exercise. Pooled group data may be used to give enough for individual analysis, and the pooling must be described. Secondary data needs its source acknowledged and its sampling process stated. Data already submitted for another DP component is discouraged.',
      severity: 'major',
      hits: ['C'],
    },
    {
      id: 'maths-not-a-duplicate',
      label: 'No two explorations the same mathematically',
      detail: 'Students in a class may work in the same area and may even share a title, but no two explorations may be mathematically the same. Class discussion, shared sources and peer feedback are all permitted.',
      severity: 'fatal',
      hits: ['C'],
    },
    {
      id: 'maths-commensurate-level',
      label: 'Mathematics commensurate with the student own course',
      detail: 'The mathematics should not rest entirely on prior learning. It should be syllabus material or at a similar level, and at HL possibly slightly beyond. Work outside the syllabus is not expected and not penalised, but it is also not required for the highest levels — and where it appears it must be explained well enough for the target audience.',
      severity: 'major',
      hits: ['E'],
    },
    {
      id: 'maths-audience-is-a-peer',
      label: 'Write for a fellow student',
      detail: 'The target audience is the student peers: the report should be written so that another student in the class could follow it fairly easily. A moderated script lost the top presentation mark partly for not addressing that audience, and another was faulted for using techniques from outside the syllabus without the explanation the audience would need.',
      severity: 'major',
      hits: ['A', 'B'],
    },
    {
      id: 'maths-no-repetition',
      label: 'Repetition is the standard way marks are lost',
      detail: 'Excessive repetition is the more common failing of mathematical writing, and it is penalised as a lack of conciseness. In the moderated set this meant over-long introductions, calculations performed by hand that added nothing, results tables restated in every section, and explanations given twice. This is why no script in that set reached the top presentation mark.',
      severity: 'major',
      hits: ['A'],
    },
    {
      id: 'maths-visuals-in-place',
      label: 'Graphs, tables and diagrams belong in the text',
      detail: 'Relevant graphs, tables and diagrams should sit with the work they support, not be pushed into appendices. Appendices are for large data sets and additional material. Placing a visual far from the discussion it belongs to costs coherence.',
      severity: 'minor',
      hits: ['A'],
    },
    {
      id: 'maths-define-and-label',
      label: 'Define terms and variables, label everything',
      detail: 'Key terms and variables must be defined where required, and mathematical notation is expected rather than hand-written calculator notation. Unlabelled graphs are an example of the lowest level. In the moderated set the accumulation of small lapses — missing approximation symbols on estimates, absent subscripts, italicised function notation — is what separated 3 from 4.',
      severity: 'major',
      hits: ['B'],
    },
    {
      id: 'maths-accuracy-must-be-discussed',
      label: 'Level of accuracy must be appropriate and consistent',
      detail: 'Inconsistent accuracy that is never discussed was named as a reason for holding a moderated script at 3 on communication, and a failure to justify a chosen degree of accuracy was charged against reflection in another. Precise mathematics, which HL needs for the top mark on E, requires an appropriate level of accuracy throughout.',
      severity: 'minor',
      hits: ['B', 'D'],
    },
    {
      id: 'maths-quantify-the-fit',
      label: 'Justify claims about fit and error quantitatively',
      detail: 'This is the most reliable predictor of a middling reflection mark. Choosing a best-fit model by eye rather than by an analytic goodness-of-fit test, or declaring that an error of a few per cent validates a model without support, held otherwise strong scripts at 2 on reflection and at 5 on HL use of mathematics. Charge it to one criterion, not both.',
      severity: 'major',
      hits: ['D', 'E'],
    },
    {
      id: 'maths-reflection-must-decide',
      label: 'Reflection has to change what the exploration does next',
      detail: 'Describing results is limited reflection. Meaningful reflection links back to the aim, says what was learned, weighs a limitation or compares approaches. Critical reflection is decisive: it considers what comes next, discusses implications, weighs strengths and weaknesses, takes another perspective. Reflection concentrated at the end can still reach the top level, but only if it is of high quality and shows how it developed the work.',
      severity: 'major',
      hits: ['D'],
    },
    {
      id: 'maths-show-the-reasoning',
      label: 'Show why, not just what',
      detail: 'Demonstrate means making something clear by reasoning or evidence. Obtaining the correct answer does not demonstrate understanding, and without demonstrated understanding criterion E cannot pass level 1. In the moderated set, correct steps presented without stating the rules that justified them were marked down.',
      severity: 'fatal',
      hits: ['E'],
    },
    {
      id: 'maths-engagement-in-the-work',
      label: 'Engagement must be visible in the exploration itself',
      detail: 'There must be evidence of personal engagement in the student own work; a teacher stating that the student was highly engaged does not count. Textbook-style explorations and reproductions of readily available mathematics without the student own perspective are unlikely to reach the higher levels. Interest declared once in the introduction and never returned to is the lowest level.',
      severity: 'major',
      hits: ['C'],
    },
    {
      id: 'maths-prior-learning-only',
      label: 'Mathematics below course level',
      detail: 'If the mathematics sits entirely at pre-DP level — means, percentages, simple ratios, bar charts — the topic hits a ceiling on criterion E. Fires when the idea involves only descriptive statistics.',
      severity: 'fatal',
      hits: ['E'],
    },
    {
      id: 'maths-complexity-for-show',
      label: 'Complexity for its own sake',
      detail: 'Heavy machinery where simple mathematics would do does not strengthen a topic; the mathematics has to move the work forward. Fires when a method appears to have been chosen to look difficult. A few things done well beats many done poorly.',
      severity: 'major',
      hits: ['E'],
    },
    {
      id: 'maths-scope-too-broad',
      label: 'Scope too broad',
      detail: 'Ideas chasing several independent questions at once cannot go deep. One well-defined aim is required. Ideas phrased as "I will investigate X" usually land here.',
      severity: 'major',
      hits: ['A', 'E'],
    },
    {
      id: 'maths-data-insufficient',
      label: 'Not enough data for the technique',
      detail: 'If data is used, enough of it must be obtainable for the chosen technique to be valid. Building a regression or a hypothesis test on a tiny sample invalidates the result. Fires when the data source and size are not established up front.',
      severity: 'major',
      hits: ['E', 'D'],
    },
    {
      id: 'maths-title-is-stimulus',
      label: 'Title is just the stimulus',
      detail: 'A bare field name does not say where the work goes. Where a stimulus was used, the title should indicate what the student did with it rather than naming the stimulus.',
      severity: 'minor',
      hits: ['A'],
    },
    {
      id: 'maths-technology-substitution',
      label: 'Feeding numbers into software',
      detail: 'Entering values into a formula or a package and reporting the output does not demonstrate understanding. Technology is unrestricted and encouraged, but the reasoning behind the result has to be shown.',
      severity: 'minor',
      hits: ['E'],
    },
  ],

  levelNotes: {
    SL: 'Only criterion E changes. At SL the ladder runs on relevance, level, correctness and depth of understanding. The top mark asks that the mathematics be correct, and occasional minor errors still count as correct provided they neither break the flow nor produce an unreasonable outcome. Sophistication, rigour and precision are not SL concepts and must not be imported. In the moderated set SL marks on E were 6 five times out of seven.',
    HL: 'Only criterion E changes. Correctness and thorough understanding are already assumed by level 4; the last two marks are bought with sophistication and rigour, and the sixth also requires precision. Sophistication means HL-level mathematics, or SL-level mathematics used beyond what an SL student could reasonably be expected to manage. Rigour means clarity of logic and language, with relevant claims justified or proven. One error anywhere costs the sixth mark. In the moderated set HL never reached 6 and sat one to two marks below SL on every script.',
  },

  titleGuidance: [
    'The title should indicate what the exploration actually pursued, not just the area it started from. If a stimulus was used, the title should show where the stimulus led.',
    'Two students may share a title provided the explorations diverge mathematically.',
    'A title framed as a question the student answers tends to make the aim, and therefore criterion A, easier to satisfy.',
    'Avoid titles that promise a survey or a history. Purely descriptive historical treatments are named as inappropriate.',
    'The title and the page count both belong on the cover page.',
  ],

  dataGuidance: [
    'Data is optional. Nothing in the criteria requires an exploration to have any.',
    'Where data is collected, each student collects their own, even when measurements come out of a shared exercise. Pooled measurements may be used for individual analysis and the pooling must be described.',
    'Secondary data must be acknowledged, and the sampling process behind it stated.',
    'Data already used for another DP component is discouraged; if reused it must be analysed in a genuinely different way, and the teacher must be told.',
    'Large data sets belong in an appendix. The analysis, and the graphs and tables the reader needs to follow it, belong in the body.',
    'Deciding a model fits by eye is the most common single reason strong scripts stall on reflection. Fit needs a quantitative argument.',
  ],

  scopeNote:
    'The exploration is deliberately smaller than an extended essay in mathematics: the criteria are entirely different, and the intention is that the student explores an idea rather than carrying out formal research. A few small elements of mathematics, or a single syllabus topic, can be enough — doing a few things well beats doing many things poorly, and mathematics made complicated where simple mathematics would serve is not relevant. Roughly 12 to 20 pages at double line spacing is the guidance, counting diagrams and graphs and excluding the bibliography, but this is neither a floor nor a ceiling. Length reaches the mark only through conciseness under criterion A.',
}

/* ------------------------------------------------------------------ */
/* Exemplars                                                           */
/* ------------------------------------------------------------------ */

export const mathematicsExemplarsAA: SubjectExemplars = {
  subject: 'Mathematics AA',
  rubricId: 'ib-ia-maths',
  exemplars: [
    {
      title: 'Recovering the profile of a turned object from photographs',
      context: 'object-geometry',
      why: 'Puts the student own measurements at the centre, which makes personal engagement easy to evidence, and gives criterion B several natural representations. Works at either level: SL through piecewise functions and volumes of revolution, HL through curvature or a comparison of analytic and numerical approaches.',
      data: 'The student own photographs or measurements of one physical object. No external data needed.',
      watchOut: 'Coordinate tables get restated section by section and kill conciseness — one table, in an appendix if large. Domain restrictions on piecewise definitions are where errors hide, and at HL a single error costs the top mark. Reflection has to go past the curve matching the photograph.',
    },
    {
      title: 'Why an iterative method converges, and when it does not',
      context: 'algorithmic',
      why: 'Forces the student to explain why a procedure works rather than that it works, which is exactly what criterion E is testing. At HL it opens directly onto rigour: a convergence condition can be argued rather than asserted.',
      data: 'None. Self-generated worked cases, including deliberately chosen failures.',
      watchOut: 'The commonest failure mode is a competent demonstration of the method with no account of the underlying reason, which is what holds criterion E at the lower levels. Also easy to reproduce from a source without adding anything of the student own, which costs criterion C.',
    },
    {
      title: 'A conjecture of the student own, tested and then argued',
      context: 'pure-result',
      why: 'The clearest route to outstanding personal engagement, since the question itself belongs to the student. Making and testing predictions is named in the criterion. At HL the proof supplies rigour; at SL, testing, refining and honestly reporting the limits of a claim is enough.',
      data: 'Self-generated cases.',
      watchOut: 'Ambition outruns the syllabus and the student ends up quoting a result they cannot explain — and unexplained beyond-syllabus material was cited against a moderated script. Better a small claim fully argued. Reflection must engage with what the failed cases meant, not just report them.',
    },
  ],
}

export const mathematicsExemplarsAI: SubjectExemplars = {
  subject: 'Mathematics AI',
  rubricId: 'ib-ia-maths',
  exemplars: [
    {
      title: 'Choosing between competing designs for a real constraint',
      context: 'optimization',
      why: 'Optimization against a constraint the student cares about. Generating their own candidate designs and giving reasons for the one chosen is what earns personal engagement even on a well-worn topic — a moderated script did exactly this and took the top mark on C.',
      data: 'Student-generated designs and measurements, or manufacturer figures with the source stated.',
      watchOut: 'Common topic, so the engagement has to be visible. Surface-area and volume slips propagate through everything downstream. Reflection needs to weigh what the optimum ignores — cost, manufacture, use — not merely report it.',
    },
    {
      title: 'Modelling a process the student can observe repeatedly',
      context: 'model-fitting',
      why: 'Observation the student can run more than once supports both engagement and the comparison of successive models, which is where meaningful reflection comes from.',
      data: 'The student own observations, or pooled group measurements described as pooled.',
      watchOut: 'This shape stalls at reflection level 2 more than any other, because fit is declared from the shape of the graph. A quantitative goodness-of-fit argument is what moves it. Charge a missing one to E or to D, never to both.',
    },
    {
      title: 'Testing whether two published quantities are actually related',
      context: 'relationship-testing',
      why: 'Straightforward statistical machinery, so the marks sit in judgement: whether the test chosen is appropriate, whether the assumptions hold, and what the result means in context. That judgement is criterion D, the criterion that separates scripts.',
      data: 'Published figures, with source and sampling process stated.',
      watchOut: 'Reporting a coefficient and stopping is level 1 reflection — a moderated script was marked down for precisely this. Failing to say why the test suits the data was cited against criterion E in another. Secondary data also makes engagement harder to show, so the question needs to be the student own.',
    },
  ],
}