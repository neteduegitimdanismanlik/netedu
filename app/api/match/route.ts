import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const prompt = `You are a university admissions expert. Suggest 6 universities for this student: Grade ${body.grade}, GPA: ${body.gpa}/100, Department: ${body.department}. Give 2 Reach, 2 Match, 2 Safety universities. IMPORTANT: Respond with ONLY a JSON object, no markdown, no backticks. Example: {"universities":[{"name":"MIT","country":"USA","acceptance":4,"category":"Reach"}]}`
    
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