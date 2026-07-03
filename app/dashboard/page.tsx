export default function Dashboard() {
  return (
    <main className='min-h-screen bg-gray-50'>
      <nav className='bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between'>
        <span className='font-semibold text-gray-800'>NetEdu</span>
        <a href='/' className='text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg'>Cikis</a>
      </nav>
      <div className='max-w-5xl mx-auto px-6 py-8'>
        <h1 className='text-2xl font-bold text-gray-900 mb-2'>Hosgeldin!</h1>
        <p className='text-sm text-gray-500 mb-8'>Yolculuguna baslamak icin profilini tamamla.</p>
        <div className='bg-green-50 border border-green-200 rounded-2xl p-6'>
          <h3 className='font-semibold text-green-800 mb-1'>Profilini tamamla</h3>
          <p className='text-sm text-green-600 mb-4'>GPA, hedef universite ve aktivitelerini gir.</p>
          <a href='/onboarding' className='bg-green-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium'>Simdi basla</a>
        </div>
      </div>
    </main>
  )
}
