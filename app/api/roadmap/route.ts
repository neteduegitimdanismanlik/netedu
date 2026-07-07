import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const apiKey = process.env.ANTHROPIC_API_KEY

    const prompt = `You are a university admissions expert. Analyze this student profile and return a structured roadmap in JSON format only. No markdown, no explanation, just raw JSON.

Student: ${body.grade}, GPA: ${body.gpa}/100, Target: ${body.university} - ${body.department}, Activities: ${body.activities || 'none'}

Return exactly this JSON structure:
{
  "profile_summary": "2 sentence analysis of the student",
  "strength": "main strength in one sentence",
  "weakness": "main weakness in one sentence",
  "acceptance_chance": "estimated % chance for target university",
  "this_week": [
    {"task": "task description", "duration": "30 min", "category": "Academic"},
    {"task": "task description", "duration": "1 hour", "category": "Test Prep"},
    {"task": "task description", "duration": "45 min", "category": "Portfolio"},
    {"task": "task description", "duration": "20 min", "category": "Research"},
    {"task": "task description", "duration": "1 hour", "category": "Activities"}
  ],
  "monthly_goals": [
    {"month": "Month 1", "goal": "goal description", "milestone": "measurable outcome"},
    {"month": "Month 2", "goal": "goal description", "milestone": "measurable outcome"},
    {"month": "Month 3", "goal": "goal description", "milestone": "measurable outcome"}
  ],
  "urgent_warnings": [
    "warning 1",
    "warning 2"
  ]
}`

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey!,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }]
      })
    })

    const data = await res.json()
    let text = data.content?.[0]?.text || '{}'
    text = text.replace(/```json/g, '').replace(/```/g, '').trim()
    const parsed = JSON.parse(text)
    return NextResponse.json({ result: parsed })
  } catch (e: any) {
    return NextResponse.json({ result: null, error: e.message })
  }
}