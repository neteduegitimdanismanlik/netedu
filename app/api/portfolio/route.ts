import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { recomputeIdentityScore } from '@/lib/identity'

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
- Relevance to university applications (0-30)
- Impact and significance (0-25)
- Difficulty and effort (0-25)
- Quality of evidence (0-20)
Return JSON only, no markdown:
{"score":<0-100>,"category":"<Academic|Leadership|Project|Social Impact|Research>","feedback":"<2-3 sentences>","strengths":"<strengths>","improvements":"<improvements>"}`

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY!, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 500, messages: [{ role: 'user', content: prompt }] })
    })

    const data = await res.json()
    let text = data.content?.[0]?.text || '{}'
    text = text.replace(/```json/g, '').replace(/```/g, '').trim()
    const analysis = JSON.parse(text)

    const { data: item, error } = await supabase
      .from('portfolio_items')
      .insert({
        user_id: userId, title, type, description, file_url: fileUrl,
        ai_score: analysis.score, ai_category: analysis.category,
        ai_feedback: analysis.feedback, status: 'pending'
      })
      .select().single()

    if (error) throw error

    // Pending items do NOT affect the score — recompute keeps it honest.
    await recomputeIdentityScore(userId)

    try {
      await resend.emails.send({
        from: 'NetEdu <onboarding@resend.dev>',
        to: 'neteduegitimdanismanlik@gmail.com',
        subject: `New Portfolio Item: ${title}`,
        html: `<h2>New Portfolio Submission</h2><p><strong>Title:</strong> ${title}</p><p><strong>Type:</strong> ${type}</p><p><strong>Description:</strong> ${description}</p>${fileUrl ? `<p><strong>Proof:</strong> <a href="${fileUrl}">View file</a></p>` : ''}<hr/><h3>AI Analysis</h3><p><strong>Score:</strong> ${analysis.score}/100</p><p><strong>Category:</strong> ${analysis.category}</p><p><strong>Feedback:</strong> ${analysis.feedback}</p><hr/><div style="margin-top:20px"><a href="https://netedu.vercel.app/admin/review?itemId=${item.id}&action=approved" style="background:#1a1a6e;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin-right:10px">Approve</a>&nbsp;&nbsp;<a href="https://netedu.vercel.app/admin/review?itemId=${item.id}&action=rejected" style="background:#dc2626;color:white;padding:12px 24px;border-radius:8px;text-decoration:none">Reject</a></div>`
      })
    } catch (emailError) {
      console.error('Email error:', emailError)
    }

    return NextResponse.json({ success: true, item, analysis })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const { data: items } = await supabase.from('portfolio_items').select('*').eq('user_id', userId).order('created_at', { ascending: false })
    const { data: score } = await supabase.from('identity_scores').select('*').eq('user_id', userId).single()
    return NextResponse.json({ items: items || [], score })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// Approve / reject — recomputes the score afterwards
export async function PATCH(req: Request) {
  try {
    const { itemId, status } = await req.json()
    const { data: item, error } = await supabase
      .from('portfolio_items')
      .update({ status })
      .eq('id', itemId)
      .select('user_id').single()
    if (error) throw error

    const score = await recomputeIdentityScore(item.user_id)
    return NextResponse.json({ success: true, score })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const itemId = searchParams.get('itemId')

    const { data: item } = await supabase.from('portfolio_items').select('user_id').eq('id', itemId).single()
    const { error } = await supabase.from('portfolio_items').delete().eq('id', itemId)
    if (error) throw error

    if (item?.user_id) await recomputeIdentityScore(item.user_id)
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}