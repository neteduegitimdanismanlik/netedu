export default function Home() {
  return (
    <main className='min-h-screen bg-white'>
      <nav className='flex items-center justify-between px-8 py-4 border-b border-gray-100'>
        <span className='font-semibold text-gray-800'>NetEdu</span>
        <a href='/auth' className='text-sm bg-green-500 text-white px-4 py-2 rounded-lg'>Basla</a>
      </nav>
      <section className='flex flex-col items-center text-center px-6 py-24'>
        <h1 className='text-4xl font-bold text-gray-900 mb-6'>Hayalindeki universiteden kabul al</h1>
        <a href='/auth' className='bg-green-500 text-white px-8 py-3 rounded-xl text-sm'>Ucretsiz basla</a>
      </section>
    </main>
  )
}
