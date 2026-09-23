'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { initializePaddle, type Paddle as PaddleInstance } from '@paddle/paddle-js'
import { PADDLE_PRICE_IDS } from '@/lib/billing-config'
import type { BillingInterval } from '@/lib/billing-config'
import { supabase } from '@/lib/supabase'

/**
 * Drop this in anywhere a Pro upgrade makes sense. It opens Paddle's
 * hosted overlay checkout — card details never touch our servers, they go
 * straight to Paddle.
 *
 * profiles.plan only ever changes from the webhook
 * (app/api/billing/paddle/webhook/route.ts), never from anything that
 * happens in this component — a client-side "checkout closed" event is not
 * proof a charge actually went through, only Paddle's own server-to-server
 * webhook call is trusted for that. This button just starts the checkout
 * and gets out of the way.
 */
export function PaddleCheckoutButton({
  interval,
  label = 'Upgrade to Pro →',
  className = 'w-full py-3 rounded-xl text-sm font-medium bg-indigo-900 text-white hover:bg-indigo-800 text-center block disabled:opacity-50',
}: {
  interval: BillingInterval
  label?: string
  className?: string
}) {
  const router = useRouter()
  const [paddle, setPaddle] = useState<PaddleInstance>()
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    initializePaddle({
      environment: process.env.NEXT_PUBLIC_PADDLE_ENV === 'production' ? 'production' : 'sandbox',
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
    }).then(setPaddle)
  }, [])

  async function open() {
    const priceId = PADDLE_PRICE_IDS[interval]
    if (!priceId) {
      alert('Ödeme sistemi henüz hazır değil, birazdan tekrar dene.')
      return
    }
    setBusy(true)
    try {
      const { data } = await supabase.auth.getUser()
      const user = data.user
      if (!user) {
        router.push('/auth?next=/pricing')
        return
      }
      paddle?.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        customer: user.email ? { email: user.email } : undefined,
        customData: { userId: user.id },
        settings: { displayMode: 'overlay', theme: 'light', locale: 'tr' },
      })
    } finally {
      setBusy(false)
    }
  }

  return (
    <button onClick={open} disabled={!paddle || busy} className={className}>
      {label}
    </button>
  )
}
