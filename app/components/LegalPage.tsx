'use client'
import Link from 'next/link'
import { useLang, LangSwitch } from './useLang'
import { LEGAL, type Lang, type LegalDocument } from '@/lib/legal/types'
import { NOTICE_VERSION } from '@/lib/consent-shared'

const LABELS: Record<Lang, { version: string; effective: string; other: string; privacy: string; terms: string }> = {
  tr: { version: 'Sürüm', effective: 'Yürürlük', other: 'Diğer metin:', privacy: 'Aydınlatma Metni', terms: 'Kullanım Koşulları' },
  en: { version: 'Version', effective: 'Effective', other: 'See also:', privacy: 'Privacy Notice', terms: 'Terms of Use' },
}

export default function LegalPage({
  docs,
  kind,
}: {
  docs: Record<Lang, LegalDocument>
  kind: 'privacy' | 'terms'
}) {
  const [lang, setLang] = useLang()
  const doc = docs[lang]
  const t = LABELS[lang]

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-900 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">N</span>
          </div>
          <span className="font-semibold text-indigo-900 text-base">NetEdu</span>
        </Link>
        <LangSwitch lang={lang} onChange={setLang} />
      </nav>

      <article lang={lang} className="max-w-2xl mx-auto px-4 py-12 text-gray-800">
        <h1 className="text-3xl font-bold text-gray-900">{doc.title}</h1>
        <p className="mt-2 text-xs text-gray-500">
          {t.version} {NOTICE_VERSION}. {t.effective}: {LEGAL.effectiveDate}
        </p>
        {doc.intro && <p className="mt-6 leading-relaxed">{doc.intro}</p>}

        {doc.sections.map((s) => (
          <section key={s.title} className="mt-10">
            <h2 className="text-lg font-semibold text-indigo-900">{s.title}</h2>
            <div className="mt-3 space-y-3 leading-relaxed">
              {renderBody(s.body)}
            </div>
          </section>
        ))}

        <p className="mt-12 border-t border-gray-200 pt-6 text-sm text-gray-500">
          {t.other}{' '}
          <Link href={kind === 'privacy' ? '/terms' : '/privacy'} className="text-indigo-700 underline">
            {kind === 'privacy' ? t.terms : t.privacy}
          </Link>
        </p>
      </article>
    </main>
  )
}

/** Consecutive "• " paragraphs become one list. */
function renderBody(body: string[]) {
  const out: React.ReactNode[] = []
  let list: string[] = []
  const flush = () => {
    if (list.length) {
      out.push(
        <ul key={`ul-${out.length}`} className="list-disc pl-5 space-y-2">
          {list.map((li, i) => <li key={i}>{li}</li>)}
        </ul>
      )
      list = []
    }
  }
  body.forEach((p, i) => {
    if (p.startsWith('• ')) list.push(p.slice(2))
    else {
      flush()
      out.push(<p key={`p-${i}`}>{p}</p>)
    }
  })
  flush()
  return out
}
