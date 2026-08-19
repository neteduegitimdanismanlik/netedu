// app/rubrics/language-a-oral.ts
//
// IB Language A — the individual oral. One rubric covers both Literature and
// Language and Literature, and both SL and HL: four criteria of 10 marks each,
// 40 total, same global-issue framing, same best-fit model. Only the task object
// differs (two literary works vs one literary work plus a non-literary body of
// work), and that difference is carried in the topic rules and exemplars.
//
// TARGET: the /oral-exam module, which is a PREPARATION tool, not a marking
// tool. The rubric data exists so the product knows what each criterion is
// looking for.
//
// IMPORTANT DIFFERENCE FROM LANGUAGE B: there is no supervised preparation
// room and no unseen extract. The student chooses their own extracts and global
// issue and submits them for teacher approval at least a week ahead. A tool
// built on the Language B model would wrongly brief students to expect a
// surprise text.
//
// This replaces the unsourced `ib-oral` entry in schema.ts, which was wrong in
// both structure and total (30 marks, 10/10/5/5 against the real 40, 10/10/10/10).
//
// Source: Language A: Language and Literature guide 2026 as the primary source,
// plus five official moderated coversheets (two Literature, three Lang and Lit).
// DOGRULANMADI: no current Literature guide was available; the Literature task
// shape was confirmed from the moderated coversheets only.

import type { ExtendedRubric } from './rubrics-extra'
import type { MarkingModel } from './checker-guards'
import type { TopicRuleSet } from './topic-rules'
import type { SubjectExemplars } from './topic-exemplars'

const LANG_A = ['Language A']

/* ------------------------------------------------------------------ */
/* Rubric                                                              */
/* ------------------------------------------------------------------ */

export const languageAOralRubric: ExtendedRubric = {
  id: 'ib-oral-language-a',
  framework: 'IB',
  documentType: 'Individual Oral',
  label: 'IB — Individual Oral (Language A: Literature and Language and Literature)',
  totalMax: 40,
  shape: 'single',

  // 30% at SL, 20% at HL. The schema holds one number; the SL figure sits here
  // and both appear in guidance. No score is shown to students in any case.
  weight: 30,

  // DOGRULANMADI: no grade boundaries are published for this component alone.
  // Filled so calculateGrade() does not crash.
  gradeScale: [
    { grade: '7', min: 34 },
    { grade: '6', min: 29 },
    { grade: '5', min: 23 },
    { grade: '4', min: 17 },
    { grade: '3', min: 11 },
    { grade: '2', min: 6 },
    { grade: '1', min: 0 },
  ],

  guidance:
    'Fifteen minutes in total: ten minutes of prepared response followed by five minutes of teacher questions. The same criteria apply at SL and HL; only the weighting differs, 30 per cent at SL and 20 per cent at HL. There is no supervised preparation session and no unseen extract. The student selects both extracts themselves and submits them for teacher approval at least a week before the oral, taking into the room only clean unmarked copies and an outline form of at most ten bullet points. Extracts run to roughly 40 lines each, must be a single continuous passage with no ellipsis, and must be roughly balanced in the time and depth they receive. The question and answer section is not scored separately — everything said in it counts toward the same four criteria, and it can raise a mark, as one moderated example shows where the teacher\u2019s questions pulled a previously absent text into the discussion. Language and Literature uses one literary work plus one non-literary body of work; Literature uses two literary works, one read in the original language and one in translation. The constraint here is time, not word count.',

  criteria: [
    {
      id: 'A',
      name: 'Knowledge, understanding and interpretation',
      max: 10,
      verbLadder: 'quality',
      description:
        'How well the student commands both extracts and their source texts, and turns that command into a reading of the global issue backed by well-chosen references.',
      bands: [
        { range: '0', descriptor: 'Below the standard described by band 1-2' },
        { range: '1-2', descriptor: 'Minimal engagement with the extracts and their source texts; the link to the global issue is thin; references are scarce or often off-target' },
        { range: '3-4', descriptor: 'Partial engagement with both extracts and source texts; the global-issue connection is inconsistent; references land on target only occasionally' },
        { range: '5-6', descriptor: 'Adequate command of both extracts and source texts, with a workable reading of their implications for the global issue; references are usually relevant and mostly back up the points made' },
        { range: '7-8', descriptor: 'Strong command of both extracts and source texts, with an interpretation that holds up across the oral; references are apt and reinforce the argument' },
        { range: '9-10', descriptor: 'Authoritative command of both extracts and source texts, with a reading of the global issue that is both original and persuasive; references are precisely chosen and do real argumentative work' },
      ],
      calibration: [
        'The difference between the top two bands is that at the very top the reading is original and persuasive, not just sustained, and references are precisely selected rather than merely relevant.',
        'The middle band is the workable line: the student can state what the extracts imply about the issue, but the interpretation is serviceable rather than compelling.',
        'A near-perfect reading of one of the two texts does not reach the top band if the second gets only passing mention. One moderated example was capped at 8 of 10 for exactly this, despite strong work on the other text.',
      ],
    },
    {
      id: 'B',
      name: 'Analysis and evaluation',
      max: 10,
      verbLadder: 'ao',
      description:
        'How far the student moves past description to analyse and evaluate how authorial choices build the presentation of the global issue in each text.',
      bands: [
        { range: '0', descriptor: 'Below the standard described by band 1-2' },
        { range: '1-2', descriptor: 'Little more than description; authorial choices go unnoticed or are misread in relation to the global issue' },
        { range: '3-4', descriptor: 'Analysis surfaces occasionally but the oral leans on retelling; authorial choices are named without being unpacked against the issue' },
        { range: '5-6', descriptor: 'Analysis is the default mode; evaluation of the extracts and their source texts is generally on target and tied to the issue' },
        { range: '7-8', descriptor: 'Analysis is consistently apt and at times goes beyond the obvious; the link between authorial choice and issue is well explained' },
        { range: '9-10', descriptor: 'Analysis is consistently sharp and often original; the student shows a layered grasp of how choices build the presentation of the issue across both texts' },
      ],
      calibration: [
        'The defining line is description against analysis. The lower half of the scale is dominated by retelling; from the middle band upward the oral has to be analytical in nature, not merely contain some analysis.',
        'Naming a technique — metaphor, structure, diction — is not analysis. One moderated example was marked down because authorial choices were identified but not always analysed.',
        'Useful test: if every sentence that summarises plot or content were removed, would there still be an oral left?',
      ],
    },
    {
      id: 'C',
      name: 'Focus and organization',
      max: 10,
      verbLadder: 'competence',
      description:
        'How well the oral stays on task, gives roughly equal weight to both extracts and their texts, and connects its ideas into a coherent line.',
      bands: [
        { range: '0', descriptor: 'Below the standard described by band 1-2' },
        { range: '1-2', descriptor: 'Task focus is rarely present; ideas sit next to each other rather than connecting' },
        { range: '3-4', descriptor: 'Focus drifts in and out; coverage of the two texts tips toward one side; links between ideas are inconsistent' },
        { range: '5-6', descriptor: 'Focus holds for most of the oral despite occasional slips; coverage of both sides is roughly even; ideas generally follow on from each other' },
        { range: '7-8', descriptor: 'Focus is sustained through nearly all of the oral; both sides get comparable space; the argument develops in a traceable line' },
        { range: '9-10', descriptor: 'Focus never really wavers; both sides get genuinely equal weight; the argument builds in a tight, convincing sequence' },
      ],
      calibration: [
        'This is where imbalance is penalised most directly. Even a well-structured oral that ignores one of the two texts is capped mid-band — one moderated example took 4 of 10 because it made no reference to the works at all.',
        'The middle band survives occasional lapses; the band above requires focus sustained through nearly all of the oral, not just most of it.',
        'A cohesive, well-delivered oral built strictly extract by extract without ever returning to the wider works cannot reach the top band, however polished the delivery.',
      ],
    },
    {
      id: 'D',
      name: 'Language',
      max: 10,
      verbLadder: 'quality',
      description:
        'How clear, accurate and effective the spoken language is, and how well register, tone and rhetorical choices fit the task. This means vocabulary, syntax and style as choices of wording — not pronunciation or delivery mechanics.',
      bands: [
        { range: '0', descriptor: 'Below the standard described by band 1-2' },
        { range: '1-2', descriptor: 'Language repeatedly gets in the way of the message; word choice and sentence-building are imprecise and often wrong; register, tone and rhetorical shaping do not fit the task' },
        { range: '3-4', descriptor: 'Language is understandable most of the time but slips still interfere occasionally; vocabulary and sentence-building are frequently imprecise; stylistic choices often do not fit the task' },
        { range: '5-6', descriptor: 'Language gets the message across without real interference from errors; vocabulary and sentence-building suit the task but stay basic and repetitive; stylistic choices fit the task without adding to it' },
        { range: '7-8', descriptor: 'Language is precise enough that only occasional slips appear and they do not interfere; vocabulary and sentence-building are varied and well suited; stylistic choices start to enhance the oral' },
        { range: '9-10', descriptor: 'Language is clear, accurate and varied enough to create effect; occasional slips never interfere; stylistic choices actively enhance the oral' },
      ],
      calibration: [
        'This criterion does NOT test pronunciation or intonation the way the Language B language criterion does. The prompts are about vocabulary, syntax, register, tone and rhetorical devices as choices of wording.',
        'The main threshold is between basic-but-correct and genuinely varied. At the middle band vocabulary and syntax are correct but simple and repetitive.',
        'A student can be accurate throughout and still be capped mid-band if style choices are absent or flat. One moderated example took 6 of 10 for being clear but unambitious with no attempt at style.',
        'Across the five moderated examples this was the most stable criterion, never the lowest score, ranging 6 to 9. Language accuracy is rarely what separates a mid oral from a strong one in this course.',
      ],
    },
  ],
}

/* ------------------------------------------------------------------ */
/* Marking model                                                       */
/* ------------------------------------------------------------------ */

export const languageAOralMarking: MarkingModel = {
  rubricId: 'ib-oral-language-a',

  bestFit: [
    'Read every band from the bottom until you reach the first descriptor that no longer fits. The mark sits at the last one that did fit, not at the first one that sounds impressive.',
    'A single strong passage does not lift a criterion on its own if it is not sustained across the whole oral. Sustained is doing real work in the upper bands specifically.',
    'The four criteria are judged independently. A student weak on analysis can still be strong on focus.',
    'THIS TOOL IS A PREPARATION AID, NOT A MARKING TOOL. The rubric text exists so the product knows what each criterion is looking for. Do not present a score to the student.',
    'A transcript cannot show fluency, pauses, self-correction or whether an oral sounded rehearsed. Those signals appear in moderator comments but come from listening, not from reading.',
    'Speech recognition misreads words. A single out-of-context substitution that does not fit the surrounding syntax is far more likely a transcription artefact than a language error.',
  ],

  zeroRules: [
    'A missing or non-compliant extract for one of the two texts does not zero a criterion — it caps it. One moderated example scored in the middle band across all four criteria despite one extract never being submitted at all.',
    'A criterion reaches zero only when there is essentially nothing to credit against it, not merely when the work is imperfect.',
    'Because this tool does not produce marks, these rules exist to explain the shape of the scale rather than to be applied.',
  ],

  hardCeilings: [
    {
      when: 'One of the two required texts receives only passing or superficial reference',
      criterionId: 'A',
      max: 8,
      why: 'Directly evidenced: a moderated example was capped at 8 of 10 specifically because the body of work got only passing reference, even though the treatment of the other text was strong.',
      scope: 'instance',
    },
    {
      when: 'The oral gives one of the two texts no reference at all, or an extract for one text is missing or non-compliant',
      criterionId: 'C',
      max: 6,
      why: 'Evidenced across two moderated examples — one with a missing extract, one that made no reference to the works — both capped at or below 6 of 10 on focus and organization for this reason.',
      scope: 'instance',
    },
    {
      when: 'The oral is mostly descriptive retelling with authorial choices only named, not unpacked',
      criterionId: 'B',
      max: 4,
      why: 'This is the definition of the 3-4 band. A report should not credit the band above while flagging heavy retelling in its own feedback.',
      scope: 'instance',
    },
  ],

  distributionFacts: [
    'Across five moderated examples — two Literature, three Language and Literature — the lowest of the four criteria was A or C in four cases. The recurring weak point is insufficient return to the second text, not language quality.',
    'Criterion D was the most stable across all five, never the lowest score, ranging 6 to 9 of 10.',
    'The totals were 37, 35, 23, 22 and 18 out of 40.',
    'Both high-scoring examples still drew comments about a rehearsed or mechanical delivery. That affected the language criterion only and did not prevent a high overall mark. Treat sounding rehearsed as language-specific feedback, not a whole-oral failure — and note a transcript cannot detect it at all.',
  ],

  sixVersusFour: [
    {
      criterionId: 'A',
      subjects: LANG_A,
      six: 'Both texts are covered with usable, mostly relevant references, and the reading of the global issue is stated even if not sharply defined from the outset.',
      four: 'One text, often the second, gets only passing or generic treatment; references to it are infrequent or loosely connected to the issue.',
      movingLine: 'The line is not depth on one text — it is whether both texts get referenced with a working connection to the issue. A brilliant reading of the first text and a thin gesture at the second sits in the middle, however good the first-text material is.',
    },
    {
      criterionId: 'B',
      subjects: LANG_A,
      six: 'The oral is recognisably analytical: authorial choices are identified and their link to the global issue is reasonably explained, even if not insightfully.',
      four: 'The oral names techniques but mostly narrates what happens in the extract; analysis appears in patches between description.',
      movingLine: 'If you removed every sentence that summarises plot or content, would there still be an oral left? At the lower band, removing the summary leaves very little.',
    },
    {
      criterionId: 'C',
      subjects: LANG_A,
      six: 'Both texts get roughly comparable time and the oral does not lose its thread, even if a few transitions are rough.',
      four: 'One text dominates the running time, or the oral drifts off the global issue for stretches, even where individual sections are locally coherent.',
      movingLine: 'Balance of attention is the most checkable signal here. Working from a transcript you can estimate the words devoted to each text and flag a skew before reading for coherence at all.',
    },
    {
      criterionId: 'D',
      subjects: LANG_A,
      six: 'Vocabulary and sentence-building are accurate enough not to interfere, but stay safe and repetitive; register fits the task without adding anything.',
      four: 'Errors are frequent enough to occasionally slow the listener down; word choice is often approximate rather than precise.',
      movingLine: 'The line is whether errors interfere with communication, not whether they exist. Error-free speech is not the bar.',
    },
  ],

  pitfalls: [
    {
      id: 'la-recognition-errors-as-language-errors',
      severity: 'critical',
      subjects: LANG_A,
      claim: 'A speech-to-text transcript is reliable evidence of the student\u2019s actual spoken grammar and vocabulary.',
      reality:
        'The transcript is a machine\u2019s best guess. A misrecognised word looks exactly like a grammar or vocabulary error but is not one. Commenting on the language criterion from a transcript risks penalising the recogniser rather than the student.',
      detector:
        'Any flagged error that is a single isolated word substitution — especially a homophone, or a word that does not fit the surrounding syntax at all — should be treated as a likely recognition artefact before it enters feedback.',
    },
    {
      id: 'la-cold-extract-assumption',
      severity: 'critical',
      subjects: LANG_A,
      claim: 'The student receives the extracts cold, under supervised timed preparation, as in Language B.',
      reality:
        'Language A extracts are chosen by the student, submitted for teacher approval at least a week ahead, and rehearsed using an outline form. There is no unseen extract and no prep-room structure in this course.',
      detector:
        'Any prep advice mentioning a supervised preparation period or telling the student they will not know the extract in advance is importing the Language B task shape and must be corrected.',
    },
    {
      id: 'la-essay-structure-expectation',
      severity: 'high',
      subjects: LANG_A,
      claim: 'The oral should show essay structure — introduction, body, conclusion, topic sentences, a written-register argument.',
      reality:
        'This is a spoken task and memorisation is explicitly discouraged. The focus criterion rewards focus and balance between two texts, not essay paragraphing.',
      detector: 'Feedback criticising the absence of a thesis statement or a formal conclusion is importing written-paper criteria. Rewrite it in terms of focus, balance and connection between ideas.',
    },
    {
      id: 'la-global-issue-as-theme',
      severity: 'high',
      subjects: LANG_A,
      claim: 'A broad theme such as gender, power or identity is a valid global issue.',
      reality:
        'A field of inquiry is a starting point, not a usable global issue. The student must narrow it into something specific, transnational and locally felt. Even a high-scoring example was criticised for defining its issue too broadly at first.',
      detector: 'A global issue that is a single noun phrase with no stance, tension or mechanism has not been narrowed. Flag it before recording, not after.',
    },
    {
      id: 'la-summary-as-analysis',
      severity: 'high',
      subjects: LANG_A,
      claim: 'A fluent, well-organised retelling of what happens in the extract counts as analysis.',
      reality:
        'Retelling is the lower-band behaviour regardless of how well delivered it is. Analysis requires explaining how an authorial choice shapes meaning in relation to the global issue.',
      detector: 'Count sentences describing plot events separately from sentences explaining a choice\u2019s effect. A transcript dominated by the first type is a red flag whatever the fluency.',
    },
    {
      id: 'la-qa-scored-separately',
      severity: 'medium',
      subjects: LANG_A,
      claim: 'The five-minute question section is its own scored segment.',
      reality:
        'There is no separate criterion for it. Everything said in the questions counts toward the same four criteria and can raise a mark — one moderated example shows the teacher\u2019s questions pulling a previously absent text into the discussion.',
      detector: 'Any output producing a fifth score or a separate question-and-answer rating does not match how this component works.',
    },
    {
      id: 'la-terminology-as-knowledge',
      severity: 'medium',
      subjects: LANG_A,
      claim: 'Naming literary terms — metaphor, irony, juxtaposition — is itself evidence of strong performance.',
      reality: 'Terminology counts only when tied to interpretation of the global issue. A list of devices without argumentative use does not move the mark.',
      detector: 'For each term used, check that an explanation of effect follows, not just a label.',
    },
    {
      id: 'la-pronunciation-scoring',
      severity: 'medium',
      subjects: LANG_A,
      claim: 'The language criterion covers pronunciation, accent or intonation, as in Language B.',
      reality:
        'The Language A language criterion is about vocabulary, syntax, register, tone and rhetorical devices as choices of wording. There is also no reliable way to judge pronunciation from a transcript.',
      detector: 'Any language feedback referencing pronunciation, accent or intonation should be removed or reframed as a wording point.',
    },
    {
      id: 'la-rehearsed-as-content-problem',
      severity: 'medium',
      subjects: LANG_A,
      claim: 'A rehearsed or mechanical delivery is a knowledge, analysis or focus problem.',
      reality:
        'In the moderated examples, sounding rehearsed was raised specifically as a language observation — it affects how effectively the style lands — not as a content problem. Memorisation is separately discouraged for this reason.',
      detector: 'Keep this scoped to the language criterion, and note that a transcript cannot detect it at all; it requires audio.',
    },
  ],
}

/* ------------------------------------------------------------------ */
/* Topic rules                                                         */
/* ------------------------------------------------------------------ */

export const languageAOralRules: TopicRuleSet = {
  rubricId: 'ib-oral-language-a',
  label: 'IB Language A Individual Oral — global issue and text pairing',

  contexts: [
    { id: 'la-literature', label: 'Language A: Literature', hint: 'Two literary works: one read in the language A studied, one read in translation. No non-literary body of work.' },
    { id: 'la-lang-and-lit', label: 'Language A: Language and Literature', hint: 'One literary work plus one non-literary body of work — a full-length non-literary text, or a set of shorter non-literary texts sharing one text type and one author or creator.' },
  ],

  rules: [
    {
      id: 'la-text-type-pairing-invalid',
      label: 'The pairing does not match the course',
      detail: 'Language and Literature requires one literary work and one non-literary body of work; pairing two literary text types, or two non-literary ones, does not meet the task. Literature requires two literary works. A text by an author on the prescribed reading list, or a widely recognised literary author, cannot be treated as non-literary even where the text type is borderline.',
      severity: 'fatal',
      hits: ['A', 'B', 'C'],
    },
    {
      id: 'la-reused-material',
      label: 'Material already used for another component',
      detail: 'The same material cannot serve both the individual oral and the extended essay, and texts used in the oral must differ from those used in other assessed components.',
      severity: 'fatal',
      hits: ['A'],
    },
    {
      id: 'la-global-issue-too-broad',
      label: 'The global issue is really a field of inquiry',
      detail: 'A field of inquiry such as culture, identity and community is a starting point, not a usable global issue. The issue needs a specific angle, tension or mechanism that is arguable across both texts and fits ten minutes.',
      severity: 'major',
      hits: ['A', 'C'],
    },
    {
      id: 'la-global-issue-too-narrow',
      label: 'The global issue is a plot-specific observation',
      detail: 'An issue framed entirely around one character\u2019s specific situation, with no transnational or wide-scale dimension, will be hard to sustain across two independent texts and ten minutes.',
      severity: 'major',
      hits: ['A', 'C'],
    },
    {
      id: 'la-extract-too-long',
      label: 'The extract is too long to analyse in depth',
      detail: 'Extracts should stay at roughly 40 lines or the equivalent volume for forms where line counting does not apply. An oversized extract crowds out the time needed to develop analysis and return to the global issue.',
      severity: 'major',
      hits: ['A', 'C'],
    },
    {
      id: 'la-extract-not-continuous',
      label: 'The extract is not a single continuous passage',
      detail: 'Extracts must be one uninterrupted passage — no ellipsis, no splicing two separate passages together.',
      severity: 'major',
      hits: ['A'],
    },
    {
      id: 'la-imbalanced-pairing',
      label: 'One text offers far less material than the other',
      detail: 'If one text or extract cannot sustain roughly equal depth compared to the other, the oral risks the most common failure pattern in the moderated examples: strong treatment of one text, thin or absent treatment of the other. This is a selection problem, not a delivery problem, and should be caught before recording.',
      severity: 'major',
      hits: ['A', 'C'],
    },
    {
      id: 'la-weak-connection-to-source',
      label: 'The global issue is barely present in one text',
      detail: 'Both texts must have a clear, demonstrable connection to the chosen issue. If the connection to one is forced or marginal, the student will struggle to find genuine material for it.',
      severity: 'major',
      hits: ['A', 'B'],
    },
    {
      id: 'la-literary-boundary-unclear',
      label: 'The text type sits ambiguously between literary and non-literary',
      detail: 'Language and Literature only. Some text types — autobiography, diary entry, opinion column — can be literary or non-literary depending on the specific text. The course must already have taught and treated the text consistently as one or the other.',
      severity: 'minor',
      hits: ['A'],
    },
  ],

  levelNotes: {
    SL: 'Same criteria, same task, same fifteen minutes. The component is worth 30 per cent of the SL grade.',
    HL: 'Same criteria, same task, same fifteen minutes. The component is worth 20 per cent of the HL grade. Nothing extra is expected.',
  },

  titleGuidance: [
    'A usable global issue names a specific tension or mechanism, not just a domain — how X manifests as Y, rather than simply X.',
    'The issue should be phrasable as something the two texts each take a distinguishable stance on. If both texts would produce identical points, the pairing is too similar to sustain a comparison.',
    'Avoid issues that require the listener to already share your value judgement for the argument to hold. The issue should be explorable, not a foregone conclusion.',
    'Write the issue as one sentence before choosing extracts. If it takes three sentences, it has not been narrowed yet.',
  ],

  dataGuidance: [
    'For Language and Literature, confirm the non-literary author is not on the prescribed reading list and is not widely recognised as a literary writer. That disqualifies the pairing outright.',
    'For borderline text types — memoir, diary entry, opinion column — the student should already know which way the teacher taught the text, and use it consistently.',
    'Check extract length and continuity before the outline form is finalised. Both are compliance issues that show up as capped marks in real moderated examples, not as automatic zeros.',
    'Plan at least two or three concrete references from each text, not just from the one you feel most confident about.',
  ],

  scopeNote:
    'This rule set covers text and global-issue selection only. Delivery, pacing during the recording and the question section are preparation concerns handled by the briefing material below, not by topic rules.',
}

/* ------------------------------------------------------------------ */
/* Exemplars — separate subject values, since getExemplars matches      */
/* the subject string exactly and returns the first hit                 */
/* ------------------------------------------------------------------ */

export const languageAndLiteratureOralExemplars: SubjectExemplars = {
  subject: 'Language A: Language and Literature',
  rubricId: 'ib-oral-language-a',
  exemplars: [
    {
      title: 'Whose voice gets to sound objective? Framing choices in true-crime narration',
      context: 'la-lang-and-lit',
      why: 'Narrow enough for ten minutes: not media bias in general, but one mechanism — narrative framing that reads as neutral but is not — applied to one novel and one podcast body of work.',
      data: 'Literary work: a novel using a first-person unreliable narrator to recount a crime. Body of work: two episodes of a true-crime podcast series by the same host, chosen because both use comparable narration techniques the student can point to concretely — tone, selective detail, direct address.',
      watchOut: 'The trap is treating the podcast episodes as a plot summary exercise instead of analysing how the host\u2019s narration constructs a feeling of objectivity. This pairing only works if the student stays on technique, not content.',
    },
    {
      title: 'Selling belonging: aspirational imagery in identity-based advertising',
      context: 'la-lang-and-lit',
      why: 'Transnational and locally felt — advertising targeting a specific identity group exists across markets — and gives clearly comparable formal material: a poem and a set of print ads both use imagery to construct belonging.',
      data: 'Literary work: a poem constructing cultural identity through recurring visual imagery. Body of work: print advertisements from one brand campaign, chosen because they use deliberate composition, colour and symbolism to sell an identity rather than a product.',
      watchOut: 'Because both texts are imagery-heavy, students default to describing what the images show rather than analysing why that imagery was chosen over alternatives. The oral needs an explicit choice-against-alternative comparison to stay in analysis.',
    },
    {
      title: 'The optimistic body: how fitness-tech marketing rewrites disability narratives',
      context: 'la-lang-and-lit',
      why: 'Specific and arguable: not technology and society broadly, but one recurring claim — that wearable tech fixes or overcomes disability — traceable in both a literary work and a non-literary body of work.',
      data: 'Literary work: a novel or story collection featuring a disabled character whose relationship to assistive technology is a plot thread. Body of work: wearable fitness-tech advertisements or product pages from one company, chosen for their recurring overcoming narrative.',
      watchOut: 'Students are tempted to argue whether the technology is good or bad rather than analysing how each text constructs the overcoming narrative. The issue is about representation and framing, not the merits of the technology.',
    },
  ],
}

export const literatureOralExemplars: SubjectExemplars = {
  subject: 'Language A: Literature',
  rubricId: 'ib-oral-language-a',
  exemplars: [
    {
      title: 'Silence as a survival strategy: what characters choose not to say',
      context: 'la-literature',
      why: 'The issue is a specific narrative technique — deliberate silence and omission — rather than a broad theme like trauma, and both works can plausibly come from different traditions, which the translated pairing requires.',
      data: 'Work in the original language: a novel where a central character\u2019s silences carry as much weight as what is said. Work in translation: a novel from a different tradition where withheld information functions similarly as resistance or survival.',
      watchOut: 'This pairing invites plot comparison — both characters do not talk about their past — instead of technique comparison. The oral needs to stay on how each author constructs silence formally: dialogue gaps, narrative ellipsis, structural pacing.',
    },
    {
      title: 'Who owns the ending? Competing narrators and the unreliability of closure',
      context: 'la-literature',
      why: 'A precise formal issue — how narrative structure withholds or manipulates closure — demonstrably present in two otherwise very different works, giving genuine material for comparison rather than surface thematic overlap.',
      data: 'Work in the original language: a novel with a structurally ambiguous or multiple ending. Work in translation: a play or novel that destabilises closure through an unreliable or shifting narrative perspective.',
      watchOut: 'Because ambiguous endings is a well-worn topic, students default to summarising each possible ending rather than analysing the techniques that produce the ambiguity. Name the specific device in each text: shifting focalisation, contradictory testimony, structural repetition.',
    },
    {
      title: 'The house that remembers: domestic space as political witness',
      context: 'la-literature',
      why: 'Specific and transnational: not home as a theme, but the particular technique of using a physical domestic space to carry political or historical commentary, traceable formally in two works.',
      data: 'Work in the original language: a novel or play where a house or interior is described in ways that encode political or historical memory. Work in translation: a novel from another tradition using a comparable technique, physical space standing in for collective memory.',
      watchOut: 'Students tend to describe the house\u2019s history rather than analysing the formal choices in how the space is described — the structure of the description, recurring imagery, narrative pacing around it. The issue must stay anchored to technique, not setting as content.',
    },
  ],
}

export const languageAOralExemplars: SubjectExemplars[] = [
  languageAndLiteratureOralExemplars,
  literatureOralExemplars,
]

/* ------------------------------------------------------------------ */
/* Preparation briefing material                                       */
/* ------------------------------------------------------------------ */
// Not a schema type. This is what the product shows the student BEFORE they
// record. Derived from the guide's description of what the question section is
// for, and from the pattern in the moderated examples where teacher questions
// pulled a neglected second text into the discussion.

export interface OralPrepBriefing {
  rubricId: string
  questions: { category: string; items: string[] }[]
  selfCheck: { criterionId: string; item: string }[]
  timePlan: { section: string; target: string; what: string }[]
  provisos: string[]
}

export const languageAOralPrep: OralPrepBriefing = {
  rubricId: 'ib-oral-language-a',

  questions: [
    {
      category: 'Testing the global issue',
      items: [
        'If you had to defend your choice of this specific issue, rather than the broader field it came from, in one sentence — what would that sentence be?',
        'Where in each text does this issue actually show up, as opposed to where you are assuming it does?',
        'What would someone who disagreed with your reading point to in the text as evidence against you?',
        'Why these two texts and not two others that also touch this issue?',
      ],
    },
    {
      category: 'Returning to the first text',
      items: [
        'Why do you think the author chose to present that detail the way they did, rather than another way?',
        'How does this extract relate to the rest of the work — does the rest support or complicate what you just argued?',
        'Is there a moment in the wider work that pushes back against the reading you gave?',
        'What effect does that structural or stylistic choice have on how a reader experiences the issue?',
      ],
    },
    {
      category: 'Returning to the second text',
      items: [
        'You spent most of your time on the first text. What does the second one add that the first does not already show?',
        'Where exactly in the second text is the issue visible, beyond the extract you brought?',
        'Who is the intended audience of the second text, and how does that shape how the issue is presented?',
        'If the second text disappeared from your oral entirely, what would your argument lose?',
      ],
    },
    {
      category: 'Comparing the two',
      items: [
        'Where do the two texts actually disagree about this issue, rather than both simply illustrating it?',
        'Which text makes a stronger case for your reading, and why?',
        'Is there a formal or technical similarity in how both texts handle the issue, or are the resemblances only at the level of content?',
      ],
    },
    {
      category: 'Widening the issue',
      items: [
        'Can you think of another text, from this course or outside it, where the same issue shows up differently?',
        'Does your own context change how you read this issue in either text?',
        'If you had a third extract to add from either work, what would it be and why?',
        'What is the most convincing objection someone could raise to your overall argument, and how would you answer it?',
        'Looking back, is there a moment in your prepared response you would now explain differently?',
      ],
    },
  ],

  selfCheck: [
    { criterionId: 'A', item: 'Can I state my global issue in one sentence, and does that sentence name a specific angle rather than a broad topic?' },
    { criterionId: 'A', item: 'Do I have at least two or three concrete references from EACH text, not just from the one I feel most confident about?' },
    { criterionId: 'B', item: 'For every technique I plan to mention, do I have a sentence ready explaining its effect on the global issue, not just its name?' },
    { criterionId: 'B', item: 'If I removed all the what-happens-in-this-extract sentences from my plan, would there still be an argument left?' },
    { criterionId: 'C', item: 'Have I roughly timed how long I plan to spend on each text, and are they close to equal?' },
    { criterionId: 'C', item: 'Does my outline return to the global issue at least once per text, rather than only at the start and the end?' },
    { criterionId: 'D', item: 'Can I speak from my outline as bullet points, or am I planning to read it as a script? Memorising tends to sound mechanical and costs marks here.' },
    { criterionId: 'D', item: 'Have I planned at least one moment where I make a deliberate stylistic choice, rather than only plain description?' },
  ],

  timePlan: [
    { section: 'Opening — framing the global issue', target: '45 seconds to 1 minute', what: 'State the issue in one sentence and name the two texts you will use.' },
    { section: 'First text', target: 'about 4 minutes', what: 'Concrete references from the extract, plus at least one return to the wider work or body of work.' },
    { section: 'Transition', target: '15 to 30 seconds', what: 'Say why you are moving to the second text in terms of the issue — not just that you are moving on.' },
    { section: 'Second text', target: 'about 4 minutes', what: 'Same depth: extract references plus a return to the wider work. The gap between the two texts should be under a minute.' },
    { section: 'Close — synthesis', target: '30 to 45 seconds', what: 'Connect the two texts through the issue. No new material.' },
    { section: 'Questions', target: 'about 5 minutes', what: 'Have someone ask you at least three questions in rehearsal. This section is scored under the same four criteria, not separately.' },
  ],

  provisos: [
    'This tool reads a transcript. It cannot hear pronunciation, intonation, pauses, hesitation or whether the delivery sounds rehearsed — so it will not comment on any of those.',
    'Speech recognition makes mistakes, and a misheard word can look exactly like a language error. Treat anything odd in the transcript as a possible transcription artefact first.',
    'No mark is given. What you get back is feedback on content: whether the issue is narrow enough, whether both texts got comparable attention, and whether the oral argues rather than retells.',
  ],
}