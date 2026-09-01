import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-900 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">N</span>
          </div>
          <span className="font-semibold text-indigo-900 text-lg">NetEdu</span>
        </Link>
        <div className="flex items-center gap-4">
          <a href="/pricing" className="text-sm text-gray-500 hover:text-gray-800">Pricing</a>
          <a href="/auth" className="text-sm text-gray-500 hover:text-gray-800">Login</a>
          <a href="/auth" className="text-sm bg-gray-900 text-white px-5 py-2 rounded-full hover:bg-gray-700 font-medium">Get started</a>
        </div>
      </nav>

      <section className="flex flex-col items-center justify-center text-center px-6 py-28 bg-gradient-to-b from-white to-gray-50">
        <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 text-xs font-medium px-4 py-1.5 rounded-full mb-8 border border-gray-200">
          🎓 Personalized university guidance platform
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 max-w-4xl leading-tight tracking-tight">
          Get into your<br />
          <span className="text-indigo-900">dream university.</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl leading-relaxed">
          One platform for the whole journey. Expert guidance and smart technology build your personalized roadmap — so you know exactly what to do, every single day.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a href="/auth" className="bg-gray-900 text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-700 text-sm shadow-lg">
            Start for free →
          </a>
          <a href="#how" className="border border-gray-200 text-gray-600 px-8 py-4 rounded-full font-medium hover:bg-gray-50 text-sm">
            How it works
          </a>
        </div>
        <p className="text-xs text-gray-400 mt-6">No credit card required · Free to start</p>
      </section>

      <section className="px-6 py-12 border-y border-gray-100">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Week by week</div>
            <div className="text-sm text-gray-500">roadmap from today to your application</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Official criteria</div>
            <div className="text-sm text-gray-500">IB subjects marked against their own rubric</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">100%</div>
            <div className="text-sm text-gray-500">personalized to you</div>
          </div>
        </div>
      </section>

      <section id="how" className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">How it works</h2>
          <p className="text-center text-gray-500 mb-16 text-sm">Three simple steps to your dream university</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4"><span className="text-2xl">📋</span></div>
              <div className="text-xs font-semibold text-green-600 mb-2 uppercase tracking-wide">Step 1</div>
              <h3 className="font-semibold text-gray-800 mb-2 text-lg">Build your profile</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Enter your grade, GPA, activities and target universities. Takes 2 minutes.</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4"><span className="text-2xl">🗺</span></div>
              <div className="text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wide">Step 2</div>
              <h3 className="font-semibold text-gray-800 mb-2 text-lg">Get your roadmap</h3>
              <p className="text-sm text-gray-500 leading-relaxed">We analyze your profile and build a week-by-week action plan tailored to your goals.</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4"><span className="text-2xl">🎓</span></div>
              <div className="text-xs font-semibold text-purple-600 mb-2 uppercase tracking-wide">Step 3</div>
              <h3 className="font-semibold text-gray-800 mb-2 text-lg">Get accepted</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Follow your plan, build your portfolio and apply to your matched universities with confidence.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Everything you need</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-indigo-200 transition-colors">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-4"><span className="text-xl">🗺</span></div>
              <h3 className="font-semibold text-gray-800 mb-2">Personal Roadmap</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Week-by-week plan tailored to your goals, grade and target universities.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-indigo-200 transition-colors">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-4"><span className="text-xl">🎯</span></div>
              <h3 className="font-semibold text-gray-800 mb-2">University Matching</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Find your Reach, Match and Safety schools with estimated acceptance rates.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-indigo-200 transition-colors">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-4"><span className="text-xl">📁</span></div>
              <h3 className="font-semibold text-gray-800 mb-2">Digital Portfolio</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Track your certificates, projects and activities. Build your Academic Identity Score.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-indigo-200 transition-colors">
              <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center mb-4"><span className="text-xl">🎓</span></div>
              <h3 className="font-semibold text-gray-800 mb-2">Alumni Corner</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Connect with students who got accepted to your dream schools.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-indigo-200 transition-colors">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center mb-4"><span className="text-xl">🌍</span></div>
              <h3 className="font-semibold text-gray-800 mb-2">CAS Activities</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Discover volunteer and extracurricular opportunities — and team up with other students to run projects together.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-indigo-200 transition-colors">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mb-4"><span className="text-xl">🎯</span></div>
              <h3 className="font-semibold text-gray-800 mb-2">Coach Corner</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Your coursework marked against your subject&apos;s own IB criteria — not a generic essay checker.</p>
              <p className="text-xs text-gray-400 mt-2">IA Checker · Topic Finder · Oral exam prep · Interview practice</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 bg-gray-900">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-gray-400 mb-10 text-base leading-relaxed">Join students who are already building their path to top universities.</p>
          <a href="/auth" className="inline-block bg-green-500 text-white font-bold px-10 py-4 rounded-full hover:bg-green-600 text-sm shadow-lg">
            Create your free account →
          </a>
        </div>
      </section>

      <footer className="px-8 py-8 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-indigo-900 rounded-md flex items-center justify-center">
            <span className="text-white text-xs font-bold">N</span>
          </div>
          <span className="font-semibold text-indigo-900">NetEdu</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="/pricing" className="text-xs text-gray-400 hover:text-gray-600">Pricing</a>
          <span className="text-xs text-gray-400">© 2026 NetEdu. All rights reserved.</span>
        </div>
      </footer>
    </main>
  )
}