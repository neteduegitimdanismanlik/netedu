import { NextResponse } from 'next/server'
import { requireUser, planOf, countToday, limitReached, admin, FREE_DAILY_PROFILE_ANALYSES } from '@/lib/plan'

export async function POST(req: Request) {
  try {
    // Signed-in only. This route calls Anthropic on every request; without a
    // gate anyone could POST to it repeatedly and spend the API budget.
    const gate = await requireUser(req)
    if (gate instanceof NextResponse) return gate

    // Free: one profile analysis a day. Pro and 'unlimited' aren't counted
    // (planOf reports 'unlimited' as 'pro').
    const isFree = (await planOf(gate.userId)) !== 'pro'
    if (isFree) {
      const used = await countToday('feature_usage', 'user_id', gate.userId, { column: 'feature', value: 'profile-analysis' })
      if (used >= FREE_DAILY_PROFILE_ANALYSES) {
        return limitReached(
          "You've had today's free profile analysis — your last one is saved on your dashboard. You can run it again tomorrow; Pro has no daily limit on this."
        )
      }
    }

    const body = await req.json()
    const apiKey = process.env.ANTHROPIC_API_KEY

    const prompt = `You are a warm, encouraging university admissions mentor talking directly to a student — not a teacher filing a formal report about them. Analyze this student profile and return a structured roadmap in JSON format only. No markdown, no explanation, just raw JSON.

Write every text field speaking directly to the student as "you" ("You're strong in...", "This week, try..."), never in the third person ("The student...", "They have..."). Keep the tone friendly, specific and genuinely encouraging — plain language a 16-year-old would feel talked to by, not evaluated by. Avoid stiff academic phrasing ("exhibits", "demonstrates competency in") in favor of how you'd actually say it to them.

Student: ${body.grade}, GPA: ${body.gpa}/100, Target: ${body.university} - ${body.department}
Diploma: ${body.diplomaType || 'not specified'}, SAT: ${body.sat || 'not taken'}, IELTS: ${body.ielts || 'not taken'}
Activities: ${body.activities || 'none'}

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

    // The model occasionally prefaces the JSON with prose, or answers in
    // prose entirely — the same failure mode that used to leak a raw
    // "Unexpected token" parse error straight to a student in the checker.
    // Pulling out the {...} object first, with a clear thrown message when
    // there isn't one, avoids that here too.
    const start = text.indexOf('{')
    const end = text.lastIndexOf('}')
    if (start === -1 || end <= start) {
      throw new Error(`Model did not return JSON. It replied: ${text.slice(0, 160)}`)
    }
    let parsed: any
    try {
      parsed = JSON.parse(text.slice(start, end + 1))
    } catch {
      throw new Error(`Model returned malformed JSON. It replied: ${text.slice(0, 160)}`)
    }
    // Counted only once it actually succeeded — a failed model call shouldn't
    // use up a Free student's one try for the day.
    if (isFree) await admin.from('feature_usage').insert({ user_id: gate.userId, feature: 'profile-analysis' })
    return NextResponse.json({ result: parsed })
  } catch (e: any) {
    return NextResponse.json({ result: null, error: e.message })
  }
}