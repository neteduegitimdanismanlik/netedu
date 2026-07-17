import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
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
    return NextResponse.json(parsed)
  } catch (e: any) {
    return NextResponse.json({ error: e.message })
  }
}