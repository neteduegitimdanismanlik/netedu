'use client'
import Link from 'next/link'
import { NOTICE_VERSION, MIN_AGE, ADULT_AGE, ageOn } from '@/lib/consent-shared'

export interface ConsentValue {
  birthDate: string
  parentEmail: string
  noticeAccepted: boolean
  marketing: boolean
  improvement: boolean
}

export const emptyConsent: ConsentValue = {
  birthDate: '',
  parentEmail: '',
  noticeAccepted: false,
  marketing: false,
  improvement: false,
}

export function isMinor(v: ConsentValue): boolean {
  const age = ageOn(v.birthDate)
  return !Number.isNaN(age) && age < ADULT_AGE
}

/** An error message, or null when the form can be submitted. */
export function validateConsent(
  v: ConsentValue,
  studentEmail: string,
  opts: { checkboxesOnly?: boolean } = {}
): string | null {
  if (!opts.checkboxesOnly) {
    const age = ageOn(v.birthDate)
    if (!v.birthDate) return 'Enter your date of birth.'
    if (Number.isNaN(age) || age > 100) return 'Check your date of birth.'
    if (age < MIN_AGE) return `You need to be at least ${MIN_AGE} to use NetEdu.`
    if (age < ADULT_AGE) {
      const pe = v.parentEmail.trim().toLowerCase()
      if (!/^\S+@\S+\.\S+$/.test(pe)) return "Enter your parent's e-mail address."
      if (pe === studentEmail.trim().toLowerCase()) return "Your parent's e-mail must be different from yours."
    }
  }
  if (!v.noticeAccepted) return 'Tick the box to confirm you have read the Privacy Notice and Terms of Use.'
  return null
}

/** Goes into supabase.auth.signUp({ options: { data } }); the database trigger turns it into a consents row. */
export function consentMetadata(v: ConsentValue) {
  return {
    birth_date: v.birthDate,
    notice_accepted: v.noticeAccepted,
    notice_version: NOTICE_VERSION,
    marketing_opt_in: v.marketing,
    improvement_opt_in: v.improvement,
    parent_email: isMinor(v) ? v.parentEmail.trim().toLowerCase() : '',
  }
}

const input =
  'w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white'

export default function ConsentFields({
  value,
  onChange,
  showBirth = true,
}: {
  value: ConsentValue
  onChange: (v: ConsentValue) => void
  /** false for users whose birth date is already on file: only the checkboxes are shown. */
  showBirth?: boolean
}) {
  const set = (patch: Partial<ConsentValue>) => onChange({ ...value, ...patch })
  const minor = showBirth && isMinor(value)
  const today = new Date().toISOString().slice(0, 10)

  return (
    <div className="flex flex-col gap-4">
      {showBirth && (
        <div>
          <label htmlFor="birth-date" className="block text-sm font-medium text-gray-700 mb-1">Date of birth</label>
          <input
            id="birth-date"
            type="date"
            max={today}
            value={value.birthDate}
            onChange={(e) => set({ birthDate: e.target.value })}
            className={input}
          />
        </div>
      )}

      {minor && (
        <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
          <label htmlFor="parent-email" className="block text-sm font-medium text-gray-700 mb-1">Parent&apos;s e-mail</label>
          <input
            id="parent-email"
            type="email"
            value={value.parentEmail}
            onChange={(e) => set({ parentEmail: e.target.value })}
            placeholder="parent@email.com"
            className={input}
          />
          <p className="mt-2 text-xs text-gray-600 leading-relaxed">
            You&apos;re under 18, so we&apos;ll ask a parent to approve your account. You can set up your
            profile straight away; uploading work for AI feedback unlocks once they approve.
          </p>
        </div>
      )}

      <div className={`flex flex-col gap-3 ${showBirth ? 'border-t border-gray-100 pt-4' : ''}`}>
        <label className="flex items-start gap-2.5 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={value.noticeAccepted}
            onChange={(e) => set({ noticeAccepted: e.target.checked })}
            className="mt-0.5 h-4 w-4 accent-indigo-900"
          />
          <span>
            I have read the{' '}
            <Link href="/privacy" target="_blank" className="text-indigo-700 underline">Privacy Notice (KVKK Aydınlatma Metni)</Link>
            {' '}and accept the{' '}
            <Link href="/terms" target="_blank" className="text-indigo-700 underline">Terms of Use</Link>.
            <span className="text-gray-400"> Required</span>
          </span>
        </label>

        <label className="flex items-start gap-2.5 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={value.marketing}
            onChange={(e) => set({ marketing: e.target.checked })}
            className="mt-0.5 h-4 w-4 accent-indigo-900"
          />
          <span>
            Send me e-mails about new features and offers.
            <span className="text-gray-400"> Optional</span>
          </span>
        </label>

        <label className="flex items-start gap-2.5 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={value.improvement}
            onChange={(e) => set({ improvement: e.target.checked })}
            className="mt-0.5 h-4 w-4 accent-indigo-900"
          />
          <span>
            NetEdu may use my uploaded texts, with anything that identifies me removed, to improve its feedback.
            <span className="text-gray-400"> Optional</span>
          </span>
        </label>
      </div>
    </div>
  )
}
