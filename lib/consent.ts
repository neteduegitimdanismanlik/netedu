import { NextResponse } from 'next/server'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { ADULT_AGE, ageOn, NOTICE_VERSION } from './consent-shared'

/**
 * Server-only consent helpers. Never import this from a client component —
 * it builds the service_role client.
 *
 * Two levels of gate:
 *   - 'account': the user has accepted the Privacy Notice at all.
 *     Required for every signed-in API call (requireUser in lib/plan.ts).
 *   - 'content': on top of that, a minor's parent has approved.
 *     Required wherever a student's own work goes to Anthropic
 *     (requirePro in lib/plan.ts, plus /api/portfolio POST).
 */

let client: SupabaseClient | null = null

/** Built lazily so a route that merely imports this file never crashes the build. */
export function consentAdmin(): SupabaseClient {
  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )
  }
  return client
}

export type ConsentStatus = 'ok' | 'missing' | 'awaiting_parent'

export async function consentStatus(userId: string): Promise<ConsentStatus> {
  const { data } = await consentAdmin()
    .from('consents')
    .select('birth_date, parent_approved_at')
    .eq('user_id', userId)
    .maybeSingle()
  if (!data) return 'missing'
  if (ageOn(String(data.birth_date)) < ADULT_AGE && !data.parent_approved_at) return 'awaiting_parent'
  return 'ok'
}

const MESSAGES: Record<Exclude<ConsentStatus, 'ok'>, string> = {
  missing:
    'Please accept the Privacy Notice first. Reload the page and the consent screen will open.',
  awaiting_parent:
    "Waiting for your parent's approval. Uploading work for AI feedback unlocks as soon as they approve the email we sent them.",
}

/**
 * null when the user may go on, otherwise a ready-made 403.
 *
 *   const blocked = await consentGate(userId, 'content')
 *   if (blocked) return blocked
 */
export async function consentGate(
  userId: string,
  level: 'account' | 'content'
): Promise<NextResponse | null> {
  const status = await consentStatus(userId)
  if (status === 'missing' || (level === 'content' && status === 'awaiting_parent')) {
    return NextResponse.json({ error: MESSAGES[status], consent: status }, { status: 403 })
  }
  return null
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://netedu.vercel.app'
// onboarding@resend.dev only delivers to the Resend account owner. Parents
// receive nothing until a domain is verified in Resend and RESEND_FROM is set.
const FROM = process.env.RESEND_FROM || 'NetEdu <onboarding@resend.dev>'
const RESEND_COOLDOWN_MS = 10 * 60 * 1000

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
}

/** Sends (or re-sends) the parent approval link for this student. */
export async function sendParentEmail(
  userId: string
): Promise<{ status: number; body: Record<string, unknown> }> {
  const db = consentAdmin()
  const { data: c } = await db
    .from('consents')
    .select('parent_email, parent_token, parent_email_sent_at, parent_approved_at')
    .eq('user_id', userId)
    .maybeSingle()

  if (!c?.parent_email) {
    return { status: 404, body: { error: 'No parent e-mail on file for this account.' } }
  }
  if (c.parent_approved_at) return { status: 200, body: { ok: true, alreadyApproved: true } }
  if (
    c.parent_email_sent_at &&
    Date.now() - new Date(c.parent_email_sent_at).getTime() < RESEND_COOLDOWN_MS
  ) {
    return {
      status: 429,
      body: { error: 'We sent the e-mail a few minutes ago. You can resend it in 10 minutes.' },
    }
  }

  const { data: u } = await db.auth.admin.getUserById(userId)
  const student = escapeHtml(u?.user?.email ?? '')
  const link = `${APP_URL}/parent-consent/${c.parent_token}`

  // Constructed here, not at module level, so a missing key never breaks the build.
  const resend = new Resend(process.env.RESEND_API_KEY)
  const { error } = await resend.emails.send({
    from: FROM,
    to: c.parent_email,
    subject: 'NetEdu: Çocuğunuzun hesabı için onayınız gerekiyor / Your approval is needed',
    html: `
      <p>Merhaba,</p>
      <p><strong>${student}</strong> adresiyle NetEdu'ya kayıt olundu ve veli olarak sizin e-posta adresiniz verildi.</p>
      <p>NetEdu, IB öğrencilerine üniversite başvurusu ve ödevlerinde rehberlik eden bir platformdur. Öğrencinin yazdığı metinlere yapay zekâ ile kriter bazlı geri bildirim verir; öğrenci yerine ödev yazmaz. 18 yaşından küçük kullanıcıların metin yükleyebilmesi için veli onayı istiyoruz.</p>
      <p><a href="${link}">Bilgilendirmeyi okuyup onay vermek için tıklayın</a></p>
      <p>Bu kayıttan haberiniz yoksa onay vermeyin; bu e-postayı yanıtlamanız yeterli, hesabı sileriz.</p>
      <hr/>
      <p>Hello,</p>
      <p>Someone signed up to NetEdu as <strong>${student}</strong> and gave your address as their parent's.</p>
      <p>NetEdu guides IB students through university applications and coursework, and gives AI feedback on the student's own writing against IB criteria. It never writes work for them. Students under 18 need a parent's approval before they can upload work.</p>
      <p><a href="${link}">Read the details and approve</a></p>
      <p>If you don't know about this sign-up, don't approve — just reply to this e-mail and we will delete the account.</p>
      <p>NetEdu</p>`,
  })
  if (error) return { status: 502, body: { error: 'The e-mail could not be sent. Try again later.' } }

  await db
    .from('consents')
    .update({ parent_email_sent_at: new Date().toISOString() })
    .eq('user_id', userId)

  return { status: 200, body: { ok: true } }
}

export { NOTICE_VERSION }
