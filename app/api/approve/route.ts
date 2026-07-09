import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { itemId, status, adminNote } = await req.json()

    const { data: item, error } = await supabase
      .from('portfolio_items')
      .update({ status })
      .eq('id', itemId)
      .select()
      .single()

    if (error) throw error

    try {
      await resend.emails.send({
        from: 'NetEdu <onboarding@resend.dev>',
        to: 'neteduegitimdanismanlik@gmail.com',
        subject: `Portfolio Item ${status === 'approved' ? '✅ Approved' : '❌ Rejected'}: ${item.title}`,
        html: `
          <h2>Portfolio Item ${status === 'approved' ? '✅ Approved' : '❌ Rejected'}</h2>
          <p><strong>Title:</strong> ${item.title}</p>
          <p><strong>Type:</strong> ${item.type}</p>
          <p><strong>Status:</strong> ${status}</p>
          ${adminNote ? `<p><strong>Note:</strong> ${adminNote}</p>` : ''}
          <p>The student has been notified.</p>
        `
      })
    } catch (e) {
      console.error('Email error:', e)
    }

    return NextResponse.json({ success: true, item })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}