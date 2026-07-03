export default function Home() {
  return (
    <main className='min-h-screen bg-white'>
      <nav className='flex items-center justify-between px-8 py-4 border-b border-gray-100'>
        <div className='flex items-center gap-2'>
          <div className='w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center'>
            <span className='text-white text-sm font-bold'>N</span>
          </div>
          <span className='font-semibold text-gray-800'>Net<span className='text-green-500'>Edu</span></span>
        </div>
        <div className='flex items-center gap-4'>
          <a href='/auth' className='text-sm text-gray-500 hover:text-gray-800'>Login</a>
          <a href='/auth' className='text-sm bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600'>Get Started</a>
        </div>
      </nav>
      <section className='flex flex-col items-center justify-center text-center px-6 py-24'>
        <div className='inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-medium px-3 py-1 rounded-full mb-6 border border-green-200'>
          🎓 Your journey to a top university starts here
        </div>
        <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-6 max-w-3xl leading-tight'>
          What should you do today<br />
          to get into your <span className='text-green-500'>dream university</span><br />
          in 3 years?
        </h1>
        <p className='text-lg text-gray-500 mb-10 max-w-xl'>
          NetEdu analyzes your profile, builds your personal roadmap, and tells you exactly what to do every day.
        </p>
        <div className='flex flex-col sm:flex-row gap-3'>
          <a href='/auth' className='bg-green-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-green-600 text-sm'>Start for free →</a>
          <a href='#how' className='border border-gray-200 text-gray-600 px-8 py-3 rounded-xl font-medium hover:bg-gray-50 text-sm'>How it works</a>
        </div>
      </section>
      <section id='how' className='px-6 py-16 bg-gray-50'>
        <div className='max-w-5xl mx-auto'>
          <h2 className='text-2xl font-bold text-center text-gray-900 mb-12'>Why NetEdu?</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='bg-white rounded-2xl p-6 border border-gray-100'>
              <div className='w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-4'><span className='text-xl'>🗺</span></div>
              <h3 className='font-semibold text-gray-800 mb-2'>Personal Roadmap</h3>
              <p className='text-sm text-gray-500 leading-relaxed'>1-month, 1-year, 3-year plans based on your goals. Know exactly what to do each week.</p>
            </div>
            <div className='bg-white rounded-2xl p-6 border border-gray-100'>
              <div className='w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-4'><span className='text-xl'>🎓</span></div>
              <h3 className='font-semibold text-gray-800 mb-2'>University Matching</h3>
              <p className='text-sm text-gray-500 leading-relaxed'>Get your Reach, Match and Safety universities with estimated acceptance rates.</p>
            </div>
            <div className='bg-white rounded-2xl p-6 border border-gray-100'>
              <div className='w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-4'><span className='text-xl'>📁</span></div>
              <h3 className='font-semibold text-gray-800 mb-2'>Digital Portfolio</h3>
              <p className='text-sm text-gray-500 leading-relaxed'>Collect your certificates, projects and activities in one place. AI scores and improves them.</p>
            </div>
          </div>
        </div>
      </section>
      <section className='px-6 py-16 bg-green-500'>
        <div className='max-w-2xl mx-auto text-center'>
          <h2 className='text-2xl font-bold text-white mb-4'>Start your journey today</h2>
          <p className='text-green-100 mb-8 text-sm'>Create your free profile, see 3 university matches, get your 1-month plan.</p>
          <a href='/auth' className='inline-block bg-white text-green-600 font-semibold px-8 py-3 rounded-xl hover:bg-green-50 text-sm'>Start for free →</a>
        </div>
      </section>
      <footer className='px-8 py-6 border-t border-gray-100 flex items-center justify-between'>
        <span className='font-semibold text-gray-800'>Net<span className='text-green-500'>Edu</span></span>
        <span className='text-xs text-gray-400'>© 2026 NetEdu. All rights reserved.</span>
      </footer>
    </main>
  )
}
