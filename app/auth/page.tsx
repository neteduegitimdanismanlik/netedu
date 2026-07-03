'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  async function handleSubmit() {
    setLoading(true)
    setMessage('')
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage(error.message)
      else window.location.href = '/dashboard'
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setMessage(error.message)
      else setMessage('Verification email sent!')
    }
    setLoading(false)
  }
  return (
    <main className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
      <div className='bg-white rounded-2xl border border-gray-100 p-8 w-full max-w-md'>
        <div className='flex items-center gap-2 mb-8'>
          <div className='w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center'>
            <span className='text-white text-sm font-bold'>N</span>
          </div>
          <span className='font-semibold text-gray-800'>Net<span className='text-green-500'>Edu</span></span>
        </div>
        <h1 className='text-2xl font-bold text-gray-900 mb-2'>{isLogin ? 'Welcome back' : 'Create account'}</h1>
        <p className='text-sm text-gray-500 mb-8'>{isLogin ? 'Continue your journey.' : 'Start your university journey.'}</p>
        <div className='flex flex-col gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
            <input type='email' value={email} onChange={e=>setEmail(e.target.value)} placeholder='your@email.com' className='w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-500' />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Password</label>
            <input type='password' value={password} onChange={e=>setPassword(e.target.value)} placeholder='At least 6 characters' className='w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-500' />
          </div>
          {message && <div className='text-sm px-4 py-3 rounded-xl bg-green-50 text-green-700'>{message}</div>}
          <button onClick={handleSubmit} disabled={loading} className='w-full bg-green-500 text-white py-3 rounded-xl font-medium hover:bg-green-600 disabled:opacity-50 text-sm'>
            {loading ? 'Loading...' : isLogin ? 'Login' : 'Create account'}
          </button>
          <button onClick={()=>setIsLogin(!isLogin)} className='text-sm text-gray-500 hover:text-gray-800 text-center'>
            {isLogin ? 'No account? Sign up' : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </main>
  )
}
