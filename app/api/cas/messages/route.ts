import { NextResponse } from 'next/server'
import { callerId, unauthorized, forbidden } from '@/lib/api-auth'
import { casAdmin, initialsMap, membership, planOf } from '@/lib/cas-server'
import { limitsWaived } from '@/lib/plan'
import { detectContactDetails, contactWarning } from '@/lib/cas-privacy'

/**
 * The project thread.
 *
 * Reading is open to every member of the project. Sending is a Pro feature —
 * that is the line the pricing page draws, and it is enforced here rather
 * than in the browser, where it would be decoration.
 *
 * Names never appear in the response. Members are two initials and nothing
 * more, so a student cannot be identified, searched for or contacted outside
 * the project by anything this endpoint returns.
 */

const MAX_LENGTH = 1000
const DAILY_MESSAGE_LIMIT = 60

export async function GET(req: Request) {
  const uid = await callerId(req)
  if (!uid) return unauthorized()

  const eventId = new URL(req.url).searchParams.get('eventId')
  if (!eventId) return NextResponse.json({ error: 'eventId is required' }, { status: 400 })

  const who = await membership(eventId, uid)
  if (who.role === 'none') return forbidden()

  const { data, error } = await casAdmin
    .from('cas_project_messages')
    .select('id, sender_id, body, flagged_contact, created_at')
    .eq('event_id', eventId)
    .eq('removed', false)
    .order('created_at', { ascending: true })
    .limit(300)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const initials = await initialsMap((data || []).map((m) => m.sender_id))
  const plan = await planOf(uid)

  return NextResponse.json({
    role: who.role,
    canSend: plan === 'pro',
    messages: (data || []).map((m) => ({
      id: m.id,
      initials: initials[m.sender_id] || 'S.',
      mine: m.sender_id === uid,
      body: m.body,
      flagged: m.flagged_contact,
      createdAt: m.created_at,
    })),
  })
}

export async function POST(req: Request) {
  const uid = await callerId(req)
  if (!uid) return unauthorized()

  const { eventId, body, acknowledgeWarning } = await req.json().catch(() => ({}))
  if (!eventId || typeof body !== 'string' || !body.trim()) {
    return NextResponse.json({ error: 'eventId and body are required' }, { status: 400 })
  }

  const text = body.trim().slice(0, MAX_LENGTH)

  const who = await membership(eventId, uid)
  if (who.role === 'none') return forbidden()

  if ((await planOf(uid)) !== 'pro') {
    return NextResponse.json(
      { error: 'Messaging inside a project is part of Pro.', upgrade: true },
      { status: 402 }
    )
  }

  // Cheap flood guard, well above anything a real conversation needs.
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { count } = await casAdmin
    .from('cas_project_messages')
    .select('id', { count: 'exact', head: true })
    .eq('sender_id', uid)
    .gte('created_at', since)

  if ((count ?? 0) >= DAILY_MESSAGE_LIMIT && !(await limitsWaived(uid))) {
    return NextResponse.json(
      { error: 'You have sent a lot of messages today. Try again tomorrow.' },
      { status: 429 }
    )
  }

  // Contact details: warn once, then post and flag. Never silently block.
  const hits = detectContactDetails(text)
  if (hits.length > 0 && !acknowledgeWarning) {
    return NextResponse.json({ warning: contactWarning(hits), hits }, { status: 200 })
  }

  const { error } = await casAdmin.from('cas_project_messages').insert({
    event_id: eventId,
    sender_id: uid,
    body: text,
    flagged_contact: hits.length > 0,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
