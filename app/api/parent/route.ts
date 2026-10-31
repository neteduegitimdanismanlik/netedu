import { NextResponse } from 'next/server'
import { requireUser, countToday, limitReached, admin } from '@/lib/plan'

/**
 * Everything the parent panel shows, read on the server.
 *
 * WHY A ROUTE: the panel used to read profiles, portfolio_items and
 * parent_messages straight from the browser. RLS only lets a user read their
 * OWN rows there, so a parent always saw an empty panel — and the "Ask AI"
 * tab called the Anthropic API from the browser with no key, so it never
 * answered. Here the server checks the link first and then reads with the
 * service key, returning only the fields the panel needs.
 *
 * WHO GETS IN: a signed-in user whose (confirmed) account e-mail matches an
 * accepted parent_links row. A student creates that row from their dashboard
 * by entering the parent's address — so it is the student who decides who
 * sees their progress.
 */

const PARENT_DAILY_QUESTIONS = 5

type Link = { student_id: string; parent_email: string }

async function parentLinks(userId: string): Promise<{ email: string; links: Link[] }> {
  const { data } = await admin.auth.admin.getUserById(userId)
  const email = (data?.user?.email || '').trim()
  if (!email || !data?.user?.email_confirmed_at) return { email: '', links: [] }

  const { data: rows } = await admin
    .from('parent_links')
    .select('student_id, parent_email')
    .in('parent_email', Array.from(new Set([email, email.toLowerCase()])))
    .eq('status', 'accepted')

  // A student can't be their own parent.
  const links = (rows || []).filter((r: Link) => r.student_id && r.student_id !== userId)
  return { email, links }
}

async function studentView(studentId: string, parentEmail: string) {
  // select('*') on profiles: the panel picks only the fields below, so a
  // column added later never breaks it — and nothing else leaves the server.
  const [{ data: profile }, { data: items }, { data: msgs }] = await Promise.all([
    admin
      .from('profiles')
      .select('*')
      .eq('id', studentId)
      .maybeSingle(),
    admin
      .from('portfolio_items')
      .select('title, type, status, ai_score, created_at')
      .eq('user_id', studentId)
      .order('created_at', { ascending: false }),
    admin
      .from('parent_messages')
      .select('role, content, created_at')
      .eq('student_id', studentId)
      .eq('parent_email', parentEmail)
      .order('created_at', { ascending: true })
      .limit(100),
  ])

  let roadmapSummary: string | null = null
  if (profile?.roadmap) {
    try {
      const r = typeof profile.roadmap === 'string' ? JSON.parse(profile.roadmap) : profile.roadmap
      roadmapSummary = r?.profile_summary || null
    } catch {
      roadmapSummary = String(profile.roadmap).slice(0, 300)
    }
  }

  return {
    student: profile
      ? {
          id: profile.id,
          school: profile.school || null,
          grade: profile.grade,
          gpa: profile.gpa,
          targetUniversity: profile.target_university,
          targetDepartment: profile.target_department,
          roadmapSummary,
        }
      : null,
    portfolio: items || [],
    messages: msgs || [],
  }
}

/** GET /api/parent?student=<id> — the panel's data. Without ?student, the first linked child. */
export async function GET(req: Request) {
  try {
    const gate = await requireUser(req)
    if (gate instanceof NextResponse) return gate

    const { email, links } = await parentLinks(gate.userId)
    if (links.length === 0) return NextResponse.json({ linked: false })

    const wanted = new URL(req.url).searchParams.get('student')
    const link = links.find((l) => l.student_id === wanted) || links[0]

    const view = await studentView(link.student_id, link.parent_email || email)
    const children = links.length > 1
      ? await Promise.all(
          links.map(async (l) => {
            // profiles has no name column — label each child by their sign-in address.
            const { data } = await admin.auth.admin.getUserById(l.student_id)
            return { id: l.student_id, name: data?.user?.email || 'Student' }
          })
        )
      : []

    return NextResponse.json({ linked: true, children, ...view })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

/** POST /api/parent { studentId, question } — "Ask AI", answered on the server. */
export async function POST(req: Request) {
  try {
    const gate = await requireUser(req)
    if (gate instanceof NextResponse) return gate

    const { studentId, question } = await req.json()
    if (typeof question !== 'string' || !question.trim() || question.length > 1000) {
      return NextResponse.json({ error: 'Write a question (up to 1,000 characters).' }, { status: 400 })
    }

    const { email, links } = await parentLinks(gate.userId)
    const link = links.find((l) => l.student_id === studentId)
    if (!link) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const parentEmail = link.parent_email || email

    const used = await countToday('feature_usage', 'user_id', gate.userId, { column: 'feature', value: 'parent-chat' })
    if (used >= PARENT_DAILY_QUESTIONS) {
      return limitReached(`You've asked today's ${PARENT_DAILY_QUESTIONS} questions. Come back tomorrow.`)
    }
    await admin.from('feature_usage').insert({ user_id: gate.userId, feature: 'parent-chat' })

    const view = await studentView(link.student_id, parentEmail)
    const s = view.student
    const approved = view.portfolio.filter((i: any) => i.status === 'approved').length

    const system = `You are NetEdu's university-guidance advisor, speaking to the parent of an IB student.
Student: grade ${s?.grade || 'unknown'}, GPA ${s?.gpa ?? 'unknown'}/100, aiming for ${s?.targetUniversity || 'not set yet'} — ${s?.targetDepartment || 'not set yet'}.
Portfolio: ${view.portfolio.length} activities, ${approved} approved.
${s?.roadmapSummary ? `Roadmap summary: ${s.roadmapSummary}` : ''}
Answer clearly and warmly in plain text, in the language the parent writes in. Be specific about what the student could do next and how the parent can support them. Don't invent facts about the student beyond the data above.`

    const history = view.messages.slice(-10).map((m: any) => ({
      role: m.role === 'parent' ? 'user' : 'assistant',
      content: m.content,
    }))

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY!, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 500,
        system,
        messages: [...history, { role: 'user', content: question.trim() }],
      }),
    })
    const data = await res.json()
    const reply = data.content?.[0]?.text
    if (!reply) return NextResponse.json({ error: 'The advisor could not answer just now. Try again in a minute.' }, { status: 502 })

    await admin.from('parent_messages').insert([
      { student_id: link.student_id, parent_email: parentEmail, role: 'parent', content: question.trim() },
      { student_id: link.student_id, parent_email: parentEmail, role: 'ai', content: reply },
    ])

    const { data: msgs } = await admin
      .from('parent_messages')
      .select('role, content, created_at')
      .eq('student_id', link.student_id)
      .eq('parent_email', parentEmail)
      .order('created_at', { ascending: true })
      .limit(100)

    return NextResponse.json({ messages: msgs || [] })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
