import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { parentName, parentEmail, studentName, planName, price, billing } = await req.json()

    await resend.emails.send({
      from: 'NetEdu <onboarding@resend.dev>',
      to: 'neteduegitimdanismanlik@gmail.com',
      subject: `Payment Request: ${studentName} wants ${planName} plan (for ${parentEmail})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1e1b4b; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">NetEdu</h1>
          </div>
          <div style="background: #f9fafb; padding: 32px; border-radius: 0 0 12px 12px;">
            <h2 style="color: #111827; margin-top: 0;">Hi ${parentName}! 👋</h2>
            <p style="color: #4b5563; line-height: 1.6;">
              <strong>${studentName}</strong> is using NetEdu to plan their path to their dream university — and they'd like to upgrade to the <strong>${planName}</strong> plan.
            </p>
            
            <div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px;">${planName} Plan</p>
              <p style="font-size: 36px; font-weight: bold; color: #1e1b4b; margin: 0;">
                $${price}<span style="font-size: 16px; color: #9ca3af;">/month</span>
              </p>
              <p style="color: #6b7280; font-size: 12px; margin: 8px 0 0;">Billed ${billing}</p>
            </div>

            <p style="color: #4b5563; line-height: 1.6; font-size: 14px;">
              <strong>What ${studentName} gets with ${planName}:</strong><br/>
              Personalized university roadmaps, AI-powered matching, portfolio building, and expert guidance tools — everything they need to reach their dream university.
            </p>

            <div style="background: #eef2ff; border: 1px solid #c7d2fe; border-radius: 12px; padding: 16px; margin: 24px 0;">
              <p style="color: #3730a3; font-size: 14px; margin: 0;">
                💳 <strong>To complete the payment:</strong> Reply to this email or contact us at neteduegitimdanismanlik@gmail.com. Our payment system is launching soon — early supporters get special pricing!
              </p>
            </div>

            <p style="color: #9ca3af; font-size: 12px; margin-top: 32px;">
              This request was sent by ${studentName} via netedu.vercel.app. Parent email: ${parentEmail}
            </p>
          </div>
        </div>
      `
    })

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}