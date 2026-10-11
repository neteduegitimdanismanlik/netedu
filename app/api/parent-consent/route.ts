import { NextResponse } from 'next/server'
import { callerId, unauthorized } from '@/lib/api-auth'
import { sendParentEmail } from '@/lib/consent'

/** Sends (or re-sends) the approval e-mail to the signed-in student's parent. 10-minute cooldown. */
export async function POST(req: Request) {
  const userId = await callerId(req)
  if (!userId) return unauthorized()
  const r = await sendParentEmail(userId)
  return NextResponse.json(r.body, { status: r.status })
}
