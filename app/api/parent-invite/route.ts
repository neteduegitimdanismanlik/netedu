import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { requireUser } from '@/lib/plan'

const resend = new Resend(process.env.RESEND_API_KEY)
const SITE = 'https://neteduapp.com'

/** The address goes into an HTML e-mail — never insert it unescaped. */
function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
}

/**
 * Tells the team a student has invited a parent. Used to be callable by
 * anyone, signed in or not — an open way to send mail into the company inbox
 * with arbitrary HTML in it. Now: signed-in students only, a plausible
 * address, and the address escaped before it goes into the e-mail.
 */
export async function POST(req: Request) {
  try {
    const gate = await requireUser(req)
    if (gate instanceof NextResponse) return gate

    const { parentEmail } = await req.json()
    if (typeof parentEmail !== 'string' || parentEmail.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parentEmail)) {
      return NextResponse.json({ error: 'Enter a valid e-mail address.' }, { status: 400 })
    }
    const safe = escapeHtml(parentEmail)

    await resend.emails.send({
      from: 'NetEdu <onboarding@resend.dev>',
      to: 'neteduegitimdanismanlik@gmail.com',
      subject: `Parent invite for: ${parentEmail}`,
      html: `
        <h2>New Parent Invitation</h2>
        <p>A student has invited <strong>${safe}</strong> to join NetEdu as a parent.</p>
        <hr/>
        <p>Please forward this email to ${safe} or share this link:</p>
        <p><a href="${SITE}/auth">neteduapp.com/auth</a></p>
        <p>They need to create an account with email: <strong>${safe}</strong></p>
        <p>Then visit: <a href="${SITE}/parent">neteduapp.com/parent</a></p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
