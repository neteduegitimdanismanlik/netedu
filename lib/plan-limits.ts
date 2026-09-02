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

/** Free sees three matched universities out of the six the model returns. */
export const FREE_UNIVERSITY_MATCHES = 3

/** Checker runs per day for a Pro student. Not advertised anywhere. */
export const DAILY_CHECKS = 3

/** CAS projects a student may ask to join per day. Not advertised either. */
export const DAILY_JOIN_LIMIT = 2
