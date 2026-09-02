'use client'
import { useState } from 'react'
import Link from 'next/link'
import { authHeaders } from '@/lib/session'
import Navbar from '../components/Navbar'
import SearchSelect from '../components/SearchSelect'
import { departmentList } from '../components/data'

export default function Match() {
  const [gpa, setGpa] = useState('')
  const [department, setDepartment] = useState('')
  const [country, setCountry] = useState('')
  const [diploma, setDiploma] = useState('')
  const [universities, setUniversities] = useState<any[]>([])
  const [locked, setLocked] = useState(0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function getMatches() {
    setLoading(true)
    setError('')
    const res = await fetch('/api/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(await authHeaders()) },
      body: JSON.stringify({ gpa, department, country, diploma })
    })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(res.status === 401
        ? 'Sign in to see your matches.'
        : (data.error || 'Could not load your matches.'))
      return
    }
    setUniversities(data.universities || [])
    setLocked(data.locked || 0)
  }

  const colors: any = {
    Reach: 'text-red-500 bg-red-50 border-red-200',
    Match: 'text-blue-500 bg-blue-50 border-blue-200',
    Safety: 'text-green-500 bg-green-50 border-green-200'
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar showBack backHref="/dashboard" backLabel="Dashboard" />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">University Matches</h1>
        <p className="text-sm text-gray-500 mb-8">Enter your profile to see your Reach, Match and Safety universities.</p>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <div className="flex flex-col gap-4">

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GPA (out of 100)</label>
                <input type="number" value={gpa} onChange={e => setGpa(e.target.value)} placeholder="85" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Diploma type</label>
                <select value={diploma} onChange={e => setDiploma(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500">
                  <option value="">Select diploma</option>
                  <option>IB Diploma</option>
                  <option>A-Level</option>
                  <option>SAT / ACT</option>
                  <option>Turkish National (YKS)</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target country</label>
              <select value={country} onChange={e => setCountry(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500">
                <option value="">Any country</option>
                <option>United Kingdom</option>
                <option>United States</option>
                <option>Netherlands</option>
                <option>Germany</option>
                <option>Canada</option>
                <option>Australia</option>
                <option>Switzerland</option>
                <option>France</option>
                <option>Turkey</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target department</label>
              <SearchSelect options={departmentList} value={department} onChange={setDepartment} placeholder="Search departments..." />
            </div>

            <button onClick={getMatches} disabled={loading || !gpa || !department} className="w-full bg-indigo-900 text-white py-3 rounded-xl font-medium text-sm disabled:opacity-50 hover:bg-indigo-800">
              {loading ? 'Finding your matches...' : 'Find my universities'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {universities.length > 0 && (
          <div className="flex flex-col gap-3">
            {['Reach', 'Match', 'Safety'].map(cat => (
              <div key={cat}>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{cat}</h3>
                {universities.filter(u => u.category === cat).map((u, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 mb-2 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-800 text-sm">{u.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{u.country}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xs font-medium px-2 py-1 rounded-full border ${colors[u.category] || ''}`}>{u.category}</div>
                      <div className="text-xs text-gray-400 mt-1">{u.acceptance}% acceptance</div>
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {locked > 0 && (
              <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-6 text-center mt-2">
                <div className="text-2xl mb-2">🔒</div>
                <p className="text-sm font-medium text-gray-700 mb-1">{locked} more matches</p>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                  Free shows one Reach, one Match and one Safety. Pro shows the full list.
                </p>
                <Link href="/pricing" className="inline-block bg-indigo-900 text-white text-sm px-6 py-2.5 rounded-xl">
                  See Pro →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}