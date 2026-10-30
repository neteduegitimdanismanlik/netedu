// app/rubrics/design-technology.ts
//
// IB Design Technology — the Internal Assessment. Five criteria, 33 marks.
// This is NOT the sciences rubric: Design Technology was previously resolved
// to ib-ia-sciences (four criteria, 24 marks: Research Design / Data Analysis
// / Conclusion / Evaluation) because the subject sits in Group 4 alongside the
// sciences. It does not share their IA framework at all — the DT IA follows
// the Design Cycle (Empathize, Define, Ideate, Design, Present), not a lab
// report, and marking it against the sciences criteria produced scores and
// feedback that did not correspond to anything the student actually submitted.
//
// Criteria, names and mark allocation (first assessment 2027): confirmed
// against an official IBO "Comments on assessed work" exemplar (Example 3:
// Math play set — A 6/9, B 3/6, C 4/6, D 3/6, E 2/6, total 18/33), cross-checked
// against third-party IB guide summaries. Band descriptors below are written
// from that exemplar and those summaries, not transcribed from the IBO subject
// guide itself — treat the wording as a close paraphrase, not a quotation.
import type { ExtendedRubric } from './rubrics-extra'

export const designTechnologyRubric: ExtendedRubric = {
  id: 'ib-ia-design-technology',
  framework: 'IB',
  documentType: 'Internal Assessment',
  label: 'IB — Internal Assessment (Design Technology)',
  totalMax: 33,
  shape: 'single',

  // One task, one set of criteria at SL and HL for this component.
  weight: 40,

  // DOGRULANMADI: the guide does not publish mark-to-grade boundaries for the
  // IA in isolation. This scale mirrors the proportional spacing used for the
  // sciences rubric and is an in-product estimate only — never present it to
  // a student as a predicted grade.
  gradeScale: [
    { grade: '7', min: 29 },
    { grade: '6', min: 25 },
    { grade: '5', min: 19 },
    { grade: '4', min: 15 },
    { grade: '3', min: 11 },
    { grade: '2', min: 7 },
    { grade: '1', min: 0 },
  ],

  criteria: [
    {
      id: 'A',
      name: 'Empathize',
      max: 9,
      description:
        'How well the student understands the user, the task and existing products before proposing a redesign — a primary persona, a storyboard grounded in task analysis, and an analysis of comparable existing products.',
      bands: [
        {
          range: '7-9',
          descriptor:
            "Explains the persona's needs, motivations and circumstances through specific evidence rather than assertion; documents the task comprehensively; accurately evaluates the relevant features of several existing products (typically 4-6) rather than describing them.",
        },
        {
          range: '4-6',
          descriptor:
            'Describes relevant needs for an identified persona and identifies genuine successes or weaknesses in existing products, but stops short of explaining why they matter to this user.',
        },
        {
          range: '1-3',
          descriptor:
            'Names a persona but gives limited insight into their context; existing-product analysis is thin or mostly descriptive.',
        },
      ],
    },
    {
      id: 'B',
      name: 'Defining the project',
      max: 6,
      description:
        'Turns the Criterion A evidence into a focused problem statement and a set of justified design specifications — every requirement should trace back to something established in the research, not appear from nowhere.',
      bands: [
        {
          range: '5-6',
          descriptor:
            'The problem statement explains the redesign opportunity itself without smuggling in a preferred solution. Specifications are specific, measurable, justified and testable, and each one is traceable to a finding from Criterion A.',
        },
        {
          range: '3-4',
          descriptor: 'A problem statement is identified and most specifications are stated and justified, but the link back to the research is inconsistent or some specifications are not testable.',
        },
        {
          range: '1-2',
          descriptor: 'The problem statement is vague, already implies a specific solution, or the specifications are not clearly connected to the research in Criterion A.',
        },
      ],
    },
    {
      id: 'C',
      name: 'Ideation and modelling',
      max: 6,
      description:
        'Whether the student generates genuinely feasible, distinct redesign ideas and actually distinguishes between them through modelling, testing and user feedback, rather than sketching one concept three ways.',
      bands: [
        {
          range: '5-6',
          descriptor:
            'Multiple (typically three) strong, feasible and genuinely distinct ideas are generated, each tested or modelled, with user feedback used to choose between them.',
        },
        {
          range: '3-4',
          descriptor: 'Several ideas are generated with some real differentiation and some testing, but the comparison between them is thin or feedback is not used to decide.',
        },
        {
          range: '1-2',
          descriptor: 'Idea generation is limited, the options are cosmetic variations of one concept, or there is no real modelling, testing or feedback.',
        },
      ],
    },
    {
      id: 'D',
      name: 'Designing a solution',
      max: 6,
      description:
        'How the chosen idea is developed through iterative models of increasing fidelity — a test, result, change, reason, re-test cycle, not a single finished photo — plus the manufacturing drawings used to communicate the design.',
      bands: [
        {
          range: '5-6',
          descriptor:
            'Genuine iteration is shown: each cycle states what was tested, what the result was, what changed and why. The final model is evaluated against every relevant specification from Criterion B and the user needs from Criterion A. Drawings communicate dimensions, components, materials, assembly and production information clearly enough to manufacture from.',
        },
        {
          range: '3-4',
          descriptor: 'Some iteration is shown but the cycle is incomplete (missing a clear reason for a change, or a re-test), and the drawings are present but miss some manufacturing detail.',
        },
        {
          range: '1-2',
          descriptor: 'Only a single finished prototype is shown with no real development history, or the drawings are minimal and would not let someone else manufacture the piece.',
        },
      ],
    },
    {
      id: 'E',
      name: 'Presenting a solution',
      max: 6,
      description:
        "Communicates the final redesign and shows specifically how it improves on the original product and resolves the problems identified back in Criterion A — this is not a second development section, and visual polish on its own is not what's being assessed.",
      bands: [
        {
          range: '5-6',
          descriptor:
            'Returns explicitly to the original product and the problems identified in Criterion A, and explains specifically — not just asserts — how the redesign resolves each of them.',
        },
        {
          range: '3-4',
          descriptor: 'Presents the final solution with some comparison to the original product, but the connection back to the specific problems identified earlier is only partial.',
        },
        {
          range: '1-2',
          descriptor: 'Describes the final product on its own terms without meaningfully comparing it back to the original product or the problems that motivated the redesign.',
        },
      ],
    },
  ],

  guidance:
    'The Design Technology IA leans heavily on photographs, CAD renders, models and drawings. This checker only reads the text layer of an uploaded PDF — embedded images are not visible to it, so marks on criteria that are mostly visual (especially D and the product-comparison images in A and E) are based only on what the surrounding prose describes and justifies, not on judging the images themselves. Treat a low score on those criteria as "we could not read the images," not as "the images are weak."',
}
