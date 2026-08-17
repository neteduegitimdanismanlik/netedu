// app/rubrics/philosophy.ts
//
// IB Philosophy — philosophical analysis of a non-philosophical stimulus (IA).
// Five criteria, 25 marks. Identical at SL and HL: same task, same criteria,
// same word limit. Only the weighting differs (25% SL, 20% HL).
//
// The stimulus must NOT be a work of philosophy. This is the single rule a
// model is most likely to invert.
//
// PRODUCT LIMIT: the stimulus is often an image, a film scene or audio. This
// tool reads text, so it sees the student's description of the stimulus but
// never the stimulus itself. Criterion A is therefore judged on the description
// alone, and the report must say so.
//
// Source: Philosophy guide (first assessment 2016) and five assessed samples
// with moderator commentary (Feb 2023). Those samples have not been through
// standardisation, so calibration is observed pattern rather than rule.

import type { ExtendedRubric } from './rubrics-extra'
import type { MarkingModel } from './checker-guards'
import type { TopicRuleSet } from './topic-rules'
import type { SubjectExemplars } from './topic-exemplars'

const PHIL = ['Philosophy']

/* ------------------------------------------------------------------ */
/* Rubric                                                              */
/* ------------------------------------------------------------------ */

export const philosophyRubric: ExtendedRubric = {
  id: 'ib-ia-philosophy',
  framework: 'IB',
  documentType: 'Internal Assessment',
  label: 'IB — Internal Assessment (Philosophy, analysis of a non-philosophical stimulus)',
  totalMax: 25,
  shape: 'single',

  // SL weighting. HL is 20% for the same task; the schema holds one number.
  weight: 25,

  // DOGRULANMADI: neither the guide nor the assessed student work pack publishes
  // grade boundaries for this component. The values below are an in-product
  // estimate only.
  gradeScale: [
    { grade: '7', min: 21 },
    { grade: '6', min: 18 },
    { grade: '5', min: 15 },
    { grade: '4', min: 12 },
    { grade: '3', min: 9 },
    { grade: '2', min: 5 },
    { grade: '1', min: 0 },
  ],

  wordCount: {
    limit: 2000,
    unit: 'words',
    hard: true,
    excluded: [
      'bibliography and reference list',
      'the copy of the stimulus, where the stimulus is an image or runs to 200 words or fewer',
      'the description of the stimulus, where the stimulus is longer than 200 words or cannot be reproduced; the description itself may not exceed 200 words',
    ],
    included: [
      'the whole body of the analysis',
      'quotations inside the body',
      'footnotes — the guide excludes only the bibliography and the stimulus copy or description, so footnotes count, and a moderator comment criticises moving argument into footnotes for exactly this reason',
      'headings and subheadings inside the body',
    ],
  },

  guidance:
    'A philosophical analysis of a non-philosophical stimulus: 2,000 words, 25 marks, identical at SL and HL, worth 25 per cent of the SL grade and 20 per cent of the HL grade, with 20 teaching hours. The student picks a stimulus that is not a work of philosophy — a film, an image, an advertisement, a news article, a song lyric, at most two pages of a novel or two scenes of a broadcast — identifies one philosophical issue it raises, and analyses that issue. The stimulus is reproduced if it is an image or runs to 200 words or fewer, and described in no more than 200 words otherwise; either way it sits outside the word count. Marking is best-fit and each criterion is independent. Criteria A, B and C award one mark per level, so there is no upper or lower choice inside a level; only D and E have bands spanning two marks. Going over 2,000 words is not a deduction: material past the limit is simply not read. Group work is not permitted, and the same piece cannot be submitted for both the internal assessment and the extended essay. Three of five published samples took full marks on A, B and C together and still finished between 20 and 25 — the entire spread came from D and E, which carry 14 of the 25 marks. Never treat the philosophical position the student defends as correct or incorrect; the rubric rewards the defence, not the verdict.',

  criteria: [
    {
      id: 'A',
      name: 'Identification of issue and justification',
      max: 3,
      verbLadder: 'competence',
      description:
        'Two things are measured and both must be present: whether a single philosophical issue is named in explicit terms, and whether the student gives a reason for saying that this issue arises from that stimulus. The quality of the stimulus is not marked here, and neither is the truth of the position. What is marked is naming and linking.',
      bands: [
        { range: '0', descriptor: 'Nothing that reaches the level below' },
        { range: '1', descriptor: 'The issue can only be inferred from the discussion and is never stated; no reason is offered for connecting it to the stimulus' },
        { range: '2', descriptor: 'The issue is stated clearly, and some reason is offered for connecting it to the stimulus, though the connection is asserted more than argued' },
        { range: '3', descriptor: 'The issue is stated clearly and in explicit terms, and the reason for connecting it to the stimulus is set out plainly' },
      ],
      calibration: [
        'Full marks in practice: the opening paragraph names one question, then points at the specific feature of the stimulus that produces it. In the 25 of 25 sample the question was set in bold in the first paragraph, and the moderator noted the link back to the stimulus recurring in the middle of the essay and at the end of a later section, not only in the introduction.',
        'Two marks in practice: the issue is real and nameable but sits inside a cluster of neighbouring issues, or the wording of the stimulus element under discussion is imprecise. Both of the 2-mark samples lost the mark this way, one through breadth and one through imprecision.',
        'One mark in practice: the reader has to reconstruct the issue from the argument.',
        'Three of five published samples took all three marks. Treat a mark below 3 as a signal about focus, not about difficulty.',
      ],
    },
    {
      id: 'B',
      name: 'Clarity',
      max: 4,
      verbLadder: 'quality',
      description:
        'Structure, focus and coherence of the response as a whole — whether the reader can follow the route of the argument. This criterion is about architecture, not about grammar, spelling or register.',
      bands: [
        { range: '0', descriptor: 'Nothing that reaches the level below' },
        { range: '1', descriptor: 'Little workable structure, or a recognisable structure that keeps drifting away from the task' },
        { range: '2', descriptor: 'A structured approach is attempted, but the reader is often unsure what point is being made' },
        { range: '3', descriptor: 'Organised and followable from beginning to end' },
        { range: '4', descriptor: 'Tightly organised, focused and coherent; the response holds its shape throughout' },
      ],
      calibration: [
        'Full marks in practice: after each paragraph the reader could name the step of the argument that was just completed. The 22 of 25 sample earned it partly on a short opening paragraph that delivered the issue and the justification at once.',
        'Three versus four: at 3 there is still a plan, but something interrupts it — a repeated point, an unexplained jump, or a paragraph that serves no step.',
        'Two marks in practice: in the 12 of 25 sample the moderator wrote that it was not clear where the arguments were going and that the conclusion was muddled.',
        'This is not a language mark. The published samples are stated to contain spelling and grammatical errors and still reached full marks here.',
      ],
    },
    {
      id: 'C',
      name: 'Knowledge and understanding',
      max: 4,
      verbLadder: 'ao',
      description:
        'Accuracy, relevance and detail of the philosophical material, the quality of the explanation of the issue, and whether philosophical vocabulary is used correctly. Volume of material is not the measure: a survey of many thinkers scores no better than one position explained precisely.',
      bands: [
        { range: '0', descriptor: 'Nothing that reaches the level below' },
        { range: '1', descriptor: 'Very little relevant material; the explanation of the issue barely gets started; philosophical vocabulary is absent or persistently misused' },
        { range: '2', descriptor: 'Some material is present but shaky on accuracy and relevance; the explanation stays at a basic level; philosophical vocabulary appears and is sometimes used correctly' },
        { range: '3', descriptor: 'Material is largely accurate and relevant; the explanation is adequate; philosophical vocabulary appears and is sometimes used correctly' },
        { range: '4', descriptor: 'Material is relevant, accurate and detailed; the explanation of the issue is fully worked out; philosophical vocabulary is used correctly throughout' },
      ],
      calibration: [
        'Levels 2 and 3 use identical wording about vocabulary. The whole difference between them is accuracy and relevance of the material and the depth of the explanation. Do not try to separate 2 from 3 on vocabulary.',
        'Full marks in practice: the named position is explained accurately enough that the explanation goes on to do argumentative work later in the essay.',
        'Two marks in practice: in the 12 of 25 sample a central position was explained only in basic terms and the treatment of a second thinker was confused in places.',
        'Full marks here are entirely compatible with a mid-band D. One sample scored 4 of 4 here and 5 of 8 on analysis because exposition consumed the space analysis needed. A high C is not evidence for a high D.',
      ],
    },
    {
      id: 'D',
      name: 'Analysis',
      max: 8,
      verbLadder: 'dialectic',
      description:
        'Whether the response works on the issue rather than reporting it. Three things move together: how far analysis replaces description, how well examples are chosen and whether they carry weight in the argument, and how counter-arguments are handled. Counter-arguments are a band threshold in this criterion, not an optional extra.',
      bands: [
        { range: '0', descriptor: 'Nothing that reaches the level below' },
        { range: '1-2', descriptor: 'Mainly description; barely any analysis; examples are scarce or missing' },
        { range: '3-4', descriptor: 'Some analysis is present but description still dominates; a few fitting examples appear' },
        { range: '5-6', descriptor: 'Analysis is genuinely present but is not carried through; examples support the argument; counter-arguments are named' },
        { range: '7-8', descriptor: 'Sustained critical analysis; examples are well chosen and load bearing; counter-arguments are named and then analysed convincingly' },
      ],
      calibration: [
        'The 5-6 band is where counter-arguments first appear, and they appear only as named. Naming a counter-argument without answering it caps the work at 6. Answering it convincingly is what opens 7-8.',
        'Top band in practice: the 25 of 25 sample was praised for engaging critically rather than describing, for a range of well explained examples doing supporting work, and for weighing implications on the way to a clear conclusion.',
        'Seven versus eight: at 7 nearly everything is in place. The shortfall is usually one counter-argument left standing, or one example that decorates rather than tests a claim.',
        'Five in practice: two samples landed here for opposite-looking reasons that are the same reason. One filled the space with accurate exposition; the other had analysis present but undeveloped and a large descriptive remainder.',
        'Four or below: the reader is being told what the stimulus contains, or what a theory says, rather than what follows from either.',
        'Across the five published samples this was the largest absolute source of lost marks. It is also the largest criterion, at eight of twenty-five.',
      ],
    },
    {
      id: 'E',
      name: 'Evaluation',
      max: 6,
      verbLadder: 'dialectic',
      description:
        'Whether rival interpretations and points of view are judged rather than reported, whether the main claims are justified, whether one position is held consistently, and whether the conclusion follows from what came before. Which position the student holds is irrelevant to the mark; whether it survives the essay is not.',
      bands: [
        { range: '0', descriptor: 'Nothing that reaches the level below' },
        { range: '1-2', descriptor: 'Barely any weighing of rival readings or points of view; only some of the main claims are justified; there is no conclusion, or the conclusion is off target' },
        { range: '3-4', descriptor: 'Some weighing of rival readings or points of view; many of the main claims are justified; a conclusion is stated but may not sit consistently with the argument' },
        { range: '5-6', descriptor: 'Rival readings or points of view are clearly weighed; all or nearly all of the main claims are justified; one position is held throughout; the conclusion is stated plainly and follows from the argument' },
      ],
      calibration: [
        'Top band in practice: rival positions are assessed rather than summarised, the same position is held from the first page to the last, and the conclusion restates it as something the paragraphs before it have earned. One of five published samples reached this band.',
        'Four in practice: this is the mark for essays that present and even compare several views without ever judging between them. The 22 of 25 sample scored 4 of 4 on knowledge and 7 of 8 on analysis and still stopped at 4 of 6, because the philosophers it cited were reported rather than critically discussed.',
        'Four also covers the essay whose conclusion exists but reads as appended rather than derived.',
        'Two in practice: very limited critical evaluation, with a conclusion that is unclear or does not land.',
        'This is the scarcest band in the rubric. If a report awards 5 or 6, the evidence for judging between positions must be quotable from the work.',
      ],
    },
  ],
}

/* ------------------------------------------------------------------ */
/* Marking model                                                       */
/* ------------------------------------------------------------------ */

export const philosophyMarking: MarkingModel = {
  rubricId: 'ib-ia-philosophy',

  bestFit: [
    'Best fit applies. Judge each criterion on its own. A weak D does not drag B or C down, and a full C is not evidence for D.',
    'A descriptor does not have to hold in every clause for its mark to be awarded. Pick the descriptor that fits the balance of the work.',
    'A, B and C award one mark per level, so there is no upper or lower choice inside a level. Only D and E have bands spanning two marks.',
    'In D and E, give the upper mark of a band to work sitting close to the band above and the lower mark to work sitting close to the band below.',
    'The top descriptors do not require faultless work. Do not withhold a top mark because a better essay is imaginable.',
    'Expect no particular distribution across criteria. Full marks on A, B and C alongside mid-band D and E is a documented pattern, not an inconsistency.',
    'Whole marks only.',
    'Spend the report on D and E. They carry 14 of the 25 marks and produced the entire spread between a 20 and a 25 in the published samples, while A, B and C behave as a competence floor rather than a discriminator.',
    'When D sits at 5 or 6, say which counter-argument was named but left unanswered. When E sits at 3 or 4, name the rival position that was reported rather than judged. That single sentence is the feedback.',
    'The stimulus itself cannot be read by this tool when it is an image, a film scene or audio. Say so in the report, and judge criterion A on the description alone.',
  ],

  zeroRules: [
    'Award 0 on a criterion when the work does not reach even the lowest descriptor for that criterion. Zero is per criterion and is not a verdict on the whole piece.',
    'Material written past 2,000 words is not read and cannot earn marks under any criterion. This includes argument moved into footnotes to get around the limit.',
    'Group-produced work is not accepted for this task.',
    'A piece submitted as the extended essay cannot also be submitted as the internal assessment, and the reverse. Raise this as a matter for the teacher rather than producing a mark.',
    'Only whole numbers are recorded.',
  ],

  distributionFacts: [
    'Five published samples scored 25, 22, 20, 17 and 12 out of 25. These have not been through standardisation, so treat the pattern as indicative.',
    'Criterion A: 3, 3, 3, 2, 2. Maximum reached in three of five.',
    'Criterion B: 4, 4, 4, 3, 2. Maximum reached in three of five.',
    'Criterion C: 4, 4, 4, 3, 2. Maximum reached in three of five.',
    'Criterion D: 8, 7, 5, 5, 4. Top band reached in one of five.',
    'Criterion E: 6, 4, 4, 4, 2. Top band reached in one of five. Three separate samples sat on exactly 4.',
    'Three samples took full marks on A, B and C together, eleven out of eleven, and still finished between 20 and 25. The whole spread came from D and E.',
    'D and E carry fourteen of the twenty-five marks and account for essentially all of the observed differentiation.',
    'Declared word counts were 1998, 2000, 1994, 1957 and 1736. The lowest-scoring sample was also the shortest by a wide margin.',
  ],

  sixVersusFour: [
    {
      criterionId: 'A',
      subjects: PHIL,
      six: 'Full 3 of 3 — one question is named in explicit terms early on, and the specific feature of the stimulus that raises it is pointed at. The link is picked up again later in the essay rather than being made once and dropped.',
      four: '2 of 3 — the issue is nameable but arrives wrapped in two or three neighbouring issues, or the connection to the stimulus is asserted rather than shown.',
      movingLine: 'Cut the issue down to one question and write the sentence explaining why this stimulus, and not some other, raises that question.',
    },
    {
      criterionId: 'B',
      subjects: PHIL,
      six: 'Full 4 of 4 — every paragraph completes an identifiable step and the reader always knows where in the argument they are.',
      four: '3 of 4 — the plan is visible but interrupted by repetition, an unexplained jump, or a paragraph that serves no step.',
      movingLine: 'Find the paragraph that does not advance the argument and either give it a job or delete it.',
    },
    {
      criterionId: 'C',
      subjects: PHIL,
      six: 'Full 4 of 4 — positions are explained accurately and in enough detail that the explanation later does argumentative work, and technical vocabulary is correct throughout.',
      four: '3 of 4 — the material is right but thin, or the vocabulary is only intermittently correct.',
      movingLine: 'Explain one position in the detail the argument will actually need, instead of explaining three at survey depth.',
    },
    {
      criterionId: 'D',
      subjects: PHIL,
      six: '7 or 8 of 8 — analysis runs the length of the essay, examples test claims rather than illustrate them, and counter-arguments are stated at full strength and then answered.',
      four: '5 of 8 — analysis is present but stops short, or shares the essay with a large block of exposition. Counter-arguments are named and left standing.',
      movingLine: 'Take the counter-argument already named and spend a paragraph defeating it.',
    },
    {
      criterionId: 'E',
      subjects: PHIL,
      six: '5 or 6 of 6 — rival positions are judged, one position is held from first page to last, and the conclusion restates that position as something the argument has earned.',
      four: '4 of 6 — rival views are presented, compared, sometimes even lined up neatly, but never weighed; or a conclusion exists that reads as appended rather than derived.',
      movingLine: 'After presenting the rival view, write the sentence saying which side is stronger and why, and make the conclusion repeat that verdict.',
    },
  ],

  pitfalls: [
    {
      id: 'phil-position-correctness',
      severity: 'critical',
      subjects: PHIL,
      claim: 'The philosophical position the student defends can be judged true, sensible or the standard view, and marks lowered where it seems wrong.',
      reality: 'No descriptor in any of the five criteria mentions the correctness of the position. Criterion E rewards holding a position consistently and justifying the claims that support it. The position itself is not assessed.',
      detector: 'Evaluative language about the conclusion rather than about its support: this view is mistaken, most philosophers reject this, a stronger position would have been. Any such phrase attached to a mark is a fault.',
    },
    {
      id: 'phil-stimulus-must-be-philosophical',
      severity: 'critical',
      subjects: PHIL,
      claim: 'The stimulus should be a philosophical source, so a film, an advertisement or a cartoon is a weak choice.',
      reality: 'The task requires a stimulus that is NOT philosophical. Films, images, song lyrics, advertisements, cartoons, news articles, pamphlets, novels and plays are all named as suitable. A work of philosophy is the wrong choice here.',
      detector: 'Any report sentence suggesting the student should have used a philosophical text, or crediting the choice of a philosophical source.',
    },
    {
      id: 'phil-science-ladder',
      severity: 'critical',
      subjects: PHIL,
      claim: 'The task is research, so it needs a hypothesis, variables, a sample, reliability, a methodology section or a discussion of sources of error.',
      reality: 'None of these appears in any of the five criteria. There is no methodology criterion, no data criterion and no evaluation of procedure. Evaluation here means weighing rival positions.',
      detector: 'The terms hypothesis, variable, sample, reliability, valid data, methodology or experimental appearing anywhere in the report.',
    },
    {
      id: 'phil-unseen-stimulus',
      severity: 'critical',
      subjects: PHIL,
      claim: 'Criterion A can be marked as though the stimulus had been inspected, even when it is an image, a film scene or audio that never reached this tool as text.',
      reality: 'The stimulus is very often visual. In the published samples it included a page of a musical score reproduced as an image and a documentary presented through two described extracts. A text-only pipeline sees the description, not the source.',
      detector: 'The submitted text contains an image placeholder, a figure caption, or a paragraph labelled as a description of scenes, and the report does not state that the stimulus itself was not inspected.',
    },
    {
      id: 'phil-summary-as-analysis',
      severity: 'high',
      subjects: PHIL,
      claim: 'A well-written account of what the stimulus shows is analysis and belongs in the upper bands of D.',
      reality: 'Criterion D separates description from analysis explicitly, and the lower two bands are defined by description dominating. The lowest-scoring sample opened with two scenes retold at length and took 4 out of 8.',
      detector: 'The proportion of the work spent restating the stimulus or a theory exceeds the proportion spent drawing consequences, while D is above 6.',
    },
    {
      id: 'phil-names-as-knowledge',
      severity: 'high',
      subjects: PHIL,
      claim: 'The number of philosophers cited is evidence of knowledge and should push C to the top band.',
      reality: 'Criterion C asks for material that is accurate, relevant and detailed, and for an explanation fully worked out. A sample scoring full marks on C still lost analysis marks because exposition crowded out argument, and another lost evaluation marks because the philosophers it cited were reported rather than critically discussed.',
      detector: 'A high C justified by listing names or counting thinkers, rather than by pointing at one explanation that is accurate and load bearing.',
    },
    {
      id: 'phil-first-person-penalty',
      severity: 'high',
      subjects: PHIL,
      claim: 'First-person writing is informal and should cost marks under clarity or evaluation.',
      reality: 'The 25 of 25 sample opens by writing about my stimulus and states I will argue. Criterion E positively requires a position held consistently, which is difficult while avoiding the first person. Register is not a criterion.',
      detector: 'Any report comment recommending a more objective or impersonal voice, or linking first person to a mark.',
    },
    {
      id: 'phil-breadth-as-depth',
      severity: 'high',
      subjects: PHIL,
      claim: 'An essay touching several related issues shows wider understanding and should be rewarded.',
      reality: 'A sample that folded several issues into one question scored 2 on A, 3 on B and 3 on C, and the moderator attributed the loss directly to the breadth of the issue and the inclusion of others alongside it.',
      detector: 'The essay tries to answer more than one distinct question while A is 3 or B is 4.',
    },
    {
      id: 'phil-counterargument-status',
      severity: 'high',
      subjects: PHIL,
      claim: 'Counter-arguments are either decoration that can be ignored, or something every essay must contain in full dialectical form regardless of band.',
      reality: 'Counter-arguments are a threshold inside criterion D. They first enter at the 5-6 band, where being named is enough. Being analysed convincingly is what the 7-8 band adds. Below 5 they are not expected at all.',
      detector: 'D is 5 or 6 with no named counter-argument quotable, or D is 7 or 8 with none answered.',
    },
    {
      id: 'phil-mentioning-is-evaluating',
      severity: 'high',
      subjects: PHIL,
      claim: 'Several viewpoints appearing in the essay is enough for the top evaluation band.',
      reality: 'The top band requires rival readings to be clearly weighed, nearly all claims justified, one position held throughout and a conclusion that follows. A sample that presented and compared multiple views without judging between them was held at 4 of 6.',
      detector: 'E is 5 or 6 but no sentence can be located where the student says which position is stronger and why.',
    },
    {
      id: 'phil-referencing-as-criterion',
      severity: 'medium',
      subjects: PHIL,
      claim: 'Citation style, inconsistent formatting or an untidy bibliography should cost marks.',
      reality: 'None of the five criteria mentions referencing style. Stimulus material must be accurately referenced, but no criterion carries marks for the format of citations.',
      detector: 'A mark justified anywhere by reference to citation format or bibliography layout.',
    },
    {
      id: 'phil-hl-harder',
      severity: 'medium',
      subjects: PHIL,
      claim: 'Higher level candidates should be held to a stricter standard or expected to produce extra content.',
      reality: 'The internal assessment requirements are identical at both levels and one set of criteria covers both. The only difference is the weighting: 25 per cent at SL, 20 per cent at HL.',
      detector: 'Any report sentence raising expectations because the candidate is HL, or referencing the HL extension topic.',
    },
    {
      id: 'phil-wordcount-as-penalty',
      severity: 'medium',
      subjects: PHIL,
      claim: 'Going over 2,000 words means a deduction, and footnotes are automatically outside the count.',
      reality: 'There is no deduction — material beyond 2,000 words is simply not read. Only the bibliography and the stimulus copy or description are excluded; footnotes are not on the exclusion list, and a published moderator comment criticises moving argument into footnotes for exactly this reason.',
      detector: 'The report announces a penalty for length, or accepts a declared word count that excludes footnotes carrying argument.',
    },
    {
      id: 'phil-clarity-as-grammar',
      severity: 'medium',
      subjects: PHIL,
      claim: 'Clarity is marked on sentence-level correctness, spelling and fluency.',
      reality: 'Criterion B is defined by structure, focus, organisation and coherence. The published samples are explicitly noted to contain spelling and grammatical errors, and three of them still reached the top of B.',
      detector: 'A B mark justified by grammar, spelling or awkward phrasing rather than by the order and function of paragraphs.',
    },
  ],
}

/* ------------------------------------------------------------------ */
/* Topic rules                                                         */
/* ------------------------------------------------------------------ */

export const philosophyRules: TopicRuleSet = {
  rubricId: 'ib-ia-philosophy',
  label: 'IB Philosophy IA (analysis of a non-philosophical stimulus)',

  contexts: [
    { id: 'phil-core-being-human', label: 'Core theme: being human', hint: 'Personhood, self, freedom, mind and body, human nature. Compulsory for every candidate, so this is the safest place to anchor an issue.' },
    { id: 'phil-aesthetics', label: 'Optional theme: aesthetics', hint: 'Art, the artist, judgement and taste. Works well with stimuli that are themselves artworks, provided the essay asks a question about art rather than describing the work.' },
    { id: 'phil-epistemology', label: 'Optional theme: epistemology', hint: 'Knowledge, justification, truth, belief. Suits stimuli involving testimony, prediction, evidence or expertise.' },
    { id: 'phil-ethics', label: 'Optional theme: ethics', hint: 'Right action, moral status, moral reasoning. The most crowded choice, so the issue has to be unusually precise to stay distinctive.' },
    { id: 'phil-contemporary-society', label: 'Optional theme: philosophy and contemporary society', hint: 'Technology, media, work, community. Natural home for advertisement, app and news stimuli.' },
    { id: 'phil-religion', label: 'Optional theme: philosophy of religion', hint: 'Existence and nature of the divine, evil and suffering, religious language. Carries a high risk of turning into exposition of standard arguments.' },
    { id: 'phil-science', label: 'Optional theme: philosophy of science', hint: 'Demarcation, method, determinism, responsibility of scientists. Suits stimuli involving forecasts, models or scientific claims in the press.' },
    { id: 'phil-political', label: 'Optional theme: political philosophy', hint: 'Authority, justice, liberty, equality. Suits stimuli about public space, law and institutions.' },
  ],

  rules: [
    {
      id: 'phil-philosophical-stimulus',
      label: 'The stimulus is itself a work of philosophy',
      detail: 'The task requires a non-philosophical stimulus. A philosophical essay, a treatise, an extract from a set text or a popular philosophy video is the wrong kind of source and removes the work the task is asking for, which is to find the issue in something that was not written to raise it.',
      severity: 'fatal',
      hits: ['A'],
    },
    {
      id: 'phil-no-issue-only-topic',
      label: 'The title names a field or a debate instead of a question',
      detail: 'A title of the form this film and the free will debate announces an area, not an issue. Criterion A asks for an issue stated clearly and explicitly. Titles built as a question make that far easier to satisfy, and the two published samples with question-shaped titles both took full marks on A.',
      severity: 'fatal',
      hits: ['A'],
    },
    {
      id: 'phil-issue-too-broad',
      label: 'The question bundles several issues together',
      detail: 'A question carrying two or three issues at once forces the essay to keep changing subject. In a published sample this cost a mark on identification, a mark on clarity and a mark on knowledge simultaneously, because breadth clouded all three.',
      severity: 'major',
      hits: ['A', 'B', 'C'],
    },
    {
      id: 'phil-empirical-question',
      label: 'The question is settled by facts rather than by argument',
      detail: 'If the question could in principle be answered by finding out what happened, what people believe, or what the data show, it is not a philosophical issue and the analysis and evaluation criteria have nothing to bite on.',
      severity: 'fatal',
      hits: ['A', 'D', 'E'],
    },
    {
      id: 'phil-expository-question',
      label: 'The question asks for an account of a theory',
      detail: 'Questions shaped as explain what X argues, or to what extent does theory Y answer problem Z, tend to produce accurate exposition that fills the word limit. A published sample took full marks on knowledge with exactly this shape and was held to 5 out of 8 on analysis, with the moderator writing that too much space went to demonstrating knowledge and not enough to analysis and evaluation.',
      severity: 'major',
      hits: ['D', 'E'],
    },
    {
      id: 'phil-retell-risk',
      label: 'The question can only be answered by narrating the stimulus',
      detail: 'If answering requires walking the reader through the plot, the lyrics or the sequence of the article, the essay will be descriptive by construction. Retelling is what the lower analysis bands describe.',
      severity: 'major',
      hits: ['D'],
    },
    {
      id: 'phil-no-rival-position',
      label: 'No serious opposing position is available',
      detail: 'If nobody informed would disagree, there is no counter-argument to name and nothing to weigh. That closes off the upper band of analysis and the whole of the top evaluation band, which together hold most of the marks.',
      severity: 'major',
      hits: ['D', 'E'],
    },
    {
      id: 'phil-stimulus-not-supplied',
      label: 'The stimulus is neither reproduced nor described',
      detail: 'An image, or a source of 200 words or fewer, must be reproduced with the response. A longer source, or one that cannot be reproduced such as a film scene, must be described. Without either, the justification of the link asked for in criterion A cannot be checked.',
      severity: 'major',
      hits: ['A'],
    },
    {
      id: 'phil-description-over-200',
      label: 'The description of the stimulus runs past 200 words',
      detail: 'Descriptions are capped at 200 words. The cap exists because the description sits outside the word count, so a long description is space taken from nobody.',
      severity: 'minor',
      hits: ['A'],
    },
    {
      id: 'phil-extent-exceeded',
      label: 'More of the source is taken than the limits allow',
      detail: 'From a novel or a play, no more than two pages may be selected for analysis. From a television or radio programme, no more than two scenes. Short sources such as a news article may be analysed whole.',
      severity: 'major',
      hits: ['A'],
    },
    {
      id: 'phil-stimulus-unreferenced',
      label: 'The stimulus carries no accurate reference',
      detail: 'All stimulus material must be accurately referenced. This is a requirement of the task rather than a marked criterion, but an unreferenced stimulus cannot be verified by a moderator.',
      severity: 'minor',
      hits: ['A'],
    },
    {
      id: 'phil-ee-reuse',
      label: 'The same piece is being used for the extended essay',
      detail: 'One piece of work cannot satisfy both the internal assessment and the extended essay. Overlap of subject area is fine; overlap of the submitted piece is not.',
      severity: 'fatal',
      hits: ['A'],
    },
    {
      id: 'phil-group-work',
      label: 'The work was produced collaboratively',
      detail: 'Group work is not permitted for this task. Discussion with the teacher is expected and is not penalised, but the piece must be the work of one student.',
      severity: 'fatal',
      hits: ['A'],
    },
    {
      id: 'phil-thinker-survey',
      label: 'Three or more thinkers are lined up in sequence',
      detail: 'Surveying several philosophers spends the word limit on exposition and leaves nothing for weighing them against each other. One position explained precisely and then tested scores better than three summarised.',
      severity: 'minor',
      hits: ['C', 'D', 'E'],
    },
    {
      id: 'phil-unreadable-stimulus',
      label: 'The stimulus reaches this tool only as an image or a video',
      detail: 'This checker reads text. When the stimulus is a picture, a score, a film clip or audio, the tool can see the description but not the source, and its judgement on the justification of the link is correspondingly limited. Paste the written description alongside the essay so the identification criterion can be judged at all.',
      severity: 'minor',
      hits: ['A'],
    },
  ],

  levelNotes: {
    SL: 'Identical task, identical criteria, identical word limit. The component is worth 25 per cent of the standard level grade.',
    HL: 'Identical task, identical criteria, identical word limit. The component is worth 20 per cent of the higher level grade. Nothing extra is expected and the higher level extension topic does not enter this task.',
  },

  titleGuidance: [
    'Write the title as a question that could be answered yes or no, or with a defended to what extent.',
    'The question should contain the concept at issue, not the name of the stimulus. A title naming only the film or the artwork announces a topic rather than an issue.',
    'One question, not two joined by and.',
    'Test the title by asking who disagrees. If no informed person would, the question is not yet philosophical.',
    'Every published sample also carried a cover line naming the part of the syllabus the exercise relates to, alongside the word count. This is settled practice in the samples rather than a rule stated in the guide, and it costs nothing to follow.',
    'Naming the syllabus area forces a decision about which vocabulary the essay will use, which in turn helps the knowledge criterion.',
  ],

  dataGuidance: [
    'The stimulus is the evidence base. Choose it before choosing the question, then let the question come from a specific feature of it.',
    'Pick a stimulus with one sharp edge rather than a rich one with many. A single cartoon panel or a single advertisement gives a more precise issue than an entire novel.',
    'Reproduce the stimulus if it is an image or runs to 200 words or fewer. Describe it, in 200 words or fewer, if it is longer or cannot be reproduced.',
    'The copy or description sits outside the 2,000 words. The bibliography sits outside as well. Everything else, footnotes included, is inside.',
    'Reference the stimulus accurately, with enough detail that a moderator could locate the exact page, scene or issue.',
    'Return to the stimulus at least once in the middle of the essay and once near the end. In the top-scoring sample the moderator specifically noted connections made in the body of the discussion rather than only at the opening and close.',
    'Philosophical material is the second source. The task does not fix how many thinkers to use, and the samples suggest fewer and deeper beats more and shallower.',
  ],

  scopeNote:
    'One philosophical issue, drawn from one non-philosophical stimulus, argued in 2,000 words to a conclusion the student holds. The stimulus is the starting point and not the subject: nobody is marking how well the film, the picture or the article is understood. Fourteen of the twenty-five marks sit in analysis and evaluation, so the question has to be one that can be argued about, not one that can be explained. Same task, same criteria, same limit at standard and higher level.',
}

/* ------------------------------------------------------------------ */
/* Exemplars                                                           */
/* ------------------------------------------------------------------ */

export const philosophyExemplars: SubjectExemplars = {
  subject: 'Philosophy',
  rubricId: 'ib-ia-philosophy',
  exemplars: [
    {
      title: 'Can a bench be unjust?',
      context: 'phil-political',
      why: 'The stimulus is an ordinary object, so nothing can be scored by describing it, and the essay is pushed immediately into argument. The question has a clean philosophical shape: injustice is normally predicated of agents and institutions, and the question asks whether it can attach to a designed object. That gives a natural rival position — the object is neutral and only the decision to install it can be assessed — which supplies the counter-argument that the analysis criterion needs at its upper bands, and a genuine verdict for the evaluation criterion to land on.',
      data: 'A news photograph of a public bench divided by fixed armrests, or a similar piece of defensive street design. The image is reproduced with the response and referenced to its source. Philosophical material: one worked account of what makes an arrangement unjust, plus whatever is needed to distinguish an unjust arrangement from an unjust act.',
      watchOut: 'The essay quietly becomes an argument about homelessness policy. The moment the question turns into whether cities should do this, the philosophical issue has been swapped for a policy issue and the identification criterion no longer matches what the essay does. Keep the question on whether the predicate applies, not on what should be done.',
    },
    {
      title: 'If my preference was predicted, was it still mine?',
      context: 'phil-core-being-human',
      why: 'A single screenshot generates the issue, so the stimulus stays small and the word limit goes to argument. The question sits in the core theme, which every candidate studies, and it cannot be settled by facts: knowing how accurate the prediction was does not tell you whether the choice belonged to the student. The rival positions are well defined and neither is obviously right, which is what the evaluation criterion needs in order to reward a held position.',
      data: 'A screenshot of a retail or streaming application showing a recommendation labelled as chosen for you, or a discount presented as personalised. Under 200 words of visible text, so the image itself is reproduced with the response and referenced. Philosophical material: one account of what makes an action free, applied to the case where the option set was arranged in advance.',
      watchOut: 'Two drifts. The first turns the essay into a discussion of data privacy, which is an ethical issue about companies rather than a question about the student. The second turns it into a summary of determinism, which fills the knowledge criterion and starves the analysis criterion — the exact pattern that held one published sample to five marks out of eight.',
    },
    {
      title: 'Was the forecast wrong when it gave rain a thirty per cent chance and it rained?',
      context: 'phil-epistemology',
      why: 'The issue is unusually precise for a first attempt, which helps the identification criterion, and it is impossible to answer by retelling the stimulus. It also has a real disagreement behind it about what a probabilistic claim asserts and what would make it false, so counter-arguments are available without being forced. The narrowness is the point: a small question argued properly reaches the upper analysis band more easily than a large one surveyed.',
      data: 'A short comic strip or a reader letter in which someone complains that a weather forecast was wrong after a low-probability event occurred. Under 200 words, so the source is reproduced with the response and referenced. Philosophical material: one account of what makes a claim true or false, applied to claims stated as probabilities rather than as predictions.',
      watchOut: 'The essay slides into explaining how forecasts are produced. That is a factual account of a method and earns nothing under any of the five criteria. The question is about what the claim asserts, not about how it was generated.',
    },
  ],
}