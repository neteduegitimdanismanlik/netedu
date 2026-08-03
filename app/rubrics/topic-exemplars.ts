/**
 * Worked topic exemplars per subject.
 * Written in our own words from subject guide + TSM guidance — no IB text copied.
 * Purpose: give the model concrete anchors for what "workable" looks like.
 */

export interface TopicExemplar {
  title: string
  why: string
  data: string
  watchOut: string
  context?: string
}

export interface SubjectExemplars {
  subject: string
  rubricId: string
  exemplars: TopicExemplar[]
}

export const topicExemplars: SubjectExemplars[] = [
  {
    subject: 'Biology',
    rubricId: 'ib-ia-sciences',
    exemplars: [
      {
        title: 'How does soil salinity (0–20 g/L NaCl) affect the germination rate of radish seeds over 7 days?',
        why: 'One independent variable with a clear numeric range, a countable dependent variable, and enough replicates for a standard deviation. Cheap enough to repeat.',
        data: 'At least five salinity levels, 20 seeds per level, germination counted daily. Mean and standard deviation per level.',
        watchOut: 'Germination is binary per seed — count the proportion, not a vague "growth". Control temperature and light, and say how.'
      },
      {
        title: 'Is there a relationship between leaf surface area and stomatal density in three plant species from shaded versus exposed sites?',
        why: 'Correlational design that still yields quantitative data, and the site comparison gives a biological reason to expect a difference.',
        data: 'Nail-varnish leaf peels under a microscope, at least 10 fields of view per species per site, area measured from scanned leaves.',
        watchOut: 'Species must be named with binomial nomenclature. Sampling has to be random within each site, not "the leaves I could reach".'
      },
      {
        title: 'How does substrate concentration affect the rate of catalase activity in potato tissue, measured as oxygen produced per minute?',
        why: 'A classic enzyme investigation that still works because the rate is measured properly and the range is chosen to show saturation.',
        data: 'Five or more hydrogen peroxide concentrations, oxygen volume timed, three trials each, rate calculated as gradient not endpoint.',
        watchOut: 'This is close to a standard class practical — the personal angle has to come from the range chosen or the tissue compared, or it reads as a repeat.'
      },
    ]
  },
  {
    subject: 'Chemistry',
    rubricId: 'ib-ia-sciences',
    exemplars: [
      {
        title: 'How does storage temperature (4–40 °C) affect the vitamin C concentration of freshly squeezed orange juice over 5 days?',
        why: 'A titration gives precise quantitative data, the variable range is realistic, and degradation over time gives a chemical reason for the trend.',
        data: 'DCPIP titration at five temperatures, sampled daily, three titrations per sample, concentration calculated with propagated uncertainty.',
        watchOut: 'The sample must be characterised — variety, origin, storage container. "Orange juice" is not a description. Say how you disposed of the reagents.'
      },
      {
        title: 'How does the alkyl chain length of C1–C5 alcohols affect the enthalpy of combustion measured by calorimetry?',
        why: 'Five clean data points along a chemically meaningful series, and a literature value exists to compare against.',
        data: 'Mass loss of the spirit burner, temperature rise of a fixed water mass, three trials per alcohol, enthalpy per mole calculated.',
        watchOut: 'Heat loss is the obvious weakness — do not just name it, state the direction of the systematic error. An uninsulated open beaker undercuts any claim to have controlled it.'
      },
      {
        title: 'How does the concentration of acetic acid in commercial vinegars vary with price band, and does it match the labelled value?',
        why: 'Turns a routine titration into a comparison with an accepted value, which supports the conclusion criterion.',
        data: 'Standardised NaOH titration of at least five vinegars across price bands, three titrations each, compared with the label claim.',
        watchOut: 'Buying five vinegars is not five levels of an independent variable — define what is actually being varied, or the design collapses.'
      },
    ]
  },
  {
    subject: 'Physics',
    rubricId: 'ib-ia-sciences',
    exemplars: [
      {
        title: 'How does the length of a simple pendulum (0.2–1.0 m) affect its period, and does the gradient of T² against L give a value of g consistent with 9.81 m s⁻²?',
        why: 'Linearisation is justified by theory, the gradient yields a physical constant, and there is an accepted value to compare against.',
        data: 'Six lengths, ten oscillations timed per trial, three trials, T² plotted against L with uncertainty bars and min/max gradient lines.',
        watchOut: 'A hand stopwatch cannot claim millisecond precision. Start each swing from the same amplitude and say how — the small-angle approximation is an assumption you must state.'
      },
      {
        title: 'How does the angle of a ramp affect the terminal velocity of a marble in a viscous liquid, and is the relationship consistent with Stokes\' law?',
        why: 'Connects a measurable to a model, so the conclusion can be tested against theory rather than just described.',
        data: 'Five or more angles, video analysis frame-by-frame, terminal velocity read from the flat region of the velocity–time graph.',
        watchOut: 'Do not force the best-fit line through the origin — a systematic offset is exactly what you want to detect, not hide.'
      },
      {
        title: 'How does the separation between two slits affect the fringe spacing in a double-slit interference pattern?',
        why: 'A well-defined relationship with a known theoretical form, and the uncertainty in fringe measurement is genuinely worth propagating.',
        data: 'At least five slit separations, fringe spacing averaged over ten fringes to reduce reading uncertainty, uncertainty propagated to the calculated wavelength.',
        watchOut: 'Statistical tests are not expected here — uncertainty propagation is. Measuring one fringe instead of ten throws away precision you cannot recover.'
      },
    ]
  },
  {
    subject: 'Mathematics AA',
    rubricId: 'ib-ia-maths',
    exemplars: [
      {
        title: 'Modelling the cooling of a coffee cup: does Newton\'s law of cooling fit my own temperature data better than a linear model?',
        why: 'The student collects their own data, fits two competing models, and has something genuine to reflect on when one fits better.',
        data: 'Temperature logged every 30 seconds for 40 minutes, exponential regression, residuals compared against a linear fit.',
        watchOut: 'Fitting a curve is not the exploration — comparing models, justifying the choice and discussing where the model breaks down is.',
        context: 'nature-resources'
      },
      {
        title: 'Using calculus to find the dimensions that minimise the surface area of a 330 ml drinks can, and comparing with the real can',
        why: 'Genuine optimisation with a real object to check against, and the gap between the theoretical and the actual answer is where the reflection lives.',
        data: 'Measurements of an actual can, surface area function derived, minimised with differentiation, result compared with manufacture.',
        watchOut: 'The textbook version of this is well known — the personal engagement has to come from the real can and from asking why industry does not use the optimal shape.',
        context: 'business-finance'
      },
      {
        title: 'How well does a normal distribution model the reaction times of students in my year group, and what does the fit reveal about the tails?',
        why: 'Own data collection, a testable claim, and a natural route into goodness-of-fit rather than just quoting a mean.',
        data: 'At least 40 reaction time measurements, histogram, normal model fitted, chi-squared goodness-of-fit test.',
        watchOut: 'Reaction time data is usually skewed. Finding that the model fits badly is a good result if you analyse why — do not force it to look normal.',
        context: 'health-fitness'
      },
    ]
  },
]

/** Exemplars for a subject, falling back to rubric-level ones if the subject has none. */
export function getExemplars(subject: string, rubricId: string): TopicExemplar[] {
  const exact = topicExemplars.find(
    e => e.subject.toLowerCase() === (subject || '').toLowerCase()
  )
  if (exact) return exact.exemplars

  const sameRubric = topicExemplars.filter(e => e.rubricId === rubricId)
  return sameRubric.flatMap(e => e.exemplars).slice(0, 3)
}