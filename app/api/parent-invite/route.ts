import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { parentEmail, studentName } = await req.json()

    await resend.emails.send({
      from: 'NetEdu <onboarding@resend.dev>',
      to: 'neteduegitimdanismanlik@gmail.com',
      subject: `Parent invite for: ${parentEmail}`,
      html: `
        <h2>New Parent Invitation</h2>
        <p>A student has invited <strong>${parentEmail}</strong> to join NetEdu as a parent.</p>
        <hr/>
        <p>Please forward this email to ${parentEmail} or share this link:</p>
        <p><a href="https://netedu.vercel.app/auth">netedu.vercel.app/auth</a></p>
        <p>They need to create an account with email: <strong>${parentEmail}</strong></p>
        <p>Then visit: <a href="https://netedu.vercel.app/parent">netedu.vercel.app/parent</a></p>
      `
    })

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}