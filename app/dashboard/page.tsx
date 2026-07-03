'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) window.location.href = '/auth'
      else setUser(data.user)
    })
  }, [])
  async function signOut() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }
  if (!user) return <div className='min-h-screen flex items-center justify-center'><p className='text-gray-400'>Loading...</p></div>
  return (
    <main className='min-h-screen bg-gray-50'>
      <nav className='bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className='w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center'><span className='text-white text-sm font-bold'>N</span></div>
          <span className='font-semibold text-gray-800'>Net<span className='text-green-500'>Edu</span></span>
        </div>
        <div className='flex items-center gap-4'>
          <span className='text-xs text-gray-400 hidden sm:block'>{user?.email}</span>
          <button onClick={signOut} className='text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50'>Sign out</button>
        </div>
      </nav>
      <div className='max-w-5xl mx-auto px-6 py-8'>
        <div className='mb-8'>
          <h1 className='text-2xl font-bold text-gray-900 mb-1'>Welcome back! 👋</h1>
          <p className='text-sm text-gray-500'>Complete your profile to get your AI roadmap.</p>
        </div>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
          <div className='bg-white rounded-2xl border border-gray-100 p-4 text-center'><div className='text-2xl font-bold text-gray-300 mb-1'>0</div><div className='text-xs text-gray-400'>Academic</div><div className='mt-2 h-1.5 bg-gray-100 rounded-full'></div></div>
          <div className='bg-white rounded-2xl border border-gray-100 p-4 text-center'><div className='text-2xl font-bold text-gray-300 mb-1'>0</div><div className='text-xs text-gray-400'>Activities</div><div className='mt-2 h-1.5 bg-gray-100 rounded-full'></div></div>
          <div className='bg-white rounded-2xl border border-gray-100 p-4 text-center'><div className='text-2xl font-bold text-gray-300 mb-1'>0</div><div className='text-xs text-gray-400'>Projects</div><div className='mt-2 h-1.5 bg-gray-100 rounded-full'></div></div>
          <div className='bg-white rounded-2xl border border-gray-100 p-4 text-center'><div className='text-2xl font-bold text-gray-300 mb-1'>0</div><div className='text-xs text-gray-400'>Leadership</div><div className='mt-2 h-1.5 bg-gray-100 rounded-full'></div></div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='md:col-span-2 bg-white rounded-2xl border border-gray-100 p-6'>
            <h2 className='font-semibold text-gray-800 mb-4'>This week tasks</h2>
            <div className='flex flex-col items-center justify-center py-12 text-center'>
              <div className='text-4xl mb-3'>🗺</div>
              <p className='text-sm text-gray-500 mb-4'>No tasks yet. Complete your profile to get started!</p>
              <a href='/onboarding' className='bg-green-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-green-600'>Complete profile →</a>
            </div>
          </div>
          <div className='bg-white rounded-2xl border border-gray-100 p-6'>
            <h2 className='font-semibold text-gray-800 mb-4'>University matches</h2>
            <div className='flex flex-col items-center justify-center py-8 text-center'>
              <div className='text-4xl mb-3'>🎓</div>
              <p className='text-sm text-gray-500 mb-4'>Enter your profile to see matches.</p>
              <a href='/onboarding' className='text-green-600 text-sm font-medium hover:underline'>Get started →</a>
            </div>
          </div>
        </div>
        <div className='mt-6 bg-green-50 border border-green-200 rounded-2xl p-6 flex items-center justify-between'>
          <div>
            <h3 className='font-semibold text-green-800 mb-1'>Complete your profile</h3>
            <p className='text-sm text-green-600'>Enter your GPA, target university and activities — let AI build your plan.</p>
          </div>
          <a href='/onboarding' className='bg-green-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-green-600 whitespace-nowrap ml-4'>Start now →</a>
        </div>
      </div>
    </main>
  )
}
