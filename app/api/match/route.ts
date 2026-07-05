import { NextResponse } from 'next/server'
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const prompt = 'You are a university admissions expert. Based on this student profile, suggest 6 universities: 2 Reach, 2 Match, 2 Safety. Student: Grade ' + body.grade + ', GPA: ' + body.gpa + '/100, Target: ' + body.department + '. For each university provide: name, country, acceptance rate estimate (%), and category (Reach/Match/Safety). Respond ONLY in this exact JSON format: {universities:[{name:string,country:string,acceptance:number,category:string}]}'
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY!, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 1000, messages: [{ role: 'user', content: prompt }] })
    })
    const data = await res.json()
    const text = data.content?.[0]?.text || '{}'
    const parsed = JSON.parse(text)
    return NextResponse.json(parsed)
  } catch (e: any) {
    return NextResponse.json({ error: e.message })
  }
}
