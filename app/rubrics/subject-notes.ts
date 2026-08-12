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
  {
    rubricId: 'ib-ia-sciences',
    subject: 'Chemistry',
    notes: [
      'Statistical testing is discouraged, not expected. If a student uses it anyway it is accepted when well executed. Thresholds: standard deviation from n=5, standard error of the mean only above n=30, any other test from n=10. A range from maximum minus minimum is explicitly acceptable instead.',
      'Significant-figure conventions are not expected. What is expected is a consistent number of decimal places matched to instrument precision, held consistent between raw data, stated precision and processed values. If significant figures are used they must be used correctly.',
      'Uncertainty bars are not a requirement. Their absence is not a defect; uncertainties too small to plot should simply be noted in the text.',
      'Uncertainty of a single measurement is written to the same decimal precision as the reading: for 87.4 cm³, ±0.1 is correct while ±0.05 and ±1 are both wrong. Final percentage uncertainty is quoted to one significant figure at or above 2%, to no more than two below it.',
      'Logarithmic quantities need separate handling — pH and Beer–Lambert absorbance cannot be averaged or propagated as if linear.',
      'Balanced equations with state symbols are treated as standard practice, not as a bonus.',
      'Metric flexibility is accepted: mL or cm³, L or dm³. Non-decimal units must be converted rather than reported.',
      'Temperature control means a thermostatic bath. Setting a room thermostat or air conditioning does not count as control; in temperature-sensitive work the ambient value must be recorded.',
      'Sample and reagent identity must be specific enough that the analyte is determined by it — variety and origin, concentration, how solutions were prepared and diluted, how the limiting reactant was established, sampling location and storage conditions.',
      'The student describes disposal for the specific chemicals and organic matter used, even when a technician handles it under school policy, and green-chemistry principles are endorsed where possible.',
      'Sample sizes are typically under 15, so an unjustified outlier removal is highly visible; presenting the result with and without the outlier is the accepted route.',
      'Typical weaknesses in this subject are heat loss in calorimetry and endpoint judgement in titration. Both are valid limitations only where minimisation was attempted at design; naming heat loss after working in an open uninsulated vessel earns nothing.',
    ],
  },
  {
    rubricId: 'ib-ia-sciences',
    subject: 'Biology',
    notes: [
      'Statistical testing is expected here, not optional: a correlation coefficient, t-test, chi-squared or ANOVA is the normal route to top-band processing. Absence of any test where the data supports one caps Criterion B.',
      'Sample-size thresholds govern which test is defensible: n>30 large, 15–30 small, 5–14 very small. A t-test is generally unsafe below n=10; Mann–Whitney tolerates very small samples; as a rule any test wants n≥10.',
      'Standard deviation may be calculated from n≥5. SEM is strongly sample-size dependent and should be reserved for n>30. Range is the fallback when replicates are too few for either.',
      'Range or error bars are expected on graphs showing means of discrete data sets. They are useful but not required for continuous data or correlations. The bar type must be named in the figure title and its choice justified.',
      'Bars of identical length across all means signal the statistic was plotted wrongly — each mean carries its own dispersion.',
      'SD and range ignore sample size, so bar overlap says nothing about significance. SEM and 95% CI do account for it, but a t-test or ANOVA is still expected to confirm any inference drawn from overlap.',
      'ANOVA must be paired with a post-hoc test such as Tukey, or it cannot identify which treatments differ.',
      'R² shows goodness of fit only — not direction, not reliability, not accuracy. It is appropriate for linear and logarithmic regression, not for polynomial or geometric relationships. Fit the trend line first, then read R²; selecting a curve type to maximise R² is unscientific.',
      'Binomial nomenclature is required wherever an organism is named, including in the research question: genus capitalised, species lower case, both italicised. Format errors count against the precision half of Criterion B.',
      'Live-material work carries ethical load: informed consent forms for human participants, and consideration of impact on field sites and organisms. Database, simulation and modelling work has no safety or environmental dimension — a single sentence saying so is the expected treatment, and raising ethical issues around data provenance is credit-worthy.',
      'Environmental conditions are a live control variable in physiology and behaviour work. Setting a thermostat is not controlling temperature; the condition must be monitored and recorded.',
      'Biology-specific processing tools that count as appropriate: Simpson reciprocal index, Lincoln index, chi-squared, t-test, rates of change read from graphed data, magnification scaling.',
      'Typical weaknesses in this subject: unquantified sampling area or quadrat placement, non-metric units, unidentified error bars, treating a device-reported rate as processed data, and biological variability between specimens left unaddressed.',
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