import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  try {
    const { userId } = await req.json()

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (!profile) return NextResponse.json({ error: 'Complete your profile first' }, { status: 400 })

    const gradeNum = parseInt(String(profile.grade).replace(/\D/g, '')) || 9
    const yearsLeft = Math.max(1, 13 - gradeNum)

    const prompt = `You are a university admissions strategist building a personalised long-term plan.

STUDENT PROFILE
- Current grade: ${profile.grade}
- GPA: ${profile.gpa}/100
- School: ${profile.school || 'not specified'}
- Nationality: ${profile.nationality || 'not specified'}
- Diploma: ${profile.diploma_type || 'not specified'}
- SAT: ${profile.sat || 'not taken'}
- IELTS: ${profile.ielts || 'not taken'}
- Target university: ${profile.target_university || 'not decided'}
- Target department: ${profile.target_department || 'not decided'}
- Clubs: ${profile.clubs || 'none listed'}
- Volunteering: ${profile.volunteering || 'none listed'}
- Research/projects: ${profile.research || 'none listed'}
- Awards: ${profile.awards || 'none listed'}

Build a ${yearsLeft}-year roadmap starting from ${profile.grade}. Every task must be specific to THIS student — reference their actual target, their actual gaps, their actual existing activities. Never write generic advice like "join a club" when they already list clubs; instead say what to do next with what they have.

Each year has 5 period blocks: "Sep-Oct", "Nov-Dec", "Jan-Feb", "Mar-Apr", "May-Jun".
Each period has exactly 4 tasks.

Return ONLY raw JSON, no markdown:
{
  "overview": "<2 sentences on the overall strategy for this specific student>",
  "years": [
    {
      "label": "Year 1 (Grade ${gradeNum})",
      "focus": "<the single strategic priority of this year for this student>",
      "periods": [
        { "period": "Sep-Oct", "tasks": [
          { "task": "<specific action>", "why": "<why this student needs it, one short sentence>", "category": "Academic|Test Prep|Portfolio|Research|Activities|Applications" }
        ]}
      ]
    }
  ]
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
        max_tokens: 8000,
        messages: [{ role: 'user', content: prompt }]
      })
    })

    const data = await res.json()
    let text = data.content?.[0]?.text || '{}'
    text = text.replace(/```json/g, '').replace(/```/g, '').trim()
    const roadmap = JSON.parse(text)

    await supabase.from('profiles').update({
      full_roadmap: roadmap,
      roadmap_progress: [],
      updated_at: new Date().toISOString()
    }).eq('id', userId)

    return NextResponse.json({ roadmap })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const { userId, progress } = await req.json()
    await supabase.from('profiles').update({ roadmap_progress: progress }).eq('id', userId)
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}