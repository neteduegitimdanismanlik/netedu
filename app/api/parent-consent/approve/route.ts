import { NextResponse } from 'next/server'
import { consentAdmin } from '@/lib/consent'
import { NOTICE_VERSION } from '@/lib/consent-shared'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Called by the parent approval page. The token in the e-mail link is the only
 * credential — an unguessable uuid, valid once. Who approved, when, from which
 * IP and against which notice version is kept as the record of consent.
 */
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}))
  const token = String(b?.token ?? '')
  const parentName = String(b?.parentName ?? '').trim().slice(0, 200)
  const tr = b?.lang === 'tr'

  if (!UUID.test(token)) {
    return NextResponse.json({ error: tr ? 'Bağlantı geçersiz.' : 'This link is not valid.' }, { status: 400 })
  }
  if (parentName.length < 3) {
    return NextResponse.json({ error: tr ? 'Adınızı ve soyadınızı yazın.' : 'Enter your full name.' }, { status: 400 })
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null

  const { data, error } = await consentAdmin()
    .from('consents')
    .update({
      parent_name: parentName,
      parent_notice_version: NOTICE_VERSION,
      parent_approved_at: new Date().toISOString(),
      parent_approved_ip: ip,
    })
    .eq('parent_token', token)
    .is('parent_approved_at', null)
    .select('user_id')

  if (error) {
    return NextResponse.json({ error: tr ? 'Onay kaydedilemedi.' : 'Could not save the approval.' }, { status: 500 })
  }
  if (!data?.length) {
    return NextResponse.json(
      { error: tr ? 'Bu bağlantı geçersiz ya da onay daha önce verilmiş.' : 'This link is not valid or has already been used.' },
      { status: 404 }
    )
  }
  return NextResponse.json({ ok: true })
}
