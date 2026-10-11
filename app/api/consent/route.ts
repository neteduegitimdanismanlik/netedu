import { NextResponse } from 'next/server'
import { callerId, unauthorized } from '@/lib/api-auth'
import { consentAdmin, sendParentEmail } from '@/lib/consent'
import { NOTICE_VERSION, MIN_AGE, ADULT_AGE, ageOn } from '@/lib/consent-shared'

/**
 * Records consent for a signed-in user: existing accounts created before
 * consent existed, and everyone again whenever NOTICE_VERSION changes.
 * (New sign-ups get their row from the database trigger instead.)
 *
 * Body: { noticeAccepted, marketing, improvement, birthDate?, parentEmail? }
 */
export async function POST(req: Request) {
  const userId = await callerId(req)
  if (!userId) return unauthorized()

  const b = await req.json().catch(() => ({}))
  if (b?.noticeAccepted !== true) {
    return NextResponse.json({ error: 'Accepting the Privacy Notice and Terms of Use is required.' }, { status: 400 })
  }

  const db = consentAdmin()
  const now = new Date().toISOString()
  const optIns = { marketing_opt_in: b.marketing === true, improvement_opt_in: b.improvement === true }

  const { data: existing } = await db.from('consents').select('user_id').eq('user_id', userId).maybeSingle()

  if (existing) {
    const { error } = await db
      .from('consents')
      .update({ notice_version: NOTICE_VERSION, notice_accepted_at: now, ...optIns })
      .eq('user_id', userId)
    if (error) return NextResponse.json({ error: 'Could not save. Try again.' }, { status: 500 })
    return NextResponse.json({ ok: true, minor: false })
  }

  const birthDate = String(b.birthDate ?? '')
  const age = ageOn(birthDate)
  if (Number.isNaN(age) || age > 100) {
    return NextResponse.json({ error: 'Check your date of birth.' }, { status: 400 })
  }
  if (age < MIN_AGE) {
    return NextResponse.json({ error: `You need to be at least ${MIN_AGE} to use NetEdu.` }, { status: 400 })
  }

  const minor = age < ADULT_AGE
  const parentEmail = String(b.parentEmail ?? '').trim().toLowerCase()
  if (minor) {
    const { data: u } = await db.auth.admin.getUserById(userId)
    const own = (u?.user?.email ?? '').toLowerCase()
    if (!/^\S+@\S+\.\S+$/.test(parentEmail) || parentEmail === own) {
      return NextResponse.json({ error: "Enter your parent's e-mail (different from yours)." }, { status: 400 })
    }
  }

  const { error } = await db.from('consents').insert({
    user_id: userId,
    birth_date: birthDate,
    notice_version: NOTICE_VERSION,
    notice_accepted_at: now,
    ...optIns,
    parent_email: minor ? parentEmail : null,
  })
  if (error) return NextResponse.json({ error: 'Could not save. Try again.' }, { status: 500 })

  if (minor) {
    const r = await sendParentEmail(userId)
    return NextResponse.json({ ok: true, minor: true, parentEmailSent: r.status === 200 })
  }
  return NextResponse.json({ ok: true, minor: false })
}
