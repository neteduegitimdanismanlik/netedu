import { NextResponse } from 'next/server'
import { requireUser, planOf, FREE_UNIVERSITY_MATCHES } from '@/lib/plan'

/**
 * University matching.
 *
 * This route calls Anthropic on every request, so it is signed-in only —
 * before, anyone on the internet could POST to it and spend the API budget.
 *
 * Free students see three of the six matches. The other three are dropped
 * server-side rather than hidden with CSS, so the withheld names never reach
 * the browser at all.
 */
export async function POST(req: Request) {
  try {
    const gate = await requireUser(req)
    if (gate instanceof NextResponse) return gate

    const plan = await planOf(gate.userId)
    const body = await req.json()

    const prompt = `You are a university admissions expert. Suggest 6 universities for this student:
- GPA: ${body.gpa}/100
- Diploma type: ${body.diploma || 'not specified'}
- Target department: ${body.department}
- Preferred country: ${body.country || 'any country'}

Consider the diploma type carefully:
- IB Diploma students: convert GPA to estimated IB points, favor universities that value IB (UK, Netherlands, Canada)
- A-Level students: favor UK universities
- SAT/ACT students: favor US universities
- Turkish National (YKS): include Turkish universities and international ones accepting Turkish diplomas

${body.country ? `IMPORTANT: Only suggest universities in ${body.country}.` : ''}

Give 2 Reach, 2 Match, 2 Safety universities with realistic acceptance estimates for THIS student profile.
IMPORTANT: Respond with ONLY a JSON object, no markdown, no backticks.
Format: {"universities":[{"name":"MIT","country":"USA","acceptance":4,"category":"Reach"}]}`

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    })

    const data = await res.json()
    let text = data.content?.[0]?.text || '{}'
    text = text.replace(/```json/g, '').replace(/```/g, '').trim()
    const parsed = JSON.parse(text)

    const all: any[] = Array.isArray(parsed.universities) ? parsed.universities : []

    if (plan === 'pro') {
      return NextResponse.json({ universities: all, plan, locked: 0 })
    }

    // One from each band, so a free student still sees the shape of the answer
    // rather than three long shots.
    const shown: any[] = []
    for (const category of ['Reach', 'Match', 'Safety']) {
      const pick = all.find((u) => u.category === category && !shown.includes(u))
      if (pick) shown.push(pick)
    }
    for (const u of all) {
      if (shown.length >= FREE_UNIVERSITY_MATCHES) break
      if (!shown.includes(u)) shown.push(u)
    }

    return NextResponse.json({
      universities: shown.slice(0, FREE_UNIVERSITY_MATCHES),
      plan,
      locked: Math.max(0, all.length - FREE_UNIVERSITY_MATCHES),
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
