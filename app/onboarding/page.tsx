export default function Onboarding() {
  return (
    <main className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
      <div className='bg-white rounded-2xl border border-gray-100 p-8 w-full max-w-lg'>
        <h1 className='text-2xl font-bold text-gray-900 mb-2'>Profilini oluştur</h1>
        <p className='text-sm text-gray-500 mb-6'>Bilgilerini gir, AI sana özel yol haritası çıkarsın.</p>
        <div className='flex flex-col gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Sinif</label>
            <select className='w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none'>
              <option>9. Sinif</option>
              <option>10. Sinif</option>
              <option>11. Sinif</option>
              <option>12. Sinif</option>
            </select>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>GPA (100 uzerinden)</label>
            <input type='number' placeholder='85' className='w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none' />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Hedef universite</label>
            <input type='text' placeholder='Imperial College, MIT...' className='w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none' />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Hedef bolum</label>
            <input type='text' placeholder='Computer Science, Tip...' className='w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none' />
          </div>
          <a href='/dashboard' className='w-full bg-green-500 text-white py-3 rounded-xl font-medium text-sm text-center mt-2'>Devam et</a>
        </div>
      </div>
    </main>
  )
}
