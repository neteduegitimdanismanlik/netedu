export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">N</span>
          </div>
          <span className="font-semibold text-gray-800">Net<span className="text-green-500">Edu</span></span>
        </div>
        <div className="flex items-center gap-4">
          <a href="/auth" className="text-sm text-gray-500 hover:text-gray-800">Giriş yap</a>
          <a href="/auth" className="text-sm bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Başla</a>
        </div>
      </nav>
      <section className="flex flex-col items-center justify-center text-center px-6 py-24">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 max-w-3xl leading-tight">
          Bugün ne yapmalısın ki<br />
          <span className="text-green-500">3 yıl sonra</span> hayalindeki<br />
          üniversiteye giresin?
        </h1>
        <p className="text-lg text-gray-500 mb-10 max-w-xl">
          NetEdu, profilini analiz eder, sana özel yol haritası çizer ve her gün ne yapman gerektiğini söyler.
        </p>
        <a href="/auth" className="bg-green-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-green-600 text-sm">
          Ücretsiz başla →
        </a>
      </section>
    </main>
  )
}