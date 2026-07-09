'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ReviewContent() {
  const searchParams = useSearchParams()
  const itemId = searchParams.get('itemId')
  const action = searchParams.get('action')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!itemId || !action) {
      setStatus('error')
      setMessage('Missing itemId or action')
      return
    }

    fetch('/api/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId, status: action })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStatus('success')
          setMessage(action === 'approved' ? '✅ Item approved successfully!' : '❌ Item rejected.')
        } else {
          setStatus('error')
          setMessage(data.error || 'Something went wrong')
        }
      })
      .catch(() => {
        setStatus('error')
        setMessage('Network error')
      })
  }, [itemId, action])

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-100 p-8 w-full max-w-md text-center">
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-8 h-8 bg-indigo-900 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">N</span>
          </div>
          <span className="font-semibold text-indigo-900 text-base">NetEdu Admin</span>
        </div>

        {status === 'loading' && (
          <div>
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-gray-500">Processing...</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div className="text-5xl mb-4">{action === 'approved' ? '✅' : '❌'}</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {action === 'approved' ? 'Approved!' : 'Rejected'}
            </h2>
            <p className="text-gray-500 mb-6">{message}</p>
            <p className="text-sm text-gray-400">Item ID: {itemId}</p>
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