import { businessManagementExemplars } from './business-management'
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
  {
    subject: 'Psychology',
    rubricId: 'ib-ia-psychology',
    exemplars: [
      {
        title: 'Does the presence of a smartphone in view reduce recall accuracy on a word list task among Grade 11 students in a single school?',
        why: 'The aim carries the population and both variables, the manipulation is a single visible change, and two published studies on attentional drain give the introduction a gap to sit in rather than a topic to summarise.',
        data: 'Two conditions, phone visible and phone absent, with the same 20-word list; recall counted as words correctly reproduced in three minutes; independent groups to avoid the same participant learning the list twice.',
        watchOut: 'The obvious flaw is that participants who own no smartphone are not equivalent to those who do, and that difference has nothing to do with the manipulation. Naming that as a limitation is worth more than adding another condition. Feasibility is not marked, so the proposal is not weakened by never being run.',
        context: 'experiment'
      },
      {
        title: 'How do Grade 12 students describe the influence of parental expectation on their university choice?',
        why: 'A qualitative aim is equally valid here, and the population and focus are both named. The interview route makes the analysis criterion about thematic treatment rather than a test, which is where most qualitative proposals lose marks by staying vague.',
        data: 'Semi-structured interviews with six to eight participants, an interview schedule of at least eight open questions written out in full, transcripts analysed thematically with the coding stages described.',
        watchOut: 'Writing "the interviews will be analysed for themes" is the bottom of the analysis criterion. The stages have to be named — how transcripts are coded, how codes become themes, what counts as a theme. Researcher bias also bites hardest here: the student shares the population and has their own views on parental expectation, and that has to be traced through to an effect rather than merely admitted.',
        context: 'interview'
      },
      {
        title: 'Is there a relationship between self-reported sleep duration and academic self-efficacy among students aged 16 to 18?',
        why: 'A correlational questionnaire design with two clearly operationalised variables. The instrument is where the marks sit, so writing out the items makes the difference between a capped Analysis and an open one.',
        data: 'A questionnaire of at least ten items, written out in full, covering sleep duration on school nights and a self-efficacy measure adapted with stated reasoning; Spearman correlation with the significance step named.',
        watchOut: 'Adopting a published self-efficacy scale unchanged caps Analysis at 2 — the criterion asks what the student decided, and lifting an instrument leaves nothing decided. Adapt it and say why the wording fits this age group. Self-reported sleep is also not measured sleep, and that gap belongs in the evaluation as a limitation of this design, not as a generic caveat.',
        context: 'questionnaire'
      },
    ]
  },
  businessManagementExemplars,
  {
    subject: 'Global Politics SL',
    rubricId: 'ib-ia-global-politics-sl',
    exemplars: [
      {
        title: 'Whose turn to speak at neighbourhood budget meetings? Agenda-setting power in a participatory budgeting process',
        why: 'The issue is narrow and observable: who gets to put an item on the agenda inside a mechanism that calls itself participation. The engagement and the issue are the same thing — the student walks into the room where power operates. Classifications of power (power to, power over, power with; structural and relational power) settle onto the analysis without being forced, which feeds the concept strand of criterion C naturally.',
        data: 'Attending two separate neighbourhood budget meetings as an observer and noting the roles of those who speak; interviewing a municipal officer who prepares the agenda; interviewing separately a resident whose proposal was not taken up and a representative of an association whose proposal was; the published minutes of previous rounds.',
        watchOut: 'Participatory budgeting presents itself as democratic participation and the institution hands you that framing ready-made. If the report confirms the framing it stays descriptive; the real question is who can place an item on the agenda and which proposals were filtered out before the meeting. Names of residents who speak must not appear in the report — anonymity is required for anyone without an official role.',
        context: 'core-power'
      },
      {
        title: 'A right or a shortage of resources? Comparing how a tenants\' solidarity network and a municipal housing unit frame the social housing waiting list',
        why: 'Two stakeholders describe the same issue in two different languages, which guarantees the synthesis strand of criterion C at the design stage. The issue is local and concrete — a waiting list — while connecting directly to the inequality and resource-distribution debates of the development and sustainability theme.',
        data: 'Four sessions volunteering at a tenants\' network advice desk, noting the problems applicants raise most often; interviewing an officer from the municipal housing unit; comparing an advocacy document produced by the network with the municipality\'s official allocation criteria; the city\'s housing allocation statistics for the past three years.',
        watchOut: 'Sitting at an advice desk is emotionally heavy and pulls the student towards one side; individual stories look like evidence but cannot carry a systematic claim on their own. Reaching the top band of criterion D requires the report to say this outright: which position it was written from, and which finding that position bent, in which direction. No personal information about applicants may enter the report or its appendices.',
        context: 'development-sustainability'
      },
      {
        title: 'The language of tension in out-of-school youth groups: does mediation in a local reconciliation programme reach structural violence?',
        why: 'The issue sits squarely in conflict theory but the scale is held at community level. The distinction between direct and structural violence gives a ready analytical tool for asking what mediation resolves and what it leaves alone — without that distinction the report stays descriptive, with it the route to the top band of criterion C opens. The engagement is as observer and trainee, not as a party to the conflict.',
        data: 'Attending an open mediation training session run by a local reconciliation programme and analysing the training materials; interviewing two programme coordinators; interviewing an officer from the municipal youth unit about the need the programme grew out of; the district\'s youth services budget and distribution of facilities.',
        watchOut: 'This topic is very open to drifting into a narrative that frames particular groups as problematic, and the coordinators\' success stories amplify that risk. In evaluating the mediation the report must ask whether it addresses the source of the problem or only its symptom. If interviews with participating young people are planned, written parental consent is required for the 12-16 group and written consent from the relevant teachers in a school setting; where consent cannot be obtained, contact should be limited to adult coordinators.',
        context: 'peace-conflict'
      },
    ]
  },
  {
    subject: 'Global Politics HL',
    rubricId: 'ib-ia-global-politics-hl',
    exemplars: [
      {
        title: 'Whose turn to speak at neighbourhood budget meetings? Agenda-setting power in a participatory budgeting process',
        why: 'The issue is narrow and observable: who gets to put an item on the agenda inside a mechanism that calls itself participation. The engagement and the issue are the same thing — the student walks into the room where power operates. Classifications of power settle onto the analysis without being forced, which feeds the concept strand of criterion C naturally. For criterion F the recommendation writes itself out of the findings: a concrete change to how the agenda is compiled, addressed to the officer who compiles it.',
        data: 'Attending two separate neighbourhood budget meetings as an observer and noting the roles of those who speak; interviewing a municipal officer who prepares the agenda; interviewing separately a resident whose proposal was not taken up and a representative of an association whose proposal was; the published minutes of previous rounds.',
        watchOut: 'Participatory budgeting presents itself as democratic participation and the institution hands you that framing ready-made. If the report confirms the framing it stays descriptive; the real question is who can place an item on the agenda and which proposals were filtered out before the meeting. Names of residents must not appear. In the separate 400-word recommendation, "participation should be increased" does not get past 4/6 — name who implements the change, with what resource, and against what resistance.',
        context: 'core-power'
      },
      {
        title: 'A right or a shortage of resources? Comparing how a tenants\' solidarity network and a municipal housing unit frame the social housing waiting list',
        why: 'Two stakeholders describe the same issue in two different languages, which guarantees the synthesis strand of criterion C at the design stage. The issue is local and concrete while connecting to the inequality and resource-distribution debates of the development and sustainability theme. The competing framings also give the recommendation a specific target: which criterion in the allocation rules, changed how.',
        data: 'Four sessions volunteering at a tenants\' network advice desk, noting the problems applicants raise most often; interviewing an officer from the municipal housing unit; comparing an advocacy document produced by the network with the municipality\'s official allocation criteria; the city\'s housing allocation statistics for the past three years.',
        watchOut: 'Sitting at an advice desk pulls the student towards one side; individual stories look like evidence but cannot carry a systematic claim alone. The top band of criterion D requires the report to say which position it was written from and which finding that position bent. No personal information about applicants may enter the report or appendices. The recommendation is a separate text with its own word count — declare both figures.',
        context: 'development-sustainability'
      },
      {
        title: 'The language of tension in out-of-school youth groups: does mediation in a local reconciliation programme reach structural violence?',
        why: 'The issue sits squarely in conflict theory but the scale is held at community level. The direct-versus-structural violence distinction gives a ready tool for asking what mediation resolves and what it leaves alone. The engagement is as observer and trainee, not as a party. For criterion F the gap the analysis exposes — symptom addressed, source untouched — points straight at what should change.',
        data: 'Attending an open mediation training session run by a local reconciliation programme and analysing the training materials; interviewing two programme coordinators; interviewing an officer from the municipal youth unit about the need the programme grew out of; the district\'s youth services budget and distribution of facilities.',
        watchOut: 'This topic is very open to drifting into a narrative that frames particular groups as problematic, and coordinators\' success stories amplify that risk. Written parental consent is required for interviews with 12-16 year olds, plus written consent from teachers in a school setting; where consent cannot be obtained, limit contact to adult coordinators. A recommendation that only asks for "more funding" is the generic kind that caps at 4/6.',
        context: 'peace-conflict'
      },
    ]
  },
  {
    subject: 'Economics',
    rubricId: 'ib-ia-economics',
    exemplars: [
      {
        title: 'A news report on a national minimum wage rise, analysed through the key concept of intervention',
        why: 'The article contains a policy change, so a labour market diagram has a movement to show. Minimum wage is a price floor, which gives a clean chain from the intervention to a surplus and then to who gains and who loses — exactly what criterion C asks for.',
        data: 'One labour market diagram with the floor above equilibrium, the excess supply marked; the actual figure from the article used in the analysis; evaluation weighing higher earnings for those employed against reduced hours for others, short run against long run.',
        watchOut: 'The trap here is drawing the diagram correctly and then writing only "as shown above" — criterion A marks the explanation, not the figure, so a flawless diagram with no walkthrough sits at the bottom. Also resist covering the whole policy: 800 words holds one market and one judgement, not a survey of national employment.',
        context: 'microeconomics'
      },
      {
        title: 'A central bank interest rate decision reported in a news article, analysed through the key concept of change',
        why: 'A rate decision is a discrete event with a transmission mechanism, so the chain from the decision to aggregate demand to inflation has real steps rather than a single leap. The article supplies a figure, which keeps the analysis specific.',
        data: 'An aggregate demand and supply diagram showing the leftward shift; the rate and the inflation target from the article carried into the text; evaluation comparing the effect on borrowers against savers, and the lag before the effect appears.',
        watchOut: 'Interest rate commentaries drift into describing the whole economy. Pick one channel — investment, or consumption, or the exchange rate — and follow it properly rather than listing all three. Choosing the concept after writing shows: if the analysis would read identically without the word change, criterion D caps at 1.',
        context: 'macroeconomics'
      },
      {
        title: 'A report on a newly imposed tariff on imported steel, analysed through the key concept of interdependence',
        why: 'A tariff has a standard diagram, a clear domestic winner and a clear foreign loser, and the concept of interdependence organises the commentary around who else is affected rather than sitting decoratively at the top.',
        data: 'A tariff diagram with world price, domestic price, the quantity gap and the revenue rectangle labelled; the tariff rate from the article used in the reasoning; evaluation covering domestic producers, consumers, the exporting country and the possibility of retaliation.',
        watchOut: 'The commonest failure is a diagram whose areas are labelled but never referred to — the revenue rectangle has to appear in the sentences, not only on the figure. Check the article is a news report and not an opinion column arguing against tariffs, because a source that already contains the analysis leaves the student paraphrasing.',
        context: 'global-economy'
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
const byRubric = topicExemplars.find(e => e.rubricId === rubricId)
  if (byRubric) return byRubric.exemplars
  const sameRubric = topicExemplars.filter(e => e.rubricId === rubricId)
  return sameRubric.flatMap(e => e.exemplars).slice(0, 3)
}