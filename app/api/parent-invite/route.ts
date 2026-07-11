import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { parentEmail, studentName } = await req.json()

    await resend.emails.send({
      from: 'NetEdu <onboarding@resend.dev>',
      to: parentEmail,
      subject: 'You have been invited to track your child on NetEdu',
      html: `
        <h2>You have been invited to NetEdu! 🎓</h2>
        <p>Your child has invited you to track their university journey on NetEdu.</p>
        <p>NetEdu helps students plan their path to top universities with personalized roadmaps and AI guidance.</p>
        <hr/>
        <p>To access the parent panel:</p>
        <ol>
          <li>Go to <a href="https://netedu.vercel.app/auth">netedu.vercel.app/auth</a></li>
          <li>Create an account with this email address (${parentEmail})</li>
          <li>Visit <a href="https://netedu.vercel.app/parent">netedu.vercel.app/parent</a></li>
        </ol>
        <p>You will be able to:</p>
        <ul>
          <li>See your child's profile and roadmap</li>
          <li>Track portfolio progress</li>
          <li>Ask AI questions about their university journey</li>
          <li>Receive weekly progress updates</li>
        </ul>
        <br/>
        <a href="https://netedu.vercel.app/auth" style="background:#1a1a6e;color:white;padding:12px 24px;border-radius:8px;text-decoration:none">
          Access Parent Panel →
        </a>
      `
    })

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}