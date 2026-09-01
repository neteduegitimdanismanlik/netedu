'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { authHeaders } from '@/lib/session'

type Message = {
  id: string
  initials: string
  mine: boolean
  body: string
  flagged: boolean
  createdAt: string
}

/**
 * The project thread. Everyone in it is two initials — the API never sends a
 * name, so there is nothing here that could identify a student to a stranger.
 */
export default function ProjectChat({
  eventId,
  title,
  onClose,
}: {
  eventId: string
  title: string
  onClose: () => void
}) {
  const [messages, setMessages] = useState<Message[]>([])
  const [draft, setDraft] = useState('')
  const [canSend, setCanSend] = useState(true)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [warning, setWarning] = useState('')
  const [upgrade, setUpgrade] = useState(false)
  const [reported, setReported] = useState<Record<string, boolean>>({})
  const bottom = useRef<HTMLDivElement>(null)

  const load = useCallback(async () => {
    const res = await fetch(`/api/cas/messages?eventId=${eventId}`, {
      headers: { ...(await authHeaders()) },
    })
    const json = await res.json()
    if (!res.ok) {
      setError(json.error || 'Could not load the conversation.')
    } else {
      setMessages(json.messages || [])
      setCanSend(Boolean(json.canSend))
      setError('')
    }
    setLoading(false)
  }, [eventId])

  useEffect(() => {
    load()
    const timer = setInterval(load, 8000)
    return () => clearInterval(timer)
  }, [load])

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  async function send(acknowledgeWarning = false) {
    const body = draft.trim()
    if (!body) return
    setSending(true)
    setError('')

    const res = await fetch('/api/cas/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(await authHeaders()) },
      body: JSON.stringify({ eventId, body, acknowledgeWarning }),
    })
    const json = await res.json()
    setSending(false)

    if (res.status === 402) {
      setUpgrade(true)
      return
    }
    if (!res.ok) {
      setError(json.error || 'Could not send.')
      return
    }
    if (json.warning) {
      setWarning(json.warning)
      return
    }

    setDraft('')
    setWarning('')
    await load()
  }

  async function report(messageId: string) {
    setReported((r) => ({ ...r, [messageId]: true }))
    await fetch('/api/cas/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(await authHeaders()) },
      body: JSON.stringify({ messageId, reason: 'Reported from the project thread' }),
    })
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg flex flex-col" style={{ height: 'min(80vh, 640px)' }}>

        <div className="px-5 py-4 border-b border-gray-100 flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
            <p className="text-xs text-gray-400">Project team · members shown by initials</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-sm px-2">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
          {loading && <p className="text-xs text-gray-400 text-center">Loading…</p>}

          {!loading && messages.length === 0 && (
            <div className="text-center my-auto">
              <div className="text-3xl mb-2">💬</div>
              <p className="text-sm text-gray-500">No messages yet.</p>
              <p className="text-xs text-gray-400 mt-1">Say what you need help with and when you plan to meet.</p>
            </div>
          )}

          {messages.map((m) => (
            <div key={m.id} className={`flex flex-col ${m.mine ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${m.mine ? 'bg-indigo-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
                {!m.mine && <p className="text-xs font-semibold text-gray-500 mb-1">{m.initials}</p>}
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{m.body}</p>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-gray-300">
                  {new Date(m.createdAt).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </span>
                {!m.mine && (
                  <button
                    onClick={() => report(m.id)}
                    disabled={reported[m.id]}
                    className="text-[10px] text-gray-300 hover:text-red-500 disabled:text-gray-300"
                  >
                    {reported[m.id] ? 'Reported' : 'Report'}
                  </button>
                )}
              </div>
            </div>
          ))}
          <div ref={bottom} />
        </div>

        {error && (
          <div className="mx-5 mb-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}

        {warning && (
          <div className="mx-5 mb-2 bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-3">
            <p className="text-xs text-yellow-800 leading-relaxed mb-2">⚠️ {warning}</p>
            <div className="flex gap-2">
              <button onClick={() => setWarning('')} className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 bg-white">
                Edit it
              </button>
              <button onClick={() => send(true)} disabled={sending} className="text-xs px-3 py-1.5 rounded-lg bg-yellow-600 text-white disabled:opacity-50">
                Send anyway
              </button>
            </div>
          </div>
        )}

        {upgrade && (
          <div className="mx-5 mb-2 bg-indigo-50 border border-indigo-200 rounded-xl px-3 py-3">
            <p className="text-xs text-indigo-800 leading-relaxed mb-2">
              Working with other students inside a project is part of Pro. You can keep browsing and creating projects on Free.
            </p>
            <Link href="/pricing" className="inline-block text-xs px-3 py-1.5 rounded-lg bg-indigo-900 text-white">
              See Pro →
            </Link>
          </div>
        )}

        <div className="px-5 py-4 border-t border-gray-100">
          {canSend ? (
            <div className="flex gap-2">
              <textarea
                value={draft}
                onChange={(e) => { setDraft(e.target.value); setWarning('') }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(false) }
                }}
                maxLength={1000}
                placeholder="Message the team…"
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 resize-none h-11"
              />
              <button
                onClick={() => send(false)}
                disabled={sending || !draft.trim()}
                className="bg-indigo-900 text-white px-5 rounded-xl text-sm font-medium disabled:opacity-50"
              >
                {sending ? '…' : 'Send'}
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-gray-500 leading-relaxed">
                You can read the thread on Free. Sending messages is part of Pro.
              </p>
              <Link href="/pricing" className="text-xs bg-indigo-900 text-white px-4 py-2 rounded-xl whitespace-nowrap">
                See Pro →
              </Link>
            </div>
          )}
          <p className="text-[10px] text-gray-400 mt-2 leading-relaxed">
            Keep it on NetEdu. We cannot protect conversations that move to another app.
          </p>
        </div>
      </div>
    </div>
  )
}
