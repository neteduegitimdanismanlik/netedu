// app/rubrics/subject-notes.ts
//
// What is true for ONE subject but not for the others sharing its rubric.
// Anything true for every subject on the rubric belongs in checker-guards.ts.
//
// Keep each list short. These go into the prompt verbatim, so every line costs
// tokens on every marking call.

export interface SubjectNotes {
  rubricId: string
  subject: string
  notes: string[]
}

export const subjectNotes: SubjectNotes[] = [
  {
    rubricId: 'ib-ia-sciences',
    subject: 'Physics',
    notes: [
      'No statistical testing is expected — not t-tests, chi-squared, correlation coefficients, or inference from standard deviation. What is expected is uncertainty propagation following the rules in the physics data booklet. Using standard deviation in place of gradient uncertainty puts the top band at risk: statistical scatter is not experimental uncertainty.',
      'Uncertainty of a mean from repeated readings = (maximum − minimum)/2. If that comes out smaller than the instrument uncertainty of a single reading, the larger value is used. If the repeats are identical, the least count of the instrument remains the uncertainty.',
      'Uncertainty is quoted to one significant figure, two only when it begins with 1, and written to the same decimal place as the value: (12.2 ± 0.4) m and (14.23 ± 0.12) s are right; (12.2 ± 0.36) m and (14.23 ± 0.1) s are wrong.',
      'Rounding happens only at the end of the processing chain; intermediate steps keep extra digits.',
      'Uncertainty bars go on the dependent variable and may be treated as symmetric. The line or curve of best fit is chosen from the physics that predicts the relationship — it should pass through the uncertainty bars, not through the points. Fitting a polynomial through every point is not physically defensible. R² need not be quoted.',
      'On a linear graph, gradient uncertainty comes from maximum and minimum gradient lines drawn by eye taking all uncertainty bars into account — not from the first and last point alone. Software gradients may be used, but the student must show they understand the process.',
      'A conclusion needs value plus experimental range, e.g. (932 ± 15) J kg⁻¹ K⁻¹, compared against the accepted value. Quoting percentage difference alongside percentage uncertainty is good practice. Where no accepted value exists — the spring constant of a rubber band, say — the discussion turns to whether the result is physically reasonable.',
      'A non-zero y-intercept either signals a systematic error or corresponds to a physical quantity. Either way its direction and size should be discussed. Reading the intercept as physics rather than noise is the clearest signature of the top band in Evaluation.',
      'Safety, ethics and environment: where the investigation raises none of these, the student should say so explicitly. For database, simulation and modelling work, safety and environmental considerations do not apply; an ethical dimension around use of the data source counts in the student\'s favour if raised.',
    ],
  },
]

export function getSubjectNotes(rubricId: string, subject: string): string[] {
  const s = (subject || '').toLowerCase()
  const entry = subjectNotes.find(
    n => n.rubricId === rubricId && s.includes(n.subject.toLowerCase())
  )
  return entry?.notes ?? []
}