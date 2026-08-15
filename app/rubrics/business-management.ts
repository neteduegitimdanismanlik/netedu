// app/rubrics/business-management.ts
//
// IB Business Management — Business Research Project (IA).
// SL and HL share one identical task, one set of criteria and one word limit;
// only the weighting differs (30% SL, 20% HL). One rubric serves both.
//
// Source: Business Management subject guide (first assessment 2024), TSM 2022,
// and five published assessed projects with examiner commentary. IB sentences
// are never reproduced; this is our own statement of the facts and thresholds.
//
// NOT SHIPPED YET: feedback templates and the research-question pattern pool.
// Both need schema layers that do not exist. Held for the topic-pool work item.

import type { ExtendedRubric } from './rubrics-extra'
import type { MarkingModel } from './checker-guards'
import type { TopicRuleSet } from './topic-rules'
import type { SubjectExemplars } from './topic-exemplars'

const BM = ['Business Management']

/* ------------------------------------------------------------------ */
/* Rubric                                                              */
/* ------------------------------------------------------------------ */

export const businessManagementRubric: ExtendedRubric = {
  id: 'ib-ia-business-management',
  framework: 'IB',
  documentType: 'Internal Assessment',
  label: 'IB — Internal Assessment (Business Management, Business Research Project)',
  totalMax: 25,
  shape: 'single',

  // One identical task carries two weightings: 30% at SL, 20% at HL. The schema
  // holds a single number, so SL is stored here and HL is stated in `guidance`.
  weight: 30,

  // DOGRULANMADI: no component grade boundaries appear in the guide, the TSM or
  // the assessed student work pack. IB publishes IA boundaries per session. The
  // scale below is an in-product estimate only.
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
    limit: 1800,
    unit: 'words',
    hard: true,
    included: [
      'introduction, main body and conclusion — all continuous prose',
      'definitions of business management terms (these must sit in the body)',
      'quotations (these must sit in the body)',
      'headings and sub-headings that form part of the running text',
    ],
    excluded: [
      'acknowledgments',
      'contents page',
      'tables of statistical data',
      'diagrams and figures',
      'equations, formulae and calculations',
      'supporting documents',
      'in-text citations placed in the body',
      'reference entries placed in footnotes or endnotes',
      'bibliography',
    ],
  },

  guidance:
    'Identical task, criteria and word limit at SL and HL. Weighting differs: 30% of the final grade at SL, 20% at HL, with 20 teaching hours at both levels. The project must address a real issue or problem at one real organization. Industry-wide material is admissible only where it bears on that one organization. Exactly one of the four key concepts — change, creativity, ethics or sustainability — must be named on the title page and used as the lens for the whole project. Three to five supporting documents must be attached, and most of the project information must come from them. Going over 1,800 words is not a deduction: assessment stops at word 1,800 and nothing past it is read, which usually costs the conclusion.',

  criteria: [
    {
      id: 'A',
      name: 'Integration of a key concept',
      max: 5,
      description:
        'How far the reasoned connection between the chosen key concept and the organization is carried through the whole project rather than parked in one section. The concept must be one of change, creativity, ethics or sustainability, and the student must make the lens explicit.',
      verbLadder: 'integration',
      bands: [
        { range: '0', descriptor: 'The work falls below band 1, or the concept named is something other than change, creativity, ethics or sustainability' },
        { range: '1', descriptor: 'The chosen concept is understood at the level of definition; it is not tied to the organization under study' },
        { range: '2', descriptor: 'The link between concept and organization is set out descriptively — stated and illustrated, but not examined' },
        { range: '3', descriptor: 'The link is broken down and reasoned about, but the reasoning sits in identifiable places rather than running through the project' },
        { range: '4', descriptor: 'The reasoned link surfaces across more than one part of the project, but the threading is incomplete — sections still read as if the concept could be lifted out of them' },
        { range: '5', descriptor: 'The reasoned link runs from the introduction to the conclusion and shapes how each piece of evidence is handled; removing the concept would collapse the project' },
      ],
      calibration: [
        'Top band: the concept determines what counts as evidence. In the highest-scoring sample the lens governed every section and the student ended by testing the organization\'s own claim about itself against that lens.',
        'Middle band (3): explanation is present and correct, but the sections do not talk to each other. One sample was held at 3 rather than 4 on exactly this — the text was described as too disjointed to count as integration.',
        'Low band (2): naming the concept repeatedly, even with sophisticated vocabulary for it, does not lift the mark. One sample used specialist terminology for its concept throughout and still scored 2, because the conceptual reasoning stayed thin.',
        'Low band (2): taking one dimension of a broad concept and ignoring the rest caps the mark. One sample handled economic sustainability robustly — enough on its own for 3 — but ignored the social and environmental dimensions in a context where both were available, and was held at 2.',
        'Band 4 was awarded in none of the five published samples. The band exists; it is simply rare. Do not avoid it, but when awarding 3 instead, say explicitly which sections the concept fails to reach.',
      ],
    },
    {
      id: 'B',
      name: 'Supporting documents',
      max: 4,
      description:
        'Whether three to five documents are attached, whether each bears on the research question with enough substance to be worked with, and whether the set as a whole carries different positions or vantage points.',
      verbLadder: 'quality',
      bands: [
        { range: '0', descriptor: 'The work falls below band 1' },
        { range: '1', descriptor: 'Fewer than three or more than five documents are attached, or the documents attached bear only marginally on the research question' },
        { range: '2', descriptor: 'Three to five documents are attached and are broadly on topic, but at least one is too thin to support the work done with it' },
        { range: '3', descriptor: 'Three to five documents are attached, all bearing on the research question, each carrying enough substance to be analysed' },
        { range: '4', descriptor: 'As band 3, and the set taken together supplies genuinely different ideas or vantage points on the question' },
      ],
      calibration: [
        'The step from 3 to 4 is about the set, not the individual documents. One sample attached three documents that were each relevant and in depth, and was held at 3 because no clear range of perspectives emerged from them.',
        'Range that earned 4 in the samples: documents covering different business functions; a mix of internal and external voices; a mix of quantitative and qualitative material.',
        'A document that is not directly about the organization can still count, but its relevance has to be visible. One sample dropped to 2 because two of its three documents were about a general phenomenon rather than the organization under study.',
        'Attaching more than five documents is not thoroughness — it caps this criterion at 1 mark regardless of quality.',
        'Formatting problems in the attached documents themselves are not penalised anywhere in this rubric. One examiner noted attachment formatting issues and explicitly declined to deduct for them.',
      ],
    },
    {
      id: 'C',
      name: 'Selection and application of tools and theories',
      max: 4,
      description:
        'Whether the business management tools and theories used were chosen for a reason connected to the research question, and whether they were actually worked through rather than named.',
      verbLadder: 'quality',
      bands: [
        { range: '0', descriptor: 'The work falls below band 1' },
        { range: '1', descriptor: 'Very few tools or theories are brought in, or those brought in have no bearing on the research question' },
        { range: '2', descriptor: 'Some tools and theories are applied to the question, but their bearing on it stays at surface level' },
        { range: '3', descriptor: 'Tools and theories are reasonably chosen and worked through, but why each one belongs to this particular question is not always evident' },
        { range: '4', descriptor: 'Tools and theories are chosen deliberately and worked through properly, and their bearing on the research question is evident' },
      ],
      calibration: [
        'This criterion rewards application, not inventory. Four of the five published samples scored the maximum, and the one that did not was still credited at 3 with only two tools in play.',
        'A small toolkit is not a defect. One examiner refused to drop a sample to 2 for using only a profitability calculation and a motivation theory, on the principle that IB marking credits what is present rather than penalising what is absent.',
        'A tool that adds little is not itself a deduction here. In one sample a closing SWOT analysis was described as adding little, and the criterion still took full marks because the student demonstrated competent construction and sourced it.',
        'Where a tool is not just weak but actively pulls the project off course, the cost lands on criterion D, not here. One sample kept full marks on C while losing marks on D because a three-way company comparison became a distraction.',
        'HL-only tools — force field analysis, Gantt charts, Hofstede, Porter\'s generic strategies, contribution and make-or-buy, critical path analysis — are available to HL students and not to SL students. Their absence in an SL project is not a weakness and must never be flagged as one.',
      ],
    },
    {
      id: 'D',
      name: 'Analysis and evaluation',
      max: 5,
      description:
        'How well data drawn from the supporting documents is used to analyse and weigh the research question, whether the strands of the argument connect to one another, and whether the assumptions behind the arguments are examined.',
      verbLadder: 'quality',
      bands: [
        { range: '0', descriptor: 'The work falls below band 1' },
        { range: '1', descriptor: 'Data is drawn from the documents only sparsely, and the research question is neither analysed nor weighed' },
        { range: '2', descriptor: 'Data is used at surface level, so analysis and evaluation of the question barely develop' },
        { range: '3', descriptor: 'Data use is serviceable and produces some analysis and some weighing of positions' },
        { range: '4', descriptor: 'Data use is sufficient to drive analysis and evaluation that mostly work, and the ideas begin to connect to one another' },
        { range: '5', descriptor: 'Data use drives thorough analysis and evaluation; the ideas are held together across the whole project, and the assumptions behind the arguments and what follows from them are examined' },
      ],
      calibration: [
        'Band 4 to band 5 is a change in kind, not degree. In the only sample to reach 5, the student took a claim the organization made about itself, treated that claim as an assumption, tested it against the documents, and concluded against the organization. Effective analysis alone sits at 4.',
        'Band 5 also requires the conceptual thread to close. One sample with good analysis and good evaluation was held at 4 because it never brought the argument back to the distinctions inside its own key concept.',
        'Band 3 is where material that does not serve the question lands. In one sample a comparison with two rival companies was judged a distractor that broke the link between the concept and the analysis, and the mark settled at 3.',
        'Financial calculation is not evidence of band 4 or 5 by itself. In the samples, ratio work and profitability calculations counted as tools under C; they earned D marks only where they were connected to the conceptual argument.',
        'Evaluation means weighing, and a single comparative judgement is enough to show it — but not enough to reach 4. One sample offered a clear comparative judgement and was still held at 3.',
      ],
    },
    {
      id: 'E',
      name: 'Conclusions',
      max: 3,
      description:
        'Whether the conclusion follows from the evidence actually presented and whether it states an answer to the research question in so many words.',
      verbLadder: 'competence',
      bands: [
        { range: '0', descriptor: 'The work falls below band 1' },
        { range: '1', descriptor: 'The conclusion does not follow from what was presented, or it stays at surface level' },
        { range: '2', descriptor: 'Parts of the conclusion follow from the evidence presented' },
        { range: '3', descriptor: 'The conclusion follows from the evidence and answers the research question explicitly' },
      ],
      calibration: [
        'This is the criterion most often decided before the project is written. In the published samples, three of the four marks lost here trace back to how the research question was worded, not to how the conclusion was written.',
        'Cause one: the question promises more coverage than the project delivers. One sample asked about all business functions and delivered mostly finance.',
        'Cause two: the question is framed so that no available evidence could settle it. One sample asked whether a five-year corporate plan would raise financial success — a claim the documents could not close, so the conclusion could not answer it.',
        'Cause three: the question names a specific outcome that the conclusion then does not address. One sample built its question around long-run losses and concluded without returning to them.',
        'The single lowest mark came from length: that project ran 200 words over, most of the conclusion went unread, and what remained was superficial.',
        'The conclusion must not introduce facts or arguments not discussed earlier. Naming what the project could not settle, and what would need further investigation, is treated as good practice.',
      ],
    },
    {
      id: 'F',
      name: 'Structure',
      max: 2,
      description:
        'Whether the project is organized on a scheme a reader can follow — in particular whether the main body has a discernible ordering principle.',
      verbLadder: 'presence',
      bands: [
        { range: '0', descriptor: 'The work falls below band 1' },
        { range: '1', descriptor: 'The organizing scheme is thin, or hard to discern from the main body' },
        { range: '2', descriptor: 'The project is organized in a way a reader can follow' },
      ],
      calibration: [
        'Two marks is the norm — four of five samples took it — but it is not automatic. The single sample that lost a mark here was the highest-scoring project in the set, and lost it because seven pages of main body had no discernible ordering principle behind a single heading.',
        'The bar is low and concrete. One sample earned full marks with nothing more sophisticated than taking one analytical model after another in sequence. Another earned them by working through the business functions in turn, even though they received unequal treatment.',
        'The test is applied to the main body, not to the presence of an introduction and a conclusion. A project can have both and still score 1.',
        'Do not conflate this with criterion G. F is about the ordering of the argument; G is a checklist of four physical elements.',
      ],
    },
    {
      id: 'G',
      name: 'Presentation',
      max: 2,
      description:
        'Whether the four required physical elements are present: a title page, an accurate table of contents, appropriate headings and sub-headings, and numbered pages.',
      verbLadder: 'presence',
      bands: [
        { range: '0', descriptor: 'The work falls below band 1' },
        { range: '1', descriptor: 'One or more of the required elements is missing' },
        { range: '2', descriptor: 'All of the required elements are present' },
      ],
      calibration: [
        'All five published samples scored 2. This criterion is an inventory, and it is free marks for any student who checks the list.',
        'The list is closed: title page, accurate table of contents, appropriate headings and sub-headings, numbered pages. "Accurate" applies to the contents page — its page numbers must match the document.',
        'Prose quality, typography, typos, citation style and the formatting of the attached documents are not assessed here or anywhere else in this rubric. Never deduct for them.',
        'The word count belongs on the cover page and the key concept must be named on the title page. Treat a missing key-concept statement as a criterion A problem first — it is the concept that carries 5 marks, not the title page.',
      ],
    },
  ],
}

/* ------------------------------------------------------------------ */
/* Marking model                                                       */
/* ------------------------------------------------------------------ */

export const businessManagementMarking: MarkingModel = {
  rubricId: 'ib-ia-business-management',

  bestFit: [
    'Best fit is explicit for this task. Where a project matches different parts of one criterion at different levels, compensate and award the mark that most fairly reflects the balance.',
    'A descriptor does not have to be satisfied in every particular for its mark to be awarded.',
    'Read down the descriptors until one fits. Where the work sits between two, reread both and take the closer one.',
    'The top descriptor does not mean flawless work. It is meant to be reachable by a student, and the extremes of the scale should be used when they fit.',
    'Whole marks only. No halves, no decimals.',
    'The criteria are independent. In the published samples the project that scored highest overall was also the only one to lose a mark on structure.',
    'Credit what is present rather than penalising what is absent. This principle was applied explicitly in the published commentary to hold a project at 3 on criterion C rather than dropping it to 2 for a small toolkit.',
    'The same criteria apply at SL and HL. There is no higher expectation at HL.',
  ],

  zeroRules: [
    'Criterion A is 0 if the concept named is anything other than change, creativity, ethics or sustainability. This zeroes A only — the other 20 marks remain available. Do not reduce the total to 0 and do not lower B through G for a concept problem.',
    'Before awarding A a zero, check the title page and the introduction for a named concept. If the concept is present but unconventionally worded, map it to the nearest of the four rather than zeroing. If no concept can be found at all, say so plainly and explain what the student must add, rather than producing a silent 0.',
    'Any criterion is 0 where the work does not reach its lowest descriptor.',
    'The word limit is not enforced by a zero or a deduction. Assessment is based on the first 1,800 words and nothing beyond that point is read. Criteria whose evidence sits in the tail — usually E, sometimes D — collapse as a consequence.',
    'Failure to acknowledge a source is handled as a potential breach of regulations by the IB, not as a mark deduction inside this rubric.',
    'The same piece of work cannot be submitted for both the IA and the extended essay. A student writing a Business Management EE must use a different organization for each.',
  ],

  hardCeilings: [
    {
      when: 'More than five supporting documents are attached',
      criterionId: 'B',
      max: 1,
      why: 'Exceeding five documents caps criterion B at 1 mark, whatever the quality of the set.',
    },
    {
      when: 'Fewer than three supporting documents are attached',
      criterionId: 'B',
      max: 1,
      why: 'The band 1 descriptor covers projects with only one or two documents.',
    },
    {
      when: 'The attached documents bear only marginally on the research question',
      criterionId: 'B',
      max: 1,
      why: 'Marginal relevance sits in band 1 alongside the wrong number of documents.',
    },
    {
      when: 'Any of the four presentation elements is missing — title page, accurate contents page, headings and sub-headings, page numbers',
      criterionId: 'G',
      max: 1,
      why: 'Band 2 requires all required elements; band 1 covers one or more missing.',
    },
  ],

  distributionFacts: [
    'Base rate from the five published assessed projects: totals of 17, 19, 19, 20 and 24 out of 25, mean 19.8. This is a curated teaching set, not session statistics — never present it to a student as a grade distribution.',
    'Mean marks as a share of each maximum across those five: A 60%, B 85%, C 95%, D 76%, E 67%, F 90%, G 100%.',
    'Criterion A is the largest single source of loss. Its five marks were 2, 2, 3, 3 and 5.',
    'Band A4 was awarded in none of the five samples. The band exists; it is simply rare in the published set.',
    'Criterion E was the second-largest source of loss in proportional terms: marks of 1, 2, 2, 2 and 3.',
    'Criteria C and G accounted for almost no loss. A report that spends most of its feedback on tool selection or on formatting is aimed at the wrong criteria.',
    'The only structure mark lost in the set came from the highest-scoring project. Do not treat F2 as automatic for strong work.',
  ],

  sixVersusFour: [
    {
      criterionId: 'A',
      subjects: BM,
      six: 'A5 — the key concept decides what the student looks at. It is named on the title page, opened in the introduction, used to choose which document evidence matters, carried through every analytical section, and closed in the conclusion.',
      four: 'A3 — the connection between concept and organization is analysed correctly and sometimes well, but the analysis sits in particular paragraphs. A reader could delete the concept from two or three sections and they would still stand up.',
      movingLine: 'Stop treating the concept as a section and start treating it as the question every section has to answer. In each analytical section, add the sentence that says what this finding means for the concept — and make the conclusion answer a conceptual question, not just a factual one.',
    },
    {
      criterionId: 'B',
      subjects: BM,
      six: 'B4 — three to five documents, all bearing on the question, each substantial enough to analyse, and between them a real spread: different business functions, internal against external voices, or quantitative against qualitative material.',
      four: 'B3 — the documents are relevant and deep enough, but they say the same kind of thing from the same kind of place: three articles from the trade press, or three publications by the company itself, or three surveys of similar populations.',
      movingLine: 'Replace one document with a source that has an interest in disagreeing. If the set is all company-published, add an external one; if all external, add the company\'s own account; if all narrative, add data.',
    },
    {
      criterionId: 'C',
      subjects: BM,
      six: 'C4 — two or three tools chosen because this question needs them, each worked through with the organization\'s own figures or evidence, and each visibly feeding the argument.',
      four: 'C2 or C3 — the tools appear and are applied, but the reader cannot always see why this tool and not another. Typical shape: a broad situational tool dropped in at the start or end because it was expected, with no consequence for the argument.',
      movingLine: 'For each tool, write the sentence that says what the research question would be missing without it. Any tool without such a sentence should be cut — and cutting it costs nothing, because this criterion does not count tools.',
    },
    {
      criterionId: 'D',
      subjects: BM,
      six: 'D5 — the document evidence drives the argument, the strands connect, and at least one assumption underneath the argument is named and tested, including where it applies an assumption the organization itself is making.',
      four: 'D3 or D4 — analysis works and there is genuine weighing of positions, but the argument accepts its own premises. Nothing asks whether the framing is right, and material that does not serve the question is allowed to stay.',
      movingLine: 'Find the claim the argument rests on — usually the organization\'s own stated rationale — and put one section to work testing it against the documents. Then cut anything interesting but not load-bearing.',
    },
    {
      criterionId: 'E',
      subjects: BM,
      six: 'E3 — the conclusion states an answer in the words of the research question, and every part of that answer was established earlier in the project. Nothing new enters.',
      four: 'E1 or E2 — some of the conclusion follows from the evidence and some does not; or the question asked for something the project did not deliver; or the conclusion arrived after word 1,800 and was never read.',
      movingLine: 'Put the research question and the conclusion side by side and check that every noun in the question appears in the answer. Then check the word count: if the project is over 1,800, the conclusion is the part that disappears.',
    },
    {
      criterionId: 'F',
      subjects: BM,
      six: 'F2 — the main body runs on a stated principle a reader can name: by analytical model, by business function, by stage of the argument.',
      four: 'F1 — there is an introduction and a conclusion, but the pages between them are one undifferentiated stretch under a single heading such as "Research and Analysis".',
      movingLine: 'Choose the ordering principle explicitly and give the main body sub-headings that expose it. This is the cheapest mark on the whole rubric.',
    },
  ],

  pitfalls: [
    {
      id: 'bm-science-ladder',
      severity: 'critical',
      subjects: BM,
      claim: 'The model imports a science-IA frame and looks for a hypothesis, variables, controls, sample size, uncertainty or a methodology critique, then deducts for their absence.',
      reality: 'None of the seven criteria mentions any of these. The guide asks only that the introduction explain the methodology used; no criterion assesses methodological quality, reliability, validity or sampling.',
      detector: 'Output contains "variable", "control", "sample size", "hypothesis", "uncertainty", "reliability of measurement" or "methodological limitation" as a stated weakness. None of these belongs in feedback on this task.',
    },
    {
      id: 'bm-tool-counting',
      severity: 'critical',
      subjects: BM,
      claim: 'Criterion C is a count, so projects that deploy many tools score higher and using only two is a deduction.',
      reality: 'C assesses whether tools were selected for a reason and applied properly. The published commentary states the aim is not to use as many tools as possible but to select relevant ones, and explicitly declines to drop a project for a small toolkit. Using many tools superficially weakens an IA.',
      detector: 'Feedback names a number of tools as a reason for the mark, or recommends adding a SWOT, STEEPLE or BCG without saying what the research question would gain from it.',
    },
    {
      id: 'bm-tool-presence-vs-application',
      severity: 'high',
      subjects: BM,
      claim: 'The presence of a named framework — a SWOT box, an Ansoff grid — earns criterion C marks.',
      reality: 'The descriptors distinguish tools whose relevance is superficial (band 2) from tools applied with clear relevance to the question (band 4). Presence sits at the bottom of that ladder, not the top.',
      detector: 'A criterion C justification names a framework without quoting what the project did with its output.',
    },
    {
      id: 'bm-irrelevant-tool-wrong-criterion',
      severity: 'high',
      subjects: BM,
      claim: 'A tool that turns out not to serve the question is a criterion C deduction.',
      reality: 'In the published set, a project whose three-way company comparison became a distraction kept full marks on C and lost marks on D. Weak choice of analytical direction is charged to analysis and evaluation, not to tool application.',
      detector: 'The report lowers C for irrelevance while leaving D untouched. The reverse pattern is the correct one.',
    },
    {
      id: 'bm-concept-frequency',
      severity: 'critical',
      subjects: BM,
      claim: 'How often the key concept is named indicates how well it is integrated.',
      reality: 'Criterion A is an integration ladder, not a frequency one. One published project referenced its concept throughout with specialist vocabulary and scored 2 of 5 because the conceptual reasoning stayed descriptive. Another analysed the connection properly and still lost the higher bands because the text was disjointed.',
      detector: 'A criterion A justification rests on how often the concept appears, or on the presence of concept vocabulary, rather than on whether the concept governs the analysis in each section.',
    },
    {
      id: 'bm-concept-narrowing',
      severity: 'medium',
      subjects: BM,
      claim: 'A tightly scoped treatment of one dimension of a concept is focus, and should be rewarded.',
      reality: 'A published project handled economic sustainability rigorously and ignored the social and environmental dimensions in a context where both were plainly available. The rigorous part alone could have justified band 3; the omission held it at 2.',
      detector: 'Where the concept is sustainability, check whether people, planet and profit were all considered. Where it is ethics, creativity or change, check whether the project engaged the concept or only one operational proxy for it.',
    },
    {
      id: 'bm-word-count-as-penalty',
      severity: 'critical',
      subjects: BM,
      claim: 'Exceeding 1,800 words means a flat deduction, or a proportional penalty across all criteria.',
      reality: 'There is no penalty. Assessment is based on the first 1,800 words and moderators do not read past that point. The published overrun case ran 200 words long, lost most of its conclusion to the cut, and dropped to 1 of 3 on criterion E — while C, F and G were unaffected.',
      detector: 'The report describes a word-count penalty or deduction, or lowers several criteria at once for length. The correct behaviour is to mark what sits inside the first 1,800 words and name which criteria lost their evidence.',
    },
    {
      id: 'bm-excluded-words-counted',
      severity: 'high',
      subjects: BM,
      claim: 'Tables, figures, calculations, citations, footnote references and the bibliography count towards the 1,800 words.',
      reality: 'All of those are excluded. Definitions of business management terms and quotations are the two things students often assume are excluded that are in fact counted, and both must sit in the body.',
      detector: 'The report declares an overrun without stating the counting basis or confirming the exclusion list was applied.',
    },
    {
      id: 'bm-commercial-correctness',
      severity: 'high',
      subjects: BM,
      claim: 'A commercially sound recommendation earns marks and a questionable one loses them.',
      reality: 'Criterion E asks whether the conclusion follows from the evidence presented and answers the question, not whether it is right. In the published set the highest mark on criterion D went to a project that concluded against a well-regarded company\'s own account of its ethics — a bold claim, credited because it was clearly made and grounded in the documents.',
      detector: 'Feedback contains an external business judgement — that a strategy would not work, that a market assessment is mistaken, that a different course of action would be better. Replace it with a question about whether the documents support the claim.',
    },
    {
      id: 'bm-financials-as-evidence',
      severity: 'medium',
      subjects: BM,
      claim: 'Ratio analysis, investment appraisal or margin calculations are the project\'s principal evidence and lift criterion D.',
      reality: 'Calculations are excluded from the word count and count as tools under criterion C. They earn D marks only where they are connected back to the conceptual argument. In one published project a comparative ratio analysis was judged a distractor and D settled at 3.',
      detector: 'A criterion D justification whose supporting quotation is a figure or a calculation with no interpretation tied to the key concept.',
    },
    {
      id: 'bm-sl-hl-inversion',
      severity: 'high',
      subjects: BM,
      claim: 'More is expected of HL students, and an SL project should be marked down for not using HL-only tools and topics.',
      reality: 'The task, the criteria, the mark total and the word limit are identical at SL and HL; only the weighting differs, and it runs the other way from intuition — 30% SL, 20% HL. The published commentary is direct: HL candidates have studied topics SL candidates have not, so an SL project cannot be expected to apply them.',
      detector: 'Feedback recommends force field analysis, Gantt charts, Hofstede, Porter\'s generic strategies, contribution or make-or-buy analysis, critical path analysis, lean production or crisis management to a student identified as SL.',
    },
    {
      id: 'bm-style-deductions',
      severity: 'medium',
      subjects: BM,
      claim: 'First-person narration, a personal connection to the organization, informal register or typos are weaknesses.',
      reality: 'No criterion in this rubric assesses register, voice, personal distance or writing quality. The only style-adjacent criteria are F, which asks whether the main body has a discernible ordering principle, and G, which is a four-item physical checklist.',
      detector: 'A deduction whose stated reason is tone, voice, personal involvement, grammar or spelling.',
    },
    {
      id: 'bm-structure-assumed',
      severity: 'medium',
      subjects: BM,
      claim: 'Criterion F is automatic for any project that reads well, and is much the same thing as criterion G.',
      reality: 'The one structure mark lost in the published set came from the highest-scoring project, whose main body ran seven pages under a single heading with no discernible ordering principle. F is about the main body\'s organizing scheme; G is the physical checklist.',
      detector: 'The criterion F justification cannot name the ordering principle of the main body. If it cannot, the mark is 1.',
    },
    {
      id: 'bm-attachment-formatting',
      severity: 'medium',
      subjects: BM,
      claim: 'Messy attachment of the supporting documents costs marks under B or G.',
      reality: 'An examiner in the published set noted formatting problems in the attached documents and stated explicitly that this is not a criterion and cannot be penalised.',
      detector: 'A deduction whose reason concerns the appearance, pagination or ordering of the attachments rather than their number, relevance, depth or range.',
    },
    {
      id: 'bm-concept-zero-overreach',
      severity: 'high',
      subjects: BM,
      claim: 'A missing or invalid key concept zeroes the whole project.',
      reality: 'The zero condition is written into criterion A alone and removes 5 marks. The remaining 20 stay available.',
      detector: 'The report reduces the total to 0, or lowers B through G, on the basis of a concept problem.',
    },
  ],
}

/* ------------------------------------------------------------------ */
/* Topic rules                                                         */
/* ------------------------------------------------------------------ */

export const businessManagementRules: TopicRuleSet = {
  rubricId: 'ib-ia-business-management',
  label: 'IB Business Management IA (Business Research Project)',

  contexts: [
    { id: 'bm-unit1', label: 'Introduction to business management', hint: 'Entity type, objectives, stakeholders, growth and evolution, the external environment, organizational planning. Tools that fit: SWOT, STEEPLE, Ansoff matrix, business plan, decision trees, circular business models.' },
    { id: 'bm-unit2', label: 'Human resource management', hint: 'Structure, leadership, motivation, organizational culture, employee and employer relations. Tools that fit: SWOT, STEEPLE, descriptive statistics. HL adds force field analysis and Hofstede.' },
    { id: 'bm-unit3', label: 'Finance and accounts', hint: 'Sources of finance, costs and revenues, break-even, final accounts, ratio analysis, cash flow, investment appraisal, budgets. HL adds contribution and make-or-buy analysis.' },
    { id: 'bm-unit4', label: 'Marketing', hint: 'Marketing planning, research, the mix, international marketing, e-commerce. Tools that fit: SWOT, Ansoff matrix, STEEPLE, BCG matrix. HL adds Gantt charts, critical path analysis, Hofstede and Porter\'s generic strategies.' },
    { id: 'bm-unit5', label: 'Operations management', hint: 'Operations methods, location, break-even in production, supply chain, sustainability in operations. HL adds lean production, Gantt charts, critical path analysis, production planning and crisis management.' },
    { id: 'bm-crossfunctional', label: 'Cross-functional issue at one organization', hint: 'A single decision or event traced across two or three functions. Workable, but the research question must not promise coverage of all four functions unless the project will deliver all four.' },
  ],

  rules: [
    {
      id: 'bm-not-real',
      label: 'The organization is fictional, composite or anonymised past recognition',
      detail:
        'The task requires a real business issue or problem at a real organization. A hypothetical firm, an invented case or a blend of several companies cannot be researched from attached documents and puts the whole task outside its terms.',
      severity: 'fatal',
      hits: ['A', 'B', 'D'],
    },
    {
      id: 'bm-multi-org',
      label: 'The question makes two or more organizations the joint subject',
      detail:
        'The project must refer directly to a single organization. Industry-wide material is admissible where it bears on that organization, and rivals may appear as context — but the moment a comparison becomes the object of study it takes over the analysis. In the published set a three-way company comparison was judged a distractor and cost marks on analysis and evaluation.',
      severity: 'fatal',
      hits: ['A', 'D'],
    },
    {
      id: 'bm-no-concept',
      label: 'No key concept, the wrong concept, or two concepts used together',
      detail:
        'Exactly one of change, creativity, ethics or sustainability must be used as the lens and named on the title page. Anything else — innovation, globalization, culture, strategy, leadership — is outside the permitted four and takes criterion A to zero. Two concepts in parallel fails the requirement to use only one.',
      severity: 'fatal',
      hits: ['A'],
    },
    {
      id: 'bm-concept-decorative',
      label: 'The concept was chosen after the question and does not change the analysis',
      detail:
        'A lens bolted on at the end produces a project where the concept appears in the title and the conclusion and nowhere in between. That is the shape of a 2 or 3 on criterion A, the single largest source of lost marks in the published set. Test before starting: name the analytical section this concept will change. If there is none, change the concept or change the question.',
      severity: 'major',
      hits: ['A'],
    },
    {
      id: 'bm-unanswerable-forecast',
      label: 'The question asks whether a future plan will succeed',
      detail:
        'Forward-looking questions are permitted and often good, but a question phrased so that no available evidence could settle it makes an explicit answer impossible. A published project asked whether a five-year corporate plan would raise financial success, and the conclusions mark was held at 2 precisely because the wording made a confident answer unavailable. Ask what the organization should do, or what its plan implies, rather than whether the future will vindicate it.',
      severity: 'major',
      hits: ['E'],
    },
    {
      id: 'bm-scope-overpromise',
      label: 'The question promises more coverage than the project can deliver',
      detail:
        'A question naming all four business functions, or a whole industry, or several years of strategy, commits the project to material it cannot fit in 1,800 words. A published project asked about all business functions, delivered mostly finance, and lost a conclusions mark for it. Every noun in the question has to reappear in the answer.',
      severity: 'major',
      hits: ['E', 'D'],
    },
    {
      id: 'bm-answer-known',
      label: 'The question can be answered before the research begins',
      detail:
        'The best questions are ones whose answer the student does not already know, or that cannot be settled with minimal research. Simplistic questions produce projects padded with material of marginal relevance, which then costs marks on analysis and on the documents.',
      severity: 'major',
      hits: ['D', 'B'],
    },
    {
      id: 'bm-thin-document-base',
      label: 'The question is so narrow that three to five substantial documents cannot be found',
      detail:
        'Narrowing improves depth and hurts sourcing, and this is the central trade-off in choosing a question. A question about a single product launch at a small private firm typically yields one press release and nothing else. Test the question by finding four candidate documents before committing to it.',
      severity: 'major',
      hits: ['B', 'D'],
    },
    {
      id: 'bm-stale-sources',
      label: 'The evidence base is older than three years',
      detail:
        'Supporting documents must be published within three years of submission, and submission falls in April or October of the final year. Age is the first elimination step. A question about an event from five years ago can only be documented with material that is itself ineligible.',
      severity: 'major',
      hits: ['B'],
    },
    {
      id: 'bm-single-voice-evidence',
      label: 'Every available document comes from the organization itself',
      detail:
        'Three to five documents published by one company, or several near-identical surveys, do not supply balance. This caps criterion B at 3. Choose a question that outside parties — press, regulators, NGOs, analysts, customers — have reason to have written about.',
      severity: 'major',
      hits: ['B'],
    },
    {
      id: 'bm-textbook-sourcing',
      label: 'The intended supporting documents are textbooks, class notes or general reference pages',
      detail:
        'Textbooks and class notes may be cited but cannot serve as supporting documents. Neither can encyclopaedia entries or teacher-supplied material — students must select their own documents.',
      severity: 'major',
      hits: ['B'],
    },
    {
      id: 'bm-ee-overlap',
      label: 'The organization or the work overlaps with the student\'s extended essay',
      detail:
        'The same piece of work cannot be submitted for both components. Where a student is writing a Business Management EE, the two must use different organizations and different research approaches.',
      severity: 'major',
      hits: ['A'],
    },
    {
      id: 'bm-more-than-five-sd',
      label: 'The plan involves attaching more than five documents',
      detail:
        'A sixth document caps criterion B at 1 mark. Extra sources may be cited in the body and listed in the bibliography, but they must not be attached.',
      severity: 'major',
      hits: ['B'],
    },
    {
      id: 'bm-syllabus-orphan',
      label: 'The issue does not connect to any part of the syllabus',
      detail:
        'The issue must relate to some part of the five units. Questions about macroeconomic policy, pure computer science or personal finance have no tools or theories in the course to answer them, which strands criterion C.',
      severity: 'major',
      hits: ['C'],
    },
    {
      id: 'bm-multi-transcript',
      label: 'More than one supporting document is a video or audio transcript',
      detail:
        'At most one document may be a transcript, and only from a reliable publisher — the organization itself, a body it commissioned, or an NGO. The original file must be referenced traceably.',
      severity: 'minor',
      hits: ['B'],
    },
    {
      id: 'bm-oversized-documents',
      label: 'A single supporting document runs to many pages',
      detail:
        'The recommendation is that no one document exceed the equivalent of five A4 pages. An entire annual report attached whole works against the student — extract the relevant pages and highlight them.',
      severity: 'minor',
      hits: ['B'],
    },
    {
      id: 'bm-untranslated',
      label: 'Highlighted material is not in the student\'s registration language',
      detail:
        'Any highlighted passage in another language must be translated. A question that depends on local-language sources needs translation time built into the plan.',
      severity: 'minor',
      hits: ['B'],
    },
  ],

  levelNotes: {
    SL: 'Identical task and identical criteria to HL, worth 30% of the final grade. HL-only tools — force field analysis, Gantt charts, Hofstede, Porter\'s generic strategies, contribution and make-or-buy analysis, critical path analysis — and HL-only topics such as lean production, crisis management and research and development have not been studied and are never expected. Choose a question the core toolkit can answer: SWOT, STEEPLE, Ansoff matrix, BCG matrix, business plan, decision trees, descriptive statistics, circular business models.',
    HL: 'Identical task and identical criteria to SL, worth 20% of the final grade. The extra toolkit is available but confers no advantage on its own — criterion C rewards fit to the question, not sophistication. A make-or-buy analysis chosen because the question is a sourcing decision scores; a Gantt chart added for weight does not.',
  },

  titleGuidance: [
    'The title is the research question. Write it as a question, not as a topic.',
    'Name the one organization in the question, and name the specific decision, event or problem rather than the company in general.',
    'The question may look forward or backward. Backward-looking questions suit projects built mostly on secondary sources; forward-looking questions suit projects built mostly on primary research.',
    'Every element named in the question has to be answerable from the attached documents. Check each noun against the evidence you actually have.',
    'Keep the question to what 1,800 words can settle. Two functions is usually the ceiling; four is where a published project lost a conclusions mark.',
    'The key concept may appear in the question or not, but it must be named on the title page either way. The word count belongs on the cover page.',
    'Prefer "Should X do Y?", "To what extent has X\'s Y affected Z?" or "How far can X achieve Y through Z?" over "Will X succeed?" — the last cannot be closed with evidence.',
    'Get the question approved before starting. Teacher approval exists to confirm the question reaches all levels of the criteria.',
  ],

  dataGuidance: [
    'Attach three to five documents. Four or five is the practical minimum for the top band on criterion B, because range is hard to show with three.',
    'Most of the project information must come from these documents. Anything else is a bibliography entry, not an attachment.',
    'Nothing older than three years from submission. Eliminate on age first, then on usefulness, then on range.',
    'Build the set for disagreement: different functions, internal against external, quantitative against qualitative. Documents that all say the same thing cap the criterion at 3.',
    'At most one transcript of audio or video, from a reliable publisher, referenced so the original can be traced.',
    'Keep each document to about five A4 pages or fewer. Extract and attach the relevant part, and highlight the passages the project actually uses.',
    'Translate any highlighted passage not in the registration language.',
    'Label them "Supporting document 1", "Supporting document 2" and so on, and place them at the end.',
    'Choose them yourself. Documents supplied by a teacher do not qualify, and neither do textbooks or class notes.',
    'Primary research is welcome — surveys, interviews, focus groups. Attach the blank instrument together with a summary of responses or findings.',
  ],

  scopeNote:
    'One real organization, one real issue, one key concept, 1,800 words, three to five attached documents no older than three years. Industry context is admissible where it bears on that organization; a second company may appear as background but not as a joint subject. The single largest source of lost marks in the published samples is a concept that does not run through the analysis, and the second is a research question the project cannot answer in the words available — both are settled at the question-writing stage, before any research begins.',
}

/* ------------------------------------------------------------------ */
/* Exemplars                                                           */
/* ------------------------------------------------------------------ */

export const businessManagementExemplars: SubjectExemplars = {
  subject: 'Business Management',
  rubricId: 'ib-ia-business-management',
  exemplars: [
    {
      title: 'Should [national grocery retailer] bring its final-mile delivery fleet back in house?',
      context: 'bm-unit5',
      why: 'A single organization, a single decision, and a decision the company has visibly been arguing about in public — which is what makes documents findable. The lens is change: the question is not only whether in-housing is cheaper but what else at the company would have to move if it happened, which gives every analytical section something conceptual to close on. That is the difference between band 3 and band 5 on criterion A. It is also genuinely open: the cost case and the control case usually point in opposite directions, so the student cannot know the answer before starting.',
      data: 'A cost comparison between the third-party contract and an owned fleet, drawn from the company\'s published figures; the company\'s own account of why it chose its current arrangement (an annual report extract or an executive interview transcript, the one transcript allowed); a trade-press or analyst piece on how the sector is moving; a driver-side or union account of working conditions under the contractor. That set gives internal against external and quantitative against qualitative, which is what the top band on criterion B asks for. Tools: a SWOT built from the four documents rather than from general knowledge, plus a cost comparison. HL students can use make-or-buy contribution analysis and force field analysis here; SL students should not, and lose nothing by not.',
      watchOut: 'The cost table will be the most satisfying part to write and the least valuable to the mark. Calculations are excluded from the word count and count as tools under criterion C — they earn analysis marks only where the project says what the numbers mean for change at this company. The second trap is scope: final-mile delivery is one operational decision, and the question should not drift into the company\'s whole logistics strategy. The third is the conclusion — the question says "should", so the conclusion has to say should or should not, in those words, before word 1,800.',
    },
    {
      title: 'To what extent has [garment manufacturer]\'s supplier audit programme changed how it manages relations with its own workforce?',
      context: 'bm-unit2',
      why: 'Backward-looking, which suits a project built on secondary sources, and narrow enough to close. The ethics lens is doing real work rather than sitting on the title page: the question is whether an ethics programme aimed outward has changed anything inward, and that gap is itself the analysis. It also sets up the move that earned the top analysis mark in the published samples — taking the organization\'s own claim about its ethics and testing it against the documents rather than accepting it.',
      data: 'The company\'s published code of conduct or sustainability report; an audit summary or certification report from an external body; a press or NGO investigation covering the same period; an employee-side source such as a survey summary, an interview with a former employee, or a labour-organization statement. Four documents, four vantage points. Tools: motivation theory applied to what the programme actually changed for workers, plus stakeholder mapping by power and interest. Descriptive statistics if the audit data supports them.',
      watchOut: 'The failure mode here is writing an essay about whether the company is ethical. Criterion E asks whether the conclusion follows from the evidence, not whether the moral verdict is correct, and no criterion rewards a recommendation for being commercially or morally right. Keep the question factual: what changed, according to which document. Second, the word "workforce" in the question has to be answered in the conclusion; a project that ends on the audit programme without returning to workforce relations loses a conclusions mark for exactly the reason a published sample did. Third, if the audit programme is older than three years the documents will be ineligible — check the dates before committing.',
    },
    {
      title: 'How far has customer co-creation widened the market for [mid-sized cosmetics brand] beyond its original segment?',
      context: 'bm-unit4',
      why: 'Creativity is the hardest of the four concepts to use without slipping into a general appreciation of how innovative a company is, and this question forces it into a testable form: co-creation is a specific process, market widening is a measurable outcome, and the concept lives in the relationship between them. The Ansoff matrix maps directly onto the question rather than being imported, which is what criterion C rewards — the reason the tool belongs is visible in the question itself.',
      data: 'The company\'s own account of how the co-creation process works (a website extract or a founder interview); segment or revenue-mix data from a financial statement or an analyst note; a market-research or trade publication on the category\'s customer base; a consumer-side source such as a review-platform analysis, or a student-run survey with the blank questionnaire and a response summary attached. Tools: Ansoff matrix, revenue streams, promotional mix, plus descriptive statistics on the survey if one is run.',
      watchOut: 'Creativity invites decoration. The concept has to change what the analysis looks at in every section, not appear as a paragraph on how creative the brand is — the published sample that lost the most on criterion A did exactly that, and used sophisticated vocabulary for its concept while doing it. Second, "widened the market" needs a definition the documents can support, and it needs it in the introduction, not the conclusion. Third, this question is attractive to students with a personal connection to the brand; that connection is not a weakness and no criterion penalises it, but it does raise the risk of building the whole document set out of company-published material, which caps criterion B at 3.',
    },
  ],
}