import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getRubric, calculateGrade } from '@/app/rubrics/schema'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function scoreOnce(rubric: any, subject: string, title: string, content: string) {
  const criteriaText = rubric.criteria.map((c: any) =>
    `Criterion ${c.id}: ${c.name} (max ${c.max})\n${c.description}\nBands:\n${c.bands.map((b: any) => `  ${b.range}: ${b.descriptor}`).join('\n')}`
  ).join('\n\n')

  const prompt = `You are an experienced ${rubric.framework} examiner marking a ${rubric.documentType}.

SUBJECT: ${subject}
TITLE / RESEARCH QUESTION: ${title}

OFFICIAL RUBRIC:
${criteriaText}

STUDENT WORK:
"""
${content.slice(0, 12000)}
"""

Mark strictly against the band descriptors above. Award each criterion a whole-number score within its maximum.

Return ONLY raw JSON, no markdown, no backticks:
{
  "criteria": [${rubric.criteria.map((c: any) => `{"id":"${c.id}","score":<0-${c.max}>,"comment":"<2 sentences citing specific evidence from the work>"}`).join(',')}],
  "summary": "<3 sentence overall assessment>",
  "strengths": ["<specific strength>", "<specific strength>", "<specific strength>"],
  "weaknesses": ["<specific weakness>", "<specific weakness>", "<specific weakness>"],
  "improvements": ["<concrete actionable step>", "<concrete actionable step>", "<concrete actionable step>"]
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
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }]
    })
  })

  const data = await res.json()
  let text = data.content?.[0]?.text || '{}'
  text = text.replace(/```json/g, '').replace(/```/g, '').trim()
  return JSON.parse(text)
}

export async function POST(req: Request) {
  try {
    const { rubricId, subject, title, content, userId, fileUrl } = await req.json()

    const rubric = getRubric(rubricId)
    if (!rubric) return NextResponse.json({ error: 'Rubric not found' }, { status: 400 })

    // 3-shot averaging for consistency
    const runs = await Promise.all([
      scoreOnce(rubric, subject, title, content),
      scoreOnce(rubric, subject, title, content),
      scoreOnce(rubric, subject, title, content),
    ])

    const criteriaScores = rubric.criteria.map((c: any) => {
      const scores = runs.map(r => r.criteria?.find((x: any) => x.id === c.id)?.score ?? 0)
      const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      const comment = runs[0].criteria?.find((x: any) => x.id === c.id)?.comment || ''
      return { id: c.id, name: c.name, score: Math.min(avg, c.max), max: c.max, comment, spread: Math.max(...scores) - Math.min(...scores) }
    })

    const total = criteriaScores.reduce((sum, c) => sum + c.score, 0)
    const grade = calculateGrade(rubric, total)
    const best = runs[0]

    const report = {
      rubric_id: rubric.id,
      framework: rubric.framework,
      document_type: rubric.documentType,
      subject, title,
      content_preview: content.slice(0, 500),
      word_count: content.trim().split(/\s+/).length,
      file_url: fileUrl || null,
      total_score: total,
      total_max: rubric.totalMax,
      grade,
      criteria_scores: criteriaScores,
      summary: best.summary,
      strengths: best.strengths,
      weaknesses: best.weaknesses,
      improvements: best.improvements,
    }

    let saved = null
    if (userId) {
      const { data } = await supabase.from('checker_reports').insert({ ...report, user_id: userId }).select().single()
      saved = data
    }

    return NextResponse.json({ ...report, id: saved?.id || null, rubricLabel: rubric.label })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const { data } = await supabase
      .from('checker_reports')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return NextResponse.json({ reports: data || [] })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}