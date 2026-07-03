import { NextResponse } from 'next/server'
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': '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', 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 1000, messages: [{ role: 'user', content: 'Merhaba, test mesaji. Kisa bir cevap ver.' }] })
    })
    const data = await res.json()
    const text = data.content?.[0]?.text || JSON.stringify(data)
    return NextResponse.json({ result: text })
  } catch (e: any) {
    return NextResponse.json({ result: 'Hata: ' + e.message })
  }
}
