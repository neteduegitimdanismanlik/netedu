import { NextResponse } from 'next/server'
import { callerId, unauthorized, forbidden } from '@/lib/api-auth'
import { casAdmin, initialsMap, membership, DAILY_JOIN_LIMIT, countToday } from '@/lib/cas-server'

/**
 * GET  /api/cas/applications            -> the caller's own applications
 * GET  /api/cas/applications?eventId=x  -> the applicant list, organizer only
 * POST                                  -> ask to join a project (rate limited)
 * PATCH                                 -> accept / decline / remove, organizer only
 */

export async function GET(req: Request) {
  const uid = await callerId(req)
  if (!uid) return unauthorized()

  const eventId = new URL(req.url).searchParams.get('eventId')

  // --- organizer's inbox for one project ---
  if (eventId) {
    const who = await membership(eventId, uid)
    if (who.role !== 'organizer') return forbidden()

    const { data, error } = await casAdmin
      .from('cas_applications')
      .select('id, user_id, message, status, created_at')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const initials = await initialsMap((data || []).map((a) => a.user_id))
    return NextResponse.json({
      applications: (data || []).map((a) => ({
        id: a.id,
        initials: initials[a.user_id] || 'S.',
        message: a.message,
        status: a.status,
        createdAt: a.created_at,
      })),
    })
  }

  // --- the caller's own applications, with the project they belong to ---
  const { data, error } = await casAdmin
    .from('cas_applications')
    .select('id, event_id, status, created_at, cas_events(id, title, cas_category, location, event_date, created_by)')
    .eq('user_id', uid)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const usedToday = await countToday('cas_applications', 'user_id', uid)
  return NextResponse.json({
    applications: data || [],
    joinsLeftToday: Math.max(0, DAILY_JOIN_LIMIT - usedToday),
  })
}

export async function POST(req: Request) {
  const uid = await callerId(req)
  if (!uid) return unauthorized()

  const { eventId, message } = await req.json().catch(() => ({}))
  if (!eventId) return NextResponse.json({ error: 'eventId is required' }, { status: 400 })

  const { data: event } = await casAdmin
    .from('cas_events')
    .select('id, created_by, status')
    .eq('id', eventId)
    .maybeSingle()

  if (!event || event.status !== 'active') {
    return NextResponse.json({ error: 'This project is no longer open.' }, { status: 404 })
  }
  if (event.created_by === uid) {
    return NextResponse.json({ error: 'This is your own project.' }, { status: 400 })
  }

  const { data: existing } = await casAdmin
    .from('cas_applications')
    .select('id, status')
    .eq('event_id', eventId)
    .eq('user_id', uid)
    .maybeSingle()

  if (existing) {
    return NextResponse.json(
      { error: `You have already applied to this project (${existing.status}).` },
      { status: 409 }
    )
  }

  // Rate limit. Not advertised anywhere — the student only meets it here.
  const usedToday = await countToday('cas_applications', 'user_id', uid)
  if (usedToday >= DAILY_JOIN_LIMIT) {
    return NextResponse.json(
      {
        error: `You have reached today's limit of ${DAILY_JOIN_LIMIT} project requests. It resets tomorrow.`,
        limitReached: true,
      },
      { status: 429 }
    )
  }

  const { error } = await casAdmin.from('cas_applications').insert({
    event_id: eventId,
    user_id: uid,
    message: String(message || '').slice(0, 1000),
    status: 'pending',
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    ok: true,
    joinsLeftToday: Math.max(0, DAILY_JOIN_LIMIT - usedToday - 1),
  })
}

export async function PATCH(req: Request) {
  const uid = await callerId(req)
  if (!uid) return unauthorized()

  const { applicationId, status } = await req.json().catch(() => ({}))
  if (!applicationId || !['accepted', 'declined', 'removed'].includes(status)) {
    return NextResponse.json({ error: 'applicationId and a valid status are required' }, { status: 400 })
  }

  const { data: application } = await casAdmin
    .from('cas_applications')
    .select('id, event_id')
    .eq('id', applicationId)
    .maybeSingle()

  if (!application) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const who = await membership(application.event_id, uid)
  if (who.role !== 'organizer') return forbidden()

  const { error } = await casAdmin
    .from('cas_applications')
    .update({ status, decided_at: new Date().toISOString() })
    .eq('id', applicationId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
