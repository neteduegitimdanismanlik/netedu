// app/rubrics/language-b-oral.ts
//
// IB Language B (SL/HL) and Language ab initio — the individual oral.
// Three rubrics, 30 marks each, four criteria (A 12 · B1 6 · B2 6 · C 6).
//
// TARGET: the /oral-exam module, which is a PREPARATION tool, not a marking
// tool. The rubric data exists so the product knows what each criterion is
// looking for — not so it can produce a score. See the transcript limits below.
//
// Three separate rubrics because the task differs:
//   SL        — presentation from a teacher-supplied VISUAL stimulus
//   HL        — presentation from a ~300-word LITERARY EXTRACT, no visual
//   ab initio — same mechanics as SL, shorter timings, lower Criterion A ceiling
//
// KEY FINDING: B1, B2 and C are word-for-word identical between Language B SL
// and ab initio. The only real text difference is Criterion A's ceiling — ab
// initio never requires idiomatic use. Do not assume ab initio needs an entirely
// separate feedback bank.
//
// TRANSCRIPT LIMITS: browser SpeechRecognition produces text only. Criterion A's
// pronunciation and intonation leg does not exist in a transcript, and Criterion
// C measures real-time interaction that a single-speaker recording cannot show.
// ASR error rates also rise sharply for accented, non-native speech — which is
// exactly the population this course assesses.
//
// Source: Language B guide 2020, ab initio guide 2020, both TSMs, and seven
// moderated examples with examiner commentary.

import type { ExtendedRubric } from './rubrics-extra'
import type { MarkingModel } from './checker-guards'
import type { TopicRuleSet } from './topic-rules'
import type { SubjectExemplars } from './topic-exemplars'

// Partial matching means "Language B" alone will not match "Spanish B", so the
// language names are listed. DOGRULANMADI: not the complete IB language catalogue.
const LANGUAGE_B_SUBJECTS = [
  'Language B', 'English B', 'French B', 'Spanish B', 'German B', 'Mandarin B',
  'Chinese B', 'Japanese B', 'Italian B', 'Arabic B', 'Portuguese B', 'Russian B',
  'Turkish B', 'Korean B', 'Dutch B', 'Swedish B', 'Hindi B',
]

const AB_INITIO_SUBJECTS = [
  'Language ab initio', 'English ab initio', 'French ab initio', 'Spanish ab initio',
  'German ab initio', 'Mandarin ab initio', 'Chinese ab initio', 'Japanese ab initio',
  'Italian ab initio', 'Arabic ab initio', 'Portuguese ab initio', 'Turkish ab initio',
  'Korean ab initio',
]

// DOGRULANMADI: the guide publishes no grade boundaries for this component alone.
// Filled so calculateGrade() does not crash. No score is shown to students.
const ORAL_GRADE_SCALE = [
  { grade: '7', min: 26 },
  { grade: '6', min: 23 },
  { grade: '5', min: 20 },
  { grade: '4', min: 15 },
  { grade: '3', min: 11 },
  { grade: '2', min: 6 },
  { grade: '1', min: 0 },
]

/* ------------------------------------------------------------------ */
/* Shared criteria — B2 and C are identical across all three courses    */
/* ------------------------------------------------------------------ */

const CRITERION_B2 = {
  id: 'B2',
  name: 'Message — Conversation',
  max: 6,
  verbLadder: 'interactive',
  description:
    'How relevant, appropriate and developed the responses are across the stimulus discussion and the general discussion, and how broad they are in scope and depth.',
  bands: [
    { range: '0', descriptor: 'No evidence that reaches the standard described by band 1-2' },
    { range: '1-2', descriptor: 'The student struggles throughout to address the questions; the few appropriate answers are rarely developed; responses stay narrow in scope and depth' },
    { range: '3-4', descriptor: 'Most responses are relevant to the questions asked; most are appropriate and some show development; responses are broadly adequate in scope and depth' },
    { range: '5-6', descriptor: 'Responses stay consistently relevant and show real development throughout; answers are appropriate and developed; scope and depth are broad, including personal interpretation or active attempts to engage the interlocutor' },
  ],
}

const CRITERION_C = {
  id: 'C',
  name: 'Interactive Skills — Communication',
  max: 6,
  verbLadder: 'interactive',
  description:
    'How far the student understands and interacts in real time: quality of comprehension, ability to express ideas, and ability to sustain participation in the conversation. This criterion cannot be judged from a single-speaker transcript.',
  bands: [
    { range: '0', descriptor: 'No evidence that reaches the standard described by band 1-2' },
    { range: '1-2', descriptor: 'Comprehension and interaction are limited; responses in the target language are limited; participation is limited, with most questions needing to be repeated or rephrased' },
    { range: '3-4', descriptor: 'Comprehension and interaction are mostly sustained; the student responds in the target language and mostly shows comprehension; participation is mostly sustained' },
    { range: '5-6', descriptor: 'Comprehension and interaction are consistently sustained; the student responds in the target language and clearly demonstrates comprehension; participation is sustained, including some contributions the student offers on their own initiative' },
  ],
  calibration: [
    'Across all three courses the same axis separates the bands: sustained but purely reactive participation caps at 3-4, while self-initiated contribution is what unlocks 5-6.',
    'One moderated Language B SL example took full marks because the candidate repeatedly moved the conversation forward unprompted. An HL example with relevant, well-handled answers was held at 4 because independent moves were not evident late in the interview.',
    'At ab initio one or two rephrased questions is tolerated inside 3-4 — what caps the mark is the total absence of anything volunteered.',
  ],
}

const CRITERION_B1_VISUAL = {
  id: 'B1',
  name: 'Message — Visual Stimulus',
  max: 6,
  verbLadder: 'quality',
  description:
    'How relevant the ideas are to the chosen visual stimulus, how well the student engages with it in the presentation, and how clearly the ideas are linked to the target culture.',
  bands: [
    { range: '0', descriptor: 'No evidence that reaches the standard described by band 1-2' },
    { range: '1-2', descriptor: 'The presentation drifts from the stimulus or covers only part of it; it stays at a literal, descriptive level; any connection to the target culture is unclear or absent' },
    { range: '3-4', descriptor: 'The presentation stays mostly on the stimulus; the student notices explicit details and adds a basic personal reading; a link to the target culture is present but stays general' },
    { range: '5-6', descriptor: 'The presentation stays consistently on the stimulus and draws on both what is visible and what is implied; description and personal interpretation both appear; the link to the target culture is explicit and clear' },
  ],
}

/* ------------------------------------------------------------------ */
/* Rubrics                                                             */
/* ------------------------------------------------------------------ */

export const languageBOralSL: ExtendedRubric = {
  id: 'ib-oral-language-b-sl',
  framework: 'IB',
  documentType: 'Individual Oral',
  label: 'IB — Individual Oral (Language B SL)',
  totalMax: 30,
  shape: 'single',
  weight: 25,
  gradeScale: ORAL_GRADE_SCALE,
  guidance:
    'Total oral time is 12 to 15 minutes, preceded by 15 minutes of supervised, unaided preparation. Structure: presentation of the chosen visual stimulus for 3 to 4 minutes, follow-up discussion of the stimulus theme for 4 to 5 minutes, then general discussion on at least one theme other than the stimulus theme for 5 to 6 minutes. At the start of preparation the student is shown two visual stimuli — a photo, poster, illustration or advertisement — from two different course themes, each labelled only with its theme name in the target language, with no caption. The student picks one. During preparation the student may write up to 10 bullet-point notes for reference only, never to be read aloud; the stimulus and notes are collected at the end. The component is worth 25 per cent of the final grade. The constraint here is time, not word count.',
  criteria: [
    {
      id: 'A',
      name: 'Language',
      max: 12,
      verbLadder: 'competence',
      description:
        'How successfully the student commands spoken language: range and appropriacy of vocabulary, variety of grammatical structures, accuracy, and how far pronunciation and intonation support or interfere with communication. The pronunciation and intonation leg cannot be judged from a transcript.',
      bands: [
        { range: '0', descriptor: 'No evidence that reaches the standard described by band 1-3' },
        { range: '1-3', descriptor: 'Vocabulary only sometimes fits the task; grammar stays at simple-structure level; errors in basic structures get in the way of understanding; pronunciation and intonation are shaped by other languages the student speaks, with mispronunciations that recur and disrupt comprehension' },
        { range: '4-6', descriptor: 'Vocabulary generally fits the task; some simple structures appear alongside occasional attempts at complex ones; basic grammar is usually accurate but complex structures still slip and sometimes block meaning; pronunciation still shows influence from other languages but rarely blocks understanding' },
        { range: '7-9', descriptor: 'Vocabulary fits the task and shows some variety; a genuine mix of simple and complex structures appears; accuracy is generally solid, with only occasional slips that do not block meaning; pronunciation is easy to follow' },
        { range: '10-12', descriptor: 'Vocabulary is varied and includes deliberate, idiomatic use; a range of structures is used effectively; only minor slips remain in complex structures and they do not interfere; pronunciation and intonation actively help the message land' },
      ],
      calibration: [
        'A moderated example scored 11 of 12. What kept it off the ceiling was not accuracy: three idioms fired in quick succession felt forced and slightly mistimed. The top band is not flawlessness, it is idiomatic use that reads as controlled rather than performed.',
        'Another example sat at 7 of 12 despite vocabulary and grammar that looked solid on paper, because persistent hesitancy in delivery capped demonstrated fluency. Hesitation is treated as a fluency signal even though the band text foregrounds vocabulary and grammar.',
      ],
    },
    CRITERION_B1_VISUAL,
    CRITERION_B2,
    CRITERION_C,
  ],
}

export const languageBOralHL: ExtendedRubric = {
  id: 'ib-oral-language-b-hl',
  framework: 'IB',
  documentType: 'Individual Oral',
  label: 'IB — Individual Oral (Language B HL)',
  totalMax: 30,
  shape: 'single',
  weight: 25,
  gradeScale: ORAL_GRADE_SCALE,
  guidance:
    'Total oral time is 12 to 15 minutes, preceded by 20 minutes of supervised, unaided preparation. Structure: presentation of the chosen literary extract for 3 to 4 minutes, spent mostly on the events, ideas and messages of the extract itself rather than general background on the work; follow-up discussion expanding on that extract for 4 to 5 minutes; then general discussion using one or more of the five course themes as a starting point for 5 to 6 minutes. At the start of preparation the student is shown two extracts of up to roughly 300 words each, one from each of the two literary works studied, and picks one. There is no visual stimulus at HL. Up to 10 bullet-point notes are allowed, for reference only, never read aloud. The component is worth 25 per cent of the final grade. The constraint here is time, not word count.',
  criteria: [
    {
      id: 'A',
      name: 'Language',
      max: 12,
      verbLadder: 'competence',
      description:
        'How successfully the student commands spoken language: range and appropriacy of vocabulary, variety of grammatical structures, accuracy, and how far pronunciation and intonation support or interfere with communication. The pronunciation and intonation leg cannot be judged from a transcript.',
      bands: [
        { range: '0', descriptor: 'No evidence that reaches the standard described by band 1-3' },
        { range: '1-3', descriptor: 'Vocabulary only sometimes fits the task; some simple structures appear with occasional attempts at complexity; errors show up in both simple and complex structures and interfere with meaning; pronunciation is broadly clear but sometimes gets in the way' },
        { range: '4-6', descriptor: 'Vocabulary generally fits the task and shows some variety; a mix of simple and some complex structures is used; basic accuracy holds but complex structures still slip and sometimes block meaning; pronunciation stays generally clear' },
        { range: '7-9', descriptor: 'Vocabulary fits the task, is varied, and includes idiomatic use; a range of structures is used effectively; accuracy is generally solid with only occasional slips that do not block meaning; pronunciation is mostly clear and does not get in the way' },
        { range: '10-12', descriptor: 'Vocabulary is nuanced and deployed specifically to sharpen the message, including purposeful idiom; structures are chosen selectively to enhance communication; only minor slips remain in complex language; pronunciation is consistently clear and actively strengthens the message' },
      ],
      calibration: [
        'A moderated example took 8 of 12: vocabulary varied but used sparingly, complex structures handled skilfully yet delivery tangled at times, and intonation present but not doing the extra work the top band asks for.',
        'Another sat at 2 of 12 with frequent errors, unclear pronoun use causing real misunderstanding, and pronunciation that interfered frequently.',
        'Note the wording difference from SL: the HL lower bands do not attribute pronunciation issues to other languages the way SL does. Do not copy SL framing into HL feedback.',
      ],
    },
    {
      id: 'B1',
      name: 'Message — Literary Extract',
      max: 6,
      verbLadder: 'quality',
      description:
        'How relevant the ideas are to the chosen literary extract, and how well the student engages with the extract itself rather than the wider work.',
      bands: [
        { range: '0', descriptor: 'No evidence that reaches the standard described by band 1-2' },
        { range: '1-2', descriptor: 'The presentation drifts from the extract; use of it stays surface-level; observations and opinions are generic, oversimplified, and largely unsupported by the text' },
        { range: '3-4', descriptor: 'The presentation stays mostly on the extract and handles it competently; some observations and opinions are developed and backed with specific reference to the text' },
        { range: '5-6', descriptor: 'The presentation stays consistently and convincingly tied to the extract; the student uses it effectively; observations and opinions are well developed and clearly supported by specific textual reference' },
      ],
      calibration: [
        'One example took 1 of 6: comments on the author and the novel were offered but their relevance to the specific extract was never established, and observations drifted to other parts of the book. This is a talked-around-the-extract failure, not a language failure.',
        'Another took 4 of 6: it opened with scene context, summarised events, and supported some observations with textual reference — but the balance between summary and developed observation was not convincing enough for the top band. The axis is the ratio of plot summary to developed observation.',
      ],
    },
    CRITERION_B2,
    CRITERION_C,
  ],
}

export const languageAbInitioOral: ExtendedRubric = {
  id: 'ib-oral-ab-initio',
  framework: 'IB',
  documentType: 'Individual Oral',
  label: 'IB — Individual Oral (Language ab initio)',
  totalMax: 30,
  shape: 'single',
  weight: 25,
  gradeScale: ORAL_GRADE_SCALE,
  guidance:
    'Total oral time is 7 to 10 minutes, preceded by 15 minutes of supervised, unaided preparation. Structure: presentation of the chosen visual stimulus for 1 to 2 minutes only — noticeably shorter than Language B — then follow-up discussion of the stimulus theme for 3 to 4 minutes, then general discussion on at least one additional theme for 3 to 4 minutes. Stimulus mechanics are otherwise identical to Language B SL: two visual stimuli from two different themes, labelled only with the theme name, the student picks one, up to 10 bullet-point notes for reference only. The component is worth 25 per cent of the final grade. The constraint here is time, not word count.',
  criteria: [
    {
      id: 'A',
      name: 'Language',
      max: 12,
      verbLadder: 'competence',
      description:
        'How successfully the student commands spoken language at beginner level: range and appropriacy of vocabulary, range of grammatical structures, accuracy, and how far pronunciation and intonation support or interfere with communication. The ceiling here is lower than Language B — idiomatic use is never required.',
      bands: [
        { range: '0', descriptor: 'No evidence that reaches the standard described by band 1-3' },
        { range: '1-3', descriptor: 'Vocabulary rarely fits the task or leans heavily on repeated formulaic phrases; grammar is limited to a narrow set of basic structures; errors in basic structures consistently block meaning; mispronunciation and imprecise intonation recur and interfere with understanding' },
        { range: '4-6', descriptor: 'Vocabulary sometimes fits the task; basic structures are used; errors in basic structures still get in the way of meaning; pronunciation is sometimes unclear with an obvious accent from other languages, and intonation slips may interfere' },
        { range: '7-9', descriptor: 'Vocabulary generally fits the task; a variety of basic structures appear, with some attempts at more complex ones; basic structures are mostly accurate though complex ones still slip, rarely blocking meaning; an accent is present but does not get in the way' },
        { range: '10-12', descriptor: 'Vocabulary fits the task and shows some variety; a range of basic and complex structures is used effectively; only minor, non-blocking errors remain; pronunciation and intonation are generally steady, clear, and support communication' },
      ],
      calibration: [
        'CEILING DIFFERENCE FROM LANGUAGE B: even the top ab initio band only asks for vocabulary that is appropriate and varied. It never requires idiomatic use, and its top descriptor stops at language that supports communication rather than language B\u2019s enhances the message. Scoring an ab initio candidate against the Language B ceiling will systematically under-mark them.',
        'A moderated example took 11 of 12: varied vocabulary, a correctly handled conditional, and only minor non-blocking errors such as irregular plurals. Pronunciation generally consistent and clear. That is what an 11 sounds like at this level — not flawless, but consistently past the line where errors interfere.',
        'Another took 2 of 12: vocabulary limited to single words, sentences that did not make sense, and stretches the examiner flagged as literally incomprehensible.',
      ],
    },
    CRITERION_B1_VISUAL,
    CRITERION_B2,
    CRITERION_C,
  ],
}

export const languageBOralRubrics: ExtendedRubric[] = [
  languageBOralSL,
  languageBOralHL,
  languageAbInitioOral,
]

/* ------------------------------------------------------------------ */
/* Marking models                                                      */
/* ------------------------------------------------------------------ */

const SHARED_BEST_FIT = [
  'Each of the four criteria is applied independently with its own best-fit judgement. A strong Criterion A result does not predict a strong B1, B2 or C result.',
  'Within a band, place the mark at the top if the response is close to the band above, and at the bottom if it is close to the band below. Do not default to the middle.',
  'Only whole numbers. There is no partial-mark averaging across the clauses of a band descriptor.',
  'A response does not need to satisfy every clause of a descriptor to earn that band — find the descriptor that best fits the overall balance of the performance.',
  'THIS TOOL IS A PREPARATION AID, NOT A MARKING TOOL. The rubric text exists so the product knows what each criterion is looking for. Do not present a score to the student.',
  'A transcript cannot show pronunciation, intonation, fluency, pauses or self-correction. Criterion A can only be discussed for vocabulary and structures, and even that carries recognition risk.',
  'If the transcript has no interlocutor turns, Criterion C has no evidence at all. Say so rather than guessing.',
]

const SHARED_ZERO_RULES = [
  'A mark of 0 on any criterion means the performance does not reach the standard described by that criterion\u2019s lowest band. This is the only zero rule stated for this component.',
  'Because this tool does not produce marks, zero rules are here to explain the shape of the scale, not to be applied.',
]

const ASR_PITFALL = {
  id: 'asr-accent-as-error',
  severity: 'critical' as const,
  claim: 'A speech-recognition transcript that looks garbled, repetitive or grammatically broken reflects the student\u2019s actual command of the language.',
  reality:
    'Browser speech recognition error rates rise sharply for accented and non-native speech. Odd word substitutions, missing function words and broken sentence boundaries may be the recogniser mishearing a student who spoke perfectly comprehensibly. The population most likely to trigger recogniser errors is exactly the population this course assesses.',
  detector:
    'Before treating a passage as a language error, check whether it is a plausible mishearing — nonsense word combinations, missing articles in a pattern inconsistent with the rest of the transcript, abrupt non-sequiturs. When in doubt, flag the segment as low confidence rather than commenting on it.',
}

const MONOLOGUE_PITFALL = {
  id: 'interaction-from-monologue',
  severity: 'critical' as const,
  claim: 'Criterion C can be judged from a single-speaker recording the same way it is judged from a full interview.',
  reality:
    'Criterion C measures real-time interaction: comprehension of the questions, sustained participation, and self-initiated contribution. None of this exists in a monologue.',
  detector: 'If the transcript contains no interlocutor turns, say Criterion C could not be assessed. Do not infer it.',
}

const NATIVE_STANDARD_PITFALL = {
  id: 'native-speaker-standard',
  severity: 'high' as const,
  claim: 'The top band of Criterion A requires near-native fluency and accuracy.',
  reality:
    'This is a language-acquisition course. The top band allows for minor errors in complex structures that do not interfere. Marking as if only native-like output qualifies caps every student artificially low.',
  detector: 'Any feedback implying that error-free speech is the bar. The actual bar is that errors do not interfere.',
}

const ACCENT_PITFALL = {
  id: 'accent-as-error',
  severity: 'high' as const,
  claim: 'A detectable accent is itself a language error to comment on.',
  reality:
    'Every band grades whether pronunciation interferes with communication, not whether an accent is present. The lower bands explicitly treat pronunciation influenced by other languages as compatible with the middle band, not just the bottom one.',
  detector: 'Feedback should never cite having an accent as a weakness — only specific instances where a mispronunciation plausibly caused a breakdown in understanding.',
}

const PAUSE_PITFALL = {
  id: 'pause-penalisation',
  severity: 'medium' as const,
  claim: 'Pauses, hesitation and disfluency visible in a timestamped transcript should be commented on as fluency problems.',
  reality:
    'Pauses and hesitation are not visible in plain speech-to-text output at all — timestamps mark word boundaries, not silence quality. Where examiners penalise hesitancy they are listening to a recording, not reading a transcript.',
  detector: 'Do not synthesise a fluency judgement from gaps in timing data. Only use evidence visible in the words themselves.',
}

const NOTES_PITFALL = {
  id: 'prep-notes-assumption',
  severity: 'medium' as const,
  claim: 'A fluent, well-organised presentation implies the notes were used well, or that the student memorised a script.',
  reality:
    'The product has no visibility into the preparation notes — at most 10 bullet points, never read aloud, collected by the teacher. This is a paper artefact outside the product\u2019s input.',
  detector: 'Flag any feedback mentioning notes or reading from a script as unsupported by the available input.',
}

export const languageBOralSLMarking: MarkingModel = {
  rubricId: 'ib-oral-language-b-sl',
  bestFit: SHARED_BEST_FIT,
  zeroRules: SHARED_ZERO_RULES,
  hardCeilings: [
    {
      when: 'The presentation makes no explicit or implicit link to the target culture, even where description and personal interpretation are otherwise strong',
      criterionId: 'B1',
      max: 3,
      why: 'Documented at ab initio, where an examiner capped the mark at 3 of 6 stating the candidate had met every other element of the top band. The SL descriptor carries the identical culture-link clause, so the same risk applies — though this exact failure has not been confirmed against an SL example.',
      scope: 'instance',
    },
  ],
  distributionFacts: [
    'Criterion A alone carries 12 of the 30 marks — the single largest weight, and more than B1 and C combined.',
    'B1, B2 and C are worth 6 each. A student strong on content but weak on delivery can lose more to Criterion A alone than to any content criterion.',
    'B2 and C use text identical to HL and to ab initio. Only Criterion A\u2019s ceiling and B1\u2019s task type actually differ across the three rubrics.',
  ],
  sixVersusFour: [
    {
      criterionId: 'A',
      subjects: LANGUAGE_B_SUBJECTS,
      six: 'Vocabulary is genuinely varied and idiom is used with control rather than merely attempted; complex structures carry only minor slips; pronunciation is easy to follow throughout.',
      four: 'Vocabulary and grammar may look clean on paper, but persistent hesitancy or a forced run of idioms signals the language is not yet internalised.',
      movingLine: 'The line is less about whether errors exist and more about whether delivery is controlled and idiom reads as natural rather than rehearsed.',
    },
    {
      criterionId: 'B1',
      subjects: LANGUAGE_B_SUBJECTS,
      six: 'Explicit and implicit stimulus detail both feature, personal interpretation goes beyond describing the image, and the target-culture link is explicit and developed.',
      four: 'Description is present and a culture link is attempted, but the link stays general or its intention is unclear.',
      movingLine: 'The line is the depth and clarity of the target-culture link, not whether one exists at all. A vague link caps the response even where descriptive content is strong.',
    },
    {
      criterionId: 'B2',
      subjects: LANGUAGE_B_SUBJECTS,
      six: 'Development and relevance hold up across both the stimulus discussion and the general discussion, with outside points of reference and the ability to defend a position under challenge.',
      four: 'One part of the conversation is strong and nuanced but the other is inconsistent, and the weaker part pulls the whole criterion down.',
      movingLine: 'Consistency across the whole conversation decides this, not peak quality in one stretch of it.',
    },
    {
      criterionId: 'C',
      subjects: LANGUAGE_B_SUBJECTS,
      six: 'The student takes the initiative to steer or extend the conversation unprompted, more than once.',
      four: 'Participation is sustained and comprehension is clear, but everything offered is a response to a question and nothing is volunteered.',
      movingLine: 'Self-initiated contribution is the unlock, not accurate responsiveness. This is the most repeated distinguishing signal across the moderated examples.',
    },
  ],
  pitfalls: [
    { ...ASR_PITFALL, subjects: LANGUAGE_B_SUBJECTS },
    { ...MONOLOGUE_PITFALL, subjects: LANGUAGE_B_SUBJECTS },
    { ...NATIVE_STANDARD_PITFALL, subjects: LANGUAGE_B_SUBJECTS },
    { ...ACCENT_PITFALL, subjects: LANGUAGE_B_SUBJECTS },
    { ...PAUSE_PITFALL, subjects: LANGUAGE_B_SUBJECTS },
    { ...NOTES_PITFALL, subjects: LANGUAGE_B_SUBJECTS },
    {
      id: 'content-richness-vs-accuracy',
      severity: 'medium',
      subjects: LANGUAGE_B_SUBJECTS,
      claim: 'Saying something intellectually interesting signals strong language ability.',
      reality:
        'Content richness belongs to B1 and B2. Accuracy, range and delivery belong to Criterion A. Moderated examples show students who develop interesting content well while sitting mid-band on language.',
      detector: 'If one sentence of justification is being used for both Criterion A and B1 or B2, split it — each needs its own evidence.',
    },
    {
      id: 'description-vs-interpretation',
      severity: 'medium',
      subjects: LANGUAGE_B_SUBJECTS,
      claim: 'Describing what is visible in the stimulus counts as the personal interpretation the top band asks for.',
      reality:
        'The descriptors draw a real line between description, present even in the lower bands, and personal interpretation plus implicit detail, required for the top band.',
      detector: 'Check for first-person evaluative or interpretive language about the stimulus before crediting the top band.',
    },
  ],
}

export const languageBOralHLMarking: MarkingModel = {
  rubricId: 'ib-oral-language-b-hl',
  bestFit: [
    ...SHARED_BEST_FIT,
    'The presentation must spend most of its time on the extract itself, not general context about the literary work.',
  ],
  zeroRules: SHARED_ZERO_RULES,
  distributionFacts: [
    'Criterion A carries 12 of the 30 marks, identical to SL and ab initio.',
    'B2 and C use text identical to SL and ab initio. Only Criterion A\u2019s wording nuances and B1\u2019s task type differ from SL.',
    'HL preparation is 20 minutes against 15 at SL, and there is no visual stimulus at all — the presentation is entirely extract-based.',
    'The moderated HL examples top out at 8 of 12 on Criterion A and 4 of 6 on the others, so the upper bands are described from the band text rather than confirmed against a scored example.',
  ],
  sixVersusFour: [
    {
      criterionId: 'B1',
      subjects: LANGUAGE_B_SUBJECTS,
      six: 'Consistent, convincing engagement with the extract, with well-developed observations clearly tied to specific textual reference throughout.',
      four: 'Useful scene-setting, accurate summary of events, and some observations supported by the text — but the balance tips too far toward summary.',
      movingLine: 'The ratio of plot summary to developed, text-supported observation decides this. Summary alone, however accurate, does not clear the top band.',
    },
    {
      criterionId: 'B2',
      subjects: LANGUAGE_B_SUBJECTS,
      six: 'Consistently relevant, well-developed responses across both discussion sections, broad in scope, including personal interpretation.',
      four: 'Handles a good range of complex ideas and makes unprompted connections, but responses are at times short and personal opinion is offered sparingly.',
      movingLine: 'Being able to handle complex ideas is not enough. The response also has to be sustained in length and include volunteered opinion.',
    },
    {
      criterionId: 'C',
      subjects: LANGUAGE_B_SUBJECTS,
      six: 'Sustained participation with contributions the student volunteers rather than only offers in response to a question.',
      four: 'Answers are prompt and show understanding and participation is sustained, but it becomes less assertive later and independent moves are not evident.',
      movingLine: 'Same axis as SL and ab initio: sustained but reactive participation caps at the middle band.',
    },
  ],
  pitfalls: [
    { ...ASR_PITFALL, subjects: LANGUAGE_B_SUBJECTS },
    { ...MONOLOGUE_PITFALL, subjects: LANGUAGE_B_SUBJECTS },
    { ...NATIVE_STANDARD_PITFALL, subjects: LANGUAGE_B_SUBJECTS },
    {
      id: 'summary-as-analysis',
      severity: 'high',
      subjects: LANGUAGE_B_SUBJECTS,
      claim: 'A presentation that accurately retells the events of the extract is doing what B1 asks for.',
      reality:
        'The descriptor rewards observations and opinions developed with reference to the extract, not retelling. One example was marked down because summary drifted into other parts of the novel with no observation ever landing; another because the balance still tilted toward summary.',
      detector: 'Check for evaluative or interpretive language about the extract, not just event recounting, before crediting the middle band.',
    },
    {
      id: 'extract-vs-whole-work',
      severity: 'medium',
      subjects: LANGUAGE_B_SUBJECTS,
      claim: 'Discussing the work as a whole is equivalent to engaging with the assigned extract.',
      reality:
        'The presentation must focus principally on the assigned extract. One example was marked down because most of its ideas related to other parts of the novel.',
      detector: 'Flag presentations that spend more time on background or whole-work material than on the extract itself.',
    },
    {
      id: 'sl-hl-direction-reversed',
      severity: 'high',
      subjects: LANGUAGE_B_SUBJECTS,
      claim: 'HL is SL but harder, so SL guidance can be reused with tougher thresholds.',
      reality:
        'HL B1 is a different task — literary extract analysis, not visual stimulus. The descriptor language, the skills rewarded, and the presence of a visual all differ. Applying SL guidance to HL is a category error, not a calibration error.',
      detector: 'Verify which task type is in play before generating B1 guidance. Never reuse the SL visual-stimulus framing for an HL submission.',
    },
  ],
}

export const languageAbInitioOralMarking: MarkingModel = {
  rubricId: 'ib-oral-ab-initio',
  bestFit: [
    ...SHARED_BEST_FIT,
    'Do not import Language B\u2019s Criterion A ceiling. The ab initio top band is calibrated to beginner performance and never requires idiomatic use.',
  ],
  zeroRules: SHARED_ZERO_RULES,
  hardCeilings: [
    {
      when: 'The presentation makes no explicit or implicit link to the target culture, even where description and personal interpretation are otherwise strong',
      criterionId: 'B1',
      max: 3,
      why: 'Documented: an examiner stated the candidate met every other element of the top band but capped the mark at 3 of 6 specifically because no target-culture link was made anywhere.',
      scope: 'instance',
    },
  ],
  distributionFacts: [
    'Criterion A carries 12 of the 30 marks, identical to both Language B levels.',
    'B1, B2 and C use text identical to Language B SL. The only rubric-text difference across all four criteria is Criterion A\u2019s ceiling wording.',
    'Total oral time is roughly half of Language B\u2019s, and the presentation is capped at 1 to 2 minutes against 3 to 4. Do not expect ab initio presentations to reach Language B length or development.',
  ],
  sixVersusFour: [
    {
      criterionId: 'A',
      subjects: AB_INITIO_SUBJECTS,
      six: 'Varied vocabulary, a real range of structures used effectively including a correctly formed conditional, and only minor non-blocking errors.',
      four: 'Vocabulary sometimes fits with real attempts and repetition of a few items; basic structures dominate with frequent errors in possessives, conjugation and word order; pronunciation sometimes unclear.',
      movingLine: 'The deciding factor is whether errors are confined to basic structures and stop interfering with meaning, and whether pronunciation moves from sometimes unclear to accented but clear.',
    },
    {
      criterionId: 'B1',
      subjects: AB_INITIO_SUBJECTS,
      six: 'Consistent use of explicit and implicit stimulus detail, developed personal interpretation, and an explicit, clear target-culture link.',
      four: 'Explicit descriptive detail plus several genuine personal interpretations, with a real but tenuous culture link via a couple of concrete details.',
      movingLine: 'At this level the practical ceiling-setter is very often the target-culture link specifically, rather than description or interpretation quality, which can already be strong at the middle band.',
    },
    {
      criterionId: 'B2',
      subjects: AB_INITIO_SUBJECTS,
      six: 'Consistently relevant, developed responses across both discussion sections without repeating pre-learned content.',
      four: 'Several genuinely developed answers with concrete detail, but the same content recurs verbatim across different questions.',
      movingLine: 'Watch for recycled phrases reappearing across unrelated questions. The development bar is not met by repetition, however fluent the repeated phrase sounds.',
    },
  ],
  pitfalls: [
    { ...ASR_PITFALL, subjects: AB_INITIO_SUBJECTS },
    { ...MONOLOGUE_PITFALL, subjects: AB_INITIO_SUBJECTS },
    {
      id: 'language-b-ceiling-applied-to-ab-initio',
      severity: 'high',
      subjects: AB_INITIO_SUBJECTS,
      claim: 'The ab initio top band should be held to the same idiomatic-fluency standard as Language B.',
      reality:
        'The two ceilings are worded differently on purpose. The ab initio top band never mentions idiomatic expression and stops at language that supports communication, while Language B requires purposeful idiom and language that enhances the message. Applying the Language B bar makes an 11-of-12 ab initio performance look mid-band.',
      detector: 'Confirm which course is in play before generating Criterion A guidance. Never reuse Language B band text for an ab initio transcript.',
    },
    {
      id: 'repeated-content-read-as-development',
      severity: 'medium',
      subjects: AB_INITIO_SUBJECTS,
      claim: 'An answer that sounds fluent because it reuses a memorised phrase counts as developed.',
      reality:
        'An examiner explicitly identified repeated pre-learned content across multiple unrelated questions as a limiting factor, even though individual answers were otherwise solid.',
      detector: 'Check for near-identical phrasing recurring across different questions before crediting sustained development.',
    },
    {
      id: 'short-part-1-treated-as-weak',
      severity: 'medium',
      subjects: AB_INITIO_SUBJECTS,
      claim: 'A one to two minute presentation is too short and should be flagged as weak.',
      reality:
        'One to two minutes is the target length for ab initio, by design roughly a third of Language B\u2019s. Brevity within this window is not a quality signal in either direction.',
      detector: 'Do not cite shortness as a weakness unless the presentation was short even relative to the one to two minute target.',
    },
  ],
}

export const languageBOralMarkingModels: MarkingModel[] = [
  languageBOralSLMarking,
  languageBOralHLMarking,
  languageAbInitioOralMarking,
]

/* ------------------------------------------------------------------ */
/* Topic rules                                                         */
/* ------------------------------------------------------------------ */
// The student does not choose a topic here — the teacher supplies the stimulus
// or the extract. These rule sets catch procedural and preparation failures
// rather than recommending what to pick.

const FIVE_THEMES = [
  { id: 'lb-identities', label: 'Identities', hint: 'The nature of the self and what it means to be human: lifestyles, health and wellbeing, beliefs and values, subcultures, language and identity.' },
  { id: 'lb-experiences', label: 'Experiences', hint: 'The events and journeys that shape a life: leisure, holidays and travel, life stories, rites of passage, customs and traditions, migration.' },
  { id: 'lb-human-ingenuity', label: 'Human ingenuity', hint: 'How creativity and innovation shape the world: entertainment, artistic expression, communication and media, technology, scientific innovation.' },
  { id: 'lb-social-organization', label: 'Social organization', hint: 'How groups of people organise themselves: neighbourhood, education, the workplace, social issues.' },
  { id: 'lb-sharing-the-planet', label: 'Sharing the planet', hint: 'Challenges and opportunities facing individuals and communities today: climate, physical geography, the environment, global issues.' },
]

export const languageBOralSLRules: TopicRuleSet = {
  rubricId: 'ib-oral-language-b-sl',
  label: 'IB Language B SL — Individual Oral: stimulus and discussion guardrails',
  contexts: FIVE_THEMES,
  rules: [
    {
      id: 'lb-sl-stimulus-unseen',
      label: 'The stimulus must be unseen before the exam',
      detail: 'The student must not have seen the visual stimulus beforehand. Practice stimuli must never overlap with the pool being used for the real assessment.',
      severity: 'fatal',
      hits: ['B1'],
    },
    {
      id: 'lb-sl-theme-label-only',
      label: 'Label with the theme only, never a caption',
      detail: 'A visual stimulus may carry only its theme name in the target language. A caption or explanatory text would hand the student vocabulary or a ready-made framing.',
      severity: 'major',
      hits: ['B1'],
    },
    {
      id: 'lb-sl-minimal-on-image-text',
      label: 'Text on the image must stay minimal and in the target language',
      detail: 'Text that naturally appears in the image, such as a sign in a photograph, must be minimal and in the target language. It must not supply vocabulary or structures that give an unfair advantage.',
      severity: 'major',
      hits: ['B1'],
    },
    {
      id: 'lb-sl-not-a-script',
      label: 'The presentation must not be a memorised script',
      detail: 'The presentation must be built from the student\u2019s own preparation notes, at most 10 bullet points, and must not be written out in full and read aloud. A presentation on generic, pre-learned aspects of a theme that never engages the specific stimulus shown is off-task.',
      severity: 'major',
      hits: ['B1', 'A'],
    },
    {
      id: 'lb-sl-different-theme-in-part-3',
      label: 'The general discussion must draw on a different theme',
      detail: 'The general discussion introduces at least one theme beyond the stimulus theme, precisely so the student cannot prepare for it during the timed preparation window.',
      severity: 'minor',
      hits: ['B2', 'C'],
    },
  ],
  levelNotes: {
    SL: 'Twelve to fifteen minutes of oral time after fifteen minutes of preparation. The presentation runs three to four minutes.',
  },
  titleGuidance: [
    'There is no student-authored title here. The closest equivalent is the opening move of the presentation.',
    'A strong opening names the theme and gives a concrete orientation to the image before moving into description, rather than opening with a memorised statement about the theme in the abstract.',
  ],
  dataGuidance: [
    'The evidence base is what is visible in the stimulus plus the student\u2019s own cultural knowledge. There is no research component.',
    'Strong responses cite specific details visible in the image, add inferred detail, and connect at least one concrete detail to the target culture.',
    'A generic claim about the theme with no anchor in the image itself does not count as a culture link.',
  ],
  scopeNote:
    'This rule set does not select a topic — the teacher controls stimulus selection entirely. Its job is to catch procedural and preparation failures around a teacher-supplied stimulus.',
}

export const languageBOralHLRules: TopicRuleSet = {
  rubricId: 'ib-oral-language-b-hl',
  label: 'IB Language B HL — Individual Oral: literary extract guardrails',
  contexts: FIVE_THEMES,
  rules: [
    {
      id: 'lb-hl-extract-unseen',
      label: 'The extract choice must be unseen before the exam',
      detail: 'Students know which two literary works the extracts come from, but must not know which specific extracts will be used until the preparation period begins.',
      severity: 'fatal',
      hits: ['B1'],
    },
    {
      id: 'lb-hl-centre-the-extract',
      label: 'Stay on the assigned extract, not the whole work',
      detail: 'The presentation may briefly place the extract in context but must spend most of its time on the events, ideas and messages inside the extract itself. Drifting into commentary on the work as a whole, the author\u2019s biography, or a book-review overview is off-task.',
      severity: 'major',
      hits: ['B1'],
    },
    {
      id: 'lb-hl-not-a-script',
      label: 'The presentation must not be a memorised script',
      detail: 'As at SL, the presentation must come from the student\u2019s own preparation notes and must not be written out in full and read aloud.',
      severity: 'major',
      hits: ['B1', 'A'],
    },
    {
      id: 'lb-hl-part-3-uses-themes',
      label: 'The general discussion draws on course themes, not more literary analysis',
      detail: 'The general discussion moves beyond the extract into one or more of the five course themes. It is not a continuation of literary analysis.',
      severity: 'minor',
      hits: ['B2', 'C'],
    },
  ],
  levelNotes: {
    HL: 'Twelve to fifteen minutes of oral time after twenty minutes of preparation. The presentation runs three to four minutes and is based on a literary extract of up to roughly 300 words.',
  },
  titleGuidance: [
    'The closest equivalent to a title is how the student frames the extract at the start.',
    'A strong opening briefly orients the listener — who is speaking, roughly where in the work this sits — before moving quickly into the extract\u2019s own events and ideas. It should not become an extended plot-context preamble.',
  ],
  dataGuidance: [
    'The evidence base is the extract\u2019s own text: events, dialogue, imagery, characters\u2019 stated thoughts. Not summary of the whole work, and not generic thematic statements.',
    'The strongest responses balance brief summary with developed, extract-anchored observation and opinion. Leaning too far toward summary is the documented failure mode at this level.',
  ],
  scopeNote:
    'As at SL, this rule set does not select material — the teacher chooses which works the extracts come from. Its job is to catch failure modes specific to working with an assigned text extract under time pressure.',
}

export const languageAbInitioOralRules: TopicRuleSet = {
  rubricId: 'ib-oral-ab-initio',
  label: 'IB Language ab initio — Individual Oral: stimulus and discussion guardrails',
  contexts: FIVE_THEMES,
  rules: [
    {
      id: 'ai-stimulus-unseen',
      label: 'The stimulus must be unseen before the exam',
      detail: 'Identical to Language B SL: the student must not have seen the visual stimulus, nor know in advance which theme the general discussion will draw on.',
      severity: 'fatal',
      hits: ['B1'],
    },
    {
      id: 'ai-theme-label-only',
      label: 'Label with the theme only, never a caption',
      detail: 'Same rule as SL: theme name only, no caption or explanatory text.',
      severity: 'major',
      hits: ['B1'],
    },
    {
      id: 'ai-short-presentation-window',
      label: 'The presentation target is one to two minutes, not three to four',
      detail: 'The ab initio presentation window is roughly a third of Language B\u2019s. Treating a ninety-second ab initio presentation as too short by the Language B standard is a category error, not a quality signal.',
      severity: 'minor',
      hits: ['B1', 'A'],
    },
    {
      id: 'ai-not-a-script',
      label: 'The presentation must not be a memorised script',
      detail: 'Same rule as SL and HL: it must come from the student\u2019s own brief notes, not a memorised text.',
      severity: 'major',
      hits: ['B1', 'A'],
    },
  ],
  levelNotes: {
    SL: 'Seven to ten minutes of oral time after fifteen minutes of preparation. The presentation runs one to two minutes only.',
  },
  titleGuidance: [
    'Same shape as SL: the opening should name the theme and orient concretely to the image rather than starting with a memorised statement about the theme.',
  ],
  dataGuidance: [
    'Same shape as SL, calibrated to beginner output.',
    'Even a short, simple description that includes one or two personal-interpretation statements and one concrete link to the target culture counts as strong content at this level. Do not expect Language B elaboration.',
  ],
  scopeNote:
    'Mechanically identical to the Language B SL rule set, kept separate because it belongs to a separate course and rubric.',
}

export const languageBOralRuleSets: TopicRuleSet[] = [
  languageBOralSLRules,
  languageBOralHLRules,
  languageAbInitioOralRules,
]

/* ------------------------------------------------------------------ */
/* Exemplars                                                           */
/* ------------------------------------------------------------------ */
// getExemplars() matches the subject string exactly and returns the first hit,
// so each course needs its own subject value. SL and HL must not share one.

export const languageBOralSLExemplars: SubjectExemplars = {
  subject: 'Language B SL',
  rubricId: 'ib-oral-language-b-sl',
  exemplars: [
    {
      title: 'A city bike-share advertisement',
      context: 'lb-sharing-the-planet',
      why: 'An advertisement gives the student something with a clear communicative purpose — persuading people to cycle — plus a visible setting to describe. Transport policy connects naturally to a specific city or country, which makes the culture link concrete rather than generic.',
      data: 'A strong response describes what is visible — setting, people, the advertised action — before moving to interpretation: why this message, for whom, what problem it responds to. The culture link names a specific real transport or environmental policy in a country associated with the target language.',
      watchOut: 'The common failure is stopping at description and never reaching interpretation or a concrete culture link. That caps the message criterion even where the description itself is accurate and fluent.',
    },
    {
      title: 'A multigenerational family cooking together',
      context: 'lb-identities',
      why: 'A domestic scene gives an easy entry point — who is here, what are they doing — while opening onto identity and tradition. That supports both a personal reading and a culture connection through a specific dish, custom or celebration.',
      data: 'A strong response names the relationships and the activity, offers a personal reading of why this moment matters, and connects to a named custom, dish or family tradition associated with the target culture.',
      watchOut: 'This kind of image invites universal statements. Saying that family is important everywhere technically mentions culture without making a real link — examiners have flagged exactly this pattern as capping the mark.',
    },
    {
      title: 'A poster for a robotics or coding competition',
      context: 'lb-human-ingenuity',
      why: 'A competition poster combines a concrete visual with an abstract theme, supporting both descriptive and evaluative language, and offers an easy hook into a specific institution, school system or industry detail in the target culture.',
      data: 'A strong response names what the poster is advertising and to whom, adds a personal view on the value or difficulty of the activity, and links to something specific about how this is organised or valued in the target culture.',
      watchOut: 'Students often reach for memorised technology vocabulary, producing fluent-sounding but generic language disconnected from the actual poster. The response has to engage the image in front of them, not a rehearsed theme monologue.',
    },
  ],
}

export const languageBOralHLExemplars: SubjectExemplars = {
  subject: 'Language B HL',
  rubricId: 'ib-oral-language-b-hl',
  exemplars: [
    {
      title: 'A dialogue-heavy confrontation scene',
      context: 'lb-identities',
      why: 'A scene built mostly from spoken exchange gives concrete material to quote or closely paraphrase, which supports the specific textual reference the top band asks for, and a natural axis for personal interpretation: whose side does the student take, and why.',
      data: 'A strong response spends most of its time on what is said and implied in the exchange — tone, what is left unsaid, a specific line that reveals character — briefly orients the listener, and offers a clear personal reading of the conflict.',
      watchOut: 'The documented failure is retelling the exchange accurately without ever landing on an observation about it. Competent summary is not the developed-observation standard the top band requires.',
    },
    {
      title: 'A descriptive, introspective passage',
      context: 'lb-experiences',
      why: 'A passage focused on a character\u2019s internal state rewards close reading of specific word choices and imagery, which supports text-anchored observation and leaves room for a genuinely personal interpretive angle.',
      data: 'A strong response identifies one or two specific images or word choices and explains what they suggest, connects the passage to the character\u2019s situation with brief precise reference, and offers a clear personal reaction.',
      watchOut: 'Introspective passages pull weaker responses toward vague emotional language — saying the character feels sad — without anchoring the claim to a specific detail. Each observation needs at least one concrete textual anchor.',
    },
    {
      title: 'A scene with a clear turning point or decision',
      context: 'lb-human-ingenuity',
      why: 'A passage built around a decision gives a low-effort route into evaluation — was this the right choice, what does it reveal — without requiring the student to invent an angle from scratch.',
      data: 'A strong response briefly establishes what is at stake, references the specific moment of decision or consequence, and offers and defends a personal judgement about it.',
      watchOut: 'Because the events are dramatic and easy to narrate, students often spend most of their time on summary and only gesture at evaluation as time runs out. Timing practice should protect time for the opinion.',
    },
  ],
}

export const languageAbInitioOralExemplars: SubjectExemplars = {
  subject: 'Language ab initio',
  rubricId: 'ib-oral-ab-initio',
  exemplars: [
    {
      title: 'A school uniform or classroom photo',
      context: 'lb-social-organization',
      why: 'Everyday school life gives beginners a high-frequency, early-taught vocabulary set to describe confidently, while opening onto a comparison-friendly topic that supports a simple but real culture link.',
      data: 'A strong response at this level is simple but complete: naming visible items and people, one or two basic personal reactions, and one concrete comparison to how things work in a country associated with the target language. Even a small specific detail — a school rule, a subject name — is enough for the culture link.',
      watchOut: 'This is the most common gap in the moderated ab initio examples: strong description and even genuine personal interpretation, but no culture link anywhere. That alone holds the message criterion down regardless of everything else.',
    },
    {
      title: 'Friends at an outdoor market or cafe',
      context: 'lb-experiences',
      why: 'A social, low-stakes scene supports simple present-tense description that matches early-course grammar, while giving an easy route into a specific nameable custom.',
      data: 'A strong beginner response describes who is there and what they are doing, adds a simple reaction, and names one specific real-world detail tied to the target culture — a type of food, a named market, a typical mealtime.',
      watchOut: 'With limited vocabulary students lean on a small set of memorised phrases repeated across the presentation and the conversation. Examiners name this repetition as a limit on how developed the response is judged to be.',
    },
    {
      title: 'A recycling or clean-up campaign poster',
      context: 'lb-sharing-the-planet',
      why: 'Environmental campaign material pairs simple high-frequency vocabulary with a compulsory subtopic, so students usually have prepared vocabulary ready without the response becoming purely descriptive.',
      data: 'A strong response names what the poster asks people to do, gives a simple opinion on it, and connects to one concrete local detail from the target culture. Even a modest sentence doing this clears the culture-link bar that many responses miss.',
      watchOut: 'This topic is heavily pre-taught, so it is the one most likely to produce a fluent but fully memorised monologue disconnected from the actual poster. Check that the details mentioned match what is in front of the student.',
    },
  ],
}

export const languageBOralExemplars: SubjectExemplars[] = [
  languageBOralSLExemplars,
  languageBOralHLExemplars,
  languageAbInitioOralExemplars,
]