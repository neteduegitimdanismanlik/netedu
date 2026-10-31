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
