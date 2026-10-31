'use client'
import { useEffect, useState } from 'react'

/**
 * The "renew your package" window.
 *
 * Pro's monthly allowances (lib/plan-limits.ts) are deliberately not shown on
 * the pricing page — a student only meets one when it runs out. Every route
 * that enforces one answers 429 with `renew: true` (monthlyLimitReached in
 * lib/plan.ts). Rather than teach six different pages to recognise that, this
 * component, mounted once in app/layout.tsx, watches the responses of the
 * app's own /api/ calls and opens the window whenever one carries the flag.
 * Each page still shows its own error line as before; this is on top.
 *
 * It only reads a CLONE of 429 responses from same-site /api/ URLs, and never
 * changes what the page receives.
 *
 * Renewal is by e-mail for now, the same way Pro access is requested while
 * card payments aren't live. To renew a student by hand, see
 * sql/quota-resets.sql. Once checkout is live, point the button at it.
 */

const CONTACT = 'info@neteduapp.com'

const FEATURE_LABEL: Record<string, string> = {
  checker: 'IA checks',
  interview: 'mock interviews',
  'oral-prep': 'oral prep sessions',
  'oral-review': 'recording reviews',
  topics: 'Topic Finder searches',
  'profile-analysis': 'profile analyses',
  roadmap: 'roadmap rebuilds',
}

declare global {
  interface Window {
    __neteduRenewPatched?: boolean
  }
}

export default function RenewGate() {
  const [open, setOpen] = useState<{ message: string; feature?: string } | null>(null)

  useEffect(() => {
    if (window.__neteduRenewPatched) return
    window.__neteduRenewPatched = true

    const original = window.fetch.bind(window)
    window.fetch = async (...args: Parameters<typeof fetch>) => {
      const res = await original(...args)
      if (res.status === 429) {
        try {
          const target = args[0]
          const url = typeof target === 'string' ? target : target instanceof URL ? target.href : target.url
          const sameSiteApi = url.startsWith('/api/') || url.startsWith(`${window.location.origin}/api/`)
          if (sameSiteApi) {
            const data = await res.clone().json().catch(() => null)
            if (data?.renew) {
              window.dispatchEvent(new CustomEvent('netedu:renew', { detail: data }))
            }
          }
        } catch {
          // Never let the watcher break the page's own request.
        }
      }
      return res
    }
  }, [])

  useEffect(() => {
    const onRenew = (e: Event) => {
      const d = (e as CustomEvent).detail || {}
      setOpen({ message: d.error || "You've used this month's allowance.", feature: d.feature })
    }
    window.addEventListener('netedu:renew', onRenew)
    return () => window.removeEventListener('netedu:renew', onRenew)
  }, [])

  if (!open) return null

  const what = (open.feature && FEATURE_LABEL[open.feature]) || 'allowance'
  const mailto = `mailto:${CONTACT}?subject=${encodeURIComponent('NetEdu Pro — package renewal')}&body=${encodeURIComponent(
    `Hi,\n\nI've used this month's ${what} on NetEdu Pro and would like to renew my package to get more.\n\nEmail used on NetEdu:\n\nThank you.`
  )}`

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="renew-title"
      onClick={() => setOpen(null)}
    >
      <div className="bg-white rounded-2xl p-7 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="w-11 h-11 bg-indigo-100 rounded-full flex items-center justify-center text-xl mb-4">⚡</div>
        <h2 id="renew-title" className="text-lg font-bold text-gray-900 mb-2">
          You've reached this month's limit
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-6">{open.message}</p>
        <div className="flex flex-col gap-2">
          <a
            href={mailto}
            className="w-full py-3 rounded-xl text-sm font-medium bg-indigo-900 text-white hover:bg-indigo-800 text-center block"
          >
            Renew my package →
          </a>
          <button
            onClick={() => setOpen(null)}
            className="w-full py-2.5 rounded-xl text-sm text-gray-500 hover:bg-gray-50"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  )
}
