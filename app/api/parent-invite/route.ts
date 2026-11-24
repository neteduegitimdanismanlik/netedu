import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { requireUser, admin } from '@/lib/plan'
import { SITE_URL, MAIL_FROM, MAIL_REPLY_TO, escapeHtml } from '@/lib/email-config'

/**
 * E-mails a parent the student has just invited from their dashboard (the
 * dashboard has already written the parent_links row).
 *
 * It used to go to the company inbox for someone to forward by hand, because
 * the only sender available — onboarding@resend.dev — can't reach anyone
 * else. With neteduapp.com verified in Resend it goes to the parent directly.
 *
 * Signed-in students only; the address is checked, and the student must
 * actually have a link to it, so this can't be used to mail arbitrary people.
 */

const INVITES_PER_DAY = 5

export async function POST(req: Request) {
  try {
    const gate = await requireUser(req)
    if (gate instanceof NextResponse) return gate

    const { parentEmail } = await req.json()
    const email = typeof parentEmail === 'string' ? parentEmail.trim().toLowerCase() : ''
    if (!email || email.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Enter a valid e-mail address.' }, { status: 400 })
    }

    const { data: link } = await admin
      .from('parent_links')
      .select('student_id')
      .eq('student_id', gate.userId)
      .eq('parent_email', email)
      .maybeSingle()
    if (!link) return NextResponse.json({ error: 'Invite this parent from your dashboard first.' }, { status: 400 })

    const since = new Date()
    since.setUTCHours(0, 0, 0, 0)
    const { count } = await admin
      .from('feature_usage')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', gate.userId)
      .eq('feature', 'parent-invite')
      .gte('created_at', since.toISOString())
    if ((count ?? 0) >= INVITES_PER_DAY) {
      return NextResponse.json({ error: "You've sent today's invites. Try again tomorrow." }, { status: 429 })
    }

    const { data: u } = await admin.auth.admin.getUserById(gate.userId)
    const student = escapeHtml(u?.user?.email ?? 'Your child')
    const signup = `${SITE_URL}/auth`
    const panel = `${SITE_URL}/parent`
    const safeParent = escapeHtml(email)

    const resend = new Resend(process.env.RESEND_API_KEY)
    const { error } = await resend.emails.send({
      from: MAIL_FROM,
      replyTo: MAIL_REPLY_TO,
      to: email,
      subject: 'NetEdu: Veli paneline davet / You are invited to the parent panel',
      html: `
        <p>Merhaba,</p>
        <p><strong>${student}</strong> sizi NetEdu veli paneline davet etti. Panelde çocuğunuzun üniversite hedeflerini, portfolyosunu ve yol haritasını görebilir, yapay zekâ danışmana sorular sorabilirsiniz.</p>
        <p>1. <a href="${signup}">NetEdu'ya bu e-posta adresiyle kaydolun</a> (<strong>${safeParent}</strong>)</p>
        <p>2. Ardından <a href="${panel}">veli paneline</a> girin.</p>
        <p>Bu davetten haberiniz yoksa bu e-postayı dikkate almayın.</p>
        <hr/>
        <p>Hello,</p>
        <p><strong>${student}</strong> has invited you to the NetEdu parent panel, where you can follow their university targets, portfolio and roadmap, and ask our AI advisor questions.</p>
        <p>1. <a href="${signup}">Sign up to NetEdu with this e-mail address</a> (<strong>${safeParent}</strong>)</p>
        <p>2. Then open the <a href="${panel}">parent panel</a>.</p>
        <p>If you weren't expecting this, you can ignore this e-mail.</p>
        <p>NetEdu</p>`,
    })
    if (error) return NextResponse.json({ error: 'The invite e-mail could not be sent. Try again later.' }, { status: 502 })

    await admin.from('feature_usage').insert({ user_id: gate.userId, feature: 'parent-invite' })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
