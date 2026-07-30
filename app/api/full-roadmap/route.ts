import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const maxDuration = 60

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  try {
    const { userId, yearIndex, totalYears } = await req.json()

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (!profile) return NextResponse.json({ error: 'Complete your profile first' }, { status: 400 })

    const gradeNum = parseInt(String(profile.grade).replace(/\D/g, '')) || 9
    const thisGrade = gradeNum + yearIndex
    const isFinal = yearIndex === totalYears - 1

    const prompt = `You are a university admissions strategist building year ${yearIndex + 1} of a ${totalYears}-year plan.

STUDENT PROFILE
- Currently: ${profile.grade}, GPA ${profile.gpa}/100
- School: ${profile.school || 'not specified'} | Nationality: ${profile.nationality || 'not specified'}
- Diploma: ${profile.diploma_type || 'not specified'}
- SAT: ${profile.sat || 'not taken'} | IELTS: ${profile.ielts || 'not taken'}
- Target: ${profile.target_university || 'undecided'} — ${profile.target_department || 'undecided'}
- Clubs: ${profile.clubs || 'none'} | Volunteering: ${profile.volunteering || 'none'}
- Research: ${profile.research || 'none'} | Awards: ${profile.awards || 'none'}

Write the plan for GRADE ${thisGrade} (year ${yearIndex + 1} of ${totalYears}).
${isFinal ? 'This is the FINAL year — focus on applications, deadlines, interviews and offers.' : ''}
${yearIndex === 0 ? 'This is the FIRST year — build foundations from where the student is right now.' : `Assume years 1-${yearIndex} of the plan were completed, so build on that progress.`}

Every task must be specific to THIS student: reference their actual target university, their actual gaps, their actual existing activities. Never write generic advice.

5 periods, exactly 4 tasks each.

Return ONLY raw JSON, no markdown:
{
  "label": "Year ${yearIndex + 1} (Grade ${thisGrade})",
  "focus": "<the single strategic priority of this year for this student>",
  "periods": [
    { "period": "Sep-Oct", "tasks": [{ "task": "<specific action>", "why": "<one short sentence>", "category": "Academic|Test Prep|Portfolio|Research|Activities|Applications" }] },
    { "period": "Nov-Dec", "tasks": [...] },
    { "period": "Jan-Feb", "tasks": [...] },
    { "period": "Mar-Apr", "tasks": [...] },
    { "period": "May-Jun", "tasks": [...] }
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
        max_tokens: 3000,
        messages: [{ role: 'user', content: prompt }]
      })
    })

    const data = await res.json()
    let text = data.content?.[0]?.text || '{}'
    text = text.replace(/```json/g, '').replace(/```/g, '').trim()
    return NextResponse.json({ year: JSON.parse(text) })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const { userId, roadmap } = await req.json()
    const { error } = await supabase.from('profiles').update({
      full_roadmap: roadmap,
      updated_at: new Date().toISOString()
    }).eq('id', userId)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const { userId, progress } = await req.json()
    const { error } = await supabase.from('profiles').update({ roadmap_progress: progress }).eq('id', userId)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}