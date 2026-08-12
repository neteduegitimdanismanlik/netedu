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
    subject: 'Physics',
    rubricId: 'ib-ia-sciences',
    exemplars: [
      {
        title: 'How accurately does the relationship between the threshold voltage of LEDs of different wavelength and the frequency of the light they emit give the Planck constant?',
        why: 'The independent variable is discrete but more than five levels are available, the dependent variable is measured directly, and because the gradient corresponds to h/e there is a published value to compare against. Whether the experimental range contains the accepted value maps exactly onto what criterion C asks for.',
        data: 'Six LEDs of different colour (roughly 470-940 nm), a current-voltage sweep in 0.05 V steps for each, five repeats per LED; the threshold voltage is found by extrapolating the linear region to the voltage axis. Frequency is derived from the manufacturer peak wavelength and spectral width.',
        watchOut: 'The definition of threshold voltage is arbitrary: the point where current becomes visible and the extrapolation of the linear region give different answers and impose the same systematic shift on every LED. If the definition used is not stated, the gradient cannot be defended. An LED also does not emit a single wavelength, and the manufacturer spectral width is the real source of uncertainty in frequency.',
        context: 'hands-on'
      },
      {
        title: 'In a simple pendulum simulation, how does the deviation of the period from the small-angle approximation scale with initial amplitude?',
        why: 'The simulation makes accessible a region above 60 degrees where clean data is hard to obtain in a real lab, and because the research question targets the boundary of validity of an approximation, there is a concrete assumption to discuss in the evaluation. The measured deviation can be compared against the closed-form series expansion.',
        data: 'Eight initial amplitudes from 10 to 150 degrees, the total time of 20 oscillations divided by the period at each; held constant: length, gravitational field strength, undamped mode, integration step. Deviation is processed as the ratio of measured to small-angle period, minus one.',
        watchOut: 'The simulation is deterministic: repeats with identical input return identical numbers, so the half-range method produces zero uncertainty, and zero uncertainty is not accepted. Uncertainty must be justified from the time resolution of the simulation and the integration step size. Doubling the step and measuring how far the result shifts gives that number directly.',
        context: 'simulation'
      },
      {
        title: 'Using transit data from an open exoplanet archive, how closely does the orbital period of hot Jupiters follow the third law of planetary motion against orbital radius?',
        why: 'A database approach supplies many points across a range no single student could measure, and the selection criteria themselves — stellar mass range, transit quality, mass cut-off — satisfy what criterion A asks for in methodological decisions. On a log-log plot the closeness of the gradient to 1.5 is a concrete prediction testable against the uncertainty range.',
        data: 'Thirty systems selected within a single narrow stellar mass range (say 0.95-1.05 solar masses); period, stellar mass and their archive uncertainties are extracted from each record; filtering steps documented with screenshots; log period against log radius plotted and the gradient with its uncertainty found.',
        watchOut: 'The trap specific to this topic is circularity: a significant share of semi-major axis values in these archives are not observed but already computed from the period using the same law. Testing the law against such a column tests the law with itself and the result comes out perfect by construction. Each record must be checked for whether its radius was derived or independently measured, and derived ones excluded.',
        context: 'database'
      },
    ]
  },
  {
    subject: 'Chemistry',
    rubricId: 'ib-ia-sciences',
    exemplars: [
      {
        title: 'How does ascorbic acid concentration, across five levels from 0.002 to 0.010 mol per cubic decimetre, affect the initial rate of reduction of 2,6-dichlorophenolindophenol at 298 K, followed as absorbance at 600 nm in phosphate buffer at pH 7.0?',
        why: 'Every control carries a named mechanism rather than a name: pH by buffer, temperature by jacketed cell, dye held in excess for a stated reason. Pseudo-first-order theory predicts a log-log gradient of one, so the conclusion compares a measured value with a range against a predicted one instead of describing a shape.',
        data: 'Five concentrations, three replicates each. Absorbance-time gradient over a fixed early window, converted through a calibration curve, then log-log fitted for the order. Uncertainty propagated at the calibration, the gradient and the linearisation, with gradient bounds on the final plot.',
        watchOut: 'Ascorbate oxidises in air, so decomposition between runs appears as drift with run order. Log the run order and test for it, which is what turns a generic weakness into a ranked one. Check the top concentration stays inside the instrument linear range before fixing the range.',
        context: 'hands-on'
      },
      {
        title: 'Across the straight-chain primary alcohols from methanol to octan-1-ol, does the enthalpy of vaporisation increment per methylene group at 298 K stay constant, as group additivity predicts?',
        why: 'The filtering rule is the methodology, and additivity gives a numerical prediction, so short-chain deviation becomes something to explain through hydrogen bonding rather than an anomaly to apologise for.',
        data: 'Eight compounds, every qualifying determination retained rather than one chosen value. Filters fixed in advance and screenshotted: 298 K only, calorimetric determinations only, straight-chain primary isomers only. Increment from the fitted gradient with min-max bounds; spread between independent determinations of the same compound used as the uncertainty estimate.',
        watchOut: 'Where several literature values exist for one compound, picking whichever sits nearest the line is outlier manipulation wearing a different hat. Safety and environmental issues do not arise here and the report should say so explicitly rather than leave the silence.',
        context: 'database'
      },
      {
        title: 'How does the ethanoic acid to ethanoate mole ratio, across five ratios from 4:1 to 1:4 at a fixed total concentration of 0.100 mol per cubic decimetre, affect buffer capacity towards hydrochloric acid at 298 K, against a Henderson-Hasselbalch spreadsheet model?',
        why: 'The model supplies a predicted value for every measured point, so the analysis compares two paired series. The prediction is falsifiable, a maximum at equal ratio, and a displaced maximum becomes an activity-effect argument rather than a failure.',
        data: 'Five ratios, three replicates, titrant standardised against a primary standard. Capacity derived from titre as concentration per pH unit, dilution by titrant included. Residuals of measured against modelled capacity plotted, then the model re-run with an activity correction to show how much of the residual it absorbs.',
        watchOut: 'The endpoint must be exactly one pH unit, not approximately one, or the dependent variable stops being comparable across runs. Two-point meter calibration before each session belongs in the method: an uncalibrated meter is a design failure that should never surface in the evaluation. Do not average replicate pH readings.',
        context: 'spreadsheet-model'
      },
    ]
  },
  {
    subject: 'Biology',
    rubricId: 'ib-ia-sciences',
    exemplars: [
      {
        title: 'How does pre-incubation temperature between 10 and 60 degrees Celsius affect the initial rate of oxygen evolution by catalase from Solanum tuberosum, measured at a constant assay temperature of 25 degrees Celsius?',
        why: 'The independent variable, its range and interval, the derived dependent variable and the study organism all sit inside the question, so criterion A opens with context already established. The measurement route is implied, which pre-empts the reproducibility gap that costs most reports a mark.',
        data: 'Six pre-incubation temperatures at 10 degree intervals, five replicates each, initial rate of oxygen evolution in cubic centimetres per second read over a fixed 60 second window at a constant assay temperature; thirty measurements in total supports a t-test between adjacent levels.',
        watchOut: 'Denaturation is irreversible, so pre-incubation temperature and assay temperature are two different variables. Fixing the assay temperature is the control that makes this a question about denaturation rather than a duplicate of the textbook rate-versus-temperature curve.',
        context: 'hands-on'
      },
      {
        title: 'How has the mean latitude of occurrence records for Gadus morhua in the North Atlantic changed with mean annual sea-surface temperature over the past 26 years?',
        why: 'Two correlated quantities replace an independent and dependent pair, which is a legitimate biology design. The system, the time window and the extraction boundary are stated, so the reader can judge sufficiency, and a rank correlation with a significance step is available from the outset.',
        data: 'Twenty-six annual points of mean sea-surface temperature against mean latitude of georeferenced occurrence records for one named species in one ocean basin, filtered to records with coordinate precision better than one tenth of a degree.',
        watchOut: 'Occurrence records measure sampling effort, not abundance. A rise in records can track survey activity rather than the organism, so the filtering rule has to be stated and its bias named in the evaluation rather than discovered by the examiner.',
        context: 'database'
      },
      {
        title: 'How does distance from a footpath edge, from zero to eight metres, affect ground-layer plant diversity measured as the Simpson reciprocal index?',
        why: 'Distance from a defined edge converts a vague habitat question into a discrete independent variable with stated levels; the dependent variable is an index, so processing is substantial before any statistic is applied. Replicate transects give a defensible unit of repetition.',
        data: 'Five distances at two metre intervals, five replicate transects, half-metre square quadrats, ground-layer vascular plants identified to species and counted; Simpson reciprocal index per quadrat, Spearman correlation across the gradient.',
        watchOut: 'The quadrat is the sample but the transect is the unit of repetition. Pooling all twenty-five quadrats as independent inflates the sample size and makes any significance test unsound. Report the transect means and test on those.',
        context: 'fieldwork'
      },
    ]
  },
  {
    subject: 'Mathematics AA',
    rubricId: 'ib-ia-maths',
    exemplars: [
      {
        title: 'Modelling the cooling of a coffee cup: does the law of cooling fit my own temperature data better than a linear model?',
        why: 'The student collects their own data, fits two competing models, and has something genuine to reflect on when one fits better.',
        data: 'Temperature logged every 30 seconds for 40 minutes, exponential regression, residuals compared against a linear fit.',
        watchOut: 'Fitting a curve is not the exploration. Comparing models, justifying the choice and discussing where the model breaks down is.',
        context: 'nature-resources'
      },
      {
        title: 'Using calculus to find the dimensions that minimise the surface area of a 330 ml drinks can, and comparing with the real can',
        why: 'Genuine optimisation with a real object to check against, and the gap between the theoretical and the actual answer is where the reflection lives.',
        data: 'Measurements of an actual can, surface area function derived, minimised with differentiation, result compared with manufacture.',
        watchOut: 'The textbook version of this is well known. The personal engagement has to come from the real can and from asking why industry does not use the optimal shape.',
        context: 'business-finance'
      },
      {
        title: 'How well does a normal distribution model the reaction times of students in my year group, and what does the fit reveal about the tails?',
        why: 'Own data collection, a testable claim, and a natural route into goodness-of-fit rather than just quoting a mean.',
        data: 'At least 40 reaction time measurements, histogram, normal model fitted, chi-squared goodness-of-fit test.',
        watchOut: 'Reaction time data is usually skewed. Finding that the model fits badly is a good result if you analyse why, so do not force it to look normal.',
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