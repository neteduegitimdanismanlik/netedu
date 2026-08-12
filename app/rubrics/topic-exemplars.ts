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
        title: 'How accurately does the relationship between the threshold voltage of LEDs of different wavelength and the frequency of the light they emit give the Planck constant?',
        why: 'The independent variable is discrete but more than five levels are available, the dependent variable is measured directly, and because the gradient corresponds to h/e there is a published value to compare against. Whether the experimental range contains the accepted value maps exactly onto what criterion C asks for.',
        data: 'Six LEDs of different colour (roughly 470–940 nm), a current–voltage sweep in 0.05 V steps for each, five repeats per LED; the threshold voltage is found by extrapolating the linear region to the voltage axis. Frequency is derived from the manufacturer peak wavelength and spectral width.',
        watchOut: 'The definition of threshold voltage is arbitrary: "the point where current becomes visible" and "extrapolation of the linear region" give different answers and impose the same systematic shift on every LED. If the definition used is not stated, the gradient cannot be defended. An LED also does not emit a single wavelength — the manufacturer spectral width is the real source of uncertainty in frequency, and this x-axis uncertainty is omitted in most reports.',
        context: 'hands-on'
      },
      {
        title: 'In a simple pendulum simulation, how does the deviation of the period from the small-angle approximation scale with initial amplitude?',
        why: 'The simulation makes accessible a region above 60° where clean data is hard to obtain in a real lab, and because the research question targets the boundary of validity of an approximation, there is a concrete assumption to discuss in the evaluation. The measured deviation can be compared against the closed-form series expansion, so scientific context is ready for criterion C.',
        data: 'Eight initial amplitudes from 10° to 150°, the total time of 20 oscillations divided by the period at each; held constant: length, gravitational field strength, undamped mode, integration step. Deviation is processed as T(θ)/T₀ − 1.',
        watchOut: 'The simulation is deterministic: repeats with identical input return identical numbers, so the half-range method produces zero uncertainty, and zero uncertainty is not accepted. Uncertainty must be justified from the time resolution of the simulation and the integration step size — doubling the step and measuring how far the result shifts gives that number directly. Since identical repeats do not count as sufficient data, the variety has to come from the amplitude levels rather than from repeats.',
        context: 'simulation'
      },
      {
        title: 'Using transit data from an open exoplanet archive, how closely does the orbital period of hot Jupiters follow Kepler\'s third law against orbital radius?',
        why: 'A database approach supplies many points across a range no single student could measure, and the selection criteria themselves — stellar mass range, transit quality, mass cut-off — satisfy what criterion A asks for in methodological decisions. On a log–log plot the closeness of the gradient to 3/2 is a concrete prediction testable against the uncertainty range.',
        data: 'Thirty systems selected within a single narrow stellar mass range (say 0.95–1.05 solar masses); period, stellar mass and their archive uncertainties are extracted from each record; filtering steps documented with screenshots; log P against log a plotted and the gradient with its uncertainty found.',
        watchOut: 'The trap specific to this topic is circularity: a significant share of semi-major axis values in these archives are not observed but already computed from the period using Kepler\'s third law. Testing the law against such a column tests the law with itself and the result comes out perfect by construction. Each record must be checked for whether its radius was derived or independently measured, derived ones excluded, and that decision written into the methodology. If stellar mass is not held narrow, the gradient reflects the mass distribution rather than the law.',
        context: 'database'
      },
      ]
    
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