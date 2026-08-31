// app/rubrics/digital-society.ts
//
// IB Digital Society — the inquiry project (IA). Five criteria, 24 marks.
// Identical at SL and HL: same task, same criteria, same marks. Only the
// weighting differs (30% SL, 20% HL), so one rubric serves both.
//
// IMPORTANT PRODUCT LIMIT: three artefacts are submitted, and only one of them
// can reach this tool. Criteria A and B (9 marks) come from the inquiry process
// document, which is text. Criteria C, D and E (15 marks) come from a recorded
// video presentation, which cannot be uploaded here. Never report a total out
// of 24 from a process document alone.
//
// Source: Digital society guide (2024, Feb 2025 update), TSM (2024) and three
// assessed examples published Feb 2022. Those examples are explicitly NOT
// standardised and are not authentic student work, so calibration here is
// weaker than in other subjects.

import type { ExtendedRubric } from './rubrics-extra'
import type { MarkingModel } from './checker-guards'
import type { TopicRuleSet } from './topic-rules'
import type { SubjectExemplars } from './topic-exemplars'

const DS = ['Digital Society']

/* ------------------------------------------------------------------ */
/* Rubric                                                              */
/* ------------------------------------------------------------------ */

export const digitalSocietyRubric: ExtendedRubric = {
  id: 'ib-ia-digital-society',
  framework: 'IB',
  documentType: 'Internal Assessment',
  label: 'IB — Internal Assessment (Digital Society, the inquiry project)',
  totalMax: 24,
  shape: 'single',

  // SL weighting. HL is 20%. Marks and criteria are identical at both levels.
  weight: 30,

  // DOGRULANMADI: the guide publishes no IA-only grade boundaries; boundaries
  // are set per session against the whole subject aggregate. The scale below is
  // an in-product estimate anchored on three unstandardised examples.
  gradeScale: [
    { grade: '7', min: 20 },
    { grade: '6', min: 17 },
    { grade: '5', min: 14 },
    { grade: '4', min: 11 },
    { grade: '3', min: 8 },
    { grade: '2', min: 5 },
    { grade: '1', min: 0 },
  ],

  wordCount: {
    limit: 1500,
    unit: 'words',
    hard: true,
    excluded: [
      'list of references',
      'point-of-use source references and citations',
      'section headings and labels',
      'captions',
      'the stated per-section word counts themselves',
    ],
    included: [
      'inquiry focus section, body text',
      'claims and perspectives section, body text',
    ],
  },

  guidance:
    'The Digital Society inquiry project is identical for SL and HL: 24 marks across five criteria, roughly 30 teaching hours, worth 30 per cent of the SL grade and 20 per cent of the HL grade. There is no separate HL inquiry project, and the HL extension challenge topics belong to the examination papers rather than to this task. Three artefacts are submitted: an inquiry process document of no more than 1,500 words, a recorded multimedia presentation of no more than 10 minutes, and a list of references. Criteria A and B are decided from the process document only; criteria C, D and E from the presentation only. A criterion is never evidenced from the wrong artefact. Fifteen of the 24 marks sit on the presentation, which this tool cannot read: when only the process document is supplied, a defensible judgement is available on A and B alone, and no total out of 24 should be reported. The 1,500-word total is hard and words past it are not assessed; the per-section figures of 300 words for the focus and 1,200 for claims and perspectives are recommendations, not caps. Both artefacts have required labelled sections in a fixed order, and the same inquiry question must appear in both. Three sources are discussed in the process document, and three is the number rather than a minimum. Appendices are not read. Best-fit applies within each criterion independently, and uneven profiles across the five are normal. No marks anywhere are for spelling, grammar, register or production polish.',

  criteria: [
    {
      id: 'A',
      name: 'Inquiry focus',
      max: 3,
      verbLadder: 'quality',
      description:
        'Judged from the inquiry process document only. Three things must be on the page: an inquiry question, a specific and relevant real-world example, and an explanation connecting the question and the example to course concepts, content and contexts. What earns the mark is the explanation of the connection. Naming the concepts is the floor, not the achievement. The real-world example must be a particular case, not a product category.',
      bands: [
        { range: '0', descriptor: 'Nothing in the focus section reaches the standard set out below' },
        { range: '1', descriptor: 'The focus is thin or incomplete: either a required element is missing, or what is offered as a real-world example is generic or not relevant to the question being asked' },
        { range: '2', descriptor: 'All required elements are present — the question is clear, an example is named, concepts, content and contexts are identified — but the explanation tying them together is partial, typically asserted in a line each rather than developed' },
        { range: '3', descriptor: 'The focus is targeted and the explanation is complete: the question, a specific real-world case, and the chosen course concepts, content and contexts are shown to belong together, with reasons' },
      ],
      calibration: [
        'Top band: a question narrowed to one aspect of a broad issue with the narrowing itself justified; a real-world case carrying figures and a citation; each concept and context explained in terms of this inquiry rather than defined in the abstract. The top-scoring example narrowed the impact of social media to mental health specifically and defended that narrowing.',
        'Middle band: every element present, question clear, but the concept statements read as one-line definitions and the example names a class of products rather than a case. Both mid-scoring examples sat here, one described as borderline.',
        'Bottom band: a required element absent, or the example is a whole industry, or the question cannot be connected to the example as stated.',
        'A focus section noticeably under the 300-word recommendation is a signal to look for a thin explanation, but short length is not itself a deduction.',
        'Do not credit ambition. A question about a frontier technology and one about a decade-old technology are worth the same; only the explanation is marked.',
      ],
    },
    {
      id: 'B',
      name: 'Claims and perspectives',
      max: 6,
      verbLadder: 'sustain',
      description:
        'Judged from the inquiry process document only. Three sources are discussed. For each, the student sets out what the source claims and from what perspective, and justifies why that source was useful to this inquiry. The justification is the load-bearing element: in every published example the marks were lost at the point where a source was summarised well but its usefulness to the inquiry was left for the reader to infer. Evaluating a source, by questioning its funding or weighing its credibility, is not required by this criterion.',
      bands: [
        { range: '0', descriptor: 'Nothing in the source discussion reaches the standard set out below' },
        { range: '1-2', descriptor: 'The discussion is thin and mostly restates what the sources say. This band also applies whenever fewer than three sources are discussed, or where no justification of use is offered at all, regardless of how well the sources are described' },
        { range: '3-4', descriptor: 'Each source gets a partial treatment of its claims and perspectives, with some justification of usefulness, but the treatment is not carried through — commonly two sources handled properly and a third left as summary, or usefulness implied rather than stated' },
        { range: '5-6', descriptor: 'Every source receives a thorough treatment of claims and perspectives, and for every source the reason it was useful to this inquiry is stated plainly' },
      ],
      calibration: [
        'Top band: three sources, each with origin and purpose, what it argues, how it argues it, how it corroborates or conflicts with the others, and an explicit sentence on what it contributed. Roughly even weight across the three.',
        'The top-scoring published example took 5 of 6: critical and sustained across all three sources, usefulness consistently clear, but the last mark was withheld for fineness rather than a missing component. Criterion B never reached 6 in any example.',
        'Middle band: three sources handled effectively and a fourth added without justification, or the first two given long treatment and the third a paragraph. The mid example lost marks for exactly this imbalance, its third source discussion described as very brief with relevance not fully established.',
        'Bottom band: seven sources discussed at surface level, lessons taken from sources without being tied back to the topic, relevance rarely stated. That was the low example.',
        'More sources is not more marks. Two of the three published examples were penalised for exceeding three.',
        'Where the top example evaluated its sources, the marker noted this was not expected and treated it as evidence of understanding. Never deduct for its absence.',
      ],
    },
    {
      id: 'C',
      name: 'Analysis and evaluation',
      // Evidence lives in the recorded presentation, which the checker cannot watch.
      textReadable: false,
      max: 6,
      verbLadder: 'sustain',
      description:
        'Judged from the recorded presentation only, and from the bulk of it. The student analyses and evaluates the impacts and implications of the digital system for people and communities, in their own voice, supported by evidence. Analysis means breaking the thing down to show its structure; evaluation means weighing strengths against limitations. Correct technical explanation of how the technology works is not what is being marked.',
      bands: [
        { range: '0', descriptor: 'Nothing in the presentation body reaches the standard set out below' },
        { range: '1-2', descriptor: 'Largely descriptive, or drifting away from the stated focus. Impacts are listed rather than examined, and examples are recounted at length without being made to do analytical work' },
        { range: '3-4', descriptor: 'Real analysis and evaluation of impacts for people and communities is present and adequate, but it comes and goes — some stretches revert to description, or a claim is advanced without evidence behind it' },
        { range: '5-6', descriptor: 'Analysis and evaluation is effective and holds across the presentation, with evidence attached to the claims as they are made' },
      ],
      calibration: [
        'Top band: theory and named real-world cases worked together; a central argument returned to repeatedly without becoming repetitive, because each return supplies a different perspective; a counter-consideration raised and handled. Evidence sits next to each claim.',
        'Middle band: multiple stakeholders identified and real evaluation present, but the presentation ranges across too many distinct sub-topics to sustain focus, and at least one section slides back into description.',
        'Bottom band: one genuinely well-argued stretch surrounded by material that narrates examples in excessive detail and lists downsides without saying why they are downsides. The low example was singled out for a list of drawbacks as its failure point.',
        'The most reliable single discriminator: take any 60-second window in the analysis section and ask whether a claim is being advanced and supported, or whether information is being conveyed. Zero or one failing window is top band; several scattered is the middle; most is the bottom.',
        'Personal anecdote is weak evidence here. The low example used two moving individual stories and the marker rejected both as failing to show broader impact.',
        'Depth on an example is not a virtue in itself. The same marker faulted the script for describing examples in too much depth for the presentation to stay meaningful.',
        'This criterion had the widest spread across the three examples, from 2 to 6, and separates scripts more sharply than any other.',
      ],
    },
    {
      id: 'D',
      name: 'Conclusion',
      // Evidence lives in the recorded presentation, which the checker cannot watch.
      textReadable: false,
      max: 6,
      verbLadder: 'sustain',
      description:
        'Judged from the recorded presentation only. Two obligations. First, further insight: what the student now understands about the focus that they did not understand before analysing. Second, a discussion of emerging trends and future developments. Both must be supported and both must follow from the analysis that preceded them. A conclusion that restates the body meets neither obligation.',
      bands: [
        { range: '0', descriptor: 'Nothing in the conclusion reaches the standard set out below' },
        { range: '1-2', descriptor: 'The conclusion adds little beyond what was already said. Emerging trends and future developments are mentioned in passing or not discussed at all, and closing claims are broad and not carried by the preceding evidence' },
        { range: '3-4', descriptor: 'Adequate further insight into the focus, with a partial discussion of trends and future developments — typically one direction named and briefly explained where several were available' },
        { range: '5-6', descriptor: 'Effective, well-supported further insight, with a thorough and substantiated discussion of where the issue is heading' },
      ],
      calibration: [
        'The top-scoring example took 5 of 6: a firmly justified conclusion drawing on named sources and figures, plus concrete proposals including changing the financial incentives of the platforms. The withheld mark was for future steps needing more depth, and nothing else. Criterion D never reached 6 in any example.',
        'Middle band: a clear conclusion, mostly justified, one credible future step identified, other plausible directions left untouched. The mid example named digital literacy and its marker noted an argument could be made for a higher band.',
        'Bottom band: general closing statements, an unjustified summary claim, no specific trends named. The low example concluded that digital systems had greatly affected many lives, which its marker rejected as unsupported and ambiguous.',
        'Insight and trends are separately checkable. Score them separately, then take the lower as the anchor and adjust. A script strong on insight and silent on trends does not reach the top band.',
        'Future developments means developments in this specific field, evidenced. Generic futurism is a name-check, not a discussion.',
        'Trends may be foreshadowed earlier in the presentation and built on at the end. The top example began narrowing towards its conclusion around the five-minute mark and this was credited, not penalised.',
      ],
    },
    {
      id: 'E',
      name: 'Communication',
      // Evidence lives in the recorded presentation, which the checker cannot watch.
      textReadable: false,
      max: 3,
      verbLadder: 'quality',
      description:
        'Judged from the recorded presentation only. Two things: whether ideas and evidence are organised so that a viewer can follow the argument, and whether the media used — visuals, text, sound — cohere and support understanding. This is not a production-values criterion and not a public-speaking criterion. The test is always whether the choices help the viewer understand.',
      bands: [
        { range: '0', descriptor: 'Nothing in the presentation reaches the standard set out below' },
        { range: '1', descriptor: 'Organisation and use of media are thin and do not help the viewer: the structure is hard to follow, or the media choices work against comprehension' },
        { range: '2', descriptor: 'Adequately organised. Media is coherent at times but not throughout, or supports understanding only partly — typical causes are text-only slides in stretches, background audio competing with the commentary, an abrupt ending, or badly unbalanced section timing' },
        { range: '3', descriptor: 'Well organised, with media used coherently across the whole presentation to support understanding' },
      ],
      calibration: [
        'Top band: an opening hook the audience can place themselves in, an explicit outline of what is coming, visuals throughout, and one well-chosen external video that carries the argument rather than decorating it.',
        'Middle band caught both other examples for different reasons. One had solid visuals but background music obscuring the speaker, a flat delivery and an abrupt ending. The other was organised adequately but ran text-only slides with no visual support at all.',
        'The line between the middle and top band is signposting plus consistency. An explicit outline near the start is the cheapest single upgrade available in this criterion.',
        'Do not over-penalise isolated technical faults. The top example ran a blank screen for around twenty-four seconds and its marker explicitly declined to reduce the mark, because the delivery and visual support either side remained effective. Judge the sustained level, not the worst frame.',
        'Production sophistication was never required. A plain slide deck used well outscores an elaborate edit used badly.',
        'Missing audible commentary in the voice of the student is a technical compliance problem that may obstruct marking altogether. Treat it as a submission fault to flag, not as a bottom-band judgement.',
      ],
    },
  ],
}

/* ------------------------------------------------------------------ */
/* Marking model                                                       */
/* ------------------------------------------------------------------ */

export const digitalSocietyMarking: MarkingModel = {
  rubricId: 'ib-ia-digital-society',

  bestFit: [
    'Apply each criterion independently. Uneven profiles across A to E are normal in this subject and should not be averaged towards the middle.',
    'Within a two-mark band, the lower mark is for work that meets the descriptor unevenly, the higher for work that meets it consistently.',
    'Mark the sustained level, not the best moment and not the worst frame. Criteria C, D and E all move on whether a quality is held across the artefact.',
    'A and B are decided from the inquiry process document alone. C, D and E from the presentation alone. Never carry evidence across artefacts.',
    'Nothing beyond the 1,500-word total or the 10-minute limit is assessed. Strike it before judging rather than deducting for it after.',
    'Appendices are not read at all.',
    'No mark, up or down, for spelling, grammar, register or production polish.',
    'CRITICAL FOR THIS TOOL: the presentation is a video and cannot be uploaded here. Where only the process document is supplied, mark A and B, state plainly that C, D and E could not be assessed, and report the score out of 9 rather than out of 24. Do not infer presentation quality from the document — across the three published examples there was no stable relationship between the two.',
    'The most useful thing this tool can offer on this subject is not a mark but a brief for the presentation: whether the focus question is stated in a form that can be argued rather than described, which of the three discussed sources will need to return as evidence, and which part of the question is still open to being answered descriptively.',
  ],

  zeroRules: [
    'A criterion scores 0 when no part of the relevant artefact reaches its lowest described standard.',
    'If the inquiry process document is absent, A and B cannot be evidenced and score 0. If the presentation is absent, C, D and E cannot be evidenced — but in this tool that is the normal case, so report them as not assessed rather than as zero.',
    'Material reused from another DP assessment component, the extended essay included, is not permitted in this project. Raise it as an academic integrity matter to discuss with the teacher rather than producing a mark.',
    'Failure to distinguish the words of the student from those of others, or to cite at point of use with matching entries in the list of references, may be treated as an academic integrity violation rather than a low mark.',
  ],

  hardCeilings: [
    {
      when: 'Fewer than three sources are discussed in the claims and perspectives section, or no justification is offered for the use of the sources in the inquiry',
      criterionId: 'B',
      max: 2,
      why: 'The bottom band names both conditions explicitly, so however well the sources are described the work cannot leave that band.',
    },
    {
      when: 'A required element of the focus is missing, or what is offered as the real-world example is not specific or not relevant to the inquiry',
      criterionId: 'A',
      max: 1,
      why: 'The 1-mark descriptor names both conditions, and the 2-mark descriptor requires all elements present with at least a partial explanation.',
    },
  ],

  distributionFacts: [
    'Only three marked examples exist, published February 2022, before first assessment. The IB states plainly that they are not authentic student work, that the marks are not definitive, and that they have not been through standardisation. Treat all calibration as indicative and weaker than in other subjects.',
    'Totals across the three: 10 of 24, 16 of 24, 22 of 24. The regions between those points are unsampled.',
    'Per criterion, low to high — A: 2, 2, 3. B: 2, 4, 5. C: 2, 4, 6. D: 2, 4, 5. E: 2, 2, 3.',
    'Criterion B never reached 6, and neither did criterion D. Both are criteria where a component is done well for most of the artefact and dropped for part of it.',
    'Criterion C had the full spread and is the strongest single discriminator between scripts.',
    'Criterion E sat at 2 of 3 in two of three examples, in both cases for reasons that were cheap to fix: no explicit outline, text-only slides, competing background audio.',
    'Criterion A never fell below 2. The elements are easy to include; the explanation is what is hard.',
    'Two of three examples were marked down for discussing more than three sources. None was marked down for discussing too few.',
  ],

  sixVersusFour: [
    {
      criterionId: 'A',
      subjects: DS,
      six: 'Top mark, 3 of 3 — the question is narrow enough that its narrowing needs defending, and the student defends it. The real-world example is one identifiable case, with figures and a citation. Each concept, content topic and context is explained in terms of what it does for this inquiry.',
      four: 'Middle mark, 2 of 3 — everything is present and nothing is explained far. Concepts appear as one-line definitions, the example names a category of products, the question is clear but generic.',
      movingLine: 'Replace each one-line concept statement with a sentence saying what that concept lets you see in this particular case, and replace the product category with one named instance.',
    },
    {
      criterionId: 'B',
      subjects: DS,
      six: 'Top mark, 6 of 6 — three sources, comparable weight, each with origin and purpose, claims, methods, how it sits against the other two, and an explicit statement of what it contributed to this inquiry.',
      four: 'Middle mark, 4 of 6 — the sources are handled, sometimes very well, but the treatment is uneven. A fourth source appears without justification, or the third gets a short paragraph after two long ones, or usefulness is implied by proximity rather than stated.',
      movingLine: 'Cut to exactly three sources, give them roughly equal space, and end each with one sentence beginning with why this source mattered to the inquiry.',
    },
    {
      criterionId: 'C',
      subjects: DS,
      six: 'Top mark, 6 of 6 — every stretch of the analysis section advances a claim about impacts on identified people or communities and attaches evidence to it. The central argument recurs but each recurrence adds a different perspective. At least one counter-consideration is raised and handled.',
      four: 'Middle mark, 4 of 6 — real analysis is present and stakeholders are identified, but the presentation covers too many sub-topics to hold focus, and some stretches narrate rather than argue.',
      movingLine: 'Cut the sub-topics down to the one the question actually asks about, and convert every stretch that explains how something works into a stretch that argues what it does to someone.',
    },
    {
      criterionId: 'D',
      subjects: DS,
      six: 'Top mark, 6 of 6 — the conclusion states what is now understood that was not understood before, justifies it from the evidence just presented, and discusses several specific developments in this field with substantiation.',
      four: 'Middle mark, 4 of 6 — a clear conclusion, mostly justified, one future step named and briefly explained, other available directions left untouched.',
      movingLine: 'Add two more specific future developments in this field, each with a reason it is likely and a consequence for the people the inquiry is about.',
    },
    {
      criterionId: 'E',
      subjects: DS,
      six: 'Top mark, 3 of 3 — an opening that gives the viewer a reason to care, an explicit outline of the structure, visual support throughout, and any embedded media chosen because it carries the argument.',
      four: 'Middle mark, 2 of 3 — adequate structure but no signposting, visual support lapsing into text-only stretches, audio choices competing with the commentary, or an ending that arrives abruptly.',
      movingLine: 'Add a spoken outline in the first minute and give every text-only stretch a visual that carries its point.',
    },
  ],

  pitfalls: [
    {
      id: 'ds-cross-artefact-evidence',
      severity: 'critical',
      subjects: DS,
      claim: 'All five criteria can be marked from whatever has been uploaded, so A or B may be evidenced from the presentation and C, D or E from the process document.',
      reality: 'Each criterion names its project element. A and B come from the inquiry process document; C, D and E from the presentation. Fifteen of twenty-four marks are unreachable from the document alone, and this tool cannot read video.',
      detector: 'A total out of 24 is reported when only the process document was supplied, or criterion C feedback quotes the process document.',
    },
    {
      id: 'ds-tech-explanation-as-content',
      severity: 'critical',
      subjects: DS,
      claim: 'Accurate technical explanation of how the digital system works is subject knowledge and should be rewarded.',
      reality: 'Criterion C marks analysis and evaluation of impacts and implications for people and communities. Technical exposition is background at best. Markers on the published examples flagged a technical introduction as possibly unnecessary and questioned why technical detail was relevant at all.',
      detector: 'Feedback praises the student for explaining a mechanism correctly, or awards the top band on C to a script whose evidence is mostly about how the technology functions rather than whom it affects.',
    },
    {
      id: 'ds-source-count-as-quality',
      severity: 'critical',
      subjects: DS,
      claim: 'More sources means stronger research, so a wide bibliography should be rewarded under criterion B.',
      reality: 'Three sources are discussed and the number is fixed, not a floor. Two of the three published examples lost marks for exceeding it; one discussed seven and scored 2 of 6. All sources consulted go in the list of references regardless, but only three are discussed.',
      detector: 'Criterion B feedback compliments breadth of research, or a script discussing four or more sources scores in the top band.',
    },
    {
      id: 'ds-section-limits-as-hard-caps',
      severity: 'high',
      subjects: DS,
      claim: 'The 300-word focus section and 1,200-word source section are hard caps and overruns should be penalised.',
      reality: 'Both figures are recommended maxima. The guide was corrected in February 2023 specifically to rephrase them that way. Only the 1,500-word total is enforced. Annotations from 2022 that struck words at a section boundary predate the correction.',
      detector: 'Output states that a section is over its limit and deducts, or attributes a mark reduction to section length rather than to the total.',
    },
    {
      id: 'ds-source-evaluation-required',
      severity: 'high',
      subjects: DS,
      claim: 'Each source needs a value-and-limitations evaluation, and its absence should cost marks under criterion B.',
      reality: 'Criterion B asks for claims, perspectives and a justification of usefulness. When the top-scoring example evaluated its sources by questioning who funded a study, the marker noted this was not expected and credited it as evidence of advanced understanding rather than as a requirement met.',
      detector: 'Criterion B feedback says the student failed to evaluate sources, or lists source evaluation among required components.',
    },
    {
      id: 'ds-science-ia-ladder',
      severity: 'high',
      subjects: DS,
      claim: 'The project is research, so it needs a hypothesis, variables, a sample size, controls and a reliability discussion.',
      reality: 'None of these appear anywhere in the criteria. The research methods material in the course is descriptive of qualitative, quantitative and mixed approaches; it sets no methodological requirements for the project.',
      detector: 'Feedback contains hypothesis, independent variable, control, sample size, reliability or validity as a criticism of the method.',
    },
    {
      id: 'ds-primary-data-expected',
      severity: 'medium',
      subjects: DS,
      claim: 'The student should have collected their own data through surveys, interviews or experiments, because the project involves first-hand research.',
      reality: 'No criterion requires student-collected data. Criterion B is satisfied by discussing three sources of any type, and the guide lists news, books, databases, media and live experiences among acceptable research sources. None of the three published examples collected primary data and one scored 22 of 24.',
      detector: 'Feedback recommends a survey or interviews, or attributes lost marks to the absence of original data collection.',
    },
    {
      id: 'ds-recency-as-quality',
      severity: 'medium',
      subjects: DS,
      claim: 'A newer technology makes a better topic, and inquiries into established systems should be marked down.',
      reality: 'No criterion refers to currency of the technology. The real-world example must be specific and relevant to the inquiry; nothing requires it to be recent. The top-scoring example used social media platforms that had been studied for years.',
      detector: 'Feedback suggests choosing a more current technology, or praises a topic for being cutting-edge.',
    },
    {
      id: 'ds-framework-as-criterion',
      severity: 'medium',
      subjects: DS,
      claim: 'The concepts, content and contexts framework should be marked everywhere, or alternatively ignored entirely.',
      reality: 'Concepts, content and contexts are scored under criterion A only, as part of the focus explanation. They are not separately marked in C, D or E, and their absence from the focus is an A-level fault.',
      detector: 'Criterion C, D or E feedback asks for more course concepts, or criterion A feedback never checks whether at least one connection per category is present.',
    },
    {
      id: 'ds-sl-hl-difference',
      severity: 'medium',
      subjects: DS,
      claim: 'HL work should be held to a stricter standard, or should contain an HL extension element.',
      reality: 'The project is identical at SL and HL: same requirements, same criteria, same 24 marks. Only the weighting differs, 30 per cent at SL against 20 per cent at HL. The HL extension challenge topics belong to the examination papers.',
      detector: 'Feedback references an HL extension requirement, or applies different band thresholds by level.',
    },
    {
      id: 'ds-opinion-correctness',
      severity: 'medium',
      subjects: DS,
      claim: 'The judgement the student reaches about the technology can be agreed or disagreed with as part of the assessment.',
      reality: 'What is marked is whether claims are supported by evidence. The top-scoring example concluded that social media harms mental health and was credited for justifying it with sources and figures, not for holding that view.',
      detector: 'Feedback contests the substance of the conclusion, or calls a position balanced or unbalanced without reference to evidence.',
    },
    {
      id: 'ds-production-polish',
      severity: 'medium',
      subjects: DS,
      claim: 'Criterion E scores production quality — editing, animation, voice performance — and isolated technical faults should be penalised.',
      reality: 'Criterion E is organisation of ideas and evidence plus coherent use of media in support of understanding. A blank screen lasting around twenty-four seconds in the top-scoring example was explicitly not penalised, because the surrounding delivery and visuals remained effective.',
      detector: 'Criterion E feedback comments on editing sophistication or voice quality, or deducts for a single isolated glitch.',
    },
    {
      id: 'ds-appendix-rescue',
      severity: 'medium',
      subjects: DS,
      claim: 'Appendices and supplementary documents submitted alongside the two assessed artefacts can be read and credited.',
      reality: 'Submitted work must not contain appendices and they are not read by examiners. Only the process document, the presentation and the list of references exist for assessment purposes.',
      detector: 'Feedback references appendix content, or suggests moving material to an appendix to manage the word count.',
    },
    {
      id: 'ds-language-penalty',
      severity: 'medium',
      subjects: DS,
      claim: 'Spelling, grammar, awkward phrasing or informal register should cost marks.',
      reality: 'No criterion covers language quality. The IB published the example student work with its original spelling and grammatical errors intact and said so explicitly.',
      detector: 'Any feedback line naming a grammar, spelling or style error as a reason for a mark.',
    },
  ],
}

/* ------------------------------------------------------------------ */
/* Topic rules                                                         */
/* ------------------------------------------------------------------ */

export const digitalSocietyRules: TopicRuleSet = {
  rubricId: 'ib-ia-digital-society',
  label: 'IB Digital Society IA (the inquiry project)',

  contexts: [
    { id: 'ds-cultural', label: 'Cultural', hint: 'Subcultures, traditions, language, art and the ways communities make and share meaning through digital systems.' },
    { id: 'ds-economic', label: 'Economic', hint: 'Work, labour, markets, business models, ownership and the distribution of economic value.' },
    { id: 'ds-environmental', label: 'Environmental', hint: 'Resource use, energy, waste, monitoring of natural systems and the environmental footprint of digital infrastructure.' },
    { id: 'ds-health', label: 'Health', hint: 'Physical and mental health, care delivery, medical data, wellbeing and access to health services.' },
    { id: 'ds-human-knowledge', label: 'Human knowledge', hint: 'Education, research, expertise, and how knowledge is produced, verified and circulated.' },
    { id: 'ds-political', label: 'Political', hint: 'Governance, rights, participation, law, security, and the exercise of state and institutional power.' },
    { id: 'ds-social', label: 'Social', hint: 'Relationships, families, communities, identity, belonging and everyday social life.' },
  ],

  rules: [
    {
      id: 'ds-no-specific-rwe',
      label: 'No specific real-world example',
      detail: 'The focus names a category — wearables, apps, social media, AI — rather than one identifiable case. A published example offered smart watches, smart homes and apps as its real-world examples and its marker rejected these as wide groups of products. Name one platform, one deployment, one incident, one policy.',
      severity: 'fatal',
      hits: ['A'],
    },
    {
      id: 'ds-missing-focus-element',
      label: 'A required focus element is absent',
      detail: 'The focus must carry an inquiry question, a specific relevant real-world example, and connections to course concepts, content and contexts, with at least one connection per category. Any one missing caps criterion A at 1 mark.',
      severity: 'fatal',
      hits: ['A'],
    },
    {
      id: 'ds-thin-source-base',
      label: 'Cannot support three substantial sources',
      detail: 'The claims and perspectives section requires three sources discussed in depth, roughly 400 words each. If the topic is so new, so local or so obscure that only news briefs and vendor marketing exist, criterion B is capped before the project begins.',
      severity: 'fatal',
      hits: ['B'],
    },
    {
      id: 'ds-reused-from-other-component',
      label: 'Reused from another DP component',
      detail: 'Material used in any other DP assessment task, the extended essay included, must not appear in the inquiry project. Choosing an extended essay topic and repackaging it is an academic integrity issue rather than a marking one.',
      severity: 'fatal',
      hits: ['A', 'B', 'C', 'D', 'E'],
    },
    {
      id: 'ds-how-it-works',
      label: 'Technical explanation topic',
      detail: 'Questions of the form how does X work, what is X, or how is X built cannot reach the upper bands of criterion C, because that criterion marks impacts and implications for people and communities. Recast towards what the system does to somebody.',
      severity: 'major',
      hits: ['C'],
    },
    {
      id: 'ds-descriptive-question',
      label: 'Question answerable by description',
      detail: 'If the question can be fully answered by reporting facts, the presentation will be descriptive whatever the student intends. Build the question on an evaluation-level command term — to what extent, evaluate, discuss, examine — so that weighing is structurally required.',
      severity: 'major',
      hits: ['C', 'D'],
    },
    {
      id: 'ds-scope-too-wide',
      label: 'Too broad for ten minutes',
      detail: 'Topics spanning several stakeholder groups and several distinct effects run out of time before analysis can be sustained. A published example covering bots across elections, businesses and other stakeholders was marked down specifically for failing to hold focus on one topic.',
      severity: 'major',
      hits: ['C', 'E'],
    },
    {
      id: 'ds-no-identified-community',
      label: 'No identified people or communities',
      detail: 'Criterion C requires impacts and implications for people and communities. A focus on society in general gives the analysis nobody to be about. Name the group: night-shift warehouse staff, rural patients, minority-language creators, first-generation university applicants.',
      severity: 'major',
      hits: ['C'],
    },
    {
      id: 'ds-no-forward-look',
      label: 'No plausible trends or future developments',
      detail: 'Criterion D is worth six marks and requires a substantiated discussion of emerging trends and future developments. Historical or fully settled topics leave a quarter of the mark scheme unreachable. Check before committing that credible forward-looking material exists.',
      severity: 'major',
      hits: ['D'],
    },
    {
      id: 'ds-no-course-connection',
      label: 'No identifiable course connection',
      detail: 'The focus must connect to course concepts, content and contexts. A topic that is about a technology but not about change, expression, identity, power, space, systems or values and ethics is outside the course as framed.',
      severity: 'major',
      hits: ['A'],
    },
    {
      id: 'ds-focus-drift',
      label: 'Focus differs between the two artefacts',
      detail: 'The same inquiry question must appear in the process document and in the presentation introduction. A focus quietly narrowed or widened between the two weakens criterion A and detaches the analysis from the sources that were justified.',
      severity: 'minor',
      hits: ['A', 'C'],
    },
    {
      id: 'ds-sensitive-topic-care',
      label: 'Sensitive topic requiring care',
      detail: 'Research must be safe and appropriate for the school context and the age of the student, and challenging or sensitive material must be handled responsibly. Topics involving vulnerable groups, self-harm, extremist content or identifiable individuals need a plan for handling before the focus is fixed.',
      severity: 'minor',
      hits: ['A'],
    },
    {
      id: 'ds-personal-anecdote-base',
      label: 'Evidence base is personal experience',
      detail: 'Individual stories were rejected twice in the lowest-scoring published example as failing to show broader impact. Personal experience can open an inquiry but cannot carry criterion C. Check that population-level evidence exists.',
      severity: 'minor',
      hits: ['C'],
    },
  ],

  levelNotes: {
    SL: 'Identical task, identical criteria, 24 marks. Worth 30 per cent of the final grade — the single heaviest component in the SL course.',
    HL: 'Identical task, identical criteria, 24 marks. Worth 20 per cent of the final grade. The HL extension challenge topics belong to the examination papers and are not required here, though nothing prevents a focus that happens to touch them.',
  },

  titleGuidance: [
    'Build the question on an evaluation-level command term: to what extent, evaluate, discuss, examine. These are the terms that make weighing structurally necessary rather than optional.',
    'Name the specific real-world case in or immediately beside the question — a named platform, deployment, policy or incident, not a product category.',
    'Name the people or communities affected. Criterion C is about impacts on them, and a question that does not mention anybody tends to produce analysis that does not either.',
    'Keep the question answerable inside ten minutes of presentation: one system, one group, one axis of impact.',
    'Use the identical wording in the process document and in the presentation introduction.',
    'Check that the question survives all three of these: can three substantial sources be found, can impacts on identified people be evidenced, and is there credible material about where this is heading.',
  ],

  dataGuidance: [
    'Exactly three sources are discussed in the claims and perspectives section. Not a minimum — two published examples were marked down for exceeding it.',
    'Budget roughly 400 words per source and keep the three roughly equal. Uneven weighting cost marks in one published example where the third source received a short paragraph after two long ones.',
    'Each source needs its origin and purpose, its claims and how it argues them, how it sits against the other two, and an explicit sentence saying what it gave this inquiry.',
    'Choose sources that disagree or come from different vantage points. Corroboration and contrast are what the discussion has to work with.',
    'Every source consulted anywhere in the project goes in the list of references, including images, video and audio, whether or not it was among the three discussed.',
    'Cite at point of use in both artefacts. In the presentation this can be written on screen, shown visually, or spoken aloud.',
    'The student does not have to collect original data. None of the published examples did, and one scored 22 of 24.',
    'References, point-of-use citations, headings, labels and captions do not count towards the 1,500 words.',
  ],

  scopeNote:
    'One inquiry project, identical at SL and HL: an inquiry process document of at most 1,500 words, a recorded multimedia presentation of at most ten minutes, and a list of references. Twenty-four marks, fifteen of them on the presentation, which is where topic choice pays off or fails — a focus that cannot be argued, evidenced and projected forward in ten minutes has already capped criteria C and D before a word is written.',
}

/* ------------------------------------------------------------------ */
/* Exemplars                                                           */
/* ------------------------------------------------------------------ */

export const digitalSocietyExemplars: SubjectExemplars = {
  subject: 'Digital Society',
  rubricId: 'ib-ia-digital-society',
  exemplars: [
    {
      title: 'To what extent does algorithmic shift-scheduling software improve or erode income stability for hourly retail workers?',
      context: 'ds-economic',
      why: 'Names one class of system with identifiable commercial products behind it, and one clearly bounded group of people. The question is built on an evaluation-level term and has two sides that genuinely compete: the same software that raises store efficiency also fragments shifts. Concept: power. Content: algorithms and data. Context: economic, with social secondary. A real forward-looking literature on scheduling regulation exists, which protects criterion D.',
      data: 'Labour-economics research on schedule volatility and earnings; a vendor white paper or product documentation for one named workforce-management platform, read for what it claims and to whom; investigative journalism or a union report on the worker side. Three sources, three vantage points, all of which disagree usefully.',
      watchOut: 'The trap is drifting into how the optimisation algorithm works. Criterion C marks what it does to the working week of the employee, not how it solves the assignment problem. The other trap is scope: pick one retail sector in one country, not retail work in general.',
    },
    {
      title: 'To what extent do automated content-moderation systems on major video platforms silence creators working in minority languages?',
      context: 'ds-cultural',
      why: 'A specific real-world case is available in the form of one named platform and its published transparency reporting. The affected community is precise and under-served, which keeps the analysis from becoming a general complaint about moderation. Concept: expression, with power available as a second lens. Content: artificial intelligence, media, algorithms. Emerging trends are abundant — multilingual model training, appeals processes, regulatory pressure — which gives criterion D real material.',
      data: 'A platform transparency report or policy document read for origin and purpose; a computational-linguistics paper on performance disparity across languages; testimony or reporting from creators in one named language community. The three sit at institutional, technical and lived levels respectively, which makes corroboration and contrast easy to write.',
      watchOut: 'Do not let the technical source take over — a long explanation of how classifiers underperform on low-resource languages is background, not analysis. Also pick one language community and stay with it; three is a different and worse project.',
    },
    {
      title: 'To what extent has the rollout of a national digital identity system changed access to public services for residents without smartphones?',
      context: 'ds-political',
      why: 'The real-world example is one named national programme with documented rollout dates, which is about as specific as this criterion ever asks for. The affected group is defined by an absence rather than a demographic, which forces the analysis towards a genuine access question instead of a general privacy discussion. Concept: space, with values and ethics available. Content: data, networks and the internet. Trends are well documented: offline fallbacks, assisted digital provision, legal challenges.',
      data: 'Government implementation or evaluation documentation; a civil-society or ombudsman report on exclusion cases; an academic study of digital divides in the same country. Three sources with visibly different purposes, which is exactly what the claims and perspectives discussion needs.',
      watchOut: 'Privacy is the gravitational pull here and it is a different question. If the presentation ends up about surveillance, the focus in the process document no longer matches the analysis and criterion A weakens along with C. Narrow to one or two named services rather than public services as a whole.',
    },
  ],
}