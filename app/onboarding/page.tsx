'use client'
import { useState } from 'react'
export default function Onboarding() {
const [grade, setGrade] = useState('9. Sinif')
const [gpa, setGpa] = useState('')
const [university, setUniversity] = useState('')
const [department, setDepartment] = useState('')
const [result, setResult] = useState('')
const [loading, setLoading] = useState(false)
async function analyze() {
setLoading(true)
const res = await fetch('/api/roadmap', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({grade, gpa, university, department})})
const data = await res.json()
setResult(data.result)
setLoading(false)
}
return (
<main className='min-h-screen bg-gray-50 px-4 py-8'>
<div className='max-w-lg mx-auto bg-white rounded-2xl border border-gray-100 p-8'>
<h1 className='text-2xl font-bold text-gray-900 mb-2'>Profilini olustur</h1>
<p className='text-sm text-gray-500 mb-6'>Bilgilerini gir, AI yol haritani cikarsın.</p>
<div className='flex flex-col gap-4'>
<div><label className='block text-sm font-medium text-gray-700 mb-1'>Sinif</label><select value={grade} onChange={e=>setGrade(e.target.value)} className='w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none'><option>9. Sinif</option><option>10. Sinif</option><option>11. Sinif</option><option>12. Sinif</option></select></div>
<div><label className='block text-sm font-medium text-gray-700 mb-1'>GPA</label><input type='number' value={gpa} onChange={e=>setGpa(e.target.value)} placeholder='85' className='w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none' /></div>
<div><label className='block text-sm font-medium text-gray-700 mb-1'>Hedef universite</label><input type='text' value={university} onChange={e=>setUniversity(e.target.value)} placeholder='Imperial College, MIT...' className='w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none' /></div>
<div><label className='block text-sm font-medium text-gray-700 mb-1'>Hedef bolum</label><input type='text' value={department} onChange={e=>setDepartment(e.target.value)} placeholder='Computer Science...' className='w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none' /></div>
<button onClick={analyze} disabled={loading} className='w-full bg-green-500 text-white py-3 rounded-xl font-medium text-sm mt-2'>{loading ? 'AI analiz ediyor...' : 'Yol haritami olustur'}</button>
</div>
{result && <div className='mt-6 bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-wrap'>{result}</div>}
</div>
</main>
)
}
