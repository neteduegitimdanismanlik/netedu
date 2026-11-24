/**
 * Where e-mails come from and where their links point. One place, so the
 * sign-up, parent and report e-mails can't drift apart again.
 *
 * MAIL_FROM must be an address on a domain verified in Resend
 * (resend.com/domains). Until neteduapp.com is verified, Resend rejects it —
 * the old fallback, onboarding@resend.dev, only ever delivered to the Resend
 * account owner, which is why parents received nothing.
 *
 * Supabase's own e-mails (sign-up confirmation, password reset) do not use
 * this file: they go through Supabase > Authentication > SMTP Settings, which
 * should point at Resend with the same sender address.
 */

export const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL || 'https://neteduapp.com').replace(/\/$/, '')

export const MAIL_FROM = process.env.RESEND_FROM || 'NetEdu <no-reply@neteduapp.com>'

/**
 * Replies to our e-mails land here instead of the no-reply address. The
 * Gmail inbox, because neteduapp.com has no mailbox (no MX records) — mail
 * sent to info@neteduapp.com currently bounces.
 */
export { CONTACT_EMAIL as MAIL_REPLY_TO } from './consent-shared'

export function escapeHtml(s: string): string {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
}
