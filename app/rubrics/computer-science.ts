// app/rubrics/computer-science.ts
//
// IB Computer Science — the computational solution (IA). Five criteria, 30 marks.
// This is NOT the sciences rubric: CS was previously resolved to ib-ia-sciences
// on an assumption the subject guide disproves outright.
//
// SL and HL share one identical task, one set of criteria and one standard;
// only the weighting differs (30% SL, 20% HL). One rubric serves both.
//
// Source: Computer science guide, TSM and FAQ (first assessment 2027) and eight
// assessed student projects with examiner commentary. Guide takes precedence;
// TSM and FAQ were used only where the guide is silent.

import type { ExtendedRubric } from './rubrics-extra'
import type { MarkingModel } from './checker-guards'
import type { TopicRuleSet } from './topic-rules'
import type { SubjectExemplars } from './topic-exemplars'

const CS = ['Computer Science']

/* ------------------------------------------------------------------ */
/* Rubric                                                              */
/* ------------------------------------------------------------------ */

export const computerScienceRubric: ExtendedRubric = {
  id: 'ib-ia-computer-science',
  framework: 'IB',
  documentType: 'Internal Assessment',
  label: 'IB — Internal Assessment (Computer Science, the computational solution)',
  totalMax: 30,
  shape: 'single',

  // SL 30%, HL 20%. The schema holds one number, so the SL figure sits here and
  // both appear in `guidance`. Task, criteria and standard are identical, so a
  // single rubric serves both levels.
  weight: 30,

  // DOGRULANMADI: the guide publishes no mark-to-grade boundaries for this
  // component. The scale below is an even distribution across 30 marks and is an
  // in-product estimate only.
  gradeScale: [
    { grade: '7', min: 25 },
    { grade: '6', min: 21 },
    { grade: '5', min: 17 },
    { grade: '4', min: 13 },
    { grade: '3', min: 9 },
    { grade: '2', min: 5 },
    { grade: '1', min: 0 },
  ],

  wordCount: {
    limit: 2000,
    unit: 'words',
    // DOGRULANMADI: the guide states the limit but not the consequence of
    // exceeding it.
    hard: false,
    excluded: [
      'excerpts of source code',
      'comments on code, whether embedded or attached as annotations',
      'diagrams, including words used only to label or identify a diagram or its elements',
      'ordinary entries in design and testing tables',
      'the appendices in their entirety, which carry no marks',
    ],
    included: [
      'continuous prose in all five documentation sections',
      'extended descriptions or explanations written inside table cells',
      'prose in the documentation that explains or justifies a code excerpt, as distinct from a comment inside the code itself',
    ],
  },

  guidance:
    'One task: a computational solution to a problem the student chooses, worth 30 marks, carrying 30% of the SL grade and 20% of the HL grade, with 35 hours allocated. Criteria and standard are identical at both levels and moderation does not distinguish them. Submission is three files: a documentation PDF of at most 2,000 words with the count declared on the first page and one section per criterion; a video of at most five minutes demonstrating the full functionality of the product and examples of the testing strategy; and an appendices PDF containing the full source code. Two terms are used precisely — the solution means the documentation and video together, the product means the completed software only. Recommended word counts by criterion are 300 for A, 150 for B, 150 for C, 1,000 for D and 400 for E, so C is a section carried by diagrams and tables rather than prose, and E is a substantial section rather than a closing paragraph. Criteria A, B, C and E are process-oriented and apply across product types; criterion D assesses the finished product. Marking is best-fit with compensation: where work matches different aspects of a criterion at different levels, the mark should reflect the balance, and not every aspect of a descriptor needs to be met. Success criteria set in A are reused in B, D and E, so weakness there spreads to three further criteria. Ethical requirements are binding: consent from anyone involved before investigation begins, written consent from the owner of any existing system used, secure storage of collected data, and use of that data only for this solution. The same work cannot be submitted for both the IA and the extended essay.',

  criteria: [
    {
      id: 'A',
      name: 'Problem specification',
      max: 4,
      verbLadder: 'ao',
      description:
        'The starting point of the whole task and the basis on which the product is built; the recommended length is 300 words. Three things carry the mark. The problem scenario is a clear account of the problem stated in terms of solution requirements that can be measured, and it may be drawn from the world around us, from another field of knowledge, or from a current issue in computing. The success criteria are measurable outcomes derived from those requirements that will show the product has been successfully developed; they are reused in the planning, the development and the evaluation, so weakness here spreads to three further criteria. The computational context is the specific area of computing chosen for the solution. Before the topic is settled the student must actually have the technical skills, the hardware and software access, and the relevant data needed. The band gap sits in the command terms: the lower band asks only for brief accounts, while the upper band asks for a detailed account of the scenario in measurable terms and a detailed account of the computational context that includes the reasons for the choice.',
      bands: [
        { range: '0', descriptor: 'Nothing here reaches the standard set out below' },
        { range: '1-2', descriptor: 'The scenario is given as a brief account or summary; the success criteria are named but limited; the nature of the solution in its computational context is summarised rather than reasoned' },
        { range: '3-4', descriptor: 'The scenario is given in detail and expressed in terms of solution requirements that can be measured; the success criteria named are appropriate to those requirements; the choice of computational context is set out in detail with the reasons behind it' },
      ],
      calibration: [
        'A fluent scenario yielding only one measurable requirement, appropriate but loosely worded criteria, and a context paragraph mixing explanation with generic claims, was marked 3.',
        'The single 4 in eight exemplars: a scenario described with several measurable requirements, criteria sufficient and testable though not always specific, and a context with real explanation mixed with generic statement. The examiner accepted imperfection in all three parts.',
        'Where the scenario and the criteria reached the upper descriptor but the context was generic, the mark was pulled to 3. This is the most common shape in the exemplars, and it is a command-term failure: the work outlines where the band requires explanation.',
        'A scenario given as a sentence of personal motivation with no measurable outcomes, plus an almost absent computational context, was marked 2 even though the success criteria themselves were specific and testable.',
        'A trivial problem — one with good free solutions already available — did not by itself block the upper band, but held the mark at 3.',
        'The TSM suggests around eight to ten success criteria. The guide sets no number and asks only that they be appropriate, so a shorter well-formed set is not a defect in itself; the exemplars penalised limited criteria, not few criteria.',
      ],
    },
    {
      id: 'B',
      name: 'Planning',
      max: 4,
      verbLadder: 'quality',
      description:
        'Must follow from the problem specification; the recommended length is 150 words, so this is a section carried by diagrams rather than prose. Two things carry the mark. Decomposition is the breaking of the scenario into smaller, manageable sub-problems or components, and a reasonable decomposition isolates the essential components a plan can be built on. The plan must address the requirements of the solution in terms of the success criteria and must propose a chronology across all five stages of planning, designing, developing, testing and evaluating; Gantt and agile chart formats support this well but any form is acceptable, and relevant research such as the use of existing code libraries can be planned for here. The verb does not change between the bands — both ask the student to construct — so what separates them is coverage and adequacy, not sophistication of language. The plan is written before development, not reconstructed afterwards, and it is not a process journal.',
      bands: [
        { range: '0', descriptor: 'Nothing here reaches the standard set out below' },
        { range: '1-2', descriptor: 'The decomposition covers only part of the scenario; the plan speaks to some of the success criteria but not to the set as a whole' },
        { range: '3-4', descriptor: 'The decomposition is reasonable, isolating the essential components a plan can be built on; the plan addresses the success criteria of the solution, with a chronology across the five stages' },
      ],
      calibration: [
        'Both 4s came from the same combination: a solid decomposition plus a plan with explicit chronology across all five stages, tied to the success criteria.',
        'A decomposition praised as very reasonable, attached to a generic plan that covered the five stages but never referenced the success criteria, was marked 3. Coverage of the criteria is the pivot here.',
        'A clear decomposition tied to the scenario, attached to a plan missing the designing stage and unlinked to the criteria, was marked 2 — the plan dominates this criterion.',
        'Where planning existed only as fragments inside the decomposition, with very limited chronology and stages missing, the mark was 2.',
        'Do not look for a stronger verb between the bands. Both descriptors ask the student to construct; what moves is whether the decomposition is partial or reasonable and whether the plan covers some of the success criteria or the set.',
        'Weak success criteria in criterion A cap this criterion indirectly — a plan cannot demonstrably address requirements that were never stated measurably.',
      ],
    },
    {
      id: 'C',
      name: 'System overview',
      max: 6,
      verbLadder: 'quality',
      description:
        'Must follow from the problem specification and the planning; the recommended length is 150 words, which means this section is carried by diagrams and tables. Three things carry the mark. The system model is a set of diagrams showing the components of the system, how they connect, the rules governing their interaction, and the design of the user interface; a complete system model does NOT contain the algorithms for each component, because those are presented separately. The overview as a whole must be clear enough for a third party to recreate the product. Algorithms address the individual components of the model and may be given as natural language, flow charts or pseudocode. The testing strategy is a systematic approach to establishing that the solution works as intended — that code functions correctly and copes with unexpected or incorrect input — and is well expressed as a table of proposed test data with expected outcomes. This criterion carries a countable threshold no other criterion has: the testing strategy is banded by how many success criteria it aligns with — at least one, at least three, or the whole set.',
      bands: [
        { range: '0', descriptor: 'Nothing here reaches the standard set out below' },
        { range: '1-2', descriptor: 'A limited system model, given only in summary; algorithms for the components are named from among the possibilities rather than worked out; a testing strategy is named for at least one success criterion' },
        { range: '3-4', descriptor: 'A system model is set out but is not complete; algorithms are worked out for the components and are enough to make the product partially functional; the testing strategy is summarised and aligns with at least three success criteria' },
        { range: '5-6', descriptor: 'A complete system model; algorithms worked out for the components that enable the product to perform; a testing strategy given in detail and aligned with the success criteria as a set, addressing unexpected or incorrect input with expected outcomes' },
      ],
      calibration: [
        'No exemplar reached 6. Both 5s had strong algorithms and a strategy aligned to the criteria, and lost the last mark on an incomplete model — missing file interactions in one case, no design for the output format in the other.',
        'A model missing the user interface design, a few algorithms yielding partial functionality, and a strategy covering the criteria but not unexpected data, sat at 4. This is the modal outcome.',
        'A model reduced to a single diagram, algorithms with a core operation missing, and a strategy limited by weak success criteria, was marked 3.',
        'A very limited model combined with algorithms adequate to make the product function still produced only 3 — one strong part does not lift the band.',
        'What moves work from 4 to the top band is never more diagrams. It is closing the gap in the model and extending the strategy to the whole success-criteria set with unexpected and incorrect input.',
        'Count before judging: a strategy touching two success criteria cannot reach the middle band on that part however well written it is.',
        'The model is not required to contain the algorithms. Do not mark a model down for omitting algorithm detail, and do not accept a set of algorithms in place of a model.',
      ],
    },
    {
      id: 'D',
      name: 'Development',
      max: 12,
      verbLadder: 'artifact',
      description:
        'The only product-oriented criterion, worth 40% of the marks and carrying a recommended 1,000 words — half the documentation. It must follow from criteria A, B and C. Four things carry the mark. Functionality is judged on the product, with the video supplying the evidence: the video must demonstrate the full functionality and give examples of testing. Techniques are the process of programming the algorithms into code and may include loops, data structures, existing libraries and the integration of software tools; the development must justify the structure of the product and demonstrate the techniques used, built on the algorithms constructed in criterion C. Code presented in the documentation must carry relevant comments, be consistent and readable, highlight the key elements that matter for the algorithms to run efficiently, and be referenced back to the full source code in the appendix. The testing strategy must cover correctness, reliability and efficiency, and must be described and justified in the documentation with supporting examples visible in the video. The first two parts do not climb a verb ladder — the descriptor asks the student to construct at every level, and what changes is the state of the product and the number of appropriate techniques. The last two do climb: from stating a choice, to outlining it, to explaining it, to weighing it up; and from stating the testing strategy, to asserting its effectiveness, to describing it, to giving valid reasons for it. This section is not a development journal.',
      bands: [
        { range: '0', descriptor: 'Nothing here reaches the standard set out below' },
        { range: '1-3', descriptor: 'The product has very limited functionality and uses no appropriate technique to implement the algorithms; the implementation choices are named without explanation; the testing strategy is named without any account of how well it worked' },
        { range: '4-6', descriptor: 'The product has limited functionality and uses at least one appropriate technique; the implementation choices are summarised; the effectiveness of the testing strategy is asserted without support' },
        { range: '7-9', descriptor: 'The product has partial functionality and uses some appropriate techniques; the implementation choices are set out in detail with the reasons behind them; the effectiveness of the testing strategy is given a detailed account' },
        { range: '10-12', descriptor: 'The product is fully functional and uses appropriate techniques throughout; the implementation choices are weighed for strengths and limitations; the effectiveness of the testing strategy is supported with valid reasons and evidence over testing that covers correctness, reliability and efficiency' },
      ],
      calibration: [
        'No exemplar exceeded 10. Both 10s showed full functionality with appropriate but inelegant techniques and clear elements of evaluation and justification; the missing marks were depth, not correctness.',
        'A 10 was awarded even where a configuration file had to be maintained outside the product and the video showed limited testing without extreme or abnormal data. Full functionality plus documented techniques carried the band.',
        'Partial functionality with appropriate techniques and choices explained rather than weighed produced 8 or 9. Where the effectiveness of testing was only asserted, the mark landed at 8 despite three strong parts.',
        'Partial functionality with choices merely outlined and testing effectiveness asserted without unexpected or incorrect data produced 7, twice.',
        'Limited functionality, three techniques evidenced, choices outlined, testing effectiveness essentially absent: 6. The parts sat in three different bands and best-fit compensation landed in the middle.',
        'A partially functional but underdeveloped product, generic treatment of testing effectiveness, and documentation that failed to highlight key code: 5.',
        'Effectiveness of testing held every exemplar below 11. Fixing it is worth more than adding functionality.',
        'Four of eight exemplars were marked down for code included in the documentation without comments. The guide requires comments, consistency and readability in the excerpts shown, so this is not a style preference.',
        'Full marks for techniques are unavailable where no appendix containing the full source code was submitted. This is a formal condition, independent of how good the product is.',
      ],
    },
    {
      id: 'E',
      name: 'Evaluation',
      max: 4,
      verbLadder: 'ao',
      description:
        'Must follow from the problem specification and the success criteria in criterion A; the recommended length is 400 words, second only to development, which signals a substantial section rather than a closing paragraph. Two things carry the mark, and the band gap in each is a single command term. On meeting the success criteria the move is from naming the outcome to appraising it by weighing strengths and limitations against evidence — a table of every criterion with a judgement and a pointer to the testing evidence in the documentation or video is the natural form. On improvements the move is from giving an account of them to giving valid reasons for them: what issue surfaced in testing, how the change addresses it, and whether it is feasible. Improvements are still expected when the product has no visible faults, in which case they should widen the range of accepted inputs, refine efficiency or effectiveness, or respond to requirements the testing did not capture. Adding colour, data or functionality without specific justification, adding a graphical interface to something built as a command-line tool, or supplying functionality a fully working solution should always have had, are treated as trivial or contrived.',
      bands: [
        { range: '0', descriptor: 'Nothing here reaches the standard set out below' },
        { range: '1-2', descriptor: 'The extent to which the success criteria were met is named without appraisal; improvements are given an account without reasons' },
        { range: '3-4', descriptor: 'The extent to which the success criteria were met is appraised, weighing what worked against what did not; improvements are supported with valid reasons' },
      ],
      calibration: [
        'The only 4: success criteria appropriately evaluated plus three realistic improvements each carrying elements of justification. The examiner noted the work was not perfect and awarded 4 anyway, because both parts sat in the upper descriptor.',
        'Success criteria evaluated with clear elements of justification for improvements, but lacking depth, produced 3.',
        'Most but not all criteria properly evaluated, one of two improvements judged trivial: 3.',
        'Criteria stated as met, two realistic improvements of which one was cosmetic: 2.',
        'Criteria stated as met, both improvements trivial or contrived for the state of the product: 1.',
        'Weak success criteria in criterion A cap this criterion twice over — there is nothing substantial to appraise, and improvements built on weak criteria read as trivial.',
        'At 400 recommended words this is not a closing paragraph. Exemplars that treated it as one sat at 1 or 2.',
      ],
    },
  ],
}

/* ------------------------------------------------------------------ */
/* Marking model                                                       */
/* ------------------------------------------------------------------ */

export const computerScienceMarking: MarkingModel = {
  rubricId: 'ib-ia-computer-science',

  bestFit: [
    'Read the whole documentation before marking anything; evidence for one criterion often appears in another section.',
    'Read the level descriptors for a criterion until reaching the one that most accurately describes the work. If the work falls between two, read both again and take the closer.',
    'Compensate. Where the work matches different aspects of a criterion at different levels, award the mark that fairly reflects the balance of achievement. Not every aspect of a descriptor needs to be met.',
    'The criterion mark is not the arithmetic mean of its parts.',
    'Within a band, award the upper marks where the described qualities are shown to a great extent and the work is close to the band above.',
    'Whole numbers only. Do not think in terms of a pass or fail boundary.',
    'The top band does not imply faultless work; it should be attainable, and the extremes should be used where they fit.',
    'A high mark on one criterion does not imply high marks on the others. Do not assume any particular distribution.',
    'Mark positively: credit what is present rather than deducting for what a stronger project might have contained.',
    'SL and HL are assessed against the same criteria at the same standard. Only the weighting differs, and that affects the grade calculation, not the marking.',
    'This tool reads only the documentation PDF. The video and the appendices are not available to it, so functionality and the appendix condition are inferred rather than observed — say so in the report rather than presenting the mark as settled.',
  ],

  zeroRules: [
    'A criterion scores 0 when the response does not reach the standard of the lowest descriptor.',
    'Content placed in the appendices earns no marks under any criterion, and examiners are not required to read it.',
    'The same piece of work cannot be submitted for both the internal assessment and the extended essay.',
    'Ethical requirements are binding and are handled at the topic stage, not by deduction: consent from anyone involved in developing the solution before investigation begins, written consent from the owner of any existing system used, secure storage of all data collected, and use of that data only for this solution. A product failing these is an inappropriate product. Raise it as something to resolve with the teacher rather than producing a mark of 0.',
    'Work that is not the student\'s own, or that incorporates external material without citation, is an academic integrity matter handled outside the markbands.',
    'Code refined with an AI tool is not a zero rule: it is permitted provided the use is acknowledged both in a code comment and in a note in the documentation.',
  ],

  strandCeilings: [
    {
      when: 'No appendix containing the full source code was submitted',
      criterionId: 'D',
      max: 9,
      why: 'Full marks for the techniques demonstrated are unavailable without the full source code in an appendix. This is a formal condition, independent of how good the product is. This tool cannot see the appendix, so apply this only where the documentation itself indicates no appendix exists.',
      scope: 'instance',
    },
    {
      when: 'The product does not address the problem specification set out in criterion A',
      criterionId: 'D',
      max: 3,
      why: 'Functionality is very limited by definition when the product answers a different problem from the one specified. This binds functionality only; the other three parts of D can still sit higher.',
      scope: 'instance',
    },
    {
      when: 'The problem specification is inadequate or vague, even though the product works',
      criterionId: 'D',
      max: 9,
      why: 'Only partial functionality is available where there is no adequate specification for the product to fully satisfy.',
      scope: 'instance',
    },
    {
      when: 'The testing strategy aligns with fewer than three success criteria',
      criterionId: 'C',
      max: 2,
      why: 'The testing strategy is banded by coverage: at least one criterion for the lowest band, at least three for the middle band, the whole set for the top band.',
      scope: 'instance',
    },
    {
      when: 'The testing strategy does not align with the full set of success criteria',
      criterionId: 'C',
      max: 4,
      why: 'The top band requires alignment with the success criteria as a set, not a majority of them.',
      scope: 'instance',
    },
    {
      when: 'The work states the extent to which the success criteria were met without appraising it against evidence',
      criterionId: 'E',
      max: 2,
      why: 'The band gap here is exactly the move from naming an outcome to weighing it up.',
      scope: 'instance',
    },
    {
      when: 'Improvements are described without valid reasons, or are trivial, cosmetic, contrived, or restatements of success criteria that were never implemented',
      criterionId: 'E',
      max: 2,
      why: 'The upper band requires improvements to be supported with reasons tied to issues that testing exposed and to feasibility.',
      scope: 'instance',
    },
  ],

  distributionFacts: [
    'Across eight published exemplars, totals ran from 13 to 26 out of 30, mean near 20. This is a curated teaching set, not session statistics.',
    'Full marks appeared only on A (once), B (twice) and E (once). Criterion C never exceeded 5 of 6 and criterion D never exceeded 10 of 12.',
    'Seven of eight exemplars lost marks specifically on testing. Testing is scored twice — the strategy under C, its effectiveness under D — so it sits inside 18 of the 30 marks.',
    'Criterion A was most often capped by the computational context, described as generic while the other two parts reached the upper descriptor. The gap is a command-term gap: the band requires explanation, the work supplies a summary.',
    'Criterion B was determined by the plan rather than the decomposition. Decompositions were usually acceptable; plans usually failed on chronology, a missing stage, or no link to the success criteria.',
    'Four of eight exemplars were criticised for code included without comments, which the guide requires.',
    'Weak success criteria propagate into four criteria at once: B has nothing to plan against, C has nothing to test against, D is limited by definition, and E has nothing to appraise.',
    'Criterion D carries 40% of the marks and half the recommended words; criterion E carries 400 recommended words, so treating it as a closing paragraph costs marks that are cheap to recover.',
  ],

  sixVersusFour: [
    {
      criterionId: 'A',
      subjects: CS,
      six: '4/4 — the scenario given in detail and expressed as measurable solution requirements; success criteria that are appropriate, measurable and jointly describe a working solution; and a computational context explained with the reasons the scenario demands it.',
      four: '3/4 — a scenario that reads well but yields one measurable requirement or none; criteria that are appropriate but loosely worded; a context section that names the area of computing and lists its general advantages.',
      movingLine: 'Rewrite the computational context so every claim answers a requirement named in the scenario. The band asks for explanation and the common failure is a summary; this alone held five of eight exemplars at 3 or below.',
    },
    {
      criterionId: 'B',
      subjects: CS,
      six: '4/4 — a decomposition that isolates the essential components a plan can be built on, plus a plan that addresses the success criteria as a set and sequences all five stages of planning, designing, developing, testing and evaluating.',
      four: '3/4 — a solid decomposition attached to a plan that lists the stages but never names a success criterion, or sequences work without dependencies.',
      movingLine: 'Add a column to the plan naming which success criteria each task delivers, and make sure the evaluating stage appears with time allocated. The verb does not change between the bands, so nothing is gained by rewriting the prose.',
    },
    {
      criterionId: 'C',
      subjects: CS,
      six: '6/6 — a complete system model with components, connections, interaction rules and the interface design, clear enough for a third party to recreate the product; algorithms constructed for those components that enable the product to perform; and a testing strategy described in detail, aligned with the whole success-criteria set, addressing unexpected and incorrect input with expected outcomes.',
      four: '4/6 — a model constructed but incomplete, commonly no interface design or no file interaction; algorithms sufficient for partial functionality; a strategy aligned with at least three success criteria but only for normal data.',
      movingLine: 'Extend the test table to every success criterion and add expected outcomes for unexpected and incorrect input, then close the one gap in the model. Count the criteria your strategy covers before anything else — that number alone fixes the band on that part.',
    },
    {
      criterionId: 'D',
      subjects: CS,
      six: '12/12 — a fully functional product demonstrated in the video; appropriate techniques throughout, referenced to the full source code in the appendix; implementation choices weighed for strengths and limitations; and the effectiveness of the testing strategy supported with valid reasons over testing that covers correctness, reliability and efficiency.',
      four: '8/12 — partial functionality, some appropriate techniques with excerpts, implementation choices explained but not weighed, and effectiveness of testing given a general account.',
      movingLine: 'Carry the design test tables into this section, add observed results covering correctness, reliability and efficiency, and close with reasons for judging the testing effective. This held every exemplar below 11.',
    },
    {
      criterionId: 'E',
      subjects: CS,
      six: '4/4 — every success criterion appraised against named testing evidence, including the ones not fully met, and improvements supported with valid reasons covering the issue addressed, the benefit and the feasibility.',
      four: '2/4 — the criteria are listed as met, and the improvements are described without reasons or include a cosmetic suggestion.',
      movingLine: 'Replace "met" with a judgement plus a pointer to the test or video moment that shows it, and give each improvement a reason tied to something testing exposed. At 400 recommended words there is room to do both.',
    },
  ],

  pitfalls: [
    {
      id: 'cs-sciences-ladder',
      severity: 'critical',
      subjects: CS,
      claim: 'This is a science internal assessment, so the work should state a research question, identify independent, dependent and controlled variables, justify the number of trials, and propagate uncertainties.',
      reality: 'The five criteria follow the computational thinking process. There is no research question, no variable framework and no uncertainty treatment anywhere in the task. The nearest analogue to a hypothesis is the success criteria, which are measurable outcomes derived from solution requirements, not predictions.',
      detector: 'Output contains "variable", "control", "trial", "uncertainty", "hypothesis" or "research question" outside a quotation of the student\'s own text.',
    },
    {
      id: 'cs-solution-product-conflation',
      severity: 'critical',
      subjects: CS,
      claim: 'Solution and product are interchangeable words for the thing the student built.',
      reality: 'The guide defines them separately. The solution is the documentation and video submitted; the product is the completed software only. Descriptors about what the response outlines or explains are judging the documentation; descriptors about constructing a product are judging the software as evidenced in the video.',
      detector: 'Feedback judging the documentation under a functionality descriptor, or judging the software under a descriptor about what the response outlines or explains.',
    },
    {
      id: 'cs-code-quality-invention',
      severity: 'high',
      subjects: CS,
      claim: 'The codebase is messy or inefficient, so the mark should come down.',
      reality: 'The full source code sits in the appendices, which are never uploaded here and which examiners are not required to read. What can be judged is the code the student chose to put in the documentation: it must carry relevant comments, be consistent and readable, highlight the elements that matter for efficient running, and reference the appendix. Elegance is not required at the top band; four exemplars were nonetheless marked down for excerpts included without comments.',
      detector: 'Any comment characterising code that was not provided. Comments on the commenting, readability or referencing of excerpts visible in the documentation are legitimate.',
    },
    {
      id: 'cs-complexity-penalty',
      severity: 'high',
      subjects: CS,
      claim: 'The problem is too simple, so criterion D should be capped regardless of what was built.',
      reality: 'Sufficient complexity and innovation are conditions on the choice of problem, settled with the teacher at the proposal stage. The criteria assume the condition was observed and contain no complexity deduction. A basic but adequately specified task earned 10 of 12 in the exemplars.',
      detector: 'A criterion D mark reduced citing simplicity rather than functionality, techniques, choices or testing evidence.',
    },
    {
      id: 'cs-technical-difficulty-reward',
      severity: 'high',
      subjects: CS,
      claim: 'Advanced algorithms, machine learning or unusual libraries deserve higher marks.',
      reality: 'Existing libraries and the integration of software tools are listed as legitimate techniques alongside loops and data structures, so sophistication is not the axis. Techniques are expected to come from the course, the SL repertoire is the benchmark at both levels, and students are advised against learning large amounts of new material for the task. What is rewarded is fit between technique and the algorithms it implements.',
      detector: 'Feedback recommending a more sophisticated technique without tying it to an algorithm in the system overview or an unmet success criterion.',
    },
    {
      id: 'cs-functionality-binary',
      severity: 'high',
      subjects: CS,
      claim: 'A product that does not fully work scores zero on development; a product that runs scores full marks.',
      reality: 'Functionality is a four-step ladder anchored to criterion A, and it is one part of four. Partially working products scored 7 to 9 repeatedly, an underdeveloped one scored 5, and full functionality still capped at 10 where the choices were not weighed.',
      detector: 'A criterion D mark at the very bottom or the very top justified solely by whether the product runs.',
    },
    {
      id: 'cs-testing-coverage-threshold',
      severity: 'high',
      subjects: CS,
      claim: 'A testing strategy that looks systematic is enough for the top band of criterion C.',
      reality: 'That part is banded by countable coverage: at least one success criterion, at least three, or the whole set. The top band also requires a detailed account and handling of unexpected or incorrect input with expected outcomes. Under criterion D the testing must additionally cover correctness, reliability and efficiency.',
      detector: 'Criterion C awarded in its top band where the strategy demonstrably omits success criteria, or D above 9 where nothing addresses reliability or efficiency.',
    },
    {
      id: 'cs-model-algorithm-conflation',
      severity: 'medium',
      subjects: CS,
      claim: 'A complete system model must include the algorithms for each component, so a model without them is incomplete.',
      reality: 'The guide states the opposite: a complete system model does not include the algorithms for each component. The model shows components, connections, interaction rules and the interface design; algorithms are assessed separately.',
      detector: 'Feedback marking a model down for lacking algorithm detail, or accepting a set of flow charts as the system model.',
    },
    {
      id: 'cs-success-criteria-presence',
      severity: 'high',
      subjects: CS,
      claim: 'The work lists success criteria, so criterion A is satisfied and criterion E can be checked off.',
      reality: 'Criterion A asks whether the criteria are appropriate — derived from the stated requirements and measurable. Criterion E asks whether the extent of meeting them was appraised rather than named. A list of ticks fails E even where the criteria themselves are strong.',
      detector: 'Feedback counting success criteria without testing measurability, or crediting E for a met-or-unmet table with no evidence.',
    },
    {
      id: 'cs-criteria-count-threshold',
      severity: 'medium',
      subjects: CS,
      claim: 'Fewer than eight success criteria is a defect.',
      reality: 'The number comes from the teacher support material, not the guide, which asks only that the criteria be appropriate. The exemplars penalised criteria that were limited in scope or unmeasurable, not sets that were merely short.',
      detector: 'Feedback naming a numeric threshold for success criteria as a requirement rather than as guidance.',
    },
    {
      id: 'cs-b-verb-hunt',
      severity: 'medium',
      subjects: CS,
      claim: 'Criterion B moves up when the student uses stronger analytical language about the plan.',
      reality: 'Both bands use the same verb. What separates them is whether the decomposition is partial or reasonable and whether the plan addresses some of the success criteria or the set. Rewriting the prose changes nothing; adding coverage does.',
      detector: 'Feedback on B recommending explanation, justification or evaluation rather than covering more of the success criteria or completing the chronology.',
    },
    {
      id: 'cs-language-preference',
      severity: 'medium',
      subjects: CS,
      claim: 'The IA should be written in a particular language, and object-oriented design outranks procedural design.',
      reality: 'There is no language restriction provided the code listing is readable and the language does not trivialise the build by removing the need to code. The named solution forms span object-oriented programs, web applications with databases, games, mobile applications, simulations and stand-alone applications, and adding functionality to an existing system is equally valid.',
      detector: 'A recommendation to switch language or paradigm not derived from a requirement in the scenario.',
    },
    {
      id: 'cs-sl-hl-split',
      severity: 'high',
      subjects: CS,
      claim: 'HL work should be held to a higher standard than SL work.',
      reality: 'The assessment criteria are identical at both levels and moderation does not distinguish them. Only the weighting differs — 30% at SL, 20% at HL — which affects the grade calculation, not the marking.',
      detector: 'Any output referencing a level-specific expectation for this task.',
    },
    {
      id: 'cs-video-misread',
      severity: 'medium',
      subjects: CS,
      claim: 'The video is a separately marked component, or its production quality affects the mark.',
      reality: 'The video is not marked on its own and not marked on audiovisual quality. Its purpose is to evidence the full functionality of the product and give examples of the testing strategy. A missing or very short video damages the assessment because functionality then has no evidence.',
      detector: 'Feedback awarding or deducting marks for the video as such, or commenting on editing, narration or resolution.',
    },
    {
      id: 'cs-appendix-credit',
      severity: 'medium',
      subjects: CS,
      claim: 'Thorough appendices raise the mark, and a missing appendix is merely untidy.',
      reality: 'Both halves are wrong. Nothing in the appendices earns marks and examiners need not read them; but a submission without an appendix containing the full source code cannot receive full marks for techniques in criterion D. The appendix is a condition, not a source of credit.',
      detector: 'Feedback suggesting the student move material into the appendices for credit, or treating a missing source-code appendix as a presentational issue.',
    },
    {
      id: 'cs-ai-use-as-malpractice',
      severity: 'medium',
      subjects: CS,
      claim: 'Any acknowledged use of an AI tool in the code is malpractice and should be penalised.',
      reality: 'Improving code with a large language model is acceptable. The requirement is acknowledgement in two places: a comment in the code and a note in the documentation saying where and how it was used.',
      detector: 'Feedback treating a disclosed AI-assisted function as an integrity breach instead of checking that both acknowledgements are present.',
    },
    {
      id: 'cs-process-journal',
      severity: 'medium',
      subjects: CS,
      claim: 'A chronological account of what the student did each week strengthens planning and development.',
      reality: 'Neither section is a process journal. Planning is a design artefact written before development. Development must highlight, explain and justify specific techniques and choices, not narrate the build.',
      detector: 'Feedback praising diary-style narration, or recommending more detail about the sequence of work sessions.',
    },
    {
      id: 'cs-client-invention',
      severity: 'high',
      subjects: CS,
      claim: 'The IA requires a named client or adviser, and marks depend on documented client consultation.',
      reality: 'The task is built on a problem scenario the student chooses, and it should be of personal interest to them. No client, adviser or interview requirement appears anywhere. The consultation that is required is with the teacher and is not marked. Where other people are involved in developing the solution, what is required is their consent, which is an ethical condition rather than a source of marks.',
      detector: 'Feedback asking who the client is, requesting evidence of client contact, or deducting for a self-identified problem owner.',
    },
    {
      id: 'cs-ethics-blindspot',
      severity: 'high',
      subjects: CS,
      claim: 'Ethics is not part of a computer science IA because no human participants are involved.',
      reality: 'The guide sets binding conditions: consent before investigation from anyone involved in developing the solution, written consent from the owner of any existing system used, secure storage of collected data, and use of that data only for this solution. A product failing these is an inappropriate product, so this is an eligibility question rather than a marks question.',
      detector: 'A project involving an existing institutional system, or real user data, discussed with no consent or storage question raised.',
    },
    {
      id: 'cs-e-as-afterthought',
      severity: 'medium',
      subjects: CS,
      claim: 'Evaluation is a short closing section worth little.',
      reality: 'It carries 400 recommended words, second only to development, and 4 of 30 marks over two parts whose band gaps are single command terms. Half the exemplars scored 1 or 2 here, almost all by naming outcomes instead of appraising them.',
      detector: 'Feedback treating a two-paragraph evaluation as adequate, or not checking whether every success criterion was appraised individually.',
    },
    {
      id: 'cs-functionality-overclaimed',
      severity: 'high',
      subjects: CS,
      claim: 'The documentation says the product works, so functionality can be marked in the top band.',
      reality: 'Functionality is evidenced by the video, which is not available to this tool. What the documentation claims about the working product is a secondary signal, not the evidence itself.',
      detector: 'A criterion D mark of 10 or above without an explicit statement in the report that functionality could not be verified and the mark is inferred.',
    },
  ],
}

/* ------------------------------------------------------------------ */
/* Topic rules                                                         */
/* ------------------------------------------------------------------ */

export const computerScienceRules: TopicRuleSet = {
  rubricId: 'ib-ia-computer-science',
  label: 'IB Computer Science IA (the computational solution)',

  contexts: [
    { id: 'cs-oop', label: 'Object-oriented program', hint: 'Objects identified from the scenario, documented with UML in the system model. Suits problems with clear entities and relationships between them.' },
    { id: 'cs-web-database', label: 'Interactive web application using a database', hint: 'Justify by a requirement for multi-user or multi-device access. A page that only displays fixed content is not a computational solution.' },
    { id: 'cs-standalone', label: 'Stand-alone application', hint: 'Suits scenarios where the data is local and the tool runs offline. Persistence beyond the run is what separates this from a classroom exercise.' },
    { id: 'cs-web-app', label: 'Web-based application', hint: 'Client-side scripting with server-side logic or storage, argued from an access requirement in the scenario rather than from the popularity of the stack.' },
    { id: 'cs-mobile', label: 'Mobile application', hint: 'Viable when the platform is required by the scenario and the student already has the skills. Do not adopt a new toolchain for the IA.' },
    { id: 'cs-simulation', label: 'Simulation', hint: 'Model a process with rules and state, and derive success criteria from what the simulation must reproduce and what inputs it must reject.' },
    { id: 'cs-purposeful-game', label: 'Computer game with a defined purpose', hint: 'Permitted, but the game needs a meaningful aim beyond entertainment and enough original design to be demonstrably the student\'s own.' },
    { id: 'cs-extend-existing', label: 'Adding functionality to an existing system', hint: 'Requires a stated rationale for why the current system is inadequate, modifications substantial enough to need their own decomposition and design, written consent from the system owner, and both original code and changes marked up in the appendix.' },
  ],

  rules: [
    {
      id: 'cs-copied-code-only',
      label: 'A product built from copied code',
      detail: 'A programming product developed using only copied code cannot demonstrate algorithmic thinking, which is the point of the task.',
      severity: 'fatal',
      hits: ['C', 'D'],
    },
    {
      id: 'cs-web-template',
      label: 'A website built on a template that fixes structure and layout',
      detail: 'Where the template predetermines the structure and layout, there is nothing left to decompose, design or develop.',
      severity: 'fatal',
      hits: ['B', 'C', 'D'],
    },
    {
      id: 'cs-bundled-exemplar',
      label: 'Exemplar products or templates shipped with software',
      detail: 'Sample databases and starter projects supplied by an application are explicitly ruled out.',
      severity: 'fatal',
      hits: ['C', 'D'],
    },
    {
      id: 'cs-copied-game',
      label: 'A copied game without documented major modification',
      detail: 'Reproducing a known game is ruled out unless the code carries major modifications that are properly documented, and even then the game needs a meaningful purpose.',
      severity: 'fatal',
      hits: ['A', 'D'],
    },
    {
      id: 'cs-builder-tool',
      label: 'An application assembled with a builder, wizard or drag-and-drop tool',
      detail: 'Where the tool removes the need for code development, no criterion can be evidenced.',
      severity: 'fatal',
      hits: ['C', 'D'],
    },
    {
      id: 'cs-ethics-fail',
      label: 'A product that breaches the ethical requirements',
      detail: 'Consent is required from anyone involved in developing the solution before investigation begins, and written consent from the owner of any existing system used. Data must be stored securely and used only for this solution. A product failing these is an inappropriate product, not a product that loses marks.',
      severity: 'fatal',
      hits: ['A', 'D'],
    },
    {
      id: 'cs-ia-ee-overlap',
      label: 'Work already submitted for the extended essay',
      detail: 'The same piece of work cannot count for both components.',
      severity: 'fatal',
      hits: ['A'],
    },
    {
      id: 'cs-static-site',
      label: 'A static website',
      detail: 'A site presenting fixed content requires little or no coding and cannot support the development and testing criteria.',
      severity: 'fatal',
      hits: ['C', 'D'],
    },
    {
      id: 'cs-wizard-database',
      label: 'A database built through an application wizard',
      detail: 'Databases created with a wizard assistant, or without complex queries and macros the student wrote, are ruled out. Storing and displaying records is not enough.',
      severity: 'fatal',
      hits: ['C', 'D'],
    },
    {
      id: 'cs-ram-only-crud',
      label: 'Add, search, edit and delete held only in memory',
      detail: 'A solution limited to basic record operations inside memory, with no permanent storage, is treated as an underdeveloped classroom exercise.',
      severity: 'fatal',
      hits: ['C', 'D'],
    },
    {
      id: 'cs-tutorial-follow',
      label: 'A program built by following a tutorial',
      detail: 'Following a tutorial removes the design decisions the criteria exist to assess and puts authenticity in question.',
      severity: 'fatal',
      hits: ['B', 'D'],
    },
    {
      id: 'cs-classroom-exercise',
      label: 'A standard classroom exercise',
      detail: 'Calculators, cash registers and similar set pieces do not generate a problem scenario with measurable requirements.',
      severity: 'fatal',
      hits: ['A', 'D'],
    },
    {
      id: 'cs-unfinished-artefact',
      label: 'An intentionally unfinished product',
      detail: 'A template, a prototype offered in place of a working solution, or the first level of a multi-level game, cannot show functionality and blocks the top bands of development.',
      severity: 'fatal',
      hits: ['D', 'E'],
    },
    {
      id: 'cs-spreadsheet-no-macros',
      label: 'A spreadsheet without student-written macros',
      detail: 'Spreadsheet solutions qualify only where extensive macro code written by the student does the work.',
      severity: 'fatal',
      hits: ['C', 'D'],
    },
    {
      id: 'cs-no-resources',
      label: 'A problem the student cannot actually resource',
      detail: 'The student must have the technical skills, access to the necessary hardware and software, and availability of the relevant data before the problem is settled.',
      severity: 'major',
      hits: ['A', 'D'],
    },
    {
      id: 'cs-beyond-course-skills',
      label: 'A problem requiring skills well beyond the course',
      detail: 'The scenario must not demand technical abilities beyond the student\'s reach. Learning large amounts of new material for the task is advised against; machine learning in particular suits only students with prior experience.',
      severity: 'major',
      hits: ['D'],
    },
    {
      id: 'cs-overreaching-game',
      label: 'An over-ambitious game design',
      detail: 'A game whose scope exceeds what can be built and tested in the time will present as partial functionality at best.',
      severity: 'major',
      hits: ['D', 'E'],
    },
    {
      id: 'cs-subjective-criteria',
      label: 'Success criteria resting on perception',
      detail: 'Criteria about how attractive or intuitive the solution feels are not measurable outcomes. If the interface is a criterion it must be stated measurably with evidence.',
      severity: 'major',
      hits: ['A', 'C', 'E'],
    },
    {
      id: 'cs-coding-act-criteria',
      label: 'Success criteria describing the act of programming',
      detail: 'Criteria such as the code compiling, running without crashing, or using a particular construct describe programming rather than the solution.',
      severity: 'major',
      hits: ['A', 'E'],
    },
    {
      id: 'cs-thin-criteria-set',
      label: 'A success-criteria set that does not describe a whole solution',
      detail: 'The criteria must be derived from the solution requirements and between them describe a successfully developed product. A set that leaves core functionality unstated depresses planning, testing, functionality and evaluation at once. The number matters less than the coverage.',
      severity: 'major',
      hits: ['A', 'B', 'C', 'D', 'E'],
    },
    {
      id: 'cs-unjustified-adaptation',
      label: 'Adapting existing software without a rationale',
      detail: 'Where an existing solution is modified, the work must argue why it is inadequate, the changes must need their own design, and both the original code and the modifications must be highlighted in the appendix.',
      severity: 'major',
      hits: ['A', 'B'],
    },
    {
      id: 'cs-untestable-scope',
      label: 'A scope too large to demonstrate in five minutes',
      detail: 'The video must demonstrate the full functionality of the product within five minutes and cannot be sped up to fit. A product whose core flows cannot be shown in that time will read as partial functionality.',
      severity: 'major',
      hits: ['D'],
    },
    {
      id: 'cs-gratuitous-complexity',
      label: 'Complexity added to display knowledge',
      detail: 'Introducing unnecessary sophistication where a simpler solution would serve tends to cost functionality rather than gain technique marks.',
      severity: 'minor',
      hits: ['D'],
    },
    {
      id: 'cs-diagram-padding',
      label: 'Redundant diagrams',
      detail: 'Only the diagrams the solution needs should appear. Duplicating work across diagrams detracts from the system overview even though diagrams sit outside the word count.',
      severity: 'minor',
      hits: ['C'],
    },
    {
      id: 'cs-generic-context',
      label: 'A computational context given as a summary',
      detail: 'Naming the area of computing and listing its usual advantages is the single most common reason the problem specification stops at three marks. The band asks for the reasons this scenario requires this context.',
      severity: 'minor',
      hits: ['A'],
    },
  ],

  levelNotes: {
    SL: 'Identical task, criteria and standard as HL; the component carries 30% of the SL grade. SL-level programming techniques are sufficient for the highest marks.',
    HL: 'Identical task, criteria and standard as SL; the component carries 20% of the HL grade. No additional technique, scope or length expectation applies, and moderation does not distinguish HL work from SL work.',
  },

  titleGuidance: [
    'Name the problem and its setting, not the technology: the title should say what is being solved and for whom.',
    'The topic can come from any area of computer science that interests the student and does not have to map onto a syllabus theme.',
    'Give the documentation a title page carrying the declared word count, and structure it as five separate sections, one per criterion.',
    'Avoid titles naming a genre of software such as "a database project" or "a Python game". They signal a technology-first choice, which is exactly what makes the computational context read as a summary rather than an explanation.',
    'A title that could describe an off-the-shelf product is a warning sign: it usually means the scenario carries no constraint that makes a bespoke solution worth building.',
  ],

  dataGuidance: [
    'Derive the success criteria from the solution requirements in the scenario, and state each as a measurable outcome that will show the product works.',
    'Write each criterion in terms of functionality: what the solution accepts, what it does with it, what it produces, and how it behaves when the input is wrong.',
    'Plan test data at design time as a table of proposed inputs and expected outcomes, covering both correct operation and unexpected or incorrect input.',
    'Count the success criteria your testing strategy covers before submitting: fewer than three caps criterion C at two marks, and anything short of the full set caps it at four.',
    'Under criterion D the testing must reach correctness, reliability and efficiency, described and justified in the documentation with examples visible in the video.',
    'Cover all eventualities for the major algorithms rather than sampling: an insertion into a sorted structure needs the empty case, the start, the middle and the end.',
    'Full test logs can go to the appendices to save words, but the judgement about effectiveness must appear in the documentation, because appendices earn nothing and need not be read.',
    'Use original data wherever possible. If other people are involved in developing the solution, obtain their consent before starting; if an existing system is used, obtain written consent from its owner; store everything securely and use it only for this solution.',
  ],

  scopeNote:
    'One computational solution per student, 35 hours of teaching time, worth 30 marks — 30% of the SL grade and 20% of the HL grade. Submitted as three files: a documentation PDF of at most 2,000 words split into five sections with recommended lengths of 300, 150, 150, 1,000 and 400 words; a video of at most five minutes demonstrating the product full functionality and examples of testing; and an appendices PDF with the complete source code. The problem is the student own choice, should be of personal interest, and needs a software solution complex enough to match the level of the course and innovative enough to show organisational skill, algorithmic thinking and the ability to code those algorithms, while staying inside the skills the course has taught and the resources the student actually has. All solutions must be coded. The teacher discusses the problem, the strategy and the testing, and comments on one draft; the version handed over after that is final.',
}

/* ------------------------------------------------------------------ */
/* Exemplars                                                           */
/* ------------------------------------------------------------------ */

export const computerScienceExemplars: SubjectExemplars = {
  subject: 'Computer Science',
  rubricId: 'ib-ia-computer-science',
  exemplars: [
    {
      title: 'Rehearsal-room booking manager with clash detection for a school music department',
      context: 'cs-standalone',
      why: 'The scenario yields measurable solution requirements on its own: a fixed number of rooms, recurring ensemble slots, one-off individual bookings, and a rule that two groups cannot hold the same room at the same time. Clash detection is a real algorithm rather than a form submission, so the system model has components worth drawing and the development section has a technique worth weighing. Because bookings must survive between sessions, permanent storage is forced by the problem rather than bolted on, which keeps the project clear of the memory-only exclusion.',
      data: 'Rooms with capacity and equipment; bookings with room, requester, start, end and recurrence. Success criteria should cover adding a booking, rejecting an overlap, editing and cancelling, listing a day or a room, validating that the end follows the start, and persisting between runs. The testing strategy must align with all of them — this is what separates four marks from six on criterion C. Test data needs the ordinary case, the boundary cases where one booking ends exactly as another begins and where a booking crosses a day edge, and the incorrect cases of a nonexistent room, a reversed time range and a duplicate submission.',
      watchOut: 'The obvious version is a table with add and delete buttons, which is a memory-only record exercise in disguise. The clash rule and the persistence requirement are what lift it. Write the computational context as an argument from the need for local storage and a designed timetable view, not as a list of a language\'s virtues — that is what held most exemplars at three marks on criterion A. If the department\'s existing booking system is going to be touched at all, written consent from its owner is required before anything begins.',
    },
    {
      title: 'Component loan and overdue tracker for a school robotics club store',
      context: 'cs-web-database',
      why: 'The problem has a relational shape — components, members, loans — so normalised tables, a data dictionary and student-written queries are demanded by the problem rather than added for display, which keeps it clear of the wizard-built database exclusion. Overdue calculation and stock availability give two distinct algorithms to construct in the system overview and to test for correctness and reliability under criterion D. The output is easy to demonstrate inside five minutes.',
      data: 'Components with an identifier, category, quantity and condition; members; loans with issue, due and return dates. Success criteria should cover issuing a loan only when stock is free, returning and restoring stock, flagging items overdue on a given date, refusing a loan to a member already overdue, searching by category, and producing a summary of items out. Test data must include a return on the due date and one day late as boundary cases, and a request for more units than exist, a return of an item never issued, and a malformed date as incorrect input.',
      watchOut: 'A database that only stores and displays is ruled out, and so is one built through an application wizard — the queries and any macros must be the student\'s own. The other risk is drift into reservations, notifications and dashboards; three related tables and two real algorithms are enough for full marks, and an unfinished larger system is worth far less than a finished smaller one. If real member names are used, that data has to be stored securely and used for nothing else.',
    },
    {
      title: 'Volunteer shift matching board for a community clean-up group',
      context: 'cs-web-app',
      why: 'Matching volunteers to shifts under constraints — availability windows, a minimum crew size, one first-aid holder required per shift — is a constraint problem with a defensible algorithm behind it, which is what the system overview and the techniques part reward. Multi-user access genuinely requires the web context, so the computational context can be explained from the scenario rather than summarised, which is precisely where most exemplars lost the fourth mark on criterion A.',
      data: 'Volunteers with availability windows and qualifications; shifts with location, time window, minimum crew and required qualifications; assignments linking them. Success criteria should cover registering availability, generating a valid assignment, refusing a shift that cannot meet its minimum, flagging a shift with no qualified volunteer, allowing withdrawal and reassignment, and storing the schedule server-side. Boundary cases include a shift needing exactly the number of volunteers available and availability that touches the shift edge by a minute; incorrect cases include overlapping assignments for one volunteer, a withdrawal after the shift has started, and an availability window ending before it begins.',
      watchOut: 'This design drifts towards a static page with a form, which is excluded outright. The matching logic must be code the student wrote and must appear as an algorithm in the system overview. Keep the qualification rules to two or three: an over-constrained matcher cannot be demonstrated inside a five-minute video, and the video is the evidence functionality is judged on. Consent is needed from any volunteers whose real details are used during development.',
    },
  ],
}