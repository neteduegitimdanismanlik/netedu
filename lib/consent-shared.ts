/**
 * Consent constants shared by the browser and the server. Imports nothing.
 *
 * NOTICE_VERSION is the version of the Privacy Notice + Terms a user agreed
 * to. Bump it whenever either text changes materially: every signed-in user
 * is then sent to /consent once to accept the new version.
 */
export const NOTICE_VERSION = '2026-10-v1'

/** Nobody younger than this may hold an account. */
export const MIN_AGE = 13

/** Below this, a parent must approve before work can be uploaded for AI feedback. */
export const ADULT_AGE = 18

/** Whole years between a YYYY-MM-DD birth date and `now` (UTC). NaN for bad input. */
export function ageOn(birthDate: string, now: Date = new Date()): number {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) return NaN
  const b = new Date(`${birthDate}T00:00:00Z`)
  if (Number.isNaN(b.getTime())) return NaN
  let age = now.getUTCFullYear() - b.getUTCFullYear()
  const m = now.getUTCMonth() - b.getUTCMonth()
  if (m < 0 || (m === 0 && now.getUTCDate() < b.getUTCDate())) age--
  return age
}

export const CONTACT_EMAIL = 'neteduegitimdanismanlik@gmail.com'
