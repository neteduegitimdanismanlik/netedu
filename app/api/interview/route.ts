import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { action, university, department, messages, answer } = await req.json()

    if (action === 'start') {
      const prompt = `You are an admissions interviewer at ${university} for ${department}. Start the interview with a warm welcome and ask the FIRST interview question. Make it realistic to ${university}'s actual interview style. Oxford/Cambridge: focus on academic depth and critical thinking. US Ivy League: focus on personal story, leadership, impact. Imperial/UCL: focus on motivation and technical interest. Keep it conversational. Just ask the first question, nothing else.`

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY!, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 300, messages: [{ role: 'user', content: prompt }] })
      })
      const data = await res.json()
      return NextResponse.json({ message: data.content?.[0]?.text })
    }

    if (action === 'respond') {
      const conversationHistory = messages.map((m: any) => ({
        role: m.role === 'interviewer' ? 'assistant' : 'user',
        content: m.content
      }))

      const systemPrompt = `You are an admissions interviewer at ${university} for ${department}. You are conducting a real university interview. After the student answers: 1. Give brief feedback on their answer (1-2 sentences) 2. Ask the next interview question. Keep it natural and conversational. After 4-5 exchanges, wrap up the interview. If this is the last question, say "Thank you, that concludes our interview."`

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY!, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 400,
          system: systemPrompt,
          messages: [...conversationHistory, { role: 'user', content: answer }]
        })
      })
      const data = await res.json()
      const text = data.content?.[0]?.text || ''
      const isEnd = text.includes('concludes our interview') || text.includes('Thank you for') || messages.length > 10
      return NextResponse.json({ message: text, isEnd })
    }

    if (action === 'evaluate') {
      const transcript = messages.map((m: any) => `${m.role === 'interviewer' ? 'Interviewer' : 'Student'}: ${m.content}`).join('\n\n')

      const prompt = `You are an expert university admissions evaluator. Evaluate this mock interview for ${university} ${department}.

TRANSCRIPT:
${transcript}

Return ONLY this JSON, no markdown:
{"overall_score":<1-10>,"grade":"<A|B|C|D>","summary":"<2-3 sentence overall assessment>","scores":[{"category":"Communication","score":<1-10>,"comment":"<comment>"},{"category":"Academic Knowledge","score":<1-10>,"comment":"<comment>"},{"category":"Motivation & Passion","score":<1-10>,"comment":"<comment>"},{"category":"Critical Thinking","score":<1-10>,"comment":"<comment>"},{"category":"Authenticity","score":<1-10>,"comment":"<comment>"}],"strengths":["<strength 1>","<strength 2>"],"improvements":["<improvement 1>","<improvement 2>","<improvement 3>"],"tips":["<tip 1>","<tip 2>","<tip 3>"]}`

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY!, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 1000, messages: [{ role: 'user', content: prompt }] })
      })
      const data = await res.json()
      let text = data.content?.[0]?.text || '{}'
      text = text.replace(/```json/g, '').replace(/```/g, '').trim()
      return NextResponse.json(JSON.parse(text))
    }

    return NextResponse.json({ error: 'Invalid action' })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}