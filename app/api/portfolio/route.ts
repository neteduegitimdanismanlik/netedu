import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, type, description, userId, fileUrl } = body

    const prompt = `You are an academic portfolio evaluator for university admissions. Score this student submission out of 100.

Item: "${title}"
Type: ${type}
Description: "${description}"

Scoring criteria (total 100 points):
- Relevance to university applications (0-30): How relevant is this to academic/career goals?
- Impact & significance (0-25): What was the real-world impact or significance?
- Difficulty & effort (0-25): How challenging was this achievement?
- Quality of evidence (0-20): How well documented and verifiable is this?

Return JSON only, no markdown:
{
  "score": <total 0-100>,
  "relevance": <0-30>,
  "impact": <0-25>,
  "difficulty": <0-25>,
  "evidence": <0-20>,
  "category": "<Academic|Leadership|Project|Social Impact|Research>",
  "feedback": "<2-3 sentence constructive feedback>",
  "strengths": "<what is strong>",
  "improvements": "<what could be improved>"
}`

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 500,
        messages: [{ role: 'user', content: prompt }]
      })
    })

    const data = await res.json()
    let text = data.content?.[0]?.text || '{}'
    text = text.replace(/```json/g, '').replace(/```/g, '').trim()
    const analysis = JSON.parse(text)

    const { data: item, error } = await supabase
      .from('portfolio_items')
      .insert({
        user_id: userId,
        title,
        type,
        description,
        file_url: fileUrl,
        ai_score: analysis.score,
        ai_category: analysis.category,
        ai_feedback: analysis.feedback,
        status: 'pending'
      })
      .select()
      .single()

    if (error) throw error

    const { data: existing } = await supabase
      .from('identity_scores')
      .select('*')
      .eq('user_id', userId)
      .single()

    const scoreField = analysis.category === 'Academic' ? 'academic_score'
      : analysis.category === 'Leadership' ? 'leadership_score'
      : analysis.category === 'Project' ? 'project_score'
      : 'social_score'

    if (existing) {
      const newScore = Math.min(100, (existing[scoreField] || 0) + Math.floor(analysis.score / 10))
      const total = Math.floor((newScore + existing.academic_score + existing.leadership_score + existing.project_score + existing.social_score) / 4)
      await supabase.from('identity_scores').update({
        [scoreField]: newScore,
        total_score: total,
        updated_at: new Date().toISOString()
      }).eq('user_id', userId)
    } else {
      await supabase.from('identity_scores').insert({
        user_id: userId,
        [scoreField]: Math.floor(analysis.score / 10),
        total_score: Math.floor(analysis.score / 10)
      })
    }

    try {
      await resend.emails.send({
        from: 'NetEdu <onboarding@resend.dev>',
        to: 'neteduegitimdanismanlik@gmail.com',
        subject: `New Portfolio Item: ${title}`,
        html: `
          <h2>New Portfolio Submission</h2>
          <p><strong>Title:</strong> ${title}</p>
          <p><strong>Type:</strong> ${type}</p>
          <p><strong>Description:</strong> ${description}</p>
          ${fileUrl ? `<p><strong>Proof document:</strong> <a href="${fileUrl}">View file</a></p>` : ''}
          <hr/>
          <h3>AI Analysis</h3>
          <p><strong>Score:</strong> ${analysis.score}/100</p>
          <p><strong>Category:</strong> ${analysis.category}</p>
          <p><strong>Feedback:</strong> ${analysis.feedback}</p>
          <p><strong>Strengths:</strong> ${analysis.strengths}</p>
          <p><strong>Improvements:</strong> ${analysis.improvements}</p>
          <hr/>
          <p>Please review this submission:</p>
          <div style="margin-top:20px">
            <a href="https://netedu.vercel.app/admin/review?itemId=${item.id}&action=approved" 
               style="background:#1a1a6e;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin-right:10px">
              ✅ Approve
            </a>
            &nbsp;&nbsp;
            <a href="https://netedu.vercel.app/admin/review?itemId=${item.id}&action=rejected"
               style="background:#dc2626;color:white;padding:12px 24px;border-radius:8px;text-decoration:none">
              ❌ Reject
            </a>
          </div>
        `
      })
    } catch (emailError) {
      console.error('Email error:', emailError)
    }

    return NextResponse.json({
      success: true,
      item,
      analysis,
      message: 'Portfolio item submitted for review!'
    })

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    const { data: items } = await supabase
      .from('portfolio_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    const { data: score } = await supabase
      .from('identity_scores')
      .select('*')
      .eq('user_id', userId)
      .single()

    return NextResponse.json({ items: items || [], score })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}