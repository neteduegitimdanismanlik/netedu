import { NextResponse } from 'next/server'
export async function POST(req: Request) {
  const body = await req.json()
  const prompt = 'NetEdu AI: ' + body.grade + ' GPA:' + body.gpa + ' Hedef:' + body.university + ' ' + body.department + ' icin Turkce yol haritasi yaz.'
  const res = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY!, 'anthropic-version': '2023-06-01' }, body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 1000, messages: [{ role: 'user', content: prompt }] }) })
  const data = await res.json()
  return NextResponse.json({ result: data.content?.[0]?.text || 'Hata' })
}
