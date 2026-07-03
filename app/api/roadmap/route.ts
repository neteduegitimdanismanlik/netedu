import { NextResponse } from 'next/server'
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const apiKey = process.env.ANTHROPIC_API_KEY
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey!, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 1000, messages: [{ role: 'user', content: 'NetEdu: ' + body.grade + ' GPA:' + body.gpa + ' Hedef:' + body.university + ' ' + body.department + ' icin Turkce yol haritasi yaz.' }] })
    })
    const data = await res.json()
    const text = data.content?.[0]?.text || JSON.stringify(data)
    return NextResponse.json({ result: text })
  } catch (e: any) {
    return NextResponse.json({ result: 'Hata: ' + e.message })
  }
}
