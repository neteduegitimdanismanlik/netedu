import crypto from 'crypto'
import { IYZIPAY_MERCHANT_ID } from './iyzico'

export interface IyzicoSubscriptionWebhookPayload {
  orderReferenceCode: string
  customerReferenceCode: string
  subscriptionReferenceCode: string
  iyziReferenceCode: string
  iyziEventType: 'subscription.order.success' | 'subscription.order.failure'
  iyziEventTime: number
}

/**
 * True only when the X-IYZ-SIGNATURE-V3 header on this request was really
 * computed by iyzico with our secretKey. NEVER trust a webhook body without
 * this check first — anyone can POST a JSON body shaped like a success
 * event and hand themselves Pro for free otherwise.
 *
 * Per docs.iyzico.com/en/advanced/webhook: HMAC-SHA256, hex-encoded, over
 *   merchantId + secretKey + iyziEventType + subscriptionReferenceCode +
 *   orderReferenceCode + customerReferenceCode
 * in exactly that order, keyed by secretKey.
 */
export function verifyIyzicoWebhookSignature(
  payload: IyzicoSubscriptionWebhookPayload,
  signatureHeader: string | null
): boolean {
  if (!signatureHeader) return false
  if (!IYZIPAY_MERCHANT_ID) {
    // Misconfiguration, not an attack — fail closed either way.
    console.error('IYZIPAY_MERCHANT_ID is not set; cannot verify webhook signatures.')
    return false
  }

  const secretKey = process.env.IYZIPAY_SECRET_KEY || ''
  const message =
    IYZIPAY_MERCHANT_ID +
    secretKey +
    payload.iyziEventType +
    payload.subscriptionReferenceCode +
    payload.orderReferenceCode +
    payload.customerReferenceCode

  const expected = crypto.createHmac('sha256', secretKey).update(message).digest('hex')

  // Constant-time compare — a plain === leaks timing information an
  // attacker could use to guess the signature byte by byte.
  const a = Buffer.from(expected, 'utf8')
  const b = Buffer.from(signatureHeader, 'utf8')
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}
