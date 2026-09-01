/**
 * Privacy rules for the CAS collaboration area.
 *
 * Two things happen here, and both exist because the people using this area
 * are school students, some of them minors, talking to strangers:
 *
 *   1. Nobody's real name ever reaches another student's browser. The API
 *      resolves a user id to initials on the server and sends only that.
 *   2. When a message looks like it is handing out a phone number, an e-mail
 *      or a social handle, the sender is warned once before it is posted.
 *      The message is NOT blocked — students do legitimately need to organise
 *      real-world activities — but it is flagged so it can be reviewed.
 */

const NAME_KEYS = ['full_name', 'name', 'display_name', 'student_name']

/** "Buket Semercioglu" -> "B.S."  ·  unknown -> "S." */
export function initialsFrom(
  profile: Record<string, unknown> | null | undefined,
  email?: string | null
): string {
  let raw = ''

  if (profile) {
    for (const key of NAME_KEYS) {
      const v = profile[key]
      if (typeof v === 'string' && v.trim()) {
        raw = v.trim()
        break
      }
    }
    if (!raw) {
      const first = typeof profile.first_name === 'string' ? profile.first_name : ''
      const last = typeof profile.last_name === 'string' ? profile.last_name : ''
      raw = `${first} ${last}`.trim()
    }
  }

  // Last resort: the local part of the e-mail, which the student chose themselves.
  if (!raw && email) raw = email.split('@')[0].replace(/[._\-0-9]+/g, ' ').trim()

  const parts = raw.split(/\s+/).filter(Boolean).slice(0, 2)
  if (parts.length === 0) return 'S.'
  return parts.map((p) => `${p[0].toUpperCase()}.`).join('')
}

export type ContactHit = 'email' | 'phone' | 'platform' | 'link' | 'handle'

const PLATFORM_WORDS = [
  'whatsapp', 'whats app', 'wp num', 'telegram', 'instagram', 'insta',
  'snapchat', 'snap ', 'discord', 'tiktok', 'signal app', 'messenger',
]

/**
 * Looks for contact details a student might be handing over.
 * Deliberately conservative on phone numbers — a date or a headcount must
 * not trigger it — so the threshold is nine digits inside one run.
 */
export function detectContactDetails(text: string): ContactHit[] {
  const hits = new Set<ContactHit>()
  const lower = text.toLowerCase()

  // E-mail, including the "name (at) domain" dodge.
  if (/[a-z0-9._%+-]+\s*(@|\(at\)|\[at\]|\sat\s)\s*[a-z0-9.-]+\s*(\.|\(dot\)|\[dot\])\s*[a-z]{2,}/i.test(text)) {
    hits.add('email')
  }

  // Phone: one run of digits and separators holding at least nine digits.
  const phoneRun = text.match(/\+?\d[\d\s().\-]{7,}\d/)
  if (phoneRun && (phoneRun[0].match(/\d/g) || []).length >= 9) {
    hits.add('phone')
  }

  if (PLATFORM_WORDS.some((w) => lower.includes(w))) hits.add('platform')

  if (/https?:\/\/|www\.[a-z0-9-]+\.[a-z]{2,}/i.test(text)) hits.add('link')

  // A social handle: @something, but not the local part of an e-mail.
  if (!hits.has('email') && /(^|\s)@[a-z0-9._]{3,}/i.test(text)) hits.add('handle')

  return [...hits]
}

const HIT_LABELS: Record<ContactHit, string> = {
  email: 'an e-mail address',
  phone: 'a phone number',
  platform: 'another messaging app',
  link: 'an external link',
  handle: 'a social media handle',
}

/** The one-time warning shown before a flagged message is posted. */
export function contactWarning(hits: ContactHit[]): string {
  const what = hits.map((h) => HIT_LABELS[h])
  const list =
    what.length === 1
      ? what[0]
      : `${what.slice(0, -1).join(', ')} and ${what[what.length - 1]}`
  return (
    `This message looks like it contains ${list}. ` +
    `Conversations that leave NetEdu are not protected by us — we cannot see them, ` +
    `moderate them or help if something goes wrong. Send it only if you are sure.`
  )
}
