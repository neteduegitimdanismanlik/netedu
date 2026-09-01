import { NextResponse } from 'next/server'
import { callerId, unauthorized, forbidden } from '@/lib/api-auth'
import { casAdmin, membership } from '@/lib/cas-server'

/**
 * Report a message. Any member of the project can report any message in it,
 * once. Reports land in cas_message_reports for the admin panel; they do not
 * remove the message on their own.
 */
export async function POST(req: Request) {
  const uid = await callerId(req)
  if (!uid) return unauthorized()

  const { messageId, reason } = await req.json().catch(() => ({}))
  if (!messageId) return NextResponse.json({ error: 'messageId is required' }, { status: 400 })

  const { data: message } = await casAdmin
    .from('cas_project_messages')
    .select('id, event_id')
    .eq('id', messageId)
    .maybeSingle()

  if (!message) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const who = await membership(message.event_id, uid)
  if (who.role === 'none') return forbidden()

  const { error } = await casAdmin.from('cas_message_reports').upsert(
    {
      message_id: messageId,
      reported_by: uid,
      reason: String(reason || '').slice(0, 500),
    },
    { onConflict: 'message_id,reported_by' }
  )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
