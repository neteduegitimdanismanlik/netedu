'use client'
import { useState } from 'react'
export default function Match() {
  const [grade, setGrade] = useState('Grade 9')
  const [gpa, setGpa] = useState('')
  const [department, setDepartment] = useState('')
  const [universities, setUniversities] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  async function getMatches() {
    setLoading(true)
    const res = await fetch('/api/match', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ grade, gpa, department }) })
    const data = await res.json()
    setUniversities(data.universities || [])
    setLoading(false)
  }
  const colors: any = { Reach: 'text-red-500 bg-red-50 border-red-200', Match: 'text-blue-500 bg-blue-50 border-blue-200', Safety: 'text-green-500 bg-green-50 border-green-200' }
  return (
    <main className='min-h-screen bg-gray-50 px-4 py-8'>
      <div className='max-w-2xl mx-auto'>
        <div className='flex items-center gap-2 mb-8'>
          <div className='w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center'><span className='text-white text-sm font-bold'>N</span></div>
          <span className='font-semibold text-gray-800'>Net<span className='text-green-500'>Edu</span></span>
        </div>
        <h1 className='text-2xl font-bold text-gray-900 mb-2'>University Matches</h1>
        <p className='text-sm text-gray-500 mb-8'>Enter your profile to see your Reach, Match and Safety universities.</p>
        <div className='bg-white rounded-2xl border border-gray-100 p-6 mb-6'>
          <div className='flex flex-col gap-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div><label className='block text-sm font-medium text-gray-700 mb-1'>Grade</label><select value={grade} onChange={e=>setGrade(e.target.value)} className='w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-500'><option>Grade 9</option><option>Grade 10</option><option>Grade 11</option><option>Grade 12</option></select></div>
              <div><label className='block text-sm font-medium text-gray-700 mb-1'>GPA (out of 100)</label><input type='number' value={gpa} onChange={e=>setGpa(e.target.value)} placeholder='85' className='w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-500' /></div>
            </div>
            <div><label className='block text-sm font-medium text-gray-700 mb-1'>Target department</label><input type='text' value={department} onChange={e=>setDepartment(e.target.value)} placeholder='Computer Science, Medicine...' className='w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-500' /></div>
            <button onClick={getMatches} disabled={loading} className='w-full bg-green-500 text-white py-3 rounded-xl font-medium text-sm disabled:opacity-50'>{loading ? 'Finding your matches...' : 'Find my universities'}</button>
          </div>
        </div>
        {universities.length > 0 && (
          <div className='flex flex-col gap-3'>
            {['Reach','Match','Safety'].map(cat => (
              <div key={cat}>
                <h3 className='text-xs font-600 text-gray-400 uppercase tracking-wide mb-2'>{cat}</h3>
                {universities.filter(u=>u.category===cat).map((u,i) => (
                  <div key={i} className='bg-white rounded-xl border border-gray-100 p-4 mb-2 flex items-center justify-between'>
                    <div>
                      <div className='font-medium text-gray-800 text-sm'>{u.name}</div>
                      <div className='text-xs text-gray-400 mt-0.5'>{u.country}</div>
                    </div>
                    <div className='text-right'>
                      <div className={'text-xs font-medium px-2 py-1 rounded-full border ' + (colors[u.category] || '')}>{u.category}</div>
                      <div className='text-xs text-gray-400 mt-1'>{u.acceptance}% acceptance</div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            <a href='/dashboard' className='block w-full bg-green-500 text-white py-3 rounded-xl text-sm font-medium text-center mt-2 hover:bg-green-600'>Go to Dashboard</a>
          </div>
        )}
      </div>
    </main>
  )
}
