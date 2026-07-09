'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ReviewContent() {
  const searchParams = useSearchParams()
  const itemId = searchParams.get('itemId')
  const action = searchParams.get('action')
  const [status, setStatus] = useState<'confirm' | 'loading' | 'success' | 'error'>('confirm')
  const [message, setMessage] = useState('')
  const [adminNote, setAdminNote] = useState('')

  async function confirm() {
    if (!itemId || !action) return
    setStatus('loading')
    try {
      const res = await fetch('/api/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, status: action, adminNote })
      })
      const data = await res.json()
      if (data.success) {
        setStatus('success')
        setMessage(action === 'approved' ? '✅ Item approved!' : '❌ Item rejected.')
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong')
      }
    } catch {
      setStatus('error')
      setMessage('Network error')
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-100 p-8 w-full max-w-md text-center">
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-8 h-8 bg-indigo-900 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">N</span>
          </div>
          <span className="font-semibold text-indigo-900 text-base">NetEdu Admin</span>
        </div>

        {status === 'confirm' && (
          <div>
            <div className="text-5xl mb-4">{action === 'approved' ? '✅' : '❌'}</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {action === 'approved' ? 'Approve this item?' : 'Reject this item?'}
            </h2>
            <p className="text-sm text-gray-400 mb-6">Item ID: {itemId}</p>

            {action === 'rejected' && (
              <div className="mb-4 text-left">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for rejection <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={adminNote}
                  onChange={e => setAdminNote(e.target.value)}
                  placeholder="e.g. Certificate could not be verified, please resubmit with clearer proof..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 resize-none h-24"
                />
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={confirm}
                className={`flex-1 text-white py-3 rounded-xl text-sm font-medium ${action === 'approved' ? 'bg-indigo-900 hover:bg-indigo-800' : 'bg-red-600 hover:bg-red-700'}`}>
                {action === 'approved' ? '✅ Confirm Approve' : '❌ Confirm Reject'}
              </button>
            </div>
          </div>
        )}

        {status === 'loading' && (
          <div>
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-gray-500">Processing...</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div className="text-5xl mb-4">{action === 'approved' ? '✅' : '❌'}</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Done!</h2>
            <p className="text-gray-500">{message}</p>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-500">{message}</p>
          </div>
        )}
      </div>
    </main>
  )
}

export default function ReviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-gray-400">Loading...</p></div>}>
      <ReviewContent />
    </Suspense>
  )
}