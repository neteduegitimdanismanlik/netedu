import { NextResponse } from 'next/server'
export async function POST(req: Request) {
  const body = await req.json()
  const prompt = 'Sen NetEdu AI danismanisin. ' + body.grade + ' sinif, GPA: ' + body.gpa + '/100, Hedef: ' + body.university + ' - ' + body.department + '. Turkce yol haritasi: 1.PROFIL ANALIZI 2.BU HAFTA 5 GOREV 3.1 AYLIK HEDEFLER 4.KABUL TAHMINI'
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY!, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 1000, messages: [{ role: 'user', content: prompt }] })
  })
  const data = await response.json()
  const text = data.content?.[0]?.text || 'Analiz yapilamadi.'
  return NextResponse.json({ result: text })
}
