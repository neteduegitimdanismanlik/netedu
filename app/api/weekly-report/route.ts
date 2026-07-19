import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET(req: Request) {
  try {
    const { data: links } = await supabase
      .from('parent_links')
      .select('*')
      .eq('status', 'accepted')

    if (!links || links.length === 0) {
      return NextResponse.json({ message: 'No parent links found' })
    }

    let sent = 0

    for (const link of links) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', link.student_id)
        .single()

      if (!profile) continue

      const { data: items } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('user_id', link.student_id)

      const approved = items?.filter(i => i.status === 'approved').length || 0
      const pending = items?.filter(i => i.status === 'pending').length || 0
      const total = items?.length || 0

      const { data: score } = await supabase
        .from('identity_scores')
        .select('*')
        .eq('user_id', link.student_id)
        .single()

      let aiSummary = ''
      try {
        const aiRes = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.ANTHROPIC_API_KEY!,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-6',
            max_tokens: 300,
            messages: [{
              role: 'user',
              content: `Write a warm 3-4 sentence progress summary for a parent about their child's university preparation. Student data: Grade ${profile.grade}, GPA ${profile.gpa}, Target: ${profile.target_university} (${profile.target_department}), Portfolio: ${total} items (${approved} approved), Identity Score: ${score?.total_score || 0}/100. Include one specific suggestion for what the student should focus on. Write in English, address the parent directly. IMPORTANT: Write in PLAIN TEXT only. No markdown, no headers, no asterisks, no tables, no bullet points. Just 3-4 flowing sentences.`
            }]
          })
        })
        const aiData = await aiRes.json()
        aiSummary = aiData.content?.[0]?.text || ''
      } catch (e) {
        aiSummary = 'Your child continues their university preparation journey on NetEdu.'
      }

      await resend.emails.send({
        from: 'NetEdu <onboarding@resend.dev>',
        to: 'neteduegitimdanismanlik@gmail.com',
        subject: `📊 NetEdu Report for ${link.parent_email}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #1e1b4b; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 22px;">NetEdu Report</h1>
              <p style="color: #a5b4fc; font-size: 13px; margin: 8px 0 0;">For parent: ${link.parent_email}</p>
            </div>
            <div style="background: #f9fafb; padding: 32px; border-radius: 0 0 12px 12px;">
              
              <div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin-bottom: 16px;">
                <h3 style="margin: 0 0 12px; color: #111827; font-size: 16px;">📚 Student Overview</h3>
                <table style="width: 100%; font-size: 14px; color: #4b5563;">
                  <tr><td style="padding: 4px 0;">Grade:</td><td style="text-align: right; font-weight: bold;">${profile.grade || '—'}</td></tr>
                  <tr><td style="padding: 4px 0;">GPA:</td><td style="text-align: right; font-weight: bold;">${profile.gpa || '—'}</td></tr>
                  <tr><td style="padding: 4px 0;">Target:</td><td style="text-align: right; font-weight: bold;">${profile.target_university || '—'}</td></tr>
                  <tr><td style="padding: 4px 0;">Department:</td><td style="text-align: right; font-weight: bold;">${profile.target_department || '—'}</td></tr>
                </table>
              </div>

              <div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin-bottom: 16px;">
                <h3 style="margin: 0 0 12px; color: #111827; font-size: 16px;">📁 Portfolio Progress</h3>
                <table style="width: 100%; font-size: 14px; color: #4b5563;">
                  <tr><td style="padding: 4px 0;">Total items:</td><td style="text-align: right; font-weight: bold;">${total}</td></tr>
                  <tr><td style="padding: 4px 0;">✅ Approved:</td><td style="text-align: right; font-weight: bold; color: #059669;">${approved}</td></tr>
                  <tr><td style="padding: 4px 0;">⏳ Pending:</td><td style="text-align: right; font-weight: bold; color: #d97706;">${pending}</td></tr>
                  <tr><td style="padding: 4px 0;">🏆 Identity Score:</td><td style="text-align: right; font-weight: bold; color: #1e1b4b;">${score?.total_score || 0}/100</td></tr>
                </table>
              </div>

              <div style="background: #eef2ff; border: 1px solid #c7d2fe; border-radius: 12px; padding: 20px;">
                <h3 style="margin: 0 0 12px; color: #3730a3; font-size: 16px;">💬 Progress Summary</h3>
                <p style="color: #4338ca; font-size: 14px; line-height: 1.6; margin: 0;">${aiSummary}</p>
              </div>

              <div style="text-align: center; margin-top: 24px;">
                <a href="https://netedu.vercel.app/parent" style="background: #1e1b4b; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-size: 14px;">
                  View Full Parent Panel →
                </a>
              </div>

              <p style="color: #9ca3af; font-size: 11px; margin-top: 24px; text-align: center;">
                You receive this report because your child added you on NetEdu.
              </p>
            </div>
          </div>
        `
      })
      sent++
    }

    return NextResponse.json({ success: true, reportsSent: sent })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}