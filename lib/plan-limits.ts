/**
 * The numbers behind Free and Pro, in one place.
 *
 * This file deliberately imports nothing, so both server routes and client
 * components can read the same constants — a browser bundle cannot pull in
 * lib/plan.ts, which carries the service_role client.
 *
 * Changing a number here changes both the limit that is enforced and the lock
 * the student sees, so the two can never drift apart.
 */

/** Free sees the first two periods of year one of the roadmap. */
export const FREE_ROADMAP_PERIODS = 2

/**
 * Free sees three matched universities — one Reach, one Match, one Safety
 * where each exists (see shortlist() in app/universities/match.ts). The
 * full list is computed from the requirements tables, not a model, and the
 * withheld rows never leave the server.
 */
export const FREE_UNIVERSITY_MATCHES = 3

/**
 * The two roadmap features each make a paid Anthropic call per use, so Free
 * gets one of each per day (Pro and 'unlimited' are not counted):
 *  - the profile analysis built at the end of onboarding (/api/roadmap)
 *  - building the long-term roadmap's first year (/api/full-roadmap)
 */
export const FREE_DAILY_PROFILE_ANALYSES = 1
export const FREE_DAILY_ROADMAP_BUILDS = 1

/** Checker runs per day for a Pro student. Not advertised anywhere. */
export const DAILY_CHECKS = 3

/** CAS projects a student may ask to join per day. Not advertised either. */
export const DAILY_JOIN_LIMIT = 2

/** Mock Interview sessions a Pro student may start per day. Not advertised. */
export const DAILY_INTERVIEWS = 3

/** Individual Oral prep briefings a Pro student may request per day. Not advertised. */
export const DAILY_ORAL_PREPS = 3

/**
 * Pro monthly allowances — the ceiling on what one Pro student can cost in
 * model calls in a month (≈ $8 at today's prices if every one is used up).
 *
 * Deliberately NOT shown on the pricing page. A student meets them only when
 * one runs out: the route answers 429 with `renew: true`, and RenewGate (in
 * app/layout.tsx) opens a "renew your package" window. Renewing resets every
 * counter at once — see allowancePeriodStart() in lib/plan.ts and
 * sql/quota-resets.sql.
 *
 * The daily limits above still apply on top, so a month can't be spent in an
 * afternoon. 'unlimited' accounts are never counted.
 */
export const PRO_MONTHLY_CHECKS = 20
export const PRO_MONTHLY_INTERVIEWS = 10
export const PRO_MONTHLY_ORAL_PREPS = 10
/** Recording reviews — twice the briefings, so a student can retake a recording. */
export const PRO_MONTHLY_ORAL_REVIEWS = 20
export const PRO_MONTHLY_TOPIC_SEARCHES = 20
export const PRO_MONTHLY_PROFILE_ANALYSES = 10
export const PRO_MONTHLY_ROADMAP_BUILDS = 10
/**
 * A full roadmap is built one school year per call (up to four calls), and
 * later years can be requested on their own — so the calls themselves are
 * capped too, at four per allowed build.
 */
export const PRO_MONTHLY_ROADMAP_YEARS = 40
